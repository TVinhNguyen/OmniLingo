import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import type { Logger } from 'pino';

export interface JWTClaims extends JWTPayload {
  sub: string;
  roles?: string[];
}

let jwksCache: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKS(jwksUrl: string): ReturnType<typeof createRemoteJWKSet> {
  if (!jwksCache) {
    jwksCache = createRemoteJWKSet(new URL(jwksUrl), {
      cacheMaxAge: 60 * 60 * 1000, // 1 hour
      cooldownDuration: 30 * 1000,  // 30s on failure
    });
  }
  return jwksCache;
}

/**
 * verifyJWT verifies and decodes an RS256 JWT using JWKS from the identity service.
 * Throws on invalid token.
 */
export async function verifyJWT(token: string, jwksUrl: string): Promise<JWTClaims> {
  const jwks = getJWKS(jwksUrl);
  const { payload } = await jwtVerify(token, jwks, {
    algorithms: ['RS256'],
    audience: 'omnilingo',
  });

  if (!payload.sub) {
    throw new Error('missing sub claim');
  }

  return payload as JWTClaims;
}
