
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Eye, MessageSquare, TrendingUp, PlusCircle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function SellerDashboard() {
  const { userProfile } = useAuth();
  const [activeListings, setActiveListings] = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for development
  const mockListings = [
    {
      id: '201',
      title: 'Gaming PC RTX 4070',
      price: 12000,
      status: 'active',
      condition: 'new',
      thumbnail_url: null,
      created_at: new Date().toISOString(),
      views_count: 45,
      messages_count: 8,
    },
    {
      id: '202',
      title: 'Mechanical Keyboard Cherry MX',
      price: 950,
      status: 'active',
      condition: 'new',
      thumbnail_url: null,
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      views_count: 23,
      messages_count: 3,
    },
    {
      id: '203',
      title: 'Dell XPS 15 Laptop',
      price: 8500,
      status: 'active',
      condition: 'used',
      thumbnail_url: null,
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      views_count: 67,
      messages_count: 12,
    },
  ];

  // Mock analytics data
  const mockAnalytics = {
    totalViews: 135,
    totalMessages: 23,
    conversion: 17, // percentage
    weeklyViews: [12, 18, 22, 15, 35, 18, 15],
    weeklyMessages: [2, 5, 4, 3, 6, 2, 1],
  };

  // This would be replaced with real data fetching
  useEffect(() => {
    setTimeout(() => {
      setActiveListings(mockListings);
      setMessageCount(mockAnalytics.totalMessages);
      setViewCount(mockAnalytics.totalViews);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Seller Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your listings and monitor performance
          </p>
        </div>
        <Button asChild>
          <Link to="/post-listing">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Listing
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{mockListings.length}</div>
              <div className="text-xs text-muted-foreground">
                <Package className="inline h-4 w-4 mr-1" />
                Products
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{viewCount}</div>
              <div className="text-xs text-muted-foreground">
                <Eye className="inline h-4 w-4 mr-1" />
                Impressions
              </div>
            </div>
            <Progress value={75} className="h-1 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{messageCount}</div>
              <div className="text-xs text-muted-foreground">
                <MessageSquare className="inline h-4 w-4 mr-1" />
                Conversations
              </div>
            </div>
            <Progress value={mockAnalytics.conversion} className="h-1 mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="listings">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="listings">My Listings</TabsTrigger>
          <TabsTrigger value="analytics">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="listings" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Listings</CardTitle>
              <CardDescription>
                Manage all your product listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockListings.length > 0 ? (
                <div className="space-y-4">
                  {mockListings.map((listing) => (
                    <Card key={listing.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
                            {listing.thumbnail_url ? (
                              <img 
                                src={listing.thumbnail_url} 
                                alt={listing.title} 
                                className="w-full h-full object-cover rounded-md"
                              />
                            ) : (
                              <Package className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{listing.title}</h4>
                              <Badge>{listing.status}</Badge>
                            </div>
                            <p className="text-lg font-semibold">{listing.price} MAD</p>
                            <div className="flex items-center mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center mr-4">
                                <Eye className="h-4 w-4 mr-1" />
                                {listing.views_count} views
                              </div>
                              <div className="flex items-center">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {listing.messages_count} messages
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg">No listings yet</h3>
                  <p className="text-muted-foreground">
                    Add your first product to start selling
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/post-listing">
                  Add New Listing
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>
                Track views, messages, and engagement metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Weekly Overview</h3>
                <div className="h-[200px] w-full flex items-end justify-between gap-2">
                  {mockAnalytics.weeklyViews.map((value, i) => (
                    <div key={i} className="relative group">
                      <div 
                        className="w-8 bg-primary/20 rounded-sm" 
                        style={{ height: `${value * 2}px` }}
                      >
                        <div 
                          className="absolute bottom-0 w-8 bg-primary rounded-sm transition-all" 
                          style={{ height: `${mockAnalytics.weeklyMessages[i] * 2}px` }}
                        ></div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-muted p-2 rounded text-xs">
                        <div>{value} views</div>
                        <div>{mockAnalytics.weeklyMessages[i]} messages</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Conversion Rate</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Percentage of views that result in messages
                </p>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-200 text-green-800">
                        {mockAnalytics.conversion}%
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block">
                        {messageCount}/{viewCount}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-muted">
                    <div style={{ width: `${mockAnalytics.conversion}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
