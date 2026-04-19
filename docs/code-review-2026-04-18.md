đ# OmniLingo — Code Review 11 Services (2026-04-18)

Review toàn bộ 11 services đã mark "Done" trong [service-catalog.md](service-catalog.md), đối chiếu [coding-standards.md](coding-standards.md), spec [04-microservices-breakdown.md](../04-microservices-breakdown.md), [09-security-and-compliance.md](../09-security-and-compliance.md), [12-observability-and-sre.md](../12-observability-and-sre.md).

Các claim critical về security đã được verify trực tiếp bằng grep file code (không chỉ dựa vào agent).

---

## TL;DR — Kết quả tổng

| # | Service | Lang | Compliance | Verdict |
|---|---------|------|-----------|---------|
| 1 | identity | Go | **~95%** | ✅ Production-ready |
| 2 | learning | Go | ~40% | 🔴 **CRITICAL** — JWT bypass |
| 3 | content | TS | ~75% | 🟡 Minor fixes |
| 4 | vocabulary | Go | ~70% | 🟡 JWKS incomplete |
| 5 | grammar | TS | ~65% | 🟡 Kafka missing |
| 6 | srs | Rust | ~80% | 🟡 CORS fallback, no P99 histogram |
| 7 | assessment | Go | ~45% | 🔴 **CRITICAL** — JWT broken (line 103) |
| 8 | progress | Go | ~55% | 🔴 JWT broken + no consumer |
| 9 | gamification | Go | ~50% | 🔴 JWT broken + Redis nil panic |
| 10 | billing | Go | ~40% | 🔴🔴 **CRITICAL** — no webhook sig, no outbox, no idempotency. SLO 99.99% fail |
| 11 | notification | TS | ~35% | 🔴 **CRITICAL** — JWT chỉ base64 decode, không verify |

**Chỉ identity-service đạt chuẩn production.** Các service còn lại có ít nhất 1 P0 blocker.

---

## 1. Blockers chung (ảnh hưởng nhiều service)

### 🔴 P0-1: JWT verification broken — 6 services
File và line cụ thể (đã verify):

| Service | File | Line | Triệu chứng |
|---------|------|------|-------------|
| learning | `internal/middleware/middleware.go` | 25 | `parser.ParseUnverified(tokenStr, claims)` — **không verify signature** |
| assessment | `internal/middleware/middleware.go` | 71, 103 | `ParseUnverified` + JWKS stub return `fiber.ErrUnauthorized` ngay |
| vocabulary | `internal/middleware/middleware.go` | ~103 | JWKS fetch OK nhưng không extract RSA key |
| progress | `internal/middleware/middleware.go` | 75 | `fetchJWKSPublicKey()` always returns `nil, ErrUnauthorized` |
| gamification | `internal/middleware/middleware.go` | ~75 | Inherit bug từ progress (cùng template) |
| billing | `internal/middleware/middleware.go` | ~75 | Cùng bug |
| notification | `src/main.ts` | 58–59 | `JSON.parse(Buffer.from(parts[1],'base64url'))` — chỉ decode, không verify |

**Impact:** attacker forge JWT với bất kỳ `sub` nào → giả danh user bất kỳ, truy cập data/thao tác billing.

**Expected (theo [coding-standards.md §5.1](coding-standards.md)):** giống như `identity-service` + `srs-service` đã làm — fetch JWKS từ `identity-service/.well-known/jwks.json`, cache 1h, extract RSA public key từ JWK `n`+`e`, verify với `jwt.WithValidMethods(["RS256"])`.

Fix: copy module middleware từ vocabulary (nếu đã fix RSA parsing) hoặc clone pattern của identity-service + srs.

---

### 🔴 P0-2: Billing PCI-DSS + SLO 99.99% fail

Billing là service có SLO cao nhất (99.99%) và xử lý tiền. Vi phạm nghiêm trọng:

1. **Không verify webhook signature** (`internal/handler/handler.go:112-132`) — `WebhookPaymentSuccess` nhận raw body không check `X-Signature`. Config có `WebhookSecret` nhưng chưa dùng. → Attacker POST fake webhook = cấp subscription miễn phí.
2. **Không idempotency** — same webhook replayed = double invoice + double revenue.
3. **Không transactional outbox** (vi phạm [coding-standards.md §7.3](coding-standards.md)) — publish Kafka async sau commit DB. Crash giữa commit và publish ⇒ entitlement-service không biết user đã mua. Với SLO 99.99% đây là fail cứng.
4. **Không transaction cho multi-table write** — subscription + invoice writes không atomic.

