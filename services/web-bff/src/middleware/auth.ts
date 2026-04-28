/**
 * web-bff auth middleware.
 * Thin adapter over @omnilingo/auth-middleware that preserves the existing
 * call API used by app.ts (verifyToken(request), extractBearerToken(request)).
 *
 * Previously maintained its own JWKS cache — now delegates to the shared
 * per-URL cache in @omnilingo/auth-middleware.
 */
import type { FastifyRequest } from "fastify";
import {
  verifyToken as coreVerifyToken,
  extractBearer,
  type AuthUser,
} from "@omnilingo/auth-middleware";

// Re-export AuthUser so existing consumers (resolvers.ts) don't need to change imports
export type { AuthUser };

// Identity service URL — set once at startup via initJWKS()
let _identityServiceUrl = "";

/**
 * initJWKS — call at startup with the identity service base URL.
 * The shared auth-middleware package caches the JWKS per URL, so this
 * is now just storing the URL for later use by verifyToken().
 */
export function initJWKS(identityServiceUrl: string): void {
  _identityServiceUrl = identityServiceUrl;
}

/**
 * verifyToken — verifies the Bearer token from req.headers.authorization.
 * Returns AuthUser on success, null if no token present.
 * Throws on invalid/expired token.
 */
export async function verifyToken(request: FastifyRequest): Promise<AuthUser | null> {
  const token = extractBearer(request.headers.authorization);
  if (!token) {
    return null;
  }

  if (!_identityServiceUrl) {
    throw new Error("JWKS not initialized — call initJWKS() at startup");
  }

  return coreVerifyToken(token, _identityServiceUrl);
}

/**
 * extractBearerToken — extracts raw Bearer token from Authorization header.
 * Returns undefined if header absent or not a Bearer token.
 * (Used by app.ts to forward the token to upstream services.)
 */
export function extractBearerToken(request: FastifyRequest): string | undefined {
  return extractBearer(request.headers.authorization);
}
