import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { itemService } from "../../services/api";
import { CreateItemData, UpdateItemData } from "../../types/item";
import { ItemQuery } from "../../services/api/item.service";
import { useCurrentUser } from "./useAuth";

// Query Keys
export const itemKeys = {
  all: ["items"] as const,
  lists: () => [...itemKeys.all, "list"] as const,
  list: (query?: ItemQuery) => [...itemKeys.lists(), query] as const,
  simple: (name?: string, minPrice?: number, maxPrice?: number) =>
    [...itemKeys.all, "simple", { name, minPrice, maxPrice }] as const,
  search: (name: string) => [...itemKeys.all, "search", name] as const,
  details: () => [...itemKeys.all, "detail"] as const,
  detail: (id: number) => [...itemKeys.details(), id] as const, // Details of a specific item
  userItems: (userId: string, query?: Omit<ItemQuery, "userId">) =>
    [...itemKeys.all, "user", userId, query] as const,
};

// Query Hooks
export const useItems = (query?: ItemQuery) => {
  return useQuery({
    queryKey: itemKeys.list(query),
    queryFn: () => itemService.getItems(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useItemsSimple = (
  name?: string,
  minPrice?: number,
  maxPrice?: number
) => {
  return useQuery({
    queryKey: itemKeys.simple(name, minPrice, maxPrice),
    queryFn: () => itemService.getItemsSimple(name, minPrice, maxPrice),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSearchItemsByName = (name: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: itemKeys.search(name),
    queryFn: () => itemService.searchItemsByName(name),
    enabled: enabled && name.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useItem = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: itemKeys.detail(id),
    queryFn: () => itemService.getItemById(id),
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
    queryFn: () => itemService.getItems({ ...query, userId }),
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateItemData }) =>
      itemService.updateItem(id, data),
    onSuccess: (updatedItem) => {
      queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
      queryClient.setQueryData(itemKeys.detail(updatedItem.id), updatedItem);
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => itemService.deleteItem(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
      queryClient.removeQueries({ queryKey: itemKeys.detail(deletedId) });
    },
  });
};
