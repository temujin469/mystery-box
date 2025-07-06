import api from '../../lib/api';
import {
  Box,
  CreateBoxData,
  UpdateBoxData,
  BoxQuery,
  BoxOpenResult,
  BoxOrderByField,
} from '../../types/box';
import { PaginatedResponse, ApiResponse } from '../../types/api';

/**
 * Box API Service
 * Handles all box-related API operations including CRUD, queries, and box opening
 */
export class BoxService {
  private readonly baseUrl = '/box'; // Note: singular 'box' to match your backend

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
    const response = await api.get<Box[]>(`${this.baseUrl}/search/name/${name}`);
    return response.data;
  }

  /**
   * Get a specific box by ID
   * @param id - Box ID
   * @param includeRelations - Whether to include related data
   * @returns Promise<Box>
   */
  async getBoxById(id: number, includeRelations: boolean = false): Promise<Box> {
    const response = await api.get<Box>(`${this.baseUrl}/${id}`, {
      params: { includeRelations },
    });
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
   * Delete a box (admin only)
   * @param id - Box ID
   * @returns Promise<void>
   */
  async deleteBox(id: number): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Open a box and get a random item
   * @param id - Box ID
   * @returns Promise<BoxOpenResult>
   */
  async openBox(id: number): Promise<BoxOpenResult> {
    const response = await api.post<BoxOpenResult>(`${this.baseUrl}/${id}/open`);
    return response.data;
  }

  /**
   * Preview box contents (what items can be obtained)
   * @param id - Box ID
   * @returns Promise<any[]> - Array of possible items
   */
  async previewBoxContents(id: number): Promise<any[]> {
    const response = await api.get<any[]>(`${this.baseUrl}/${id}/preview`);
    return response.data;
  }

  /**
   * Get box opening history for current user
   * @param boxId - Optional box ID to filter by
   * @param limit - Number of results to return
   * @returns Promise<BoxOpenResult[]>
   */
  async getBoxHistory(boxId?: number, limit: number = 50): Promise<BoxOpenResult[]> {
    const response = await api.get<BoxOpenResult[]>(`${this.baseUrl}/history`, {
      params: { boxId, limit },
    });
    return response.data;
  }

  /**
   * Get all box opening history (admin only)
   * @param userId - Optional user ID to filter by
   * @param boxId - Optional box ID to filter by
   * @param limit - Number of results to return
   * @returns Promise<BoxOpenResult[]>
   */
  async getAllBoxHistory(userId?: string, boxId?: number, limit: number = 100): Promise<BoxOpenResult[]> {
    const response = await api.get<BoxOpenResult[]>(`${this.baseUrl}/history/all`, {
      params: { userId, boxId, limit },
    });
    return response.data;
  }

  /**
   * Search boxes by name or description
   * @param query - Search query string
   * @param availableOnly - Whether to search only available boxes
   * @returns Promise<Box[]>
   */
  async searchBoxes(query: string, availableOnly: boolean = true): Promise<Box[]> {
    const response = await api.get<Box[]>(`${this.baseUrl}/search`, {
      params: { q: query, availableOnly },
    });
    return response.data;
  }

  /**
   * Update box featured status (admin only)
   * @param id - Box ID
   * @param isFeatured - Featured status
   * @returns Promise<Box>
   */
  async updateFeaturedStatus(id: number, isFeatured: boolean): Promise<Box> {
    const response = await api.patch<Box>(`${this.baseUrl}/${id}/featured`, { isFeatured });
    return response.data;
  }

  /**
   * Get boxes by price range
   * @param minPrice - Minimum price
   * @param maxPrice - Maximum price
   * @param availableOnly - Whether to include only available boxes
   * @returns Promise<Box[]>
   */
  async getBoxesByPriceRange(minPrice: number, maxPrice: number, availableOnly: boolean = true): Promise<Box[]> {
    const response = await api.get<Box[]>(`${this.baseUrl}/price-range`, {
      params: { minPrice, maxPrice, availableOnly },
    });
    return response.data;
  }

  /**
   * Get boxes by coin range
   * @param minCoin - Minimum coin cost
   * @param maxCoin - Maximum coin cost
   * @param availableOnly - Whether to include only available boxes
   * @returns Promise<Box[]>
   */
  async getBoxesByCoinRange(minCoin: number, maxCoin: number, availableOnly: boolean = true): Promise<Box[]> {
    const response = await api.get<Box[]>(`${this.baseUrl}/coin-range`, {
      params: { minCoin, maxCoin, availableOnly },
    });
    return response.data;
  }

  /**
   * Count total boxes
   * @param availableOnly - Whether to count only available boxes
   * @returns Promise<number>
   */
  async countBoxes(availableOnly: boolean = false): Promise<number> {
    const response = await api.get<{ count: number }>(`${this.baseUrl}/count`, {
      params: { availableOnly },
    });
    return response.data.count;
  }

  /**
   * Get box statistics (admin only)
   * @returns Promise<any>
   */
  async getBoxStats(): Promise<any> {
    const response = await api.get<any>(`${this.baseUrl}/stats`);
    return response.data;
  }

  /**
   * Upload box image
   * @param id - Box ID
   * @param file - Image file
   * @returns Promise<Box>
   */
  async uploadBoxImage(id: number, file: File): Promise<Box> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<Box>(`${this.baseUrl}/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Check if user can afford a box
   * @param id - Box ID
   * @returns Promise<{ canAfford: boolean, userCoins: number, boxCost: number }>
   */
  async checkAffordability(id: number): Promise<{ canAfford: boolean; userCoins: number; boxCost: number }> {
    const response = await api.get<{ canAfford: boolean; userCoins: number; boxCost: number }>(
      `${this.baseUrl}/${id}/affordability`
    );
    return response.data;
  }

  /**
   * Get recommended boxes for current user
   * @param limit - Number of recommendations to return
   * @returns Promise<Box[]>
   */
  async getRecommendedBoxes(limit: number = 10): Promise<Box[]> {
    const response = await api.get<Box[]>(`${this.baseUrl}/recommended`, {
      params: { limit },
    });
    return response.data;
  }

  /**
   * Report box issue
   * @param id - Box ID
   * @param issue - Issue description
   * @returns Promise<ApiResponse>
   */
  async reportBoxIssue(id: number, issue: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(`${this.baseUrl}/${id}/report`, {
      issue,
    });
    return response.data;
  }

  /**
   * Export boxes to CSV (admin only)
   * @param query - Optional query parameters for filtering
   * @returns Promise<Blob>
   */
  async exportBoxes(query?: BoxQuery): Promise<Blob> {
    const response = await api.get(`${this.baseUrl}/export`, {
      params: query,
      responseType: 'blob',
    });
    return response.data;
  }
}

// Export singleton instance
export const boxService = new BoxService();
