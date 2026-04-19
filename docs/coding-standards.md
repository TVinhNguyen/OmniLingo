# OmniLingo — Coding Standards & Architecture Principles
> Tổng hợp từ các tài liệu kiến trúc `01-13.md`. Đây là **nguồn sự thật duy nhất** về cách viết code, cấu trúc service, và quyết định kỹ thuật trong project.
> 
> **Mọi AI assistant, developer, hoặc reviewer** phải đọc file này trước khi bắt đầu implement bất kỳ service nào.

---

## 1. Nguyên tắc kiến trúc tổng thể (từ 03-arch.md)

### 1.1. Core Principles — "Không được vi phạm"

| # | Nguyên tắc | Ý nghĩa thực tế |
|---|-----------|----------------|
| 1 | **Domain-Driven Design** | Mỗi service = 1 bounded context. Không chia theo layer (controller/service/repo là trong nội bộ service), chia theo domain knowledge |
| 2 | **Microservices vừa đủ** | Không over-split. Phase 1: ~18 services. Chỉ tách service mới khi có lý do business rõ ràng |
| 3 | **API-First** | Thiết kế API (contract) trước khi code. OpenAPI 3.1 cho REST, Protobuf cho gRPC |
| 4 | **Event-Driven cho decoupling** | Tác vụ async (analytics, notification, audit, gamification) → Kafka. Không gọi service khác synchronously khi không cần |
| 5 | **OmniLingo Persistence** | Chọn DB theo workload: OLTP → PostgreSQL, Document → MongoDB, Cache → Redis, Search → ES, Analytics → ClickHouse |
| 6 | **Stateless Services** | Service HTTP không giữ state trong memory. State sống ở DB/Redis. Scale ngang = thêm pod |
| 7 | **Security by Default** | Zero-trust giữa services (mTLS), secret qua Vault, least-privilege. Không "thêm security sau" |
| 8 | **Observability không tuỳ chọn** | Metric + structured log + trace từ ngày 1. Không có service nào thiếu 3 pillars này |
| 9 | **Cost-aware** | LLM/AI inference = chi phí lớn nhất → phải cache, rate limit, có fallback tier |

### 1.2. Service Communication Rules

