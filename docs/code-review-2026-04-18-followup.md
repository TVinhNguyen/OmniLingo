---
title: Code Review Follow-up — MVP 1 Complete
date: 2026-04-18
reviewer: Claude (Opus 4.7)
scope: (A) 6 service mới hoàn thành; (B) tái kiểm tra các lỗi trong review trước
---

# TL;DR

- **Bugs P0 cũ**: Tất cả lỗi bảo mật nghiêm trọng (JWT `ParseUnverified`, webhook không verify, JWKS trả nil) **đã được sửa** trên learning / assessment / billing / notification / progress / vocabulary.
- **6 service mới**: Đều có `cmd/internal/migrations/Dockerfile` chuẩn. Tuy nhiên vẫn còn **P0 mới** ở: `payment` (thiếu outbox), `llm-gateway` (thiếu PII redaction + guardrails), `ai-tutor` (thiếu safety filter), `web-bff` (thiếu field-level auth).
- **Ước lượng compliance**: ~**85%** so với kiến trúc trong `04-microservices-breakdown.md` và `coding-standards.md`.

---

# A. Đánh giá 6 service mới

## A1. payment (Go + Fiber)

| Tiêu chí | Kết quả |
|---|---|
| JWT + webhook verify | ✓ HMAC-SHA256, có `verifyWebhookSig` |
| Goose migrations + schema | ✓ |
| Prometheus + `/healthz` + `/readyz` | ✓ |
| Dockerfile multi-stage | ✓ |

