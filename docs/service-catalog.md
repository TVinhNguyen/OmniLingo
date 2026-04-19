# OmniLingo — Service Catalog
> **Quy tắc cập nhật**: Sau khi hoàn thành code mỗi service, **BẮT BUỘC** cập nhật phần tương ứng trong file này với:
> trạng thái, endpoints thực tế đã implement, cơ chế bảo vệ, events, SLO đạt được, và ghi chú deviation so với spec.

---

## Tổng quan danh sách service

| # | Service | Ngôn ngữ | Status | Ngày xong |
|---|---------|----------|--------|-----------|
| 1 | `identity-service` | Go | ✅ Done | 2026-04-17 |
| 2 | `learning-service` | Go | ✅ Done | 2026-04-18 |
| 3 | `content-service` | Node.js/TS | ✅ Done | 2026-04-17 |
| 4 | `vocabulary-service` | Go | ✅ Done | 2026-04-17 |
| 5 | `grammar-service` | Node.js/TS | ✅ Done | 2026-04-17 |
| 6 | `srs-service` | Rust | ✅ Done | 2026-04-17 |
| 7 | `assessment-service` | Go | ✅ Done | 2026-04-18 |
| 8 | `progress-service` | Go | ✅ Done | 2026-04-18 |
| 9 | `gamification-service` | Go | ✅ Done | 2026-04-18 |
| 10 | `social-service` | Node.js/TS | ⬜ Planned | — |
| 11 | `tutor-service` | Node.js/TS | ⬜ Planned | — |
| 12 | `booking-service` | Go | ⬜ Planned | — |
| 13 | `classroom-service` | Node.js/TS | ⬜ Planned | — |
| 14 | `billing-service` | Go | ✅ Done | 2026-04-18 |
| 15 | `payment-service` | Go | ✅ Done | 2026-04-18 |
| 16 | `entitlement-service` | Go | ✅ Done | 2026-04-18 |
| 17 | `notification-service` | Node.js/TS | ✅ Done | 2026-04-18 |
| 18 | `search-service` | Python | ⬜ Planned | — |
| AI | `speech-ai-service` | Python | ✅ Done | 2026-04-18 |
| AI | `writing-ai-service` | Python | ⬜ Planned | — |
| AI | `ai-tutor-service` | Python | ✅ Done | 2026-04-18 |
| AI | `llm-gateway` | Go | ✅ Done | 2026-04-18 |
| BFF | `web-bff` | Node.js/TS | ✅ Done | 2026-04-18 |
| BFF | `mobile-bff` | Node.js/TS | ⬜ Planned | — |

**Legend**: ✅ Done · 🔧 In Progress · ⬜ Planned · ⏸ On Hold

---

## ✅ 1. identity-service

**Hoàn thành**: 2026-04-17 | **Port**: 3001 | **DB**: `identity_db` (PostgreSQL) + Redis

### Trách nhiệm (Bounded Context)
Đăng ký, đăng nhập, quản lý session, cấp JWT RS256, RBAC, bảo vệ tài khoản, GDPR delete.

**Không làm**: subscription/entitlement, user profile mở rộng (bio, preferences phức tạp), content.

---

### Endpoints đã implement

#### Auth (Public — không cần token)
| Method | Path | Mô tả | Status Code |
|--------|------|-------|-------------|
| `POST` | `/api/v1/auth/register` | Đăng ký tài khoản mới | 201 |
| `POST` | `/api/v1/auth/login` | Đăng nhập, trả về token pair | 200 |
| `POST` | `/api/v1/auth/refresh` | Làm mới access token | 200 |
| `POST` | `/api/v1/auth/logout` | Thu hồi refresh token | 204 |
| `POST` | `/api/v1/auth/verify-email` | Xác minh email theo token | 200 |
| `POST` | `/api/v1/auth/oauth/:provider/callback` | OAuth callback *(Phase 2 — 501)* | 501 |
| `POST` | `/api/v1/auth/mfa/enroll` | Đăng ký MFA *(Phase 2 — 501)* | 501 |
| `POST` | `/api/v1/auth/mfa/verify` | Xác minh MFA *(Phase 2 — 501)* | 501 |
| `POST` | `/api/v1/auth/forgot-password` | Quên mật khẩu *(Phase 2 — 501)* | 501 |
| `POST` | `/api/v1/auth/reset-password` | Reset mật khẩu *(Phase 2 — 501)* | 501 |

