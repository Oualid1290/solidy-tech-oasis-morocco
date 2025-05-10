
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { MapPin, Calendar, MessageCircle, Share2, Heart, User, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  is_negotiable: boolean;
  condition: string;
  city: string;
  created_at: string;
  status: string;
  thumbnail_url: string;
  category: {
    name: string;
    slug: string;
  };
  user: {
    id: string;
    username: string;
    avatar_url: string | null;
    last_seen: string;
  };
  images: {
    id: string;
    image_url: string;
  }[];
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [chatId, setChatId] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        // Fetch the listing with user and category details
        const { data: listingData, error } = await supabase
          .from('listings')
          .select(`
            *,
            category:category_id(name, slug),
            user:user_id(id, username, avatar_url, last_seen)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        // Fetch images for this listing
        const { data: imagesData, error: imagesError } = await supabase
          .from('listing_images')
          .select('id, image_url')
          .eq('listing_id', id);

        if (imagesError) throw imagesError;

        const fullListing = {
          ...listingData,
          images: imagesData || [],
        };

        setListing(fullListing);
        if (fullListing.thumbnail_url) {
          setActiveImage(fullListing.thumbnail_url);
        } else if (imagesData && imagesData.length > 0) {
          setActiveImage(imagesData[0].image_url);
        }

        // Record a view
        if (user) {
          await supabase.from('views').insert({
            listing_id: id,
            viewer_id: user.id
          });
        } else {
          // For anonymous users, we could use fingerprinting here
          await supabase.from('views').insert({
            listing_id: id,
            fingerprint_hash: 'anonymous' // In a real app, use actual fingerprint
          });
        }
      } catch (error) {
        console.error('Error fetching listing:', error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id, user, toast]);

  useEffect(() => {
    // Check if there's an existing chat between the current user and the seller
    const checkExistingChat = async () => {
      if (!isAuthenticated || !user || !listing) return;
      
      // Don't create a chat with yourself
      if (user.id === listing.user.id) return;

      try {
        const { data, error } = await supabase
          .from('chats')
          .select('id')
          .eq('listing_id', id)
          .eq('buyer_id', user.id)
          .eq('seller_id', listing.user.id)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setChatId(data.id);
        }
      } catch (error) {
        console.error('Error checking existing chat:', error);
      }
    };

    checkExistingChat();
  }, [id, isAuthenticated, user, listing]);

  const handleContactSeller = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to contact the seller",
        variant: "destructive",
      });
      return;
    }

    if (!listing) return;

    // Don't allow contacting yourself
    if (user?.id === listing.user.id) {
      toast({
        title: "Error",
        description: "You cannot contact yourself",
        variant: "destructive",
      });
      return;
    }

    try {
      if (chatId) {
        // Chat already exists, navigate to it
        window.location.href = `/chat/${chatId}`;
        return;
      }
      
      // Create a new chat
      const { data, error } = await supabase
        .from('chats')
        .insert({
          listing_id: listing.id,
          buyer_id: user?.id,
          seller_id: listing.user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Navigate to the chat
      window.location.href = `/chat/${data.id}`;
    } catch (error) {
      console.error('Error creating chat:', error);
      toast({
        title: "Error",
        description: "Failed to initiate chat with seller",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-pulse text-lg">Loading product details...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!listing) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Product not found</h1>
            <p>This product may have been removed or is unavailable.</p>
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const formattedDate = new Date(listing.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Layout>
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Images */}
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
              <img
                src={activeImage || "/placeholder.svg"}
                alt={listing.title}
                className="w-full h-full object-contain"
              />
            </div>
            
            {listing.images && listing.images.length > 0 && (
              <div className="grid grid-cols-6 gap-2">
                {listing.thumbnail_url && (
                  <button
                    className={`aspect-square rounded-lg overflow-hidden ${
                      activeImage === listing.thumbnail_url ? "ring-2 ring-solidy-blue" : ""
                    }`}
                    onClick={() => setActiveImage(listing.thumbnail_url)}
                  >
                    <img
                      src={listing.thumbnail_url}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </button>
                )}
                {listing.images.map((image) => (
                  <button
                    key={image.id}
                    className={`aspect-square rounded-lg overflow-hidden ${
                      activeImage === image.image_url ? "ring-2 ring-solidy-blue" : ""
                    }`}
                    onClick={() => setActiveImage(image.image_url)}
                  >
                    <img
                      src={image.image_url}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex gap-2 mb-2">
                <Badge variant="outline" className="bg-solidy-blue/10">
                  {listing.category.name}
                </Badge>
                <Badge variant={listing.condition === 'new' ? 'default' : 'secondary'}>
                  {listing.condition === 'new' ? 'New' : 'Used'}
                </Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">{listing.title}</h1>
              <div className="flex items-center mt-2 text-xl font-semibold text-solidy-blue">
                {listing.price.toLocaleString()} MAD
                {listing.is_negotiable && (
                  <span className="ml-2 text-sm font-normal text-gray-500">(Negotiable)</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-500" />
                <span>{listing.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-500" />
                <span>Posted on {formattedDate}</span>
              </div>
            </div>

            <div className="py-3 border-t border-b">
              <Link to={`/profile/${listing.user.username}`} className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {listing.user.avatar_url ? (
                    <img 
                      src={listing.user.avatar_url} 
                      alt={listing.user.username} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={24} className="text-gray-500" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{listing.user.username}</div>
                  <div className="text-sm text-gray-500">
                    {listing.user.last_seen ? (
                      <>Last seen {new Date(listing.user.last_seen).toLocaleDateString()}</>
                    ) : (
                      "New seller"
                    )}
                  </div>
                </div>
              </Link>
            </div>

            <div className="space-y-4">
              <Button 
                className="w-full"
                size="lg"
                onClick={handleContactSeller}
                disabled={user?.id === listing.user.id}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                {chatId ? "Continue Chat" : "Contact Seller"}
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="flex-1">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="flex-1">
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="flex-1">
                  <ExternalLink className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {listing.description}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
