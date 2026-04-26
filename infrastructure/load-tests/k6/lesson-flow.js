/**
 * k6 lesson-flow.js — G13 Load Test
 * Scenario: Full lesson pipeline — login → start lesson → submit answer.
 * 50 VUs for 3 minutes. Tests the entire write path.
 *
 * Run:
 *   k6 run lesson-flow.js
 */
import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const BFF_URL      = __ENV.BFF_URL      || 'http://localhost:4000/graphql';
const IDENTITY_URL = __ENV.IDENTITY_URL || 'http://localhost:3001';
const LEARNING_URL = __ENV.LEARNING_URL || 'http://localhost:3002';

const loginLatency   = new Trend('login_latency', true);
const lessonLatency  = new Trend('lesson_start_latency', true);
const submitLatency  = new Trend('submit_latency', true);
const errorRate      = new Rate('error_rate');

export const options = {
  stages: [
    { duration: '30s', target: 20 },  // ramp up
    { duration: '2m',  target: 50 },  // sustained
    { duration: '30s', target: 0  },  // ramp down
  ],
  thresholds: {
    'login_latency{p(95)}':        ['p(95)<500'],
    'lesson_start_latency{p(95)}': ['p(95)<1000'],
    'submit_latency{p(95)}':       ['p(95)<1500'],
    'error_rate':                  ['rate<0.01'],  // < 1% error (write path allows slightly more)
  },
};

const USER_COUNT = 500;

function getTestUser(vuId) {
  const idx = vuId % USER_COUNT;
  return {
    email: `loadtest-${idx}@omnilingo-perf.local`,
    password: `Perf_Pass_${idx}!`,
  };
}

export default function () {
  const user = getTestUser(__VU);
  let token = null;

  group('login', () => {
    const t0  = Date.now();
    const res = http.post(
      `${IDENTITY_URL}/api/v1/auth/login`,
      JSON.stringify(user),
      { headers: { 'Content-Type': 'application/json' } }
    );
    loginLatency.add(Date.now() - t0);
    const ok = check(res, { 'login 200': (r) => r.status === 200 });
    errorRate.add(!ok ? 1 : 0);
    if (ok) {
      const body = JSON.parse(res.body);
      token = body.token || body.access_token;
    }
  });

  if (!token) { sleep(2); return; }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  let attemptId = null;

  group('start lesson', () => {
    // Get today's mission first to find lesson ID
    const missionRes = http.post(
      BFF_URL,
      JSON.stringify({ query: '{ todayMission { lessonId } }' }),
      { headers }
    );
    const lessonId = (() => {
      try { return JSON.parse(missionRes.body)?.data?.todayMission?.lessonId; }
      catch { return null; }
    })();

    if (!lessonId) { sleep(1); return; }

    const t0  = Date.now();
    const res = http.post(
      `${LEARNING_URL}/api/v1/learning/lessons/${lessonId}/start`,
      JSON.stringify({}),
      { headers }
    );
    lessonLatency.add(Date.now() - t0);

    const ok = check(res, { 'start lesson 200/201': (r) => r.status === 200 || r.status === 201 });
    errorRate.add(!ok ? 1 : 0);

    if (ok) {
      try { attemptId = JSON.parse(res.body)?.attempt_id || JSON.parse(res.body)?.id; }
      catch {}
    }
  });

  if (!attemptId) { sleep(2); return; }

  group('submit answer', () => {
    const t0  = Date.now();
    const res = http.post(
      `${LEARNING_URL}/api/v1/learning/lessons/complete`,
      JSON.stringify({ attempt_id: attemptId, score: 85, time_spent_sec: 45 }),
      { headers }
    );
    submitLatency.add(Date.now() - t0);
    const ok = check(res, { 'complete 200': (r) => r.status === 200 });
    errorRate.add(!ok ? 1 : 0);
  });

  sleep(Math.random() * 3 + 2); // 2-5s think time
}
