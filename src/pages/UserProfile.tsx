
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, 
  MapPin, 
  Calendar, 
  User, 
  PencilLine,
  Link as LinkIcon,
  MessageCircle,
  Grid3X3 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

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

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const { userProfile: authUserProfile, user: authUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("listings");
  const [listingsCount, setListingsCount] = useState(0);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [showNotFound, setShowNotFound] = useState(false);
  
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
            setShowNotFound(true);
            
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
        setShowNotFound(true);
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
      {showNotFound ? (
        <AlertDialog open={showNotFound}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>User Not Found</AlertDialogTitle>
              <AlertDialogDescription>
                The user profile you are looking for does not exist.
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => navigate('/')}>Go Home</Button>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      ) : profile ? (
        <div className="container max-w-4xl mx-auto py-8 px-4">
          {/* Profile Header */}
          <div className="space-y-6">
            {/* Top Section with Avatar, Name & Edit Button */}
            <div className="flex flex-col md:flex-row gap-6 md:items-start">
              <Avatar className="h-24 w-24 md:h-28 md:w-28">
                {profile.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} />
                ) : (
                  <AvatarFallback className="bg-primary text-2xl">
                    {profile.full_name 
                      ? getInitials(profile.full_name) 
                      : profile.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold">
                      {profile.full_name || profile.username}
                    </h1>
                    <div className="flex items-center gap-2">
                      <p className="text-muted-foreground">@{profile.username}</p>
                      <Badge variant={
                        profile.role === 'admin' ? "destructive" : 
                        profile.role === 'seller' ? "default" : "secondary"
                      } className="text-xs">
                        {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  {isOwnProfile && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditProfileOpen(true)}>
                      <PencilLine className="h-4 w-4 mr-2" />
                      Edit profile
                    </Button>
                  )}
                </div>
                
                {/* Bio */}
                {profile.bio && (
                  <p className="text-sm md:text-base">{profile.bio}</p>
                )}
                
                {/* Location & Joined Date */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                  {profile.city && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{profile.city}, {profile.country || "Morocco"}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>Joined {formatDate(profile.created_at)}</span>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="flex gap-4 pt-2">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{listingsCount}</span>
                    <span className="text-muted-foreground">listings</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">0</span>
                    <span className="text-muted-foreground">followers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">0</span>
                    <span className="text-muted-foreground">following</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            {!isOwnProfile && (
              <div className="flex gap-3">
                <Button className="flex-1">Follow</Button>
                <Button variant="outline" className="flex-1">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            )}
            
            <Separator />
            
            {/* Tabs for content sections */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger 
                  value="listings" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-6"
                >
                  <Grid3X3 className="h-5 w-5 mr-2" />
                  Listings
                </TabsTrigger>
                <TabsTrigger 
                  value="about" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-6"
                >
                  <User className="h-5 w-5 mr-2" />
                  About
                </TabsTrigger>
              </TabsList>
              
              {/* Listings Tab */}
              <TabsContent value="listings" className="pt-6">
                {profile.role === 'seller' ? (
                  listingsCount > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {/* Listings will be displayed here when implemented */}
                      <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground">Listing #1</p>
                      </div>
                      <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground">Listing #2</p>
                      </div>
                      <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground">Listing #3</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No listings yet</p>
                      {isOwnProfile && (
                        <Button className="mt-4" onClick={() => navigate('/post-listing')}>
                          Create your first listing
                        </Button>
                      )}
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      {isOwnProfile 
                        ? "You need a seller account to create listings" 
                        : "This user doesn't have seller privileges"}
                    </p>
                    {isOwnProfile && (
                      <Button 
                        className="mt-4" 
                        onClick={() => setIsEditProfileOpen(true)}
                      >
                        Upgrade to seller
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
              
              {/* About Tab */}
              <TabsContent value="about" className="pt-6">
                <Card className="bg-muted/30">
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Bio</h3>
                      {profile.bio ? (
                        <p>{profile.bio}</p>
                      ) : (
                        <p className="text-muted-foreground italic">
                          No bio provided
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Location</h3>
                      {profile.city ? (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          {profile.city}, {profile.country || "Morocco"}
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic">
                          No location provided
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Joined</h3>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        {formatDate(profile.created_at)}
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Edit Profile Dialog */}
          <EditProfileDialog 
            open={isEditProfileOpen} 
            onOpenChange={setIsEditProfileOpen} 
          />
        </div>
      ) : null}
    </Layout>
  );
};

export default UserProfile;
