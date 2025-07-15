import api from "../../lib/api";
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  UpdateUserData,
} from "../../types/auth";
import { ApiResponse } from "../../types/api";
import { safeLocalStorage } from "@/lib/localStorage";

/**
 * Authentication API Service
 * Handles all authentication-related API operations including login, register, token management
 */
export class AuthService {
  private readonly baseUrl = "/auth";

  /**
   * Login with email and password
   * @param credentials - Login credentials (email, password)
   * @returns Promise<AuthResponse>
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      `${this.baseUrl}/login`,
      credentials
    );

    // Store tokens in localStorage
    safeLocalStorage.setItem("access_token", response.data.access_token);
    safeLocalStorage.setItem("refresh_token", response.data.refresh_token);
    // localStorage.setItem('user', JSON.stringify(response.data.user));

    // Dispatch custom event to notify token change
    window.dispatchEvent(new Event("auth-token-changed"));

    return response.data;
  }

  /**
   * Register a new user account
   * @param data - Registration data
   * @returns Promise<AuthResponse>
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      `${this.baseUrl}/register`,
      data
    );

    // Store tokens in localStorage after successful registration
    safeLocalStorage.setItem("access_token", response.data.access_token);
    safeLocalStorage.setItem("refresh_token", response.data.refresh_token);
    // localStorage.setItem('user', JSON.stringify(response.data.user));

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
   * @returns Promise<AuthResponse>
   */
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = safeLocalStorage.getItem("refresh_token");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await api.post<AuthResponse>(`${this.baseUrl}/refresh`, {
      refresh_token: refreshToken,
    });

    // Update stored tokens
    safeLocalStorage.setItem("access_token", response.data.access_token);
    safeLocalStorage.setItem("refresh_token", response.data.refresh_token);
    // localStorage.setItem('user', JSON.stringify(response.data.user));

    // Dispatch custom event to notify token change
    window.dispatchEvent(new Event("auth-token-changed"));

    return response.data;
  }

  /**
   * Get current user profile
   * @returns Promise<User>
   */
  async getProfile(): Promise<User> {
    const response = await api.get<User>(`${this.baseUrl}/me`);
    return response.data;
  }


  /**
   * Change user password
   * @param currentPassword - Current password
   * @param newPassword - New password
   * @returns Promise<ApiResponse>
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse> {
    const response = await api.patch<ApiResponse>(
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
   * @returns Promise<ApiResponse>
   */
  async forgotPassword(email: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(
      `${this.baseUrl}/forgot-password`,
      { email }
    );
    return response.data;
  }

  /**
   * Reset password using reset token
   * @param token - Reset token from email
   * @param newPassword - New password
   * @returns Promise<ApiResponse>
   */
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(
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
   * @returns Promise<ApiResponse>
   */
  async verifyEmail(token: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(
      `${this.baseUrl}/verify-email`,
      { token }
    );
    return response.data;
  }

  /**
   * Resend email verification
   * @returns Promise<ApiResponse>
   */
  async resendVerification(): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(
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
