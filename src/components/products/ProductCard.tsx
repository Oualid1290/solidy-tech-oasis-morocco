
import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";

export interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  condition: "New" | "Used";
  location: string;
  sellerRating: number;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link 
      to={`/products/${product.id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`glass-card rounded-2xl overflow-hidden transition-all duration-300 ${isHovered ? 'shadow-xl transform -translate-y-1' : 'shadow-md'}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.condition === 'New' ? 'bg-solidy-mint text-gray-800' : 'bg-amber-400 text-gray-800'}`}>
              {product.condition}
            </span>
          </div>
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-solidy-blue text-white">
              {product.category}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-lg line-clamp-1 mb-2 group-hover:text-solidy-blue transition-colors">
            {product.title}
          </h3>
          <p className="text-xl font-semibold text-solidy-blue mb-2">
            {product.price.toLocaleString()} MAD
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{product.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span>{product.sellerRating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
