
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { ProductCard } from "@/components/products/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit,
  User,
  MapPin,
  Star,
  Calendar,
  Package,
  Mail,
  Phone,
  Clock,
  Loader2,
} from "lucide-react";

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  email: string;
  phone_number: string;
  avatar_url: string | null;
  bio: string | null;
  city: string | null;
  country: string;
  created_at: string;
  last_seen: string;
  role: string;
  is_verified: boolean;
}

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  condition: "New" | "Used";
  location: string;
  sellerRating: number;
  category: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: {
    username: string;
    avatar_url: string | null;
  };
  listing: {
    title: string;
    id: string;
  };
}

const cities = [
  "Casablanca", "Rabat", "Marrakesh", "Fes", "Tangier", "Agadir",
  "Meknes", "Oujda", "Kenitra", "Tetouan", "Safi", "Mohammedia",
  "El Jadida", "Taza", "Nador"
];

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Form fields
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  const isOwnProfile = user && profile && user.id === profile.id;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch user profile
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("username", username)
          .single();
        
        if (userError) throw userError;
        setProfile(userData);
        
        // Update form fields if it's the user's own profile
        setFullName(userData.full_name || "");
        setBio(userData.bio || "");
        setCity(userData.city || "");
        setPhoneNumber(userData.phone_number || "");
        
        // Fetch user's active listings
        const { data: listingsData, error: listingsError } = await supabase
          .from("listings")
          .select(`
            id,
            title,
            price,
            condition,
            city,
            thumbnail_url,
            category:category_id(name)
          `)
          .eq("user_id", userData.id)
          .eq("status", "active");
        
        if (listingsError) throw listingsError;
        
        // Transform to match our Product interface
        const transformedProducts = listingsData.map((listing: any) => ({
          id: listing.id,
          title: listing.title,
          price: listing.price,
          imageUrl: listing.thumbnail_url || "/placeholder.svg",
          condition: listing.condition === "new" ? "New" : "Used",
          location: listing.city,
          sellerRating: 4.5, // This would be calculated from reviews in a real app
          category: listing.category?.name || "Unknown",
        }));
        
        setProducts(transformedProducts);
        
        // Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select(`
            id,
            rating,
            comment,
            created_at,
            reviewer:reviewer_id(username, avatar_url),
            listing:listing_id(title, id)
          `)
          .eq("reviewed_user_id", userData.id);
        
        if (reviewsError) throw reviewsError;
        setReviews(reviewsData || []);
        
        // Calculate average rating
        if (reviewsData && reviewsData.length > 0) {
          const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
          setAverageRating(Math.round((sum / reviewsData.length) * 10) / 10);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (username) {
      fetchUserProfile();
    }
  }, [username]);
  
  const handleUpdateProfile = async () => {
    if (!isOwnProfile || !profile) return;
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from("users")
        .update({
          full_name: fullName,
          bio,
          city,
          phone_number: phoneNumber,
        })
        .eq("id", profile.id);
      
      if (error) throw error;
      
      // Update the local profile state
      setProfile({
        ...profile,
        full_name: fullName,
        bio,
        city,
        phone_number: phoneNumber,
      });
      
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-pulse text-lg">Loading profile...</div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!profile) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
            <p>The user you're looking for doesn't exist.</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  const memberSince = new Date(profile.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
  
  const lastActive = new Date(profile.last_seen).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <Layout>
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center relative mb-4">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.username}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User size={48} className="text-gray-400" />
                    )}
                    {profile.is_verified && (
                      <div className="absolute bottom-0 right-0 bg-solidy-blue text-white rounded-full w-6 h-6 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <CardTitle className="text-2xl">{profile.username}</CardTitle>
                <CardDescription>
                  {profile.role === "seller" ? "Seller" : "Buyer"}
                  {profile.is_verified && " • Verified"}
                </CardDescription>
                
                {averageRating !== null && (
                  <div className="flex items-center justify-center mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={`${
                            star <= Math.round(averageRating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm">
                      {averageRating.toFixed(1)} ({reviews.length} reviews)
                    </span>
                  </div>
                )}

                {isOwnProfile && !isEditing && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </CardHeader>
              
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Your phone number"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Select
                        value={city}
                        onValueChange={setCity}
                      >
                        <SelectTrigger id="city">
                          <SelectValue placeholder="Select your city" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell others about yourself"
                        rows={4}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={handleUpdateProfile}
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setIsEditing(false)}
                        disabled={isUpdating}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profile.full_name && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                        <p>{profile.full_name}</p>
                      </div>
                    )}
                    
                    {profile.bio && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Bio</h3>
                        <p className="text-sm">{profile.bio}</p>
                      </div>
                    )}
                    
                    <div className="pt-4 space-y-3 text-sm">
                      {profile.city && (
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-gray-500" />
                          <span>{profile.city}, {profile.country}</span>
                        </div>
                      )}
                      
                      {isOwnProfile && profile.email && (
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-gray-500" />
                          <span>{profile.email}</span>
                        </div>
                      )}
                      
                      {(isOwnProfile || profile.phone_number) && profile.phone_number && (
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-gray-500" />
                          <span>{profile.phone_number}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-500" />
                        <span>Member since {memberSince}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-500" />
                        <span>Last active: {lastActive}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Listings and Reviews */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="listings">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="listings" className="text-base">
                  <Package className="mr-2 h-4 w-4" />
                  Listings ({products.length})
                </TabsTrigger>
                <TabsTrigger value="reviews" className="text-base">
                  <Star className="mr-2 h-4 w-4" />
                  Reviews ({reviews.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="listings">
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">No listings yet</h3>
                    <p className="mt-2 text-gray-500">
                      {isOwnProfile
                        ? "You haven't posted any listings yet."
                        : `${profile.username} hasn't posted any listings yet.`}
                    </p>
                    {isOwnProfile && (
                      <Button className="mt-4" asChild>
                        <a href="/post-listing">Post Your First Listing</a>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="reviews">
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">No reviews yet</h3>
                    <p className="mt-2 text-gray-500">
                      {isOwnProfile
                        ? "You haven't received any reviews yet."
                        : `${profile.username} hasn't received any reviews yet.`}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                                {review.reviewer.avatar_url ? (
                                  <img
                                    src={review.reviewer.avatar_url}
                                    alt={review.reviewer.username}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <User size={20} className="text-gray-500" />
                                )}
                              </div>
                              <div>
                                <CardTitle className="text-base">{review.reviewer.username}</CardTitle>
                                <CardDescription>
                                  {new Date(review.created_at).toLocaleDateString()}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={14}
                                  className={`${
                                    star <= review.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                          <p className="text-sm">{review.comment}</p>
                          {review.listing && (
                            <div className="mt-3 text-xs text-gray-500">
                              Review for:{" "}
                              <a
                                href={`/products/${review.listing.id}`}
                                className="text-solidy-blue hover:underline"
                              >
                                {review.listing.title}
                              </a>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
