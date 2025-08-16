import api from "../../lib/api";
import {
  User,
  RegisterData,
  UpdateUserData,
  UpdateCoinsData,
  UpdateExperienceData,
  UserStats,
  UserRole,
  UserQuery,
} from "../../types/auth";
import {
  ApiResponse,
  PaginatedApiResponse,
  OperationResponse,
} from "../../types/api-response";
import { UserInventory } from "../../types/item";

/**
 * User API Service
 * Handles all user-related API operations matching the backend controller exactly
 */
export class UserService {
  private readonly baseUrl = "/user";

  /**
   * Create a new user
   * POST /user
   * @param createUserData - User creation data
   * @returns Promise<ApiResponse<User>> - Returns full response with success, message, timestamp
   */
  async createUser(createUserData: RegisterData): Promise<ApiResponse<User>> {
    const response = await api.post<ApiResponse<User>>(
      this.baseUrl,
      createUserData
    );
    return response.data;
  }

  /**
   * Get all users with optional filtering and pagination
   * GET /user
   * @param query - Query parameters for filtering, sorting, and pagination
   * @returns Promise<PaginatedApiResponse<User>> - Returns full response with success, message, timestamp, data, pagination
   */
  async getUsers(query?: UserQuery): Promise<PaginatedApiResponse<User>> {
    const response = await api.get<PaginatedApiResponse<User>>(this.baseUrl, {
      params: query,
    });
    return response.data;
  }

  /**
   * Get user statistics
   * GET /user/:id/stats
   * @param id - User ID
   * @returns Promise<ApiResponse<UserStats>> - Returns full response with success, message, timestamp
   */
  async getUserStats(id: string): Promise<ApiResponse<UserStats>> {
    const response = await api.get<ApiResponse<UserStats>>(
      `${this.baseUrl}/${id}/stats`
    );
    return response.data;
  }

  /**
   * Get a specific user by ID
   * GET /user/:id
   * @param id - User ID
   * @returns Promise<ApiResponse<User>> - Returns full response with success, message, timestamp
   */
  async getUserById(id: string): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Update a user (requires ADMIN or EDITOR role)
   * PATCH /user/:id
   * @param id - User ID
   * @param updateUserData - User update data
   * @returns Promise<ApiResponse<User>> - Returns full response with success, message, timestamp
   */
  async updateUser(
    id: string,
    updateUserData: UpdateUserData
  ): Promise<ApiResponse<User>> {
    const response = await api.patch<ApiResponse<User>>(
      `${this.baseUrl}/${id}`,
      updateUserData
    );
    return response.data;
  }

  /**
   * Update user coins
   * PATCH /user/:id/coins
   * @param id - User ID
   * @param coinsData - Coins update data
   * @returns Promise<OperationResponse> - Returns operation status with message
   */
  async updateUserCoins(
    id: string,
    coinsData: UpdateCoinsData
  ): Promise<OperationResponse> {
    const response = await api.patch<OperationResponse>(
      `${this.baseUrl}/${id}/coins`,
      coinsData
    );
    return response.data;
  }

  /**
   * Update user experience points
   * PATCH /user/:id/experience
   * @param id - User ID
   * @param experienceData - Experience update data
   * @returns Promise<OperationResponse> - Returns operation status with message
   */
  async updateUserExperience(
    id: string,
    experienceData: UpdateExperienceData
  ): Promise<OperationResponse> {
    const response = await api.patch<OperationResponse>(
      `${this.baseUrl}/${id}/experience`,
      experienceData
    );
    return response.data;
  }

  /**
   * Update user role
   * PATCH /user/:id/role
   * @param id - User ID
   * @param role - New user role
   * @returns Promise<OperationResponse> - Returns operation status with message
   */
  async updateUserRole(id: string, role: UserRole): Promise<OperationResponse> {
    const response = await api.patch<OperationResponse>(
      `${this.baseUrl}/${id}/role`,
      { role }
    );
    return response.data;
  }

  /**
   * Delete a user
   * DELETE /user/:id
   * @param id - User ID
   * @returns Promise<OperationResponse> - Returns operation status with message
   */
  async deleteUser(id: string): Promise<OperationResponse> {
    const response = await api.delete<OperationResponse>(
      `${this.baseUrl}/${id}`
    );
    return response.data;
  }

  // ================= INVENTORY METHODS =================

  /**
   * Get user's inventory
   * GET /user/:id/inventory
   * @param id - User ID
   * @returns Promise<ApiResponse<UserInventory>> - Returns full response with success, message, timestamp
   */
  async getUserInventory(id: string): Promise<ApiResponse<UserInventory>> {
    const response = await api.get<ApiResponse<UserInventory>>(
      `${this.baseUrl}/${id}/inventory`
    );
    return response.data;
  }

  /**
   * Add item to user's inventory with quantity support
   * POST /user/:id/inventory
   * @param id - User ID
   * @param itemId - Item ID to add
   * @param quantity - Quantity to add (default: 1)
   * @returns Promise<OperationResponse> - Returns operation status with message
   */
  async addItemToInventory(
    id: string,
    itemId: number,
    quantity: number = 1
  ): Promise<OperationResponse> {
    const response = await api.post<OperationResponse>(
      `${this.baseUrl}/${id}/inventory`,
      { item_id: itemId, quantity }
    );
    return response.data;
  }

  /**
   * Add multiple items to user's inventory
   * POST /user/:id/inventory/bulk
   * @param id - User ID
   * @param itemIds - Array of item IDs to add
   * @returns Promise<OperationResponse> - Returns operation status with message
   */
  async addItemsToInventory(
    id: string,
    itemIds: number[]
  ): Promise<OperationResponse> {
    const response = await api.post<OperationResponse>(
      `${this.baseUrl}/${id}/inventory/bulk`,
      { item_ids: itemIds }
    );
    return response.data;
  }

  /**
   * Remove item from user's inventory with quantity support
   * DELETE /user/:id/inventory/:itemId?quantity=N
   * @param id - User ID
   * @param itemId - Item ID to remove
   * @param quantity - Quantity to remove (default: 1)
   * @returns Promise<OperationResponse> - Returns operation status with message
   */
  async removeItemFromInventory(
    id: string,
    itemId: number,
    quantity: number = 1
  ): Promise<OperationResponse> {
    const response = await api.delete<OperationResponse>(
      `${this.baseUrl}/${id}/inventory/${itemId}?quantity=${quantity}`
    );
    return response.data;
  }
}

// Export singleton instance
export const userService = new UserService();