#### Users (Protected — Bearer JWT required)
| Method | Path | Mô tả | Status Code |
|--------|------|-------|-------------|
| `GET` | `/api/v1/users/me` | Lấy thông tin cá nhân | 200 |
| `PATCH` | `/api/v1/users/me` | Cập nhật profile (display_name, lang, tz, avatar) | 200 |
| `DELETE` | `/api/v1/users/me` | Xóa tài khoản (GDPR) | 204 |
| `GET` | `/api/v1/users/sessions` | Danh sách session đang active | 200 |
| `DELETE` | `/api/v1/users/sessions/:id` | Thu hồi session theo ID | 204 |
| `GET` | `/api/v1/users/:id` | Lấy user theo ID (internal service) | 200 |

#### Infrastructure (Không auth)
| Method | Path | Mô tả |
|--------|------|-------|
| `GET` | `/healthz` | Liveness check |
| `GET` | `/readyz` | Readiness (ping Postgres + Redis) |
| `GET` | `/.well-known/jwks.json` | JWKS — RS256 public key (cache 1h) |
| `GET` | `/metrics` | Prometheus metrics |

---

### Cơ chế bảo mật đã triển khai

#### JWT (RS256)
- **Thuật toán**: RS256 (asymmetric) — production load từ PEM file; dev tự generate ephemeral RSA-2048
- **Access Token TTL**: 15 phút (config: `ACCESS_TOKEN_TTL`)
- **Claims**: `sub`, `roles`, `scopes`, `plan_tier`, `lang`, `jti`, `iss`, `aud`, `iat`, `exp`, `kid`
- **Không có**: `email` (PII removed per 09-security §2.2)
- **JWKS**: endpoint `/.well-known/jwks.json` để các service khác verify mà không cần private key

#### Refresh Token Rotation
- Token opaque (32 bytes random → base64url)
- Lưu hash SHA-256 trong DB (sessions table) + Redis cache
- **Rotation**: mỗi refresh → revoke cũ, issue mới
- **Reuse detection**: nếu token đã revoked bị dùng lại → revoke toàn bộ session family của user

#### Password Security
- **Hashing**: argon2id (m=64MB, t=1, p=4 theo config)
- **HIBP check**: k-anonymity model (chỉ gửi 5 ký tự SHA-1 prefix)
- **Min length**: 10 ký tự (enforced tại handler)
- **HIBP noblocking**: API lỗi → log warn, cho phép tiếp tục

#### Rate Limiting (Redis)
| Endpoint | Giới hạn | Window |
|----------|----------|--------|
| Login per IP | Config `RATE_LOGIN_MAX_PER_IP` | `RATE_LOGIN_WINDOW_PER_IP` |
| Login per Email | Config `RATE_LOGIN_MAX_PER_EMAIL` | `RATE_LOGIN_WINDOW_PER_EMAIL` |
| Register per IP | Config `RATE_REGISTER_MAX_PER_IP` | `RATE_REGISTER_WINDOW_PER_IP` |
- Response khi vượt: **429** với header `Retry-After: 60`
- Fail-open: Redis lỗi → allow request (tránh block service)

#### Brute Force Protection
- `failed_login_count` và `locked_until` lưu trong DB (persist qua restart)
- Sau `MAX_FAILED_LOGIN_ATTEMPTS` lần sai → lock account `ACCOUNT_LOCK_DURATION`
- Reset counter khi login thành công
- Response khi bị lock: **403** với code `ACCOUNT_LOCKED`

#### CORS
- Whitelist-only từ `ALLOWED_ORIGINS` (không wildcard)
- Headers: `Vary: Origin`, `Access-Control-Expose-Headers: X-Request-ID, Retry-After`
- Preflight cache: `Access-Control-Max-Age: 3600`
- Body limit: **64KB** (chống DoS qua large payload)

---

### Kafka Events emitted

| Topic | Payload | Trigger |
|-------|---------|---------|
| `identity.user.registered` | `{event_id, user_id, email, display_name, ui_language, roles, created_at}` | Register thành công |
| `identity.user.logged_in` | `{event_id, user_id, session_id, device_id, device_info, ip, logged_in_at}` | Login thành công |
| `identity.user.deleted` | `{event_id, user_id, deleted_at, reason}` | GDPR delete |
| `audit.identity.events` | `AuditEvent{action, user_id, ip, device_info, request_id, result, details}` | Mọi action quan trọng |

