# OmniLingo — Frontend ↔ Backend Integration Plan

> **Tài liệu chỉ mục** cho toàn bộ luồng tương tác UI → BFF → microservices.
> Chi tiết mỗi luồng đã được tách thành các file riêng trong [docs/flows/](./docs/flows/).
>
> **Cập nhật**: 2026-04-19
> **Tiền đề**: Toàn bộ page trong [docs/missing-pages-2026-04-19.md](./docs/missing-pages-2026-04-19.md) đã generate xong UI (chưa download vào `apps/web/`). Tài liệu này định nghĩa backend flow để chuẩn bị wire.

---

## 1. Cấu trúc tài liệu

| File | Nội dung |
|------|----------|
| [docs/flows/00-overview.md](./docs/flows/00-overview.md) | Architecture, service catalog (20 services), Kafka topic registry, outbox pattern, naming conventions, JWT/cookie, luật bất biến |
| [docs/flows/01-auth-identity.md](./docs/flows/01-auth-identity.md) | Register, Login, OAuth, Refresh, Logout, Verify email, Forgot/Reset password, MFA, Change password, Delete account |
| [docs/flows/02-onboarding.md](./docs/flows/02-onboarding.md) | 8-step wizard: languages → native → goal → cert → level → placement → daily goal → reminder → finish |
| [docs/flows/03-learn-lesson.md](./docs/flows/03-learn-lesson.md) | Dashboard aggregation, Track/Unit/Lesson browsing, Start lesson, Submit answer, Complete lesson, Kafka fan-out |
| [docs/flows/04-vocabulary-srs.md](./docs/flows/04-vocabulary-srs.md) | Deck CRUD, Add card (single/bulk), Anki import, Learn Mode (3 stages), Review session (FSRS v5), Keyboard shortcuts |
| [docs/flows/05-ai-tutor.md](./docs/flows/05-ai-tutor.md) | Text chat, Explain word, Create flashcard from chat, Conversation history, llm-gateway routing, voice (MVP1.5 stub) |
| [docs/flows/06-progress-gamification.md](./docs/flows/06-progress-gamification.md) | XP, Streak (freeze, milestone), Badges, Level-up, Leaderboard (league), Daily goal, Skill radar, Activity heatmap |
| [docs/flows/07-billing-payment.md](./docs/flows/07-billing-payment.md) | Pricing, Checkout, Stripe/VNPay webhook, Entitlement upgrade, Trial, Cancel, Invoice, Refund, Shop (gems) |
| [docs/flows/08-notifications.md](./docs/flows/08-notifications.md) | Kafka fan-in → in-app/email/push, Templates, User preferences, Scheduled crons (daily reminder, streak at risk, digest) |

---

## 2. Architecture 1 glance

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Browser (Next.js)                          │
│  RSC page.tsx ─► Server Action ─► Client Component                  │
│  Cookie: omni_at (15m) · omni_rt (30d) · httpOnly · SameSite=Strict │
└──────────┬──────────────────────────────┬───────────────────────────┘
           │ REST (auth only)             │ GraphQL (all data)
           ▼                              ▼
    identity :3001                web-bff :4000
    (Go + Postgres)               (Mercurius · JWT JWKS · DataLoader)
                                        │
      ┌──────────────────┬───────────────┼────────────────┬──────────┐
      ▼                  ▼               ▼                ▼          ▼
  learning :3002  vocabulary :3004  progress :3007  entitlement :3016  billing :3010
  content  :3003  srs        :3005  gamification :3008  payment :3011  notification :3009
  assessment :3006  grammar :3018  ai-tutor :3021  speech-ai :3022  llm-gateway :3030
                                        │
                                        ▼
                             Kafka (topic registry: flows/00-overview.md §4)
