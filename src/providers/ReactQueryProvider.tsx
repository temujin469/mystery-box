import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a QueryClient instance with optimal defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Global default stale time
      staleTime: 5 * 60 * 1000, // 5 minutes
      // How long to cache unused/inactive queries
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
      // Retry configuration
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      // Refetch on window focus in production
      refetchOnWindowFocus: process.env.NODE_ENV === 'production',
      // Refetch on reconnect
      refetchOnReconnect: true,
      // Refetch interval for real-time data (disabled by default)
      refetchInterval: false,
    },
    mutations: {
      // Global retry for mutations
      retry: 1,
      // Default mutation cache time
      gcTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

interface ReactQueryProviderProps {
  children: ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Show React Query DevTools in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

// Export the queryClient instance for use in other parts of the app
export { queryClient };
