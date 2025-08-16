import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/api";
import {
  User,
  RegisterData,
  UpdateUserData,
  UpdateCoinsData,
  UpdateExperienceData,
  UserStats,
  UserRole,
  UserQuery,
} from "../../types/auth";
import { authKeys, useCurrentUser } from "./useAuth";

// Query Keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (query?: UserQuery) => [...userKeys.lists(), query] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  stats: (id: string) => [...userKeys.detail(id), "stats"] as const,
  // Inventory keys
  inventory: (id: string) => [...userKeys.detail(id), "inventory"] as const,
};

// Query Hooks
export const useUsers = (query?: UserQuery) => {
  return useQuery({
    queryKey: userKeys.list(query),
    queryFn: async () => {
      const response = await userService.getUsers(query);
      return {
        users: response.data,
        pagination: response.pagination,
        message: response.message,
        success: response.success,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUser = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const response = await userService.getUserById(id);
      return {
        user: response.data,
        message: response.message,
        success: response.success,
      };
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCurrentUserStats = (enabled: boolean = true) => {
  const { data: user } = useCurrentUser();

  return useQuery({
    queryKey: userKeys.stats(user?.id || ""),
    queryFn: async () => {
      if (!user?.id) throw new Error("User not found");
      const response = await userService.getUserStats(user.id);
      return {
        stats: response.data,
        message: response.message,
        success: response.success,
      };
    },
    enabled: enabled && !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUserStats = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: userKeys.stats(id),
    queryFn: async () => {
      const response = await userService.getUserStats(id);
      return {
        stats: response.data,
        message: response.message,
        success: response.success,
      };
    },
    enabled: enabled && !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Mutation Hooks
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => userService.createUser(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      }
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
      userService.updateUser(id, data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        queryClient.setQueryData(userKeys.detail(response.data.id), {
          user: response.data,
          message: response.message,
          success: response.success,
        });

        // Also update the current user's profile cache if this is the current user
        // This ensures useCurrentUser reflects the updated data immediately
        queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      }
    },
  });
};

export const useUpdateCurrentUserCoins = () => {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: ({ data }: { data: UpdateCoinsData }) => {
      if (!user) {
        throw new Error("Current user not found!");
      }
      return userService.updateUserCoins(user.id, data);
    },
    onSuccess: (response) => {
      if (response.success && user) {
        queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: userKeys.stats(user.id),
        });

        // Also update the current user's profile cache
        queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      }
    },
    onError: (error) => {
      console.error("Failed to update user coins", error);
      // Optionally show a toast or notification
    },
  });
};

export const useUpdateCurrentUserExperience = () => {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: ({ data }: { data: UpdateExperienceData }) => {
      if (!user) {
        throw new Error("Current user not found!");
      }
      return userService.updateUserExperience(user.id, data);
    },
    onSuccess: (response) => {
      if (response.success && user) {
        queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: userKeys.stats(user.id),
        });

        // Also update the current user's profile cache
        queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      }
    },
    onError: (error) => {
      console.error("Failed to update user experience", error);
      // Optionally show a toast or notification
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      userService.updateUserRole(id, role),
    onSuccess: (response, variables) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: userKeys.detail(variables.id),
        });
      }
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: (response, deletedId) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        queryClient.removeQueries({ queryKey: userKeys.detail(deletedId) });
        queryClient.removeQueries({ queryKey: userKeys.stats(deletedId) });
        queryClient.removeQueries({ queryKey: userKeys.inventory(deletedId) });
      }
    },
  });
};
