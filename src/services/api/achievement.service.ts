import api from "../../lib/api";
import {
  Achievement,
  UserAchievement,
  CreateAchievementData,
  UpdateAchievementData,
  AchievementStats,
  UserAchievementProgress,
} from "../../types/achievement";
import { ApiResponse, OperationResponse } from "../../types/api-response";

class AchievementService {
  private readonly baseUrl = "/achievements";

  // Admin endpoints - Return full response data with success, message, timestamp
  async getAchievements(): Promise<ApiResponse<Achievement[]>> {
    const response = await api.get<ApiResponse<Achievement[]>>(this.baseUrl);
    return response.data;
  }

  async getAchievement(id: number): Promise<ApiResponse<Achievement>> {
    const response = await api.get<ApiResponse<Achievement>>(
      `${this.baseUrl}/${id}`
    );
    return response.data;
  }

  async createAchievement(
    achievementData: CreateAchievementData
  ): Promise<OperationResponse> {
    const response = await api.post<OperationResponse>(
      this.baseUrl,
      achievementData
    );
    return response.data;
  }

  async updateAchievement(
    id: number,
    achievementData: UpdateAchievementData
  ): Promise<OperationResponse> {
    const response = await api.patch<OperationResponse>(
      `${this.baseUrl}/${id}`,
      achievementData
    );
    return response.data;
  }

  async deleteAchievement(id: number): Promise<OperationResponse> {
    const response = await api.delete<OperationResponse>(
      `${this.baseUrl}/${id}`
    );
    return response.data;
  }

  async getAchievementStats(): Promise<ApiResponse<AchievementStats>> {
    const response = await api.get<ApiResponse<AchievementStats>>(
      `${this.baseUrl}/stats`
    );
    return response.data;
  }

  // Current user endpoints (requires authentication) - Return full response data with success, message, timestamp
  async getMyAchievements(): Promise<ApiResponse<UserAchievement[]>> {
    const response = await api.get<ApiResponse<UserAchievement[]>>(
      `${this.baseUrl}/me/achievements`
    );
    return response.data;
  }

  async getMyProgress(): Promise<ApiResponse<UserAchievementProgress[]>> {
    const response = await api.get<ApiResponse<UserAchievementProgress[]>>(
      `${this.baseUrl}/me/progress`
    );
    return response.data;
  }
}

export const achievementService = new AchievementService();