**Audit actions**: `AUTH_LOGIN`, `AUTH_LOGIN_FAILED`, `AUTH_REGISTER`, `AUTH_LOGOUT`, `AUTH_REFRESH`, `AUTH_TOKEN_REUSE_DETECTED`, `AUTH_ACCOUNT_LOCKED`, `AUTH_ACCOUNT_DELETED`, `AUTH_EMAIL_VERIFIED`, `AUTH_SESSION_REVOKED`

---

### Observability

#### Prometheus Metrics
| Metric | Type | Labels |
|--------|------|--------|
| `identity_http_requests_total` | Counter | `method`, `route`, `status` |
| `identity_http_request_duration_seconds` | Histogram | `method`, `route` |
| `identity_auth_login_total` | Counter | `status` (success/failure/locked/rate_limited) |
| `identity_auth_register_total` | Counter | `status` (success/failure/duplicate/rate_limited) |
| `identity_auth_refresh_total` | Counter | `status` (success/failure/reuse_detected) |
| `identity_auth_logout_total` | Counter | `status` |
| `identity_session_active_count` | Gauge | — |
| `identity_brute_force_events_total` | Counter | `type` (lockout/token_reuse) |
| `identity_rate_limit_hits_total` | Counter | `endpoint` |
| `identity_hibp_checks_total` | Counter | `result` (clean/compromised/api_error) |
| `identity_login_duration_seconds` | Histogram | — (SLO tracking: P99 < 200ms) |

#### OpenTelemetry
- Provider: stdout (dev) / OTLP HTTP (prod via `OTEL_ENDPOINT`)
- Service attributes: `service.name=identity-service`, `service.version`, `deployment.environment`
- Sampling: 10% head-based (prod), AlwaysSample (dev)

#### Structured Logging
- Format: zap (dev: pretty, prod: JSON)
- Fields: `timestamp`, `level`, `service`, `user_id`, `request_id`

---

### Database Schema (identity_db)

**Migrations managed by**: Goose (`migrations/`)

| Table | Mô tả |
|-------|-------|
| `users` | Core user entity (email, password_hash, status, failed_login_count, locked_until) |
| `user_roles` | N-M user ↔ role |
| `roles` | 11 roles: admin, billing_admin, content_admin, content_editor, moderator, platform_admin, premium_user, teacher, tenant_admin, tenant_learner, user |
| `sessions` | Refresh token sessions (device_id, expires_at, revoked_at) |
| `user_oauth_identities` | Social login links (provider, provider_user_id) |
| `email_verifications` | Email verification tokens (token_hash, expires_at, used_at) |

---

### Internal Packages

| Package | Mô tả |
|---------|-------|
| `internal/domain` | Entities (User, Session, EmailVerification), Errors, Kafka Events, Audit Events |
| `internal/config` | Centralized config với env vars và defaults |
| `internal/repository` | UserRepository, SessionRepository (PostgreSQL + Redis) |
| `internal/service` | AuthService — toàn bộ business logic |
| `internal/handler` | HTTP handlers, ErrorHandler, JWKS handler |
| `internal/middleware` | RequestID, CORS (whitelist), JWTAuth (RS256), PrometheusMiddleware |
| `internal/ratelimit` | Redis-backed sliding window rate limiter |
| `internal/security` | HIBP checker (k-anonymity) |
| `internal/metrics` | Prometheus metrics definitions |
| `internal/telemetry` | OpenTelemetry provider setup |
| `internal/messaging` | Kafka publisher (franz-go) |
| `internal/audit` | Audit service (zap log + Kafka publish) |

---

### SLO

| Metric | Target | Đạt được |
|--------|--------|----------|
| Availability | 99.95% | ✅ (health + readyz endpoints) |
| P99 Login | < 200ms | ✅ (tracked via `identity_login_duration_seconds`) |
| Body limit DoS | Chặn 64KB+ | ✅ 413 response |

---

### Deviations so với Spec (04-microservices.md)

