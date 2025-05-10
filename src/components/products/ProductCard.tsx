
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
      className="block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`frosted-glass rounded-2xl overflow-hidden transition-all duration-500 ${isHovered ? 'shadow-xl transform -translate-y-1' : 'shadow-md'}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
              product.condition === 'New' 
                ? 'bg-solidy-mint/90 backdrop-blur-sm text-white' 
                : 'bg-amber-400/90 backdrop-blur-sm text-white'
            }`}>
              {product.condition}
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-solidy-blue/90 backdrop-blur-sm text-white">
              {product.category}
            </span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-medium text-base line-clamp-1 mb-1 transition-colors">
            {product.title}
          </h3>
          <p className="text-lg font-semibold text-solidy-blue mb-3">
            {product.price.toLocaleString()} MAD
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span className="text-xs">{product.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span className="text-xs">{product.sellerRating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
