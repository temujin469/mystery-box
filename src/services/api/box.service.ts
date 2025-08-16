import api from "../../lib/api";
import {
  Box,
  CreateBoxData,
  UpdateBoxData,
  BoxQuery,
  BoxOpenResponse,
  BoxOpenHistory,
  BoxOpenHistoryQuery,
} from "../../types/box";
import {
  ApiResponse,
  PaginatedApiResponse,
  OperationResponse,
} from "../../types/api-response";

/**
 * Box API Service
 * Handles all box-related API operations matching your backend exactly
 */
export class BoxService {
  private readonly baseUrl = "/box"; // Note: singular 'box' to match your backend

  /**
   * Get all boxes with optional filtering and pagination
   * @param query - Query parameters for filtering, sorting, and pagination
   * @returns Promise<PaginatedApiResponse<Box>> - Returns full response with success, message, timestamp, data, pagination
   */
  async getBoxes(query?: BoxQuery): Promise<PaginatedApiResponse<Box>> {
    const response = await api.get<PaginatedApiResponse<Box>>(this.baseUrl, {
      params: query,
    });
    return response.data;
  }

  /**
   * Get a specific box by ID
   * @param id - Box ID
   * @returns Promise<ApiResponse<Box>> - Returns full response with success, message, timestamp
   */
  async getBoxById(id: number): Promise<ApiResponse<Box>> {
    const response = await api.get<ApiResponse<Box>>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Create a new box (admin only)
   * @param data - Box creation data
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async createBox(data: CreateBoxData): Promise<OperationResponse> {
    const response = await api.post<OperationResponse>(this.baseUrl, data);
    return response.data;
  }

  /**
   * Update an existing box (admin only)
   * @param id - Box ID
   * @param data - Box update data
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async updateBox(id: number, data: UpdateBoxData): Promise<OperationResponse> {
    const response = await api.patch<OperationResponse>(
      `${this.baseUrl}/${id}`,
      data
    );
    return response.data;
  }

  /**
   * Update box featured status (admin only)
   * @param id - Box ID
   * @param isFeatured - Featured status
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async updateFeaturedStatus(
    id: number,
    isFeatured: boolean
  ): Promise<OperationResponse> {
    const response = await api.patch<OperationResponse>(
      `${this.baseUrl}/${id}/featured`,
      {
        isFeatured,
      }
    );
    return response.data;
  }

  /**
   * Delete a box (admin only)
   * @param id - Box ID
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async deleteBox(id: number): Promise<OperationResponse> {
    const response = await api.delete<OperationResponse>(
      `${this.baseUrl}/${id}`
    );
    return response.data;
  }

  // ================= BOX OPENING METHODS =================

  /**
   * Open a box for a user
   * @param boxId - Box ID to open
   * @returns Promise<ApiResponse<BoxOpenResponse>> - Returns full response for comprehensive business logic handling
   */
  async openBox(boxId: number): Promise<ApiResponse<BoxOpenResponse>> {
    const response = await api.post<ApiResponse<BoxOpenResponse>>(
      `${this.baseUrl}/${boxId}/open`
    );
    return response.data; // Return full response to handle success/failure
  }

  /**
   * Open an achievement reward box
   * @param boxId - Box ID to open
   * @param achievementId - Achievement ID that grants access to this reward box
   * @returns Promise<ApiResponse<BoxOpenResponse>> - Returns full response for comprehensive business logic handling
   */
  async openRewardBox(boxId: number, achievementId: number): Promise<ApiResponse<BoxOpenResponse>> {
    const response = await api.post<ApiResponse<BoxOpenResponse>>(
      `${this.baseUrl}/${boxId}/achievement/${achievementId}/reward`
    );
    return response.data; // Return full response to handle success/failure
  }

  /**
   * Get user's box opening history with pagination
   * @param query - Query parameters for pagination
   * @returns Promise<PaginatedApiResponse<BoxOpenHistory>> - Returns full response with success, message, timestamp, data, pagination
   */
  async getMyBoxOpenHistory(
    query?: BoxOpenHistoryQuery
  ): Promise<PaginatedApiResponse<BoxOpenHistory>> {
    const response = await api.get<PaginatedApiResponse<BoxOpenHistory>>(
      `${this.baseUrl}/me/history`,
      { params: query }
    );
    return response.data;
  }
}

// Export singleton instance
export const boxService = new BoxService();
