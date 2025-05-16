
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/utils/listingHelpers";

// Mock product data - in a real app this would come from an API
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Gaming PC',
    description: 'High-performance gaming computer with RTX 4090',
    price: 25000,
    location: 'Casablanca',
    imageUrl: '/placeholder.svg',
    condition: 'New',
    sellerRating: 4.5,
    category: 'Computers'
  },
  {
    id: '2',
    title: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with Cherry MX switches',
    price: 800,
    location: 'Rabat',
    imageUrl: '/placeholder.svg',
    condition: 'Used',
    sellerRating: 4.2,
    category: 'Peripherals'
  },
  {
    id: '3',
    title: 'Ultrawide Monitor',
    description: '34" curved ultrawide monitor, 144Hz, 1ms response time',
    price: 3500,
    location: 'Marrakech',
    imageUrl: '/placeholder.svg',
    condition: 'Used',
    sellerRating: 4.8,
    category: 'Monitors'
  },
  {
    id: '4',
    title: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with long battery life',
    price: 350,
    location: 'Tangier',
    imageUrl: '/placeholder.svg',
    condition: 'New',
    sellerRating: 4.3,
    category: 'Peripherals'
  }
];

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  
  useEffect(() => {
    // In a real app, you would fetch products from an API here
    document.title = "Products - Solidy";
  }, []);
  
  const handleProductClick = (id: string) => {
    navigate(`/products/${id}`);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">All Products</CardTitle>
            <CardDescription>
              Browse all available hardware products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product.id} onClick={() => handleProductClick(product.id)}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Products;
