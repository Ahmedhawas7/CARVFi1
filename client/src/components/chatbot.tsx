import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Bot, User, Sparkles } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatBotProps {
  walletAddress: string;
  userId?: string;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatBot({ walletAddress, userId, onClose }: ChatBotProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Welcome! I\'m your AI assistant. Ask me anything and earn points! 🎯',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get daily chat stats
  const { data: chatStats } = useQuery<import("@/lib/types").ChatStats>({
    queryKey: ['/api/chat/stats', userId],
    enabled: !!userId,
  });

  const messagesRemaining = chatStats?.messagesRemaining ?? 20;

  // Send message mutation
  const sendMessageMutation = useMutation<import("@/lib/types").ChatMessageResponse, Error, string>({
    mutationFn: async (message: string) => {
      return await apiRequest('POST', '/api/chat/message', {
        userId,
        message,
        walletAddress
      }) as Promise<import("@/lib/types").ChatMessageResponse>;
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }]);

      if (data.pointsEarned > 0) {
        toast({
          title: "New Points! 🎉",
          description: `You earned ${data.pointsEarned} points from this conversation`,
        });
      }

      queryClient.invalidateQueries({ queryKey: ['/api/chat/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل إرسال الرسالة",
        variant: "destructive",
      });
    }
  });

  const handleSend = () => {
    if (!input.trim() || sendMessageMutation.isPending) return;
    
    if (messagesRemaining <= 0) {
      toast({
        title: "Daily Limit Reached",
        description: "Come back tomorrow for more conversations!",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    sendMessageMutation.mutate(input);
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col bg-card border-border shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-primary/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Bot className="h-7 w-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">AI Assistant</CardTitle>
              <CardDescription className="text-muted-foreground">Earn points from every message</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30" data-testid="badge-messages-remaining">
              <Sparkles className="h-3 w-3 mr-1" />
              {messagesRemaining} messages left
            </Badge>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="hover:bg-destructive/20 hover:text-destructive"
              data-testid="button-close-chat"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0 bg-gradient-to-b from-transparent to-accent/10">
          <ScrollArea className="h-full p-6">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  data-testid={`message-${message.role}-${index}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/40">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-muted text-foreground border border-border shadow-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/60 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/20">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                  )}
                </div>
              ))}
              
              {sendMessageMutation.isPending && (
                <div className="flex gap-3 justify-start">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/40">
                    <Bot className="h-6 w-6 text-white animate-pulse" />
                  </div>
                  <div className="bg-muted border border-border rounded-2xl p-4">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>

        <div className="p-4 border-t border-primary/30 bg-card/80 backdrop-blur-sm">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message here..."
              disabled={sendMessageMutation.isPending || messagesRemaining <= 0}
              className="bg-accent/30 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground rounded-xl"
              data-testid="input-chat-message"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || sendMessageMutation.isPending || messagesRemaining <= 0}
              className="bg-gradient-to-br from-primary via-primary/90 to-blue-500 hover:from-primary/90 hover:via-primary/80 hover:to-blue-600 shadow-lg shadow-primary/30 rounded-xl px-6"
              data-testid="button-send-message"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Earn 2 points per message • {messagesRemaining} messages left today
          </p>
        </div>
      </Card>
    </div>
  );
}