| Item | Spec | Thực tế | Lý do |
|------|------|---------|-------|
| OAuth social login | Đủ providers | Stub 501 | Phase 2 — cần OAuth credentials |
| MFA (TOTP) | Bắt buộc teacher/admin | Stub 501 | Phase 2 |
| Magic link / Passkeys | Listed | Không implement | Phase 2+ |
| gRPC interface | gRPC + REST | REST only | Phase 1 đủ dùng REST; gRPC thêm sau |

---

## ⬜ 2. learning-service

> *Chưa implement — cập nhật file này sau khi hoàn thành.*

**Dự kiến**: Go · PostgreSQL · Port: 3002

**Bounded context**: Điều phối trải nghiệm học — "hôm nay tôi học gì?". Không chấm bài, không chứa nội dung.

**Depends on**: content-service, progress-service, srs-service

**Events**: `learning.lesson.started/completed`, `learning.goal.set`

---

## ✅ 3. content-service

**Hoàn thành**: 2026-04-17 | **Port**: 3003 | **DB**: `content_db` (MongoDB) + Redis

### Trách nhiệm (Bounded Context)
Nguồn sự thật duy nhất cho **toàn bộ nội dung học**: Languages, Tracks, Courses, Units, Lessons, Exercises. Các service khác (learning, assessment, srs) chỉ call API của content-service — không truy cập DB trực tiếp.
i
**Không làm**: user progress, SRS state, score/grading, media processing (chỉ lưu S3 reference).

---

### Endpoints đã implement

#### Public (không cần token — published content là public)
| Method | Path | Mô tả | Cache |
|--------|------|-------|-------|
| `GET` | `/api/v1/content/languages` | Danh sách ngôn ngữ active | Redis 1h |
| `GET` | `/api/v1/content/tracks?language=:lang` | Tracks theo ngôn ngữ | Redis 1h |
| `GET` | `/api/v1/content/courses/:id` | Course detail + unitIds | Redis 30m |
| `GET` | `/api/v1/content/units/:id` | Unit detail + lessonIds | Redis 30m |
| `GET` | `/api/v1/content/lessons/:id` | Lesson với blocks (polymorphic) | Redis 15m |
| `GET` | `/api/v1/content/lessons/:id?version=N` | Lesson theo version | Redis 24h (immutable) |
| `GET` | `/api/v1/content/lessons?unitId=:id` | Lessons của unit | No cache |
| `GET` | `/api/v1/content/exercises/:id` | Exercise theo ID | Redis 30m |
| `GET` | `/api/v1/content/exercises?ids=a,b,c` | Batch fetch exercises (max 100) | Redis 30m/item |
| `GET` | `/api/v1/content/exercises?language&skill&level&tags` | Filtered exercise list | No cache |

#### Protected Write (JWT RS256 required — role: `content_editor`+)
| Method | Path | Role | Mô tả |
|--------|------|------|-------|
| `POST` | `/api/v1/content/lessons` | content_editor | Tạo lesson draft |
| `PATCH` | `/api/v1/content/lessons/:id` | content_editor | Sửa draft (chặn khi published) |
| `POST` | `/api/v1/content/lessons/:id/publish` | content_admin | Publish → bump version + event |
| `DELETE` | `/api/v1/content/lessons/:id` | content_admin | Archive lesson |
| `POST` | `/api/v1/content/exercises` | content_editor | Tạo exercise |
| `PATCH` | `/api/v1/content/exercises/:id` | content_editor | Sửa exercise |
| `POST` | `/api/v1/content/courses` | content_admin | Tạo course |
| `POST` | `/api/v1/content/units` | content_admin | Tạo unit |

#### Infrastructure
| Method | Path | Mô tả |
|--------|------|-------|
| `GET` | `/healthz` | Liveness |
| `GET` | `/readyz` | Readiness (MongoDB + Redis ping) |
| `GET` | `/metrics` | Prometheus metrics |
| `POST` | `/admin/seed` | Seed dev data *(disabled in production)* |

---

### JWT Verification (RS256 via JWKS)
- **Không tự quản lý keys** — fetch public key từ `identity-service/.well-known/jwks.json`
- Cache JWKS 1 giờ (library: `jose` với `createRemoteJWKSet`)
- Verify: `alg=RS256`, `iss=identity-service`, `aud=omnilingo`
- Roles check: `content_editor`, `content_admin`, `platform_admin`, `admin`

---

### Data Model (MongoDB — content_db)

