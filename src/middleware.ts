import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

// Middleware to protect routes and handle authentication redirects
// Auto-discovered by Next.js from src/middleware.ts and runs on all matched routes
export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  // Define protected routes
  const isProtectedRoute = nextUrl.pathname.startsWith("/dashboard") ||
                          nextUrl.pathname.startsWith("/profile") ||
                          nextUrl.pathname.startsWith("/settings")

  // Define auth routes
  const isAuthRoute = nextUrl.pathname.startsWith("/auth/signin") ||
                     nextUrl.pathname.startsWith("/auth/signup")

  // Redirect to signin if trying to access protected route while not logged in
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/signin", nextUrl))
  }

  // Redirect to dashboard if trying to access auth routes while logged in
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  return NextResponse.next()
})

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
