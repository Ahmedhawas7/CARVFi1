import { Button } from "@/components/ui/button";
import { Wallet, Zap, Gift, TrendingUp, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Animated Gradient */}
      <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-800/30 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-700/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-6 py-2 mb-8 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-primary-foreground text-sm font-medium">Earn Points. Unlock Rewards.</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-primary via-purple-300 to-blue-400 bg-clip-text text-transparent" data-testid="text-hero-title">
            Earn Points Daily
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-10" data-testid="text-hero-subtitle">
            Twitter • AI Chat • Daily Check-ins
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg"
              onClick={() => setLocation("/dashboard")}
              className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-600 text-primary-foreground min-h-12 text-lg px-10 shadow-lg shadow-primary/50"
              data-testid="button-get-started"
            >
              <Wallet className="mr-2 h-5 w-5" />
              Get Started
            </Button>
          </div>

          {/* Trust Metrics */}
          <div className="flex flex-wrap gap-8 justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">50K+</div>
              <div className="text-sm text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">2M+</div>
              <div className="text-sm text-gray-400">Points Distributed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-gradient-to-b from-black to-purple-950/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white" data-testid="text-features-title">
            How to Earn Points
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Twitter Activity */}
            <div className="text-center p-8 bg-gradient-to-b from-card via-card to-accent/20 rounded-2xl border border-primary/20 hover:border-primary/40 transition-all hover-elevate" data-testid="card-feature-twitter">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/50">
                <TrendingUp className="h-10 w-10 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Twitter Activity</h3>
              <p className="text-muted-foreground mb-6">
                Post tweets with specified hashtags and promote partner projects to earn points
              </p>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">+50 Points</div>
            </div>

            {/* AI Chat */}
            <div className="text-center p-8 bg-gradient-to-b from-card via-card to-accent/20 rounded-2xl border border-primary/20 hover:border-primary/40 transition-all hover-elevate" data-testid="card-feature-chat">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/50">
                <Zap className="h-10 w-10 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">AI Chat</h3>
              <p className="text-muted-foreground mb-6">
                Chat with our AI bot daily and earn points (max 20 messages per day)
              </p>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">+2 Points/msg</div>
            </div>

            {/* Daily Login */}
            <div className="text-center p-8 bg-gradient-to-b from-card via-card to-accent/20 rounded-2xl border border-primary/20 hover:border-primary/40 transition-all hover-elevate" data-testid="card-feature-checkin">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/50">
                <Gift className="h-10 w-10 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Daily Check-in</h3>
              <p className="text-muted-foreground mb-6">
                Check in daily via blockchain transaction to maintain your streak
              </p>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">+10 Points/day</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 bg-gradient-to-b from-purple-950/20 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Connect your BackPack wallet and start collecting points today
          </p>
          <Button 
            size="lg"
            onClick={() => setLocation("/dashboard")}
            className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-600 text-primary-foreground min-h-12 text-lg px-10 shadow-lg shadow-primary/50"
            data-testid="button-cta-start"
          >
            Start for Free
          </Button>
        </div>
      </div>
    </div>
  );
}