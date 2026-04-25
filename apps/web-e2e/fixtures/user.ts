import { APIRequestContext } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

export interface TestUser {
  email: string;
  password: string;
  name: string;
  token?: string;
}

const IDENTITY_URL = process.env.IDENTITY_SERVICE_URL || 'http://localhost:3001';

/**
 * Build a unique test user object without registering via API.
 * Use this for tests that register through the UI.
 */
export function buildTestUser(): TestUser {
  const suffix = uuidv4().split('-')[0];
  return {
    email: `e2e-${suffix}@omnilingo-test.local`,
    password: `TestPass_${suffix}!2`,
    name: `E2E User ${suffix}`,
  };
}

/**
 * Create a unique test user via identity-service REST API.
 * Returns the user details including a one-time password.
 */
export async function createTestUser(request: APIRequestContext): Promise<TestUser> {
  const suffix = uuidv4().split('-')[0];
  const user: TestUser = {
    email: `e2e-${suffix}@omnilingo-test.local`,
    password: `TestPass_${suffix}!2`,
    name: `E2E User ${suffix}`,
  };

  const resp = await request.post(`${IDENTITY_URL}/api/v1/auth/register`, {
    data: {
      email: user.email,
      password: user.password,
      name: user.name,
    },
  });

  if (!resp.ok()) {
    throw new Error(
      `createTestUser failed: ${resp.status()} ${await resp.text()}`
    );
  }

  return user;
}

/**
 * Login an existing test user and return the JWT token.
 */
export async function loginTestUser(
  request: APIRequestContext,
  user: TestUser
): Promise<string> {
  const resp = await request.post(`${IDENTITY_URL}/api/v1/auth/login`, {
    data: { email: user.email, password: user.password },
  });

  if (!resp.ok()) {
    throw new Error(`loginTestUser failed: ${resp.status()} ${await resp.text()}`);
  }

  const body = await resp.json();
  return body.token || body.access_token;
}

/**
 * Delete a test user via identity-service (admin cleanup endpoint).
 * Best-effort: logs error instead of throwing so tests can still pass.
 */
export async function deleteTestUser(
  request: APIRequestContext,
  email: string
): Promise<void> {
  try {
    await request.delete(`${IDENTITY_URL}/api/v1/admin/users`, {
      data: { email },
    });
  } catch (err) {
    console.warn(`[fixtures] deleteTestUser warning: ${err}`);
  }
}
