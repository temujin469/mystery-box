import axios, { AxiosInstance, AxiosResponse } from "axios";
import { safeLocalStorage } from "./localStorage";

// DRY API client using Axios

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://51.20.252.58:3002",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// This runs BEFORE every API request is sent
// If success (200): Returns response normally
// If 401 error: Redirects to login automatically
api.interceptors.request.use(
  (config) => {
    // Use safe localStorage access
    const token = safeLocalStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error) // Handle request setup errors
);

// Automatically adds authentication to every request
// You don't need to manually add tokens in every API call
// Centralized auth logic - change it once, affects all requests

// This runs AFTER every API response is received
api.interceptors.response.use(
  (response: AxiosResponse) => response, // ✅ Success: just return response
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = safeLocalStorage.getItem("refresh_token");
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );

          const { access_token } = response.data;
          safeLocalStorage.setItem("access_token", access_token);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens
        safeLocalStorage.removeItem("access_token");
        safeLocalStorage.removeItem("refresh_token");
        // window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// Global error handling - catches 401 errors everywhere
// Automatic logout - removes invalid tokens
// Automatic redirect - sends user to login page
// Centralized logic - handle auth errors in one place


// Request Interceptor: Modifies outgoing requests (adds auth tokens)
// Response Interceptor: Handles incoming responses (manages errors)
// Runs automatically for every API call

export default api;