```
┌─────────────────────────────────────────────────────────┐
│  Đồng bộ (REST / gRPC): chỉ dùng khi cần response ngay │
│  Ví dụ: auth check, lấy content, check entitlement      │
├─────────────────────────────────────────────────────────┤
│  Bất đồng bộ (Kafka): dùng cho side effects             │
│  Ví dụ: gửi email, cộng XP, ghi audit, analytics        │
├─────────────────────────────────────────────────────────┤
│  CẤMLÀM: Service A query trực tiếp DB của Service B     │
│  Mọi data từ service khác phải qua API hoặc event       │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Cấu trúc thư mục chuẩn (Go services)

Áp dụng cho: `identity-service`, `learning-service`, `vocabulary-service`, `assessment-service`, `billing-service`, `payment-service`, `entitlement-service`, `booking-service`, `gamification-service`, `progress-service`, `llm-gateway`

```
services/<service-name>/
├── cmd/
│   └── server/
│       └── main.go              # Entry point — wire tất cả dependencies
├── internal/
│   ├── config/
│   │   └── config.go            # Load env vars, defaults, validation
│   ├── domain/
│   │   ├── <entity>.go          # Entities, Value Objects, Domain Errors
│   │   └── events.go            # Kafka event types + Audit event types
│   ├── repository/
│   │   ├── <entity>_repository.go   # Interface + implementation
│   │   ├── postgres.go          # PgxPool connection + migration runner
│   │   └── redis.go             # Redis client factory
│   ├── service/
│   │   └── <domain>_service.go  # Business logic, interface + implementation
│   ├── handler/
│   │   ├── <resource>_handler.go # HTTP handlers + route registration
│   │   └── error_handler.go     # Global error handler
│   ├── middleware/
│   │   └── middleware.go        # RequestID, CORS, JWTAuth, Prometheus
│   ├── metrics/
│   │   └── metrics.go           # Prometheus metric definitions
│   ├── telemetry/
│   │   └── otel.go              # OTel provider setup
│   ├── messaging/
│   │   └── kafka_publisher.go   # Kafka publisher (franz-go)
│   ├── audit/
│   │   └── audit.go             # Audit service (log + Kafka)
│   ├── ratelimit/               # Chỉ services cần rate limiting
│   │   └── limiter.go
│   └── security/                # Chỉ services cần HIBP, crypto utils
│       └── hibp.go
├── migrations/
│   ├── 00001_init_schema.sql    # Goose migration files
│   └── 00002_*.sql
├── Dockerfile
├── go.mod
├── go.sum
└── .env.example
```

### 2.1. Quy tắc internal packages

- `domain/` — **Không import** bất kỳ package nào trong `internal/` khác. Chỉ dùng standard library và `github.com/google/uuid`
- `repository/` — Implement interface defined trong `domain/`
- `service/` — Chứa business logic. Depend on `repository` (via interface), `messaging`, `audit`
- `handler/` — Chỉ xử lý HTTP concerns. Không có business logic
- `main.go` — Dependency injection thủ công (không dùng framework DI)

---

## 3. Database & Migration Rules

### 3.1. Schema ownership
- Mỗi service có **database riêng**: `identity_db`, `learning_db`, `billing_db`, ...
- Không service nào query cross-database (kể cả cùng cluster Postgres)
- Truyền data giữa services: qua REST API hoặc Kafka event

### 3.2. Migration conventions
- Tool: **Goose** (`github.com/pressly/goose/v3`)
- File naming: `00001_init_schema.sql`, `00002_add_<feature>.sql`
- Format:
```sql
-- +goose Up
-- +goose StatementBegin
CREATE TABLE ...;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE ...;
-- +goose StatementEnd
```
- Migration chạy **tự động khi server start** qua `repository.RunMigrations()`
- Không bao giờ sửa file migration đã push. Tạo migration mới để sửa

### 3.3. PostgreSQL conventions
```sql
-- Mọi table phải có:
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()

-- Soft delete (khi cần): thêm deleted_at TIMESTAMPTZ
-- Tên cột: snake_case
-- Tên table: snake_case, số nhiều (users, sessions, roles)
-- Index: ix_<table>_<column(s)>
-- FK constraint: fk_<table>_<ref_table>
```

### 3.4. Redis key naming
```
<service>:<entity>:<id>                # ví dụ: identity:session:abc123
<service>:<feature>:<key>              # ví dụ: identity:rl:login:ip:1.2.3.4
```
- Luôn set TTL cho key Redis
- Namespace theo service để tránh collision khi share Redis cluster

---

## 4. API Design Standards

### 4.1. REST conventions
```
# URL structure
/api/v1/<resource>              # collection
/api/v1/<resource>/:id          # single resource
/api/v1/<resource>/:id/<sub>    # sub-resource

# HTTP methods
GET     → đọc, idempotent, không side effect
POST    → tạo mới hoặc action không idempotent
PATCH   → update partial (chỉ fields được gửi)
PUT     → replace full resource (ít dùng)
DELETE  → xóa, nên idempotent

# Status codes chuẩn
200 OK              # GET, PATCH thành công
201 Created         # POST tạo resource mới
204 No Content      # DELETE, action không cần body
400 Bad Request     # Validation lỗi, format sai
401 Unauthorized    # Thiếu hoặc invalid token
403 Forbidden       # Token đúng nhưng thiếu quyền
404 Not Found       # Resource không tồn tại
409 Conflict        # Duplicate, business rule conflict
422 Unprocessable   # Input hợp lệ về format nhưng vi phạm business rule
429 Too Many Req    # Rate limit, kèm Retry-After header
500 Internal Error  # Lỗi server không handle được
501 Not Implemented # Feature chưa implement (Phase 2+ stubs)
```

### 4.2. Response format
```json
// Thành công — resource response
{ "user": { ... } }
{ "data": [ ... ], "meta": { "total": 100, "page": 1 } }

