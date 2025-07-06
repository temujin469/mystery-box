import { BaseQuery, OrderDirection } from './api';
import { User } from './auth';

export interface Box {
  id: number;
  name: string;
  coin: number;
  price: number;
  commission_rate: number;
  description?: string;
  image_url: string;
  is_featured: boolean;
  available_from?: string;
  available_to?: string;
  created_at: string;
  updated_at: string;
  // Relations (when included)
  items?: any[]; // BoxItem[]
  categories?: any[]; // CategoryBox[]
  boxCount?: number;
}

export interface CreateBoxData {
  name: string;
  coin: number;
  price: number;
  commission_rate: number;
  description?: string;
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
  description?: string;
  is_featured?: boolean;
  image_url?: string;
  available_from?: string;
  available_to?: string;
}

export interface BoxQuery extends BaseQuery {
  orderBy?: BoxOrderByField;
  name?: string;
  minCoin?: number;
  maxCoin?: number;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  availableNow?: boolean;
}

export enum BoxOrderByField {
  ID = 'id',
  NAME = 'name',
  COIN = 'coin',
  PRICE = 'price',
  COMMISSION_RATE = 'commission_rate',
  IS_FEATURED = 'is_featured',
  AVAILABLE_FROM = 'available_from',
  AVAILABLE_TO = 'available_to',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
}

export interface BoxOpenResult {
  item: any; // Item type from item.ts
  user: User;
  success: boolean;
  message?: string;
}
