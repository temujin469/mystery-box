import api from '../../lib/api';
import {
  User,
  UpdateUserData,
  UpdateCoinsData,
  UpdateExperienceData,
  UserStats,
  UserRole,
} from '../../types/auth';
import { PaginatedResponse, ApiResponse } from '../../types/api';

export interface UserQuery {
  page?: number;
  limit?: number;
  orderBy?: UserOrderByField;
  orderDirection?: 'ASC' | 'DESC';
  email?: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  role?: UserRole;
  minCoins?: number;
  maxCoins?: number;
  minLevel?: number;
  maxLevel?: number;
  minExperience?: number;
  maxExperience?: number;
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
  UPDATED_AT = 'updated_at',
}

/**
 * User API Service
 * Handles all user-related API operations including CRUD, queries, and user management
 */
export class UserService {
  private readonly baseUrl = '/user'; // Note: singular 'user' to match your backend

  /**
   * Get all users with optional filtering and pagination (admin only)
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
   * Get a specific user by ID
   * @param id - User ID
   * @param includeStats - Whether to include user statistics
   * @returns Promise<User>
   */
  async getUserById(id: string, includeStats: boolean = false): Promise<User> {
    const response = await api.get<User>(`${this.baseUrl}/${id}`, {
      params: { includeStats },
    });
    return response.data;
  }

  /**
   * Update a user (admin only or self)
   * @param id - User ID
   * @param data - User update data
   * @returns Promise<User>
   */
  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const response = await api.patch<User>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  /**
   * Delete a user (admin only)
   * @param id - User ID
   * @returns Promise<void>
   */
  async deleteUser(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Update user coins
   * @param id - User ID
   * @param data - Coins update data
   * @returns Promise<User>
   */
  async updateUserCoins(id: string, data: UpdateCoinsData): Promise<User> {
    const response = await api.patch<User>(`${this.baseUrl}/${id}/coins`, data);
    return response.data;
  }

  /**
   * Update user experience points
   * @param id - User ID
   * @param data - Experience update data
   * @returns Promise<User>
   */
  async updateUserExperience(id: string, data: UpdateExperienceData): Promise<User> {
    const response = await api.patch<User>(`${this.baseUrl}/${id}/experience`, data);
    return response.data;
  }

  /**
   * Get user statistics
   * @param id - User ID
   * @returns Promise<UserStats>
   */
  async getUserStats(id: string): Promise<UserStats> {
    const response = await api.get<UserStats>(`${this.baseUrl}/${id}/stats`);
    return response.data;
  }

  /**
   * Search users by email or username
   * @param query - Search query string
   * @param limit - Maximum number of results
   * @returns Promise<User[]>
   */
  async searchUsers(query: string, limit: number = 10): Promise<User[]> {
    const response = await api.get<User[]>(`${this.baseUrl}/search`, {
      params: { q: query, limit },
    });
    return response.data;
  }

  /**
   * Get user leaderboard by coins
   * @param limit - Number of top users to return
   * @returns Promise<User[]>
   */
  async getCoinLeaderboard(limit: number = 100): Promise<User[]> {
    const response = await api.get<User[]>(`${this.baseUrl}/leaderboard/coins`, {
      params: { limit },
    });
    return response.data;
  }

  /**
   * Get user leaderboard by level
   * @param limit - Number of top users to return
   * @returns Promise<User[]>
   */
  async getLevelLeaderboard(limit: number = 100): Promise<User[]> {
    const response = await api.get<User[]>(`${this.baseUrl}/leaderboard/level`, {
      params: { limit },
    });
    return response.data;
  }

  /**
   * Get user leaderboard by experience points
   * @param limit - Number of top users to return
   * @returns Promise<User[]>
   */
  async getExperienceLeaderboard(limit: number = 100): Promise<User[]> {
    const response = await api.get<User[]>(`${this.baseUrl}/leaderboard/experience`, {
      params: { limit },
    });
    return response.data;
  }

  /**
   * Ban a user (admin only)
   * @param id - User ID
   * @param reason - Ban reason
   * @returns Promise<ApiResponse>
   */
  async banUser(id: string, reason?: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(`${this.baseUrl}/${id}/ban`, {
      reason,
    });
    return response.data;
  }

  /**
   * Unban a user (admin only)
   * @param id - User ID
   * @returns Promise<ApiResponse>
   */
  async unbanUser(id: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(`${this.baseUrl}/${id}/unban`);
    return response.data;
  }

  /**
   * Update user role (admin only)
   * @param id - User ID
   * @param role - New role
   * @returns Promise<User>
   */
  async updateUserRole(id: string, role: UserRole): Promise<User> {
    const response = await api.patch<User>(`${this.baseUrl}/${id}/role`, { role });
    return response.data;
  }

  /**
   * Get users by role (admin only)
   * @param role - User role
   * @param query - Optional query parameters
   * @returns Promise<PaginatedResponse<User>>
   */
  async getUsersByRole(role: UserRole, query?: UserQuery): Promise<PaginatedResponse<User>> {
    const response = await api.get<PaginatedResponse<User>>(`${this.baseUrl}/role/${role}`, {
      params: query,
    });
    return response.data;
  }

  /**
   * Count total users
   * @param role - Optional role filter
   * @returns Promise<number>
   */
  async countUsers(role?: UserRole): Promise<number> {
    const response = await api.get<{ count: number }>(`${this.baseUrl}/count`, {
      params: { role },
    });
    return response.data.count;
  }

  /**
   * Get recently registered users (admin only)
   * @param days - Number of days to look back
   * @param limit - Maximum number of users to return
   * @returns Promise<User[]>
   */
  async getRecentUsers(days: number = 7, limit: number = 50): Promise<User[]> {
    const response = await api.get<User[]>(`${this.baseUrl}/recent`, {
      params: { days, limit },
    });
    return response.data;
  }

  /**
   * Export users to CSV (admin only)
   * @param query - Optional query parameters for filtering
   * @returns Promise<Blob>
   */
  async exportUsers(query?: UserQuery): Promise<Blob> {
    const response = await api.get(`${this.baseUrl}/export`, {
      params: query,
      responseType: 'blob',
    });
    return response.data;
  }

  /**
   * Upload user avatar
   * @param id - User ID
   * @param file - Avatar image file
   * @returns Promise<User>
   */
  async uploadAvatar(id: string, file: File): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post<User>(`${this.baseUrl}/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Remove user avatar
   * @param id - User ID
   * @returns Promise<User>
   */
  async removeAvatar(id: string): Promise<User> {
    const response = await api.delete<User>(`${this.baseUrl}/${id}/avatar`);
    return response.data;
  }

  /**
   * Award coins to user (admin only)
   * @param id - User ID
   * @param amount - Amount of coins to award
   * @param reason - Reason for awarding coins
   * @returns Promise<User>
   */
  async awardCoins(id: string, amount: number, reason?: string): Promise<User> {
    const response = await api.post<User>(`${this.baseUrl}/${id}/award-coins`, {
      amount,
      reason,
    });
    return response.data;
  }

  /**
   * Award experience to user (admin only)
   * @param id - User ID
   * @param amount - Amount of experience to award
   * @param reason - Reason for awarding experience
   * @returns Promise<User>
   */
  async awardExperience(id: string, amount: number, reason?: string): Promise<User> {
    const response = await api.post<User>(`${this.baseUrl}/${id}/award-experience`, {
      amount,
      reason,
    });
    return response.data;
  }
}

// Export singleton instance
export const userService = new UserService();
