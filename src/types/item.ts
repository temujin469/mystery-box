import { BaseQuery, OrderDirection } from "./api";

export interface Item {
  id: number;
  name: string;
  image_url: string;
  price: number;
  rarity: number; // Rarity level from 1 to 5
  sell_value?: number;
  description?: string;
  created_at: string;
  updated_at: string;
  // Relations (when included)
  boxes?: any[]; // BoxItem[]
  users?: UserItem[];
  itemCount?: number;
}

// Remove ItemRarity enum since it's not in your backend
// Remove category_id and rarity fields since they're not in your backend

export interface CreateItemData {
  name: string;
  image_url: string;
  price: number;
  sell_value?: number;
  description?: string;
}

export interface UpdateItemData extends Partial<CreateItemData> {}

export interface ItemQuery extends BaseQuery {
  orderBy?: ItemOrderByField;
  name?: string;
  description?: string;
  minPrice?: number;
  maxPrice?: number;
  minSellValue?: number;
  maxSellValue?: number;
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
  id: number; // Added primary key
  user_id: string;
  item_id: number;
  quantity: number; // Added quantity support
  redeemed_at: string;
  updated_at: string; // Added updated timestamp
  // Relations
  user?: any; // User type from auth.ts
  item?: Item;
}

// Inventory related types
export interface UserInventory {
  items: Array<{
    item: Item;
    quantity: number; // Added quantity
    redeemed_at: string;
    updated_at: string; // Added updated timestamp
  }>;
  total: number; // Now represents total quantity, not item count
}

export interface AddItemToInventoryResponse {
  message: string;
  userItem: UserItem;
}

export interface AddItemsToInventoryResponse {
  message: string;
  addedItems: UserItem[];
}

export interface AddItemToInventoryData {
  item_id: number;
  quantity?: number; // Added optional quantity support
}

export interface AddItemsToInventoryData {
  item_ids: number[];
}

export interface RemoveItemFromInventoryData {
  quantity?: number; // Added optional quantity support
}

// Item transfer/trade related types
export interface ItemTransferData {
  item_id: number;
  to_user_id: string;
  quantity: number;
}

export interface ItemBulkAction {
  item_ids: number[];
  action: "delete" | "update" | "transfer";
  data?: any;
}

// Item statistics
export interface ItemStats {
  totalItems: number;
  itemsByPrice: Array<{ priceRange: string; count: number }>;
  mostValuableItems: Item[];
  recentItems: Item[];
}
