import api from "../../lib/api";
import {
  LoginCredentials,
  RegisterData,
  User,
  UpdateUserData,
  RefreshTokenResponse,
  LoginResponse,
  ForgotPasswordData,
  VerifyResetPinData,
  ResetPasswordData,
  UpdatePasswordData,
  InitiateEmailUpdateData,
  VerifyEmailUpdateData,
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

  // /**
  //  * Register a new user account
  //  * @param data - Registration data
  //  * @returns Promise<ApiResponse<LoginResponse>> - Returns full response with success, message, timestamp
  //  */
  // async register(data: RegisterData): Promise<ApiResponse<LoginResponse>> {
  //   const response = await api.post<ApiResponse<LoginResponse>>(
  //     `${this.baseUrl}/register`,
  //     data
  //   );

  //   // Extract login data for token storage
  //   const loginData = response.data.data;

  //   // Store tokens using auth utility
  //   auth.setTokens(loginData.access_token, loginData.refresh_token);

  //   // Dispatch custom event to notify token change
  //   window.dispatchEvent(new Event("auth-token-changed"));

  //   return response.data;
  // }

  /**
   * Register a new user account
   * @param data - Registration data
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async register(data: RegisterData): Promise<OperationResponse> {
    const response = await api.post<OperationResponse>(
      `${this.baseUrl}/register`,
      data
    );

    // No tokens are returned - user must verify email first
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
   * Verify password reset PIN
   * @param email - User email
   * @param pin - 4-digit reset PIN from email
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async verifyResetPin(email: string, pin: string): Promise<OperationResponse> {
    const response = await api.post<OperationResponse>(
      `${this.baseUrl}/verify-reset-pin`,
      { email, pin }
    );
    return response.data;
  }

  /**
   * Reset password using PIN
   * @param email - User email
   * @param pin - 4-digit reset PIN from email
   * @param newPassword - New password
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async resetPassword(
    email: string,
    pin: string,
    newPassword: string
  ): Promise<OperationResponse> {
    const response = await api.post<OperationResponse>(
      `${this.baseUrl}/reset-password`,
      {
        email,
        pin,
        newPassword,
      }
    );
    return response.data;
  }

  /**
   * Update password for authenticated user
   * @param data - Object containing old password and new password
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async updatePassword(data: UpdatePasswordData): Promise<OperationResponse> {
    const response = await api.put<OperationResponse>(
      `${this.baseUrl}/update-password`,
      data
    );
    return response.data;
  }

  /**
   * Initiate email update process for authenticated user
   * @param data - Object containing new email and current password
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async initiateEmailUpdate(data: InitiateEmailUpdateData): Promise<OperationResponse> {
    const response = await api.put<OperationResponse>(
      `${this.baseUrl}/update-email`,
      data
    );
    return response.data;
  }

  /**
   * Verify email update using PIN
   * @param data - Object containing verification PIN
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async verifyEmailUpdate(data: VerifyEmailUpdateData): Promise<OperationResponse> {
    const response = await api.post<OperationResponse>(
      `${this.baseUrl}/verify-email-update`,
      data
    );
    
    // If email update is successful, the user's session might be invalidated
    // We should handle this by clearing tokens and triggering re-authentication
    if (response.data.success) {
      // Clear auth data since email change invalidates sessions
      this.clearAuthData();
      // Dispatch event to notify components about auth state change
      window.dispatchEvent(new Event("auth-token-changed"));
    }
    
    return response.data;
  }

  /**
   * Verify email address
   * @param pin - 4-digit verification PIN from email
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async verifyEmail(pin: string): Promise<OperationResponse> {
    const response = await api.post<OperationResponse>(
      `/user/verify-email`,
      { pin }
    );
    return response.data;
  }

  /**
   * Resend email verification
   * @param email - User email to resend verification to
   * @returns Promise<OperationResponse> - Returns operation status with backend message
   */
  async resendVerification(email: string): Promise<OperationResponse> {
    const response = await api.post<OperationResponse>(
      `/user/resend-verification`,
      { email }
    );
    return response.data;
  }

  /**
   * Check if current user needs email verification
   * @returns Promise<boolean> - Returns true if user needs to verify email
   */
  async needsEmailVerification(): Promise<boolean> {
    try {
      const profile = await this.getProfile();
      return !profile.data.email_verified;
    } catch (error) {
      // If we can't get profile, assume verification is not needed
      return false;
    }
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
