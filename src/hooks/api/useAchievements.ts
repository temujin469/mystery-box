import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { achievementService } from "../../services/api";
import {
  Achievement,
  UserAchievement,
  CreateAchievementData,
  UpdateAchievementData,
  AchievementStats,
  UserAchievementProgress,
} from "../../types/achievement";
import { useCurrentUser } from "./useAuth";

// Query Keys
export const achievementKeys = {
  all: ["achievements"] as const,
  lists: () => [...achievementKeys.all, "list"] as const,
  list: () => [...achievementKeys.lists()] as const,
  details: () => [...achievementKeys.all, "detail"] as const,
  detail: (id: number) => [...achievementKeys.details(), id] as const,
  stats: () => [...achievementKeys.all, "stats"] as const,
  my: () => [...achievementKeys.all, "my"] as const,
  myAchievements: () => [...achievementKeys.my(), "achievements"] as const,
  myProgress: () => [...achievementKeys.my(), "progress"] as const,
} as const;

// Hooks for admin/public endpoints
export function useAchievements() {
  return useQuery<Achievement[]>({
    queryKey: achievementKeys.list(),
    queryFn: () => achievementService.getAchievements(),
  });
}

export function useAchievement(id: number, enabled = true) {
  return useQuery<Achievement>({
    queryKey: achievementKeys.detail(id),
    queryFn: () => achievementService.getAchievement(id),
    enabled: enabled && !!id,
  });
}

export function useAchievementStats() {
  return useQuery<AchievementStats>({
    queryKey: achievementKeys.stats(),
    queryFn: achievementService.getAchievementStats,
  });
}

// Hooks for current user (authenticated)
export function useMyAchievements() {
  const { data: user } = useCurrentUser();
  
  return useQuery<UserAchievement[]>({
    queryKey: achievementKeys.myAchievements(),
    queryFn: achievementService.getMyAchievements,
    enabled: !!user,
  });
}

export function useMyProgress() {
  const { data: user } = useCurrentUser();
  
  return useQuery<UserAchievementProgress[]>({
    queryKey: achievementKeys.myProgress(),
    queryFn: achievementService.getMyProgress,
    enabled: !!user,
  });
}

// Mutation hooks for admin operations
export function useCreateAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAchievementData) => achievementService.createAchievement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: achievementKeys.lists() });
      queryClient.invalidateQueries({ queryKey: achievementKeys.stats() });
    },
  });
}

export function useUpdateAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAchievementData }) =>
      achievementService.updateAchievement(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: achievementKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: achievementKeys.lists() });
      queryClient.invalidateQueries({ queryKey: achievementKeys.stats() });
    },
  });
}

export function useDeleteAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => achievementService.deleteAchievement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: achievementKeys.lists() });
      queryClient.invalidateQueries({ queryKey: achievementKeys.stats() });
    },
  });
}

// Mutation hooks for user operations (commented for future usage)
// export function useUnlockAchievement() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ userId, achievementId }: { userId: string; achievementId: number }) =>
//       achievementService.unlockAchievement(userId, achievementId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: achievementKeys.myAchievements() });
//       queryClient.invalidateQueries({ queryKey: achievementKeys.myProgress() });
//     },
//   });
// }

// export function useCheckAndUnlockAchievements() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (userId: string) => achievementService.checkAndUnlockAchievements(userId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: achievementKeys.myAchievements() });
//       queryClient.invalidateQueries({ queryKey: achievementKeys.myProgress() });
//     },
//   });
// }

export function useCheckMyAchievements() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: achievementService.checkMyAchievements,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: achievementKeys.myAchievements() });
      queryClient.invalidateQueries({ queryKey: achievementKeys.myProgress() });
    },
  });
}
