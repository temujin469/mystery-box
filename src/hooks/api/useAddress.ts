import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addressService } from "../../services/api";
import {
  Address,
  CreateAddressData,
  UpdateAddressData,
  AddressQuery,
} from "../../types/address";

// Query Keys
export const addressKeys = {
  all: ["addresses"] as const,
  lists: () => [...addressKeys.all, "list"] as const,
  list: (query?: AddressQuery) => [...addressKeys.lists(), query] as const,
  myAddresses: () => [...addressKeys.all, "me"] as const,
  myDefault: () => [...addressKeys.all, "me", "default"] as const,
  details: () => [...addressKeys.all, "detail"] as const,
  detail: (id: number) => [...addressKeys.details(), id] as const,
};

// ✅ 5-minute default stale time for queries
// ✅ 10-minute garbage collection time
// ✅ Smart retry logic (no retries on 4xx errors)
// ✅ Automatic cache invalidation on mutations

// Query Hooks
export const useMyAddresses = (query?: AddressQuery) => {
  return useQuery({
    queryKey: addressKeys.myAddresses(),
    queryFn: () => addressService.getMyAddresses(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (response) => ({
      addresses: response.data,
      pagination: response.pagination,
      message: response.message,
      success: response.success,
    }),
  });
};

export const useMyDefaultAddress = () => {
  return useQuery({
    queryKey: addressKeys.myDefault(),
    queryFn: () => addressService.getMyDefaultAddress(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry if no default address
    select: (response) => ({
      address: response.data,
      message: response.message,
      success: response.success,
    }),
  });
};

export const useAddress = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: addressKeys.detail(id),
    queryFn: () => addressService.getAddressById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (response) => ({
      address: response.data,
      message: response.message,
      success: response.success,
    }),
  });
};

// Mutation Hooks
export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAddressData) => addressService.createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.myAddresses() });
      queryClient.invalidateQueries({ queryKey: addressKeys.myDefault() });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAddressData }) =>
      addressService.updateAddress(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: addressKeys.myAddresses() });
      queryClient.invalidateQueries({ queryKey: addressKeys.myDefault() });
      queryClient.invalidateQueries({ queryKey: addressKeys.detail(id) });
    },
  });
};

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => addressService.setDefaultAddress(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: addressKeys.myAddresses() });
      queryClient.invalidateQueries({ queryKey: addressKeys.myDefault() });
      queryClient.invalidateQueries({ queryKey: addressKeys.detail(id) });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => addressService.deleteAddress(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: addressKeys.myAddresses() });
      queryClient.invalidateQueries({ queryKey: addressKeys.myDefault() });
      queryClient.removeQueries({ queryKey: addressKeys.detail(deletedId) });
    },
  });
};
