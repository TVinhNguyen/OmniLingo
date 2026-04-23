# MVP1 Flows — Overview & Conventions

> **Phạm vi**: Mô tả luồng thao tác (user journey) cho MVP1, service nào gọi service nào, event nào emit khi nào.
> **Đối tượng đọc**: Frontend integrator chuẩn bị wire UI với BFF/identity; backend engineer verify event contracts.
> **Cập nhật**: 2026-04-19
>
> Các file liên quan:
> - [01-auth-identity.md](./01-auth-identity.md) — Register/Login/OAuth/Refresh/Logout/Forgot/MFA/Delete
> - [02-onboarding.md](./02-onboarding.md) — 8-step onboarding + placement test
> - [03-learn-lesson.md](./03-learn-lesson.md) — Dashboard aggregation + lesson flow
> - [04-vocabulary-srs.md](./04-vocabulary-srs.md) — Deck CRUD, card import, FSRS review
> - [05-ai-tutor.md](./05-ai-tutor.md) — Chat, explain, llm-gateway routing
> - [06-progress-gamification.md](./06-progress-gamification.md) — XP, streak, badge, level
> - [07-billing-payment.md](./07-billing-payment.md) — Checkout → webhook → entitlement
> - [08-notifications.md](./08-notifications.md) — Fan-in notification service

---

## 1. Architecture (MVP1)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Browser (Next.js)                              │
│   RSC page.tsx ─► Server Action ─► client components                    │
│   Cookie: omni_at (15m) + omni_rt (30d), httpOnly, SameSite=Strict      │
└──────────┬──────────────────────────────┬───────────────────────────────┘
           │ REST (auth only)             │ GraphQL (all data)
           ▼                              ▼
    identity-service  :3001        web-bff  :4000
    (Go + Postgres)                (Mercurius + JWT JWKS verify)
                                         │
           ┌─────────────┬───────────────┼─────────────────┬───────────┐
           ▼             ▼               ▼                 ▼           ▼
     learning :3002  vocabulary :3004  progress :3007  entitlement :3016
     content  :3003  srs        :3005  gamification :3008  billing :3010
     assessment :3006  notification :3009  payment :3011  grammar :3018
     ai-tutor :3021  speech-ai :3022  llm-gateway :3030
                                         │
                                         ▼
                                    Kafka cluster
                             (topics: see §4 below)
