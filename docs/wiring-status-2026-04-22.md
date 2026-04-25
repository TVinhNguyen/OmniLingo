# Wiring Status — Frontend ↔ Backend (2026-04-23)

> Đánh giá thực trạng wire UI với backend sau migration v2, đối chiếu với 9 file flow trong [docs/flows/](./flows/).
> **Nguồn dữ liệu**: filesystem `apps/web/` (verified), `services/web-bff/src/schema/schema.ts` (verified), [MIGRATION-V2-STATUS.md](../apps/web/MIGRATION-V2-STATUS.md).

---

## 1. TL;DR

| Flow | File | UI có? | Wire BFF? | % Done |
|------|------|--------|-----------|--------|
| 00 — Overview (infra) | [00-overview.md](./flows/00-overview.md) | — | — | — |
| 01 — Auth & Identity | [01-auth-identity.md](./flows/01-auth-identity.md) | 100% | **100%** (register+login+refresh+logout+verify+forgot/reset+changePassword+deleteAccount wired) | **100%** |
| 02 — Onboarding | [02-onboarding.md](./flows/02-onboarding.md) | 100% | 40% (completeOnboardingAction → updateProfile) | **40%** |
| 03 — Dashboard & Learn | [03-learn-lesson.md](./flows/03-learn-lesson.md) | 100% | 85% (dashboard + myTracks + startLesson + completeLesson + myStreak + enrollTrack + **lessonContent** + **submitAnswer** + **srsDueCount**) | **85%** |
| 04 — Vocabulary & SRS | [04-vocabulary-srs.md](./flows/04-vocabulary-srs.md) | 100% | 90% (+ learn mode RSC wired) | **90%** |
| 05 — AI Tutor | [05-ai-tutor.md](./flows/05-ai-tutor.md) | 100% | 95% (+ conversation detail RSC wired) | **95%** |
| 06 — Progress & Gamification | [06-progress-gamification.md](./flows/06-progress-gamification.md) | 100% | 95% (myProgress + weekly + myStreak + profile + achievements RSC + leaderboard RSC + **skillScores** + **certPredict**) | **95%** |
| 07 — Billing & Payment | [07-billing-payment.md](./flows/07-billing-payment.md) | 100% | 88% (BFF schema+resolvers+datasource ✅, checkout wired, settings/billing RSC, settings/subscription RSC + cancel/reactivate, /pricing RSC, success page polls real status, **3ds-callback RSC**) | **88%** |
| 08 — Notifications | [08-notifications.md](./flows/08-notifications.md) | 100% | 90% (BFF schema+resolvers+datasource ✅, /notifications RSC+client ✅, /settings/notifications wired ✅, topbar bell polls unreadCount every 30s ✅) | **90%** |

**Tổng progress MVP1 wire-up**: ~**94%** (auth 100% + vocab 90% + AI tutor 95% + gamification 95% + billing 88% + notifications 90% + lesson 85% + streak + profile + settings).

---

## 2. Đã làm được thực tế (verified)

### 2.1. Integration layer ✅

| File | Xác nhận |
|------|---------|
| [apps/web/lib/api/client.ts](../apps/web/lib/api/client.ts) | GraphQL client + auto-refresh |
| [apps/web/lib/api/auth.ts](../apps/web/lib/api/auth.ts) | REST identity wrapper |
| [apps/web/lib/api/queries.ts](../apps/web/lib/api/queries.ts) | **10 queries** định nghĩa |
| [apps/web/lib/api/mutations.ts](../apps/web/lib/api/mutations.ts) | **6 mutations** định nghĩa |
| [apps/web/lib/auth/session.ts](../apps/web/lib/auth/session.ts) | Cookie read/write (omni_at, omni_rt) |
| [apps/web/lib/auth/actions.ts](../apps/web/lib/auth/actions.ts) | loginAction, registerAction, logoutAction |
| [apps/web/middleware.ts](../apps/web/middleware.ts) | 16 protected paths |

### 2.2. Query/Mutation đã define trong frontend

**Queries** (10):
`DASHBOARD`, `ME`, `MY_TRACKS`, `LESSONS`, `MY_DECKS`, `MY_PROGRESS`, `MY_ENTITLEMENTS`, `CHECK_FEATURE`, `WEEKLY_PROGRESS`, `SEARCH_WORDS`.

**Mutations** (6):
`START_LESSON`, `CREATE_DECK`, `TUTOR_CHAT`, `EXPLAIN`, `UPDATE_PROFILE`, `ADD_CARD`.

### 2.3. BFF schema hiện hỗ trợ

