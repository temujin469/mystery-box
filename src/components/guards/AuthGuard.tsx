"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/api/useAuth";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Client-side authentication guard for protected routes
 * Use this to wrap your (auth) folder components
 */
export function AuthGuard({
  children,
  fallback,
  redirectTo = "/?auth=signin",
}: AuthGuardProps) {
  const router = useRouter();
  const { data: user, isLoading, error } = useCurrentUser();

  // Check if user is authenticated
  const isAuthenticated = !!user && !error;

  useEffect(() => {
    // If not loading and not authenticated, redirect
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            {/* <p className="text-muted-foreground">Checking authentication...</p> */}
          </div>
        </div>
      )
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}
