import api from '../../lib/api';
import {
  Address,
  AddressQuery,
  CreateAddressData,
  UpdateAddressData,
} from '../../types/address';
import { 
  ApiResponse, 
  PaginatedApiResponse, 
  OperationResponse 
} from '../../types/api-response';


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
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async createAddress(createAddressData: CreateAddressData): Promise<OperationResponse> {
    const response = await api.post<OperationResponse>(this.baseUrl, createAddressData);
    return response.data;
  }

  /**
   * Get my addresses with optional filtering and pagination
   * GET /address/me
   * @param query - Query parameters for filtering, sorting, and pagination
   * @returns Promise<PaginatedApiResponse<Address>> - Returns full response with success, message, timestamp, data, pagination
   */
  async getMyAddresses(query?: AddressQuery): Promise<PaginatedApiResponse<Address>> {
    const response = await api.get<PaginatedApiResponse<Address>>(`${this.baseUrl}/me`, {
      params: query,
    });
    return response.data;
  }

  /**
   * Get my default address
   * GET /address/me/default
   * @returns Promise<ApiResponse<Address | null>> - Returns full response with success, message, timestamp
   */
  async getMyDefaultAddress(): Promise<ApiResponse<Address | null>> {
    const response = await api.get<ApiResponse<Address | null>>(`${this.baseUrl}/me/default`);
    return response.data;
  }

  /**
   * Get a specific address by ID
   * GET /address/:id
   * @param id - Address ID
   * @returns Promise<ApiResponse<Address>> - Returns full response with success, message, timestamp
   */
  async getAddressById(id: number): Promise<ApiResponse<Address>> {
    const response = await api.get<ApiResponse<Address>>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Update an existing address
   * PATCH /address/:id
   * @param id - Address ID
   * @param updateAddressData - Address update data
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async updateAddress(id: number, updateAddressData: UpdateAddressData): Promise<OperationResponse> {
    const response = await api.patch<OperationResponse>(`${this.baseUrl}/${id}`, updateAddressData);
    return response.data;
  }

  /**
   * Set an address as default
   * PATCH /address/:id/set-default
   * @param id - Address ID
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async setDefaultAddress(id: number): Promise<OperationResponse> {
    const response = await api.patch<OperationResponse>(`${this.baseUrl}/${id}/set-default`);
    return response.data;
  }

  /**
   * Delete an address
   * DELETE /address/:id
   * @param id - Address ID
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async deleteAddress(id: number): Promise<OperationResponse> {
    const response = await api.delete<OperationResponse>(`${this.baseUrl}/${id}`);
    return response.data;
  }
}

// Export singleton instance
export const addressService = new AddressService();
