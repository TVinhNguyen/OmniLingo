# Gemini Wave 2 — Hardening + MVP1 Polish (2026-04-25 → ship)

> Sau khi Bug #7 outbox đã close (commits `9e94540` + `1fe1655`), MVP1 BE coverage 100%. Wave này tập trung **hardening** trước khi ship lên staging và **fix các caveat** từ review.
> Paste từng task brief cho Gemini theo thứ tự (G1 → G14). Effort + dependency rõ ràng. Mỗi task = 1 PR riêng.

---

## Tổng quan 15 task — sắp xếp theo priority

| # | Task | Loại | Effort | Block ship? | Status |
|---|------|------|--------|------------|--------|
| ~~**G2**~~ | ~~GitHub Actions CI workflow~~ | Infra | 1d | **YES** | ✅ Merged `955b460` |
| ~~**G3**~~ | ~~Prometheus `/metrics`~~ | Observability | 0.5d | No | ✅ Merged (kèm 8 fix scope creep) |
| ~~**G4**~~ | ~~OpenAPI spec 5 service~~ | Type safety | 2d | No | ✅ Merged (5 spec, 48 paths) |
| **G1** | Rename `InsertTx` → `Enqueue` + ADR-010 outbox tradeoff | Cleanup | 2h | No | ⏳ |
| **G5** | Kafka topic naming audit + fix lệch | Cleanup | 1h | No | ⏳ |
| **G6** | Outbox cho 2 service còn thiếu (assessment + srs) | Infra | 1d | No | ⏳ |
| **G7** | `learning.GetTodayMission` lookup lessonId/Title qua content | Feature complete | 0.5d | No | ⏳ |
| **G8** | `writing-ai-service` minimal stub (proxy LLM gateway) | New service | 1d | No | ⏳ |
| **G9** | `dictionary-service` stub (auto-fill IPA + meaning) | New service | 1d | No | ⏳ |
| **G10** | `media-service` stub (audio upload S3 signed URL) | New service | 1.5d | No | ⏳ |
| **G11** | Local Prometheus + Grafana docker-compose extension | Observability | 0.5d | No | ⏳ |
| **G12** | E2E test scaffold Playwright | QA | 1d | **YES** | ⏳ |
| **G13** | Load test k6 scenario 100 concurrent dashboard | QA | 0.5d | No | ⏳ |
| **G14** | Security audit OWASP top 10 checklist | Security | 1d | **YES** | ⏳ |
| **G15** | BFF expose `myLearningProfile.certGoal` (fix D7 TODO) | Cleanup | 1h | No | ⏳ |

**Tổng còn lại**: ~9 ngày. Ship blocker còn lại (G12 + G14) = **2 ngày critical path**.

---

## G1 — Rename `InsertTx` → `Enqueue` + ADR-010

```
Task: Rename misleading `InsertTx` method và viết ADR documenting tradeoff.

Background:
- Commit `1fe1655` đặt tên hàm `InsertTx` nhưng signature không nhận pgx.Tx →
  gây hiểu lầm là transactional. Implementation chỉ là Insert thường qua pool.
- 5 service (identity/learning/vocabulary/gamification/payment) có outbox.
  Payment service implement đúng (nhận pgx.Tx). 4 service kia rename giả
  nhưng không thật.

Goal:
1. Rename `InsertTx` → `Enqueue` ở 4 service (identity/learning/vocabulary/gamification):
   - services/<svc>/internal/messaging/outbox.go: rename method
   - Update 14 call site đã wired ở commit `1fe1655`
   - Giữ payment service `InsertTx` nguyên (nó thật transactional, đúng tên)
2. Viết docs/adr/010-outbox-non-tx-mvp1.md:
   - Context: Bug #7, Kafka outage scenario, race condition window
   - Decision: MVP1 dùng Enqueue (non-tx), Phase 2 thread pgx.Tx
   - Consequences: 99%+ coverage, 0.x% race window acceptable
   - Migration plan: Phase 2 task = thread tx parameter giống payment_service.go
3. Comment trong outbox.go: warn "Phase 2: thread pgx.Tx for atomic write"
4. Update wiring-status §4 #7 caveat: link tới ADR-010

Verify (DoD):
- grep "InsertTx" services/identity/ services/learning/ services/vocabulary/
  services/gamification/ → 0 match
- grep "Enqueue" → 14+ call sites + 4 method definitions
- ADR-010 file tồn tại với 4 section (Context, Decision, Consequences,
  Migration plan)
- payment service InsertTx không bị đụng

Branch: chore/g1-rename-outbox-enqueue
Effort: 2h
```

