import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => authService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on auth failures
    // todo: learn more about these options
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnMount: true, // Refetch on component mount
  });
};

// Mutation Hooks
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: () => {
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: () => {
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
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
      // Remove any cached user data
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
    onError: () => {
      // Even if logout fails, clear local data
      queryClient.clear();
      queryClient.resetQueries();
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
};

export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.refreshToken(),
    onSuccess: (authResponse) => {
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
