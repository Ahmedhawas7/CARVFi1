import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import { z } from "zod";
import { insertUserSchema, insertDailyCheckInSchema, insertChatMessageSchema, insertTwitterActivitySchema } from "@shared/schema";

// Initialize OpenAI client
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Validation schemas
const walletAddressSchema = z.string().min(32).max(64);
const checkInSchema = z.object({
  walletAddress: z.string().min(32).max(64),
  transactionSignature: z.string().min(1),
});
const chatMessageSchema = z.object({
  userId: z.string().uuid().optional(),
  message: z.string().min(1).max(500),
  walletAddress: z.string().min(32).max(64),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // User endpoints
  app.get("/api/user/:walletAddress", async (req, res) => {
    try {
      const validation = walletAddressSchema.safeParse(req.params.walletAddress);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid wallet address" });
      }
      
      const walletAddress = validation.data;
      let user = await storage.getUserByWallet(walletAddress);
      
      if (!user) {
        // Create new user if doesn't exist
        user = await storage.createUser({ walletAddress });
      }
      
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Daily check-in endpoints
  app.get("/api/checkin/today/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const user = await storage.getUserByWallet(walletAddress);
      
      if (!user) {
        return res.json(null);
      }
      
      const today = new Date();
      const checkIn = await storage.getDailyCheckIn(user.id, today);
      res.json(checkIn || null);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/checkin", async (req, res) => {
    try {
      const validation = checkInSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid request body", details: validation.error });
      }
      
      const { walletAddress, transactionSignature } = validation.data;
      
      let user = await storage.getUserByWallet(walletAddress);
      if (!user) {
        user = await storage.createUser({ walletAddress });
      }

      // Check if already checked in today
      const today = new Date();
      const existingCheckIn = await storage.getDailyCheckIn(user.id, today);
      if (existingCheckIn) {
        return res.status(400).json({ error: "Already checked in today" });
      }

      // Calculate streak
      let newStreak = 1;
      if (user.lastLoginDate) {
        const lastLogin = new Date(user.lastLoginDate);
        const daysDiff = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          // Consecutive day
          newStreak = user.currentStreak + 1;
        } else if (daysDiff > 1) {
          // Streak broken
          newStreak = 1;
        }
      }

      // Create check-in
      const checkIn = await storage.createDailyCheckIn({
        userId: user.id,
        transactionSignature,
        streakDay: newStreak,
      });

      // Update user points and streak
      await storage.updateUserPoints(user.id, checkIn.pointsEarned);
      await storage.updateUserStreak(user.id, newStreak, today);

      // Create points transaction
      await storage.createPointsTransaction(
        user.id,
        checkIn.pointsEarned,
        "daily_login",
        `Daily check-in (Day ${newStreak})`,
        { transactionSignature }
      );

      res.json({
        checkIn,
        pointsEarned: checkIn.pointsEarned,
        streakDay: newStreak,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Chat endpoints
  app.get("/api/chat/stats/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const today = new Date();
      const interaction = await storage.getChatInteraction(userId, today);
      
      res.json({
        messageCount: interaction?.messageCount || 0,
        messagesRemaining: interaction?.messagesRemaining || 20,
        pointsEarned: interaction?.pointsEarned || 0,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/chat/message", async (req, res) => {
    try {
      const validation = chatMessageSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid request body", details: validation.error });
      }
      
      const { userId, message, walletAddress } = validation.data;
      
      let user = await storage.getUserByWallet(walletAddress);
      if (!user) {
        user = await storage.createUser({ walletAddress });
      }

      // Check daily limit
      const today = new Date();
      const interaction = await storage.getChatInteraction(user.id, today);
      
      if (interaction && interaction.messageCount >= interaction.dailyLimit) {
        return res.status(400).json({ error: "Daily message limit reached" });
      }

      // Save user message
      await storage.createChatMessage({
        userId: user.id,
        role: "user",
        content: message,
      });

      // Get AI response - using simple pattern matching for MVP
      let aiResponse = "مرحباً! أنا هنا لمساعدتك. ";
      
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('نقاط') || lowerMessage.includes('points')) {
        aiResponse += "يمكنك كسب النقاط من خلال:\n• تسجيل الدخول اليومي (+10 نقطة)\n• المحادثة معي (+2 نقطة/رسالة)\n• التغريد بالهاشتاجات المطلوبة (+50 نقطة)";
      } else if (lowerMessage.includes('كيف') || lowerMessage.includes('how')) {
        aiResponse += "المنصة تعمل بنظام النقاط:\n1. قم بربط محفظتك\n2. سجل دخول يومياً\n3. أكمل المهام\n4. اربح النقاط والمكافآت";
      } else if (lowerMessage.includes('مساعدة') || lowerMessage.includes('help')) {
        aiResponse += "يمكنني مساعدتك في:\n• شرح كيفية كسب النقاط\n• معلومات عن المهام اليومية\n• التعريف بالمنصة\nما الذي تريد معرفته؟";
      } else if (lowerMessage.includes('تويتر') || lowerMessage.includes('twitter')) {
        aiResponse += "للربح من تويتر:\n1. قم بربط حساب تويتر\n2. غرد بالهاشتاجات المطلوبة\n3. اضغط على التحقق\n4. اربح 50 نقطة لكل تغريدة!";
      } else {
        aiResponse += "أنا مساعدك الذكي في CARVFi. يمكنك سؤالي عن:\n• كيفية كسب النقاط\n• المهام المتاحة\n• نظام المكافآت\nكيف يمكنني مساعدتك اليوم؟";
      }

      // Save AI response
      await storage.createChatMessage({
        userId: user.id,
        role: "assistant",
        content: aiResponse,
      });

      // Update chat interaction
      const updatedInteraction = await storage.createOrUpdateChatInteraction(user.id);

      // Award points (2 points per message)
      const pointsEarned = 2;
      await storage.updateUserPoints(user.id, pointsEarned);
      await storage.createPointsTransaction(
        user.id,
        pointsEarned,
        "chat",
        "Chat message",
        { messageCount: updatedInteraction.messageCount }
      );

      res.json({
        response: aiResponse,
        pointsEarned,
        messagesRemaining: updatedInteraction.messagesRemaining,
      });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Twitter endpoints
  app.get("/api/twitter/projects", async (req, res) => {
    try {
      const projects = await storage.getPartnerProjects();
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/twitter/activities/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const activities = await storage.getTwitterActivities(userId);
      res.json(activities);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/twitter/connect", async (req, res) => {
    try {
      const { userId } = req.body;
      
      // In a real implementation, this would initiate Twitter OAuth flow
      // For MVP, we'll just return success
      res.json({
        success: true,
        message: "Twitter connection initiated (MVP - requires OAuth implementation)"
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/twitter/verify", async (req, res) => {
    try {
      const { userId } = req.body;
      
      // In a real implementation, this would:
      // 1. Use Twitter API to fetch user's recent tweets
      // 2. Check for required hashtags
      // 3. Verify against partner projects
      // 4. Award points accordingly
      
      // For MVP, simulate finding new tweets
      const projects = await storage.getPartnerProjects();
      const newActivities = 0; // Simulate no new activities for now
      const pointsEarned = 0;

      res.json({
        newActivities,
        pointsEarned,
        message: "Twitter verification requires API integration"
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Points transactions endpoint
  app.get("/api/points/transactions/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const transactions = await storage.getPointsTransactions(userId);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Profile update endpoint
  app.post("/api/user/profile/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { username, email } = req.body;
      
      await storage.updateUserProfile(userId, username, email);
      const updatedUser = await storage.getUser(userId);
      
      res.json(updatedUser);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
