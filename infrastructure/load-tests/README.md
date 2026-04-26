# OmniLingo Load Tests (k6)

Performance and load testing scripts for OmniLingo MVP1 backend services.

## Prerequisites

```bash
# Install k6
# macOS
brew install k6
# Ubuntu/Debian
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update && sudo apt-get install k6
```

## Environment Variables

| Variable       | Default                    | Description |
|----------------|----------------------------|-------------|
| `BFF_URL`      | `http://localhost:4000/graphql` | GraphQL BFF endpoint |
| `IDENTITY_URL` | `http://localhost:3001`    | Identity service URL |
| `LEARNING_URL` | `http://localhost:3002`    | Learning service URL |
| `SEED_COUNT`   | `1000`                     | Number of fixture users to seed |

## Test Scenarios

### 1. Seed Users (run once before load tests)

```bash
k6 run infrastructure/load-tests/k6/seed-users.js
# Or with custom count:
k6 run --env SEED_COUNT=500 infrastructure/load-tests/k6/seed-users.js
```

### 2. Dashboard Load Test (100 VU / 5 min)

Tests the primary dashboard GraphQL query under sustained 100 concurrent users.

```bash
k6 run infrastructure/load-tests/k6/dashboard.js
# With custom target:
k6 run --env BFF_URL=http://staging.example.com/graphql infrastructure/load-tests/k6/dashboard.js
```

### 3. Lesson Flow (50 VU / 3 min)

Tests the full write pipeline: login → start lesson → submit answer.

```bash
k6 run infrastructure/load-tests/k6/lesson-flow.js
```

### 4. API Burst (200 RPS spike / 30s)

Simulates a sudden traffic spike on the `today-mission` endpoint.

```bash
k6 run infrastructure/load-tests/k6/api-burst.js
```

## SLA Targets

| Metric     | Target         | Threshold |
|------------|----------------|-----------|
| p95 latency | < 1 second    | `p(95)<1000` |
| p99 latency | < 2 seconds   | `p(99)<2000` |
| Error rate  | < 0.5%        | `rate<0.005` |
| Burst errors | < 20% (5xx) | `rate<0.20` |

## Full Suite (local)

```bash
# 1. Start services
docker compose up -d

# 2. Seed test users
k6 run infrastructure/load-tests/k6/seed-users.js

# 3. Run all load tests sequentially
k6 run infrastructure/load-tests/k6/dashboard.js
k6 run infrastructure/load-tests/k6/lesson-flow.js
k6 run infrastructure/load-tests/k6/api-burst.js
```

## CI / Dashboard Trigger

The k6 tests are triggered manually via GitHub Actions:

```
Actions → Load Test (k6) → Run workflow
```

HTML reports are uploaded as GitHub Actions artifacts and available for 30 days.

## Interpreting Results

A passing run looks like this:
```
✓ status 200
✓ no GraphQL errors

checks.........................: 99.80% ✓ 29940 ✗ 60
data_received..................: 45 MB  150 kB/s
dashboard_latency..............: avg=234ms  p(95)=628ms  p(99)=890ms
error_rate.....................: 0.20%   ✓ 0     ✗ 60
```

If `p(95)` exceeds 1000ms, likely bottlenecks:
1. **BFF aggregation** — look at `todayMission` resolver joins
2. **DB query** — enable slow query log in Postgres (`log_min_duration_statement=100`)
3. **Cache miss** — check Redis hit rate via Grafana `redis_keyspace_hits_total`
