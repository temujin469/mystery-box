import api from '../../lib/api';
import {
  Item,
  CreateItemData,
  UpdateItemData,
  ItemQuery,
  ItemOrderByField,
  UserItem,
  ItemTransferData,
  ItemBulkAction,
  ItemStats,
} from '../../types/item';
import { PaginatedResponse, ApiResponse } from '../../types/api';

/**
 * Item API Service
 * Handles all item-related API operations including CRUD, queries, and item management
 */
export class ItemService {
  private readonly baseUrl = '/items';

  /**
   * Get all items with optional filtering and pagination
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
   * Get a specific item by ID
   * @param id - Item ID
   * @param includeRelations - Whether to include related data
   * @returns Promise<Item>
   */
  async getItemById(id: number, includeRelations: boolean = false): Promise<Item> {
    const response = await api.get<Item>(`${this.baseUrl}/${id}`, {
      params: { includeRelations },
    });
    return response.data;
  }

  /**
   * Create a new item (admin only)
   * @param data - Item creation data
   * @returns Promise<Item>
   */
  async createItem(data: CreateItemData): Promise<Item> {
    const response = await api.post<Item>(this.baseUrl, data);
    return response.data;
  }

  /**
   * Update an existing item (admin only)
   * @param id - Item ID
   * @param data - Item update data
   * @returns Promise<Item>
   */
  async updateItem(id: number, data: UpdateItemData): Promise<Item> {
    const response = await api.patch<Item>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  /**
   * Delete an item (admin only)
   * @param id - Item ID
   * @returns Promise<void>
   */
  async deleteItem(id: number): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Search items by name or description
   * @param query - Search query string
   * @param limit - Maximum number of results
   * @returns Promise<Item[]>
   */
  async searchItems(query: string, limit: number = 50): Promise<Item[]> {
    const response = await api.get<Item[]>(`${this.baseUrl}/search`, {
      params: { q: query, limit },
    });
    return response.data;
  }

  /**
   * Get items by price range
   * @param minPrice - Minimum price
   * @param maxPrice - Maximum price
   * @param limit - Maximum number of results
   * @returns Promise<Item[]>
   */
  async getItemsByPriceRange(minPrice: number, maxPrice: number, limit: number = 100): Promise<Item[]> {
    const response = await api.get<Item[]>(`${this.baseUrl}/price-range`, {
      params: { minPrice, maxPrice, limit },
    });
    return response.data;
  }

  /**
   * Get items by sell value range
   * @param minValue - Minimum sell value
   * @param maxValue - Maximum sell value
   * @param limit - Maximum number of results
   * @returns Promise<Item[]>
   */
  async getItemsBySellValueRange(minValue: number, maxValue: number, limit: number = 100): Promise<Item[]> {
    const response = await api.get<Item[]>(`${this.baseUrl}/sell-value-range`, {
      params: { minValue, maxValue, limit },
    });
    return response.data;
  }

  /**
   * Get user's items (current user)
   * @param query - Optional query parameters
   * @returns Promise<PaginatedResponse<UserItem>>
   */
  async getUserItems(query?: ItemQuery): Promise<PaginatedResponse<UserItem>> {
    const response = await api.get<PaginatedResponse<UserItem>>(`${this.baseUrl}/my-items`, {
      params: query,
    });
    return response.data;
  }

  /**
   * Get specific user's items (admin only)
   * @param userId - User ID
   * @param query - Optional query parameters
   * @returns Promise<PaginatedResponse<UserItem>>
   */
  async getUserItemsById(userId: string, query?: ItemQuery): Promise<PaginatedResponse<UserItem>> {
    const response = await api.get<PaginatedResponse<UserItem>>(`/users/${userId}/items`, {
      params: query,
    });
    return response.data;
  }

  /**
   * Transfer item to another user
   * @param data - Transfer data
   * @returns Promise<ApiResponse>
   */
  async transferItem(data: ItemTransferData): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(`${this.baseUrl}/transfer`, data);
    return response.data;
  }

  /**
   * Get item statistics (admin only)
   * @returns Promise<ItemStats>
   */
  async getItemStats(): Promise<ItemStats> {
    const response = await api.get<ItemStats>(`${this.baseUrl}/stats`);
    return response.data;
  }

  /**
   * Get most valuable items
   * @param limit - Number of items to return
   * @returns Promise<Item[]>
   */
  async getMostValuableItems(limit: number = 20): Promise<Item[]> {
    const response = await api.get<Item[]>(`${this.baseUrl}/most-valuable`, {
      params: { limit },
    });
    return response.data;
  }

  /**
   * Get recently added items
   * @param days - Number of days to look back
   * @param limit - Maximum number of results
   * @returns Promise<Item[]>
   */
  async getRecentItems(days: number = 7, limit: number = 50): Promise<Item[]> {
    const response = await api.get<Item[]>(`${this.baseUrl}/recent`, {
      params: { days, limit },
    });
    return response.data;
  }

  /**
   * Get random items
   * @param count - Number of random items to return
   * @returns Promise<Item[]>
   */
  async getRandomItems(count: number = 10): Promise<Item[]> {
    const response = await api.get<Item[]>(`${this.baseUrl}/random`, {
      params: { count },
    });
    return response.data;
  }

  /**
   * Perform bulk actions on items (admin only)
   * @param action - Bulk action configuration
   * @returns Promise<ApiResponse>
   */
  async bulkAction(action: ItemBulkAction): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(`${this.baseUrl}/bulk`, action);
    return response.data;
  }

  /**
   * Count total items
   * @returns Promise<number>
   */
  async countItems(): Promise<number> {
    const response = await api.get<{ count: number }>(`${this.baseUrl}/count`);
    return response.data.count;
  }

  /**
   * Upload item image
   * @param id - Item ID
   * @param file - Image file
   * @returns Promise<Item>
   */
  async uploadItemImage(id: number, file: File): Promise<Item> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<Item>(`${this.baseUrl}/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Get item price distribution
   * @returns Promise<Record<string, number>>
   */
  async getPriceDistribution(): Promise<Record<string, number>> {
    const response = await api.get<Record<string, number>>(`${this.baseUrl}/price-distribution`);
    return response.data;
  }

  /**
   * Export items to CSV (admin only)
   * @param query - Optional query parameters for filtering
   * @returns Promise<Blob>
   */
  async exportItems(query?: ItemQuery): Promise<Blob> {
    const response = await api.get(`${this.baseUrl}/export`, {
      params: query,
      responseType: 'blob',
    });
    return response.data;
  }

  /**
   * Get similar items (based on category and rarity)
   * @param id - Item ID
   * @param limit - Number of similar items to return
   * @returns Promise<Item[]>
   */
  async getSimilarItems(id: number, limit: number = 10): Promise<Item[]> {
    const response = await api.get<Item[]>(`${this.baseUrl}/${id}/similar`, {
      params: { limit },
    });
    return response.data;
  }

  /**
   * Get item ownership history (admin only)
   * @param id - Item ID
   * @param limit - Number of history records to return
   * @returns Promise<any[]>
   */
  async getItemHistory(id: number, limit: number = 50): Promise<any[]> {
    const response = await api.get<any[]>(`${this.baseUrl}/${id}/history`, {
      params: { limit },
    });
    return response.data;
  }
}

// Export singleton instance
export const itemService = new ItemService();
