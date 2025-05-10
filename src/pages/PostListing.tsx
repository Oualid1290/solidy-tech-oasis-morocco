
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Upload, X, Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters",
  }).max(100),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters",
  }),
  price: z.coerce.number().min(1, {
    message: "Price must be at least 1 MAD",
  }),
  is_negotiable: z.boolean().default(false),
  category_id: z.string({
    required_error: "Please select a category",
  }),
  condition: z.enum(["new", "used"], {
    required_error: "Please select a condition",
  }),
  city: z.string({
    required_error: "Please select a city",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const PostListing = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [cities, setCities] = useState<string[]>([
    "Casablanca", "Rabat", "Marrakesh", "Fes", "Tangier", "Agadir",
    "Meknes", "Oujda", "Kenitra", "Tetouan", "Safi", "Mohammedia",
    "El Jadida", "Taza", "Nador"
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<{
    file: File;
    preview: string;
    uploading?: boolean;
  }[]>([]);
  const [thumbnailIndex, setThumbnailIndex] = useState<number | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      is_negotiable: false,
      city: "",
      condition: "new",
    },
  });

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("name");
          
        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setImages((prev) => {
        const updatedImages = [...prev, ...newImages];
        // If this is the first image, set it as thumbnail
        if (thumbnailIndex === null && updatedImages.length > 0) {
          setThumbnailIndex(0);
        }
        return updatedImages;
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      
      // Update thumbnail index if needed
      if (thumbnailIndex === index) {
        setThumbnailIndex(newImages.length > 0 ? 0 : null);
      } else if (thumbnailIndex !== null && index < thumbnailIndex) {
        setThumbnailIndex(thumbnailIndex - 1);
      }
      
      return newImages;
    });
  };

  const setAsThumbnail = (index: number) => {
    setThumbnailIndex(index);
  };

  const onSubmit = async (data: FormValues) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to post a listing",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: "Images required",
        description: "Please upload at least one image for your listing",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload thumbnail first
      let thumbnailUrl = "";
      if (thumbnailIndex !== null) {
        const thumbnailFile = images[thumbnailIndex].file;
        const thumbnailFileName = `${user.id}/${Date.now()}-thumbnail-${thumbnailFile.name}`;
        
        const { error: uploadError, data: thumbnailData } = await supabase.storage
          .from("listing-images")
          .upload(thumbnailFileName, thumbnailFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("listing-images")
          .getPublicUrl(thumbnailFileName);

        thumbnailUrl = publicUrlData.publicUrl;
      }

      // Create the listing
      const { data: listingData, error: listingError } = await supabase
        .from("listings")
        .insert({
          ...data,
          user_id: user.id,
          thumbnail_url: thumbnailUrl,
        })
        .select()
        .single();

      if (listingError) throw listingError;

      // Upload other images
      for (let i = 0; i < images.length; i++) {
        if (i === thumbnailIndex) continue; // Skip thumbnail, it's already uploaded
        
        const imageFile = images[i].file;
        const fileName = `${user.id}/${Date.now()}-${i}-${imageFile.name}`;
        
        const { error: uploadError, data: imageData } = await supabase.storage
          .from("listing-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("listing-images")
          .getPublicUrl(fileName);

        // Add to listing_images table
        await supabase
          .from("listing_images")
          .insert({
            listing_id: listingData.id,
            image_url: publicUrlData.publicUrl,
          });
      }

      toast({
        title: "Listing created",
        description: "Your listing has been created successfully",
      });

      navigate(`/products/${listingData.id}`);
    } catch (error: any) {
      console.error("Error creating listing:", error);
      toast({
        title: "Error creating listing",
        description: error.message || "An error occurred while creating your listing",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return (
    <Layout>
      <div className="container py-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Post a New Listing</CardTitle>
            <CardDescription>
              Share your hardware with potential buyers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter a descriptive title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (MAD)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="Enter price"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_negotiable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="mb-0">Price is negotiable</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Condition" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="used">Used</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select City" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your product in detail"
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div>
                    <Label>Upload Images</Label>
                    <div className="mt-2">
                      <Label
                        htmlFor="image-upload"
                        className="cursor-pointer block border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-primary transition-colors"
                      >
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <span className="mt-2 block text-sm font-medium">
                          Click to upload images
                        </span>
                        <span className="mt-1 block text-xs text-gray-500">
                          PNG, JPG, WEBP up to 5 MB each
                        </span>
                      </Label>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>

                  {images.length > 0 && (
                    <div className="space-y-2">
                      <Label>
                        Preview Images{" "}
                        <span className="text-sm text-gray-500">
                          (Click on an image to set as thumbnail)
                        </span>
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                          <div
                            key={index}
                            className={`relative aspect-square rounded-md overflow-hidden border ${
                              thumbnailIndex === index
                                ? "border-solidy-blue shadow-md"
                                : "border-gray-300"
                            }`}
                          >
                            <img
                              src={image.preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                              onClick={() => removeImage(index)}
                            >
                              <X size={14} />
                            </button>
                            {thumbnailIndex === index && (
                              <div className="absolute bottom-0 left-0 right-0 bg-solidy-blue/70 text-white text-xs py-1 px-2 text-center">
                                Thumbnail
                              </div>
                            )}
                            {thumbnailIndex !== index && (
                              <button
                                type="button"
                                className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors"
                                onClick={() => setAsThumbnail(index)}
                              ></button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish Listing"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PostListing;
