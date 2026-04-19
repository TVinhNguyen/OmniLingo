/**
 * Session management using Next.js cookies.
 *
 * Token storage strategy:
 * - `access_token`  → httpOnly, Secure, SameSite=Strict cookie (15 min / maxAge=900s)
 * - `refresh_token` → httpOnly, Secure, SameSite=Strict cookie (30 day / maxAge=2592000s)
 *
 * Both are server-side only. Client never sees raw tokens.
 */

import { cookies } from "next/headers";

const ACCESS_COOKIE = "omni_at";
const REFRESH_COOKIE = "omni_rt";
const ACCESS_TTL_S = 15 * 60;        // 15 minutes
const REFRESH_TTL_S = 30 * 24 * 3600; // 30 days

export interface Session {
  accessToken: string;
  refreshToken: string;
}

/** Read current session from cookies. Returns null if not authenticated. */
export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const at = jar.get(ACCESS_COOKIE)?.value;
  const rt = jar.get(REFRESH_COOKIE)?.value;
  if (!at || !rt) return null;
  return { accessToken: at, refreshToken: rt };
}

/** Get only the access token (used for GQL calls). */
export async function getAccessToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(ACCESS_COOKIE)?.value ?? null;
}

/** Persist tokens to httpOnly cookies after login / register. */
export async function setSession(tokens: Session): Promise<void> {
  const jar = await cookies();
  const shared = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
  };
  jar.set(ACCESS_COOKIE, tokens.accessToken, {
    ...shared,
    maxAge: ACCESS_TTL_S,
  });
  jar.set(REFRESH_COOKIE, tokens.refreshToken, {
    ...shared,
    maxAge: REFRESH_TTL_S,
  });
}

/** Remove all auth cookies (logout). */
export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
}

/** Check if a session exists (lightweight check, no token validation). */
export async function isAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return !!jar.get(ACCESS_COOKIE)?.value;
}
