import { Box } from "./box";

/**
 * Achievement trigger conditions for different user actions
 */
export enum AchievementConditionKey {
  USER_LEVEL = "user_level",
  OPEN_BOXES = "open_boxes",
}

/**
 * Main achievement entity with rewards and unlock conditions
 */
export interface Achievement {
  id: number;
  name: string;
  description: string;
  reward_box_id: number;
  reward_box: Partial<Box>; // Box details when loaded
  condition_key: AchievementConditionKey; // Trigger condition type
  condition_value: number; // Required value to unlock
}

/**
 * User's unlocked achievement with timestamp (matches UserAchievementDto)
 */
export interface UserAchievement {
  achievement_id: number;
  unlocked_at: Date;
  achievement: {
    id: number;
    name: string;
    description: string;
    reward_box_id: number;
  };
}

/**
 * Create achievement data (admin only)
 */
export interface CreateAchievementData {
  name: string;
  description: string;
  reward_box_id: number;
  condition_key: AchievementConditionKey;
  condition_value: number;
}

/**
 * Update achievement data - partial updates (admin only)
 */
export interface UpdateAchievementData extends Partial<CreateAchievementData> {}

/**
 * System-wide achievement statistics (admin view)
 */
export interface AchievementStats {
  total_achievements: number;
  total_unlocked: number;
  most_popular_achievement: Achievement | null;
}

/**
 * User's progress toward unlocking achievements (matches AchievementProgressDto)
 */
export interface UserAchievementProgress
  extends Pick<
    Achievement,
    | "id"
    | "name"
    | "description"
    | "reward_box_id"
    | "condition_key"
    | "condition_value"
  > {
  is_unlocked: boolean;
  unlocked_at?: Date;
  progress_percentage: number;
  current_progress: number;
  image_url: string;
}