// Lỗi — LUÔN dùng format này
{
  "error": "ERROR_CODE",       // SCREAMING_SNAKE_CASE
  "message": "human readable"  // Tiếng Anh, không expose stack trace
}
```

### 4.3. Error codes chuẩn
```
USER_NOT_FOUND          INVALID_CREDENTIALS     EMAIL_TAKEN
EMAIL_NOT_VERIFIED      ACCOUNT_SUSPENDED       ACCOUNT_LOCKED
TOKEN_INVALID           SESSION_REVOKED         MFA_REQUIRED
RATE_LIMITED            PASSWORD_COMPROMISED    VERIFICATION_INVALID
BAD_REQUEST             UNAUTHORIZED            FORBIDDEN
NOT_FOUND               CONFLICT                INTERNAL_ERROR
```

### 4.4. Request headers cần handle
```
Authorization: Bearer <JWT>        # Auth
X-Request-ID: <uuid>               # Tracing (generate nếu không có)
X-Device-ID: <device-identifier>   # Session binding
User-Agent: <client-info>          # Audit log
Origin: <origin>                   # CORS check
```

---

## 5. Security — Quy tắc bắt buộc (từ 09-security.md)

### 5.1. Authentication
```
✅ BẮT BUỘC:
- Password hashing: argon2id (KHÔNG dùng bcrypt, KHÔNG dùng SHA-256 thẳng)
- JWT: RS256 (KHÔNG HS256 — HS256 không thể verify phân tán)
- JWT TTL: Access Token 15 phút max, Refresh Token 30 ngày max
- JWT claims: KHÔNG chứa email, phone, hoặc PII khác
- Refresh token: opaque (random bytes), store hash trong DB, rotate mỗi use
- Token reuse detection: revoke cả family khi phát hiện
- JWKS endpoint: /.well-known/jwks.json (các service khác fetch public key verify)

❌ KHÔNG được:
- HS256, HS384, HS512 cho JWT
- Lưu plaintext password, plaintext token (kể cả refresh)
- Email/phone trong JWT payload
- JWT TTL > 15 phút cho access token
- Shared secret cho JWT (không scale, không rotate được)
```

### 5.2. Rate Limiting
```
✅ BẮT BUỘC cho mọi auth endpoint:
- Login: giới hạn theo IP + theo email riêng biệt
- Register: giới hạn theo IP
- Password reset: giới hạn theo IP + email
- Response khi vượt: 429 + header Retry-After
- Backend: Redis (fail-open khi Redis down)

Lock account sau N lần sai liên tiếp:
- Lưu failed_login_count trong DB (persist qua restart)
- Mở khóa tự động sau ACCOUNT_LOCK_DURATION
- Audit log mỗi lần lock
```

### 5.3. CORS
```
✅ BẮT BUỘC:
- Whitelist-only (không dùng "*" trong production)
- Set Vary: Origin (prevent cache poisoning)
- Expose-Headers: X-Request-ID, Retry-After
- Preflight cache: Access-Control-Max-Age: 3600

❌ KHÔNG:
- Access-Control-Allow-Origin: * (chấp nhận mọi origin)
```

### 5.4. HIBP Password Check
```go
// Chỉ áp dụng khi đăng ký và đổi mật khẩu
// Non-blocking: nếu API lỗi → log warn + cho phép tiếp tục
// K-anonymity: chỉ gửi 5 ký tự SHA-1 prefix, không gửi full hash/password
if cfg.HIBPEnabled {
    count, err := hibp.IsPwned(password)
    if err != nil { log.Warn("HIBP API error", ...); /* proceed */ }
    else if count > 0 { return ErrPasswordCompromised }
}
```

### 5.5. Body Size Limit
```go
// Fiber
app := fiber.New(fiber.Config{
    BodyLimit: 64 * 1024, // 64KB — chống DoS
})
```

### 5.6. Sensitive Data Handling
```
❌ KHÔNG bao giờ log:
- Password (plaintext hoặc hash)
- Refresh token (plaintext)
- Credit card info
- Full email trong production log (dùng masked: al***@gmail.com)

