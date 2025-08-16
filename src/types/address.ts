import { BaseQuery } from "./api-response";

export interface Address {
  id: number;
  user_id: string;
  title: string;
  full_address: string;
  city?: string;
  district?: string;
  khoroo?: string;
  postal_code?: string;
  phone?: string;
  recipient_name?: string;
  is_default: boolean;
  notes?: string;
  created_at: Date; // Should be Date, not string
  updated_at: Date; // Should be Date, not string
  // Relations (when included)
  user?: any; // User type from auth.ts
}

export interface CreateAddressData {
  title: string;
  full_address: string;
  city?: string;
  district?: string;
  khoroo?: string;
  postal_code?: string;
  phone?: string;
  recipient_name?: string;
  is_default?: boolean;
  notes?: string;
  user_id: string; // Required in CreateAddressDto
}

export interface UpdateAddressData extends Partial<CreateAddressData> {
  // All fields from CreateAddressData are optional for updates
}

export interface AddressQuery extends BaseQuery {
  orderBy?: AddressOrderByField;
  city?: string;
  district?: string;
  khoroo?: string;
  isDefault?: boolean; // Backend uses 'isDefault', not 'is_default'
  userId?: string; // Backend uses 'userId', not 'user_id'
}

export enum AddressOrderByField {
  ID = "id",
  CITY = "city",
  DISTRICT = "district",
  IS_DEFAULT = "is_default",
  CREATED_AT = "created_at",
  UPDATED_AT = "updated_at",
  // Removed: TITLE, FULL_ADDRESS, KHOROO (not in backend enum)
}

