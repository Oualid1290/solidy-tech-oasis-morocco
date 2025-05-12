
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import { type Product } from "@/utils/listingHelpers";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight } from "lucide-react";

// Mock data for products
const mockProducts: Product[] = [
  {
    id: "1",
    title: "NVIDIA GeForce RTX 3080 Graphics Card",
    price: 8500,
    imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    condition: "New",
    location: "Casablanca",
    sellerRating: 4.8,
    category: "GPU"
  },
  {
    id: "2",
    title: "AMD Ryzen 9 5900X Processor",
    price: 4200,
    imageUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    condition: "New",
    location: "Rabat",
    sellerRating: 4.6,
    category: "CPU"
  },
  {
    id: "3",
    title: "Corsair Vengeance RGB Pro 32GB RAM",
    price: 1500,
    imageUrl: "https://images.unsplash.com/photo-1592664474496-8f3be7f5de23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    condition: "New",
    location: "Marrakech",
    sellerRating: 4.9,
    category: "RAM"
  },
  {
    id: "4",
    title: "ASUS ROG Strix Z590-E Gaming Motherboard",
    price: 2800,
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    condition: "Used",
    location: "Casablanca",
    sellerRating: 4.7,
    category: "Motherboard"
  }
];

const content = {
  en: {
    title: "Featured Products",
    subtitle: "Explore the latest hardware listings from our verified sellers",
    viewAll: "View All Products",
    sellYour: "Sell Your Hardware",
    viewDashboard: "View Your Dashboard"
  },
  fr: {
    title: "Produits en Vedette",
    subtitle: "Explorez les dernières annonces de matériel de nos vendeurs vérifiés",
    viewAll: "Voir Tous les Produits",
    sellYour: "Vendez Votre Matériel",
    viewDashboard: "Voir Votre Tableau de Bord"
  },
  ar: {
    title: "المنتجات المميزة",
    subtitle: "استكشف أحدث قوائم الأجهزة من البائعين المعتمدين لدينا",
    viewAll: "عرض جميع المنتجات",
    sellYour: "بيع الأجهزة الخاصة بك",
    viewDashboard: "عرض لوحة التحكم الخاصة بك"
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
    // Simulate loading state for 500ms
    setIsLoading(true);
    const timer = setTimeout(() => {
      setProducts(mockProducts);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Skeleton loading states
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-3"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-4 w-2/3 rounded mb-2"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-4 w-1/3 rounded mb-2"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-4 w-1/2 rounded"></div>
              </div>
            ))
          ) : (
            products.map((product) => (
              <div key={product.id} className="animate-scale-in">
                <Link to={`/products/${product.id}`} className="block h-full transition-transform hover:-translate-y-1 duration-200">
                  <ProductCard product={product} />
                </Link>
              </div>
            ))
          )}
        </div>
        
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
