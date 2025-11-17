import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Twitter, CheckCircle, ExternalLink, RefreshCw } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TwitterTasksProps {
  userId?: string;
}

export default function TwitterTasks({ userId }: TwitterTasksProps) {
  const { toast } = useToast();

  // Fetch partner projects
  const { data: projects, isLoading } = useQuery<import("@/lib/types").PartnerProject[]>({
    queryKey: ['/api/twitter/projects'],
  });

  // Fetch user's Twitter activities
  const { data: activities } = useQuery<import("@/lib/types").TwitterActivity[]>({
    queryKey: ['/api/twitter/activities', userId],
    enabled: !!userId,
  });

  // Connect Twitter mutation
  const connectTwitterMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/twitter/connect', { userId }) as any;
    },
    onSuccess: () => {
      toast({
        title: "Connected Successfully!",
        description: "Twitter account connected successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/twitter/activities'] });
    },
  });

  // Verify tweets mutation
  const verifyTweetsMutation = useMutation<import("@/lib/types").VerifyTwitterResponse, Error>({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/twitter/verify', { userId }) as Promise<import("@/lib/types").VerifyTwitterResponse>;
    },
    onSuccess: (data) => {
      if (data.newActivities > 0) {
        toast({
          title: "New Points! 🎉",
          description: `Verified ${data.newActivities} new tweets and earned ${data.pointsEarned} points`,
        });
        queryClient.invalidateQueries({ queryKey: ['/api/twitter/activities'] });
        queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      } else {
        toast({
          title: "No New Tweets",
          description: "No new eligible tweets found",
        });
      }
    },
  });

  return (
    <Card className="bg-card border-border shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Twitter className="h-5 w-5 text-primary" />
          Twitter Tasks
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Connect your account and complete tasks to earn points
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Twitter Connection */}
        <div className="p-3 bg-muted/50 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Twitter Account</span>
            <Badge variant="outline" className="text-xs border-primary/30 text-primary">
              Not Connected
            </Badge>
          </div>
          <Button
            size="sm"
            className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-600 text-primary-foreground"
            onClick={() => connectTwitterMutation.mutate()}
            disabled={connectTwitterMutation.isPending}
            data-testid="button-connect-twitter"
          >
            <Twitter className="h-4 w-4 mr-2" />
            {connectTwitterMutation.isPending ? "Connecting..." : "Connect Twitter Account"}
          </Button>
        </div>

        {/* Partner Projects */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium mb-2 text-foreground">Partner Projects</h4>

          {isLoading ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              Loading...
            </div>
          ) : projects && projects.length > 0 ? (
            projects.map((project: any) => (
              <div
                key={project.id}
                className="p-3 border border-border rounded-lg hover:border-primary transition-all hover-elevate bg-muted/30"
                data-testid={`card-project-${project.id}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h5 className="font-medium text-sm text-foreground">{project.name}</h5>
                    <p className="text-xs text-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    +{project.pointsPerTweet}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {project.hashtags?.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs border-primary/30 text-primary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No projects available currently
            </div>
          )}
        </div>

        {/* Verify Button */}
        <Button
          className="w-full bg-accent hover:bg-accent/80 text-foreground border border-primary/30"
          variant="outline"
          onClick={() => verifyTweetsMutation.mutate()}
          disabled={verifyTweetsMutation.isPending}
          data-testid="button-verify-tweets"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${verifyTweetsMutation.isPending ? 'animate-spin' : ''}`} />
          {verifyTweetsMutation.isPending ? "Verifying..." : "Verify Tweets"}
        </Button>

        {/* Recent Activities */}
        {activities && activities.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Recent Activity</h4>
            {activities.slice(0, 3).map((activity: any) => (
              <div
                key={activity.id}
                className="flex items-center gap-2 p-2 bg-muted/50 rounded text-xs border border-border"
              >
                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="flex-1 truncate text-foreground">{activity.tweetText}</span>
                <Badge variant="secondary" className="text-xs bg-primary/20 text-primary border-primary/30">
                  +{activity.pointsEarned}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}