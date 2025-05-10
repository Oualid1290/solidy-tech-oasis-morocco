import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Package,
  MessageCircle,
  Star,
  Eye,
  Bell,
  Edit,
  MoreHorizontal,
  Trash2,
  Tag,
  BarChart2,
  CircleCheck,
  Loader2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Listing {
  id: string;
  title: string;
  price: number;
  thumbnail_url: string | null;
  created_at: string;
  status: "active" | "sold" | "archived";
  views_count: number;
  city: string;
  condition: "new" | "used";
}

interface Message {
  chat_id: string;
  listing: {
    id: string;
    title: string;
    thumbnail_url: string | null;
  };
  other_user: {
    username: string;
    avatar_url: string | null;
  };
  last_message_text: string;
  last_message_at: string;
  unread_count: number;
}

interface Notification {
  id: string;
  type: string;
  payload: any;
  created_at: string;
  is_read: boolean;
}

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [viewsData, setViewsData] = useState<any[]>([]);
  
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [updateAction, setUpdateAction] = useState<{id: string, action: string} | null>(null);
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      // Fetch user's listings
      try {
        setIsLoadingListings(true);
        
        const { data: listingsData, error: listingsError } = await supabase
          .from("listings")
          .select(`
            id, 
            title, 
            price, 
            thumbnail_url, 
            created_at, 
            status,
            city,
            condition
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        
        if (listingsError) throw listingsError;
        
        // Get view counts for each listing
        const listingsWithViews = await Promise.all(
          (listingsData || []).map(async (listing) => {
            const { count } = await supabase
              .from("views")
              .select("id", { count: "exact", head: true })
              .eq("listing_id", listing.id);
            
            return { ...listing, views_count: count || 0 };
          })
        );
        
        setListings(listingsWithViews);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setIsLoadingListings(false);
      }
      
      // Fetch user's chats and messages with proper column hints
      try {
        setIsLoadingMessages(true);
        
        const { data: chatsData, error: chatsError } = await supabase
          .from("chats")
          .select(`
            id,
            listing:listing_id(id, title, thumbnail_url),
            buyer_id,
            seller_id,
            last_message_at
          `)
          .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
          .order("last_message_at", { ascending: false });
        
        if (chatsError) throw chatsError;
        
        // Process chat data and get last messages
        const processedMessages = await Promise.all(
          (chatsData || []).map(async (chat) => {
            // For each chat, fetch the other user's information separately
            const otherUserId = chat.buyer_id === user.id ? chat.seller_id : chat.buyer_id;
            
            const { data: otherUserData } = await supabase
              .from("users")
              .select("username, avatar_url")
              .eq("id", otherUserId)
              .single();
            
            // Get last message
            const { data: lastMessageData } = await supabase
              .from("messages")
              .select("message_text, sent_at")
              .eq("chat_id", chat.id)
              .order("sent_at", { ascending: false })
              .limit(1)
              .single();
            
            // Get unread count
            const { count } = await supabase
              .from("messages")
              .select("id", { count: "exact", head: true })
              .eq("chat_id", chat.id)
              .eq("read_at", null)
              .neq("sender_id", user.id);
            
            return {
              chat_id: chat.id,
              listing: chat.listing || { id: "", title: "Unknown", thumbnail_url: null },
              other_user: otherUserData || { username: "Unknown", avatar_url: null },
              last_message_text: lastMessageData?.message_text || "",
              last_message_at: lastMessageData?.sent_at || chat.last_message_at,
              unread_count: count || 0,
            };
          })
        );
        
        setMessages(processedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoadingMessages(false);
      }
      
      // Fetch notifications
      try {
        setIsLoadingNotifications(true);
        
        const { data: notificationsData, error: notificationsError } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20);
        
        if (notificationsError) throw notificationsError;
        
        setNotifications(notificationsData || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoadingNotifications(false);
      }
      
      // Fetch views statistics
      try {
        setIsLoadingStats(true);
        
        // Get daily views for the last 14 days
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        
        const { data: viewsData, error: viewsError } = await supabase
          .from("views")
          .select(`
            listing_id,
            viewed_at,
            listings:listing_id(
              title
            )
          `)
          .eq("listings.user_id", user.id)
          .gte("viewed_at", twoWeeksAgo.toISOString());
        
        if (viewsError) throw viewsError;
        
        // Process views data by date
        const viewsByDate = (viewsData || []).reduce((acc: any, view: any) => {
          const date = new Date(view.viewed_at).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = { date, count: 0 };
          }
          acc[date].count++;
          return acc;
        }, {});
        
        // Convert to array and sort by date
        const viewsChartData = Object.values(viewsByDate).sort(
          (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        setViewsData(viewsChartData);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };
    
    fetchData();
  }, [user, updateAction]);
  
  const handleUpdateListingStatus = async (listingId: string, newStatus: "active" | "sold" | "archived") => {
    try {
      setUpdateAction({ id: listingId, action: 'updating' });
      
      const { error } = await supabase
        .from("listings")
        .update({ status: newStatus })
        .eq("id", listingId);
      
      if (error) throw error;
      
      toast({
        title: "Status updated",
        description: `Listing has been marked as ${newStatus}`,
      });
      
      // Update local state
      setListings((prev) =>
        prev.map((listing) =>
          listing.id === listingId ? { ...listing, status: newStatus } : listing
        )
      );
    } catch (error: any) {
      console.error("Error updating listing status:", error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update listing status",
        variant: "destructive",
      });
    } finally {
      setUpdateAction(null);
    }
  };
  
  const handleDeleteListing = async (listingId: string) => {
    try {
      setUpdateAction({ id: listingId, action: 'deleting' });
      
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", listingId);
      
      if (error) throw error;
      
      toast({
        title: "Listing deleted",
        description: "Your listing has been deleted successfully",
      });
      
      // Update local state
      setListings((prev) => prev.filter((listing) => listing.id !== listingId));
    } catch (error: any) {
      console.error("Error deleting listing:", error);
      toast({
        title: "Deletion failed",
        description: error.message || "Failed to delete listing",
        variant: "destructive",
      });
    } finally {
      setUpdateAction(null);
    }
  };
  
  const markAllNotificationsAsRead = async () => {
    try {
      // Only update unread notifications
      const unreadNotifications = notifications.filter(n => !n.is_read);
      if (unreadNotifications.length === 0) return;
      
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .in("id", unreadNotifications.map(n => n.id));
      
      if (error) throw error;
      
      // Update local state
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, is_read: true }))
      );
      
      toast({
        title: "Notifications cleared",
        description: "All notifications have been marked as read",
      });
    } catch (error: any) {
      console.error("Error updating notifications:", error);
      toast({
        title: "Operation failed",
        description: error.message || "Failed to mark notifications as read",
        variant: "destructive",
      });
    }
  };
  
  const unreadMessagesCount = messages.reduce(
    (total, message) => total + message.unread_count,
    0
  );
  
  const unreadNotificationsCount = notifications.filter(n => !n.is_read).length;
  
  const renderNotificationContent = (notification: Notification) => {
    switch (notification.type) {
      case "new_message":
        return (
          <div className="flex items-center gap-2">
            <MessageCircle size={16} className="text-solidy-blue" />
            <span>You received a new message</span>
          </div>
        );
      case "listing_viewed":
        return (
          <div className="flex items-center gap-2">
            <Eye size={16} className="text-gray-600" />
            <span>Someone viewed your listing</span>
          </div>
        );
      case "offer_made":
        return (
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-green-600" />
            <span>You received an offer on your listing</span>
          </div>
        );
      case "listing_favorited":
        return (
          <div className="flex items-center gap-2">
            <Star size={16} className="text-yellow-500" />
            <span>Someone favorited your listing</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2">
            <Bell size={16} />
            <span>New notification</span>
          </div>
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500 text-white";
      case "sold":
        return "bg-amber-500 text-white";
      case "archived":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500">
              Manage your listings, messages, and account
            </p>
          </div>
          <Button asChild>
            <Link to="/post-listing">
              <Package className="mr-2 h-4 w-4" />
              Post New Listing
            </Link>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Active Listings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">
                  {isLoadingListings ? (
                    <Skeleton className="h-9 w-12" />
                  ) : (
                    listings.filter(l => l.status === "active").length
                  )}
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <Package className="h-6 w-6 text-solidy-blue" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Unread Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">
                  {isLoadingMessages ? (
                    <Skeleton className="h-9 w-12" />
                  ) : (
                    unreadMessagesCount
                  )}
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">
                  {isLoadingStats ? (
                    <Skeleton className="h-9 w-12" />
                  ) : (
                    listings.reduce((sum, listing) => sum + listing.views_count, 0)
                  )}
                </div>
                <div className="p-2 bg-purple-100 rounded-full">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Views Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 size={18} />
              Views Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="w-full h-80 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : viewsData.length > 0 ? (
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={viewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="w-full h-80 flex items-center justify-center text-gray-500">
                No view data available yet
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="listings" className="flex-grow">
          <TabsList className="mb-6">
            <TabsTrigger value="listings" className="flex gap-2">
              <Package size={16} />
              <span>Your Listings</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex gap-2">
              <MessageCircle size={16} />
              <span>Messages</span>
              {unreadMessagesCount > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {unreadMessagesCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex gap-2">
              <Bell size={16} />
              <span>Notifications</span>
              {unreadNotificationsCount > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {unreadNotificationsCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-6">
            {isLoadingListings ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4 flex">
                      <div className="flex-shrink-0">
                        <Skeleton className="h-16 w-16 rounded-md" />
                      </div>
                      <div className="flex-grow ml-4 space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className="space-y-4">
                {listings.map((listing) => (
                  <Card key={listing.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
                          {listing.thumbnail_url ? (
                            <img
                              src={listing.thumbnail_url}
                              alt={listing.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <Link
                              to={`/products/${listing.id}`}
                              className="font-medium hover:text-solidy-blue hover:underline"
                            >
                              {listing.title}
                            </Link>
                            <Badge
                              className={`${getStatusColor(listing.status)} ml-2`}
                            >
                              {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            Price: {listing.price.toLocaleString()} MAD
                          </div>
                          <div className="mt-1 flex items-center gap-6 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Eye size={12} />
                              <span>{listing.views_count} views</span>
                            </div>
                            <div>
                              {new Date(listing.created_at).toLocaleDateString()}
                            </div>
                            <div className="capitalize">
                              {listing.condition}
                            </div>
                            <div>{listing.city}</div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                          >
                            <Link to={`/products/${listing.id}`}>
                              View
                            </Link>
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                {updateAction?.id === listing.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <MoreHorizontal className="h-4 w-4" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {listing.status !== "active" && (
                                <DropdownMenuItem 
                                  onClick={() => handleUpdateListingStatus(listing.id, "active")}
                                >
                                  <CircleCheck className="mr-2 h-4 w-4" />
                                  Mark as Active
                                </DropdownMenuItem>
                              )}
                              {listing.status !== "sold" && (
                                <DropdownMenuItem 
                                  onClick={() => handleUpdateListingStatus(listing.id, "sold")}
                                >
                                  <Tag className="mr-2 h-4 w-4" />
                                  Mark as Sold
                                </DropdownMenuItem>
                              )}
                              {listing.status !== "archived" && (
                                <DropdownMenuItem 
                                  onClick={() => handleUpdateListingStatus(listing.id, "archived")}
                                >
                                  <Package className="mr-2 h-4 w-4" />
                                  Archive
                                </DropdownMenuItem>
                              )}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                    <span className="text-red-500">Delete</span>
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete this
                                      listing and all associated data.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteListing(listing.id)} 
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No listings yet</h3>
                <p className="mt-2 text-gray-500">
                  Start selling by posting your first listing
                </p>
                <Button className="mt-4" asChild>
                  <Link to="/post-listing">Post a Listing</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="messages">
            {isLoadingMessages ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4 flex">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="ml-4 flex-grow space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-96" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((message) => (
                  <Card key={message.chat_id}>
                    <CardContent className="p-4">
                      <Link
                        to={`/chat/${message.chat_id}`}
                        className="flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-950 -m-4 p-4 transition-colors rounded-lg"
                      >
                        <div className="flex-shrink-0 h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          {message.other_user.avatar_url ? (
                            <img
                              src={message.other_user.avatar_url}
                              alt={message.other_user.username}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User size={24} className="text-gray-400" />
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between">
                            <div className="font-medium">
                              {message.other_user.username}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(message.last_message_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {message.listing.title}
                          </div>
                          <div
                            className={`text-sm truncate ${
                              message.unread_count > 0
                                ? "font-medium text-black dark:text-white"
                                : "text-gray-500"
                            }`}
                          >
                            {message.last_message_text || "Start chatting"}
                          </div>
                        </div>
                        {message.unread_count > 0 && (
                          <Badge className="bg-solidy-blue">
                            {message.unread_count}
                          </Badge>
                        )}
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No messages yet</h3>
                <p className="mt-2 text-gray-500">
                  Your conversations with buyers and sellers will appear here
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="notifications">
            <div className="mb-6 flex justify-between items-center">
              <h3 className="text-lg font-medium">Recent Notifications</h3>
              {notifications.some((n) => !n.is_read) && (
                <Button variant="outline" onClick={markAllNotificationsAsRead}>
                  Mark all as read
                </Button>
              )}
            </div>
            
            {isLoadingNotifications ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4 flex">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="ml-4 flex-grow space-y-2">
                        <Skeleton className="h-4 w-96" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`${
                      !notification.is_read
                        ? "border-l-4 border-l-solidy-blue"
                        : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          {renderNotificationContent(notification)}
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(notification.created_at).toLocaleString()}
                          </div>
                        </div>
                        {!notification.is_read && (
                          <Badge className="bg-solidy-blue">New</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No notifications yet</h3>
                <p className="mt-2 text-gray-500">
                  You'll be notified about activity related to your listings and
                  messages
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
