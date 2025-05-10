
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard, type Product } from "@/components/products/ProductCard";
import { useLanguage } from "@/context/LanguageContext";

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
    viewAll: "View All Products"
  },
  fr: {
    title: "Produits en Vedette",
    subtitle: "Explorez les dernières annonces de matériel de nos vendeurs vérifiés",
    viewAll: "Voir Tous les Produits"
  },
  ar: {
    title: "المنتجات المميزة",
    subtitle: "استكشف أحدث قوائم الأجهزة من البائعين المعتمدين لدينا",
    viewAll: "عرض جميع المنتجات"
  }
};

export function FeaturedProducts() {
  const { language } = useLanguage();
  const t = content[language as keyof typeof content];
  const isRtl = language === "ar";
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    // Simulate fetching products
    setProducts(mockProducts);
  }, []);
  
  return (
    <section className={`py-16 px-6 md:px-12 ${isRtl ? 'text-right' : 'text-left'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">{t.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">{t.subtitle}</p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0 rounded-full">
            {t.viewAll}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="animate-scale-in">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
