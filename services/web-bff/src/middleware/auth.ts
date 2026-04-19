/**
 * JWKS-based RS256 JWT verification for web-bff.
 * Fetches public keys from identity-service /.well-known/jwks.json.
 * Keys are cached in memory with a configurable TTL.
 */
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import type { FastifyRequest } from "fastify";

export interface AuthUser {
  userId: string;
  /** Embedded JWT tier claim (short TTL token) */
  tier?: string;
  roles?: string[];
}

// Module-level JWKS cache — lazily initialized
let _jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
let _jwksUrl = "";

export function initJWKS(identityServiceUrl: string): void {
  _jwksUrl = `${identityServiceUrl}/.well-known/jwks.json`;
  _jwks = createRemoteJWKSet(new URL(_jwksUrl), {
    cacheMaxAge: 60 * 60 * 1000, // 1 hour cache per coding-standards §5.1
  });
}

/**
 * Verifies the Bearer token from the Authorization header.
 * Returns null if no token is present (anonymous request).
 * Throws if token is present but invalid.
 */
export async function verifyToken(request: FastifyRequest): Promise<AuthUser | null> {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.slice(7);

  if (!_jwks) {
    throw new Error("JWKS not initialized — call initJWKS() at startup");
  }

  try {
    const { payload } = await jwtVerify(token, _jwks, {
      algorithms: ["RS256"],
      audience: "omnilingo",
      clockTolerance: 30, // 30s clock skew tolerance
    });

    const userId = payload.sub;
    if (!userId) {
      throw new Error("JWT missing sub claim");
    }

    return {
      userId,
      tier:  (payload as JWTPayload & { tier?: string }).tier,
      roles: (payload as JWTPayload & { roles?: string[] }).roles,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "invalid token";
    throw Object.assign(new Error(message), { statusCode: 401 });
  }
}

/**
 * Extracts Bearer token string from request (for forwarding to upstream services).
 */
export function extractBearerToken(request: FastifyRequest): string | undefined {
  const auth = request.headers.authorization;
  return auth?.startsWith("Bearer ") ? auth.slice(7) : undefined;
}