---

## G2 — GitHub Actions CI workflow

```
Task: Setup CI workflow chạy build + test cho mọi PR. Hiện tại 0 workflow,
ai cũng merge được code broken.

Goal:
Tạo .github/workflows/ci.yml với 4 job parallel:

1. go-services job:
   - Matrix: identity, learning, vocabulary, gamification, billing, payment,
     entitlement, progress, assessment, llm-gateway
   - Steps: setup-go@v5 (1.22), cache go modules,
     `go build ./...`, `go test ./... -race -timeout 60s`
   - Fail nếu bất kỳ service nào không build hoặc test red

2. node-services job:
   - Matrix: web-bff, content, grammar, notification
   - Steps: setup-node@v4 (20), pnpm install, pnpm tsc --noEmit, pnpm test
   - web-bff phải green strict mode

3. rust-services job:
   - srs only
   - cargo build, cargo test

4. python-services job:
   - speech-ai, ai-tutor (chỉ syntax check)
   - python -m py_compile, pytest if test exists

5. frontend job:
   - apps/web
   - pnpm tsc --noEmit (strict), pnpm lint, pnpm build (catch SSR errors)

6. migration-test job:
   - Spin Postgres container
   - Chạy goose up rồi goose down cho mọi service có migration
   - Đảm bảo migration reversible

Triggers:
- Push to main → run full
- PR opened → run full
- Path filter: chỉ chạy job tương ứng nếu file trong service đó thay đổi
  (ví dụ chỉ go services nếu chỉ services/identity/ thay đổi)

Branch protection:
- Add docs về setup CI required check trên main branch (manual step bạn làm)

Verify (DoD):
- Tạo PR test thay 1 ký tự → CI chạy ~5 phút → green
- Tạo PR cố ý break (return wrong type) → CI red, merge block
- README ở root có CI status badge

Branch: chore/g2-github-actions-ci
Effort: 1 ngày
```

---

## G3 — Prometheus `/metrics` cho 4 service thiếu

```
Task: 4/17 service không expose Prometheus metrics. Doc 12 yêu cầu hết.

Goal:
1. Audit: chạy
     for s in services/*/; do grep -l "prometheus\|/metrics" $s -r; done
   để xác định 4 service nào thiếu.
2. Per service thiếu, thêm:
   - Go service: import "github.com/prometheus/client_golang/prometheus/promhttp"
     thêm route `app.Get("/metrics", adaptor.HTTPHandler(promhttp.Handler()))`
   - Node TS: `import register from "prom-client"`, route `/metrics` trả
     register.metrics()
   - Default metrics: process_cpu_seconds_total, http_requests_total
     (counter), http_request_duration_seconds (histogram, 5/50/95/99 buckets)
3. Đảm bảo metric label: service_name, route, method, status_code

Verify (DoD):
- 17/17 service có endpoint `/metrics` trả 200
- curl localhost:port/metrics ra Prometheus exposition format
- Chạy 1 request thật rồi curl /metrics thấy http_requests_total
  tăng count

Branch: feat/g3-prometheus-metrics
Effort: 0.5 ngày
```

---

## G4 — OpenAPI spec cho 5 service core

```
Task: Doc 03 §quy ước yêu cầu mỗi service có openapi.yaml hoặc .proto.
Hiện tại 0 file. Dependent: BFF type generation tránh drift.

Scope MVP1: 5 service quan trọng nhất:
- identity (auth + user CRUD)
- learning (onboarding + lesson + path)
- content (track/course/unit/lesson/exercise)
- billing (plan + subscription + invoice)
- vocabulary (deck + card)

Goal:
Per service:
1. Tạo openapi.yaml ở service root (ví dụ services/identity/openapi.yaml)
2. OpenAPI 3.1 spec với:
   - servers: localhost:port + staging URL
   - components/schemas: tất cả request/response DTO (User, LoginRequest,
     LessonAttempt, etc.)
   - paths: tất cả endpoint hiện có với request body, response 200/400/401/500
   - components/securitySchemes: bearer JWT cho protected endpoints
3. Validate với swagger-cli validate (npx @apidevtools/swagger-cli validate)
4. Generate client TypeScript types (cho future BFF refactor):
     npx openapi-typescript services/identity/openapi.yaml
       -o services/web-bff/src/generated/identity.types.ts
   Bundle generation script vào package.json: pnpm gen:openapi
5. Add CI check (G2 follow-up): chạy validate + ensure generated types
   match committed

Approach: viết spec từ source code thật (đọc handler routes), không từ doc.
Truth = code.

Verify (DoD):
- 5 file openapi.yaml validate pass
- pnpm gen:openapi sinh 5 file types không lỗi
- README service có link tới openapi.yaml + curl example
- Spec cover tất cả endpoint hiện có (grep handler routes count = path count)

Branch: feat/g4-openapi-spec-5-services
Effort: 2 ngày
```