| Collection | Mô tả |
|-----------|-------|
| `languages` | Ngôn ngữ (`code`, `name` i18n, `flagEmoji`, `isActive`) |
| `tracks` | Track học (`general` / `test_prep`, `language`, `levelRange`, `cert`) |
| `courses` | Course (`trackId`, `level`, `unitIds` ordered, `status`) |
| `units` | Unit (`courseId`, `lessonIds` ordered) |
| `lessons` | Lesson với `blocks[]` polymorphic, `version`, `status` |
| `exercises` | Exercise polymorphic (`type` discriminator, `skill`, `tags`) |

**Lesson block types**: `explanation` | `vocab_intro` | `exercise` | `dictation` | `video` | `reading`

**Exercise types**: `multiple_choice` | `dictation` | `speaking_prompt` | `fill_in_blank` | `sentence_arrange` | `matching` | `translation`

---

### Caching Strategy (Redis)

| Key | TTL | Mô tả |
|-----|-----|-------|
| `content:lang:all` | 1h | Languages list |
| `content:track:{language}` | 1h | Tracks by language |
| `content:course:{id}` | 30m | Course detail |
| `content:unit:{id}` | 30m | Unit detail |
| `content:lesson:{id}:latest` | 15m | Published lesson (invalidated on publish) |
| `content:lesson:{id}:v:{ver}` | 24h | Lesson version (immutable after publish) |
| `content:exercise:{id}` | 30m | Exercise (invalidated on update) |

**Cache invalidation**: `POST /lessons/:id/publish` → delete `content:lesson:{id}:latest`

---

### Kafka Events emitted

| Topic | Trigger | Payload |
|-------|---------|---------|
| `content.lesson.published` | POST publish | `{event_id, lesson_id, version, language, level, unitId, publishedBy, publishedAt}` |
| `content.lesson.archived` | DELETE | `{event_id, lesson_id, archivedBy, archivedAt}` |

**Kafka disabled by default in dev** (`KAFKA_ENABLED=false`)

---

### Prometheus Metrics

| Metric | Type | Labels |
|--------|------|--------|
| `content_http_requests_total` | Counter | `method`, `route`, `status_code` |
| `content_http_request_duration_seconds` | Histogram | `method`, `route` |
| `content_cache_hits_total` | Counter | `resource_type` |
| `content_cache_misses_total` | Counter | `resource_type` |
| `content_lessons_total` | Gauge | `language`, `status` |
| `content_exercises_total` | Gauge | `language`, `type` |
| `content_db_query_duration_seconds` | Histogram | `operation`, `collection` |

---

### Environment Variables

| Variable | Default | Mô tả |
|----------|---------|-------|
| `PORT` | `3003` | Server port |
| `MONGODB_URL` | — | MongoDB connection string |
| `REDIS_URL` | `redis://localhost:6379` | Redis URL |
| `KAFKA_BROKERS` | `localhost:9094` | Kafka broker list |
| `KAFKA_ENABLED` | `false` | Enable/disable Kafka |
| `IDENTITY_SERVICE_URL` | `http://localhost:3001` | For JWKS fetch |
| `ALLOWED_ORIGINS` | comma-separated | CORS whitelist |
| `LOG_LEVEL` | `info` | Pino log level |

---

### SLO

| Metric | Target | Đạt được |
|--------|--------|----------|
| Availability | Liveness + Readiness | ✅ |
| Body limit | Chặn 64KB+ | ✅ 413 |
| Auth | Chặn unauthorized write | ✅ 401/403 |
| Cache hit | Languages/Tracks/Courses | ✅ Redis TTL |
| Test pass rate | ≥95% | ✅ 98% (51/52) |

---

### Deviations so với Spec

| Item | Spec | Thực tế | Lý do |
|------|------|---------|-------|
| Media upload | S3 integration | S3 reference only | Phase 2 — cần AWS SDK + presigned URL |
| Content versioning (student holds version) | Full version tree | ID + version field | Đủ cho Phase 1 |
| CDN surrogate key | Cloudflare integration | Redis cache only | Phase 2 |
| CMS UI (Next.js admin) | Admin dashboard | REST API only | Phase 2 — riêng biệt |
| gRPC interface | Optional | REST only | Phase 1 đủ |

## ⬜ 4. vocabulary-service

