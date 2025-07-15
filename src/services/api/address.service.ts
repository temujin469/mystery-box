import api from '../../lib/api';
import {
  Address,
  CreateAddressData,
  UpdateAddressData,
} from '../../types/address';
import { PaginatedResponse } from '../../types/api';

export interface AddressQuery {
  page?: number;
  limit?: number;
  orderBy?: AddressOrderByField;
  orderDirection?: 'ASC' | 'DESC';
  city?: string;
  district?: string;
  khoroo?: string;
  isDefault?: boolean;
  userId?: string;
}

export enum AddressOrderByField {
  ID = 'id',
  CITY = 'city',
  DISTRICT = 'district',
  IS_DEFAULT = 'is_default',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
}

/**
 * Address API Service
 * Handles all address-related API operations matching the backend controller exactly
 */
export class AddressService {
  private readonly baseUrl = '/address';

  /**
   * Create a new address
   * POST /address
   * @param createAddressData - Address creation data
   * @returns Promise<Address>
   */
  async createAddress(createAddressData: CreateAddressData): Promise<Address> {
    const response = await api.post<Address>(this.baseUrl, createAddressData);
    return response.data;
  }

  /**
   * Get all addresses with optional filtering and pagination
   * GET /address
   * @param query - Query parameters for filtering, sorting, and pagination
   * @returns Promise<PaginatedResponse<Address>>
   */
  async getAddresses(query?: AddressQuery): Promise<PaginatedResponse<Address>> {
    const response = await api.get<PaginatedResponse<Address>>(this.baseUrl, {
      params: query,
    });
    return response.data;
  }

  /**
   * Get all addresses simple (no pagination)
   * GET /address/simple
   * @returns Promise<Address[]>
   */
  async getAddressesSimple(): Promise<Address[]> {
    const response = await api.get<Address[]>(`${this.baseUrl}/simple`);
    return response.data;
  }

  /**
   * Get default address for a user
   * GET /address/default/:userId
   * @param userId - User ID
   * @returns Promise<Address>
   */
  async getDefaultAddress(userId: string): Promise<Address> {
    const response = await api.get<Address>(`${this.baseUrl}/default/${userId}`);
    return response.data;
  }

  /**
   * Get a specific address by ID
   * GET /address/:id
   * @param id - Address ID
   * @returns Promise<Address>
   */
  async getAddressById(id: number): Promise<Address> {
    const response = await api.get<Address>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Update an existing address
   * PATCH /address/:id
   * @param id - Address ID
   * @param updateAddressData - Address update data
   * @returns Promise<Address>
   */
  async updateAddress(id: number, updateAddressData: UpdateAddressData): Promise<Address> {
    const response = await api.patch<Address>(`${this.baseUrl}/${id}`, updateAddressData);
    return response.data;
  }

  /**
   * Set an address as default
   * PATCH /address/:id/set-default
   * @param id - Address ID
   * @returns Promise<Address>
   */
  async setDefaultAddress(id: number): Promise<Address> {
    const response = await api.patch<Address>(`${this.baseUrl}/${id}/set-default`);
    return response.data;
  }

  /**
   * Delete an address
   * DELETE /address/:id
   * @param id - Address ID
   * @returns Promise<void>
   */
  async deleteAddress(id: number): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }
}

// Export singleton instance
export const addressService = new AddressService();
