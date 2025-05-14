
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, MapPin, Calendar, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

type UserProfile = {
  id: string;
  username: string;
  email?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  city?: string | null;
  country?: string | null;
  role: string;
  is_verified: boolean;
  last_seen: string | null;
  created_at: string | null;
};

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { userProfile: authUserProfile, user: authUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [listingsCount, setListingsCount] = useState(0);
  
  const isOwnProfile = 
    authUserProfile?.username === username || 
    (authUser && !username); // If no username is provided and user is logged in
  
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      
      try {
        if (!username && authUser) {
          // If no username provided but user is authenticated, redirect to their profile
          if (authUserProfile?.username) {
            navigate(`/profile/${authUserProfile.username}`);
            return;
          }
        }
        
        // Fetch user profile by username
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("username", username)
          .maybeSingle();
        
        if (userError || !userData) {
          if (userError?.code === "PGRST116") {
            // No profile found, show appropriate message
            setProfile(null);
            setIsLoading(false);
            
            if (isOwnProfile) {
              // If this is the current user's profile but it doesn't exist in DB yet
              toast({
                title: "Creating your profile",
                description: "Setting up your profile information...",
              });
              
              // Wait a moment and try again - the AuthContext might be creating the profile
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            }
            return;
          }
          
          throw userError;
        }
        
        setProfile(userData as UserProfile);
        
        // If this is a seller, get their listings count
        if (userData.role === 'seller') {
          const { count, error: countError } = await supabase
            .from("listings")
            .select("*", { count: 'exact', head: true })
            .eq("user_id", userData.id);
            
          if (!countError && count !== null) {
            setListingsCount(count);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [username, authUserProfile, authUser, navigate, isOwnProfile, toast]);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }
  
  if (!profile) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">User Not Found</CardTitle>
              <CardDescription className="text-center">
                The user profile you are looking for does not exist.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    );
  }
  
  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMMM dd, yyyy");
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    {profile.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} />
                    ) : (
                      <AvatarFallback className="bg-primary text-xl">
                        {profile.full_name 
                          ? getInitials(profile.full_name) 
                          : profile.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className="text-center">
                    <h2 className="text-xl font-bold">
                      {profile.full_name || profile.username}
                    </h2>
                    <p className="text-muted-foreground">@{profile.username}</p>
                    
                    <div className="mt-2 flex justify-center">
                      <Badge variant={
                        profile.role === 'admin' ? "destructive" : 
                        profile.role === 'seller' ? "default" : "secondary"
                      }>
                        {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {profile.bio && (
                    <div className="text-center">
                      <p className="text-sm">{profile.bio}</p>
                    </div>
                  )}
                  
                  <div className="w-full space-y-2">
                    {profile.city && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{profile.city}, {profile.country || "Morocco"}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        Joined {formatDate(profile.created_at)}
                      </span>
                    </div>
                    
                    {profile.role === 'seller' && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{listingsCount} Listings</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="listings" disabled={profile.role !== 'seller'}>
                  Listings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="mt-6">
                {isOwnProfile ? (
                  <ProfileForm />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>About {profile.full_name || profile.username}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {profile.bio ? (
                          <p>{profile.bio}</p>
                        ) : (
                          <p className="text-muted-foreground italic">
                            This user hasn't added a bio yet.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="listings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{profile.full_name || profile.username}'s Listings</CardTitle>
                    <CardDescription>
                      Browse all active listings from this seller
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {listingsCount > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Listings will be displayed here when implemented */}
                        <div className="text-center py-8">
                          <p>Listing components will be rendered here</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          This user doesn't have any active listings.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
