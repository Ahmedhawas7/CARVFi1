
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, User, Mail, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfilePageProps {
  walletAddress: string;
  userData: any;
  onBack: () => void;
  refetchUser: () => void;
}

export default function ProfilePage({ walletAddress, userData, onBack, refetchUser }: ProfilePageProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(userData?.username || "");
  const [firstName, setFirstName] = useState(userData?.firstName || "");
  const [lastName, setLastName] = useState(userData?.lastName || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [avatarUrl, setAvatarUrl] = useState(userData?.avatarUrl || "");

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { username?: string; firstName?: string; lastName?: string; email?: string; avatarUrl?: string }) => {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress, ...data }),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
      setIsEditing(false);
      refetchUser();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate({ username, firstName, lastName, email, avatarUrl });
  };

  const handleCancel = () => {
    setUsername(userData?.username || "");
    setFirstName(userData?.firstName || "");
    setLastName(userData?.lastName || "");
    setEmail(userData?.email || "");
    setAvatarUrl(userData?.avatarUrl || "");
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-purple-500/20 bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container flex h-16 items-center gap-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-300 hover:text-white hover:bg-purple-900/30"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-white">Profile</h1>
        </div>
      </header>

      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-800/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto p-4 md:p-6 max-w-2xl relative z-10">
        <Card className="bg-gradient-to-b from-purple-950/30 to-black/50 border-purple-500/20 backdrop-blur-xl">
          <CardHeader className="border-b border-purple-500/20">
            <CardTitle className="text-2xl text-white">Personal Information</CardTitle>
            <p className="text-sm text-gray-400 mt-1">Update your personal details and profile information</p>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            {/* Avatar Upload Section */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Profile Picture</Label>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24 ring-2 ring-purple-500/30">
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-700 text-white text-3xl font-bold">
                      {username.slice(0, 2).toUpperCase() || "US"}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors">
                    <Upload className="h-4 w-4 text-white" />
                  </button>
                </div>
                <div className="flex-1">
                  <Input
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://example.com/avatar.jpg"
                    className="bg-purple-950/30 border-purple-500/30 text-gray-300 placeholder:text-gray-600 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter image URL link</p>
                </div>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm text-gray-300">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!isEditing || userData?.usernameChanged}
                className="bg-purple-950/30 border-purple-500/30 text-white placeholder:text-gray-600 disabled:opacity-50 focus:border-purple-500 focus:ring-purple-500/20"
              />
              {userData?.usernameChanged && (
                <p className="text-xs text-yellow-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Username can only be changed once
                </p>
              )}
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm text-gray-300">
                First Name
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={!isEditing}
                placeholder="John"
                className="bg-purple-950/30 border-purple-500/30 text-white placeholder:text-gray-600 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm text-gray-300">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={!isEditing}
                placeholder="Doe"
                className="bg-purple-950/30 border-purple-500/30 text-white placeholder:text-gray-600 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-gray-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  placeholder="john@example.com"
                  className="bg-purple-950/30 border-purple-500/30 text-white placeholder:text-gray-600 pl-10 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border border-purple-500/20"
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1 border-purple-500/30 text-gray-300 hover:bg-purple-900/30 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border border-purple-500/20"
                  >
                    {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              )}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-purple-500/20">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                  {userData?.totalPoints || 0}
                </div>
                <div className="text-xs text-gray-400 mt-1">Points</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                  {userData?.currentStreak || 0}
                </div>
                <div className="text-xs text-gray-400 mt-1">Streak</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                  {userData?.level || 1}
                </div>
                <div className="text-xs text-gray-400 mt-1">Level</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
