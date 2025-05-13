
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare, Clock, ChevronRight, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function BuyerDashboard() {
  const { userProfile } = useAuth();
  const [recentChats, setRecentChats] = useState([]);
  const [favoriteListings, setFavoriteListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for development - will be replaced with real data later
  const mockRecentChats = [
    {
      id: '1',
      listing_id: '101',
      listing_title: 'RGB Gaming Keyboard',
      seller_id: 'seller1',
      seller_username: 'tech_seller',
      seller_avatar: null,
      last_message: 'Is this still available?',
      last_message_at: new Date().toISOString(),
      unread_count: 2,
    },
    {
      id: '2',
      listing_id: '102',
      listing_title: 'RTX 3080 Graphics Card',
      seller_id: 'seller2',
      seller_username: 'hardware_hub',
      seller_avatar: null,
      last_message: 'I can meet tomorrow at 4pm.',
      last_message_at: new Date(Date.now() - 86400000).toISOString(),
      unread_count: 0,
    },
  ];
  
  const mockFavorites = [
    {
      id: '101',
      title: 'RGB Gaming Keyboard',
      price: 850,
      condition: 'new',
      thumbnail_url: null,
      city: 'Casablanca',
    },
    {
      id: '103',
      title: 'Monitor 27" 144Hz',
      price: 1900,
      condition: 'used',
      thumbnail_url: null,
      city: 'Rabat',
    },
    {
      id: '104',
      title: 'Wireless Mouse',
      price: 250,
      condition: 'new',
      thumbnail_url: null,
      city: 'Marrakech',
    },
  ];

  // This would be replaced with real data fetching
  useEffect(() => {
    setTimeout(() => {
      setRecentChats(mockRecentChats);
      setFavoriteListings(mockFavorites);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {userProfile?.full_name || userProfile?.username}!</CardTitle>
          <CardDescription>
            Your buyer dashboard for Gamana
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>Favorites</span>
                  <Heart className="h-4 w-4 text-red-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{mockFavorites.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>Messages</span>
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{mockRecentChats.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>Recent Views</span>
                  <Clock className="h-4 w-4 text-green-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">12</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="messages">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="recently-viewed">Recently Viewed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>
                Your conversations with sellers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockRecentChats.length > 0 ? (
                <div className="space-y-4">
                  {mockRecentChats.map((chat) => (
                    <Link to={`/chat/${chat.id}`} key={chat.id}>
                      <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarFallback>
                                {chat.seller_username.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">
                                  {chat.seller_username}
                                  {chat.unread_count > 0 && (
                                    <Badge className="ml-2" variant="destructive">
                                      {chat.unread_count} new
                                    </Badge>
                                  )}
                                </p>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(chat.last_message_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{chat.listing_title}</p>
                              <p className="text-sm">{chat.last_message}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg">No messages yet</h3>
                  <p className="text-muted-foreground">
                    Start a conversation with a seller to see it here
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/chat">
                  View All Messages
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="favorites" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Favorite Listings</CardTitle>
              <CardDescription>
                Products you've saved
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockFavorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockFavorites.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
                            {item.thumbnail_url ? (
                              <img 
                                src={item.thumbnail_url} 
                                alt={item.title} 
                                className="w-full h-full object-cover rounded-md"
                              />
                            ) : (
                              <Package className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.title}</h4>
                            <p className="text-lg font-semibold">{item.price} MAD</p>
                            <div className="flex items-center mt-1 justify-between">
                              <Badge variant={item.condition === 'new' ? 'default' : 'secondary'}>
                                {item.condition}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{item.city}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg">No favorites yet</h3>
                  <p className="text-muted-foreground">
                    Save listings you like to find them easily later
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/">
                  Browse More Listings
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="recently-viewed" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recently Viewed</CardTitle>
              <CardDescription>
                Products you've checked out recently
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg">No recent views</h3>
                <p className="text-muted-foreground">
                  Products you view will appear here
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/">
                  Explore Products
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
