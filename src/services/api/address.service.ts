import api from '../../lib/api';
import {
  Address,
  CreateAddressData,
  UpdateAddressData,
  AddressQuery,
  AddressBulkAction,
  AddressStats,
  AddressSuggestion,
} from '../../types/address';
import { PaginatedResponse, ApiResponse } from '../../types/api';

/**
 * Address API Service
 * Handles all address-related API operations including CRUD, queries, and address management
 */
export class AddressService {
  private readonly baseUrl = '/addresses';

  /**
   * Get all addresses for the current user with optional filtering and pagination
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
   * Get all addresses (admin only) with optional filtering and pagination
   * @param query - Query parameters for filtering, sorting, and pagination
   * @returns Promise<PaginatedResponse<Address>>
   */
  async getAllAddresses(query?: AddressQuery): Promise<PaginatedResponse<Address>> {
    const response = await api.get<PaginatedResponse<Address>>(`${this.baseUrl}/all`, {
      params: query,
    });
    return response.data;
  }

  /**
   * Get a specific address by ID
   * @param id - Address ID
   * @returns Promise<Address>
   */
  async getAddressById(id: number): Promise<Address> {
    const response = await api.get<Address>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Get the default address for the current user
   * @returns Promise<Address | null>
   */
  async getDefaultAddress(): Promise<Address | null> {
    try {
      const response = await api.get<Address>(`${this.baseUrl}/default`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Create a new address
   * @param data - Address creation data
   * @returns Promise<Address>
   */
  async createAddress(data: CreateAddressData): Promise<Address> {
    const response = await api.post<Address>(this.baseUrl, data);
    return response.data;
  }

  /**
   * Update an existing address
   * @param id - Address ID
   * @param data - Address update data
   * @returns Promise<Address>
   */
  async updateAddress(id: number, data: UpdateAddressData): Promise<Address> {
    const response = await api.patch<Address>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  /**
   * Delete an address
   * @param id - Address ID
   * @returns Promise<void>
   */
  async deleteAddress(id: number): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Set an address as the default address
   * @param id - Address ID
   * @returns Promise<Address>
   */
  async setDefaultAddress(id: number): Promise<Address> {
    const response = await api.patch<Address>(`${this.baseUrl}/${id}/set-default`);
    return response.data;
  }

  /**
   * Get address suggestions based on search query (if implemented)
   * @param query - Search query string
   * @returns Promise<AddressSuggestion[]>
   */
  async getAddressSuggestions(query: string): Promise<AddressSuggestion[]> {
    const response = await api.get<AddressSuggestion[]>(`${this.baseUrl}/suggestions`, {
      params: { q: query },
    });
    return response.data;
  }

  /**
   * Validate an address format (if implemented)
   * @param address - Address data to validate
   * @returns Promise<boolean>
   */
  async validateAddress(address: CreateAddressData): Promise<boolean> {
    const response = await api.post<{ valid: boolean }>(`${this.baseUrl}/validate`, address);
    return response.data.valid;
  }

  /**
   * Perform bulk actions on addresses (admin only)
   * @param action - Bulk action configuration
   * @returns Promise<ApiResponse>
   */
  async bulkAction(action: AddressBulkAction): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(`${this.baseUrl}/bulk`, action);
    return response.data;
  }

  /**
   * Get address statistics (admin only)
   * @returns Promise<AddressStats>
   */
  async getAddressStats(): Promise<AddressStats> {
    const response = await api.get<AddressStats>(`${this.baseUrl}/stats`);
    return response.data;
  }

  /**
   * Get addresses for a specific user (admin only)
   * @param userId - User ID
   * @param query - Optional query parameters
   * @returns Promise<PaginatedResponse<Address>>
   */
  async getUserAddresses(userId: string, query?: AddressQuery): Promise<PaginatedResponse<Address>> {
    const response = await api.get<PaginatedResponse<Address>>(`/users/${userId}/addresses`, {
      params: query,
    });
    return response.data;
  }

  /**
   * Count addresses for the current user
   * @returns Promise<number>
   */
  async countUserAddresses(): Promise<number> {
    const response = await api.get<{ count: number }>(`${this.baseUrl}/count`);
    return response.data.count;
  }

  /**
   * Export addresses to CSV (admin only)
   * @param query - Optional query parameters for filtering
   * @returns Promise<Blob>
   */
  async exportAddresses(query?: AddressQuery): Promise<Blob> {
    const response = await api.get(`${this.baseUrl}/export`, {
      params: query,
      responseType: 'blob',
    });
    return response.data;
  }
}

// Export singleton instance
export const addressService = new AddressService();
