import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/api";
import {
  User,
  RegisterData,
  UpdateUserData,
  UpdateCoinsData,
  UpdateExperienceData,
  UserStats,
} from "../../types/auth";
import { UserQuery, UserOrderByField } from "../../services/api/user.service";
import { PaginatedResponse } from "../../types/api";
import { authKeys, useCurrentUser } from "./useAuth";

// Query Keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (query?: UserQuery) => [...userKeys.lists(), query] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  stats: (id: string) => [...userKeys.detail(id), "stats"] as const,
  search: () => [...userKeys.all, "search"] as const,
  searchByEmail: (email: string) =>
    [...userKeys.search(), "email", email] as const,
  searchByUsername: (username: string) =>
    [...userKeys.search(), "username", username] as const,
  // Inventory keys
  inventory: (id: string) => [...userKeys.detail(id), "inventory"] as const,
  inventoryCount: (id: string) => [...userKeys.inventory(id), "count"] as const,
  hasItem: (userId: string, itemId: number) =>
    [...userKeys.inventory(userId), "has", itemId] as const,
};

// Query Hooks
export const useUsers = (query?: UserQuery) => {
  return useQuery({
    queryKey: userKeys.list(query),
    queryFn: () => userService.getUsers(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUser = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCurrentUserStats = (enabled: boolean = true) => {
  const { data: user } = useCurrentUser();
  
  return useQuery({
    queryKey: userKeys.stats(user?.id || ""),
    queryFn: () => userService.getUserStats(user!.id),
    enabled: enabled && !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUserStats = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: userKeys.stats(id),
    queryFn: () => userService.getUserStats(id),
    enabled: enabled && !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useFindUserByEmail = (email: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: userKeys.searchByEmail(email),
    queryFn: () => userService.findByEmail(email),
    enabled: enabled && !!email,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: false, // Don't retry on 404
  });
};

export const useFindUserByUsername = (
  username: string,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: userKeys.searchByUsername(username),
    queryFn: () => userService.findByUsername(username),
    enabled: enabled && !!username,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: false, // Don't retry on 404
  });
};

// Mutation Hooks
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
      userService.updateUser(id, data),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);

      // Also update the current user's profile cache if this is the current user
      // This ensures useCurrentUser reflects the updated data immediately
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
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
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
      queryClient.invalidateQueries({
        queryKey: userKeys.stats(updatedUser.id),
      });

      // Also update the current user's profile cache if this is the current user
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
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
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
      queryClient.invalidateQueries({
        queryKey: userKeys.stats(updatedUser.id),
      });

      // Also update the current user's profile cache if this is the current user
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
    onError: (error) => {
      console.error("Failed to update user experience", error);
      // Optionally show a toast or notification
    },
  });
};

export const usePromoteToAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.promoteToAdmin(id),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
    },
  });
};

export const useDemoteFromAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.demoteFromAdmin(id),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedId) });
      queryClient.removeQueries({ queryKey: userKeys.stats(deletedId) });
      queryClient.removeQueries({ queryKey: userKeys.inventory(deletedId) });
      queryClient.removeQueries({
        queryKey: userKeys.inventoryCount(deletedId),
      });
    },
  });
};
