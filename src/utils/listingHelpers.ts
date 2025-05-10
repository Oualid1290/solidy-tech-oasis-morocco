
/**
 * Converts database condition value to display format
 * @param condition Database condition ("new" or "used") 
 * @returns Display condition ("New" or "Used")
 */
export const formatCondition = (condition: string): "New" | "Used" => {
  return condition === "new" ? "New" : "Used";
};

/**
 * Converts display condition value to database format
 * @param condition Display condition ("New" or "Used")
 * @returns Database condition ("new" | "used")
 */
export const normalizeCondition = (condition: "New" | "Used"): "new" | "used" => {
  return condition === "New" ? "new" : "used";
};

// Export type for Product interface that can be reused across the app
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

// Export interface for Review
export interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: {
    username: string;
    avatar_url: string | null;
  };
  listing: {
    title: string;
    id: string;
  };
}
