import { BaseQuery, OrderDirection } from "./api-response";
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
  description: string; // Missing in original
  image_url: string;
  is_featured: boolean;
  available_from?: Date | null; // Should be Date, not string
  available_to?: Date | null; // Should be Date, not string
  created_at: Date; // Should be Date, not string
  updated_at: Date; // Should be Date, not string
  // Relations (when included)
  items?: BoxItem[];
  categories?: CategoryBox[]; // Fixed type from any[]
}

export type BoxItem = {
  box_id: number;
  item_id: number;
  drop_rate: number;
  created_at: Date; // Should be Date, not string
  updated_at: Date; // Should be Date, not string
  // Relations
  box?: Box;
  item?: Item;
};

// Category-Box relationship
export interface CategoryBox {
  box_id: number; // Primary key part 1
  category_id: number; // Primary key part 2
  // Relations
  category?: Category;
  box?: Box;
}

export interface CreateBoxData {
  name: string;
  coin: number;
  price: number;
  rarity: number; // Added rarity field
  commission_rate: number;
  description: string; // Added description field
  is_featured: boolean;
  image_url: string;
  available_from?: Date; // Should be Date, not string
  available_to?: Date; // Should be Date, not string
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
  isFeatured?: string; // Backend expects string 'true'/'false'
  rarity?: number; // Added rarity filter
  availableFrom?: string; // Date string format
  availableTo?: string; // Date string format
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

// Box Opening History Types
export interface BoxOpenHistory {
  id: string; // Generated ID from backend
  user_id: string;
  box_id: number; // Changed from string to number
  item_id: number; // Changed from string to number
  opened_at: Date; // Should be Date, not string
  item_price: number;
  box_price: number;
  commission_rate: number;
  // Relations
  box?: Box;
  item?: Item;
  user?: User;
}

export interface BoxOpenResponse {
  receivedItem: Item;
  unlockedAchievements: UnlockedAchievement[];
}

export interface UnlockedAchievement {
  id: number;
  name: string;
  description: string;
  unlockedAt: Date; // Should be Date, not string
}

export interface BoxOpenHistoryQuery {
  page?: number;
  limit?: number;
}
