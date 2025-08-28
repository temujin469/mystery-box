"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { authService } from "../../services/api";
import {
  LoginCredentials,
  RegisterData,
  LoginResponse,
  User,
  UpdateUserData,
  UpdatePasswordData,
  InitiateEmailUpdateData,
  VerifyEmailUpdateData,
} from "../../types/auth";
import { OperationResponse } from "../../types/api-response";

// Query Keys
export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
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
    queryFn: async () => {
      const response = await authService.getProfile();
      return response.data as User;
    },
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
    onSuccess: (response) => {
      if (response.success) {
        // Dispatch custom event to notify auth token change
        window.dispatchEvent(new Event("auth-token-changed"));

        // Invalidate and refetch user profile
        queryClient.invalidateQueries({ queryKey: authKeys.profile() });
        // Immediately refetch the profile to get user data
        queryClient.refetchQueries({ queryKey: authKeys.profile() });
      }
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    // Don't auto-login on registration success
    // User must verify email first
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
    onSuccess: (response) => {
      if (response.success) {
        // Dispatch custom event to notify auth token change
        window.dispatchEvent(new Event("auth-token-changed"));

        // Update user data in cache
        queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      }
    },
  });
};


// ============= Reset Password ================= //
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
};

export const useVerifyResetPin = () => {
  return useMutation({
    mutationFn: ({
      email,
      pin,
    }: {
      email: string;
      pin: string;
    }) => authService.verifyResetPin(email, pin),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({
      email,
      pin,
      newPassword,
    }: {
      email: string;
      pin: string;
      newPassword: string;
    }) => authService.resetPassword(email, pin, newPassword),
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (data: UpdatePasswordData) => authService.updatePassword(data),
  });
};



// ============= Email verification ================= //
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationFn: (email: string) => authService.resendVerification(email),
  });
};

export const useEmailVerificationStatus = () => {
  return useQuery({
    queryKey: [...authKeys.all, "emailVerificationStatus"],
    queryFn: () => authService.needsEmailVerification(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// ============= Email Update ================= //
export const useInitiateEmailUpdate = () => {
  return useMutation({
    mutationFn: (data: InitiateEmailUpdateData) => authService.initiateEmailUpdate(data),
  });
};

export const useVerifyEmailUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyEmailUpdateData) => authService.verifyEmailUpdate(data),
    onSuccess: (response) => {
      if (response.success) {
        // Clear all cached data since user session is invalidated after email change
        queryClient.clear();
        queryClient.resetQueries();
        
        // Invalidate all auth-related queries
        queryClient.invalidateQueries({ queryKey: authKeys.all });
        
        // Dispatch custom event to notify auth token change
        window.dispatchEvent(new Event("auth-token-changed"));
      }
    },
  });
};
