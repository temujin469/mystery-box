/**
 * Token storage utility that handles both localStorage and cookies
 * Cookies are needed for server-side middleware, localStorage for client-side
 */

// Helper to set secure cookies
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof document !== 'undefined') {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; secure; samesite=strict`;
  }
};

// Helper to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof document !== 'undefined') {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
  }
  return null;
};

// Helper to remove cookie
const removeCookie = (name: string) => {
  if (typeof document !== 'undefined') {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=strict`;
  }
};

export const tokenStorage = {
  setAccessToken: (token: string) => {
    // Store in both localStorage and cookies
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
    setCookie('access_token', token, 7); // 7 days
  },

  setRefreshToken: (token: string) => {
    // Store in both localStorage and cookies  
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', token);
    }
    setCookie('refresh_token', token, 30); // 30 days
  },

  getAccessToken: (): string | null => {
    // Try localStorage first (client-side), then cookies (server-side)
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token') || getCookie('access_token');
    }
    return getCookie('access_token');
  },

  getRefreshToken: (): string | null => {
    // Try localStorage first (client-side), then cookies (server-side)
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token') || getCookie('refresh_token');
    }
    return getCookie('refresh_token');
  },

  hasToken: (): boolean => {
    return !!tokenStorage.getAccessToken();
  },

  clearTokens: () => {
    // Clear both localStorage and cookies
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    removeCookie('access_token');
    removeCookie('refresh_token');
  }
};
