
import { Product } from "../types/product";
import { toast } from "@/components/ui/use-toast";

// USDA API Integration
const USDA_API_KEY = "DEMO_KEY"; // Replace with actual API key in production
const USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1";

export const searchUSDAProducts = async (query: string): Promise<Product[] | null> => {
  try {
    const response = await fetch(
      `${USDA_BASE_URL}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      throw new Error(`USDA API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform USDA data to our Product interface
    return data.foods?.map((food: any) => ({
      id: food.fdcId,
      product_name: food.description,
      image_url: food.foodImage || "",
      nutriments: {
        energy_100g: food.foodNutrients.find((n: any) => n.nutrientName === "Energy")?.value || 0,
        carbohydrates_100g: food.foodNutrients.find((n: any) => n.nutrientName === "Carbohydrate, by difference")?.value || 0,
        sugars_100g: food.foodNutrients.find((n: any) => n.nutrientName === "Total Sugars")?.value || 0,
        fat_100g: food.foodNutrients.find((n: any) => n.nutrientName === "Total lipid (fat)")?.value || 0,
        proteins_100g: food.foodNutrients.find((n: any) => n.nutrientName === "Protein")?.value || 0,
        salt_100g: food.foodNutrients.find((n: any) => n.nutrientName === "Sodium, Na")?.value || 0,
      },
      ingredients_text: food.ingredients || "",
    })) || [];
  } catch (error) {
    console.error("Error fetching USDA products:", error);
    toast({
      title: "Error",
      description: "Failed to fetch data from USDA database",
      variant: "destructive",
    });
    return null;
  }
};

// Edamam API Integration
const EDAMAM_APP_ID = "YOUR_APP_ID"; // Replace with actual API key in production
const EDAMAM_APP_KEY = "YOUR_APP_KEY"; // Replace with actual API key in production
const EDAMAM_BASE_URL = "https://api.edamam.com/api/food-database/v2";

export const searchEdamamProducts = async (query: string): Promise<Product[] | null> => {
  try {
    const response = await fetch(
      `${EDAMAM_BASE_URL}/parser?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}&ingr=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      throw new Error(`Edamam API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform Edamam data to our Product interface
    return data.hints?.map((item: any) => {
      const food = item.food;
      return {
        id: food.foodId,
        product_name: food.label,
        image_url: food.image || "",
        nutriments: {
          energy_100g: food.nutrients.ENERC_KCAL || 0,
          carbohydrates_100g: food.nutrients.CHOCDF || 0,
          sugars_100g: 0, // Not directly provided by Edamam
          fat_100g: food.nutrients.FAT || 0,
          proteins_100g: food.nutrients.PROCNT || 0,
          salt_100g: 0, // Not directly provided by Edamam
          fiber_100g: food.nutrients.FIBTG || 0,
        },
        ingredients_text: "",
        health_warnings: item.foodWarnings || [],
      };
    }) || [];
  } catch (error) {
    console.error("Error fetching Edamam products:", error);
    toast({
      title: "Error",
      description: "Failed to fetch data from Edamam database",
      variant: "destructive",
    });
    return null;
  }
};

// Function to analyze health risks based on product data
export const analyzeHealthRisks = (product: Product): string[] => {
  const warnings: string[] = [];
  
  // Check for diabetes risk (high sugar)
  if ((product.nutriments?.sugars_100g || 0) > 22.5) {
    warnings.push("diabetesWarning");
  }
  
  // Check for high blood pressure risk (high salt)
  if ((product.nutriments?.salt_100g || 0) > 1.5) {
    warnings.push("bpWarning");
  }
  
  // Check for throat irritation risks
  if (product.ingredients_text?.toLowerCase().includes("spicy") ||
      product.ingredients_text?.toLowerCase().includes("chili") ||
      product.ingredients_text?.toLowerCase().includes("hot pepper")) {
    warnings.push("throatWarning");
  }
  
  // Check for thyroid concerns (high iodine foods)
  if (product.ingredients_text?.toLowerCase().includes("seaweed") ||
      product.ingredients_text?.toLowerCase().includes("kelp")) {
    warnings.push("thyroidWarning");
  }
  
  // Check for allergens
  if (product.allergens_tags && product.allergens_tags.length > 0) {
    warnings.push("allergyWarning");
  }
  
  return warnings;
};

// Function to determine suitable storage methods
export const determineSuitableStorage = (product: Product): string[] => {
  const storageTypes: string[] = [];
  
  // Check for refrigeration needs
  if (product.ingredients_text?.toLowerCase().includes("milk") ||
      product.ingredients_text?.toLowerCase().includes("dairy") ||
      product.ingredients_text?.toLowerCase().includes("fresh") ||
      product.ingredients_text?.toLowerCase().includes("meat") ||
      product.product_name?.toLowerCase().includes("yogurt")) {
    storageTypes.push("refrigerate");
  } else {
    storageTypes.push("roomTemperature");
  }
  
  // Check for light sensitivity
  if (product.ingredients_text?.toLowerCase().includes("oil") ||
      product.product_name?.toLowerCase().includes("oil")) {
    storageTypes.push("avoidSunlight");
  }
  
  // Check for freezer suitability
  if (product.ingredients_text?.toLowerCase().includes("frozen") ||
      product.product_name?.toLowerCase().includes("frozen")) {
    storageTypes.push("freezer");
  }
  
  return storageTypes;
};
