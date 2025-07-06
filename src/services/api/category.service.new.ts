import api from '../../lib/api';
import {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
} from '../../types/category';
import { PaginatedResponse } from '../../types/api';

export interface CategoryQuery {
  page?: number;
  limit?: number;
  orderBy?: CategoryOrderByField;
  orderDirection?: 'ASC' | 'DESC';
  name?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

export enum CategoryOrderByField {
  ID = 'id',
  NAME = 'name',
  IS_ACTIVE = 'is_active',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
}

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
   * @returns Promise<Category>
   */
  async createCategory(createCategoryData: CreateCategoryData): Promise<Category> {
    const response = await api.post<Category>(this.baseUrl, createCategoryData);
    return response.data;
  }

  /**
   * Get all categories with optional filtering and pagination
   * GET /category
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
   * Get all categories with simple filtering (no pagination)
   * GET /category/simple
   * @param name - Optional name filter
   * @param isActive - Optional active status filter
   * @returns Promise<Category[]>
   */
  async getCategoriesSimple(name?: string, isActive?: boolean): Promise<Category[]> {
    const params: any = {};
    if (name) params.name = name;
    if (isActive !== undefined) params.isActive = isActive;

    const response = await api.get<Category[]>(`${this.baseUrl}/simple`, { params });
    return response.data;
  }

  /**
   * Get all active categories
   * GET /category/active
   * @returns Promise<Category[]>
   */
  async getActiveCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>(`${this.baseUrl}/active`);
    return response.data;
  }

  /**
   * Get all featured categories
   * GET /category/featured
   * @returns Promise<Category[]>
   */
  async getFeaturedCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>(`${this.baseUrl}/featured`);
    return response.data;
  }

  /**
   * Get category statistics
   * GET /category/:id/stats
   * @param id - Category ID
   * @returns Promise<any>
   */
  async getCategoryStats(id: number): Promise<any> {
    const response = await api.get<any>(`${this.baseUrl}/${id}/stats`);
    return response.data;
  }

  /**
   * Get a specific category by ID
   * GET /category/:id
   * @param id - Category ID
   * @returns Promise<Category>
   */
  async getCategoryById(id: number): Promise<Category> {
    const response = await api.get<Category>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Update an existing category
   * PATCH /category/:id
   * @param id - Category ID
   * @param updateCategoryData - Category update data
   * @returns Promise<Category>
   */
  async updateCategory(id: number, updateCategoryData: UpdateCategoryData): Promise<Category> {
    const response = await api.patch<Category>(`${this.baseUrl}/${id}`, updateCategoryData);
    return response.data;
  }

  /**
   * Toggle category active status
   * PATCH /category/:id/toggle-active
   * @param id - Category ID
   * @returns Promise<Category>
   */
  async toggleCategoryActive(id: number): Promise<Category> {
    const response = await api.patch<Category>(`${this.baseUrl}/${id}/toggle-active`);
    return response.data;
  }

  /**
   * Toggle category featured status
   * PATCH /category/:id/toggle-featured
   * @param id - Category ID
   * @returns Promise<Category>
   */
  async toggleCategoryFeatured(id: number): Promise<Category> {
    const response = await api.patch<Category>(`${this.baseUrl}/${id}/toggle-featured`);
    return response.data;
  }

  /**
   * Delete a category
   * DELETE /category/:id
   * @param id - Category ID
   * @returns Promise<void>
   */
  async deleteCategory(id: number): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }
}

// Export singleton instance
export const categoryService = new CategoryService();
