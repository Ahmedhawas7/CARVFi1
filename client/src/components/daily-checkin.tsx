import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Flame, Loader2, Sparkles } from "lucide-react";
import { createDailyCheckInTransaction } from "@/lib/wallet";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DailyCheckInProps {
  walletAddress: string;
  currentStreak: number;
}

export default function DailyCheckIn({ walletAddress, currentStreak }: DailyCheckInProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if already checked in today
  const { data: todayCheckIn } = useQuery({
    queryKey: ['/api/checkin/today', walletAddress],
  });

  const hasCheckedInToday = !!todayCheckIn;

  // Check-in mutation
  const checkInMutation = useMutation<import("@/lib/types").CheckInResponse, Error>({
    mutationFn: async () => {
      setIsProcessing(true);

      // Step 1: Create blockchain transaction
      const txResult = await createDailyCheckInTransaction(walletAddress);

      if (!txResult.success) {
        throw new Error(txResult.error || 'Transaction failed');
      }

      // Step 2: Record check-in with transaction signature
      return await apiRequest('POST', '/api/checkin', {
        walletAddress,
        transactionSignature: txResult.signature,
      }) as Promise<import("@/lib/types").CheckInResponse>;
    },
    onSuccess: (data) => {
      toast({
        title: "Successfully checked in! 🎉",
        description: `You earned ${data.pointsEarned} points. Your streak: ${data.streakDay} days`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/checkin/today'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      setIsProcessing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Check-in failed",
        description: error.message || "An error occurred during check-in",
        variant: "destructive",
      });
      setIsProcessing(false);
    },
  });

  const handleCheckIn = () => {
    checkInMutation.mutate();
  };

  return (
    <Card className="bg-card border-border shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Calendar className="h-5 w-5 text-primary" />
          Daily Check-in
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Check in daily to earn points and maintain your streak
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Streak Display */}
        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-primary mb-1">Current Streak</div>
              <div className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Flame className="h-8 w-8 text-orange-500" />
                {currentStreak} days
              </div>
            </div>
            <Badge
              variant={hasCheckedInToday ? "default" : "outline"}
              className={hasCheckedInToday ? "bg-green-500 text-white" : "bg-accent text-foreground border-primary/30"}
            >
              {hasCheckedInToday ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Done Today
                </>
              ) : (
                "Not Done"
              )}
            </Badge>
          </div>
        </div>

        {/* Check-in Button */}
        <Button
          onClick={handleCheckIn}
          disabled={hasCheckedInToday || isProcessing}
          className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-600 shadow-lg shadow-primary/50"
          data-testid="button-daily-checkin"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : hasCheckedInToday ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Checked In Today
            </>
          ) : (
            <>
              <Calendar className="h-4 w-4 mr-2" />
              Check In (+10 Points)
            </>
          )}
        </Button>

        {!hasCheckedInToday && (
          <p className="text-xs text-center text-muted-foreground">
            A simple transaction will be created on the CARV SVM network to record your check-in.
          </p>
        )}

        {/* Streak Calendar (Last 7 Days) */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Last 7 Days</h4>
          <div className="grid grid-cols-7 gap-1">
            {[...Array(7)].map((_, i) => {
              const dayStreak = currentStreak - (6 - i);
              const isCompleted = dayStreak > 0;
              const isToday = i === 6;

              return (
                <div
                  key={i}
                  className={`aspect-square rounded flex items-center justify-center text-xs ${
                    isCompleted
                      ? isToday && hasCheckedInToday
                        ? 'bg-primary text-primary-foreground font-bold'
                        : 'bg-primary/70 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>

        {/* Reward Info */}
        <div className="p-3 bg-muted/50 rounded-lg text-xs border border-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-muted-foreground">Daily Reward</span>
            <span className="font-bold text-primary">10 Points</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Streak Bonus</span>
            <span className="font-bold text-orange-500">
              {currentStreak > 0 ? `+${currentStreak * 2} extra points` : '0'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}