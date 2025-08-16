import api from "../../lib/api";
import {
  Item,
  CreateItemData,
  UpdateItemData,
  ItemQuery,
} from "../../types/item";
import {
  ApiResponse,
  PaginatedApiResponse,
  OperationResponse,
} from "../../types/api-response";

/**
 * Item API Service
 * Handles all item-related API operations matching the backend controller exactly
 */
export class ItemService {
  private readonly baseUrl = "/item";

  /**
   * Create a new item
   * POST /item
   * @param createItemData - Item creation data
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async createItem(createItemData: CreateItemData): Promise<OperationResponse> {
    const response = await api.post<OperationResponse>(
      this.baseUrl,
      createItemData
    );
    return response.data;
  }

  /**
   * Get all items with optional filtering and pagination
   * GET /item
   * @param query - Query parameters for filtering, sorting, and pagination
   * @returns Promise<PaginatedApiResponse<Item>> - Returns full response with success, message, timestamp, data, pagination
   */
  async getItems(query?: ItemQuery): Promise<PaginatedApiResponse<Item>> {
    const response = await api.get<PaginatedApiResponse<Item>>(this.baseUrl, {
      params: query,
    });
    return response.data;
  }

  /**
   * Get a specific item by ID
   * GET /item/:id
   * @param id - Item ID
   * @returns Promise<ApiResponse<Item>> - Returns full response with success, message, timestamp
   */
  async getItemById(id: number): Promise<ApiResponse<Item>> {
    const response = await api.get<ApiResponse<Item>>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Update an existing item
   * PATCH /item/:id
   * @param id - Item ID
   * @param updateItemData - Item update data
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async updateItem(
    id: number,
    updateItemData: UpdateItemData
  ): Promise<OperationResponse> {
    const response = await api.patch<OperationResponse>(
      `${this.baseUrl}/${id}`,
      updateItemData
    );
    return response.data;
  }

  /**
   * Delete an item
   * DELETE /item/:id
   * @param id - Item ID
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async deleteItem(id: number): Promise<OperationResponse> {
    const response = await api.delete<OperationResponse>(
      `${this.baseUrl}/${id}`
    );
    return response.data;
  }

  /**
   * Sell an item back for coins
   * POST /item/:id/sell
   * @param id - Item ID to sell
   * @param quantity - Quantity to sell (default: 1)
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async sellItem(id: number, quantity: number = 1): Promise<OperationResponse> {
    const response = await api.post<OperationResponse>(
      `${this.baseUrl}/${id}/sell`,
      {
        quantity,
      }
    );
    return response.data;
  }
}

// Export singleton instance
export const itemService = new ItemService();
