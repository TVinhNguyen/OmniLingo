/**
 * k6 api-burst.js — G13 Load Test
 * Scenario: 200 RPS spike burst for 30s on today-mission endpoint.
 * Tests rate limiting, caching, and service resilience under sudden traffic.
 *
 * Run:
 *   k6 run api-burst.js
 */
import http from 'k6/http';
import { check } from 'k6';
import { Rate, Counter } from 'k6/metrics';

const LEARNING_URL = __ENV.LEARNING_URL || 'http://localhost:3002';
const IDENTITY_URL = __ENV.IDENTITY_URL || 'http://localhost:3001';

const errorRate    = new Rate('burst_error_rate');
const rateLimited  = new Counter('rate_limited_429');

export const options = {
  // Arrival-rate scenario: constant 200 RPS for 30s
  scenarios: {
    burst: {
      executor: 'constant-arrival-rate',
      rate: 200,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 50,
      maxVUs: 200,
    },
  },
  thresholds: {
    // Under burst we expect some 429s — ensure service doesn't fall over
    'burst_error_rate': ['rate<0.20'],          // < 20% 5xx errors (429 is OK)
    'http_req_duration{p(99)}': ['p(99)<3000'], // p99 < 3s even under burst
  },
};

// Pre-populate one token per VU in setup
const USER_COUNT = 200;

export function setup() {
  const tokens = [];
  for (let i = 0; i < USER_COUNT; i++) {
    const user = {
      email: `loadtest-${i}@omnilingo-perf.local`,
      password: `Perf_Pass_${i}!`,
    };
    const res = http.post(
      `${IDENTITY_URL}/api/v1/auth/login`,
      JSON.stringify(user),
      { headers: { 'Content-Type': 'application/json' } }
    );
    if (res.status === 200) {
      try {
        const body = JSON.parse(res.body);
        tokens.push(body.token || body.access_token);
      } catch {}
    }
  }
  console.log(`Setup: pre-warmed ${tokens.length} tokens`);
  return { tokens };
}

export default function ({ tokens }) {
  const token = tokens[Math.floor(Math.random() * tokens.length)];
  if (!token) { errorRate.add(1); return; }

  const res = http.get(
    `${LEARNING_URL}/api/v1/learning/today-mission`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    }
  );

  // 429 rate limit is acceptable — it means rate limiter is working
  if (res.status === 429) {
    rateLimited.add(1);
    return;
  }

  const ok = check(res, {
    'status 200': (r) => r.status === 200,
    'has body':   (r) => r.body && r.body.length > 0,
  });

  errorRate.add(!ok || res.status >= 500 ? 1 : 0);
}
