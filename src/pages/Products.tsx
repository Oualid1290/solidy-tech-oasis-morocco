
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Mock product data - in a real app this would come from an API
const mockProducts = [
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
    id: '2',
    title: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with Cherry MX switches',
    price: 800,
    location: 'Rabat',
    image: '/placeholder.svg',
    condition: 'Used - Like New',
    seller: 'PCEnthusiast',
    postedDate: '2025-05-14'
  },
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
  },
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
];

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(mockProducts);
  
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
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Products;
