"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { authService } from "../../services/api";
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  UpdateUserData,
} from "../../types/auth";

// Query Keys
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  profile: () => [...authKeys.user(), "profile"] as const,
};

// Query Hooks
export const useCurrentUser = () => {
  // Use state to track token changes more reactively
  const [hasToken, setHasToken] = useState(() => authService.hasToken());

  // Listen for storage changes
  useEffect(() => {
    const checkToken = () => {
      setHasToken(authService.hasToken());
    };

    // Check immediately
    checkToken();

    // Listen for storage events (for cross-tab synchronization)
    window.addEventListener("storage", checkToken);
    
    // Custom event for same-tab updates
    window.addEventListener("auth-token-changed", checkToken);

    // Cleanup listeners on unmount
    // This ensures we don't leak memory or keep stale listeners
    return () => {
      window.removeEventListener("storage", checkToken);
      window.removeEventListener("auth-token-changed", checkToken);
    };
  }, []);

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => authService.getProfile(),
    enabled: hasToken, // Only fetch if token exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on auth failures
    // todo: learn more about these options
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnMount: true, // Refetch on component mount
    // Add this to ensure it refetches when enabled changes from false to true
    refetchOnReconnect: true,
  });
};

// Mutation Hooks
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: () => {
      // Dispatch custom event to notify auth token change
      window.dispatchEvent(new Event("auth-token-changed"));
      
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      // Immediately refetch the profile to get user data
      queryClient.refetchQueries({ queryKey: authKeys.profile() });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: () => {
      // Dispatch custom event to notify auth token change
      window.dispatchEvent(new Event("auth-token-changed"));
      
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      // Immediately refetch the profile to get user data
      queryClient.refetchQueries({ queryKey: authKeys.profile() });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      // // Reset the query client to its initial state
      queryClient.resetQueries();
      // Specifically invalidate auth queries
      queryClient.invalidateQueries({ queryKey: authKeys.all });

      // Use service method to clear auth data
      authService.clearAuthData();
      
      // Dispatch custom event to notify auth token change
      window.dispatchEvent(new Event("auth-token-changed"));
    },
    onError: () => {
      // Even if logout fails, clear local data
      queryClient.clear();
      queryClient.resetQueries();
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      
      // Use service method to clear auth data
      authService.clearAuthData();
      
      // Dispatch custom event to notify auth token change
      window.dispatchEvent(new Event("auth-token-changed"));
    },
  });
};

export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.refreshToken(),
    onSuccess: (authResponse) => {
      // Dispatch custom event to notify auth token change
      window.dispatchEvent(new Event("auth-token-changed"));
      
      // Update user data in cache
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({
      token,
      newPassword,
    }: {
      token: string;
      newPassword: string;
    }) => authService.resetPassword(token, newPassword),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => authService.changePassword(currentPassword, newPassword),
  });
};
