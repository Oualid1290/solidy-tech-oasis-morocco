
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
 * @returns Database condition ("new" or "used")
 */
export const normalizeCondition = (condition: "New" | "Used"): "new" | "used" => {
  return condition === "New" ? "new" : "used";
};
