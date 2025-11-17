import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Trophy,
  Flame,
  Star,
  Twitter,
  MessageSquare,
  Calendar,
  Wallet,
  TrendingUp,
  CheckCircle,
  Clock,
  Gift,
  User // Added User icon
} from "lucide-react";
import { connectBackPack, disconnectBackPack, isBackPackInstalled, formatAddress } from "@/lib/wallet";
import { useToast } from "@/hooks/use-toast";
import ChatBot from "@/components/chatbot";
import TwitterTasks from "@/components/twitter-tasks";
import DailyCheckIn from "@/components/daily-checkin";
import ProfilePage from "@/components/profile-page"; // Import ProfilePage component

export default function Dashboard() {
  const { toast } = useToast();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showProfile, setShowProfile] = useState(false); // State to control profile page visibility

  // Fetch user data
  const { data: userData, isLoading, error, refetch } = useQuery<import("@/lib/types").User>({
    queryKey: ['/api/user', walletAddress],
    enabled: !!walletAddress,
  });

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    const result = await connectBackPack();

    if (result.success) {
      setWalletAddress(result.publicKey);
      toast({
        title: "Connected Successfully!",
        description: "BackPack wallet connected successfully",
      });
      // Refetch user data after connection
      refetch();
    } else {
      toast({
        title: "Connection Failed",
        description: result.error || "An error occurred while connecting wallet",
        variant: "destructive",
      });
    }
    setIsConnecting(false);
  };

  const handleDisconnect = async () => {
    await disconnectBackPack();
    setWalletAddress("");
    setShowProfile(false); // Hide profile page on disconnect
    toast({
      title: "Disconnected",
      description: "Wallet disconnected successfully",
    });
  };

  // If wallet not connected, show connection screen
  if (!walletAddress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-800/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <Card className="w-full max-w-md mx-4 bg-gradient-to-b from-purple-950/50 to-black/50 border-purple-500/20 backdrop-blur-xl relative z-10">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-900/50">
              <Wallet className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Connect BackPack Wallet</CardTitle>
            <CardDescription className="text-gray-400">
              Start earning points by connecting your wallet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="h-4 w-4 text-purple-400" />
                <span>Fully secure and encrypted</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="h-4 w-4 text-purple-400" />
                <span>Track points and rewards</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="h-4 w-4 text-purple-400" />
                <span>Connected to CARV SVM Testnet</span>
              </div>
            </div>

            {!isBackPackInstalled() ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-400">
                  BackPack wallet not found
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border border-purple-500/20 shadow-lg shadow-purple-900/50"
                  onClick={() => window.open('https://backpack.app/', '_blank')}
                  data-testid="button-install-wallet"
                >
                  Download BackPack
                </Button>
              </div>
            ) : (
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border border-purple-500/20 shadow-lg shadow-purple-900/50"
                onClick={handleConnectWallet}
                disabled={isConnecting}
                data-testid="button-connect-wallet"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}

            <p className="text-xs text-center text-gray-500">
              By connecting, you agree to our Privacy Policy and Terms of Service
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show Profile Page if showProfile is true
  if (showProfile) {
    return (
      <ProfilePage
        walletAddress={walletAddress}
        userData={userData}
        onBack={() => setShowProfile(false)}
        refetchUser={refetch}
      />
    );
  }

  const totalPoints = userData?.totalPoints || 0;
  const currentStreak = userData?.currentStreak || 0;
  const level = userData?.level || 1;
  const nextLevelPoints = level * 1000;
  const progressToNextLevel = (totalPoints % 1000) / 10;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-purple-500/20 bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center shadow-lg shadow-purple-900/50">
              <Star className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-white">CARVFi</span> {/* Changed site name */}
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2 bg-purple-900/50 text-purple-200 border-purple-500/30" data-testid="badge-total-points">
              <Star className="h-4 w-4 mr-1 text-purple-400" />
              {totalPoints.toLocaleString()} Points
            </Badge>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProfile(true)} // Show profile page
                className="border-purple-500/30 text-gray-300 hover:bg-purple-900/30 hover:text-white"
              >
                <User className="h-4 w-4 mr-2" /> {/* User icon */}
                Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className="border-purple-500/30 text-gray-300 hover:bg-purple-900/30 hover:text-white"
                data-testid="button-disconnect-wallet"
              >
                <Wallet className="h-4 w-4 mr-2" />
                {formatAddress(walletAddress)}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-800/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto p-4 md:p-6 max-w-7xl relative z-10">
        {/* Stats Header - 3 Column Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Total Points */}
          <Card className="bg-gradient-to-b from-purple-950/50 to-black/50 border-purple-500/20 backdrop-blur hover:border-purple-500/40 transition-all hover-elevate" data-testid="card-stats-points">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Points</CardTitle>
              <Star className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                {totalPoints.toLocaleString()}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                Level {level}
              </p>
              <Progress value={progressToNextLevel} className="mt-3 h-2 bg-purple-950" />
              <p className="text-xs text-gray-400 mt-1">
                {nextLevelPoints - (totalPoints % 1000)} points to next level
              </p>
            </CardContent>
          </Card>

          {/* Current Streak */}
          <Card className="bg-gradient-to-b from-purple-950/50 to-black/50 border-purple-500/20 backdrop-blur hover:border-purple-500/40 transition-all hover-elevate" data-testid="card-stats-streak">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Current Streak</CardTitle>
              <Flame className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-400">
                {currentStreak} days
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Longest: {userData?.longestStreak || 0} days
              </p>
              <div className="mt-3 flex gap-1">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-8 flex-1 rounded ${
                      i < currentStreak % 7
                        ? 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-900/50'
                        : 'bg-purple-950/50'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rank */}
          <Card className="bg-gradient-to-b from-purple-950/50 to-black/50 border-purple-500/20 backdrop-blur hover:border-purple-500/40 transition-all hover-elevate" data-testid="card-stats-rank">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Your Rank</CardTitle>
              <Trophy className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-400">
                {userData?.rank || '#-'}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Coming soon: Leaderboard
              </p>
              <Badge variant="outline" className="mt-3 border-purple-500/30 text-purple-300">
                {userData?.rankName || 'Beginner'}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - 2 Column Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Tasks */}
          <div className="lg:col-span-1 space-y-6">
            {/* Daily Check-in */}
            <DailyCheckIn
              walletAddress={walletAddress}
              currentStreak={currentStreak}
            />

            {/* Twitter Tasks */}
            <TwitterTasks userId={userData?.id} />
          </div>

          {/* Right Content - Activity Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Activity Feed */}
            <Card className="bg-gradient-to-b from-purple-950/50 to-black/50 border-purple-500/20 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Track your achievements and points
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="text-center py-8 text-gray-400">
                      Loading...
                    </div>
                  ) : userData?.activity && userData.activity.length > 0 ? (
                    userData.activity.map((activityItem, index) => (
                      <div key={index} className="flex items-center justify-between text-gray-300">
                        <div className="flex items-center gap-2">
                          {activityItem.icon === 'gift' && <Gift className="h-5 w-5 text-purple-400" />}
                          {activityItem.icon === 'star' && <Star className="h-5 w-5 text-purple-400" />}
                          {activityItem.icon === 'trophy' && <Trophy className="h-5 w-5 text-purple-400" />}
                          <span>{activityItem.description}</span>
                        </div>
                        <span className="text-purple-400">+{activityItem.points} Points</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Gift className="h-12 w-12 mx-auto mb-2 opacity-50 text-purple-400" />
                      <p>Start completing tasks to see your activity here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-b from-purple-950/50 to-black/50 border-purple-500/20 backdrop-blur hover:border-purple-500/40 transition-all hover-elevate cursor-pointer" onClick={() => setShowChat(true)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/50">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base text-white">AI Chat</CardTitle>
                      <CardDescription className="text-xs text-gray-400">
                        Earn points from conversations
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-purple-900/50 text-purple-300 border-purple-500/30">
                    +2 points/message
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-b from-purple-950/50 to-black/50 border-purple-500/20 backdrop-blur hover:border-purple-500/40 transition-all hover-elevate">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/50">
                      <Twitter className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base text-white">Twitter Activity</CardTitle>
                      <CardDescription className="text-xs text-gray-400">
                        Tweet and earn points
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-purple-900/50 text-purple-300 border-purple-500/30">
                    +50 points/tweet
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* ChatBot Modal */}
      {showChat && (
        <ChatBot
          walletAddress={walletAddress}
          userId={userData?.id}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}