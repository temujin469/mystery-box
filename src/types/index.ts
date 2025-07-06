// Export all types from the types folder
export * from './auth';
export * from './box';
export * from './item';
export * from './address';
export * from './category';
export * from './api';

// Re-export common types for convenience
export type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  UserRole,
  UpdateUserData,
  UserStats,
} from './auth';

export type {
  Box,
  CreateBoxData,
  UpdateBoxData,
  BoxQuery,
  BoxOrderByField,
  BoxOpenResult,
} from './box';

export type {
  Item,
  CreateItemData,
  UpdateItemData,
  ItemQuery,
  ItemOrderByField,
  UserItem,
  ItemStats,
} from './item';

export type {
  Address,
  CreateAddressData,
  UpdateAddressData,
  AddressQuery,
  AddressOrderByField,
  AddressStats,
} from './address';

export type {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
  CategoryQuery,
  CategoryOrderByField,
  CategoryStats,
} from './category';

export type {
  PaginatedResponse,
  ApiResponse,
  ApiError,
  OrderDirection,
  BaseQuery,
  RequestConfig,
} from './api';
