/**
 * Core JWT verification logic.
 * Wraps `jose` createRemoteJWKSet + jwtVerify with:
 *  - Per-URL JWKS cache (module-level Map — one set per identity service URL)
 *  - Fixed RS256 + audience + issuer validation
 *  - Normalized AuthUser extraction from raw JWT payload
 */
import { createRemoteJWKSet, jwtVerify, type JWTPayload, type RemoteJWKSetOptions } from 'jose';
import type { AuthUser } from './types';

// JWKS_CACHE stores one RemoteJWKSet per identity service URL.
// Most deployments have a single identity service, so this Map typically has 1 entry.
const JWKS_CACHE = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

const JWKS_OPTIONS: RemoteJWKSetOptions = {
  cacheMaxAge: 60 * 60 * 1000, // 1 hour — matches coding-standards §5.1
  cooldownDuration: 30 * 1000, // 30s back-off on JWKS fetch failure
};

const JWKS_ENDPOINT = '/.well-known/jwks.json';

function getJWKS(identityServiceUrl: string): ReturnType<typeof createRemoteJWKSet> {
  let jwks = JWKS_CACHE.get(identityServiceUrl);
  if (!jwks) {
    const url = new URL(JWKS_ENDPOINT, identityServiceUrl);
    jwks = createRemoteJWKSet(url, JWKS_OPTIONS);
    JWKS_CACHE.set(identityServiceUrl, jwks);
  }
  return jwks;
}

/**
 * verifyToken verifies a raw Bearer token string against the identity service JWKS.
 * Returns AuthUser on success; throws Error with statusCode=401 on failure.
 */
export async function verifyToken(
  token: string,
  identityServiceUrl: string,
): Promise<AuthUser> {
  const jwks = getJWKS(identityServiceUrl);

  let payload: JWTPayload;
  try {
    ({ payload } = await jwtVerify(token, jwks, {
      algorithms: ['RS256'],
      audience: 'omnilingo',
      issuer: 'identity-service',
      clockTolerance: 30, // 30s clock skew tolerance
    }));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'invalid token';
    throw Object.assign(new Error(message), { statusCode: 401 });
  }

  const userId = payload.sub;
  if (!userId) {
    throw Object.assign(new Error('JWT missing sub claim'), { statusCode: 401 });
  }

  const p = payload as JWTPayload & {
    roles?: string[];
    scopes?: string[];
    tier?: string;
  };

  return {
    userId,
    roles: p.roles ?? [],
    scopes: p.scopes ?? [],
    tier: p.tier,
  };
}

/**
 * extractBearer extracts the raw token string from an Authorization header value.
 * Returns undefined if header is absent or not a Bearer token.
 */
export function extractBearer(authHeader: string | undefined): string | undefined {
  return authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
}

/**
 * clearJwksCache clears the module-level JWKS cache.
 * Exposed for testing only — do not call in production code.
 */
export function clearJwksCache(): void {
  JWKS_CACHE.clear();
}
