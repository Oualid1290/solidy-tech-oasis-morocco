
import { useEffect, useState, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, ChevronRight, MapPin, User, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  sender_id: string;
  message_text: string;
  message_type: "text" | "image";
  sent_at: string;
  read_at: string | null;
}

interface Chat {
  id: string;
  listing: {
    id: string;
    title: string;
    price: number;
    thumbnail_url: string | null;
    city: string;
    created_at: string;
  };
  buyer: {
    id: string;
    username: string;
    avatar_url: string | null;
    last_seen: string;
  };
  seller: {
    id: string;
    username: string;
    avatar_url: string | null;
    last_seen: string;
  };
  last_message_at: string;
  created_at: string;
}

const ChatPage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("chats")
          .select(`
            id,
            created_at,
            last_message_at,
            listing:listing_id(
              id,
              title,
              price,
              thumbnail_url,
              city,
              created_at
            ),
            buyer:buyer_id(
              id,
              username,
              avatar_url,
              last_seen
            ),
            seller:seller_id(
              id,
              username,
              avatar_url,
              last_seen
            )
          `)
          .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
          .order("last_message_at", { ascending: false });

        if (error) throw error;
        setChats(data || []);
        
        // If chatId is provided, find the chat in the list
        if (chatId && data) {
          const selected = data.find(chat => chat.id === chatId);
          if (selected) {
            setCurrentChat(selected);
          }
        }
        // If no chatId is provided but we have chats, select the first one
        else if (!chatId && data && data.length > 0) {
          setCurrentChat(data[0]);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [user, chatId]);

  useEffect(() => {
    // Fetch messages for the current chat
    const fetchMessages = async () => {
      if (!currentChat) return;

      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("chat_id", currentChat.id)
          .order("sent_at", { ascending: true });

        if (error) throw error;
        setMessages(data || []);

        // Mark messages as read
        if (data && data.length > 0) {
          const unreadMessages = data.filter(
            msg => msg.sender_id !== user?.id && !msg.read_at
          );

          if (unreadMessages.length > 0) {
            // Update messages as read
            await supabase
              .from("messages")
              .update({ read_at: new Date().toISOString() })
              .in("id", unreadMessages.map(msg => msg.id));
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${currentChat?.id}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);

          // Mark message as read if not from current user
          if (newMessage.sender_id !== user?.id) {
            supabase
              .from("messages")
              .update({ read_at: new Date().toISOString() })
              .eq("id", newMessage.id);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentChat, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || !currentChat || !user) return;

    try {
      const { error } = await supabase
        .from("messages")
        .insert({
          chat_id: currentChat.id,
          sender_id: user.id,
          message_text: messageText,
          message_type: "text",
        });

      if (error) throw error;
      
      // Clear input after sending
      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const selectChat = (chat: Chat) => {
    setCurrentChat(chat);
    // Update URL without refreshing the page
    window.history.pushState({}, "", `/chat/${chat.id}`);
  };

  const getOtherUser = (chat: Chat) => {
    if (!user) return null;
    return chat.buyer.id === user.id ? chat.seller : chat.buyer;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-pulse text-lg">Loading chats...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat list (sidebar) */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="overflow-hidden h-[calc(100vh-160px)]">
              <CardHeader className="p-4">
                <CardTitle className="text-xl">Messages</CardTitle>
                <CardDescription>
                  {chats.length} conversation{chats.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <div className="overflow-y-auto h-[calc(100%-5rem)]">
                {chats.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">No conversations yet</p>
                  </div>
                ) : (
                  chats.map((chat) => {
                    const otherUser = getOtherUser(chat);
                    return (
                      <button
                        key={chat.id}
                        className={`w-full text-left p-4 border-b flex items-center gap-3 hover:bg-muted/50 transition-colors ${
                          currentChat?.id === chat.id ? "bg-muted" : ""
                        }`}
                        onClick={() => selectChat(chat)}
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                          {otherUser?.avatar_url ? (
                            <img
                              src={otherUser.avatar_url}
                              alt={otherUser.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="font-medium truncate">{otherUser?.username}</span>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(chat.last_message_at), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm truncate text-gray-500">
                            {chat.listing.title}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </button>
                    );
                  })
                )}
              </div>
            </Card>
          </div>
          
          {/* Chat content */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {currentChat ? (
              <Card className="overflow-hidden h-[calc(100vh-160px)] flex flex-col">
                {/* Chat header */}
                <CardHeader className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        {getOtherUser(currentChat)?.avatar_url ? (
                          <img
                            src={getOtherUser(currentChat)?.avatar_url!}
                            alt={getOtherUser(currentChat)?.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {getOtherUser(currentChat)?.username}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Last seen{" "}
                          {formatDistanceToNow(
                            new Date(getOtherUser(currentChat)?.last_seen!),
                            { addSuffix: true }
                          )}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              
                {/* Product details */}
                <div className="p-3 border-b bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gray-200 rounded">
                      {currentChat.listing.thumbnail_url ? (
                        <img
                          src={currentChat.listing.thumbnail_url}
                          alt={currentChat.listing.title}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {currentChat.listing.title}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-solidy-blue font-semibold">
                          {currentChat.listing.price.toLocaleString()} MAD
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin size={10} />
                          <span>{currentChat.listing.city}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <div className="text-gray-400 mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="64"
                          height="64"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </div>
                      <p className="text-gray-500">
                        No messages yet. Start the conversation!
                      </p>
                    </div>
                  ) : (
                    <>
                      {messages.map((message) => {
                        const isOwnMessage = message.sender_id === user?.id;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                isOwnMessage
                                  ? "bg-solidy-blue text-white"
                                  : "bg-muted"
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words">
                                {message.message_text}
                              </p>
                              <div
                                className={`text-xs mt-1 ${
                                  isOwnMessage ? "text-blue-100" : "text-gray-500"
                                }`}
                              >
                                {new Date(message.sent_at).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Message input */}
                <form onSubmit={sendMessage} className="p-3 border-t flex gap-2">
                  <Textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="resize-none max-h-32 min-h-10"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(e);
                      }
                    }}
                  />
                  <Button type="submit" size="icon" disabled={!messageText.trim()}>
                    <Send size={18} />
                  </Button>
                </form>
              </Card>
            ) : (
              <Card className="h-[calc(100vh-160px)] flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="text-gray-400 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">No chat selected</h3>
                  <p className="text-gray-500">
                    {chats.length > 0
                      ? "Select a conversation to start chatting"
                      : "Your messages will appear here when you start contacting sellers"}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
