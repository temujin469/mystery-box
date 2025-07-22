import api from "../../lib/api";
import {
  Achievement,
  UserAchievement,
  CreateAchievementData,
  UpdateAchievementData,
  AchievementStats,
  UserAchievementProgress,
} from "../../types/achievement";

class AchievementService {
  // Admin endpoints
  async getAchievements(): Promise<Achievement[]> {
    const { data } = await api.get("/achievements");
    return data;
  }

  async getAchievement(id: number): Promise<Achievement> {
    const { data } = await api.get(`/achievements/${id}`);
    return data;
  }

  async createAchievement(achievementData: CreateAchievementData): Promise<Achievement> {
    const { data } = await api.post("/achievements", achievementData);
    return data;
  }

  async updateAchievement(id: number, achievementData: UpdateAchievementData): Promise<Achievement> {
    const { data } = await api.patch(`/achievements/${id}`, achievementData);
    return data;
  }

  async deleteAchievement(id: number): Promise<void> {
    await api.delete(`/achievements/${id}`);
  }

  async getAchievementStats(): Promise<AchievementStats> {
    const { data } = await api.get("/achievements/stats");
    return data;
  }

  // User-specific endpoints
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const { data } = await api.get(`/achievements/user/${userId}`);
    return data;
  }

  async getUserProgress(userId: string): Promise<UserAchievementProgress[]> {
    const { data } = await api.get(`/achievements/user/${userId}/progress`);
    return data;
  }

  async unlockAchievement(userId: string, achievementId: number): Promise<UserAchievement> {
    const { data } = await api.post(`/achievements/user/${userId}/unlock/${achievementId}`);
    return data;
  }

  async checkAndUnlockAchievements(userId: string): Promise<UserAchievement[]> {
    const { data } = await api.post(`/achievements/user/${userId}/check-unlock`);
    return data;
  }

  // Current user endpoints (requires authentication)
  async getMyAchievements(): Promise<UserAchievement[]> {
    const { data } = await api.get("/achievements/me/achievements");
    return data;
  }

  async getMyProgress(): Promise<UserAchievementProgress[]> {
    const { data } = await api.get("/achievements/me/progress");
    return data;
  }

  async checkMyAchievements(): Promise<UserAchievement[]> {
    const { data } = await api.post("/achievements/me/check-unlock");
    return data;
  }
}

export const achievementService = new AchievementService();
