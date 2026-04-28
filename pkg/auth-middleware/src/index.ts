/**
 * @omnilingo/auth-middleware
 *
 * Shared JWKS-based RS256 JWT verification for OmniLingo Node-TS services.
 *
 * Design contract:
 *  - Single `jose` dependency (v6) — no `jsonwebtoken` or `jwks-rsa`.
 *  - JWKS fetched from `identityServiceUrl/.well-known/jwks.json` and cached in-process.
 *  - Cache TTL: 1 hour; retried on JWKS fetch failure after 30s cooldown.
 *  - Algorithms: RS256 only.
 *  - Audience: 'omnilingo' (fixed — all services share this).
 *  - Issuer: 'identity-service'.
 *  - AuthUser shape: { userId, roles, scopes, tier? } — unified across all services.
 *
 * Usage (Fastify plugin style, recommended):
 *   import { jwtAuthPlugin } from '@omnilingo/auth-middleware';
 *   await fastify.register(jwtAuthPlugin, { identityServiceUrl: cfg.identityServiceUrl });
 *   // then protect routes with fastify.requireAuth
 *
 * Usage (standalone function, for custom middleware):
 *   import { verifyToken } from '@omnilingo/auth-middleware';
 *   const user = await verifyToken(bearerToken, identityServiceUrl);
 */
import jwtAuthPlugin from './plugin';
export { jwtAuthPlugin };
export type { JwtAuthPluginOptions } from './plugin';
export { verifyToken, extractBearer } from './verify';
export { type AuthUser } from './types';