---

## G5 — Kafka topic naming audit + fix lệch

```
Task: Doc 03 §quy ước nói "Sự kiện Kafka: <domain>.<entity>.<action>".
Audit hiện trạng + fix nếu lệch.

Goal:
1. Grep tất cả topic strings trong services/:
     rg -h '"[a-z][a-z._]+"' services/*/internal --include="*.go" | sort -u
2. Phân loại: hợp lệ vs không hợp lệ pattern.
3. Cố ý kiểm tra: audit topic có theo pattern audit.<service>.events?
   Có topic nào dùng `_` thay `.` không? Có topic nào không có `<action>`?
4. Trường hợp lệch:
   - Liệt kê trong PR description
   - Fix bằng cách: thêm constant TopicXxx vào domain/topics.go,
     update producer + consumer cùng lúc
5. Tạo file docs/kafka-topic-registry.md liệt kê 21+ topic hiện có với:
   - Tên topic
   - Producer service
   - Consumer service(s)
   - Payload schema (link tới Go struct)
   - Idempotency key (event_id field)

Verify (DoD):
- 100% topic match regex `^[a-z]+\.[a-z_]+\.[a-z_]+$`
- docs/kafka-topic-registry.md có ít nhất 21 row
- Tests integration không gãy (chạy local Kafka đủ)

Branch: chore/g5-kafka-topic-naming-audit
Effort: 1h (nếu không lệch) hoặc 4h (nếu phải fix)
```

---

## G6 — Outbox cho 2 service còn thiếu (assessment + srs)

```
Task: Bug #7 fix 4 service producer chính. Còn assessment + srs cũng emit
event nhưng chưa có outbox.

Background:
- assessment emit `assessment.submission.graded` → consumer progress, srs
- srs emit `srs.review.completed` → consumer progress
- 2 service này nếu Kafka tạm down vẫn lose event.

Goal:
1. assessment-service:
   - migrations/00003_add_outbox.sql (giống pattern 4 service đã làm)
   - internal/messaging/outbox.go: OutboxRepository (Insert/Enqueue,
     ListPending, MarkSent, MarkFailed) + OutboxWorker
   - cmd/server/main.go: launch worker goroutine
   - Convert site emit `assessment.submission.graded`
     (services/assessment/internal/service/assessment_service.go) sang
     Enqueue
2. srs-service (Rust):
   - srs/migrations/0002_add_outbox.sql
   - srs/src/messaging/outbox.rs: outbox struct + repo + relay task
   - main.rs: spawn relay task
   - Convert site emit srs.review.completed sang outbox

Pattern reference: identity/internal/messaging/outbox.go (Go) +
payment/internal/repository/outbox_repository.go (đã có pgx.Tx threading
mà srs Rust nên copy cho atomic).

Verify (DoD):
- 2 service có outbox table + worker
- 0 site direct publish to Kafka (dùng Enqueue)
- Test: kill Kafka 2 phút → submit exercise → restart Kafka → event
  arrive ở progress consumer

Branch: feat/g6-outbox-assessment-srs
Effort: 1 ngày
```

---

## G7 — `learning.GetTodayMission` lookup lessonId/Title qua content gRPC