```

**Luật bất biến:**

| # | Luật |
|---|------|
| 1 | Browser **không bao giờ** gọi service trực tiếp. Chỉ qua Next.js Server → BFF/identity. |
| 2 | Auth (login/register/refresh/logout/MFA/password) → REST tới `identity-service`. |
| 3 | Mọi data query/mutation khác → GraphQL tới `web-bff`. |
| 4 | BFF **không giữ state**; chỉ verify JWT, DataLoader batching, field-level auth. |
| 5 | Mỗi service chỉ truy cập DB của mình (database-per-service). |
| 6 | Mọi state change quan trọng → Kafka event (async fan-out). Sync REST giữa service chỉ dùng cho **read** (ví dụ BFF → service). |
| 7 | Mọi cuộc gọi LLM → đi qua `llm-gateway` (quota, safety, redaction). Service AI (`ai-tutor`, writing grader, explain) **không** gọi provider trực tiếp. |
| 8 | Mọi ghi DB + emit Kafka → dùng **transactional outbox** (hiện payment + billing đã có; identity + learning + vocabulary + gamification đang dùng direct publish → cần migrate). |

---

## 2. Service catalog (cập nhật so với INTEGRATION-PLAN cũ)

| # | Service | Port | Stack | Role chính | MVP1 status |
|---|---------|------|-------|------------|-------------|
| 1 | identity | 3001 | Go | Auth, session, user profile, MFA, audit | ✅ |
| 2 | learning | 3002 | Go | Track, unit, goal, lesson lifecycle | ✅ |
| 3 | content | 3003 | Node.js | Lesson content, exercises, audio metadata | ⚠️ Có code |
| 4 | vocabulary | 3004 | Go | Deck, card, Anki import | ✅ |
| 5 | srs | 3005 | Rust | FSRS scheduler, due cards | ⚠️ Entry point có, wire-up chưa verify |
| 6 | assessment | 3006 | Go | Grading, placement test, mock test | ⚠️ Có code |
| 7 | progress | 3007 | Go | Skill scores, heatmap, weekly stats | ✅ (override `PORT=3007`) |
| 8 | gamification | 3008 | Go | XP, streak, badges, leaderboard | ⚠️ Có code |
| 9 | notification | 3009 | Node.js | Kafka consumer → in-app/email/push | ⚠️ Có code |
| 10 | billing | 3010 | Go | Subscription, invoice, plans | ⚠️ Outbox ✅, service methods ✅ |
| 11 | payment | 3011 | Go | Stripe/VNPay/MoMo sessions, webhooks | ⚠️ Outbox ✅ |
| 12 | entitlement | 3016 | Go | Feature gate, quota, plan mapping | ✅ |
| 13 | grammar | 3018 | Node.js | Grammar point, drill | Phase MVP1.5 |
| 14 | ai-tutor | 3021 | Python | Chat/explain orchestrator → llm-gateway | ⚠️ Có entry point (app/) |
| 15 | speech-ai | 3022 | Python | STT/TTS/pronunciation scoring | ⚠️ Có entry point (app/), MVP1.5 |
| 16 | llm-gateway | 3030 | Go | Provider abstraction, quota, PII redaction | ⚠️ Có code |
| 17 | web-bff | 4000 | Node.js | GraphQL gateway, JWT verify, DataLoader | ✅ |
| 18 | mobile-bff | — | — | Phase 2 | — |
| 19 | dictionary | — | — | Phase MVP1.5 | — |
| 20 | media | — | — | S3 presigned URLs, CDN | Phase MVP1.5 |

**So với INTEGRATION-PLAN cũ đã sửa:**
- Thêm: `llm-gateway`, `payment`, `grammar` (trước không có trong inventory).
- Sửa status: `ai-tutor`, `speech-ai`, `srs` đã có entry point (không phải 🔴).
- Note: progress service default port là **3008** trong [config.go:29](../../services/progress/internal/config/config.go#L29) nhưng BFF gọi **3007** → phải set `PORT=3007` khi deploy.

---

## 3. Cookie & JWT

| Cookie | Tên | TTL | Flags | Nguồn |
|--------|-----|-----|-------|-------|
| Access token | `omni_at` | 15 phút (900s) | `HttpOnly`, `Secure`, `SameSite=Strict`, `Path=/` | identity `/auth/login` |
| Refresh token | `omni_rt` | 30 ngày (2,592,000s) | `HttpOnly`, `Secure`, `SameSite=Strict`, `Path=/auth/refresh` | identity `/auth/login` |

- JWT: RS256, `aud=omnilingo`, `iss=identity-service`.
- BFF verify qua JWKS endpoint `identity:3001/.well-known/jwks.json` (cache 1h).
- Refresh flow: Server Action trong Next.js tự gọi `/auth/refresh` khi `omni_at` gần expire hoặc nhận 401 → update cookie → retry request.

---

## 4. Kafka Topic Registry (MVP1)

### 4.1. Publishers (đã verify trong code)

| Topic | Publisher | Khi nào emit | File |
|-------|-----------|--------------|------|
| `identity.user.registered` | identity | Sau khi user đăng ký thành công | [auth_service.go:204](../../services/identity/internal/service/auth_service.go#L204) |
| `identity.user.logged_in` | identity | Sau login thành công (audit) | [auth_service.go:318](../../services/identity/internal/service/auth_service.go#L318) |
| `identity.user.deleted` | identity | Delete account (GDPR) | [auth_service.go:428](../../services/identity/internal/service/auth_service.go#L428) |
| `learning.goal.set` | learning | User set goal trong onboarding | [learning_service.go:103](../../services/learning/internal/service/learning_service.go#L103) |
| `learning.lesson.started` | learning | Bắt đầu session học | [learning_service.go:146](../../services/learning/internal/service/learning_service.go#L146) |
| `learning.lesson.completed` | learning | Hoàn thành bài | [learning_service.go:167](../../services/learning/internal/service/learning_service.go#L167) |
| `vocabulary.deck.created` | vocabulary | Tạo deck mới | domain/events.go |
| `vocabulary.card.added` | vocabulary | Thêm card vào deck | domain/events.go |
| `vocabulary.card.removed` | vocabulary | Xoá card | domain/events.go |
| `vocabulary.card.marked_known` | vocabulary | Đánh dấu đã biết | domain/events.go |
| `vocabulary.import.completed` | vocabulary | Anki import xong | [importer.go:196](../../services/vocabulary/internal/anki/importer.go#L196) |
| `srs.review.completed` | srs | Sau khi review 1 card xong | (Rust service — chưa verify) |
| `assessment.submission.graded` | assessment | Grader hoàn tất chấm bài | (chưa verify) |
| `billing.subscription.created` | billing (outbox) | Tạo subscription mới | [billing_service.go:146](../../services/billing/internal/service/billing_service.go#L146) |
| `billing.subscription.canceled` | billing (outbox) | User huỷ subscription | [billing_service.go:176](../../services/billing/internal/service/billing_service.go#L176) |
| `billing.invoice.paid` | billing (outbox) | Invoice thanh toán thành công | [billing_service.go:237](../../services/billing/internal/service/billing_service.go#L237) |
| `payment.succeeded` | payment (outbox) | Provider webhook confirm payment | [payment_service.go:276](../../services/payment/internal/service/payment_service.go#L276) |
| `gamification.achievement.unlocked` | gamification | Unlock badge | [publisher.go:71](../../services/gamification/internal/messaging/publisher.go#L71) |
| `gamification.xp.awarded` | gamification | Cấp XP | [publisher.go:82](../../services/gamification/internal/messaging/publisher.go#L82) |
| `gamification.streak.updated` | gamification | Streak tăng hoặc reset | publisher.go |
| `audit.{service}.events` | mọi service | Audit log (SIEM/S3 archival) | per-service audit.go |

### 4.2. Consumers (đã verify)

| Service | Topics subscribe | Hành động |
|---------|------------------|-----------|
| progress | `learning.lesson.completed`, `srs.review.completed`, `assessment.submission.graded` | Update skill scores, minutes, words_mastered |
| gamification | `progress.xp.awarded`, `progress.streak.broken`, `learning.lesson.completed` | Update XP, streak, badge check |
| entitlement | `billing.subscription.activated`, `billing.subscription.cancelled`, `payment.succeeded` | Upgrade/downgrade plan tier, features |

### 4.3. ⚠️ Naming mismatch cần sửa (bugs hiện tại)

| Issue | Publisher emits | Consumer expects | Impact |
|-------|----------------|------------------|--------|
| Subscription activated | `billing.subscription.created` | `billing.subscription.activated` | Entitlement KHÔNG upgrade sau payment |
| Cancel spelling | `billing.subscription.canceled` (US) | `billing.subscription.cancelled` (UK) | Entitlement KHÔNG downgrade |
| XP event | gamification publish `gamification.xp.awarded` | gamification consume `progress.xp.awarded` | XP pipeline broken |
| Streak event | gamification publish `gamification.streak.updated` | gamification consume `progress.streak.updated` | Streak pipeline broken |

**Action cần trước khi wire frontend:**
- Thống nhất sang một naming convention (đề xuất: dùng tên event đã emit, sửa consumer).
- Publish spec: `{domain}.{entity}.{action_past_tense}`, US English.

### 4.4. Topics CẦN THÊM cho MVP1 (chưa có trong code)

| Topic | Publisher | Consumer | Flow |
|-------|-----------|----------|------|
| `onboarding.completed` | learning (hoặc identity) | gamification (welcome badge), notification (welcome email) | [02-onboarding.md](./02-onboarding.md) |
| `learning.track.enrolled` | learning | progress (initial baseline), notification | [03-learn-lesson.md](./03-learn-lesson.md) |
| `vocabulary.card.added` → **srs.card.scheduled** | srs (after consume vocabulary.card.added) | — (internal) | [04-vocabulary-srs.md](./04-vocabulary-srs.md) |
| `srs.card.due` (hourly scan) | srs | notification (daily digest) | [08-notifications.md](./08-notifications.md) |
| `gamification.level.up` | gamification | notification | [06-progress-gamification.md](./06-progress-gamification.md) |
| `gamification.streak.at_risk` | gamification (scheduler) | notification (push nhắc buổi tối) | [08-notifications.md](./08-notifications.md) |
| `billing.trial.ending` | billing (scheduler) | notification | [07-billing-payment.md](./07-billing-payment.md) |
| `billing.payment.failed` | payment → billing | notification, entitlement (grace period) | [07-billing-payment.md](./07-billing-payment.md) |

---

## 5. Outbox Pattern

**Pattern bắt buộc** cho mọi service emit Kafka event quan trọng (tránh lost event khi DB commit nhưng Kafka publish fail):

```
BEGIN TRANSACTION;
  INSERT INTO business_table (...) VALUES (...);
  INSERT INTO outbox_events (id, topic, key, payload, created_at)
    VALUES (uuid, 'domain.event.name', 'aggregate_id', '{json}', NOW());