**Fix bắt buộc trước bất kỳ deployment nào:**
- Verify Stripe signature (`stripe.Webhook.ConstructEvent` equivalent) trong handler đầu tiên.
- Add unique constraint `(provider, provider_invoice_id)` trong migration mới.
- Implement outbox table + background worker publish.
- Wrap subscription + invoice writes trong `tx := db.Begin()`.

---

### 🔴 P0-3: Kafka consumer thiếu — progress + gamification

Cả 2 service define event types (`ExerciseGradedEvent`, `progress.xp.awarded`…) nhưng không có consumer loop trong main.go.

- **progress** phải subscribe `learning.lesson.completed`, `srs.review.completed`, `assessment.submission.graded`.
- **gamification** phải subscribe `progress.xp.awarded`, `progress.streak.broken`, `progress.skill.updated`.

**Impact:** feature hoàn toàn không chạy khi deploy; XP không cộng, badge không unlock.

**Fix:** thêm `internal/messaging/consumer.go` với franz-go consumer group, start trong main.go bằng goroutine với `context.Background()`.

---

### 🟠 P1-1: OpenTelemetry thiếu hầu hết service

Chỉ **identity** init OTel provider. Các folder `internal/telemetry/` của learning, vocabulary, assessment, progress, gamification, billing đều tồn tại nhưng rỗng/chỉ có file stub. Tất cả 4 Node/Rust service không có OTel.

Vi phạm [coding-standards.md §6.2](coding-standards.md): "Observability không tuỳ chọn".

**Fix:** copy `internal/telemetry/otel.go` của identity sang mỗi service, gọi `telemetry.Init(ctx, serviceName, version, OTEL_ENDPOINT)` trong main.go.

---

### 🟠 P1-2: CORS `Vary: Origin` + null-origin holes

| Service | Vấn đề |
|---------|--------|
| learning, vocabulary, assessment, progress, gamification, billing | Thiếu `Vary: Origin` header → cache poisoning nếu đứng sau CDN |
| content | `src/index.ts:40` — `if (!origin) return cb(null, '*')` — chấp nhận request không có Origin |
| grammar | Không có validation function, pass thẳng config |
| srs | `src/main.rs:149-160` — nếu `allowed.is_empty()` fallback `CorsLayer::new().allow_origin(Any)` (fail-open thay vì fail-close) |

**Fix:** theo mẫu identity: whitelist explicit, reject null/không có origin, set `Vary: Origin`.

---

### 🟠 P1-3: Audit module missing

[coding-standards.md §7.4](coding-standards.md) yêu cầu "mọi action bảo mật quan trọng phải có audit event". Chỉ identity có.

**Thiếu audit cho:**
- Billing: subscription create/cancel, payment success, refund.
- Vocabulary: deck delete, import.
- Assessment: submission, mock test.
- Progress/Gamification: XP award abnormal, streak freeze.

---

### 🟠 P1-4: Schema/DB convention gaps

| Service | Vi phạm |
|---------|---------|
| assessment | Bảng `submissions`, `test_sessions` thiếu `created_at`/`updated_at` (vi phạm [§3.3](coding-standards.md)) |
| notification | Có config `pgUrl` nhưng không có migration/schema nào |
| content, grammar | MongoDB collection không có migration chính thức (chỉ Mongoose validation) |

---

### 🟠 P1-5: Module path inconsistency

Các service Go dùng lẫn `github.com/omnilingo/<svc>-service` và `github.com/omnilingo/omnilingo/services/<svc>`. Identity dùng path thứ 2, các service khác dùng path thứ 1. Khi tạo shared lib (`pkg/middleware`, `pkg/telemetry`) sẽ bị fragment.

**Fix:** thống nhất một path, cập nhật `go.mod` tất cả service.

---

### 🟡 P2: Các gap khác

- **srs**: không có HTTP request duration histogram → không track được SLO P99 < 600ms. JWKS cache không refresh khi key rotate (once_cell không TTL).
- **gamification**: `s.redis.ZIncrBy` gọi mà không check `s.redis != nil` (set nil khi Redis fail ở startup) → panic.
- **notification**: không idempotency key trên Kafka event, không retry/DLQ, rate limit race condition (Redis `incr` TTL chỉ set lần đầu).
- **content**: lesson version bump không atomic (Mongo update không transaction).
- **learning, assessment**: thiếu Dockerfile.
- **grammar**: không có Kafka producer (không emit event khi grammar point update).

---

## 2. Chi tiết theo service

### ✅ identity-service — 95%

Đáp ứng gần như toàn bộ checklist. Service này nên làm **reference template** cho các service Go khác copy.

Gap nhỏ: HIBP test coverage, chưa implement OAuth/MFA (đã document là Phase 2 stubs).

---

### 🔴 learning-service — 40%

