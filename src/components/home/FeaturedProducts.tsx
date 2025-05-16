
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import { type Product } from "@/utils/listingHelpers";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const content = {
  en: {
    title: "Featured Products",
    subtitle: "Explore the latest hardware listings from our verified sellers",
    viewAll: "View All Products",
    sellYour: "Sell Your Hardware",
    viewDashboard: "View Your Dashboard",
    noProducts: "No products available at the moment. Check back soon!"
  },
  fr: {
    title: "Produits en Vedette",
    subtitle: "Explorez les dernières annonces de matériel de nos vendeurs vérifiés",
    viewAll: "Voir Tous les Produits",
    sellYour: "Vendez Votre Matériel",
    viewDashboard: "Voir Votre Tableau de Bord",
    noProducts: "Aucun produit disponible pour le moment. Revenez bientôt!"
  },
  ar: {
    title: "المنتجات المميزة",
    subtitle: "استكشف أحدث قوائم الأجهزة من البائعين المعتمدين لدينا",
    viewAll: "عرض جميع المنتجات",
    sellYour: "بيع الأجهزة الخاصة بك",
    viewDashboard: "عرض لوحة التحكم الخاصة بك",
    noProducts: "لا توجد منتجات متاحة في الوقت الحالي. تحقق مرة أخرى قريبا!"
  }
};

export function FeaturedProducts() {
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const t = content[language as keyof typeof content];
  const isRtl = language === "ar";
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Fetch up to 4 most recent active listings
        const { data: listings, error } = await supabase
          .from('listings')
          .select(`
            id,
            title,
            description,
            price,
            thumbnail_url,
            condition,
            city,
            user_id,
            category_id,
            created_at
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(4);
        
        if (error) {
          console.error("Error fetching products:", error);
          throw error;
        }
        
        if (listings && listings.length > 0) {
          // Transform data to match Product type
          const productList: Product[] = listings.map(listing => ({
            id: listing.id,
            title: listing.title,
            description: listing.description || "No description available",
            price: listing.price,
            imageUrl: listing.thumbnail_url || "/placeholder.svg",
            condition: listing.condition === 'new' ? 'New' : 'Used',
            location: listing.city,
            sellerRating: 0, // This could be fetched from a separate ratings table
            category: listing.category_id || "Unknown"
          }));
          
          setProducts(productList);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  return (
    <section className={`py-16 px-6 md:px-12 ${isRtl ? 'text-right' : 'text-left'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">{t.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">{t.subtitle}</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Button variant="outline" className="rounded-full" asChild>
              <Link to="/products/category/all">
                {t.viewAll} <ArrowRight size={16} className="ml-1" />
              </Link>
            </Button>
            
            {isAuthenticated ? (
              <Button 
                className="rounded-full bg-gradient-to-r from-solidy-blue to-solidy-mint hover:opacity-90 transition-opacity"
                asChild
              >
                <Link to="/post-listing">{t.sellYour}</Link>
              </Button>
            ) : (
              <Button 
                className="rounded-full bg-gradient-to-r from-solidy-blue to-solidy-mint hover:opacity-90 transition-opacity"
                asChild
              >
                <Link to="/auth?signup=true">{t.sellYour}</Link>
              </Button>
            )}
          </div>
        </div>
        
        {isLoading ? (
          // Skeleton loading states
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-3"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-4 w-2/3 rounded mb-2"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-4 w-1/3 rounded mb-2"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-4 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="animate-scale-in">
                <Link to={`/products/${product.id}`} className="block h-full transition-transform hover:-translate-y-1 duration-200">
                  <ProductCard product={product} />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500 dark:text-gray-400">{t.noProducts}</p>
          </div>
        )}
        
        {isAuthenticated && (
          <div className="mt-12 text-center">
            <Button 
              variant="outline"
              size="lg"
              className="rounded-full"
              asChild
            >
              <Link to="/dashboard">
                {t.viewDashboard} <ArrowRight size={16} className="ml-1" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