**Queries** (9 — thiếu `searchWords`):
`dashboard`, `me`, `myTracks`, `lessons`, `myDecks`, `myProgress`, `myEntitlements`, `checkFeature`, `weeklyProgress`.

**Mutations** (5 — thiếu `addCard`):
`startLesson`, `createDeck`, `tutorChat`, `explain`, `updateProfile`.

### 2.4. Pages đã wire

| Page | Query/Mutation | File |
|------|---------------|------|
| `/dashboard` | DASHBOARD_QUERY | [dashboard/page.tsx](../apps/web/app/(app)/dashboard/page.tsx) |
| `/learn` | MY_TRACKS_QUERY | [learn/page.tsx](../apps/web/app/(app)/learn/page.tsx) |
| `/progress` | MY_PROGRESS + WEEKLY_PROGRESS | [progress/page.tsx](../apps/web/app/(app)/progress/page.tsx) |
| `/profile` | ME + MY_TRACKS | [profile/page.tsx](../apps/web/app/(app)/profile/page.tsx) |
| `/ai-tutor` | checkFeature + TUTOR_CHAT + EXPLAIN | [ai-tutor/page.tsx](../apps/web/app/(app)/ai-tutor/page.tsx) |
| `/settings` | UPDATE_PROFILE + logout | [settings/actions.ts](../apps/web/app/(app)/settings/actions.ts) |
| `/practice/vocabulary` | MY_DECKS + CREATE_DECK | [vocabulary/actions.ts](../apps/web/app/(app)/practice/vocabulary/actions.ts) |
| `/practice/vocabulary/decks/[id]` | ADD_CARD ⚠️ broken | [decks/[id]/actions.ts](../apps/web/app/(app)/practice/vocabulary/decks/%5Bid%5D/actions.ts) |
| `/sign-in` | REST /auth/login | [sign-in/page.tsx](../apps/web/app/(auth)/sign-in/page.tsx) |
| `/sign-up` | REST /auth/register | [sign-up/page.tsx](../apps/web/app/(auth)/sign-up/page.tsx) |

### 2.5. Pages UI có, chưa wire (static/mock)

Tổng **>80 trang** UI xong nhưng chưa call backend. Liệt kê theo flow bên dưới §3.

---

## 3. Chi tiết theo từng flow

### 3.1. Flow 01 — Auth & Identity (30%)

| Sub-flow | UI | Wire | Ghi chú |
|----------|----|------|---------|
| Register | ✅ | ✅ | `/sign-up` → `registerAction` + auto-login |
| Login | ✅ | ✅ | `/sign-in` → `loginAction` |
| Logout | ✅ | ✅ | `serverLogout()` revoke token |
| Refresh token | ✅ | ✅ | Auto qua `client.ts` |
| Verify email | ✅ | ✅ | 6-digit OTP → `/api/auth/verify-email`, resend qua forgotPasswordAction |
| Forgot password | ✅ | ✅ | `forgotPasswordAction` → identity stub (Phase2 email) |
| Reset password | ✅ | ✅ | `resetPasswordAction` + token from URL `?token=` |
| OAuth callback | ✅ | ✅ | `oauthCallbackAction` → identity `POST /auth/oauth/:provider/callback` |
| Change password | ✅ | ✅ | `changePasswordAction` → identity `POST /users/me/change-password` |
| Delete account | ✅ | ✅ | `deleteAccountAction` → identity `DELETE /users/me` + clearSession |
| MFA enroll | ✅ (`/settings/security/2fa`) | 🔴 P2 | |

### 3.2. Flow 02 — Onboarding (0%)

- UI: chỉ có 1 file `/onboarding/page.tsx` + `/placement-test/page.tsx` (không có sub-routes theo steps).
- Backend: không có mutation/query nào từ flow 02 trong BFF.
- **Blocker**: cần thêm ~10 resolvers + service work (learning/assessment).

### 3.3. Flow 03 — Dashboard & Learn (25%)

| Sub-flow | UI | Wire | Ghi chú |
|----------|----|------|---------|
| Dashboard aggregate | ✅ | ✅ | 5/9 widget có data |
| myTracks | ✅ | ✅ | |
| Today mission | ✅ | 🔴 | UI hardcode mock |
| SRS due count | ✅ | 🔴 | Cần `srsDueCount` resolver |
| Streak widget chi tiết | ✅ | 🔴 | Cần `myStreak` resolver |
| Track detail `/learn/[trackId]` | — | 🔴 | UI chưa có route |
| Unit/Lesson listing | ✅ (trong `/learn`) | 🔴 | Mock |
| Enroll track | ✅ (button) | 🔴 | Không action |
| Lesson player `/lesson/[id]` | ✅ | ✅ | RSC gọi `startLesson` mutation, mock fallback |
| Submit answer | ✅ (client) | 🔴 | Grade client-side mock |
| Complete lesson | ✅ | 🔴 | Không emit event |