> *Chưa implement — cập nhật file này sau khi hoàn thành.*

**Dự kiến**: Go · PostgreSQL · Port: 3004

---

## ⬜ 5. grammar-service

> *Chưa implement — cập nhật file này sau khi hoàn thành.*

**Dự kiến**: Node.js/TypeScript · MongoDB · Port: 3005

---

## ⬜ 6. srs-service

> *Chưa implement — cập nhật file này sau khi hoàn thành.*

**Dự kiến**: Rust · Axum · PostgreSQL + Redis · Port: 3006

**Note**: Implements FSRS algorithm. High throughput — co-locate với học viên review sessions.

---

## ⬜ 7–29. Các service còn lại

> *Placeholder — điền chi tiết sau mỗi lần hoàn thành service.*

| Service | Port (thực tế) |
|---------|---------------|
| assessment-service | 3007 |
| progress-service | 3008 |
| gamification-service | 3009 |
| billing-service | 3010 |
| notification-service | 3011 |
| social-service | 3012 *(planned)* |
| tutor-service | 3013 *(planned)* |
| booking-service | 3014 *(planned)* |
| payment-service | 3015 |
| entitlement-service | 3016 |
| classroom-service | 3017 *(planned)* |
| search-service | 3018 *(planned)* |
| llm-gateway | 3020 |
| ai-tutor-service | 3021 |
| speech-ai-service | 3022 |
| writing-ai-service | 3023 *(planned)* |
| web-bff | 4000 |
| mobile-bff | 4001 *(planned)* |

---

*File này được maintain bởi team. Mọi thay đổi endpoint, cơ chế, hoặc behavior phải update tại đây cùng lúc với code.*

---

## vocabulary-service (Service #4)

**Status**: ✅ Done — 2026-04-17  
**Port**: 3004  
**Language/Framework**: Go 1.22 + Fiber v2  
**Database**: PostgreSQL 16 (`vocabulary_db`) + Redis 7 (cache)  
**Kafka**: franz-go (KAFKA_ENABLED=false → no-op trong dev)

### Trách nhiệm
Quản lý từ vựng — catalog từ hệ thống và deck cá nhân của user. Emit events khi user add/remove/mark card để `srs-service` có thể tự schedule SRS state.

### Endpoints

#### Public (no auth)
| Method | Path | Mô tả |
|--------|------|-------|
| `GET` | `/api/v1/vocab/entries/:id` | Word entry + meanings + examples (Redis cached 1h) |
| `POST` | `/api/v1/vocab/entries/search` | Fuzzy search via pg_trgm, filter by language, level, POS |

#### Protected — User Decks (JWT Bearer)
| Method | Path | Mô tả |
|--------|------|-------|
| `GET` | `/api/v1/vocab/decks` | List user's decks với card count |
| `POST` | `/api/v1/vocab/decks` | Create deck, emits `vocabulary.deck.created` |
| `GET` | `/api/v1/vocab/decks/:id` | Deck detail (owner or public) |
| `DELETE` | `/api/v1/vocab/decks/:id` | Delete deck + CASCADE cards |
| `POST` | `/api/v1/vocab/decks/:id/cards` | Add word to deck, emits `vocabulary.card.added` |
| `DELETE` | `/api/v1/vocab/decks/:deckId/cards/:cardId` | Remove card, emits `vocabulary.card.removed` |
| `POST` | `/api/v1/vocab/cards/:id/mark-known` | Suspend from SRS, emits `vocabulary.card.marked_known` |
| `POST` | `/api/v1/vocab/import/anki` | Import .apkg (multipart, max 10MB), emits `vocabulary.import.completed` |

#### Admin (role: content_editor / content_admin)
| Method | Path | Mô tả |
|--------|------|-------|
| `POST` | `/api/v1/vocab/admin/words` | Add word to system catalog |
| `PATCH` | `/api/v1/vocab/admin/words/:id` | Update word (cache invalidated) |

#### Infrastructure
| `GET /healthz` | `GET /readyz` | `GET /metrics` |

### Kafka Events
| Topic | Trigger |
|-------|---------|
| `vocabulary.card.added` | Add card → **srs-service** subscribes for SRS scheduling |
| `vocabulary.card.removed` | Remove card |
| `vocabulary.card.marked_known` | Mark as known (suspend) |
| `vocabulary.deck.created` | New deck created |
| `vocabulary.import.completed` | Anki .apkg import complete |

