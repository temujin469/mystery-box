import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../services/api';
import { Category, CreateCategoryData, UpdateCategoryData, CategoryQuery } from '../../types/category';

// Query Keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (query?: CategoryQuery) => [...categoryKeys.lists(), query] as const,
  stats: (id: number) => [...categoryKeys.all, 'stats', id] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
};

// Query Hooks
export const useCategories = (query?: CategoryQuery) => {
  return useQuery({
    queryKey: categoryKeys.list(query),
    queryFn: () => categoryService.getCategories(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCategoryStats = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: categoryKeys.stats(id),
    queryFn: () => categoryService.getCategoryStats(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCategory = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getCategoryById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutation Hooks
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryData) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryData }) =>
      categoryService.updateCategory(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
    },
  });
};

export const useToggleCategoryActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryService.toggleCategoryActive(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
    },
  });
};

export const useToggleCategoryFeatured = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryService.toggleCategoryFeatured(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryService.deleteCategory(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.removeQueries({ queryKey: categoryKeys.detail(deletedId) });
      queryClient.removeQueries({ queryKey: categoryKeys.stats(deletedId) });
    },
  });
};
