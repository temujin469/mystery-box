import api from '../../lib/api';
import {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
  CategoryQuery,
  CategoryBulkAction,
  CategoryStats,
  CategoryFilter,
} from '../../types/category';
import { PaginatedResponse, ApiResponse } from '../../types/api';

/**
 * Category API Service
 * Handles all category-related API operations including CRUD, queries, and category management
 */
export class CategoryService {
  private readonly baseUrl = '/categories';

  /**
   * Get all categories with optional filtering and pagination
   * @param query - Query parameters for filtering, sorting, and pagination
   * @returns Promise<PaginatedResponse<Category>>
   */
  async getCategories(query?: CategoryQuery): Promise<PaginatedResponse<Category>> {
    const response = await api.get<PaginatedResponse<Category>>(this.baseUrl, {
      params: query,
    });
    return response.data;
  }

  /**
   * Get all active categories (public endpoint)
   * @param includeFeatured - Whether to prioritize featured categories
   * @returns Promise<Category[]>
   */
  async getActiveCategories(includeFeatured: boolean = true): Promise<Category[]> {
    const response = await api.get<Category[]>(`${this.baseUrl}/active`, {
      params: { includeFeatured },
    });
    return response.data;
  }

  /**
   * Get all featured categories
   * @returns Promise<Category[]>
   */
  async getFeaturedCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>(`${this.baseUrl}/featured`);
    return response.data;
  }

  /**
   * Get a specific category by ID
   * @param id - Category ID
   * @param includeRelations - Whether to include related data (items, boxes)
   * @returns Promise<Category>
   */
  async getCategoryById(id: number, includeRelations: boolean = false): Promise<Category> {
    const response = await api.get<Category>(`${this.baseUrl}/${id}`, {
      params: { includeRelations },
    });
    return response.data;
  }

  /**
   * Create a new category (admin only)
   * @param data - Category creation data
   * @returns Promise<Category>
   */
  async createCategory(data: CreateCategoryData): Promise<Category> {
    const response = await api.post<Category>(this.baseUrl, data);
    return response.data;
  }

  /**
   * Update an existing category (admin only)
   * @param id - Category ID
   * @param data - Category update data
   * @returns Promise<Category>
   */
  async updateCategory(id: number, data: UpdateCategoryData): Promise<Category> {
    const response = await api.patch<Category>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  /**
   * Delete a category (admin only)
   * @param id - Category ID
   * @returns Promise<void>
   */
  async deleteCategory(id: number): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Toggle category active status (admin only)
   * @param id - Category ID
   * @returns Promise<Category>
   */
  async toggleCategoryActive(id: number): Promise<Category> {
    const response = await api.patch<Category>(`${this.baseUrl}/${id}/toggle-active`);
    return response.data;
  }

  /**
   * Toggle category featured status (admin only)
   * @param id - Category ID
   * @returns Promise<Category>
   */
  async toggleCategoryFeatured(id: number): Promise<Category> {
    const response = await api.patch<Category>(`${this.baseUrl}/${id}/toggle-featured`);
    return response.data;
  }

  /**
   * Search categories by name or description
   * @param query - Search query string
   * @param activeOnly - Whether to search only active categories
   * @returns Promise<Category[]>
   */
  async searchCategories(query: string, activeOnly: boolean = true): Promise<Category[]> {
    const response = await api.get<Category[]>(`${this.baseUrl}/search`, {
      params: { q: query, activeOnly },
    });
    return response.data;
  }

  /**
   * Get category statistics (admin only)
   * @returns Promise<CategoryStats>
   */
  async getCategoryStats(): Promise<CategoryStats> {
    const response = await api.get<CategoryStats>(`${this.baseUrl}/stats`);
    return response.data;
  }

  /**
   * Get categories with box count
   * @param activeOnly - Whether to include only active categories
   * @returns Promise<Category[]>
   */
  async getCategoriesWithBoxCount(activeOnly: boolean = true): Promise<Category[]> {
    const response = await api.get<Category[]>(`${this.baseUrl}/with-counts`, {
      params: { activeOnly, include: 'boxes' },
    });
    return response.data;
  }

  /**
   * Perform bulk actions on categories (admin only)
   * @param action - Bulk action configuration
   * @returns Promise<ApiResponse>
   */
  async bulkAction(action: CategoryBulkAction): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(`${this.baseUrl}/bulk`, action);
    return response.data;
  }

  /**
   * Get categories filtered by various criteria
   * @param filter - Filter criteria
   * @returns Promise<Category[]>
   */
  async getFilteredCategories(filter: CategoryFilter): Promise<Category[]> {
    const response = await api.get<Category[]>(`${this.baseUrl}/filter`, {
      params: filter,
    });
    return response.data;
  }

  /**
   * Count total categories
   * @param activeOnly - Whether to count only active categories
   * @returns Promise<number>
   */
  async countCategories(activeOnly: boolean = false): Promise<number> {
    const response = await api.get<{ count: number }>(`${this.baseUrl}/count`, {
      params: { activeOnly },
    });
    return response.data.count;
  }

  /**
   * Reorder categories (admin only)
   * @param categoryOrders - Array of {id, order} objects
   * @returns Promise<Category[]>
   */
  async reorderCategories(categoryOrders: Array<{ id: number; order: number }>): Promise<Category[]> {
    const response = await api.patch<Category[]>(`${this.baseUrl}/reorder`, {
      orders: categoryOrders,
    });
    return response.data;
  }

  /**
   * Export categories to CSV (admin only)
   * @param query - Optional query parameters for filtering
   * @returns Promise<Blob>
   */
  async exportCategories(query?: CategoryQuery): Promise<Blob> {
    const response = await api.get(`${this.baseUrl}/export`, {
      params: query,
      responseType: 'blob',
    });
    return response.data;
  }

  /**
   * Upload category image
   * @param id - Category ID
   * @param file - Image file
   * @returns Promise<Category>
   */
  async uploadCategoryImage(id: number, file: File): Promise<Category> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<Category>(`${this.baseUrl}/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Remove category image
   * @param id - Category ID
   * @returns Promise<Category>
   */
  async removeCategoryImage(id: number): Promise<Category> {
    const response = await api.delete<Category>(`${this.baseUrl}/${id}/image`);
    return response.data;
  }
}

// Export singleton instance
export const categoryService = new CategoryService();