| Category | Status |
|----------|--------|
| JWT | ❌ `ParseUnverified` line 25 |
| OTel | ❌ folder rỗng |
| Dockerfile | ❌ thiếu |
| CORS Vary | ❌ |
| Kafka consumer | ⚠️ publisher có, consumer cho content events thiếu |
| Cấu trúc + DI + interface | ✅ |

**Top fixes:** (1) JWT verify qua JWKS, (2) OTel init, (3) Dockerfile.

---

### 🟡 content-service — 75%

| Category | Status |
|----------|--------|
| Framework Fastify | ✅ |
| JWT RS256 via JWKS | ✅ cached 1h |
| CORS | ⚠️ null-origin allow all |
| Body limit 64KB | ✅ |
| Caching TTL tiers | ✅ đúng spec (1h/30m/15m) |
| Version bump atomic | ❌ race trên publish |
| OTel | ❌ |
| Event payload eventId | ❌ missing |

**Top fixes:** (1) CORS reject null-origin, (2) thêm `event_id` vào Kafka payload, (3) lesson version bump trong Mongo transaction hoặc optimistic lock.

---

### 🟡 vocabulary-service — 70%

| Category | Status |
|----------|--------|
| JWT RS256 | ⚠️ fetch JWKS OK nhưng RSA parsing stub |
| CORS Vary | ✅ |
| Body limit | ✅ |
| Audit | ❌ thiếu module |
| OTel | ❌ |
| Kafka events | ✅ `vocabulary.card.*` đúng |
| Dockerfile | ✅ multi-stage Alpine |

**Top fixes:** (1) hoàn thiện JWKS RSA extraction (parse `n`, `e` → `rsa.PublicKey`), (2) add audit module, (3) add OTel.

---

### 🟡 grammar-service — 65%

| Category | Status |
|----------|--------|
| Framework | ✅ Fastify + Zod |
| JWT RS256 via JWKS | ✅ |
| Role check | ✅ content_editor/admin |
| Kafka producer | ❌ không publish `grammar.point.*` |
| Request duration histogram | ❌ chỉ có counter |
| readyz MongoDB | ⚠️ chỉ check `readyState` không ping query |
| Startup logging | ⚠️ dùng `console.log` thay pino |

**Top fixes:** (1) Kafka producer cho grammar events, (2) thêm histogram latency, (3) thay `console.log` bằng pino.

---

### 🟡 srs-service — 80%

FSRS v5 math **đúng** (19 weights, retrievability formula `R(t,S) = (1 + F*t/S)^-0.5` với F=19/81). Test coverage state transitions ổn nhưng thiếu property-based test và edge cases (elapsed_days cực lớn, stability=0).

| Category | Status |
|----------|--------|
| Framework Axum | ✅ |
| JWT RS256 | ✅ verify đầy đủ |
| JWKS cache | ⚠️ `OnceCell<Arc<RwLock>>` không refresh → key rotation fail |
| CORS | ⚠️ fallback `AllowOrigin::Any` khi empty list |
| Body limit 64KB | ❌ Axum default unbounded |
| Request duration histogram | ❌ không track P99 600ms |
| Ownership check | ✅ tất cả query filter user_id |
| Kafka consumer | ✅ subscribe `vocabulary.card.added` + `ON CONFLICT DO NOTHING` |
| Transaction schedule + review | ❌ không wrap |

**Top fixes:** (1) CORS fail-close khi empty list, (2) add `RequestBodyLimitLayer`, (3) add request duration histogram với bucket 600ms, (4) wrap upsert + review insert trong transaction.

---

### 🔴 assessment-service — 45%

| Category | Status |
|----------|--------|
| JWT JWKS | ❌ line 103 `return nil, fiber.ErrUnauthorized // simplified` — auth FAIL mọi request có token đúng |
| Schema timestamps | ❌ thiếu created_at/updated_at |
| CORS Vary | ❌ |
| OTel | ❌ |
| Audit | ❌ |
| Dockerfile | ❌ |

**Top fixes:** (1) hoàn thiện JWKS, (2) fix schema, (3) add OTel + Dockerfile.

---

### 🔴 progress-service — 55%

| Category | Status |
|----------|--------|
| JWT JWKS | ❌ line 75 `fetchJWKSPublicKey` return nil |
| Transactions | ❌ score upsert + history insert không atomic |
| Kafka consumer | ❌ event types defined nhưng không subscribe |
| Audit | ❌ |
| OTel | ❌ |
| EMA skill score | ✅ math đúng |

**Top fixes:** (1) JWT, (2) consumer loop, (3) transaction cho score+history.

---

### 🔴 gamification-service — 50%

