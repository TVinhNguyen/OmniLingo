/**
 * k6 dashboard.js — G13 Load Test
 * Scenario: 100 concurrent VUs hammering the Dashboard GraphQL query
 * for 5 minutes. SLA: p95 < 1000ms, error rate < 0.5%.
 *
 * Run:
 *   k6 run dashboard.js
 *   k6 run --env BFF_URL=http://localhost:4000 dashboard.js
 */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const BFF_URL = __ENV.BFF_URL || 'http://localhost:4000/graphql';
const IDENTITY_URL = __ENV.IDENTITY_URL || 'http://localhost:3001';

// Custom metrics
const dashboardLatency = new Trend('dashboard_latency', true);
const errorRate = new Rate('error_rate');

export const options = {
  stages: [
    { duration: '30s', target: 25  },  // ramp up
    { duration: '4m',  target: 100 },  // sustained load
    { duration: '30s', target: 0   },  // ramp down
  ],
  thresholds: {
    // SLA targets from Doc 03
    'dashboard_latency{p(95)}': ['p(95)<1000'],   // p95 < 1s
    'dashboard_latency{p(99)}': ['p(99)<2000'],   // p99 < 2s
    'error_rate': ['rate<0.005'],                  // < 0.5% errors
    'http_req_failed': ['rate<0.005'],
  },
};

// Shared user pool — pre-seeded by seed-users.js
const USER_COUNT = 1000;

function getTestUser(vuId) {
  const idx = vuId % USER_COUNT;
  return {
    email: `loadtest-${idx}@omnilingo-perf.local`,
    password: `Perf_Pass_${idx}!`,
  };
}

function loginUser(user) {
  const res = http.post(
    `${IDENTITY_URL}/api/v1/auth/login`,
    JSON.stringify(user),
    { headers: { 'Content-Type': 'application/json' } }
  );
  if (res.status !== 200) return null;
  const body = JSON.parse(res.body);
  return body.token || body.access_token;
}

const TODAY_MISSION_QUERY = JSON.stringify({
  query: `
    query DashboardData {
      myLearningProfile {
        certGoal
      }
      todayMission {
        lessonId
        lessonTitle
        minutesToGoal
        xpReward
      }
    }
  `,
});

export function setup() {
  // Verify BFF is reachable
  const probe = http.get(`${BFF_URL.replace('/graphql', '')}/health`);
  if (probe.status !== 200) {
    console.warn(`BFF health check failed: ${probe.status}`);
  }
}

export default function () {
  // Login (VU-scoped — each VU logs in once)
  const user = getTestUser(__VU);
  const token = loginUser(user);

  if (!token) {
    errorRate.add(1);
    sleep(1);
    return;
  }

  // ── Dashboard GraphQL query
  const start = Date.now();
  const res = http.post(BFF_URL, TODAY_MISSION_QUERY, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const durationMs = Date.now() - start;
  dashboardLatency.add(durationMs);

  const ok = check(res, {
    'status 200': (r) => r.status === 200,
    'no GraphQL errors': (r) => {
      try {
        const body = JSON.parse(r.body);
        return !body.errors || body.errors.length === 0;
      } catch { return false; }
    },
  });

  errorRate.add(!ok ? 1 : 0);

  sleep(Math.random() * 2 + 1); // 1-3s think time
}