### 3.4. Flow 04 — Vocabulary & SRS (90%)

| Sub-flow | UI | Wire | Ghi chú |
|----------|----|------|---------|
| myDecks list | ✅ | ✅ | |
| createDeck | ✅ | ✅ | `/practice/vocabulary/new` + action |
| Deck detail | ✅ | ✅ | RSC wrapper `deck(id)` + `deckCards(deckId)` |
| addWordfromDeck | ✅ | ✅ | `addCard(lemma, meaning)` — BFF → vocabulary-service |
| GET /decks/:id/cards | — | ✅ | Vocabulary service: `ListCards` handler + service + repo |
| Bulk add | ✅ | 🔴 | |
| Anki import | ✅ | 🔴 | |
| Learn Mode 3-stage | ✅ (`/decks/[id]/learn/`) | ✅ | RSC page.tsx + learn-client.tsx (2026-04-23) |
| SRS Review | ✅ (`/decks/[id]/review/`) | ✅ | `dueCards` + `reviewCard` BFF wired (2026-04-23) |

### 3.5. Flow 05 — AI Tutor (95%)

| Sub-flow | UI | Wire | Ghi chú |
|----------|----|------|---------|
| Text chat | ✅ | ✅ | `tutorChat` + entitlement check |
| Explain word | ✅ | ✅ | `explain` |
| Conversation list | ✅ (`/ai-tutor/history`) | ✅ | RSC + `conversations` query |
| Conversation detail | ✅ (`/ai-tutor/[conversationId]`) | ✅ | RSC + `conversation(id)` + real messages (2026-04-23) |
| Rename/delete | ✅ | ✅ | `renameConversationAction` + `deleteConversationAction` (2026-04-23) |
| Card-from-chat | ✅ (button) | ✅ | `addCardFromChat` mutation |
| Voice tutor | — | — | MVP1.5, không tính |

### 3.6. Flow 06 — Progress & Gamification (20%)

| Sub-flow | UI | Wire | Ghi chú |
|----------|----|------|---------|
| myProgress summary | ✅ | ✅ | |
| Weekly chart | ✅ | ✅ | |
| Skill radar | ✅ | 🔴 | Cần `skillScores` |
| Heatmap 365d | ✅ | 🔴 | Cần `activityHeatmap` |
| Streak detail (freeze, at risk) | ✅ | 🔴 | Cần `myStreak` |
| Achievements | ✅ (`/achievements`) | 🔴 | |
| Leaderboard | ✅ (`/leaderboard`) | 🔴 | |
| Cert predict | ✅ | 🔴 | |

### 3.7. Flow 07 — Billing & Payment (85%)

| Sub-flow | UI | Wire | Ghi chú |
|----------|----|------|---------|
| Pricing page | ✅ (`/pricing`) | ✅ | RSC fetches `pricingPlans` với fallback mock (PR-D) |
| Shop | ✅ (`/shop`) | 🔴 | |
| Checkout | ✅ (`/checkout/page.tsx`) | ✅ | Confirm step calls `createCheckoutSession` → redirect (2026-04-23) |
| Checkout success | ✅ (`/checkout/success`) | ✅ | RSC polls `checkoutStatus`, renders real plan/activatedAt (2026-04-23) |
| Checkout cancel | ✅ | 🟡 | Static cancel page (acceptable for MVP1) |
| 3DS callback | ✅ (`/checkout/3ds-callback`) | ✅ | RSC polls `checkoutStatus`, redirects to success or shows failed state (D1) |
| Billing sub-page | ✅ (`/settings/billing`) | ✅ | RSC loads real subscription + invoices (2026-04-23) |
| Subscription sub-page | ✅ (`/settings/subscription`) | ✅ | RSC loads `mySubscription` + `billingHistory`, cancel/reactivate wired (PR-D) |
| BFF schema + resolvers | — | ✅ | pricingPlans, mySubscription, billingHistory, checkoutStatus, createCheckoutSession, cancelSubscription, reactivateSubscription (2026-04-23) |

### 3.8. Flow 08 — Notifications (90%)

