import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for a protected (auth) route
  const isAuthRoute =
    pathname.startsWith("/profile") || pathname.match(/\/\(auth\)\/.*/);

  if (isAuthRoute) {
    console.log("Auth route detected:", pathname);

    // For localStorage-based auth, we can't validate on server
    // So we just ensure the route is handled properly
    // Real auth validation happens on the client-side

    // You could add additional server-side checks here like:
    // - Rate limiting
    // - IP blocking
    // - Maintenance mode

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  // Specific matchers for your (auth) folder structure
  matcher: [
    // Protect all routes under /profile (your (auth) folder)
    "/profile/:path*",

    // If you have other auth routes, add them here
    // '/dashboard/:path*',
    // '/admin/:path*',
  ],
};
