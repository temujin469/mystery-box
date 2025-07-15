import { BaseQuery, OrderDirection } from "./api";
import { User } from "./auth";
import { Category } from "./category";
import { Item } from "./item";

export interface Box {
  id: number;
  name: string;
  coin: number;
  price: number;
  commission_rate: number;
  image_url: string;
  is_featured: boolean;
  available_from?: string | null;
  available_to?: string | null;
  created_at: string;
  updated_at: string;
  // Relations (when included)
  items?: BoxItem[]; 
  categories?: any[]; // CategoryBox[]
  boxCount?: number;
}

export type BoxItem = {
  box_id: number;
  item_id: number;
  drop_rate: number;
  created_at: string;
  updated_at: string;
  // Relations
  item?: Item;
};

// Category-Box relationship
export interface CategoryBox {
  id: number;
  category_id: number;
  box_id: number;
  created_at: string;
  // Relations
  category?: Category;
  box?: any; // Box type from box.ts
}


export interface CreateBoxData {
  name: string;
  coin: number;
  price: number;
  commission_rate: number;
  is_featured: boolean;
  image_url: string;
  available_from?: string;
  available_to?: string;
}

export interface UpdateBoxData {
  name?: string;
  coin?: number;
  price?: number;
  commission_rate?: number;
  is_featured?: boolean;
  image_url?: string;
  available_from?: string;
  available_to?: string;
}

export interface BoxQuery extends BaseQuery {
  orderBy?: BoxOrderByField;
  name?: string;
  categoryId?: number;
  minCoin?: number;
  maxCoin?: number;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  availableNow?: boolean;
}

export enum BoxOrderByField {
  ID = "id",
  NAME = "name",
  COIN = "coin",
  PRICE = "price",
  COMMISSION_RATE = "commission_rate",
  IS_FEATURED = "is_featured",
  AVAILABLE_FROM = "available_from",
  AVAILABLE_TO = "available_to",
  CREATED_AT = "created_at",
  UPDATED_AT = "updated_at",
}

export interface BoxOpenResult {
  item: any; // Item type from item.ts
  user: User;
  success: boolean;
  message?: string;
}
