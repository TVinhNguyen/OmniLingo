/**
 * Unit tests for verify.ts — the pure core of auth-middleware.
 *
 * Strategy: manually mock `jose` module to avoid ESM import issues in Jest/CJS.
 * All jose calls are mocked — no real JWKS server needed.
 */

// ── Manually construct the mock before any imports ───────────────────────────
const mockJwtVerify = jest.fn();
const mockCreateRemoteJWKSet = jest.fn(() => Symbol('FakeJWKS'));

jest.mock('jose', () => ({
  createRemoteJWKSet: mockCreateRemoteJWKSet,
  jwtVerify: mockJwtVerify,
}));

// Now import the module under test
import { verifyToken, extractBearer, clearJwksCache } from '../verify';

const IDENTITY_URL = 'http://identity-service:8080';

afterEach(() => {
  clearJwksCache();
  jest.clearAllMocks();
});

// ── extractBearer ─────────────────────────────────────────────────────────────

describe('extractBearer', () => {
  it('returns token string for valid Bearer header', () => {
    expect(extractBearer('Bearer abc.def.ghi')).toBe('abc.def.ghi');
  });

  it('returns undefined for missing header', () => {
    expect(extractBearer(undefined)).toBeUndefined();
  });

  it('returns undefined for non-Bearer scheme', () => {
    expect(extractBearer('Basic dXNlcjpwYXNz')).toBeUndefined();
  });
});

// ── verifyToken ───────────────────────────────────────────────────────────────

describe('verifyToken', () => {
  it('returns AuthUser with all claims on valid token', async () => {
    mockJwtVerify.mockResolvedValueOnce({
      payload: {
        sub: 'user-uuid-123',
        roles: ['user', 'content_editor'],
        scopes: ['read:self', 'write:self'],
        tier: 'pro',
      },
      protectedHeader: { alg: 'RS256' },
    });

    const user = await verifyToken('valid.jwt.token', IDENTITY_URL);

    expect(user).toEqual({
      userId: 'user-uuid-123',
      roles: ['user', 'content_editor'],
      scopes: ['read:self', 'write:self'],
      tier: 'pro',
    });
  });

  it('defaults roles and scopes to empty arrays when absent', async () => {
    mockJwtVerify.mockResolvedValueOnce({
      payload: { sub: 'user-uuid-456' },
      protectedHeader: { alg: 'RS256' },
    });

    const user = await verifyToken('token', IDENTITY_URL);

    expect(user.roles).toEqual([]);
    expect(user.scopes).toEqual([]);
    expect(user.tier).toBeUndefined();
  });

  it('throws 401 when jose jwtVerify throws', async () => {
    mockJwtVerify.mockRejectedValueOnce(new Error('signature verification failed'));

    await expect(verifyToken('bad.token', IDENTITY_URL)).rejects.toMatchObject({
      message: 'signature verification failed',
      statusCode: 401,
    });
  });

  it('throws 401 when sub claim is missing', async () => {
    mockJwtVerify.mockResolvedValueOnce({
      payload: { roles: ['user'] }, // no sub
      protectedHeader: { alg: 'RS256' },
    });

    await expect(verifyToken('token', IDENTITY_URL)).rejects.toMatchObject({
      message: 'JWT missing sub claim',
      statusCode: 401,
    });
  });

  it('reuses JWKS cache for same identity URL', async () => {
    mockJwtVerify.mockResolvedValue({
      payload: { sub: 'u1' },
      protectedHeader: { alg: 'RS256' },
    });

    await verifyToken('t1', IDENTITY_URL);
    await verifyToken('t2', IDENTITY_URL);

    // createRemoteJWKSet should be called once (cache hit on second call)
    expect(mockCreateRemoteJWKSet).toHaveBeenCalledTimes(1);
  });

  it('creates separate JWKS instances for different identity URLs', async () => {
    mockJwtVerify.mockResolvedValue({
      payload: { sub: 'u1' },
      protectedHeader: { alg: 'RS256' },
    });

    await verifyToken('token', 'http://identity-1:8080');
    await verifyToken('token', 'http://identity-2:8080');

    expect(mockCreateRemoteJWKSet).toHaveBeenCalledTimes(2);
  });
});