```

## 3. Luật bất biến (tóm tắt)

1. Browser **không bao giờ** gọi service trực tiếp → chỉ qua Next.js server.
2. Auth → REST identity. Data → GraphQL BFF. Không mix.
3. BFF stateless; verify JWT qua JWKS; DataLoader batch + cache per-request.
4. Mỗi service chỉ truy cập DB riêng.
5. State change → outbox + Kafka (async fan-out).
6. LLM call → qua `llm-gateway` (quota, PII, safety, cache).
7. Entitlement là source of truth cho feature gating.
8. Payment là service duy nhất tích hợp provider SDK.

## 4. Kafka topics MVP1 (đã verify trong code)

Xem [flows/00-overview.md §4](./docs/flows/00-overview.md#4-kafka-topic-registry-mvp1) cho registry đầy đủ.

**Publishers hiện có**: identity (3 topics), learning (3), vocabulary (5), billing (3 via outbox), payment (1 via outbox), gamification (3).
**Consumers hiện có**: progress, gamification, entitlement.

**⚠️ 4 naming bugs cần sửa trước khi wire frontend**:
- `billing.subscription.created` vs consumer `billing.subscription.activated`
- `billing.subscription.canceled` (US) vs consumer `cancelled` (UK)
- gamification publish `gamification.xp.awarded` nhưng consume `progress.xp.awarded`
- gamification publish `gamification.streak.updated` nhưng consume `progress.streak.updated`

Chi tiết: [flows/00-overview.md §4.3](./docs/flows/00-overview.md#43--naming-mismatch-cần-sửa-bugs-hiện-tại).

## 5. Outbox pattern status

| Service | Outbox | Impact nếu chưa có |
|---------|--------|---------------------|
| payment | ✅ | — |
| billing | ✅ | — |
| identity | 🔴 | Có thể mất `user.registered` → không tạo entitlement |
| learning | 🔴 | Có thể mất `lesson.completed` → không cấp XP |
| vocabulary | 🔴 | Có thể mất `card.added` → srs không schedule |
| gamification | 🔴 | Có thể mất badge/XP event |

**Action**: migrate identity/learning/vocabulary/gamification sang outbox trước khi scale (xem `billing/internal/messaging/outbox.go` làm reference).

## 6. Service catalog snapshot

| # | Service | Port | MVP1 |
|---|---------|------|------|
| identity | 3001 | Go | ✅ |
| learning | 3002 | Go | ✅ |
| content | 3003 | Node.js | ⚠️ |
| vocabulary | 3004 | Go | ✅ |
| srs | 3005 | Rust | ⚠️ |
| assessment | 3006 | Go | ⚠️ |
| progress | 3007* | Go | ✅ (set `PORT=3007` override) |
| gamification | 3008 | Go | ⚠️ |
| notification | 3009 | Node.js | ⚠️ |
| billing | 3010 | Go | ⚠️ |
| payment | 3011 | Go | ⚠️ |
| entitlement | 3016 | Go | ✅ |
| grammar | 3018 | Node.js | MVP1.5 |
| ai-tutor | 3021 | Python | ⚠️ |
| speech-ai | 3022 | Python | MVP1.5 |
| llm-gateway | 3030 | Go | ⚠️ |
| web-bff | 4000 | Node.js | ✅ |
| mobile-bff, dictionary, media | — | — | P2/1.5 |

Chi tiết: [flows/00-overview.md §2](./docs/flows/00-overview.md#2-service-catalog-cập-nhật-so-với-integration-plan-cũ).

## 7. BFF Schema hiện tại vs cần thêm

**Đã có** (verified trong [resolvers.ts](services/web-bff/src/resolvers/resolvers.ts)):
- Queries (9): `dashboard`, `me`, `myEntitlements`, `myTracks`, `lessons`, `myDecks`, `checkFeature`, `myProgress`, `weeklyProgress`
- Mutations (5): `startLesson`, `createDeck`, `tutorChat`, `explain`, `updateProfile`

**Cần thêm cho MVP1** (tổng hợp từ 9 flow files):
- **Auth/Identity**: change password, delete account, MFA mutations
- **Onboarding**: `onboardingState`, `placementTest`, `updateOnboarding`, `submitPlacement`, `completeOnboarding`
- **Learn**: `track(id)`, `units(trackId)`, `lessonContent(lessonId)`, `todayMission`, `enrollTrack`, `submitAnswer`, `completeLesson`
- **Vocab/SRS**: `deck(id)`, `deckCards`, `dueCards`, `newCards`, `importStatus`, `addCard`, `addCardsBulk`, `updateCard`, `deleteCard`, `importAnki`, `reviewCard`, `completeLearnCard`, `finishReviewSession`
- **AI Tutor**: `conversations`, `conversation(id)`, `renameConversation`, `pinConversation`, `deleteConversation`, `addCardFromChat`
- **Progress/Gam**: `skillScores`, `activityHeatmap`, `certPredict`, `myStreak`, `achievements`, `leaderboard`, `friendsLeaderboard`, `freezeStreak`, `claimDailyReward`
- **Billing**: `pricingPlans`, `mySubscription`, `billingHistory`, `checkoutStatus`, `createCheckoutSession`, `cancelSubscription`, `reactivateSubscription`, `updatePaymentMethod`
- **Notifications**: `notifications`, `unreadNotificationCount`, `markNotificationsRead`, `markAllNotificationsRead`, `updateNotificationPrefs`, `registerPushToken`

Tổng: **~60 resolver mới** chia đều theo 9 file flow.

## 8. Roadmap wire-up (đề xuất thứ tự)

| Tuần | Nội dung | File reference |
|------|----------|----------------|
| W1 | Sửa 4 Kafka naming bugs + migrate identity/learning outbox | [flows/00](./docs/flows/00-overview.md) |
| W2 | Wire auth pages đầy đủ (forgot/reset, verify, OAuth callback, MFA, change pw, delete) | [flows/01](./docs/flows/01-auth-identity.md) |
| W3 | Wire onboarding + placement test | [flows/02](./docs/flows/02-onboarding.md) |
| W4 | Wire Learn: track detail, lesson exercises (real), complete flow | [flows/03](./docs/flows/03-learn-lesson.md) |
| W5 | Wire Vocabulary: deck detail, add/import, SRS review | [flows/04](./docs/flows/04-vocabulary-srs.md) |
| W6 | Wire AI Tutor: conversation history, explain, flashcard-from-chat | [flows/05](./docs/flows/05-ai-tutor.md) |
| W7 | Wire Progress/Gamification: skills, heatmap, achievements, leaderboard | [flows/06](./docs/flows/06-progress-gamification.md) |
| W8 | Wire Billing: pricing, checkout, subscription, webhook | [flows/07](./docs/flows/07-billing-payment.md) |
| W9 | Wire Notifications: bell dropdown, /notifications, settings | [flows/08](./docs/flows/08-notifications.md) |
| W10 | E2E smoke test + load test + observability dashboards | — |

## 9. Tài liệu liên quan

- [FRONTEND-BACKEND-STANDARDS.md](./FRONTEND-BACKEND-STANDARDS.md) — code conventions, file structure, env vars
- [docs/missing-pages-2026-04-19.md](./docs/missing-pages-2026-04-19.md) — 110 route inventory với status
- [docs/v0-prompts-for-missing-pages.md](./docs/v0-prompts-for-missing-pages.md) — 32 v0.dev prompts cho UI còn thiếu
- [docs/code-review-2026-04-18-followup.md](./docs/code-review-2026-04-18-followup.md) — P0/P1/P2 security + architecture issues
- [docs/coding-standards.md](./docs/coding-standards.md)
- [docs/service-catalog.md](./docs/service-catalog.md)

---

> **Đây là living document**. Khi wire xong 1 flow → update status trong file flow tương ứng + service catalog ở §6.
