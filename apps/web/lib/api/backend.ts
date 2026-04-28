/**
 * backend.ts — Unified backend client facade (BUG-10 fix).
 *
 * Single import point for all server-side backend calls:
 *   - backend.auth.*  → identity-service REST calls (from lib/api/auth.ts)
 *   - backend.gql     → web-bff GraphQL (from lib/api/client.ts)
 *
 * Usage in RSC / Server Actions:
 *   import { backend } from "@/lib/api/backend";
 *
 *   const tokens = await backend.auth.login({ email, password });
 *   const data   = await backend.gql<{ me: User }>(ME_QUERY, {}, token);
 *
 * This module does NOT replace the underlying implementations — it re-exports
 * them under a single namespace so call sites don't need to know which file
 * holds which function.
 */

import {
  serverLogin,
  serverRegister,
  serverRefresh,
  serverLogout,
  serverVerifyEmail,
  serverForgotPassword,
  serverResetPassword,
  serverOAuthCallback,
  serverChangePassword,
  serverDeleteAccount,
} from "./auth";
import { gql } from "./client";

export const backend = {
  /** Identity-service auth & account operations. */
  auth: {
    login:          serverLogin,
    register:       serverRegister,
    refresh:        serverRefresh,
    logout:         serverLogout,
    verifyEmail:    serverVerifyEmail,
    forgotPassword: serverForgotPassword,
    resetPassword:  serverResetPassword,
    oauthCallback:  serverOAuthCallback,
    changePassword: serverChangePassword,
    deleteAccount:  serverDeleteAccount,
  },
  /** web-bff GraphQL — generic typed query/mutation. */
  gql,
} as const;

// Re-export types so callers only need one import
export type { AuthTokens, LoginPayload, RegisterPayload } from "./auth";
export type { GraphQLError } from "./client";
