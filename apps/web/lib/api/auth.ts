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

/**
 * Revoke a refresh token on the identity server.
 * Called from logoutAction before clearing cookies.
 * Best-effort: failure does not block logout.
 */
export async function serverLogout(refreshToken: string): Promise<void> {
  await fetch(`${AUTH_BASE}/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}

/**
 * Verify email with a 6-digit OTP code.
 * Identity endpoint: POST /auth/verify-email
 */
export async function serverVerifyEmail(token: string): Promise<void> {
  const res = await fetch(`${AUTH_BASE}/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? "Email verification failed");
  }
}

/**
 * Send a password reset email.
 * Identity endpoint: POST /auth/forgot-password
 * Always returns success (server-side anti-enumeration).
 */
export async function serverForgotPassword(email: string): Promise<void> {
  await fetch(`${AUTH_BASE}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  // Always succeed (identity returns 200 regardless of email existence)
}

/**
 * Reset password using token from email link.
 * Identity endpoint: POST /auth/reset-password
 */
export async function serverResetPassword(token: string, newPassword: string): Promise<void> {
  const res = await fetch(`${AUTH_BASE}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, new_password: newPassword }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? "Password reset failed");
  }
}

/**
 * Exchange OAuth authorization code for tokens.
 * Identity endpoint: POST /auth/oauth/:provider/callback
 */
export async function serverOAuthCallback(
  provider: string,
  code: string,
  state: string,
): Promise<AuthTokens & { isNewUser: boolean }> {
  const res = await fetch(`${AUTH_BASE}/oauth/${provider}/callback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, state }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? "OAuth login failed");
  }
  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    isNewUser: data.is_new_user ?? false,
  };
}

/**
 * Change current user's password (requires Bearer token).
 * Identity endpoint: POST /api/v1/users/me/change-password
 */
export async function serverChangePassword(
  accessToken: string,
  oldPassword: string,
  newPassword: string,
): Promise<void> {
  const USERS_BASE = `${IDENTITY_URL}/api/v1/users`;
  const res = await fetch(`${USERS_BASE}/me/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? "Password change failed");
  }
}

/**
 * Delete the current user's account (GDPR soft-delete).
 * Identity endpoint: DELETE /api/v1/users/me
 */
export async function serverDeleteAccount(accessToken: string, password: string): Promise<void> {
  const USERS_BASE = `${IDENTITY_URL}/api/v1/users`;
  const res = await fetch(`${USERS_BASE}/me`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? "Account deletion failed");
  }
}