✅ Luôn:
- Hash token trước khi lưu DB (SHA-256)
- Dùng constant-time comparison cho secret (tránh timing attack)
- GDPR delete: nullify PII fields (email, phone), không hard delete ngay
```

---

## 6. Observability — Bắt buộc cho mọi service (từ 12-observability.md)

### 6.1. Prometheus Metrics
```go
// Naming convention: <service>_<subsystem>_<metric>
identity_http_requests_total          // Counter
identity_http_request_duration_seconds // Histogram  
srs_service_review_queue_depth        // Gauge
learning_lesson_completion_total      // Counter

// Mọi HTTP handler phải có:
- Request count (Counter) với labels: method, route, status
- Request duration (Histogram) với labels: method, route

// Business metrics (theo domain):
- Operation count with status labels (success/failure/...)
- SLO-critical latency histogram (P99 target explicit)
```

### 6.2. OpenTelemetry
```go
// Setup chuẩn:
otel.Init(ctx, serviceName, version, otlpEndpoint)

// Resource attributes bắt buộc:
semconv.ServiceNameKey.String(serviceName)
semconv.ServiceVersionKey.String(version)
attribute.String("deployment.environment", env) // dev/staging/prod

// Sampling:
// - Dev: AlwaysSample
// - Prod: 10% head-based + tail-based cho slow/error requests
```

### 6.3. Structured Logging
```go
// Dùng zap (production-grade)
// Dev: zap.NewDevelopment() → human readable
// Prod: zap.NewProduction() → JSON

// Fields bắt buộc trong mỗi log entry:
// timestamp, level, service, version, request_id, user_id (nếu có)

// KHÔNG dùng fmt.Println(), log.Printf() trong production code
```

### 6.4. Health Endpoints
```
GET /healthz   → Liveness: luôn trả 200 OK nếu process còn chạy
GET /readyz    → Readiness: check dependencies (DB, Redis, ...)
               → 503 nếu không ready (k8s sẽ không route traffic tới)
```

---

## 7. Kafka Event Design (từ 03-arch.md, 04-microservices.md)

### 7.1. Topic naming
```
<domain>.<entity>.<action>

# Examples:
identity.user.registered
identity.user.logged_in
learning.lesson.completed
srs.review.scheduled
billing.subscription.activated
```

### 7.2. Event payload chuẩn
```go
type <Domain>Event struct {
    EventID   string    `json:"event_id"`   // uuid, dùng uuid.New().String()
    // ... domain-specific fields
    CreatedAt time.Time `json:"created_at"` // UTC
}

// Rules:
// - EventID bắt buộc (idempotency)
// - timestamps luôn UTC
// - Không embed nested objects lớn — chỉ ID refs
// - Versionable: thêm "version": "1" nếu schema có thể thay đổi
```

### 7.3. Producer guidelines
```go
// Publisher interface (disable khi dev):
publisher.Publish(ctx, topic, payload) // fire-and-forget OK cho non-critical

// Kafka disabled mode (dev): no-op, không error
// Production: ProduceSync cho critical events, async cho analytics

// KHÔNG blocking main request flow cho kafka publish
// Nếu critical: dùng transactional outbox pattern
```

### 7.4. Audit events — LUÔN publish
```
Topic: audit.<service>.events
Payload: AuditEvent{
    event_id, action, user_id, ip, device_info,
    request_id, result (SUCCESS|FAILURE), details, timestamp
}

// Mọi action bảo mật quan trọng phải có audit event:
// register, login, logout, password change, account lock, delete, permission change
```

### 7.5. Event Schema Evolution
```
Phase 1 (MVP): JSON payloads + manual "version" field
  - Mọi event PHẢI có field "version": "1"
  - Consumer PHẢI ignore unknown fields (forward-compatible)
  - Consumer PHẢI reject events thiếu required fields → route vào DLQ
  - Khi thêm field mới: chỉ thêm optional fields, không xóa/rename existing fields

