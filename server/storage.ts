import { randomUUID } from "crypto";
import type {
  User,
  InsertUser,
  DailyCheckIn,
  InsertDailyCheckIn,
  TwitterActivity,
  InsertTwitterActivity,
  ChatMessage,
  InsertChatMessage,
  ChatInteraction,
  PointsTransaction,
  PartnerProject,
  InsertPartnerProject,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(id: string, points: number): Promise<void>;
  updateUserStreak(id: string, streak: number, lastLoginDate: Date): Promise<void>;
  updateUserProfile(id: string, username?: string, email?: string): Promise<void>;
  
  // Daily Check-ins
  getDailyCheckIn(userId: string, date: Date): Promise<DailyCheckIn | undefined>;
  createDailyCheckIn(checkIn: InsertDailyCheckIn): Promise<DailyCheckIn>;
  
  // Twitter Activities
  getTwitterActivities(userId: string): Promise<TwitterActivity[]>;
  getTwitterActivityByTweetId(tweetId: string): Promise<TwitterActivity | undefined>;
  createTwitterActivity(activity: InsertTwitterActivity): Promise<TwitterActivity>;
  
  // Chat
  getChatInteraction(userId: string, date: Date): Promise<ChatInteraction | undefined>;
  createOrUpdateChatInteraction(userId: string): Promise<ChatInteraction>;
  getChatMessages(userId: string, limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Points Transactions
  createPointsTransaction(userId: string, amount: number, type: string, description: string, metadata?: any): Promise<PointsTransaction>;
  getPointsTransactions(userId: string): Promise<PointsTransaction[]>;
  
  // Partner Projects
  getPartnerProjects(): Promise<PartnerProject[]>;
  createPartnerProject(project: InsertPartnerProject): Promise<PartnerProject>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private dailyCheckIns: Map<string, DailyCheckIn>;
  private twitterActivities: Map<string, TwitterActivity>;
  private chatMessages: Map<string, ChatMessage>;
  private chatInteractions: Map<string, ChatInteraction>;
  private pointsTransactions: Map<string, PointsTransaction>;
  private partnerProjects: Map<string, PartnerProject>;

  constructor() {
    this.users = new Map();
    this.dailyCheckIns = new Map();
    this.twitterActivities = new Map();
    this.chatMessages = new Map();
    this.chatInteractions = new Map();
    this.pointsTransactions = new Map();
    this.partnerProjects = new Map();

    // Initialize with sample partner projects
    this.initializePartnerProjects();
  }

  private generateUniqueUsername(): string {
    let username: string;
    let isUnique = false;
    
    while (!isUnique) {
      const randomNumber = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
      username = `carver_${randomNumber}`;
      
      // Check if username already exists
      isUnique = !Array.from(this.users.values()).some(
        user => user.username === username
      );
    }
    
    return username!;
  }

  private initializePartnerProjects() {
    const projects: InsertPartnerProject[] = [
      {
        name: "CARV Protocol",
        hashtags: ["#CARVProtocol", "#CARVSVM", "#Web3"],
        pointsPerTweet: 50,
        description: "روّج لمنصة CARV وشبكة SVM"
      },
      {
        name: "Crypto DAO",
        hashtags: ["#CryptoDAO", "#Blockchain", "#DeFi"],
        pointsPerTweet: 40,
        description: "شارك محتوى عن منصات DAO"
      }
    ];

    projects.forEach(project => {
      const id = randomUUID();
      this.partnerProjects.set(id, {
        ...project,
        id,
        active: true,
        logoUrl: null,
      });
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === walletAddress
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      username: insertUser.username || this.generateUniqueUsername(),
      twitterHandle: insertUser.twitterHandle || null,
      twitterId: insertUser.twitterId || null,
      totalPoints: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastLoginDate: null,
      level: 1,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserProfile(id: string, username?: string, email?: string): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      // Only allow username change once
      if (username && !user.username?.startsWith('carver_')) {
        // Username already changed before, don't allow again
        return;
      }
      
      if (username) {
        // Check if new username is unique
        const usernameExists = Array.from(this.users.values()).some(
          u => u.username === username && u.id !== id
        );
        if (!usernameExists) {
          user.username = username;
        }
      }
      
      this.users.set(id, user);
    }
  }

  async updateUserPoints(id: string, points: number): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.totalPoints += points;
      user.level = Math.floor(user.totalPoints / 1000) + 1;
      this.users.set(id, user);
    }
  }

  async updateUserStreak(id: string, streak: number, lastLoginDate: Date): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.currentStreak = streak;
      user.longestStreak = Math.max(user.longestStreak, streak);
      user.lastLoginDate = lastLoginDate;
      this.users.set(id, user);
    }
  }

  // Daily Check-ins
  async getDailyCheckIn(userId: string, date: Date): Promise<DailyCheckIn | undefined> {
    const today = new Date(date);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return Array.from(this.dailyCheckIns.values()).find(
      (checkIn) => 
        checkIn.userId === userId && 
        checkIn.checkInDate >= today && 
        checkIn.checkInDate < tomorrow
    );
  }

  async createDailyCheckIn(insertCheckIn: InsertDailyCheckIn): Promise<DailyCheckIn> {
    const id = randomUUID();
    const checkIn: DailyCheckIn = {
      ...insertCheckIn,
      id,
      checkInDate: new Date(),
      pointsEarned: 10 + (insertCheckIn.streakDay * 2), // Base + streak bonus
    };
    this.dailyCheckIns.set(id, checkIn);
    return checkIn;
  }

  // Twitter Activities
  async getTwitterActivities(userId: string): Promise<TwitterActivity[]> {
    return Array.from(this.twitterActivities.values())
      .filter((activity) => activity.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getTwitterActivityByTweetId(tweetId: string): Promise<TwitterActivity | undefined> {
    return Array.from(this.twitterActivities.values()).find(
      (activity) => activity.tweetId === tweetId
    );
  }

  async createTwitterActivity(insertActivity: InsertTwitterActivity): Promise<TwitterActivity> {
    const id = randomUUID();
    const activity: TwitterActivity = {
      ...insertActivity,
      id,
      tweetText: insertActivity.tweetText || null,
      partnerProject: insertActivity.partnerProject || null,
      pointsEarned: 50, // Default points for tweet
      verified: true,
      createdAt: new Date(),
    };
    this.twitterActivities.set(id, activity);
    return activity;
  }

  // Chat
  async getChatInteraction(userId: string, date: Date): Promise<ChatInteraction | undefined> {
    const today = new Date(date);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return Array.from(this.chatInteractions.values()).find(
      (interaction) => 
        interaction.userId === userId && 
        interaction.date >= today && 
        interaction.date < tomorrow
    );
  }

  async createOrUpdateChatInteraction(userId: string): Promise<ChatInteraction> {
    const today = new Date();
    const existing = await this.getChatInteraction(userId, today);

    if (existing) {
      existing.messageCount += 1;
      existing.messagesRemaining = Math.max(0, existing.dailyLimit - existing.messageCount);
      existing.pointsEarned = existing.messageCount * 2; // 2 points per message
      this.chatInteractions.set(existing.id, existing);
      return existing;
    }

    const id = randomUUID();
    const interaction: ChatInteraction = {
      id,
      userId,
      messageCount: 1,
      date: today,
      pointsEarned: 2,
      dailyLimit: 20,
      messagesRemaining: 19,
    };
    this.chatInteractions.set(id, interaction);
    return interaction;
  }

  async getChatMessages(userId: string, limit: number = 50): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter((msg) => msg.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      timestamp: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  // Points Transactions
  async createPointsTransaction(
    userId: string,
    amount: number,
    type: string,
    description: string,
    metadata: any = null
  ): Promise<PointsTransaction> {
    const id = randomUUID();
    const transaction: PointsTransaction = {
      id,
      userId,
      amount,
      type,
      description,
      metadata,
      createdAt: new Date(),
    };
    this.pointsTransactions.set(id, transaction);
    return transaction;
  }

  async getPointsTransactions(userId: string): Promise<PointsTransaction[]> {
    return Array.from(this.pointsTransactions.values())
      .filter((tx) => tx.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Partner Projects
  async getPartnerProjects(): Promise<PartnerProject[]> {
    return Array.from(this.partnerProjects.values()).filter(
      (project) => project.active
    );
  }

  async createPartnerProject(insertProject: InsertPartnerProject): Promise<PartnerProject> {
    const id = randomUUID();
    const project: PartnerProject = {
      ...insertProject,
      id,
      active: true,
      description: insertProject.description || null,
      logoUrl: insertProject.logoUrl || null,
    };
    this.partnerProjects.set(id, project);
    return project;
  }
}

export const storage = new MemStorage();
