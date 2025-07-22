import api from '../../lib/api';
import {
  Item,
  CreateItemData,
  UpdateItemData,
} from '../../types/item';
import { PaginatedResponse } from '../../types/api';

export interface SellItemResponse {
  success: boolean;
  coinsReceived: number;
  message: string;
}

export interface ItemQuery {
  page?: number;
  limit?: number;
  orderBy?: ItemOrderByField;
  orderDirection?: 'ASC' | 'DESC';
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  userId?: string; // Optional user ID to filter items by owner
}

export enum ItemOrderByField {
  ID = 'id',
  NAME = 'name',
  PRICE = 'price',
  SELL_VALUE = 'sell_value',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
}

/**
 * Item API Service
 * Handles all item-related API operations matching the backend controller exactly
 */
export class ItemService {
  private readonly baseUrl = '/item';

  /**
   * Create a new item
   * POST /item
   * @param createItemData - Item creation data
   * @returns Promise<Item>
   */
  async createItem(createItemData: CreateItemData): Promise<Item> {
    const response = await api.post<Item>(this.baseUrl, createItemData);
    return response.data;
  }

  /**
   * Get all items with optional filtering and pagination
   * GET /item
   * @param query - Query parameters for filtering, sorting, and pagination
   * @returns Promise<PaginatedResponse<Item>>
   */
  async getItems(query?: ItemQuery): Promise<PaginatedResponse<Item>> {
    const response = await api.get<PaginatedResponse<Item>>(this.baseUrl, {
      params: query,
    });
    return response.data;
  }

  /**
   * Get all items with simple filtering (no pagination)
   * GET /item/simple
   * @param name - Optional name filter
   * @param minPrice - Optional minimum price filter
   * @param maxPrice - Optional maximum price filter
   * @returns Promise<Item[]>
   */
  async getItemsSimple(name?: string, minPrice?: number, maxPrice?: number): Promise<Item[]> {
    const params: any = {};
    if (name) params.name = name;
    if (minPrice !== undefined) params.minPrice = minPrice;
    if (maxPrice !== undefined) params.maxPrice = maxPrice;

    const response = await api.get<Item[]>(`${this.baseUrl}/simple`, { params });
    return response.data;
  }

  /**
   * Search items by name
   * GET /item/search/name/:name
   * @param name - Item name to search for
   * @returns Promise<Item[]>
   */
  async searchItemsByName(name: string): Promise<Item[]> {
    const response = await api.get<Item[]>(`${this.baseUrl}/search/name/${name}`);
    return response.data;
  }

  /**
   * Get a specific item by ID
   * GET /item/:id
   * @param id - Item ID
   * @returns Promise<Item>
   */
  async getItemById(id: number): Promise<Item> {
    const response = await api.get<Item>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Update an existing item
   * PATCH /item/:id
   * @param id - Item ID
   * @param updateItemData - Item update data
   * @returns Promise<Item>
   */
  async updateItem(id: number, updateItemData: UpdateItemData): Promise<Item> {
    const response = await api.patch<Item>(`${this.baseUrl}/${id}`, updateItemData);
    return response.data;
  }

  /**
   * Delete an item
   * DELETE /item/:id
   * @param id - Item ID
   * @returns Promise<void>
   */
  async deleteItem(id: number): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Sell an item back for coins
   * POST /item/:id/sell
   * @param id - Item ID to sell
   * @param quantity - Quantity to sell (default: 1)
   * @returns Promise<SellItemResponse>
   */
  async sellItem(id: number, quantity: number = 1): Promise<SellItemResponse> {
    const response = await api.post<SellItemResponse>(`${this.baseUrl}/${id}/sell`, {
      quantity,
    });
    return response.data;
  }
}

// Export singleton instance
export const itemService = new ItemService();
