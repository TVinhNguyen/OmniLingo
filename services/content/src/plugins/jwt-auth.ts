import fp from 'fastify-plugin';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { Errors } from '../domain/errors';

export interface UserContext {
  id: string;
  roles: string[];
  scopes: string[];
}

const CONTENT_ROLES = new Set([
  'content_editor',
  'content_admin',
  'platform_admin',
  'admin',
]);

const jwtAuthPlugin: FastifyPluginAsync<{ identityServiceUrl: string }> = async (
  fastify,
  opts,
) => {
  const jwksUrl = new URL('/.well-known/jwks.json', opts.identityServiceUrl);
  const JWKS = createRemoteJWKSet(jwksUrl, {
    cacheMaxAge: 3600_000, // 1 hour cache
  });

  // Decorate request with optional user (populated by requireAuth)
  fastify.decorateRequest('user', null);

  /**
   * requireAuth — preHandler that verifies JWT and injects user context.
   * Throws 401 if token is missing/invalid.
   */
  fastify.decorate(
    'requireAuth',
    async (request: FastifyRequest, _reply: FastifyReply) => {
      const authHeader = request.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        throw Errors.unauthorized();
      }

      const token = authHeader.slice(7);
      try {
        const { payload } = await jwtVerify(token, JWKS, {
          algorithms: ['RS256'],
          issuer: 'identity-service',
          audience: 'omnilingo',
        });

        request.user = {
          id: payload.sub as string,
          roles: (payload['roles'] as string[]) ?? [],
          scopes: (payload['scopes'] as string[]) ?? [],
        };
      } catch (err) {
        fastify.log.debug({ err }, 'JWT verification failed');
        throw Errors.unauthorized();
      }
    },
  );

  /**
   * requireContentRole — preHandler that checks user has at least content_editor role.
   */
  fastify.decorate(
    'requireContentRole',
    async (request: FastifyRequest, _reply: FastifyReply) => {
      const user = request.user;
      if (!user) {
        throw Errors.unauthorized();
      }
      const hasRole = user.roles.some((r) => CONTENT_ROLES.has(r));
      if (!hasRole) {
        throw Errors.forbidden('content write operations');
      }
    },
  );

  /**
   * requireContentAdmin — preHandler for admin-only operations.
   */
  fastify.decorate(
    'requireContentAdmin',
    async (request: FastifyRequest, _reply: FastifyReply) => {
      const user = request.user;
      if (!user) {
        throw Errors.unauthorized();
      }
      const isAdmin = user.roles.some((r) =>
        ['content_admin', 'platform_admin', 'admin'].includes(r),
      );
      if (!isAdmin) {
        throw Errors.forbidden('content admin operations');
      }
    },
  );
};

export default fp(jwtAuthPlugin, { name: 'jwt-auth' });

declare module 'fastify' {
  interface FastifyInstance {
    requireAuth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireContentRole: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireContentAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    user: UserContext | null;
  }
}
