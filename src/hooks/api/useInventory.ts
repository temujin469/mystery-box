import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/api";
import { useCurrentUser } from "./useAuth";
import { userKeys } from "./useUsers";
import {
  UserInventory,
  AddItemToInventoryResponse,
  AddItemsToInventoryResponse,
} from "../../types/item";

// ================= INVENTORY QUERY HOOKS =================

/**
 * Get current user's inventory
 */
export const useCurrentUserInventory = () => {
  const { data: user } = useCurrentUser();

  return useQuery({
    queryKey: userKeys.inventory(user?.id || ""),
    queryFn: () => userService.getUserInventory(user!.id),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// ================= INVENTORY MUTATION HOOKS =================

/**
 * Add item to current user's inventory with quantity support
 */
export const useAddItemToCurrentUserInventory = () => {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: ({
      itemId,
      quantity = 1,
    }: {
      itemId: number;
      quantity?: number;
    }) => {
      if (!user) {
        throw new Error("Current user not found!");
      }
      return userService.addItemToInventory(user.id, itemId, quantity);
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: userKeys.inventory(user.id),
        });
        queryClient.invalidateQueries({
          queryKey: userKeys.inventoryCount(user.id),
        });
        queryClient.invalidateQueries({ queryKey: userKeys.stats(user.id) });
      }
    },
    onError: (error) => {
      console.error("Failed to add item to inventory:", error);
    },
  });
};

/**
 * Add multiple items to current user's inventory (useful for mystery box opening)
 */
export const useAddItemsToCurrentUserInventory = () => {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: ({ itemIds }: { itemIds: number[] }) => {
      if (!user) {
        throw new Error("Current user not found!");
      }
      return userService.addItemsToInventory(user.id, itemIds);
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: userKeys.inventory(user.id),
        });
        queryClient.invalidateQueries({
          queryKey: userKeys.inventoryCount(user.id),
        });
        queryClient.invalidateQueries({ queryKey: userKeys.stats(user.id) });
      }
    },
    onError: (error) => {
      console.error("Failed to add items to inventory:", error);
    },
  });
};

/**
 * Remove item from current user's inventory with quantity support (for selling/trading)
 */
export const useRemoveItemFromCurrentUserInventory = () => {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: ({
      itemId,
      quantity = 1,
    }: {
      itemId: number;
      quantity?: number;
    }) => {
      if (!user) {
        throw new Error("Current user not found!");
      }
      return userService.removeItemFromInventory(user.id, itemId, quantity);
    },
    onSuccess: (_, { itemId }) => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: userKeys.inventory(user.id),
        });
        queryClient.invalidateQueries({
          queryKey: userKeys.inventoryCount(user.id),
        });
        queryClient.invalidateQueries({ queryKey: userKeys.stats(user.id) });
        // Invalidate specific item check
        queryClient.invalidateQueries({
          queryKey: userKeys.hasItem(user.id, itemId),
        });
      }
    },
    onError: (error) => {
      console.error("Failed to remove item from inventory:", error);
    },
  });
};
