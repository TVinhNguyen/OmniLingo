# @omnilingo/auth-middleware

Shared JWKS-based RS256 JWT verification for OmniLingo Node-TS services (Fastify).

## Replaces

| Service | Old file | Old library |
|---------|----------|-------------|
| `notification` | `src/services/jwt.ts` | `jose` v6 |
| `content` | `src/plugins/jwt-auth.ts` | `jose` v5 |
| `grammar` | `src/middleware/auth.ts` | `jwks-rsa` + `jsonwebtoken` |
| `web-bff` | `src/middleware/auth.ts` | `jose` v6 |

## API

### Fastify Plugin (recommended)

```ts
import { jwtAuthPlugin } from '@omnilingo/auth-middleware';

await fastify.register(jwtAuthPlugin, {
  identityServiceUrl: 'http://identity-service:8080',
});

// Protected route
fastify.get('/me', { preHandler: [fastify.requireAuth] }, handler);

// Role-protected route
fastify.post('/admin', {
  preHandler: [fastify.requireAuth, fastify.requireRole('admin', 'platform_admin')],
}, handler);
```

After `requireAuth`, `request.user` is populated as `AuthUser`:

```ts
interface AuthUser {
  userId: string;      // JWT sub claim
  roles: string[];     // JWT roles claim
  scopes: string[];    // JWT scopes claim
  tier?: string;       // JWT tier claim (subscription tier)
}
```

### Standalone `verifyToken` (for non-Fastify hooks)

```ts
import { verifyToken, extractBearer } from '@omnilingo/auth-middleware';

const token = extractBearer(request.headers.authorization);
if (!token) throw new Error('missing token');

const user = await verifyToken(token, identityServiceUrl);
```

## Design

- **Single JWKS cache per URL**: `createRemoteJWKSet()` is called once per `identityServiceUrl` and cached for the process lifetime. TTL refreshes happen automatically via `jose` (1h cache, 30s cooldown on failure).
- **Standard validation**: RS256 only, audience `omnilingo`, issuer `identity-service`, 30s clock tolerance.
- **Error normalization**: `verifyToken` throws `Error` with `.statusCode = 401` so callers can map to HTTP 401 uniformly.

## Testing

```bash
pnpm test
```

Tests use `jest.mock('jose')` — no real JWKS server needed. For integration tests against a live identity service, use `docker compose up identity` and call the real JWKS endpoint.
