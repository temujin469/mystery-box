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
  return useQuery({
    queryKey: achievementKeys.list(),
    queryFn: () => achievementService.getAchievements(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (response) => ({
      achievements: response.data,
      message: response.message,
      success: response.success,
    }),
  });
}

export function useAchievement(id: number, enabled = true) {
  return useQuery({
    queryKey: achievementKeys.detail(id),
    queryFn: () => achievementService.getAchievement(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (response) => ({
      achievement: response.data,
      message: response.message,
      success: response.success,
    }),
  });
}

export function useAchievementStats() {
  return useQuery({
    queryKey: achievementKeys.stats(),
    queryFn: achievementService.getAchievementStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (response) => ({
      stats: response.data,
      message: response.message,
      success: response.success,
    }),
  });
}

// Hooks for current user (authenticated)
export function useMyAchievements() {
  const { data: user } = useCurrentUser();
  
  return useQuery({
    queryKey: achievementKeys.myAchievements(),
    queryFn: () => achievementService.getMyAchievements(),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (response) => ({
      achievements: response.data,
      message: response.message,
      success: response.success,
    }),
  });
}

export function useMyProgress() {
  const { data: user } = useCurrentUser();
  
  return useQuery({
    queryKey: achievementKeys.myProgress(),
    queryFn: () => achievementService.getMyProgress(),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (response) => ({
      progress: response.data,
      message: response.message,
      success: response.success,
    }),
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