### P0 — phải sửa trước khi go-live
1. **Thiếu transactional outbox**. Payment capture + publish Kafka không atomic → nguy cơ mất event sau crash. Spec `04-microservices-breakdown.md` yêu cầu outbox cho billing/payment.
   - [services/payment/cmd/server/main.go:70-77](services/payment/cmd/server/main.go#L70-L77) — publisher fire-and-forget.
   - Cần: bảng `payment_outbox` + relay job (tham khảo pattern đã làm ở `services/billing/internal/service/service.go:213-239`).
2. **Webhook payload log có thể leak PAN/PII**. Cần redact trước khi log.
   - [services/payment/internal/handler/webhook_handler.go:73](services/payment/internal/handler/webhook_handler.go#L73)

### P1
3. Unique constraint cho idempotency phải là `(provider, provider_event_id)` chứ không phải PK `id`.
   - [services/payment/migrations/00001_init_schema.sql:32-45](services/payment/migrations/00001_init_schema.sql#L32-L45)
4. **Chưa có 3DS flow** (`/payment/3ds-redirect`, `/payment/3ds-callback`) — spec bắt buộc cho EU.
5. Body limit mặc định 64KB cho webhook sẽ fail với payload Stripe lớn → cần raise riêng cho route webhook.

---

## A2. entitlement (Go + Fiber)

### P0
1. **Consumer Kafka subscription lifecycle chưa hoàn thiện**. Service được tạo nhưng không thấy `Run()` thực sự tiêu thụ event `billing.subscription.*` để invalidate cache.
   - [services/entitlement/cmd/server/main.go:111-122](services/entitlement/cmd/server/main.go#L111-L122)

### P1
2. JWT không embed claim `tier` + `tier_expires_at` → mọi request phải query Redis/DB thay vì trust JWT trong ≤5 phút.
3. Endpoint `/check` chưa có rate limit theo tier.

### P2
- Prometheus, structured log, health check ✓.

---

## A3. llm-gateway (Go + Fiber)

### P0
1. **Chưa có PII redaction** trước khi gửi prompt lên OpenAI/Anthropic. Spec yêu cầu mask email/phone/card.
   - [services/llm-gateway/internal/service/gateway_service.go:52-120](services/llm-gateway/internal/service/gateway_service.go#L52-L120)
2. **Không có prompt-injection guardrail** (deny-list, system prompt sanitize, output filter).
3. **Cost tracking chưa chuẩn hóa theo provider** — Anthropic tokenizer ≠ OpenAI. Budget check hiện tại sẽ sai 20-40% khi fallback.

### P1
4. Semantic cache key thiếu `model`, `temperature`, `top_p` → stale response khi đổi model.
   - [services/llm-gateway/internal/service/gateway_service.go:69](services/llm-gateway/internal/service/gateway_service.go#L69)
5. Fallback giữa provider chưa có exponential backoff / timeout; dễ cascading failure.

---

## A4. speech-ai (Python + FastAPI)

### P0
1. **Không hỗ trợ streaming** (VAD streaming, TTS chunked). Endpoint duy nhất là `/healthz` + `/readyz` — chưa thấy `/api/v1/transcribe-stream`.
   - [services/speech-ai/app/main.py:39-51](services/speech-ai/app/main.py#L39-L51)
2. **Chưa thấy model cached on startup**. Nếu Whisper load per-request, P99 sẽ vượt 10s.

### P1
3. Dockerfile không multi-stage, không `USER nonroot`.
   - [services/speech-ai/Dockerfile:1-8](services/speech-ai/Dockerfile#L1-L8)
4. FastAPI không đặt body limit → upload audio lớn có thể DoS.
5. `/readyz` chỉ check Redis, không kiểm tra Whisper backend.

---

## A5. ai-tutor (Python + FastAPI)

### P0
1. **Chưa có content safety filter** trước khi gọi LLM (toxicity, abuse, jailbreak).
2. **Chưa có language-specific prompt registry** — spec yêu cầu prompt theo ngôn ngữ học viên.

### P1
3. Dockerfile không multi-stage + non-root.
4. Config có `rate_limit_*` nhưng không thấy middleware enforce.
   - [services/ai-tutor/app/core/config.py:30-34](services/ai-tutor/app/core/config.py#L30-L34)

---

## A6. web-bff (Node + Fastify + TS)

### P0
1. **Thiếu field-level authorization** trong GraphQL — field `aiTutor`, `liveClass`, v.v. cần directive `@requiresTier`.
   - [services/web-bff/src/resolvers/resolvers.ts](services/web-bff/src/resolvers/resolvers.ts)
2. **Không có DataLoader** → N+1 khi resolve `users[].entitlement`.

### P1
3. Dockerfile thiếu `USER node`.
   - [services/web-bff/Dockerfile:1-16](services/web-bff/Dockerfile#L1-L16)
4. Response caching aggregated query (home feed) chưa có lớp Redis.

### P2
- Helmet, Prometheus, JWKS, CORS whitelist ✓.

---

# B. Tái kiểm tra review trước (2026-04-18)

## B1. Đã FIX ✅

| Service | Issue | Evidence |
|---|---|---|
| learning | JWT `ParseUnverified` | [middleware/jwks.go:59](services/learning/internal/middleware/jwks.go#L59) (RS256 + JWKS cache) |
| learning | OTel + CORS `Vary: Origin` + Dockerfile | `telemetry/otel.go`, [middleware.go:117](services/learning/internal/middleware/middleware.go#L117), Dockerfile |
| assessment | JWT `ParseUnverified` + JWKS stub | [middleware/jwks.go:133-147](services/assessment/internal/middleware/jwks.go#L133-L147) (`rsaPublicKeyFromJWK`) |
| assessment | Schema timestamps | `migrations/00002_add_timestamps.sql` |
| assessment | OTel + Dockerfile | `telemetry/otel.go`, Dockerfile |
| billing | Webhook không verify signature | [handler.go:138](services/billing/internal/handler/handler.go#L138) (HMAC-SHA256 + 400 khi mismatch) |
| billing | Idempotency invoice | [service.go:191-195](services/billing/internal/service/service.go#L191-L195) (409 duplicate) |
| billing | Transactional outbox | [service.go:213-239](services/billing/internal/service/service.go#L213-L239) (`pgx.BeginTxFunc`) |
| notification | JWT base64-decode không verify | [services/jwt.ts:25-37](services/notification/src/services/jwt.ts#L25-L37) (`jwtVerify` RS256) |
| notification | Body limit | [main.ts:45](services/notification/src/main.ts#L45) (65536) |
| progress | `fetchJWKSPublicKey()` trả nil | [middleware.go:42-56](services/progress/internal/middleware/middleware.go#L42-L56) (RS256 đầy đủ) |
| progress | Kafka consumer loop | `cmd/server/main.go:79` (`consumer.Start`) |
| gamification | `redis.ZIncrBy` nil guard | [gamification_service.go:172](services/gamification/internal/service/gamification_service.go#L172) |
| gamification | Kafka consumer | `cmd/server/main.go:100` |
| srs | Body limit 64KB | [main.rs:104](services/srs/src/main.rs#L104) (`DefaultBodyLimit::max(65_536)`) |
| srs | CORS fail-close | [main.rs:165-169](services/srs/src/main.rs#L165-L169) |
| srs | Histogram review duration | [metrics.rs:17-18](services/srs/src/metrics.rs#L17-L18) |
| vocabulary | RSA JWK parsing | `middleware/jwks.go:133-148` |
| grammar | Kafka producer | `src/messaging/producer.ts` |
| identity | JWKS endpoint | [jwks_handler.go:14](services/identity/internal/handler/jwks_handler.go#L14) |

## B2. Vẫn CÒN MỞ ❌

| Service | Issue | Priority | Ghi chú |
|---|---|---|---|
| vocabulary | Thiếu OpenTelemetry (folder `telemetry/` rỗng) | P1 | |
| vocabulary / billing / content / grammar / assessment / progress / gamification | Audit logging module — chỉ `identity` có `internal/audit/` | P1 | Cần cho GDPR/compliance |
| vocabulary | Go module path `github.com/omnilingo/...` khác chuẩn `github.com/omnilingo/omnilingo/services/...` | P2 | |
| billing | Module path tương tự (`github.com/omnilingo/billing-service`) | P2 | |
| content | CORS null-origin → fallback `'*'` | P1 | [src/index.ts:40](services/content/src/index.ts#L40) — phải reject khi origin=null trong prod |
| content | Lesson version bump không transactional (Mongoose `save()` đơn lẻ) | P2 | Cần `withTransaction` |
| grammar | Thiếu `Vary: Origin` header | P2 | [src/main.ts:25](services/grammar/src/main.ts#L25) |
| grammar | Thiếu histogram request duration | P2 | |
| grammar | Khởi động service log qua `console.log` thay vì pino | P2 | |
| notification | PostgreSQL migrations chưa có (config có `pgUrl` nhưng không schema) | P1 | |
| notification | Idempotency Kafka event (không dedupe theo `event_id`) | P1 | |
| notification | Không có retry / DLQ topic khi consumer xử lý fail | P1 | |

## B3. Thống kê

- **P0 cũ**: **7/7 đã fix** (100%).
- **P1 cũ**: **~70% fix** (còn OTel vocabulary, audit module toàn cluster, notification schema/retry, content CORS).
- **P2 cũ**: **~60% fix**.
- **P0 mới phát sinh từ 6 service mới**: **9 vấn đề** (payment outbox, PCI log; llm-gateway PII+guardrail+cost; ai-tutor safety; web-bff field-auth+DataLoader; entitlement consumer; speech-ai streaming+model-cache).

---

# C. Ưu tiên fix (Wave 3)

## Wave 3A — Chặn go-live MVP 1
1. `payment` transactional outbox + PCI log redact.
2. `llm-gateway` PII redaction + prompt-injection guard.
3. `ai-tutor` safety filter trước khi gọi LLM.
4. `web-bff` field-level authorization trên GraphQL.
5. `entitlement` hoàn thiện Kafka consumer invalidate cache.
6. `speech-ai` load Whisper model on startup.

## Wave 3B — Trước scale-out
7. Audit logging chung (module shared) cho các service tài chính/học tập.
8. `notification` PostgreSQL migrations + idempotency + retry/DLQ.
9. `vocabulary` OTel.
10. `content` CORS null-origin fail-close.
11. `llm-gateway` cost tokenizer theo provider, cache key gồm model + params.

## Wave 3C — Kỹ thuật nợ
12. Chuẩn hóa Go module path (`github.com/omnilingo/...` vs `github.com/omnilingo/...`).
13. Dockerfile `USER nonroot` cho tất cả Python/Node service.
14. Grammar `Vary: Origin` + histogram + pino khởi động.
15. 3DS flow cho `payment`.
16. DataLoader + Redis cache trên `web-bff`.

---

# D. Kết luận

MVP 1 đã **gần sẵn sàng**: các lỗ hổng bảo mật nghiêm trọng trong Wave 1 đều đã vá. Tuy nhiên, **không nên go-live** cho đến khi:

- `payment` có outbox (tránh mất transaction),
- `llm-gateway` + `ai-tutor` có guardrail (tránh jailbreak + leak PII),
- `web-bff` có field-level auth (tránh user Free truy cập field Plus).

Các hạng mục còn lại (audit, OTel vocabulary, notification schema) có thể deliver song song trong Wave 3B mà không chặn launch.
