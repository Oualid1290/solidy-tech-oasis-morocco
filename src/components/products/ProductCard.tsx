
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from "lucide-react";
import { formatCondition, type Product } from "@/utils/listingHelpers";

interface ProductProps {
  product: Product;
}

export type { Product };

export const ProductCard = ({ product }: ProductProps) => {
  const { id, title, price, imageUrl, condition, location, sellerRating, category } = product;

  return (
    <Link to={`/products/${id}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md group">
        <div className="aspect-square overflow-hidden relative">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <Badge className="absolute top-2 right-2 bg-solidy-blue">
            {condition}
          </Badge>
        </div>
        <CardContent className="pt-3 pb-1">
          <h3 className="font-medium truncate">{title}</h3>
          <p className="text-lg font-semibold text-solidy-blue">{price.toLocaleString()} MAD</p>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin size={12} />
            <span>{location}</span>
          </div>
        </CardContent>
        <CardFooter className="pt-0 pb-3 flex justify-between items-center">
          <Badge variant="outline" className="font-normal">
            {category}
          </Badge>
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs">{sellerRating}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
