import api from '../../lib/api';
import {
  User,
  RegisterData,
  UpdateUserData,
  UpdateCoinsData,
  UpdateExperienceData,
  UserStats,
  UserRole,
} from '../../types/auth';
import { PaginatedResponse } from '../../types/api';

export interface UserQuery {
  page?: number;
  limit?: number;
  orderBy?: UserOrderByField;
  orderDirection?: 'ASC' | 'DESC';
  search?: string;
  email?: string;
  username?: string;
  minLevel?: number;
  maxLevel?: number;
  minCoins?: number;
  maxCoins?: number;
  role?: UserRole;
}

export enum UserOrderByField {
  ID = 'id',
  EMAIL = 'email',
  USERNAME = 'username',
  FIRSTNAME = 'firstname',
  LASTNAME = 'lastname',
  COINS = 'coins',
  LEVEL = 'level',
  EXPERIENCE_POINTS = 'experience_points',
  ROLE = 'role',
  CREATED_AT = 'created_at',
}

/**
 * User API Service
 * Handles all user-related API operations matching the backend controller exactly
 */
export class UserService {
  private readonly baseUrl = '/user';

  /**
   * Create a new user
   * POST /user
   * @param createUserData - User creation data
   * @returns Promise<User>
   */
  async createUser(createUserData: RegisterData): Promise<User> {
    const response = await api.post<User>(this.baseUrl, createUserData);
    return response.data;
  }

  /**
   * Get all users with optional filtering and pagination
   * GET /user
   * @param query - Query parameters for filtering, sorting, and pagination
   * @returns Promise<PaginatedResponse<User>>
   */
  async getUsers(query?: UserQuery): Promise<PaginatedResponse<User>> {
    const response = await api.get<PaginatedResponse<User>>(this.baseUrl, {
      params: query,
    });
    return response.data;
  }

  /**
   * Find user by email
   * GET /user/search/email/:email
   * @param email - User email
   * @returns Promise<User>
   */
  async findByEmail(email: string): Promise<User> {
    const response = await api.get<User>(`${this.baseUrl}/search/email/${email}`);
    return response.data;
  }

  /**
   * Find user by username
   * GET /user/search/username/:username
   * @param username - Username
   * @returns Promise<User>
   */
  async findByUsername(username: string): Promise<User> {
    const response = await api.get<User>(`${this.baseUrl}/search/username/${username}`);
    return response.data;
  }

  /**
   * Get user statistics
   * GET /user/:id/stats
   * @param id - User ID
   * @returns Promise<UserStats>
   */
  async getUserStats(id: string): Promise<UserStats> {
    const response = await api.get<UserStats>(`${this.baseUrl}/${id}/stats`);
    return response.data;
  }

  /**
   * Get a specific user by ID
   * GET /user/:id
   * @param id - User ID
   * @returns Promise<User>
   */
  async getUserById(id: string): Promise<User> {
    const response = await api.get<User>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Update a user (requires ADMIN or EDITOR role)
   * PATCH /user/:id
   * @param id - User ID
   * @param updateUserData - User update data
   * @returns Promise<User>
   */
  async updateUser(id: string, updateUserData: UpdateUserData): Promise<User> {
    const response = await api.patch<User>(`${this.baseUrl}/${id}`, updateUserData);
    return response.data;
  }

  /**
   * Update user coins
   * PATCH /user/:id/coins
   * @param id - User ID
   * @param coinsData - Coins update data
   * @returns Promise<User>
   */
  async updateUserCoins(id: string, coinsData: UpdateCoinsData): Promise<User> {
    const response = await api.patch<User>(`${this.baseUrl}/${id}/coins`, coinsData);
    return response.data;
  }

  /**
   * Update user experience points
   * PATCH /user/:id/experience
   * @param id - User ID
   * @param experienceData - Experience update data
   * @returns Promise<User>
   */
  async updateUserExperience(id: string, experienceData: UpdateExperienceData): Promise<User> {
    const response = await api.patch<User>(`${this.baseUrl}/${id}/experience`, experienceData);
    return response.data;
  }

  /**
   * Promote user to admin
   * PATCH /user/:id/promote
   * @param id - User ID
   * @returns Promise<User>
   */
  async promoteToAdmin(id: string): Promise<User> {
    const response = await api.patch<User>(`${this.baseUrl}/${id}/promote`);
    return response.data;
  }

  /**
   * Demote user from admin
   * PATCH /user/:id/demote
   * @param id - User ID
   * @returns Promise<User>
   */
  async demoteFromAdmin(id: string): Promise<User> {
    const response = await api.patch<User>(`${this.baseUrl}/${id}/demote`);
    return response.data;
  }

  /**
   * Delete a user
   * DELETE /user/:id
   * @param id - User ID
   * @returns Promise<void>
   */
  async deleteUser(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }
}

// Export singleton instance
export const userService = new UserService();
