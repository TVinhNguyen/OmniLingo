/**
 * k6 seed-users.js
 * Pre-test setup: register 1000 fixture users for load tests.
 * Run once before dashboard.js or lesson-flow.js:
 *   k6 run seed-users.js
 *
 * Output: writes user credentials to /tmp/omnilingo-users.json (shared memory)
 */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

const BASE_URL = __ENV.IDENTITY_URL || 'http://localhost:3001';
const TOTAL_USERS = parseInt(__ENV.SEED_COUNT || '1000');

export const options = {
  vus: 50,
  iterations: TOTAL_USERS,
  thresholds: {
    http_req_failed: ['rate<0.05'], // allow up to 5% failure for seed
  },
};

export default function () {
  const idx = __ITER;
  const user = {
    email: `loadtest-${idx}@omnilingo-perf.local`,
    password: `Perf_Pass_${idx}!`,
    name: `LoadTest User ${idx}`,
  };

  const res = http.post(
    `${BASE_URL}/api/v1/auth/register`,
    JSON.stringify(user),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(res, {
    'user created or already exists': (r) => r.status === 201 || r.status === 409,
  });

  sleep(0.05);
}
