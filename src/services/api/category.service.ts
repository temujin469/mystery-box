import api from '../../lib/api';
import {
  Category,
  CategoryQuery,
  CreateCategoryData,
  UpdateCategoryData,
} from '../../types/category';
import { 
  ApiResponse, 
  PaginatedApiResponse, 
  OperationResponse 
} from '../../types/api-response';



/**
 * Category API Service
 * Handles all category-related API operations matching the backend controller exactly
 */
export class CategoryService {
  private readonly baseUrl = '/category';

  /**
   * Create a new category
   * POST /category
   * @param createCategoryData - Category creation data
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async createCategory(createCategoryData: CreateCategoryData): Promise<OperationResponse> {
    const response = await api.post<OperationResponse>(this.baseUrl, createCategoryData);
    return response.data;
  }

  /**
   * Get all categories with optional filtering and pagination
   * GET /category
   * @param query - Query parameters for filtering, sorting, and pagination
   * @returns Promise<PaginatedApiResponse<Category>> - Returns full response with success, message, timestamp, data, pagination
   */
  async getCategories(query?: CategoryQuery): Promise<PaginatedApiResponse<Category>> {
    const response = await api.get<PaginatedApiResponse<Category>>(this.baseUrl, {
      params: query,
    });
    return response.data;
  }

  /**
   * Get category statistics
   * GET /category/:id/stats
   * @param id - Category ID
   * @returns Promise<ApiResponse<{category: Category; totalBoxes: number; activeBoxes: number}>> - Returns category with stats
   */
  async getCategoryStats(id: number): Promise<ApiResponse<{category: Category; totalBoxes: number; activeBoxes: number}>> {
    const response = await api.get<ApiResponse<{category: Category; totalBoxes: number; activeBoxes: number}>>(`${this.baseUrl}/${id}/stats`);
    return response.data;
  }

  /**
   * Get a specific category by ID
   * GET /category/:id
   * @param id - Category ID
   * @returns Promise<ApiResponse<Category>> - Returns full response with success, message, timestamp
   */
  async getCategoryById(id: number): Promise<ApiResponse<Category>> {
    const response = await api.get<ApiResponse<Category>>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Update an existing category
   * PATCH /category/:id
   * @param id - Category ID
   * @param updateCategoryData - Category update data
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async updateCategory(id: number, updateCategoryData: UpdateCategoryData): Promise<OperationResponse> {
    const response = await api.patch<OperationResponse>(`${this.baseUrl}/${id}`, updateCategoryData);
    return response.data;
  }

  /**
   * Toggle category active status
   * PATCH /category/:id/toggle-active
   * @param id - Category ID
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async toggleCategoryActive(id: number): Promise<OperationResponse> {
    const response = await api.patch<OperationResponse>(`${this.baseUrl}/${id}/toggle-active`);
    return response.data;
  }

  /**
   * Toggle category featured status
   * PATCH /category/:id/toggle-featured
   * @param id - Category ID
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async toggleCategoryFeatured(id: number): Promise<OperationResponse> {
    const response = await api.patch<OperationResponse>(`${this.baseUrl}/${id}/toggle-featured`);
    return response.data;
  }

  /**
   * Delete a category
   * DELETE /category/:id
   * @param id - Category ID
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async deleteCategory(id: number): Promise<OperationResponse> {
    const response = await api.delete<OperationResponse>(`${this.baseUrl}/${id}`);
    return response.data;
  }
}

// Export singleton instance
export const categoryService = new CategoryService();
