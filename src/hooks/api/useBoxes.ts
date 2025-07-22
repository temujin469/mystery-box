import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { boxService } from "../../services/api";
import {
  Box,
  CreateBoxData,
  UpdateBoxData,
  BoxQuery,
  BoxOpenResponse,
  BoxOpenHistory,
  BoxOpenHistoryQuery,
} from "../../types/box";
import { PaginatedResponse } from "../../types/api";
import { authKeys, useCurrentUser } from "./useAuth";
import { achievementKeys } from "./useAchievements";
import { userKeys } from "./useUsers";

// Query Keys
export const boxKeys = {
  all: ["boxes"] as const,
  lists: () => [...boxKeys.all, "list"] as const,
  list: (query?: BoxQuery) => [...boxKeys.lists(), query] as const,
  simple: (name?: string, isFeatured?: boolean) =>
    [...boxKeys.all, "simple", { name, isFeatured }] as const,
  featured: () => [...boxKeys.all, "featured"] as const,
  search: (name: string) => [...boxKeys.all, "search", name] as const,
  details: () => [...boxKeys.all, "detail"] as const,
  detail: (id: string) => [...boxKeys.details(), id] as const,
  // Box Opening History Keys
  history: () => [...boxKeys.all, "history"] as const,
  userHistory: (query?: BoxOpenHistoryQuery) =>
    [...boxKeys.history(), "user", query] as const,
};

// Query Hooks
export const useBoxes = (query?: BoxQuery) => {
  return useQuery({
    queryKey: boxKeys.list(query),
    queryFn: () => boxService.getBoxes(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBoxesSimple = (name?: string, isFeatured?: boolean) => {
  return useQuery({
    queryKey: boxKeys.simple(name, isFeatured),
    queryFn: () => boxService.getBoxesSimple(name, isFeatured),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFeaturedBoxes = () => {
  return useQuery({
    queryKey: boxKeys.featured(),
    queryFn: () => boxService.getFeaturedBoxes(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSearchBoxesByName = (name: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: boxKeys.search(name),
    queryFn: () => boxService.searchBoxesByName(name),
    enabled: enabled && name.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useBox = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: boxKeys.detail(id.toString()),
    queryFn: () => boxService.getBoxById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutation Hooks
export const useCreateBox = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBoxData) => boxService.createBox(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boxKeys.lists() });
      queryClient.invalidateQueries({ queryKey: boxKeys.featured() });
    },
  });
};

export const useUpdateBox = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBoxData }) =>
      boxService.updateBox(id, data),
    onSuccess: (updatedBox) => {
      queryClient.invalidateQueries({ queryKey: boxKeys.lists() });
      queryClient.invalidateQueries({ queryKey: boxKeys.featured() });
      queryClient.setQueryData(
        boxKeys.detail(updatedBox.id.toString()),
        updatedBox
      );
    },
  });
};

export const useUpdateBoxFeaturedStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: number; isFeatured: boolean }) =>
      boxService.updateFeaturedStatus(id, isFeatured),
    onSuccess: (updatedBox) => {
      queryClient.invalidateQueries({ queryKey: boxKeys.lists() });
      queryClient.invalidateQueries({ queryKey: boxKeys.featured() });
      queryClient.setQueryData(
        boxKeys.detail(updatedBox.id.toString()),
        updatedBox
      );
    },
  });
};

export const useDeleteBox = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => boxService.deleteBox(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: boxKeys.lists() });
      queryClient.invalidateQueries({ queryKey: boxKeys.featured() });
      queryClient.removeQueries({
        queryKey: boxKeys.detail(deletedId.toString()),
      });
    },
  });
};

// ================= BOX OPENING HOOKS =================

/**
 * Hook to get user's box opening history with pagination
 */
export const useMyBoxOpenHistory = (
  query?: BoxOpenHistoryQuery,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: boxKeys.userHistory(query),
    queryFn: () => boxService.getMyBoxOpenHistory(query),
    enabled: enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// ================= CONVENIENCE HOOKS FOR CURRENT USER =================

/**
 * Convenience hook to open a box for the current user
 */
export const useOpenMyBox = () => {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (boxId: number) => boxService.openBox(boxId),
    onSuccess: (data) => {
      if (!user?.id) return;

      // Invalidate user's box opening history
      queryClient.invalidateQueries({
        queryKey: boxKeys.history(),
      });

      // Invalidate user's inventory and stats if those hooks exist
      queryClient.invalidateQueries({
        queryKey: userKeys.inventory(user.id),
      });
      queryClient.invalidateQueries({
        queryKey: userKeys.stats(user.id),
      });

      queryClient.invalidateQueries({
        queryKey: authKeys.profile(),
      });

      // invalidate achievement progress
      queryClient.invalidateQueries({
        queryKey: achievementKeys.myProgress(),
      });
    },
    // Only enable if user is logged in
    mutationKey: ["openMyBox", user?.id],
  });
};
