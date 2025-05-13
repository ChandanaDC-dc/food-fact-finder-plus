
import { Product, SearchResult } from "../types/product";
import { toast } from "@/components/ui/use-toast";

const BASE_URL = "https://world.openfoodfacts.org/api/v2";

// Function to get product by barcode
export const getProductByBarcode = async (barcode: string, lang: string = 'en'): Promise<Product | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/product/${barcode}?lc=${lang}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === 0) {
      toast({
        title: "Product not found",
        description: "We couldn't find this product in our database.",
        variant: "destructive",
      });
      return null;
    }
    
    return data.product as Product;
  } catch (error) {
    console.error("Error fetching product:", error);
    toast({
      title: "Error",
      description: "Failed to fetch product information. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

// Function to search products
export const searchProducts = async (query: string, lang: string = 'en', page: number = 1): Promise<SearchResult | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/search?search_terms=${encodeURIComponent(query)}&lc=${lang}&page=${page}&page_size=10`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data as SearchResult;
  } catch (error) {
    console.error("Error searching products:", error);
    toast({
      title: "Error",
      description: "Failed to search products. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};
