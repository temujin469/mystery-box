import { BaseQuery } from "./api-response";

// Forward declarations to avoid circular imports
interface BoxItem {
  box_id: number;
  item_id: number;
  drop_rate: number;
  created_at: Date;
  updated_at: Date;
}

interface OrderItem {
  id: number;
  order_id: string;
  item_id: number;
  quantity: number;
  price: number;
}

export interface Item {
  id: number;
  sku:string;
  name: string;
  image_url: string;
  price: number;
  rarity: number; // Rarity level from 1 to 5
  sell_value: number; // Required in backend, not optional
  description?: string;
  created_at: Date; // Should be Date, not string
  updated_at: Date; // Should be Date, not string
  // Relations (when included)
  boxes?: BoxItem[]; // Fixed type from any[]
  users?: UserItem[];
  order_items?: OrderItem[]; // Added missing relation
}

export interface CreateItemData {
  name: string;
  sku:string
  image_url: string;
  price: number;
  rarity: number; // Added rarity field (required in backend DTO)
  sell_value: number; // Required in backend, not optional
  description?: string;
}

export interface UpdateItemData extends Partial<CreateItemData> {}

export interface ItemQuery extends BaseQuery {
  orderBy?: ItemOrderByField;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  sku?:string;
  userId?: string;
}

export enum ItemOrderByField {
  ID = "id",
  NAME = "name",
  PRICE = "price",
  SELL_VALUE = "sell_value",
  CREATED_AT = "created_at",
  UPDATED_AT = "updated_at",
}

// User-Item relationship (updated to match backend implementation with quantity support)
export interface UserItem {
  id: number; // Primary key
  user_id: string;
  item_id: number;
  quantity: number; // Quantity support
  redeemed_at: Date; // Should be Date, not string
  updated_at: Date; // Should be Date, not string
  // Relations
  user?: any; // User type from auth.ts
  item?: Item;
}

// Inventory related types
export interface UserInventory {
  items: Array<{
    item: Item;
    quantity: number;
    redeemed_at: Date; // Should be Date, not string
    updated_at: Date; // Should be Date, not string
  }>;
  total: number; // Total quantity of all items
}

export interface AddItemToInventoryData {
  item_id: number;
  quantity?: number; // Optional, defaults to 1 in backend
}

export interface AddItemsToInventoryData {
  item_ids: number[];
}