Phase 2: Migrate sang Avro + Schema Registry
  - Schema Registry (Confluent) enforce backward compatibility
  - Producer register schema trước khi publish
  - Consumer auto-evolve với reader schema

DLQ (Dead Letter Queue):
  - Mọi consumer group PHẢI có DLQ topic: <consumer-topic>.dlq
  - Events fail >3 retries → DLQ
  - Alert khi DLQ depth > 0
  - DLQ retention: 7 ngày
```

---

## 7b. Resilience Patterns — Bắt buộc cho inter-service calls

### 7b.1. Timeout budget
```
BFF/Gateway: 10s total budget
  └── Internal service call: max 8s
       └── DB query: max 3s
       └── Redis: max 500ms
       └── External API (LLM, Stripe): max 5s

// LUÔN set context timeout trước khi gọi downstream
ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
defer cancel()
```

### 7b.2. Retry with backoff
```
// Chỉ retry cho transient errors (5xx, network timeout)
// KHÔNG retry cho 4xx (client error)
// Backoff: 100ms → 200ms → 400ms (exponential + jitter)
// Max 3 retries

// Go: dùng go-retryablehttp hoặc custom middleware
// Node: dùng got/axios retry config
// Python: dùng tenacity
```

### 7b.3. Circuit breaker
```
// Áp dụng cho:
// - BFF → mọi downstream service
// - llm-gateway → mọi LLM provider
// - payment → mọi payment provider

// Config:
// - Closed → Open: khi error rate > 50% trong 10 requests
// - Open duration: 30s
// - Half-open: cho 1 request thử, nếu thành công → Closed

// Go: sony/gobreaker
// Node: opossum
// Python: pybreaker
```

### 7b.4. Graceful degradation
```
// Khi dependency down, service PHẢI degrade thay vì crash:
// - Redis down → bypass cache, query DB trực tiếp (chậm hơn nhưng vẫn hoạt động)
// - Kafka down → log event locally, retry sau (cho non-critical events)
// - LLM provider down → trả về "AI tutor tạm thời không khả dụng" thay vì 500
// - Rate limiter (Redis) down → fail-open (allow request)
```

---

## 8. Go Code Conventions

### 8.1. Error handling
```go
// Domain errors: có code + message, implement error interface
type DomainError struct {
    Code    string
    Message string
}
func (e *DomainError) Error() string { return e.Message }

// Sentinel errors: biến global
var ErrUserNotFound = &DomainError{Code: "USER_NOT_FOUND", Message: "user not found"}

// Handler chỉ propagate, ErrorHandler xử lý tập trung:
if err != nil { return mapDomainError(err) }

// Không panic trong handler. Dùng recover middleware.
// Không log + return error (chọn một).
```

### 8.2. Context usage
```go
// LUÔN truyền context qua call chain
func (s *service) DoSomething(ctx context.Context, ...) error { ... }

// KHÔNG dùng c.Context() (request context) trong goroutine background:
go func(uid uuid.UUID) {
    _ = svc.SendEmail(context.Background(), uid) // ✅ detached context
}(user.ID)

// ❌ SAI:
go func() {
    _ = svc.SendEmail(c.Context(), user.ID) // panic khi request kết thúc
}()
```

### 8.3. Dependency injection
```go
// main.go: wire thủ công — không dùng framework DI (wire, fx)
db := repository.NewPostgres(cfg.DatabaseURL)
rdb := repository.NewRedis(cfg.RedisURL)
userRepo := repository.NewUserRepository(db)
svc := service.NewAuthService(cfg, log, userRepo, ...)
handler.RegisterRoutes(v1, svc, log)
```

### 8.4. Interface design
```go
// Repository: luôn định nghĩa interface trong file repository
type UserRepository interface {
    Create(ctx context.Context, u *domain.User) error
    FindByID(ctx context.Context, id uuid.UUID) (*domain.User, error)
    // ...
}

