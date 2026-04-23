import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_COOKIE = "omni_at";

// Routes that require authentication
const PROTECTED_PATHS = [
  "/dashboard",
  "/learn",
  "/lesson",
  "/practice",
  "/test-prep",
  "/ai-tutor",
  "/tutors",
  "/community",
  "/progress",
  "/profile",
  "/achievements",
  "/shop",
  "/settings",
  "/leaderboard",
  "/notifications",
  "/messages",
];

// Auth routes — redirect to dashboard if already logged in
const AUTH_PATHS = ["/sign-in", "/sign-up", "/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_COOKIE)?.value;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isAuth = AUTH_PATHS.some((p) => pathname.startsWith(p));

  // Not authenticated → redirect to sign-in
  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Already authenticated → skip auth pages
  if (isAuth && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.searchParams.delete("next");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
