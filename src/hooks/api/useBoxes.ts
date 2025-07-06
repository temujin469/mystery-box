import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { boxService } from '../../services/api';
import { Box, CreateBoxData, UpdateBoxData, BoxQuery } from '../../types/box';
import { PaginatedResponse } from '../../types/api';

// Query Keys
export const boxKeys = {
  all: ['boxes'] as const,
  lists: () => [...boxKeys.all, 'list'] as const,
  list: (query?: BoxQuery) => [...boxKeys.lists(), query] as const,
  simple: (name?: string, isFeatured?: boolean) => [...boxKeys.all, 'simple', { name, isFeatured }] as const,
  featured: () => [...boxKeys.all, 'featured'] as const,
  search: (name: string) => [...boxKeys.all, 'search', name] as const,
  details: () => [...boxKeys.all, 'detail'] as const,
  detail: (id: string) => [...boxKeys.details(), id] as const,
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
      queryClient.setQueryData(boxKeys.detail(updatedBox.id.toString()), updatedBox);
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
      queryClient.setQueryData(boxKeys.detail(updatedBox.id.toString()), updatedBox);
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
      queryClient.removeQueries({ queryKey: boxKeys.detail(deletedId.toString()) });
    },
  });
};
