import { BaseQuery } from './api';

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
  created_at: string;
  updated_at: string;
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
  user_id: string;
}

export interface UpdateAddressData {
  title?: string;
  full_address?: string;
  city?: string;
  district?: string;
  khoroo?: string;
  postal_code?: string;
  phone?: string;
  recipient_name?: string;
  is_default?: boolean;
  notes?: string;
}

export interface AddressQuery extends BaseQuery {
  orderBy?: AddressOrderByField;
  title?: string;
  full_address?: string;
  city?: string;
  district?: string;
  khoroo?: string;
  is_default?: boolean;
  user_id?: string; // For admin queries
}

export enum AddressOrderByField {
  ID = 'id',
  TITLE = 'title',
  FULL_ADDRESS = 'full_address',
  CITY = 'city',
  DISTRICT = 'district',
  KHOROO = 'khoroo',
  IS_DEFAULT = 'is_default',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
}

// Address validation patterns
export interface AddressValidationRules {
  postalCodePattern?: string;
  phonePattern?: string;
  requiredFields: string[];
  maxLengths: Record<string, number>;
}

// Country-specific address formats
export interface CountryAddressConfig {
  code: string;
  name: string;
  postalCodePattern: string;
  phonePattern: string;
  stateProvinceLabel: string; // "State", "Province", "Region", etc.
  postalCodeLabel: string; // "Zip Code", "Postal Code", etc.
  addressFormat: string[]; // Order of address lines for display
}

// Address suggestions/autocomplete
export interface AddressSuggestion {
  formatted_address: string;
  address_components: {
    address_line_1: string;
    city: string;
    state_province: string;
    postal_code: string;
    country: string;
  };
}

// Bulk address operations
export interface AddressBulkAction {
  address_ids: number[];
  action: 'delete' | 'set_default' | 'archive';
  data?: any;
}

// Address statistics for admin
export interface AddressStats {
  totalAddresses: number;
  addressesByCountry: Record<string, number>;
  defaultAddressesCount: number;
  recentAddresses: Address[];
  mostUsedCities: Array<{ city: string; count: number }>;
}
