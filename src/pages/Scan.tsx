
import React, { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import Header from "@/components/Header";
import BarcodeScanner from "@/components/BarcodeScanner";
import ProductDetail from "@/components/ProductDetail";
import { getProductByBarcode } from "@/services/foodApiService";
import { Product } from "@/types/product";
import { useLanguageStore } from "@/store/languageStore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Scan: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguageStore();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const handleScan = async (barcode: string) => {
    setIsScanning(true);
    
    try {
      const productData = await getProductByBarcode(barcode, currentLanguage.code);
      setProduct(productData);
      
      if (!productData) {
        toast({
          title: t("notFound"),
          description: "The product was not found in our database",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error scanning barcode:", error);
      toast({
        title: "Error",
        description: "Failed to get product information",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const resetScan = () => {
    setProduct(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header showBack title={product ? product.product_name : t("scanFood")} />
      
      <main className="flex-1 p-4 flex flex-col items-center justify-start pt-8">
        {!product ? (
          <BarcodeScanner onScan={handleScan} isScanning={isScanning} />
        ) : (
          <>
            <ProductDetail product={product} />
            <Button 
              onClick={resetScan}
              className="fixed bottom-4 bg-app-green hover:bg-app-green-light"
            >
              {t("scanFood")}
            </Button>
          </>
        )}
      </main>
    </div>
  );
};

export default Scan;
