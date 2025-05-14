
import { Product, SearchResult } from "../types/product";
import { toast } from "@/components/ui/use-toast";
import { searchUSDAProducts, searchEdamamProducts, analyzeHealthRisks } from "./additionalFoodApiService";

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
    
    const product = data.product as Product;
    
    // Analyze product for health warnings
    if (product) {
      product.health_warnings = analyzeHealthRisks(product);
    }
    
    return product;
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

// Function to search products in all databases
export const searchProducts = async (query: string, lang: string = 'en', page: number = 1): Promise<SearchResult | null> => {
  try {
    // First search Open Food Facts
    const response = await fetch(
      `${BASE_URL}/search?search_terms=${encodeURIComponent(query)}&lc=${lang}&page=${page}&page_size=10`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    const mainResults = data as SearchResult;
    
    // Check if we have enough results, if not, try alternative databases
    if (mainResults.products.length < 5) {
      try {
        // Search USDA in parallel
        const usdaPromise = searchUSDAProducts(query);
        const edamamPromise = searchEdamamProducts(query);
        
        const [usdaProducts, edamamProducts] = await Promise.all([usdaPromise, edamamPromise]);
        
        // Combine results
        if (usdaProducts && usdaProducts.length > 0) {
          mainResults.products = [...mainResults.products, ...usdaProducts];
        }
        
        if (edamamProducts && edamamProducts.length > 0) {
          mainResults.products = [...mainResults.products, ...edamamProducts];
        }
        
        // Update count
        mainResults.count = mainResults.products.length;
      } catch (alternativeError) {
        console.error("Error searching alternative databases:", alternativeError);
        // Continue with just Open Food Facts results
      }
    }
    
    return mainResults;
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
