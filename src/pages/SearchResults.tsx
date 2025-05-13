
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { formatCondition, type Product } from "@/utils/listingHelpers";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Filter, Search, SlidersHorizontal, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [condition, setCondition] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("recent");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(location);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        
        // Fetch categories for filter
        const { data: categoriesData } = await supabase
          .from("categories")
          .select("id, name");
        
        if (categoriesData) {
          setCategories(categoriesData);
        }

        // Build query
        let listingsQuery = supabase
          .from("listings")
          .select(`
            id,
            title,
            price,
            condition,
            city,
            thumbnail_url,
            category_id,
            user:user_id(id, username),
            categories:category_id(id, name)
          `)
          .eq("status", "active");
        
        // Add search filter
        if (query) {
          listingsQuery = listingsQuery.ilike("title", `%${query}%`);
        }
        
        // Add location filter
        if (location) {
          listingsQuery = listingsQuery.eq("city", location);
        }

        const { data: listingsData, error } = await listingsQuery;

        if (error) throw error;

        // Transform to match our Product interface
        const transformedProducts: Product[] = listingsData.map((listing: any) => ({
          id: listing.id,
          title: listing.title,
          price: listing.price,
          imageUrl: listing.thumbnail_url || "/placeholder.svg",
          condition: formatCondition(listing.condition),
          location: listing.city,
          sellerRating: 4.5, // This would be calculated from reviews in a real app
          category: listing.categories?.name || "Unknown",
        }));

        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
        
        // Extract unique cities
        const uniqueCities = Array.from(
          new Set(listingsData.map((listing: any) => listing.city))
        );
        setCities(uniqueCities as string[]);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [query, location]);

  useEffect(() => {
    // Apply filters
    let filtered = [...products];

    // Price range
    filtered = filtered.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Condition
    if (condition) {
      filtered = filtered.filter((product) =>
        condition === "all" ? true : product.condition.toLowerCase() === condition.toLowerCase()
      );
    }

    // Location
    if (selectedCity) {
      filtered = filtered.filter(
        (product) => product.location.toLowerCase() === selectedCity.toLowerCase()
      );
    }
    
    // Category
    if (selectedCategory) {
      filtered = filtered.filter((product) => {
        // Find the category in our categories list by name
        const category = categories.find(c => c.id === selectedCategory);
        return product.category === category?.name;
      });
    }

    // Sort products
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "recent":
      default:
        // Keep original order which is by recency
        break;
    }

    setFilteredProducts(filtered);
  }, [priceRange, condition, sortBy, products, selectedCity, selectedCategory, categories]);

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            Search Results
            {query && <span className="text-lg font-normal text-gray-500">for "{query}"</span>}
          </h1>
          <div className="text-sm text-gray-500">
            {filteredProducts.length} products
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="frosted-glass p-4 rounded-xl sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Search</h3>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Refine your search"
                      defaultValue={query}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Category</h3>
                  <Select value={selectedCategory || undefined} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">
                    Price Range ({priceRange[0]} - {priceRange[1]} MAD)
                  </h3>
                  <Slider
                    defaultValue={[0, 10000]}
                    max={10000}
                    step={100}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="my-4"
                  />
                  <div className="flex justify-between">
                    <span className="text-xs">{priceRange[0]} MAD</span>
                    <span className="text-xs">{priceRange[1]} MAD</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Condition</h3>
                  <RadioGroup
                    value={condition || "all"}
                    onValueChange={setCondition}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all">All</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="new" id="new" />
                      <Label htmlFor="new">New</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="used" id="used" />
                      <Label htmlFor="used">Used</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Location</h3>
                  <Select value={selectedCity || undefined} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="All locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_locations">All locations</SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filters & Sort */}
            <div className="flex gap-2 mb-6 lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="py-4 space-y-6">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="search">
                        <AccordionTrigger>Search</AccordionTrigger>
                        <AccordionContent>
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Refine your search"
                              defaultValue={query}
                              className="pl-8"
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="category">
                        <AccordionTrigger>Category</AccordionTrigger>
                        <AccordionContent>
                          <Select value={selectedCategory || undefined} onValueChange={setSelectedCategory}>
                            <SelectTrigger>
                              <SelectValue placeholder="All categories" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All categories</SelectItem>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="price">
                        <AccordionTrigger>Price Range</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <Slider
                              defaultValue={[0, 10000]}
                              max={10000}
                              step={100}
                              value={priceRange}
                              onValueChange={(value) =>
                                setPriceRange(value as [number, number])
                              }
                            />
                            <div className="flex justify-between">
                              <span>{priceRange[0]} MAD</span>
                              <span>{priceRange[1]} MAD</span>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="condition">
                        <AccordionTrigger>Condition</AccordionTrigger>
                        <AccordionContent>
                          <RadioGroup
                            value={condition || "all"}
                            onValueChange={setCondition}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="all" id="m-all" />
                              <Label htmlFor="m-all">All</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="new" id="m-new" />
                              <Label htmlFor="m-new">New</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="used" id="m-used" />
                              <Label htmlFor="m-used">Used</Label>
                            </div>
                          </RadioGroup>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="location">
                        <AccordionTrigger>Location</AccordionTrigger>
                        <AccordionContent>
                          <Select
                            value={selectedCity || undefined}
                            onValueChange={setSelectedCity}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="All locations" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all_locations">All locations</SelectItem>
                              {cities.map((city) => (
                                <SelectItem key={city} value={city}>
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </SheetContent>
              </Sheet>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="flex-1">
                  <div className="flex items-center">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    <span>Sort</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Desktop Sort */}
            <div className="hidden lg:flex justify-end mb-6">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <div className="flex items-center">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    <span>Sort By</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-solidy-blue" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h2 className="text-xl font-medium mb-2">No products found</h2>
                <p className="text-gray-500 max-w-md mx-auto">
                  {query ? (
                    <>We couldn't find any listings matching "{query}". Try adjusting your search or filter criteria.</>
                  ) : (
                    <>Try adjusting your filter criteria or search for something else.</>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchResults;