```
Task: Hiện tại GetTodayMission trả về lessonId/lessonTitle = nil (Phase 2
deferred trong commit `bb8d495`). Dashboard widget không hiện được "Tiếp
tục: <lesson title>". Wire qua content service.

Background:
- learning-service Go có active path nhưng không biết lesson tiếp theo
  của path (lesson list nằm trong content-service Mongo).
- content-service Node TS có route GET /api/v1/content/lessons/:id và
  GET /api/v1/content/units/:unitId/lessons.

Goal:
Option A — REST call (nhanh, MVP1):
1. Thêm ContentClient struct trong learning/internal/client/content.go
   - HTTP GET tới content service URL từ config
   - GetUnitLessons(unitId) → [Lesson]
2. Trong GetTodayMission service:
   - Query active path từ user_learning_plan
   - Lấy current_unit_id từ plan
   - Call ContentClient.GetUnitLessons(unitId)
   - Filter ra lesson đầu tiên chưa có completedAt trong user_lesson_attempts
   - Set mission.LessonID + mission.LessonTitle

Option B — gRPC (Phase 2 đúng theo doc 03):
- Defer

Chọn Option A cho task này.

Edge cases:
- User không có active path → lessonId = nil (giữ nguyên fallback)
- Content service down → log warn, vẫn trả mission với lessonId = nil
  (graceful degradation, không fail toàn bộ today mission)
- Tất cả lesson trong unit đã complete → next unit (Phase 2 logic) hoặc
  return nil tạm thời

Verify (DoD):
- User có path enrolled, chưa làm lesson nào → todayMission trả lessonId
  + lessonTitle thật
- User đã làm lesson 1, 2 → trả lesson 3
- Content service down → todayMission vẫn 200, lessonId nil

Branch: feat/g7-today-mission-lesson-lookup
Effort: 0.5 ngày
```

---

## G8 — `writing-ai-service` minimal stub

```
Task: Doc 04 §20 spec writing-ai-service Python. Doc 02 §2.6 yêu cầu
chấm Writing rubric. MVP1 stub bằng cách proxy thẳng tới llm-gateway với
prompt template.

Goal:
1. services/writing-ai/ Python + FastAPI:
   - main.py: FastAPI app, route POST /api/v1/writing/grade
     body: {essay: string, rubric: "ielts_task2"|"toefl"|"hsk_writing"|"general"}
     response: {scores: {taskResponse, coherence, lexical, grammar},
       overallBand, feedback: string, suggestions: [string]}
   - prompts/: rubric prompt templates (ielts_task2.md, etc.) — markdown
     có placeholder {{essay}}
   - service/grader.py: format prompt → call llm-gateway POST /api/v1/llm/chat
     → parse JSON response
   - Use Anthropic Claude Sonnet via llm-gateway (claude-sonnet-4-6)
2. Dockerfile + healthz + metrics
3. config: PORT, LLM_GATEWAY_URL, LOG_LEVEL
4. Cache: Redis hash "writing-ai:hash(essay+rubric)" TTL 24h
   - User retry essay → không tốn token thêm
5. Add to docker-compose.yml

Tech notes:
- Structured output: yêu cầu LLM trả JSON schema (fallback markdown parse)
- Cost cap: max 4000 tokens per request (Free) hoặc 16000 (Plus+)
- Entitlement check: middleware verify checkFeature(ai_writing_grade)

BFF wiring (sau khi service up):
- web-bff: thêm WritingAIDataSource + Mutation gradeEssay(essay, rubric)
- Frontend Devin task riêng (Wave 10)

Verify (DoD):
- POST localhost:port/api/v1/writing/grade với essay test → response
  scores đủ 4 tiêu chí
- 2nd request cùng essay → cache hit, < 100ms response
- Redis key tồn tại sau request 1

Branch: feat/g8-writing-ai-stub
Effort: 1 ngày
```

---

## G9 — `dictionary-service` stub

