
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, User, Mail, Edit, ArrowLeft, Wallet } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const walletAddress = localStorage.getItem("walletAddress");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const { data: userData, isLoading } = useQuery<import("@/lib/types").User>({
    queryKey: ['/api/user', walletAddress],
    queryFn: async () => {
      if (!walletAddress) throw new Error("No wallet connected");
      return await apiRequest('GET', `/api/user/${walletAddress}`) as Promise<import("@/lib/types").User>;
    },
    enabled: !!walletAddress,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (!userData?.id) throw new Error("No user data");
      return await apiRequest('POST', `/api/user/profile/${userData.id}`, {
        username: username || undefined,
        email: email || undefined,
      });
    },
    onSuccess: () => {
      toast({
        title: "تم التحديث بنجاح! ✅",
        description: "تم حفظ التغييرات على ملفك الشخصي",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل تحديث الملف الشخصي",
        variant: "destructive",
      });
    }
  });

  if (!walletAddress) {
    navigate("/");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">جاري التحميل...</div>
      </div>
    );
  }

  const canEditUsername = userData?.username?.startsWith('carver_');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <header className="sticky top-0 z-50 w-full border-b border-gray-700/50 bg-gray-900/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="text-white hover:text-purple-300"
          >
            <ArrowLeft className="h-5 w-5 ml-2" />
            العودة للوحة التحكم
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Star className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-white">CARVFi</span>
          </div>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-2xl">الملف الشخصي</CardTitle>
                <CardDescription className="text-gray-400">
                  إدارة معلوماتك الشخصية
                </CardDescription>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                className="border-purple-500/30 text-purple-300 hover:bg-purple-900/20"
              >
                <Edit className="h-4 w-4 ml-2" />
                {isEditing ? "إلغاء" : "تعديل"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-purple-500/30">
                <AvatarImage src={userData?.avatarUrl || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white text-2xl">
                  {userData?.username?.slice(0, 2).toUpperCase() || "CF"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-white text-xl font-bold">{userData?.username}</h3>
                <p className="text-gray-400 text-sm">المستوى {userData?.level}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="text-purple-300 font-bold">{userData?.totalPoints} نقطة</div>
                  <div className="text-gray-400">•</div>
                  <div className="text-orange-400">{userData?.currentStreak} يوم متتالي</div>
                </div>
              </div>
            </div>

            {/* Wallet Address */}
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                عنوان المحفظة
              </Label>
              <Input
                value={walletAddress}
                disabled
                className="bg-gray-900/50 border-gray-700 text-gray-400"
              />
              <p className="text-xs text-gray-500">لا يمكن تغيير عنوان المحفظة</p>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center gap-2">
                <User className="h-4 w-4" />
                اسم المستخدم
              </Label>
              <Input
                value={isEditing ? username : (userData?.username || "")}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!isEditing || !canEditUsername}
                placeholder={userData?.username || "اختر اسم مستخدم"}
                className="bg-gray-900/50 border-gray-700 text-white disabled:text-gray-400"
              />
              {!canEditUsername && (
                <p className="text-xs text-gray-500">لقد قمت بتغيير اسم المستخدم مسبقاً</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                البريد الإلكتروني
              </Label>
              <Input
                type="email"
                value={isEditing ? email : (userData?.email || "")}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                placeholder="أدخل بريدك الإلكتروني"
                className="bg-gray-900/50 border-gray-700 text-white disabled:text-gray-400"
              />
            </div>

            {/* Save Button */}
            {isEditing && (
              <Button
                onClick={() => updateProfileMutation.mutate()}
                disabled={updateProfileMutation.isPending}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
              >
                {updateProfileMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700/50">
              <Card className="bg-gray-900/50 border-gray-700/50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-400">{userData?.longestStreak}</div>
                  <div className="text-sm text-gray-400">أطول سلسلة</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/50 border-gray-700/50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-400">{userData?.level}</div>
                  <div className="text-sm text-gray-400">المستوى الحالي</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
