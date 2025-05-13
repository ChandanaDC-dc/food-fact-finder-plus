
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import Header from "@/components/Header";
import ProductDetail from "@/components/ProductDetail";
import { Product } from "@/types/product";
import { getProductByBarcode } from "@/services/foodApiService";
import { useLanguageStore } from "@/store/languageStore";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguageStore();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [product, setProduct] = useState<Product | null>(
    location.state?.product || null
  );
  const [isLoading, setIsLoading] = useState(!location.state?.product);

  useEffect(() => {
    if (!product && id) {
      const fetchProduct = async () => {
        setIsLoading(true);
        try {
          const productData = await getProductByBarcode(id, currentLanguage.code);
          if (productData) {
            setProduct(productData);
          } else {
            toast({
              title: t("notFound"),
              description: "The product was not found in our database",
              variant: "destructive",
            });
            navigate("/search");
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          toast({
            title: "Error",
            description: "Failed to get product information",
            variant: "destructive",
          });
          navigate("/search");
        } finally {
          setIsLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id, currentLanguage.code, product, navigate, toast, t]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header showBack title="Loading..." />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-app-green"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header showBack title={t("notFound")} />
        <div className="flex-1 p-4 flex flex-col items-center justify-center">
          <p className="mb-4 text-lg">{t("notFound")}</p>
          <Button onClick={() => navigate(-1)}>{t("back")}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header showBack title={product.product_name} />
      <main className="flex-1 p-4 overflow-auto">
        <ProductDetail product={product} />
      </main>
    </div>
  );
};

export default ProductDetails;