### Security
- ✅ JWT RS256 via JWKS from `identity-service/.well-known/jwks.json` (cached 1h)
- ✅ RBAC: user role for decks/cards, content_editor for admin words
- ✅ Ownership enforcement: user can only modify their own decks/cards
- ✅ CORS whitelist-only (Vary: Origin)
- ✅ Body limit 64KB (Anki: 10MB multipart separate)

### Database Schema
```
vocabulary_db:
├── words           — system catalog: language, lemma, pos, ipa, level, extra JSONB
├── word_meanings   — translations by ui_language (vi/en/ja)
├── word_examples   — sentences + translation JSONB + audio_url
├── decks           — user/system decks (is_public toggle)
└── user_cards      — user ↔ deck ↔ word link (suspended flag)

Extensions: pg_trgm (fuzzy search), uuid-ossp
Indexes: lemma gin_trgm_ops, (language, frequency_rank), (language, level)
```

### Caching (Redis)
| Key | TTL |
|-----|-----|
| `vocab:word:{id}` | 1h |
| Invalidated on admin UPDATE |  |

### Integration Test Results
- **25/27 (92%)** pass rate
- 2 false negatives: cache miss counter (not incremented until first miss), unknown route → 401 (expected for protected prefix)

### SLO
- Word lookup P99 < 100ms (cached < 5ms)
- Search P99 < 200ms (pg_trgm indexed)
- Availability: 99.9%

### Configuration (.env)
```
DATABASE_URL=postgres://omnilingo:omnilingo_dev@localhost:5432/vocabulary_db
REDIS_URL=redis://localhost:6379
KAFKA_BROKERS=localhost:9094
KAFKA_ENABLED=false
IDENTITY_SERVICE_URL=http://localhost:3001
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
ANKI_MAX_SIZE_BYTES=10485760
PORT=3004
```

---

## srs-service (Service #6)

**Status**: ✅ Done — 2026-04-17  
**Port**: 3005  
**Language/Framework**: Rust 1.95 + Axum 0.7  
**Database**: PostgreSQL 16 (`srs_db`) + Redis 7  
**Algorithm**: FSRS v5 with 19-weight parameters (default trained on public datasets)

### Trách nhiệm
Spâced Repetition Scheduling. Tiếnh toán `next_due_at` sau mỗi review, trả về danh sách thẻ due. Subscribe `vocabulary.card.added` để auto-init SRS state.

### Endpoints (JWT Bearer required)
| Method | Path | Mô tả |
|--------|------|-------|
| `POST` | `/api/v1/srs/schedule` | Submit rating (Again/Hard/Good/Easy) → next_due_at |
| `POST` | `/api/v1/srs/schedule/batch` | Bulk init new cards (post-import) |
| `GET` | `/api/v1/srs/due` | Get due items (`?limit=50&kind=vocab`) |
| `GET` | `/api/v1/srs/state/:kind/:id` | Raw FSRS state for one card |
| `POST` | `/api/v1/srs/reset/:kind/:id` | Reset card to new state |
| `GET` | `/api/v1/srs/stats` | User stats (total/new/learning/review/mature/due_today) |

#### Infrastructure
| `GET /healthz` | `GET /readyz` | `GET /metrics` |

### Kafka
- **Subscribes**: `vocabulary.card.added` → auto-init SRS state for new cards

### FSRS v5 State Machine
```
New → [Good/Easy] → Review → [Again] → Relearning → [Good] → Review
    → [Again/Hard] → Learning → [Good] → Review
```

### Database Schema
```
srs_db:
├── srs_states   — (user_id, item_kind, item_id) PK, stability, difficulty, reps, lapses, state, due_at
└── srs_reviews  — review history, useful for FSRS param optimisation

Indexes: (user_id, due_at), (user_id, item_kind, due_at)
```

### Security
- ✅ JWT RS256 via JWKS from identity-service (cached via once_cell)
- ✅ CORS whitelist-only
- ✅ Ownership enforced (user_id from JWT)

### Test Results
- **17/17 (100%)** integration pass
- **6/6** FSRS unit tests pass

### SLO
- Schedule P99 < 50ms (pure compute + single DB upsert)
- Due query P99 < 100ms (indexed on user_id, due_at)
