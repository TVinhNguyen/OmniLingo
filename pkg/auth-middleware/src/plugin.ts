/**
 * Fastify plugin adapter for @omnilingo/auth-middleware.
 *
 * Registers three Fastify decorators:
 *   fastify.requireAuth         — preHandler: 401 if token missing/invalid
 *   fastify.requireRole(...r)   — preHandler: 403 if user lacks required roles
 *   fastify.requireScope(...s)  — preHandler: 403 if user lacks required scopes
 *
 * Decorates each request with:
 *   request.user: AuthUser | null
 *
 * Usage:
 *   await fastify.register(jwtAuthPlugin, { identityServiceUrl: cfg.identityServiceUrl });
 *
 *   // Protected route:
 *   fastify.get('/me', { preHandler: [fastify.requireAuth] }, handler);
 *
 *   // Role-protected route:
 *   fastify.post('/admin', { preHandler: [fastify.requireAuth, fastify.requireRole('admin')] }, handler);
 *
 *   // Scope-protected route (OAuth2):
 *   fastify.get('/data', { preHandler: [fastify.requireAuth, fastify.requireScope('read:data')] }, handler);
 *
 * @note JWKS TTL: Keys are cached for 1 hour (verify.ts:15-18).
 * If identity rotates keys, all services will return 401 for up to 1h.
 * MVP1 accepts this risk. Phase-2: add hot-reload on "kid not found" (BUG-12).
 */
import fp from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken, extractBearer } from './verify';
import type { AuthUser } from './types';

export interface JwtAuthPluginOptions {
  /**
   * Base URL of the identity service (without trailing slash).
   * JWKS will be fetched from `{identityServiceUrl}/.well-known/jwks.json`.
   */
  identityServiceUrl: string;
}

const jwtAuthPlugin: FastifyPluginAsync<JwtAuthPluginOptions> = async (fastify, opts) => {
  const { identityServiceUrl } = opts;

  // Decorate request with nullable user (null = unauthenticated)
  fastify.decorateRequest('user', null);

  /**
   * requireAuth — preHandler that verifies JWT and populates request.user.
   * Throws 401 if Authorization header is missing or token is invalid.
   */
  fastify.decorate(
    'requireAuth',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const token = extractBearer(request.headers.authorization);
      if (!token) {
        return reply
          .code(401)
          .send({ error: 'UNAUTHORIZED', message: 'authentication required' });
      }

      try {
        request.user = await verifyToken(token, identityServiceUrl);
      } catch (err) {
        fastify.log.debug({ err }, 'JWT verification failed');
        return reply
          .code(401)
          .send({ error: 'UNAUTHORIZED', message: 'invalid or expired token' });
      }
    },
  );

  /**
   * requireRole — factory: returns a preHandler that enforces role membership.
   * Must be used after requireAuth so request.user is populated.
   *
   * @param roles — at least one of these roles must be present on the user.
   */
  fastify.decorate(
    'requireRole',
    (...roles: string[]) =>
      async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        const user = request.user;
        if (!user) {
          return reply
            .code(401)
            .send({ error: 'UNAUTHORIZED', message: 'authentication required' });
        }
        const hasRole = roles.some((r) => user.roles.includes(r));
        if (!hasRole) {
          return reply
            .code(403)
            .send({ error: 'FORBIDDEN', message: 'insufficient permissions' });
        }
      },
  );

  /**
   * requireScope — factory: returns a preHandler that enforces OAuth2 scope.
   * Must be used after requireAuth so request.user is populated.
   * All specified scopes must be present (AND semantics). (BUG-11 fix)
   *
   * @param scopes — all of these scopes must be present on the user.
   */
  fastify.decorate(
    'requireScope',
    (...scopes: string[]) =>
      async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        const user = request.user;
        if (!user) {
          return reply
            .code(401)
            .send({ error: 'UNAUTHORIZED', message: 'authentication required' });
        }
        const hasAllScopes = scopes.every((s) => user.scopes.includes(s));
        if (!hasAllScopes) {
          return reply
            .code(403)
            .send({ error: 'FORBIDDEN', message: 'insufficient scope' });
        }
      },
  );
};

export default fp(jwtAuthPlugin, {
  name: 'omnilingo-jwt-auth',
  fastify: '>=4.0.0',
});

// ── Fastify augmentation ──────────────────────────────────────────────────────
declare module 'fastify' {
  interface FastifyInstance {
    requireAuth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireRole: (
      ...roles: string[]
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireScope: (
      ...scopes: string[]
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    user: AuthUser | null;
  }
}
