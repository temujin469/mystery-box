import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { itemService } from "../../services/api";
import { CreateItemData, UpdateItemData, ItemQuery } from "../../types/item";
import { useCurrentUser } from "./useAuth";
import { userKeys } from "./useUser";
import { authKeys } from "./useAuth";

// Query Keys
export const itemKeys = {
  all: ["items"] as const,
  lists: () => [...itemKeys.all, "list"] as const,
  list: (query?: ItemQuery) => [...itemKeys.lists(), query] as const,
  details: () => [...itemKeys.all, "detail"] as const,
  detail: (id: number) => [...itemKeys.details(), id] as const,
  userItems: (userId: string, query?: Omit<ItemQuery, "userId">) =>
    [...itemKeys.all, "user", userId, query] as const,
};

// Query Hooks
export const useItems = (query?: ItemQuery) => {
  return useQuery({
    queryKey: itemKeys.list(query),
    queryFn: async () => {
      const response = await itemService.getItems(query);
      return {
        items: response.data,
        pagination: response.pagination,
        message: response.message,
        success: response.success,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useItem = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: itemKeys.detail(id),
    queryFn: async () => {
      const response = await itemService.getItemById(id);
      return {
        item: response.data,
        message: response.message,
        success: response.success,
      };
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// User-specific item hooks
export const useUserItems = (
  userId: string,
  query?: Omit<ItemQuery, "userId">,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: itemKeys.userItems(userId, query),
    queryFn: async () => {
      const response = await itemService.getItems({ ...query, userId });
      return {
        items: response.data,
        pagination: response.pagination,
        message: response.message,
        success: response.success,
      };
    },
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Convenience hook for current user's items (uses useCurrentUser internally)
export const useCurrentUserItems = (query?: Omit<ItemQuery, "userId">) => {
  const { data: user } = useCurrentUser();

  return useUserItems(user?.id || "", query, !!user?.id);
};

// Mutation Hooks
export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateItemData) => itemService.createItem(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
      }
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateItemData }) =>
      itemService.updateItem(id, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
        // Invalidate the specific item detail cache
        queryClient.invalidateQueries({
          queryKey: itemKeys.detail(variables.id),
        });
      }
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => itemService.deleteItem(id),
    onSuccess: (response, deletedId) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
        queryClient.removeQueries({ queryKey: itemKeys.detail(deletedId) });
      }
    },
  });
};

export const useSellItem = () => {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity?: number }) =>
      itemService.sellItem(id, quantity),
    onSuccess: (response, { id }) => {
      if (response.success) {
        // Invalidate user's inventory to reflect the sold items
        if (user?.id) {
          queryClient.invalidateQueries({
            queryKey: itemKeys.userItems(user.id),
          });
          // Also invalidate user's inventory from user hooks
          queryClient.invalidateQueries({
            queryKey: userKeys.inventory(user.id),
          });
        }

        // Invalidate all items lists to refresh data
        queryClient.invalidateQueries({ queryKey: itemKeys.lists() });

        // Invalidate user profile to update coin balance
        queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      }
    },
  });
};
