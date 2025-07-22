/**
 * Level progression utility functions
 * Handles all calculations related to user level and experience points
 */

export const LEVEL_CONFIG = {
  MAX_LEVEL: 30,
  BASE_EXP_PER_LEVEL: 100, // Linear experience needed per level
} as const;

/**
 * Calculate total experience needed to reach a specific level
 * @param level - Target level (0-30)
 * @returns Total XP needed to reach that level
 */
export function getExpForLevel(level: number): number {
  if (level <= 0) return 0; // Level 0 requires 0 XP (starting point)
  return level * LEVEL_CONFIG.BASE_EXP_PER_LEVEL; // Level 1 = 100, Level 2 = 200, etc.
}

/**
 * Calculate level progression data for a user
 * @param userLevel - Current user level
 * @param userExp - Current user experience points
 * @returns Object containing all level progression data
 */
export function calculateLevelProgression(userLevel: number = 0, userExp: number = 0) {
  const currentLevel = Math.min(userLevel || 1, LEVEL_CONFIG.MAX_LEVEL);
  const currentExp = userExp || 0;
  
  // Calculate XP thresholds
  const currentLevelExp = getExpForLevel(currentLevel); // Total XP needed to reach current level
  const nextLevelExp = currentLevel >= LEVEL_CONFIG.MAX_LEVEL 
    ? currentLevelExp 
    : getExpForLevel(currentLevel + 1); // Total XP needed for next level
  
  // Calculate progress within current level
  const expNeededForCurrentLevel = LEVEL_CONFIG.BASE_EXP_PER_LEVEL; // XP needed for next level (always 100)
  const currentLevelProgress = currentLevel >= LEVEL_CONFIG.MAX_LEVEL 
    ? expNeededForCurrentLevel 
    : Math.max(0, currentExp - currentLevelExp); // Progress within current level
  
  // Calculate remaining XP needed for next level
  const expNeededForNext = currentLevel >= LEVEL_CONFIG.MAX_LEVEL 
    ? 0 
    : Math.max(0, expNeededForCurrentLevel - currentLevelProgress);
  
  // Calculate progress percentage (0-100%)
  const progressPercentage = currentLevel >= LEVEL_CONFIG.MAX_LEVEL 
    ? 100 
    : Math.max(0, Math.min(100, (currentLevelProgress / expNeededForCurrentLevel) * 100));
  
  // Check if user is at max level
  const isMaxLevel = currentLevel >= LEVEL_CONFIG.MAX_LEVEL;
  
  return {
    currentLevel,
    currentExp,
    currentLevelExp,
    nextLevelExp,
    expNeededForCurrentLevel,
    currentLevelProgress,
    expNeededForNext,
    progressPercentage,
    isMaxLevel,
    nextLevel: isMaxLevel ? currentLevel : currentLevel + 1,
  };
}

/**
 * Format level progress text for display
 * @param levelData - Level progression data from calculateLevelProgression
 * @returns Formatted strings for display
 */
export function formatLevelProgress(levelData: ReturnType<typeof calculateLevelProgression>) {
  const {
    currentLevel,
    nextLevel,
    expNeededForNext,
    currentLevelProgress,
    expNeededForCurrentLevel,
    isMaxLevel,
  } = levelData;
  
  return {
    currentLevelText: `Түвшин ${currentLevel}`,
    nextLevelText: isMaxLevel 
      ? "Максимум түвшин" 
      : `Түвшин ${nextLevel} хүртэл ${expNeededForNext} XP`,
    progressText: `${Math.floor(currentLevelProgress)} / ${Math.floor(expNeededForCurrentLevel)} XP`,
    maxLevelText: "Максимум түвшин",
  };
}