COMMIT;

-- Outbox relay (goroutine trong cùng process):
--   SELECT * FROM outbox_events ORDER BY created_at LIMIT 100
--   → publish mỗi row lên Kafka → DELETE row sau khi ack
```

| Service | Đã có outbox | Vị trí |
|---------|--------------|--------|
| payment | ✅ | [outbox_relay.go](../../services/payment/internal/messaging/outbox_relay.go) + migration `00002_add_outbox.sql` |
| billing | ✅ | [outbox.go](../../services/billing/internal/messaging/outbox.go) + migration `00002_idempotency_outbox.sql` |
| identity | 🔴 Direct publish | [kafka_publisher.go](../../services/identity/internal/messaging/kafka_publisher.go) — cần migrate |
| learning | 🔴 Direct publish | [publisher.go](../../services/learning/internal/messaging/publisher.go) — cần migrate |
| vocabulary | 🔴 Direct publish | [kafka_publisher.go](../../services/vocabulary/internal/messaging/kafka_publisher.go) — cần migrate |
| gamification | 🔴 Direct publish | [publisher.go](../../services/gamification/internal/messaging/publisher.go) — cần migrate |

**Rủi ro nếu không sửa:** XP/streak/lesson completed có thể mất khi Kafka broker tạm down, user hoàn thành bài nhưng không nhận XP.

---

## 6. Naming conventions

### 6.1. REST endpoints (identity-service)

```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
POST /api/v1/auth/verify-email
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
POST /api/v1/auth/oauth/:provider/callback
POST /api/v1/auth/mfa/enroll
POST /api/v1/auth/mfa/verify
GET  /api/v1/users/me
PATCH /api/v1/users/me
DELETE /api/v1/users/me
```

### 6.2. GraphQL (web-bff)

- Query: `camelCase`, get data.
- Mutation: `camelCase` verb + object (e.g. `createDeck`, `reviewCard`, `completeLesson`).
- Error codes: `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `QUOTA_EXCEEDED`, `VALIDATION_ERROR`, `INTERNAL`.

