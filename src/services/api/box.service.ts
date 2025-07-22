import api from "../../lib/api";
import {
  Box,
  CreateBoxData,
  UpdateBoxData,
  BoxQuery,
  BoxOpenRequest,
  BoxOpenResponse,
  BoxOpenHistory,
  BoxOpenHistoryQuery,
} from "../../types/box";
import { PaginatedResponse } from "../../types/api";

/**
 * Box API Service
 * Handles all box-related API operations matching your backend exactly
 */
export class BoxService {
  private readonly baseUrl = "/box"; // Note: singular 'box' to match your backend

  /**
   * Get all boxes with optional filtering and pagination
   * @param query - Query parameters for filtering, sorting, and pagination
   * @returns Promise<PaginatedResponse<Box>>
   */
  async getBoxes(query?: BoxQuery): Promise<PaginatedResponse<Box>> {
    const response = await api.get<PaginatedResponse<Box>>(this.baseUrl, {
      params: query,
    });
    return response.data;
  }

  /**
   * Get all boxes with simple filtering (public endpoint)
   * @param name - Box name filter
   * @param isFeatured - Featured status filter
   * @returns Promise<Box[]>
   */
  async getBoxesSimple(name?: string, isFeatured?: boolean): Promise<Box[]> {
    const params: any = {};
    if (name) params.name = name;
    if (isFeatured !== undefined) params.isFeatured = isFeatured;

    const response = await api.get<Box[]>(`${this.baseUrl}/simple`, { params });
    return response.data;
  }

  /**
   * Get all featured boxes
   * @returns Promise<Box[]>
   */
  async getFeaturedBoxes(): Promise<Box[]> {
    const response = await api.get<Box[]>(`${this.baseUrl}/featured`);
    return response.data;
  }

  /**
   * Search boxes by name
   * @param name - Box name to search for
   * @returns Promise<Box[]>
   */
  async searchBoxesByName(name: string): Promise<Box[]> {
    const response = await api.get<Box[]>(
      `${this.baseUrl}/search/name/${name}`
    );
    return response.data;
  }

  /**
   * Get a specific box by ID
   * @param id - Box ID
   * @returns Promise<Box>
   */
  async getBoxById(id: number): Promise<Box> {
    const response = await api.get<Box>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Create a new box (admin only)
   * @param data - Box creation data
   * @returns Promise<Box>
   */
  async createBox(data: CreateBoxData): Promise<Box> {
    const response = await api.post<Box>(this.baseUrl, data);
    return response.data;
  }

  /**
   * Update an existing box (admin only)
   * @param id - Box ID
   * @param data - Box update data
   * @returns Promise<Box>
   */
  async updateBox(id: number, data: UpdateBoxData): Promise<Box> {
    const response = await api.patch<Box>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  /**
   * Update box featured status (admin only)
   * @param id - Box ID
   * @param isFeatured - Featured status
   * @returns Promise<Box>
   */
  async updateFeaturedStatus(id: number, isFeatured: boolean): Promise<Box> {
    const response = await api.patch<Box>(`${this.baseUrl}/${id}/featured`, {
      isFeatured,
    });
    return response.data;
  }

  /**
   * Delete a box (admin only)
   * @param id - Box ID
   * @returns Promise<void>
   */
  async deleteBox(id: number): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  // ================= BOX OPENING METHODS =================

  /**
   * Open a box for a user
   * @param boxId - Box ID to open
   * @param userId - User ID who is opening the box
   * @returns Promise<BoxOpenResponse>
   */
  async openBox(boxId: number): Promise<BoxOpenResponse> {
    const response = await api.post<BoxOpenResponse>(
      `${this.baseUrl}/${boxId}/open`
    );
    return response.data;
  }

  /**
   * Get user's box opening history with pagination
   * @param userId - User ID
   * @param query - Query parameters for pagination
   * @returns Promise<PaginatedResponse<BoxOpenHistory>>
   */
  async getMyBoxOpenHistory(
    query?: BoxOpenHistoryQuery
  ): Promise<PaginatedResponse<BoxOpenHistory>> {
    const response = await api.get<PaginatedResponse<BoxOpenHistory>>(
      `${this.baseUrl}/me/history`,
      { params: query }
    );
    return response.data;
  }
}

// Export singleton instance
export const boxService = new BoxService();
