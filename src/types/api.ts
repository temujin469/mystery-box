// Common API response types and utilities

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  timestamp?: string;
  path?: string;
}

export enum OrderDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export interface BaseQuery {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
}

// Query builder helper types
export interface NumericRangeFilter {
  min?: number;
  max?: number;
}

export interface DateRangeFilter {
  from?: string;
  to?: string;
}

export interface BooleanFilter {
  value?: boolean;
}

export interface TextFilter {
  contains?: string;
  exact?: string;
  startsWith?: string;
  endsWith?: string;
}

// Generic CRUD operation types
export type CreateData<T> = Omit<T, "id" | "created_at" | "updated_at">;
export type UpdateData<T> = Partial<
  Omit<T, "id" | "created_at" | "updated_at">
>;

// API request configuration
export interface RequestConfig {
  timeout?: number;
  retries?: number;
  requiresAuth?: boolean;
  skipInterceptors?: boolean;
}
