
export interface Product {
  id: string;
  product_name: string;
  image_url: string;
  expiration_date?: string;
  nutriments: {
    energy_100g?: number;
    carbohydrates_100g?: number;
    sugars_100g?: number;
    fat_100g?: number;
    proteins_100g?: number;
    salt_100g?: number;
    fiber_100g?: number;
    sodium_100g?: number;
  };
  nutrient_levels?: {
    fat?: string;
    salt?: string;
    sugars?: string;
    saturated_fat?: string;
  };
  ingredients_text?: string;
  allergens_tags?: string[];
  nutrition_grades?: string;
  storage_instructions?: string;
  health_warnings?: string[];
}

export interface SearchResult {
  count: number;
  page: number;
  page_size: number;
  products: Product[];
}

export interface HealthCondition {
  id: string;
  name: string;
  triggers: string[];
}

export interface StorageType {
  id: string;
  name: string;
  description: string;
}