### 6.3. Service URLs (internal)

- Service gọi nhau dùng DNS nội bộ: `http://{service-name}:port` (K8s) hoặc env var `{SERVICE}_URL`.
- Timeouts: default 5s, AI calls 30s streaming.
- Retry: exponential backoff, max 3 retries, chỉ cho idempotent GET.

---

## 7. Sequence pattern chung

Mọi luồng MVP1 đều có pattern:

```
1. User action (UI)
   ↓
2. Next.js Server Action (validate input, attach JWT từ cookie)
   ↓
3a. Nếu là auth → REST identity
3b. Nếu là data → GraphQL mutation BFF
   ↓
4. BFF verify JWT, gọi service tương ứng (sync REST)
   ↓
5. Service thực thi business logic:
     a. BEGIN TX
     b. Write DB
     c. Insert outbox row
     d. COMMIT
     e. Return response
   ↓
6. Outbox relay → Kafka
   ↓
7. Consumer services (progress, gamification, notification, entitlement) fan-out
   ↓
8. UI nhận response sync, các side-effect async chạy ngầm
   ↓
9. UI polling / subscription cho update async (ví dụ XP, badge unlock hiện qua notification)
```

**Quan trọng**: UI **không chờ** tất cả side-effects. Sync response chỉ cần đủ data để render tiếp. XP/badge/streak update có thể hiện sau vài giây qua notification WS hoặc refetch dashboard.

---

## 8. Success criteria để "wire xong" 1 page

Một trang được coi là "wired" khi:
1. RSC page.tsx fetch đúng GraphQL query, pass data props.
2. Client interaction → Server Action → mutation đúng.
3. Optimistic update (nếu có) + rollback on error.
4. Error boundary hiển thị message tiếng Việt thân thiện.
5. Loading state (skeleton/spinner) trong < 200ms.
6. Entitlement gate (nếu premium) check trước khi render feature.
7. Analytics event emit (client-side, opt-in) cho key actions.
8. A11y: focus state, keyboard shortcuts, ARIA labels.
