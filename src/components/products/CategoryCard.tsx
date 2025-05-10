
import { useState } from "react";
import { Link } from "react-router-dom";
import { type LucideIcon } from "lucide-react";

interface CategoryCardProps {
  title: string;
  icon: LucideIcon;
  count: number;
  slug: string;
  iconColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export function CategoryCard({
  title,
  icon: Icon,
  count,
  slug,
  iconColor = "text-white",
  gradientFrom = "from-solidy-blue",
  gradientTo = "to-solidy-mint",
}: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link
      to={`/products/category/${slug}`}
      className="block hover-scale"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center">
        <div className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center bg-gradient-to-br ${gradientFrom} ${gradientTo} ${isHovered ? 'animate-floating' : ''}`}>
          <Icon size={28} className={iconColor} />
        </div>
        <h3 className="text-lg font-medium mb-1">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{count} items</p>
      </div>
    </Link>
  );
}