// Service: luôn định nghĩa interface
type AuthService interface {
    Register(ctx context.Context, req RegisterRequest) (*domain.User, error)
    // ...
}

// Lợi ích: testable với mock, tách coupling
```

### 8.5. Naming conventions
```go
// Packages: lowercase, single word (domain, service, handler, repository)
// Types: PascalCase
// Functions/Methods: camelCase (exported = PascalCase)
// Constants: SCREAMING_SNAKE_CASE cho domain error codes
// Variables: camelCase
// Files: snake_case (user_repository.go, auth_handler.go)

// Error variables:
var ErrUserNotFound = &DomainError{...}  // Prefix Err

// Constructor functions:
func NewUserRepository(db *pgxpool.Pool) UserRepository { ... }
func NewAuthService(cfg *config.Config, ...) (AuthService, error) { ... }
```

### 8.6. Config loading
```go
// config.go: centralized, load từ env vars + defaults
type Config struct {
    Env     string // "development" | "production" | "staging"
    Port    string
    // ...
}

func Load() *Config {
    return &Config{
        Env:  getEnv("ENV", "development"),
        Port: getEnv("PORT", "3001"),
        // ...
    }
}

func getEnv(key, defaultVal string) string {
    if v := os.Getenv(key); v != "" { return v }
    return defaultVal
}
```

---

## 9. Go Service Checklist — Trước khi mark service "Done"

```
✅ Security
[ ] JWT RS256 (không HS256)
[ ] Password argon2id (không bcrypt)
[ ] Rate limiting cho auth endpoints
[ ] Brute force protection
[ ] CORS whitelist-only với Vary: Origin
[ ] Body limit 64KB
[ ] HIBP check (nếu service có đăng ký/đổi mật khẩu)
[ ] Không PII trong JWT claims
[ ] Refresh token rotation + reuse detection

✅ API
[ ] Tất cả endpoints trả đúng status code
[ ] Error response dùng format {error, message}
[ ] Retry-After header cho 429
[ ] X-Request-ID inject + forward

✅ Database
[ ] Migration files đặt đúng thư mục
[ ] Goose migration chạy tự động khi start
[ ] Index cho các cột thường query
[ ] Transaction cho multi-table writes

✅ Observability
[ ] /healthz + /readyz endpoint
[ ] Prometheus metrics: HTTP request count + duration
[ ] Business metrics (login_total, register_total, ...)
[ ] OpenTelemetry provider setup
[ ] Structured logging với zap

✅ Kafka
[ ] Domain events publish theo spec
[ ] Audit events cho mọi action bảo mật
[ ] Kafka disabled mode (dev no-op)

✅ Code quality
[ ] `go build ./...` không lỗi
[ ] `go vet ./...` không warning
[ ] Không inline import (import chỉ ở đầu file)
[ ] Context truyền qua mọi async call
[ ] No goroutine leak (dùng background context thay vì request context)

✅ Tests
[ ] Happy path cho mọi endpoint
[ ] Error cases (401, 403, 404, 409, 429)
[ ] GDPR delete flow
[ ] Token rotation flow
[ ] Body size limit

