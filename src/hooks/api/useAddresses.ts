import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addressService } from "../../services/api";
import {
  Address,
  CreateAddressData,
  UpdateAddressData,
} from "../../types/address";
import {
  AddressQuery,
  AddressOrderByField,
} from "../../services/api/address.service";
import { PaginatedResponse } from "../../types/api";
import { useCurrentUser } from "./useAuth";

// Query Keys
export const addressKeys = {
  all: ["addresses"] as const,
  lists: () => [...addressKeys.all, "list"] as const,
  list: (query?: AddressQuery) => [...addressKeys.lists(), query] as const,
  simple: () => [...addressKeys.all, "simple"] as const,
  byUser: (userId: string) => [...addressKeys.all, "user", userId] as const,
  default: (userId: string) => [...addressKeys.all, "default", userId] as const,
  details: () => [...addressKeys.all, "detail"] as const,
  detail: (id: number) => [...addressKeys.details(), id] as const,
};

// ✅ 5-minute default stale time for queries
// ✅ 10-minute garbage collection time
// ✅ Smart retry logic (no retries on 4xx errors)
// ✅ Automatic cache invalidation on mutations

// Query Hooks
export const useAddresses = (query?: AddressQuery) => {
  return useQuery({
    queryKey: addressKeys.list(query),
    queryFn: () => addressService.getAddresses(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddressesSimple = () => {
  return useQuery({
    queryKey: addressKeys.simple(),
    queryFn: () => addressService.getAddressesSimple(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddressesByUserId = (
  userId: string,
  query?: Omit<AddressQuery, "userId">,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: addressKeys.byUser(userId),
    queryFn: () => addressService.getAddresses({ ...query, userId }),
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Convenience hook for current user's addresses
export const useCurrentUserAddresses = (
  query: Omit<AddressQuery, "userId">
) => {
  const { data: user } = useCurrentUser();

  // console.log("useCurrentUserAddresses", user?.id, enabled);

  return useAddressesByUserId(user?.id || "", query, !!user?.id);
};

export const useDefaultAddress = (userId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: addressKeys.default(userId),
    queryFn: () => addressService.getDefaultAddress(userId),
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry if no default address
  });
};

export const useAddress = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: addressKeys.detail(id),
    queryFn: () => addressService.getAddressById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutation Hooks
export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAddressData) => addressService.createAddress(data),
    onSuccess: (newAddress) => {
      queryClient.invalidateQueries({ queryKey: addressKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: addressKeys.byUser(newAddress.user_id),
      });
      queryClient.invalidateQueries({ queryKey: addressKeys.simple() });
      // If this is the default address, invalidate default query
      if (newAddress.is_default) {
        queryClient.invalidateQueries({
          queryKey: addressKeys.default(newAddress.user_id),
        });
      }
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAddressData }) =>
      addressService.updateAddress(id, data),
    onSuccess: (updatedAddress) => {
      queryClient.invalidateQueries({ queryKey: addressKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: addressKeys.byUser(updatedAddress.user_id),
      });
      queryClient.invalidateQueries({ queryKey: addressKeys.simple() });
      queryClient.setQueryData(
        addressKeys.detail(updatedAddress.id),
        updatedAddress
      );
      // If this affects default status, invalidate default query
      if (updatedAddress.is_default) {
        queryClient.invalidateQueries({
          queryKey: addressKeys.default(updatedAddress.user_id),
        });
      }
    },
  });
};

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => addressService.setDefaultAddress(id),
    onSuccess: (updatedAddress) => {
      queryClient.invalidateQueries({ queryKey: addressKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: addressKeys.byUser(updatedAddress.user_id),
      });
      queryClient.setQueryData(
        addressKeys.detail(updatedAddress.id),
        updatedAddress
      );
      queryClient.setQueryData(
        addressKeys.default(updatedAddress.user_id),
        updatedAddress
      );
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => addressService.deleteAddress(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: addressKeys.lists() });
      queryClient.invalidateQueries({ queryKey: addressKeys.simple() });
      queryClient.removeQueries({ queryKey: addressKeys.detail(deletedId) });
      // Invalidate user-specific queries (we don't know which user, so invalidate all)
      queryClient.invalidateQueries({ queryKey: ["addresses", "user"] });
      queryClient.invalidateQueries({ queryKey: ["addresses", "default"] });
    },
  });
};
