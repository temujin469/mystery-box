import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../services/api';
import { Category, CreateCategoryData, UpdateCategoryData } from '../../types/category';
import { CategoryQuery, CategoryOrderByField } from '../../services/api/category.service';
import { PaginatedResponse } from '../../types/api';

// Query Keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (query?: CategoryQuery) => [...categoryKeys.lists(), query] as const,
  simple: (name?: string, isActive?: boolean) => [...categoryKeys.all, 'simple', { name, isActive }] as const,
  active: () => [...categoryKeys.all, 'active'] as const,
  featured: () => [...categoryKeys.all, 'featured'] as const,
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

export const useCategoriesSimple = (name?: string, isActive?: boolean) => {
  return useQuery({
    queryKey: categoryKeys.simple(name, isActive),
    queryFn: () => categoryService.getCategoriesSimple(name, isActive),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useActiveCategories = () => {
  return useQuery({
    queryKey: categoryKeys.active(),
    queryFn: () => categoryService.getActiveCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useFeaturedCategories = () => {
  return useQuery({
    queryKey: categoryKeys.featured(),
    queryFn: () => categoryService.getFeaturedCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
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
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      // If the new category is active or featured, invalidate those queries
      if (newCategory.is_active) {
        queryClient.invalidateQueries({ queryKey: categoryKeys.active() });
      }
      if (newCategory.is_featured) {
        queryClient.invalidateQueries({ queryKey: categoryKeys.featured() });
      }
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryData }) =>
      categoryService.updateCategory(id, data),
    onSuccess: (updatedCategory) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.active() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.featured() });
      queryClient.setQueryData(categoryKeys.detail(updatedCategory.id), updatedCategory);
    },
  });
};

export const useToggleCategoryActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryService.toggleCategoryActive(id),
    onSuccess: (updatedCategory) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.active() });
      queryClient.setQueryData(categoryKeys.detail(updatedCategory.id), updatedCategory);
    },
  });
};

export const useToggleCategoryFeatured = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryService.toggleCategoryFeatured(id),
    onSuccess: (updatedCategory) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.featured() });
      queryClient.setQueryData(categoryKeys.detail(updatedCategory.id), updatedCategory);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryService.deleteCategory(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.active() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.featured() });
      queryClient.removeQueries({ queryKey: categoryKeys.detail(deletedId) });
      queryClient.removeQueries({ queryKey: categoryKeys.stats(deletedId) });
    },
  });
};