✅ Documentation
[ ] Cập nhật docs/service-catalog.md với đầy đủ thông tin
```

---

## 10. Tech Stack chính thức (từ 06-tech-stack.md)

### Approved languages
| Loại service | Language | Framework |
|---|---|---|
| High-throughput CRUD | **Go** | Fiber v2 + gRPC |
| Content-heavy, shape thay đổi | **TypeScript/Node.js** | Fastify hoặc NestJS |
| High-perf computation (SRS) | **Rust** | Axum + tonic |
| AI/ML pipeline | **Python** | FastAPI |
| Web frontend | **TypeScript + React** | Next.js 15 |
| Mobile | **React Native** (Expo, Phase 1) | — |

> **Không thêm ngôn ngữ mới** ngoài 6 ngôn ngữ đã approved (Go, TS, Python, Rust, Swift, Kotlin) mà không có quyết định từ Tech Lead.

### Infrastructure stack
| Component | Tool | Notes |
|---|---|---|
| Container orchestration | Kubernetes | Helm charts |
| Service mesh | Linkerd | mTLS, traffic policies |
| API Gateway | Kong hoặc Envoy | Auth, rate limit, routing |
| Event bus | **Apache Kafka** (apache/kafka:3.9.0) | KRaft mode, không Zookeeper |
| Task queue | RabbitMQ 3.13 | Transcode, email tasks |
| Observability | Prometheus + Grafana + Loki + Tempo | OTel Collector as hub |
| Secrets | HashiCorp Vault | Không commit secrets |
| IaC | Terraform + Helm | GitOps với ArgoCD |

### Database stack
| Store | Version | Use case |
|---|---|---|
| PostgreSQL | 16-alpine | OLTP, ACID transactions |
| MongoDB | 7 | Document store (content) |
| Redis | 7-alpine | Cache, session, rate limit, leaderboard |
| ClickHouse | 24.3 | Analytics, event stream queries |
| MinIO | latest | S3-compatible object storage (local dev) |
| Elasticsearch/OpenSearch | — | Full-text search |

---

## 11. Docker Compose (dev environment)

File: `docker-compose.yml` tại root project.

```bash
# Start tất cả services
docker compose up -d

# Start chỉ core dependencies (postgres + redis)
docker compose up -d postgres redis

# Verify health
docker ps --format "table {{.Names}}\t{{.Status}}"
```

Services trong compose:
- `omnilingo-postgres` → `localhost:5432`
- `omnilingo-redis` → `localhost:6379`
- `omnilingo-kafka` → `localhost:9094` (external listener)
- `omnilingo-mongodb` → `localhost:27017`
- `omnilingo-rabbitmq` → `localhost:5672` (AMQP), `localhost:15672` (UI)
- `omnilingo-clickhouse` → `localhost:8123` (HTTP), `localhost:9000` (native)
- `omnilingo-minio` → `localhost:9100` (S3 API), `localhost:9001` (Console)

---

## 12. GDPR & Compliance Rules (từ 09-security.md)

```
✅ BẮT BUỘC implement:
- Right to deletion: endpoint DELETE /users/me
  → Không xóa cứng ngay. Status → 'pending_deletion', email → NULL
  → Revoke tất cả sessions
  → Emit identity.user.deleted event (cho downstream cleanup)
  → Hard delete sau X ngày (batch job)

- Right to access: user có thể xem mọi data về mình
- Data minimization: không collect PII không cần thiết
- Audit trail: mọi action quan trọng có dấu vết (immutable, S3 Object Lock)

✅ Children's data (COPPA):
- Nếu platform cho < 13 tuổi: cần parental consent
- Voice data của trẻ: không dùng để train model mà không consent

✅ PCI DSS (payment):
- Không bao giờ lưu raw card number
- Tokenize qua Stripe/payment provider
- Không log card data
```

---

## 13. SLO Targets (từ 12-observability.md)

| Service | Availability Target | P99 Latency |
|---------|-------------------|-------------|
| identity-service | **99.95%** | Login P99 < 200ms |
| payment-service | **99.99%** | Checkout P99 < 2s |
| assessment-service | 99.9% | Submit P99 < 400ms |
| learning-service | 99.9% | Home P99 < 1.5s |
| srs-service | 99.5% | Review P99 < 600ms |
| speech-ai-service | 99% | Score P99 < 2.5s |
| ai-tutor-service | 99% | First token P99 < 1.5s |

> SLO tracking: implement Prometheus histogram với P99 bucket target, alert khi vượt.

---

*Document này được tạo từ `01-product-overview.md` đến `13-roadmap-and-phasing.md`.*  
*Cập nhật lần cuối: 2026-04-17*  
*Mọi thay đổi nguyên tắc phải review qua PR và cập nhật file này cùng lúc.*
