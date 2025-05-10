
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/products/ProductCard";
import { formatCondition, type Product, type Review } from "@/utils/listingHelpers";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Loader2, MapPin, MessageSquare, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface UserProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  full_name: string | null;
  bio: string | null;
  city: string | null;
  created_at: string;
  listings_count: number;
  reviews_count: number;
  average_rating: number;
}

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeListings, setActiveListings] = useState<Product[]>([]);
  const [soldListings, setSoldListings] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("username", username)
          .single();

        if (profileError) throw profileError;

        // Get counts and stats
        const { count: listingsCount } = await supabase
          .from("listings")
          .select("*", { count: "exact", head: true })
          .eq("user_id", profileData.id);

        const { count: reviewsCount } = await supabase
          .from("reviews")
          .select("*", { count: "exact", head: true })
          .eq("reviewed_user_id", profileData.id);

        const { data: ratingsData } = await supabase
          .from("reviews")
          .select("rating")
          .eq("reviewed_user_id", profileData.id);

        const averageRating =
          ratingsData && ratingsData.length > 0
            ? ratingsData.reduce((sum: number, item: any) => sum + item.rating, 0) /
              ratingsData.length
            : 0;

        setProfile({
          ...profileData,
          listings_count: listingsCount || 0,
          reviews_count: reviewsCount || 0,
          average_rating: averageRating,
        });

        // Check if this is the current user's profile
        if (user && user.id === profileData.id) {
          setIsCurrentUser(true);
        }

        // Fetch active listings
        const { data: activeListingsData } = await supabase
          .from("listings")
          .select("*")
          .eq("user_id", profileData.id)
          .eq("status", "active")
          .order("created_at", { ascending: false });

        if (activeListingsData) {
          const formattedActiveListings: Product[] = activeListingsData.map((listing: any) => ({
            id: listing.id,
            title: listing.title,
            price: listing.price,
            imageUrl: listing.thumbnail_url || "/placeholder.svg",
            condition: formatCondition(listing.condition),
            location: listing.city,
            sellerRating: averageRating,
            category: listing.category_id, // This would ideally be the category name
          }));
          setActiveListings(formattedActiveListings);
        }

        // Fetch sold listings
        const { data: soldListingsData } = await supabase
          .from("listings")
          .select("*")
          .eq("user_id", profileData.id)
          .eq("status", "sold")
          .order("updated_at", { ascending: false });

        if (soldListingsData) {
          const formattedSoldListings: Product[] = soldListingsData.map((listing: any) => ({
            id: listing.id,
            title: listing.title,
            price: listing.price,
            imageUrl: listing.thumbnail_url || "/placeholder.svg",
            condition: formatCondition(listing.condition),
            location: listing.city,
            sellerRating: averageRating,
            category: listing.category_id, // This would ideally be the category name
          }));
          setSoldListings(formattedSoldListings);
        }

        // Fetch reviews with proper query to avoid join issues
        const { data: reviewsData } = await supabase
          .from("reviews")
          .select(`
            id,
            rating,
            comment,
            created_at,
            reviewer_id,
            listing_id
          `)
          .eq("reviewed_user_id", profileData.id)
          .order("created_at", { ascending: false });

        if (reviewsData) {
          // Fetch reviewer details separately to avoid join errors
          const reviewsWithDetails = await Promise.all(
            reviewsData.map(async (review) => {
              // Get reviewer info
              const { data: reviewerData } = await supabase
                .from("users")
                .select("username, avatar_url")
                .eq("id", review.reviewer_id)
                .single();

              // Get listing info
              const { data: listingData } = await supabase
                .from("listings")
                .select("title, id")
                .eq("id", review.listing_id)
                .single();

              return {
                ...review,
                reviewer: reviewerData || { username: "Unknown User", avatar_url: null },
                listing: listingData || { title: "Unknown Listing", id: review.listing_id },
              };
            })
          );

          setReviews(reviewsWithDetails as Review[]);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username, user]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex justify-center items-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-solidy-blue" />
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
            <h1 className="text-2xl font-bold mb-4">User not found</h1>
            <p>The user you're looking for doesn't exist.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        {/* Profile Header */}
        <div className="frosted-glass p-6 rounded-xl mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24 border-2 border-solidy-blue">
              <AvatarImage src={profile.avatar_url || ""} alt={profile.username} />
              <AvatarFallback className="text-2xl">
                {profile.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold mb-1">{profile.full_name || profile.username}</h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>
                    {profile.average_rating.toFixed(1)} ({profile.reviews_count} reviews)
                  </span>
                </div>
                {profile.city && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.city}</span>
                  </div>
                )}
                <Badge variant="outline">Member since {new Date(profile.created_at).getFullYear()}</Badge>
              </div>
              {profile.bio && <p className="text-gray-600 dark:text-gray-300 mb-4">{profile.bio}</p>}

              {!isCurrentUser && (
                <Button className="rounded-full">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Button>
              )}
              {isCurrentUser && (
                <Link to="/dashboard">
                  <Button variant="outline" className="rounded-full">
                    Edit Profile
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Tabs for Listings and Reviews */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="active">Active Listings ({activeListings.length})</TabsTrigger>
            <TabsTrigger value="sold">Sold Items ({soldListings.length})</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activeListings.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium mb-2">No active listings</h2>
                <p className="text-gray-500 mb-6">
                  {isCurrentUser
                    ? "You don't have any active listings yet."
                    : "This user doesn't have any active listings yet."}
                </p>
                {isCurrentUser && (
                  <Link to="/post-listing">
                    <Button>Post a Listing</Button>
                  </Link>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sold">
            {soldListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {soldListings.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium mb-2">No sold items</h2>
                <p className="text-gray-500">
                  {isCurrentUser
                    ? "You haven't sold any items yet."
                    : "This user hasn't sold any items yet."}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews">
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="frosted-glass p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.reviewer.avatar_url || ""} alt={review.reviewer.username} />
                          <AvatarFallback>
                            {review.reviewer.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{review.reviewer.username}</div>
                          <div className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm mb-2">{review.comment}</p>
                    <div className="text-xs text-gray-500">
                      For:{" "}
                      <Link to={`/products/${review.listing.id}`} className="text-solidy-blue hover:underline">
                        {review.listing.title}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium mb-2">No reviews yet</h2>
                <p className="text-gray-500">
                  {isCurrentUser
                    ? "You haven't received any reviews yet."
                    : "This user hasn't received any reviews yet."}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
