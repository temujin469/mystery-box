import { BaseQuery } from './api';

export interface Category {
  id: number;
  name: string;
  image_url?: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  // Relations (when included)
  boxes?: CategoryBox[];
  // Counts (when requested)
  boxCount?: number;
}

export interface CreateCategoryData {
  name: string;
  image_url?: string;
  is_active?: boolean;
  is_featured?: boolean;
}

export interface UpdateCategoryData {
  name?: string;
  image_url?: string;
  is_active?: boolean;
  is_featured?: boolean;
}

export interface CategoryQuery extends BaseQuery {
  orderBy?: CategoryOrderByField;
  name?: string;
  is_active?: boolean;
  is_featured?: boolean;
  // Advanced filters
  hasBoxes?: boolean;
}

export enum CategoryOrderByField {
  ID = 'id',
  NAME = 'name',
  IS_ACTIVE = 'is_active',
  IS_FEATURED = 'is_featured',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
}

// Category-Box relationship
export interface CategoryBox {
  id: number;
  category_id: number;
  box_id: number;
  created_at: string;
  // Relations
  category?: Category;
  box?: any; // Box type from box.ts
}

// Category management actions
export interface CategoryBulkAction {
  category_ids: number[];
  action: 'activate' | 'deactivate' | 'feature' | 'unfeature' | 'delete';
  data?: any;
}

// Category statistics
export interface CategoryStats {
  totalCategories: number;
  activeCategories: number;
  featuredCategories: number;
  categoriesWithBoxes: number;
  topCategoriesByBoxes: Array<{
    category: Category;
    boxCount: number;
  }>;
}

// Category hierarchy (if implementing nested categories in future)
export interface CategoryHierarchy {
  category: Category;
  children: CategoryHierarchy[];
  level: number;
  path: string[];
}

// Category search/filter helpers
export interface CategoryFilter {
  search?: string;
  active?: boolean;
  featured?: boolean;
  hasBoxes?: boolean;
  ids?: number[];
}

// Category display options
export interface CategoryDisplayOptions {
  showBoxCount?: boolean;
  includeInactive?: boolean;
  groupByFeatured?: boolean;
  sortByPopularity?: boolean;
}