```
Task: Doc 04 §24 spec dictionary-service Python. Wiring §7 blocker:
"Flow 04 add card auto fill IPA/meaning cần".

Goal:
1. services/dictionary/ Python + FastAPI + PostgreSQL:
   - PG table `dict_entries` (lemma, lang, ipa, pos, meanings JSONB,
     examples JSONB, level)
   - Route GET /api/v1/dict/lookup?lang=ja&word=食べる&uiLang=vi
     → {lemma, ipa, meanings, examples}
   - Route GET /api/v1/dict/search?lang=zh&q=学&limit=10
     → [results]
2. Seed data minimal:
   - English: import từ wordnet (nltk hoặc public domain dump), top 5000
     từ phổ biến
   - Vietnamese: top 3000
   - Japanese: import JMdict subset (top 2000 N5+N4)
   - Chinese: CC-CEDICT subset (top 2000 HSK 1-3)
   - Total ~12k entry — đủ cho MVP1 demo
3. Caching: Redis 24h TTL per lookup query
4. Dockerfile + healthz + metrics

BFF wiring:
- web-bff: thêm DictionaryDataSource + Query lookup(lang, word, uiLang)
- Vocabulary service: gọi dictionary-service khi user add card thủ công →
  auto-fill IPA + meaning vào card row

Verify (DoD):
- GET /lookup?lang=en&word=hello → {ipa: "/həˈloʊ/", meanings: [...]}
- GET /search?lang=ja&q=食 → ít nhất 5 entry chứa "食"
- Vocabulary add card lemma="hello" → card row có IPA + meaning auto-filled
- Cache hit lần 2 < 50ms

Branch: feat/g9-dictionary-service-stub
Effort: 1 ngày
```

---

## G10 — `media-service` stub

```
Task: Doc 04 §23 spec media-service Node TS + S3. Wiring §7 blocker:
"audio upload cho listening/speaking cần".

Goal:
1. services/media/ Node TS + Fastify:
   - Route POST /api/v1/media/upload-url
     body: {kind: "audio"|"image", filename, mimeType, sizeBytes}
     response: {uploadUrl: signed PUT URL, fileId, finalUrl}
   - Use AWS SDK v3 S3 client với MinIO local cho dev
     (docker-compose có sẵn minio service)
   - Generate presigned PUT URL TTL 5 phút
   - Insert file metadata vào PG `media_files` table
2. Route POST /api/v1/media/upload-complete
   body: {fileId}
   - Verify file tồn tại trong S3
   - Update status = "uploaded"
   - Emit event media.file.uploaded qua outbox
3. Route GET /api/v1/media/:fileId
   - Trả signed GET URL TTL 1h (cho client stream)
4. Transcode worker (defer Phase 2): hiện chỉ upload nguyên file, không
   transcode

Auth: middleware verify JWT, file ownership check

Storage strategy:
- audio (user submission speaking): bucket "media-user-audio"
  TTL 30 ngày sau đó cleanup
- image (avatar, deck cover): bucket "media-user-image" persistent
- Test fixture content audio: bucket "media-content-audio" persistent

BFF wiring:
- web-bff: MediaDataSource + Mutation requestUploadUrl + uploadComplete
- Frontend dùng để upload speaking response

Verify (DoD):
- POST /upload-url trả về URL chấp nhận PUT từ curl
- PUT file thật → S3 (MinIO) có file
- POST /upload-complete → DB row status="uploaded"
- GET /media/:id trả URL stream được audio

Branch: feat/g10-media-service-stub
Effort: 1.5 ngày
```

---

## G11 — Local Prometheus + Grafana docker-compose extension

```
Task: Doc 12 yêu cầu observability stack. Hiện chỉ có docker-compose.yml
core, không có monitoring.

Goal:
1. docker-compose.observability.yml (override file):
   - prometheus:9090 — scrape config: target tất cả 17 service /metrics
   - grafana:3001 — login admin/admin, datasource Prometheus pre-configured
   - loki:3100 — log aggregation (optional, dependency Promtail)
   - promtail:9080 — ship docker logs tới Loki
2. infra/observability/prometheus/prometheus.yml: scrape_configs cho 17
   service với job_name = service name, scrape_interval 15s
3. infra/observability/grafana/dashboards/:
   - overview.json: req/s, p99 latency, error rate, kafka lag
   - per-service.json template
4. README:
   - "Run with monitoring: docker-compose -f docker-compose.yml
     -f docker-compose.observability.yml up"
   - URL Grafana, credentials, list pre-built dashboards

Verify (DoD):
- docker-compose up → grafana accessible localhost:3001
- Datasource Prometheus auto-connected
- Overview dashboard hiện 17 service trên panel "Up"
- Generate vài request → http_requests_total panel update

Branch: feat/g11-observability-local-stack
Effort: 0.5 ngày
```

---

## G12 — E2E test scaffold Playwright

