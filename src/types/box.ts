import { BaseQuery, OrderDirection } from "./api";
import { User } from "./auth";
import { Category } from "./category";
import { Item } from "./item";

export interface Box {
  id: number;
  name: string;
  coin: number;
  price: number;
  rarity: number; // Rarity level from 1 to 5
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

export interface UpdateBoxData extends Partial<CreateBoxData> {}

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
  RARITY = "rarity",
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

// Box Opening History Types
export interface BoxOpenHistory {
  id: string;
  user_id: string;
  box_id: string;
  item_id: string;
  opened_at: string;
  // Relations
  box?: Box;
  item?: Item;
  user?: User;
}

export interface BoxOpenRequest {
  userId: string;
}

export interface BoxOpenResponse {
  success: boolean;
  receivedItem: Item;
  boxOpenHistory: BoxOpenHistory;
  message: string;
}

export interface BoxOpenHistoryQuery {
  page?: number;
  limit?: number;
}
