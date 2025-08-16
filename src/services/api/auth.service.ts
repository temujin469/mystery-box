import api from "../../lib/api";
import {
  LoginCredentials,
  RegisterData,
  User,
  UpdateUserData,
  RefreshTokenResponse,
  LoginResponse,
} from "../../types/auth";
import { ApiResponse, OperationResponse } from "../../types/api-response";
import { auth } from "../../lib/auth";
import { safeLocalStorage } from "../../utils/localStorage";

/**
 * Authentication API Service
 * Handles all authentication-related API operations including login, register, token management
 */
export class AuthService {
  private readonly baseUrl = "/auth";

  /**
   * Login with email and password
   * @param credentials - Login credentials (email, password)
   * @returns Promise<ApiResponse<LoginResponse>> - Returns full response with success, message, timestamp
   */
  async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post<ApiResponse<LoginResponse>>(
      `${this.baseUrl}/login`,
      credentials
    );

    // Extract login data for token storage
    const loginData = response.data.data;

    // Store tokens using auth utility
    auth.setTokens(loginData.access_token, loginData.refresh_token);

    // Dispatch custom event to notify token change
    window.dispatchEvent(new Event("auth-token-changed"));

    return response.data;
  }

  /**
   * Register a new user account
   * @param data - Registration data
   * @returns Promise<ApiResponse<LoginResponse>> - Returns full response with success, message, timestamp
   */
  async register(data: RegisterData): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post<ApiResponse<LoginResponse>>(
      `${this.baseUrl}/register`,
      data
    );

    // Extract login data for token storage
    const loginData = response.data.data;

    // Store tokens using auth utility
    auth.setTokens(loginData.access_token, loginData.refresh_token);

    // Dispatch custom event to notify token change
    window.dispatchEvent(new Event("auth-token-changed"));

    return response.data;
  }

  /**
   * Logout the current user
   * Clears local storage and invalidates tokens on server
   * @returns Promise<void>
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate refresh token on server
      await api.post(`${this.baseUrl}/logout`);
    } catch (error) {
      // Continue with logout even if server call fails
      console.warn("Logout server call failed:", error);
    } finally {
      // Always clear local storage
      safeLocalStorage.removeItem("access_token");
      safeLocalStorage.removeItem("refresh_token");
      // localStorage.removeItem("user");

      // Dispatch custom event to notify token change
      window.dispatchEvent(new Event("auth-token-changed"));
    }
  }

  /**
   * Refresh access token using refresh token
   * @returns Promise<ApiResponse<LoginResponse>> - Returns full response with success, message, timestamp
   */
  async refreshToken(): Promise<ApiResponse<RefreshTokenResponse>> {
    const refreshToken = safeLocalStorage.getItem("refresh_token");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await api.post<ApiResponse<RefreshTokenResponse>>(
      `${this.baseUrl}/refresh`,
      {
        refresh_token: refreshToken,
      }
    );

    const authData = response.data.data;

    // Update stored tokens
    safeLocalStorage.setItem("access_token", authData.access_token);
    // localStorage.setItem('user', JSON.stringify(authData.user));

    // Dispatch custom event to notify token change
    window.dispatchEvent(new Event("auth-token-changed"));

    return response.data;
  }

  /**
   * Get current user profile
   * @returns Promise<ApiResponse<User>> - Returns full response with success, message, timestamp
   */
  async getProfile(): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>(`${this.baseUrl}/me`);
    return response.data;
  }

  /**
   * Change user password
   * @param currentPassword - Current password
   * @param newPassword - New password
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<OperationResponse> {
    const response = await api.patch<OperationResponse>(
      `${this.baseUrl}/change-password`,
      {
        current_password: currentPassword,
        new_password: newPassword,
      }
    );
    return response.data;
  }

  /**
   * Request password reset email
   * @param email - User email
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async forgotPassword(email: string): Promise<OperationResponse> {
    const response = await api.post<OperationResponse>(
      `${this.baseUrl}/forgot-password`,
      { email }
    );
    return response.data;
  }

  /**
   * Reset password using reset token
   * @param token - Reset token from email
   * @param newPassword - New password
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<OperationResponse> {
    const response = await api.post<OperationResponse>(
      `${this.baseUrl}/reset-password`,
      {
        token,
        new_password: newPassword,
      }
    );
    return response.data;
  }

  /**
   * Verify email address
   * @param token - Verification token from email
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async verifyEmail(token: string): Promise<OperationResponse> {
    const response = await api.post<OperationResponse>(
      `${this.baseUrl}/verify-email`,
      { token }
    );
    return response.data;
  }

  /**
   * Resend email verification
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async resendVerification(): Promise<OperationResponse> {
    const response = await api.post<OperationResponse>(
      `${this.baseUrl}/resend-verification`
    );
    return response.data;
  }

  /**
   * Get stored access token
   * @returns string | null
   */
  getAccessToken(): string | null {
    return safeLocalStorage.getItem("access_token");
  }

  /**
   * Get stored refresh token
   * @returns string | null
   */
  getRefreshToken(): string | null {
    return safeLocalStorage.getItem("refresh_token");
  }

  /**
   * Clear all stored authentication data
   */
  clearAuthData(): void {
    safeLocalStorage.removeItem("access_token");
    safeLocalStorage.removeItem("refresh_token");
    // localStorage.removeItem("user");
  }

  /**
   * Validate current session
   * @returns Promise<boolean>
   */
  async validateSession(): Promise<boolean> {
    try {
      await this.getProfile();
      return true;
    } catch (error) {
      this.clearAuthData();
      return false;
    }
  }

  /**
   * Check if user has a valid access token
   * @returns boolean
   */
  hasToken(): boolean {
    return !!this.getAccessToken();
  }
}

// Export singleton instance
export const authService = new AuthService();
