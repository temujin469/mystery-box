import { BaseQuery } from "./api-response";
import { CategoryBox } from "./box";

export interface Category {
  id: number;
  name: string;
  image_url?: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: Date; // Should be Date, not string
  updated_at: Date; // Should be Date, not string
  // Relations (when included)
  boxes?: CategoryBox[];
  // Counts (when requested via getCategoryStats)
  boxCount?: number;
}

export interface CreateCategoryData {
  name: string;
  image_url?: string;
  is_active?: boolean;
  is_featured?: boolean;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

export interface CategoryQuery extends BaseQuery {
  orderBy?: CategoryOrderByField;
  name?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

export enum CategoryOrderByField {
  ID = "id",
  NAME = "name",
  IS_ACTIVE = "is_active",
  CREATED_AT = "created_at",
  UPDATED_AT = "updated_at", // Removed IS_FEATURED as it's not in backend enum
}

// Category stats response (from getCategoryStats endpoint)
export interface CategoryStats {
  category: Category;
  totalBoxes: number;
  activeBoxes: number;
}
