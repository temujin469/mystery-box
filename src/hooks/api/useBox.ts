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
import { authKeys, useCurrentUser } from "./useAuth";
import { achievementKeys } from "./useAchievement";
import { userKeys } from "./useUser";

// Query Keys
export const boxKeys = {
  all: ["boxes"] as const,
  lists: () => [...boxKeys.all, "list"] as const,
  list: (query?: BoxQuery) => [...boxKeys.lists(), query] as const,
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
    queryFn: async () => {
      const response = await boxService.getBoxes(query);
      return {
        boxes: response.data,
        pagination: response.pagination,
        message: response.message,
        success: response.success,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBox = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: boxKeys.detail(id.toString()),
    queryFn: async () => {
      const response = await boxService.getBoxById(id);
      return {
        box: response.data,
        message: response.message,
        success: response.success,
      };
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutation Hooks
export const useCreateBox = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBoxData) => boxService.createBox(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: boxKeys.lists() });
      }
    },
  });
};

export const useUpdateBox = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBoxData }) =>
      boxService.updateBox(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: boxKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: boxKeys.detail(id.toString()),
      });
    },
  });
};

export const useUpdateBoxFeaturedStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: number; isFeatured: boolean }) =>
      boxService.updateFeaturedStatus(id, isFeatured),
    onSuccess: (response, variables) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: boxKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: boxKeys.detail(variables.id.toString()),
        });
      }
    },
  });
};

export const useDeleteBox = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => boxService.deleteBox(id),
    onSuccess: (response, deletedId) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: boxKeys.lists() });
        queryClient.removeQueries({
          queryKey: boxKeys.detail(deletedId.toString()),
        });
      }
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
    queryFn: async () => {
      const response = await boxService.getMyBoxOpenHistory(query);
      return {
        history: response.data,
        pagination: response.pagination,
        message: response.message,
        success: response.success,
      };
    },
    enabled: enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// ================= CONVENIENCE HOOKS FOR CURRENT USER =================

/**
 * Convenience hook to get available boxes (availableNow: true)
 */
export const useAvailableBoxes = (query?: BoxQuery) => {
  return useQuery({
    queryKey: boxKeys.list(query),
    queryFn: async () => {
      const response = await boxService.getBoxes({
        ...query,
      });
      return {
        boxes: response.data,
        pagination: response.pagination,
        message: response.message,
        success: response.success,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Convenience hook to open a box for the current user
 */
export const useOpenMyBox = () => {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (boxId: number) => boxService.openBox(boxId),
    onSuccess: (response) => {
      if (!user?.id || !response.success) return;

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

/**
 * Hook to open an achievement reward box for the current user
 */
export const useOpenRewardBox = () => {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      boxId,
      achievementId,
    }: {
      boxId: number;
      achievementId: number;
    }) => boxService.openRewardBox(boxId, achievementId),
    onSuccess: (response) => {
      if (!user?.id || !response.success) return;

      // Invalidate user's box opening history
      queryClient.invalidateQueries({
        queryKey: boxKeys.history(),
      });

      // Invalidate user's inventory and stats
      queryClient.invalidateQueries({
        queryKey: userKeys.inventory(user.id),
      });
      queryClient.invalidateQueries({
        queryKey: userKeys.stats(user.id),
      });

      // Invalidate user profile
      queryClient.invalidateQueries({
        queryKey: authKeys.profile(),
      });

      // Invalidate achievement-related queries
      queryClient.invalidateQueries({
        queryKey: achievementKeys.myProgress(),
      });
      queryClient.invalidateQueries({
        queryKey: achievementKeys.myAchievements(),
      });
    },
    // Only enable if user is logged in
    mutationKey: ["openRewardBox", user?.id],
  });
};
