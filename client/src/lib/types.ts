// Shared types for API responses

export interface User {
  id: string;
  walletAddress: string;
  username: string | null;
  email: string | null;
  avatarUrl: string | null;
  twitterHandle: string | null;
  twitterId: string | null;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastLoginDate: Date | null;
  level: number;
  createdAt: Date;
}

export interface ChatStats {
  messageCount: number;
  messagesRemaining: number;
  pointsEarned: number;
}

export interface ChatMessageResponse {
  response: string;
  pointsEarned: number;
  messagesRemaining: number;
}

export interface CheckInResponse {
  checkIn: {
    id: string;
    userId: string;
    checkInDate: Date;
    transactionSignature: string;
    pointsEarned: number;
    streakDay: number;
  };
  pointsEarned: number;
  streakDay: number;
}

export interface PartnerProject {
  id: string;
  name: string;
  hashtags: string[];
  pointsPerTweet: number;
  active: boolean;
  description: string | null;
  logoUrl: string | null;
}

export interface TwitterActivity {
  id: string;
  userId: string;
  tweetId: string;
  tweetText: string | null;
  activityType: string;
  hashtags: string[] | null;
  partnerProject: string | null;
  pointsEarned: number;
  verified: boolean;
  createdAt: Date;
}

export interface VerifyTwitterResponse {
  newActivities: number;
  pointsEarned: number;
  message: string;
}
