
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Product } from "@/types/product";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Refrigerator, Sun, Snowflake, ThermometerSun } from "lucide-react";
import { analyzeHealthRisks, determineSuitableStorage } from "@/services/additionalFoodApiService";

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const { t } = useTranslation();
  
  // Calculate expiry date (just for demo - in real app this would come from the API)
  const expiryDays = 3;
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + expiryDays);
  
  // Check for high sugar/salt warnings
  const highSugar = (product.nutriments?.sugars_100g || 0) > 22.5;
  const highSalt = (product.nutriments?.salt_100g || 0) > 1.5;

  // Get health warnings and storage instructions
  const healthWarnings = analyzeHealthRisks(product);
  const storageTypes = determineSuitableStorage(product);

  return (
    <div className="w-full max-w-lg mx-auto space-y-6 pb-12">
      {/* Product Header */}
      <div className="flex flex-col items-center">
        {product.image_url && (
          <img 
            src={product.image_url} 
            alt={product.product_name || "Product"} 
            className="w-48 h-48 object-contain rounded-lg mb-4"
          />
        )}
        <h1 className="text-2xl font-bold text-center">{product.product_name}</h1>
        <p className="text-app-green">
          {t("expiresIn")} {expiryDays} {t("days")}
        </p>
      </div>
      
      {/* Health Warnings */}
      {(highSugar || highSalt || healthWarnings.length > 0) && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">{t("healthWarnings")}</h2>
          {highSugar && (
            <Card className="p-4 bg-orange-50 border-orange-200">
              <div className="flex gap-3 items-center">
                <AlertTriangle className="text-app-warning w-6 h-6" />
                <p className="text-gray-800">{t("highInSugar")}</p>
              </div>
            </Card>
          )}
          {highSalt && (
            <Card className="p-4 bg-orange-50 border-orange-200">
              <div className="flex gap-3 items-center">
                <AlertTriangle className="text-app-warning w-6 h-6" />
                <p className="text-gray-800">{t("highInSalt")}</p>
              </div>
            </Card>
          )}
          {healthWarnings.map((warning, index) => (
            <Card key={index} className="p-4 bg-orange-50 border-orange-200">
              <div className="flex gap-3 items-center">
                <AlertTriangle className="text-app-warning w-6 h-6" />
                <p className="text-gray-800">{t(warning)}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Storage Instructions */}
      {storageTypes.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">{t("storageInstructions")}</h2>
          <Card className="p-4">
            <div className="space-y-2">
              {storageTypes.map((storageType, index) => (
                <div key={index} className="flex gap-3 items-center">
                  {storageType === "refrigerate" && <Refrigerator className="text-blue-500 w-5 h-5" />}
                  {storageType === "avoidSunlight" && <Sun className="text-yellow-500 w-5 h-5" />}
                  {storageType === "freezer" && <Snowflake className="text-blue-300 w-5 h-5" />}
                  {storageType === "roomTemperature" && <ThermometerSun className="text-green-500 w-5 h-5" />}
                  <p>{t(storageType)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Product Summary for different languages */}
      <div>
        <h2 className="text-xl font-semibold mb-3">{t("productSummary")}</h2>
        <Card className="p-4">
          <div className="space-y-2 text-sm">
            <p className="font-medium">English: {product.product_name}</p>
            {product.ingredients_text && (
              <p className="text-gray-600">Contains {product.ingredients_text.split(',').slice(0, 3).join(', ')}{product.ingredients_text.split(',').length > 3 ? '...' : ''}</p>
            )}
            {healthWarnings.length > 0 && (
              <p className="text-red-500">{t("notSuitableFor")} {healthWarnings.map(w => t(w.replace('Warning', 'Patients'))).join(', ')}</p>
            )}
          </div>
        </Card>
      </div>
      
      {/* Nutrition Facts */}
      <div>
        <h2 className="text-xl font-semibold mb-3">{t("nutritionFacts")}</h2>
        <Card className="p-4 divide-y">
          {product.nutriments?.energy_100g !== undefined && (
            <div className="flex justify-between py-2">
              <span>{t("calories")}</span>
              <span className="font-semibold">{product.nutriments.energy_100g} kcal</span>
            </div>
          )}
          {product.nutriments?.fat_100g !== undefined && (
            <div className="flex justify-between py-2">
              <span>{t("totalFat")}</span>
              <span className="font-semibold">{product.nutriments.fat_100g}g</span>
            </div>
          )}
          {product.nutriments?.carbohydrates_100g !== undefined && (
            <div className="flex justify-between py-2">
              <span>{t("carbs")}</span>
              <span className="font-semibold">{product.nutriments.carbohydrates_100g}g</span>
            </div>
          )}
          {product.nutriments?.sugars_100g !== undefined && (
            <div className="flex justify-between py-2">
              <span>{t("sugars")}</span>
              <span className="font-semibold">{product.nutriments.sugars_100g}g</span>
            </div>
          )}
          {product.nutriments?.proteins_100g !== undefined && (
            <div className="flex justify-between py-2">
              <span>{t("proteins")}</span>
              <span className="font-semibold">{product.nutriments.proteins_100g}g</span>
            </div>
          )}
          {product.nutriments?.salt_100g !== undefined && (
            <div className="flex justify-between py-2">
              <span>{t("salt")}</span>
              <span className="font-semibold">{product.nutriments.salt_100g}g</span>
            </div>
          )}
          {product.nutriments?.fiber_100g !== undefined && (
            <div className="flex justify-between py-2">
              <span>{t("fiber")}</span>
              <span className="font-semibold">{product.nutriments.fiber_100g}g</span>
            </div>
          )}
        </Card>
      </div>
      
      {/* Safe Usage */}
      <div>
        <h2 className="text-xl font-semibold mb-3">{t("safeUsage")}</h2>
        <Card className="p-4">
          <p>{t("consumeWithin")}</p>
          <p>{t("storeIn")}</p>
        </Card>
      </div>
      
      {/* Ingredients */}
      {product.ingredients_text && (
        <div>
          <h2 className="text-xl font-semibold mb-3">{t("ingredients")}</h2>
          <Card className="p-4">
            <p className="text-sm">{product.ingredients_text}</p>
          </Card>
        </div>
      )}
      
      {/* Allergens */}
      {product.allergens_tags && product.allergens_tags.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3">{t("allergens")}</h2>
          <Card className="p-4">
            <ul className="list-disc pl-5">
              {product.allergens_tags.map((allergen, index) => (
                <li key={index} className="text-sm">
                  {allergen.replace('en:', '')}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
