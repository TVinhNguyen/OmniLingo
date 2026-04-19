/**
 * Auth helpers for Next.js App Router.
 *
 * Token strategy:
 * - Access token (15 min) + Refresh token (30 day): both stored as httpOnly
 *   cookies in lib/auth/session.ts — client JS never sees raw tokens.
 * - Server Components read them via `getSession()`.
 * - GQL calls attach token via Authorization header server-side.
 *
 * Auth calls go DIRECTLY to identity-service (not through web-bff),
 * because BFF only serves GraphQL. Identity service endpoints:
 *   POST /api/v1/auth/login     → { access_token, refresh_token }
 *   POST /api/v1/auth/register  → { user, access_token, refresh_token }
 *   POST /api/v1/auth/refresh   → { access_token }
 *   POST /api/v1/auth/logout
 */

const IDENTITY_URL =
  process.env.IDENTITY_SERVICE_URL ?? "http://localhost:3001";

// Base path for all identity-service auth endpoints
const AUTH_BASE = `${IDENTITY_URL}/api/v1/auth`;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  displayName: string;
  uiLanguage?: string;
}

// ─── Server-side helpers (RSC / Route Handlers / Server Actions) ──────────────

/**
 * Exchange credentials for tokens. Called from Server Action.
 */
export async function serverLogin(payload: LoginPayload): Promise<AuthTokens> {
  const res = await fetch(`${AUTH_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? "Login failed");
  }

  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  };
}

/**
 * Register a new user. Called from Server Action.
 */
export async function serverRegister(
  payload: RegisterPayload,
): Promise<AuthTokens> {
  // Step 1: create the account
  const res = await fetch(`${AUTH_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
      display_name: payload.displayName,
      ui_language: payload.uiLanguage ?? "en",
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message ?? "Registration failed",
    );
  }

  // Step 2: identity-service register returns only { user }, not tokens
  // → auto-login to obtain access + refresh tokens
  return serverLogin({ email: payload.email, password: payload.password });
}

/**
 * Refresh the access token using a stored refresh token.
 */
export async function serverRefresh(refreshToken: string): Promise<string> {
  const res = await fetch(`${AUTH_BASE}/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) throw new Error("Token refresh failed");

  const data = await res.json();
  return data.access_token;
}