```
Task: Doc 03 §7 yêu cầu load test. Wiring §8 checklist 7 nói "E2E test".
Setup Playwright scaffold cho golden path.

Goal:
1. apps/web-e2e/ Playwright project:
   - playwright.config.ts: baseURL từ env, 3 browser (chromium/firefox/
     webkit), retry 1 trên CI, video on failure
2. Test cases (4 critical journey):
   - tests/auth.spec.ts: register → verify email → login → logout
   - tests/onboarding.spec.ts: register → 5-step onboarding → dashboard
     có track enrolled
   - tests/learning.spec.ts: dashboard → click lesson → submit answer →
     XP awarded → progress page hiện skill score
   - tests/billing.spec.ts: pricing → checkout Plus → mock Stripe success →
     /settings/subscription hiện active
3. Test fixtures:
   - Fresh user signup mỗi test
   - Cleanup: DELETE user qua identity API sau test
4. CI integration (G2 follow-up):
   - Add job e2e trong .github/workflows/ci.yml
   - Spin docker-compose stack → run Playwright → upload artifact
5. Local run: pnpm e2e

Verify (DoD):
- pnpm e2e local pass 4/4 test
- CI runs e2e job parallel với unit tests
- Failed test → screenshot + video uploaded

Branch: feat/g12-e2e-playwright
Effort: 1 ngày
```

---

## G13 — Load test k6 scenario

```
Task: Wiring §8 checklist nói "Load test: 100 concurrent users, p95 < 1s
cho dashboard". Setup k6 cho production readiness.

Goal:
1. infra/load-tests/k6/:
   - dashboard.js: 100 VU 5 min, target endpoint /dashboard (qua web-bff
     GraphQL query), threshold p95 < 1000ms
   - lesson-flow.js: register → start lesson → submit answer (full
     pipeline) 50 VU 3 min
   - api-burst.js: 200 RPS spike 30s vào /api/v1/learning/today-mission
2. Pre-test setup script: seed 1000 user fixture
3. Output: HTML report uploaded to artifact
4. Document trong infra/load-tests/README.md:
   - cách chạy local: k6 run dashboard.js
   - cách chạy CI: workflow_dispatch trigger
   - SLA targets: p99 < 2s, p95 < 1s, error rate < 0.5%

Verify (DoD):
- Run dashboard.js local → output có summary section
- p95 latency report
- Identify bottleneck nếu fail (likely BFF aggregation hoặc DB query)

Branch: feat/g13-load-tests-k6
Effort: 0.5 ngày
```

---

## G14 — Security audit OWASP top 10 checklist

```
Task: Wiring §8 checklist 9 nói "Security review: JWT/cookie/OAuth/webhook
signature". Audit bằng OWASP top 10 framework.

Goal:
1. Tạo docs/security-audit-2026-04.md với checklist:

   [ ] A01 Broken Access Control
       - JWT verification middleware mọi protected route
       - Authorization (RBAC) cho admin endpoint
       - User ownership check (user A không truy cập deck của B)

   [ ] A02 Cryptographic Failures
       - Password hash: argon2id (verify trong identity-service)
       - JWT: RS256 không HS256
       - HTTPS only ở staging/prod (HSTS header)
       - TLS 1.2+ cho DB/Redis connection

   [ ] A03 Injection
       - SQL: dùng parameterized query (pgx) — grep "fmt.Sprintf.*SELECT"
         confirm 0 match
       - NoSQL (Mongo content-service): dùng query builder không string
         concat
       - Command injection: không exec user input

   [ ] A04 Insecure Design
       - Rate limit per IP/user (Redis token bucket)
       - Account lockout sau 5 failed login
       - Password reset token TTL 1h, single-use

   [ ] A05 Security Misconfiguration
       - Helmet headers (X-Frame-Options, CSP, X-Content-Type-Options)
       - Cookie httpOnly + Secure + SameSite=Lax
       - CORS chỉ allow domain whitelist
       - Stack trace không leak qua API response (production env)

   [ ] A06 Vulnerable Components
       - go mod audit + npm audit + cargo audit
       - Dependabot enabled
       - No known CVE >= medium

   [ ] A07 Auth Failures
       - MFA optional (P2 feature)
       - Session invalidation on password change
       - Refresh token rotation (revoke old khi refresh)

   [ ] A08 Software Integrity
       - Signed Docker images (cosign Phase 2 OK)
       - SBOM generation (CycloneDX) — Phase 2

   [ ] A09 Logging Failures
       - Structured logs (JSON) với trace_id, user_id, request_id
       - PII redaction trong logs (email mask, no password)
       - Log retention 90d

   [ ] A10 SSRF
       - Webhook URLs validate scheme + IP (no localhost, no metadata
         endpoint 169.254.169.254)
       - File upload: filetype whitelist, no SVG (XSS risk)

2. Run audit cho từng item, fill ✅/❌ vào checklist
3. Tạo issue cho mỗi ❌ với label "security"
4. Fix critical (A01-A03) trong PR này, defer medium nếu cần

Verify (DoD):
- 100% A01-A05 pass
- A06 không có CVE high
- 5+ checklist item có ❌ → issue tạo

Branch: chore/g14-security-audit
Effort: 1 ngày
```

