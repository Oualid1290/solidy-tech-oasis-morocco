
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Mock product data - in a real app this would come from an API filtered by location
const mockProductsByLocation = {
  casablanca: [
    {
      id: '1',
      title: 'Gaming PC',
      description: 'High-performance gaming computer with RTX 4090',
      price: 25000,
      location: 'Casablanca',
      image: '/placeholder.svg',
      condition: 'New',
      seller: 'TechMaster',
      postedDate: '2025-05-12'
    },
    {
      id: '5',
      title: 'Gaming Headset',
      description: '7.1 surround sound gaming headset with noise cancellation',
      price: 650,
      location: 'Casablanca',
      image: '/placeholder.svg',
      condition: 'New',
      seller: 'AudioGuru',
      postedDate: '2025-05-11'
    }
  ],
  rabat: [
    {
      id: '2',
      title: 'Mechanical Keyboard',
      description: 'RGB mechanical keyboard with Cherry MX switches',
      price: 800,
      location: 'Rabat',
      image: '/placeholder.svg',
      condition: 'Used - Like New',
      seller: 'PCEnthusiast',
      postedDate: '2025-05-14'
    }
  ],
  marrakech: [
    {
      id: '3',
      title: 'Ultrawide Monitor',
      description: '34" curved ultrawide monitor, 144Hz, 1ms response time',
      price: 3500,
      location: 'Marrakech',
      image: '/placeholder.svg',
      condition: 'Used - Good',
      seller: 'DisplayPro',
      postedDate: '2025-05-10'
    }
  ],
  fes: [
    {
      id: '6',
      title: 'Raspberry Pi 4',
      description: 'Raspberry Pi 4 Model B with 8GB RAM',
      price: 950,
      location: 'Fes',
      image: '/placeholder.svg',
      condition: 'New',
      seller: 'MakerSpace',
      postedDate: '2025-05-08'
    }
  ],
  tangier: [
    {
      id: '4',
      title: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse with long battery life',
      price: 350,
      location: 'Tangier',
      image: '/placeholder.svg',
      condition: 'New',
      seller: 'MouseMaster',
      postedDate: '2025-05-15'
    }
  ]
};

// Map of location slugs to display names
const locationNames: Record<string, string> = {
  casablanca: 'Casablanca',
  rabat: 'Rabat',
  marrakech: 'Marrakech',
  fes: 'Fes',
  tangier: 'Tangier'
};

const LocationPage = () => {
  const { locationSlug } = useParams<{ locationSlug: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [locationName, setLocationName] = useState<string>('');
  
  useEffect(() => {
    if (locationSlug) {
      // In a real app, fetch products for this location from an API
      const locationProducts = mockProductsByLocation[locationSlug as keyof typeof mockProductsByLocation] || [];
      setProducts(locationProducts);
      setLocationName(locationNames[locationSlug] || locationSlug);
      document.title = `${locationNames[locationSlug] || locationSlug} - Solidy`;
    }
  }, [locationSlug]);
  
  const handleProductClick = (id: string) => {
    navigate(`/products/${id}`);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="text-solidy-blue" />
              <CardTitle className="text-3xl">{locationName}</CardTitle>
            </div>
            <CardDescription>
              Browse hardware products available in {locationName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard 
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    location={product.location}
                    imageUrl={product.image}
                    onClick={() => handleProductClick(product.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No products found in {locationName}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LocationPage;
