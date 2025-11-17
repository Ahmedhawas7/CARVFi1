import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table with wallet integration
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull().unique(),
  username: text("username"),
  email: text("email"),
  avatarUrl: text("avatar_url"),
  twitterHandle: text("twitter_handle"),
  twitterId: text("twitter_id"),
  totalPoints: integer("total_points").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastLoginDate: timestamp("last_login_date"),
  level: integer("level").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Daily check-ins with blockchain transactions
export const dailyCheckIns = pgTable("daily_check_ins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  checkInDate: timestamp("check_in_date").notNull().defaultNow(),
  transactionSignature: text("transaction_signature").notNull(),
  pointsEarned: integer("points_earned").notNull().default(10),
  streakDay: integer("streak_day").notNull(),
});

// Twitter activities tracking
export const twitterActivities = pgTable("twitter_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  tweetId: text("tweet_id").notNull().unique(),
  tweetText: text("tweet_text"),
  activityType: text("activity_type").notNull(), // 'hashtag', 'mention', 'promotion'
  hashtags: text("hashtags").array(),
  partnerProject: text("partner_project"),
  pointsEarned: integer("points_earned").notNull().default(0),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Chat interactions with AI bot
export const chatInteractions = pgTable("chat_interactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  messageCount: integer("message_count").notNull().default(0),
  date: timestamp("date").notNull().defaultNow(),
  pointsEarned: integer("points_earned").notNull().default(0),
  dailyLimit: integer("daily_limit").notNull().default(20),
  messagesRemaining: integer("messages_remaining").notNull().default(20),
});

// Chat messages for history
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Points transactions log
export const pointsTransactions = pgTable("points_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(),
  type: text("type").notNull(), // 'daily_login', 'twitter', 'chat', 'bonus'
  description: text("description").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Partner projects for promotions
export const partnerProjects = pgTable("partner_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  hashtags: text("hashtags").array().notNull(),
  pointsPerTweet: integer("points_per_tweet").notNull().default(50),
  active: boolean("active").notNull().default(true),
  description: text("description"),
  logoUrl: text("logo_url"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  walletAddress: true,
  username: true,
  twitterHandle: true,
  twitterId: true,
});

export const insertDailyCheckInSchema = createInsertSchema(dailyCheckIns).pick({
  userId: true,
  transactionSignature: true,
  streakDay: true,
});

export const insertTwitterActivitySchema = createInsertSchema(twitterActivities).pick({
  userId: true,
  tweetId: true,
  tweetText: true,
  activityType: true,
  hashtags: true,
  partnerProject: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  userId: true,
  role: true,
  content: true,
});

export const insertPartnerProjectSchema = createInsertSchema(partnerProjects).pick({
  name: true,
  hashtags: true,
  pointsPerTweet: true,
  description: true,
  logoUrl: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type DailyCheckIn = typeof dailyCheckIns.$inferSelect;
export type InsertDailyCheckIn = z.infer<typeof insertDailyCheckInSchema>;
export type TwitterActivity = typeof twitterActivities.$inferSelect;
export type InsertTwitterActivity = z.infer<typeof insertTwitterActivitySchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatInteraction = typeof chatInteractions.$inferSelect;
export type PointsTransaction = typeof pointsTransactions.$inferSelect;
export type PartnerProject = typeof partnerProjects.$inferSelect;
export type InsertPartnerProject = z.infer<typeof insertPartnerProjectSchema>;
