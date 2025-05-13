
import React, { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import Header from "@/components/Header";
import { useLanguageStore } from "@/store/languageStore";
import { searchProducts } from "@/services/foodApiService";
import { Product, SearchResult } from "@/types/product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search as SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Search: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguageStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      const results = await searchProducts(searchQuery, currentLanguage.code);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const viewProductDetails = (product: Product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header showBack title={t("search")} />
      
      <main className="flex-1 p-4">
        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
            autoFocus
          />
          <Button 
            type="submit" 
            disabled={isSearching}
            className="bg-app-green hover:bg-app-green-light"
          >
            <SearchIcon className="h-5 w-5" />
          </Button>
        </form>
        
        {isSearching && (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-app-green"></div>
          </div>
        )}
        
        {searchResults && (
          <div className="space-y-4">
            <p className="text-gray-500">
              {searchResults.count} {searchResults.count === 1 ? "result" : "results"}
            </p>
            
            {searchResults.products.length === 0 && (
              <p className="text-center py-8">{t("noResults")}</p>
            )}
            
            {searchResults.products.map((product) => (
              <Card 
                key={product.id} 
                className="p-3 flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => viewProductDetails(product)}
              >
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.product_name || "Product"} 
                    className="w-16 h-16 object-contain rounded"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{product.product_name}</h3>
                  {product.nutriments?.energy_100g && (
                    <p className="text-sm text-gray-500">{product.nutriments.energy_100g} kcal</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