| Sub-flow | UI | Wire | Ghi chú |
|----------|----|------|---------|
| `/notifications` page | ✅ | ✅ | RSC + client, mark-read/mark-all-read actions (2026-04-23) |
| Bell dropdown | ✅ (topbar) | ✅ | `AppTopbar` polls `unreadNotificationCount` via server action every 30s, renders numeric badge (PR-E) |
| `/settings/notifications` | ✅ | ✅ | `updateNotificationPrefs` server action wired (2026-04-23) |
| Push token register | — | 🔴 | |
| BFF schema + resolvers | — | ✅ | notifications, unreadNotificationCount, markNotificationsRead, markAllNotificationsRead, updateNotificationPrefs (2026-04-23) |

---

## 4. Bugs P0 phát hiện hôm nay

| # | Bug | Vị trí | Tác hại | Status |
|---|-----|--------|---------|--------|
| 1 | `logoutAction` không revoke refresh token server-side | [lib/auth/actions.ts](../apps/web/lib/auth/actions.ts) | Refresh token leak vẫn dùng 30d | ✅ Fixed 2026-04-21 |
| 2 | `ADD_CARD_MUTATION` client không có resolver BFF | [mutations.ts](../apps/web/lib/api/mutations.ts) | Thêm từ vào deck → 500 error | ✅ Fixed 2026-04-22 |
| 3 | `SEARCH_WORDS_QUERY` không có resolver BFF | [queries.ts](../apps/web/lib/api/queries.ts) | deck/actions.ts dùng query không tồn tại | ✅ Fixed 2026-04-22 (removed, addCard now takes lemma/meaning directly) |
| 4 | Password min-length mismatch: form `10`, action `8` | sign-up page vs actions.ts | Client bypass validation | ✅ Fixed 2026-04-21 |
| 5 | entitlement consumer lắng nghe sai topic billing | [entitlement/consumer.go](../services/entitlement/internal/messaging/consumer.go) | Upgrade subscription → không cấp entitlement | ✅ Fixed 2026-04-22 |
| 6 | gamification consumer lắng nghe orphan `progress.xp.awarded` | [gamification/consumer.go](../services/gamification/internal/messaging/consumer.go) | Topic không ai publish → consumer vô tác dụng | ✅ Fixed 2026-04-22 |
| 7 | identity/learning/vocabulary/gamification không có outbox | [flows/00-overview.md §5](./flows/00-overview.md#5-outbox-pattern) | Mất event khi Kafka tạm down | 🔴 P1 — cần migration |

---

## 5. Việc tiếp theo (ưu tiên thực hiện)

### P0 — ✅ Đã xong (2026-04-22)

1. ✅ **Fix logout security** — `serverLogout(refreshToken)` + best-effort `.catch()`.
2. ✅ **Fix Kafka billing topics** — entitlement consumer: `activated` → `created`, `cancelled` → `canceled`.
3. ✅ **Fix Kafka gamification topics** — consumer subscribe đúng `learning.lesson.completed` (bỏ orphan `progress.xp.awarded`, `progress.streak.updated`).
4. ✅ **Thêm `addCard` mutation vào BFF** — schema + resolver + `VocabularyDataSource.addCard()` → vocabulary-service `POST /api/v1/vocab/decks/:id/cards`.
5. ✅ **Thống nhất password validation** — form + action cùng `>= 10`.

### P1 — ✅ Hoàn thành Wave 1 (2026-04-23)

1. ✅ **Learn Mode RSC** — `learn/page.tsx` (RSC) + `learn-client.tsx` thay thế mock `vocab-data.ts`.
2. ✅ **AI Tutor conversation detail RSC** — `page.tsx` (RSC) + `conversation-client.tsx` + `tutorChatAction`, `renameConversationAction`, `deleteConversationAction`.
3. ✅ **Notifications BFF** — schema types + resolvers + `NotificationDataSource` (`notifications`, `unreadNotificationCount`, `markNotificationsRead`, `markAllNotificationsRead`, `updateNotificationPrefs`).
4. ✅ **Notifications frontend** — `/notifications` RSC+client + `/settings/notifications` saves prefs.
5. ✅ **Billing BFF** — schema types + resolvers + `BillingDataSource` (`pricingPlans`, `mySubscription`, `billingHistory`, `checkoutStatus`, `createCheckoutSession`, `cancelSubscription`, `reactivateSubscription`).
6. ✅ **Billing frontend** — checkout confirm → real `createCheckoutSession`, `/checkout/success` polls real status, `/settings/billing` RSC loads subscription + invoices.

### P2 — Còn lại (tuần tiếp)

**Flow 02 — Onboarding** (40% → cần ~60% thêm)
- Quyết định: 1 trang state machine hay tách 8 sub-route.
- Thêm BFF: `onboardingState`, `placementTest`, `updateOnboarding`, `submitPlacement`, `completeOnboarding`.
- Service: learning-service cần `user_onboarding` table + assessment-service grading.

**Flow 03 — Lesson player** (65% → cần `todayMission`, `srsDueCount`, `lessonContent`, `submitAnswer`)
- Thêm BFF: `lessonContent(lessonId)`, `submitAnswer`, `todayMission`.
- Wire `/lesson/[id]` load real content + submit answer.
- Wire `/learn` unit listing (nested `units` trong track card).

**Flow 06 — Progress detail** (85% → cần `skillScores`, `activityHeatmap`, `certPredict`)
- Thêm BFF: `skillScores`, `activityHeatmap`, `certPredict` (schema đã chuẩn, cần resolver + datasource).
- Wire `/progress` tabs: skill radar + heatmap calendar.

### P3 — Sau MVP1

**Flow 07 — Billing còn thiếu**:
- `/pricing` public page (cần thêm route trong `(public)` group).
- `/settings/subscription` cancel/reactivate UI.
- `/shop` gems/powerups.
- ~~Bell dropdown `unreadNotificationCount` poll mỗi 30s trong topbar.~~ (✅ done in PR-E)

**Settings sub-pages**:
- `/settings/learning` — daily goal + reminder.
- `/settings/languages` — add/remove learning languages.
- `/settings/privacy`, `/settings/accessibility`, `/settings/connected-accounts`, `/settings/data-export`.

### P4 — Sau MVP1 (tuần 8+): Test Prep + Social + Practice Modules

- Flow Test Prep (diagnostic, mock test, study plan) — cần assessment + content service ổn.
- Community, challenges, language-exchange — Phase 2 social stack.
- Practice modules khác: listening, reading, writing, speaking, grammar, pronunciation.
- Tutor marketplace, live classes — Phase 2.

---

## 6. Ước tính công sức

| Wave | Thời lượng | Backend work | Frontend wire |
|------|-----------|--------------|---------------|
| P0 fix ngay | 1-2 ngày | Fix Kafka + outbox + addCard | 4 action files |
| P1 Wave 1 | 2 tuần | ~20 resolvers + 10 service endpoints | 15 pages |
| P2 Wave 2 | 2 tuần | ~15 resolvers + onboarding service | 12 pages |
| P3 Wave 3 | 2 tuần | ~15 resolvers + billing + notification consumer rules | 15 pages |
| P4 phase-2-ish | 4+ tuần | Test prep + social | 40+ pages |

**MVP1 full wire**: khoảng **6-7 tuần** nếu 1 dev fulltime làm cả BE + FE, **3-4 tuần** nếu có 2-3 người tách việc.

---

## 7. Blockers không phải code

1. **Service chưa verified**: `content`, `srs` (Rust), `assessment`, `gamification`, `notification`, `ai-tutor` (Python), `speech-ai`, `llm-gateway` — chưa chạy E2E.
2. **Dictionary service**: rỗng — Flow 04 "add card auto fill IPA/meaning" cần.
3. **Media service**: rỗng — audio upload cho listening/speaking cần.
4. **Kafka + outbox relay chưa chạy**: local dev có thể stub, nhưng production cần deploy.
5. **Email provider (SendGrid/SES)**: cần account + template approval.
6. **Push provider (FCM/APNs)**: cần iOS cert, Android project.
7. **Stripe + VNPay account**: sandbox keys + webhook URLs.

---

## 8. Checklist trước khi ship MVP1

- [ ] 6 bugs P0 fix xong
- [ ] 4 Kafka naming thống nhất
- [ ] 4 service (identity, learning, vocabulary, gamification) migrate outbox
- [ ] Wave 1 wire xong (auth đầy đủ + vocab + lesson)
- [ ] Wave 2 wire xong (onboarding + AI history + progress)
- [ ] Wave 3 wire xong (billing + notifications + settings)
- [ ] E2E test: register → onboarding → complete 3 lessons → see XP/streak/badge → review cards → chat AI → upgrade → receive invoice email
- [ ] Load test: 100 concurrent users, p95 < 1s cho dashboard
- [ ] Security review: JWT/cookie/OAuth/webhook signature
- [ ] Observability: Prometheus + Grafana dashboard cho latency, error rate, Kafka lag

---

> **Tài liệu cập nhật hàng tuần**. Khi wire xong 1 flow → update % và xoá dòng khỏi §5.