| Category | Status |
|----------|--------|
| JWT JWKS | ❌ inherited bug |
| Redis nil panic | ❌ `s.redis.ZIncrBy` line ~170 không guard |
| `internal/messaging/` | ❌ folder trống, không có publisher |
| Kafka consumer | ❌ không subscribe `progress.xp.*` |
| Leaderboard ZSET | ✅ thuật toán ổn |
| Audit | ❌ |

**Top fixes:** (1) JWT, (2) guard nil Redis, (3) Kafka consumer cho progress events, (4) implement messaging publisher.

---

### 🔴🔴 billing-service — 40% (highest risk)

| Category | Status |
|----------|--------|
| JWT | ❌ broken |
| Webhook signature verify | ❌ **handler.go:112-132 nhận body không verify** |
| Idempotency invoice | ❌ cùng `provider_invoice_id` có thể tạo nhiều invoice |
| Transactional outbox | ❌ publish Kafka async sau commit → event loss on crash |
| Multi-table transaction | ❌ sub + invoice không atomic |
| CORS ExposeHeaders | ❌ |
| PCI-DSS raw card | ✅ không lưu (tokenize qua provider) |
| Audit events | ❌ |
| SLO 99.99% | ❌ fail trên mọi tiêu chí reliability |

**Top fixes BẮT BUỘC trước production:** (1) verify webhook signature với `WebhookSecret`, (2) unique constraint `(provider, provider_invoice_id)` + check trước khi create invoice, (3) outbox pattern (bảng `outbox_events` + worker publish + mark sent), (4) wrap DB writes trong transaction, (5) JWT.

---

### 🔴 notification-service — 35%

| Category | Status |
|----------|--------|
| JWT verify | ❌ **src/main.ts:58-59 chỉ base64 decode payload** |
| Body limit | ❌ Fastify default unbounded |
| PostgreSQL schema | ❌ config có pgUrl nhưng không migration |
| Idempotency Kafka | ❌ không dedupe `event_id` |
| Retry/DLQ | ❌ fire-and-forget |
| Rate limit race | ⚠️ Redis `incr` TTL chỉ set lần đầu |
| OTel | ❌ |
| Kafka consumer | ✅ subscribe 6 topics |
| Multi-channel (email/push/in-app) | ✅ |

**Top fixes:** (1) thêm JWKS verify giống content, (2) migration cho PostgreSQL (nếu thực sự cần DB; nếu không thì bỏ pgUrl), (3) idempotency store (Redis SET `notif:event:<event_id>` TTL 24h), (4) retry với backoff + DLQ topic `notification.dlq`, (5) body limit.

---

## 3. Ưu tiên fix

### Đợt 1 — hôm nay (P0, an ninh)
1. Fix JWT verification cho 6 service (learning, vocabulary hoàn chỉnh RSA, assessment, progress, gamification, billing, notification). → Copy middleware của identity/srs.
2. Billing: webhook signature verification + invoice idempotency.
3. Billing: transactional outbox pattern.

### Đợt 2 — tuần này (P1)
4. Add OTel cho 10 service còn lại.
5. Kafka consumer cho progress + gamification.
6. CORS `Vary: Origin` + reject null-origin ở tất cả service.
7. Assessment fix schema (thêm timestamps).
8. Notification: PostgreSQL schema hoặc xoá pgUrl; idempotency; retry+DLQ.
9. Thống nhất module path Go.

### Đợt 3 — sprint sau (P2)
10. Audit module cho billing, vocabulary, assessment, progress, gamification.
11. SRS: histogram latency + CORS fail-close + body limit + JWKS refresh.
12. Content: lesson version atomic.
13. Grammar: Kafka producer + latency histogram + pino.
14. Dockerfile cho learning + assessment.
15. Transaction cho multi-table writes (progress, billing, assessment).

---

## 4. Kết luận

Project có **kiến trúc thiết kế rất tốt** (docs 01–13 + coding-standards), **identity-service thực thi gương mẫu**, nhưng **10/11 service còn lại bị rút ngắn ở lớp security/observability**. Pattern lặp lại: template middleware được copy với phần verify JWT bị stub "// simplified — full JWKS parsing in production" rồi quên fix.

**Khuyến nghị:**
- Tách `pkg/middleware` dùng chung (JWKS verify, CORS, Prometheus, OTel) → mọi service import thay vì tự implement.
- CI bắt buộc: grep `ParseUnverified`, `// simplified`, `// TODO` trong `internal/middleware/` → fail build.
- Integration test cho JWT verify phải là **phải reject token với chữ ký sai**, không chỉ test happy path.
- Billing cần review riêng từ security + finance trước khi production.

Identity đã là template tốt — clone security/observability layer của identity sang 6 service Go còn lại sẽ fix ~60% vấn đề chỉ trong vài giờ.