---

---

## G15 — BFF expose `myLearningProfile.certGoal`

```
Task: D7 review phát hiện cert hardcode "ielts" trong /progress page. BE đã có
user_learning_profiles.cert_goal nhưng chưa expose qua BFF schema. Fix nhanh
để Devin có thể cleanup TODO sau.

Background:
- D7 commit aaf9ae1 ghi rõ TODO trong apps/web/app/(app)/progress/page.tsx:
    // TODO: replace hardcoded "ielts" once BE exposes a `certGoal`
    // (LearningProfile is not in the BFF schema yet — verified in
    //  services/web-bff/src/schema/schema.ts).
- learning-service repo đã lưu cert_goal trong user_learning_profiles table
  (commit 3955e75 + earlier).

Goal:
1. services/web-bff/src/schema/schema.ts:
   - Type LearningProfile (nếu chưa có): thêm field certGoal: String
   - Query myLearningProfile: LearningProfile (nếu chưa expose)
2. services/web-bff/src/datasources/datasources.ts:
   - LearningDataSource.getMyProfile(): include cert_goal mapping → certGoal
3. services/web-bff/src/resolvers/resolvers.ts:
   - myLearningProfile resolver pass through certGoal
4. apps/web/lib/api/types.ts: type LearningProfile { certGoal: string | null }
5. apps/web/lib/api/queries.ts: ME_QUERY (hoặc thêm MY_LEARNING_PROFILE_QUERY)
   include certGoal field

Verify (DoD):
- GraphQL playground: query { myLearningProfile { certGoal } } trả "ielts" hoặc null
- /progress page có thể dùng me?.learningProfile?.certGoal ?? "ielts" (Devin cleanup task riêng sau)
- Existing tests không gãy

Branch: feat/g15-expose-cert-goal
Effort: 1h
```

---

## Lịch giao việc đề xuất

### Tuần 1 (Hardening core)
- **Day 1**: G1 (rename + ADR) + G5 (Kafka audit) — quick wins
- **Day 2-3**: G2 (CI workflow) — block ship
- **Day 4**: G3 (metrics) + G7 (today mission lesson lookup)

### Tuần 2 (Type safety + new services)
- **Day 1-2**: G4 (OpenAPI 5 service)
- **Day 3**: G6 (outbox 2 service còn lại)
- **Day 4-5**: G8 (writing-ai stub) + G9 (dictionary stub)

### Tuần 3 (Production readiness)
- **Day 1-2**: G10 (media service)
- **Day 3**: G11 (observability local) + G13 (load test)
- **Day 4-5**: G12 (E2E Playwright) — block ship
- **Day 5**: G14 (security audit) — block ship

### Tuần 4 — Ship
- E2E + load test full run
- Staging deploy
- UAT
- Bug fix sprint cuối

**Critical path** (G2 + G12 + G14 = 3 ngày) → ship được sau ~1 tuần nếu skip non-blockers.

---

## Tracking

Mỗi PR Gemini làm xong:
1. Update [development-plan-2026-04-25.md](./development-plan-2026-04-25.md) §2 strikethrough task tương ứng
2. Update [wiring-status](./wiring-status-2026-04-22.md) nếu liên quan flow

Mỗi caveat phát sinh khi review:
1. Không close task ngay, tạo follow-up (như cách commit `1fe1655` follow-up commit `9e94540`)
2. ADR nếu là decision có long-term impact

Phase 2 backlog (sau MVP1):
- Outbox tx-thread refactor (4 service → match payment pattern)
- Outbox schema unify (`payment_outbox` vs `outbox_events`)
- Kafka client unify (franz-go vs segmentio/kafka-go)
- BFF→service migrate REST → gRPC
- Helm + k8s manifests
- Multi-region deployment
