# Wiring Status — Frontend ↔ Backend (2026-04-25)

> Đánh giá thực trạng wire UI với backend sau migration v2, đối chiếu với 9 file flow trong [docs/flows/](./flows/).
> **Nguồn dữ liệu**: filesystem `apps/web/` (verified), `services/web-bff/src/schema/schema.ts` (verified), [MIGRATION-V2-STATUS.md](../apps/web/MIGRATION-V2-STATUS.md).
> **Cập nhật 2026-04-25**: Wave BE hoàn thành (T1-T9 + outbox), Bug #7 close. Wave 9 FE wire (Devin D5-D8) đang làm. Sau Wave 9 wire-up dự kiến ~99%.

---

## 1. TL;DR

| Flow | File | UI có? | Wire BFF? | % Done |
|------|------|--------|-----------|--------|
| 00 — Overview (infra) | [00-overview.md](./flows/00-overview.md) | — | — | — |
| 01 — Auth & Identity | [01-auth-identity.md](./flows/01-auth-identity.md) | 100% | **100%** (register+login+refresh+logout+verify+forgot/reset+changePassword+deleteAccount wired) | **100%** |
| 02 — Onboarding | [02-onboarding.md](./flows/02-onboarding.md) | 100% | 95% (5 sub-route + placement test wired, D5) | **95%** |
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

### 3.2. Flow 02 — Onboarding (95%)

| Sub-flow | UI | Wire | Ghi chú |
|----------|----|------|---------|
| RSC dispatcher `/onboarding` | ✅ | ✅ | Fetch `onboardingState` → redirect canonical sub-route or `/dashboard` |
| `/onboarding/language-select` | ✅ | ✅ | `updateOnboarding('language_select', {nativeLang, targetLangs})` |
| `/onboarding/goal-select` | ✅ | ✅ | `updateOnboarding('goal_select', {goal, cert?, targetScore?})` |
| `/onboarding/level-select` | ✅ | ✅ | `updateOnboarding('level_select', {level, dailyMins, reminderTime})` |
| `/onboarding/placement` | ✅ | ✅ | RSC fetch `placementTest(lang, targetLang)` + `submitPlacement` + `updateOnboarding('placement', {cefr, recommendedTrackId})` |
| `/onboarding/done` | ✅ | ✅ | Summary + `completeOnboarding(placementCefr, recommendedTrackId)` → `/dashboard` |
| Resume mid-flow | — | ✅ | Each sub-route guards `state.step !== expected` → redirect dispatcher |
| `/placement-test` legacy | — | ✅ | Redirects to `/onboarding/placement` |
| BFF schema + resolvers | — | ✅ | `onboardingState`, `updateOnboarding`, `completeOnboarding`, `placementTest`, `submitPlacement` (commits `70d1889` T3 + `9e1252b` T4) |

### 3.3. Flow 03 — Dashboard & Learn (85%)

| Sub-flow | UI | Wire | Ghi chú |
|----------|----|------|---------|
| Dashboard aggregate | ✅ | ✅ | Widget có data |
| myTracks | ✅ | ✅ | |
| Today mission | ✅ | ✅ | `todayMission` query, hero hiện minutesToGoal/dueCardCount/xpReward, CTA → `/lesson/{lessonId}` hoặc `/learn` fallback (D6) |
| SRS due count | ✅ | ✅ | `srsDueCount` resolver wired (PR-A) |
| Streak widget chi tiết | ✅ | ✅ | `myStreak` resolver |
| Track detail `/learn/[trackId]` | — | 🟡 | Chưa có route — D8 expand track card thay vì page riêng |
| Unit/Lesson listing | ✅ (trong `/learn`) | 🔴 | Pending **D8** — wire `courses(trackId)` + `units(courseId)` |
| Enroll track | ✅ (button) | ✅ | `enrollTrack` mutation wired |
| Lesson player `/lesson/[id]` | ✅ | ✅ | RSC + `lessonContent(lessonId)` (PR-A) |
| Submit answer | ✅ (client) | ✅ | `submitAnswer(exerciseId, answer)` (PR-A) |
| Complete lesson | ✅ | ✅ | `completeLesson` mutation, emits Kafka event qua outbox |

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

### 3.6. Flow 06 — Progress & Gamification (95%)

| Sub-flow | UI | Wire | Ghi chú |
|----------|----|------|---------|
| myProgress summary | ✅ | ✅ | |
| Weekly chart | ✅ | ✅ | |
| Skill radar | ✅ | ✅ | `skillScores(language)` — language từ `me.learningLanguages[0]` (D7 fix PR-B TODO) |
| Heatmap 365d | ✅ | ✅ | `activityHeatmap(365)` 53×7 grid 5 level (D7) |
| Streak detail (freeze, at risk) | ✅ | ✅ | `myStreak` |
| Achievements | ✅ (`/achievements`) | ✅ | `myAchievements` query, split unlocked/locked, lucide icon mapping (D7) |
| Leaderboard | ✅ (`/leaderboard`) | ✅ | `leaderboard("global","weekly")` + podium top 3 + isCurrentUser highlight (D7) |
| Cert predict | ✅ | 🟡 | `certPredict("ielts")` wired nhưng `cert` còn hardcode — cần **G15** expose `myLearningProfile.certGoal` qua BFF |

### 3.7. Flow 07 — Billing & Payment (85%)

| Sub-flow | UI | Wire | Ghi chú |
|----------|----|------|---------|
| Pricing page | ✅ (`/pricing`) | ✅ | RSC fetches `pricingPlans` với fallback mock (PR-D) |
| Shop | ✅ (`/shop`) | 🔴 | |
| Checkout | ✅ (`/checkout/page.tsx`) | ✅ | Confirm step calls `createCheckoutSession` → redirect (2026-04-23) |
| Checkout success | ✅ (`/checkout/success`) | ✅ | RSC polls `checkoutStatus`, renders real plan/activatedAt (2026-04-23) |
| Checkout cancel | ✅ | ✅ | Retry CTA preserves planId via query, support link to /contact (D2) |
| 3DS callback | ✅ (`/checkout/3ds-callback`) | ✅ | RSC polls `checkoutStatus`, redirects to success or shows failed state (D1) |
| Billing sub-page | ✅ (`/settings/billing`) | ✅ | Invoices + payment-method portal entry only (D3 split); links to /settings/subscription for plan mgmt |
| Subscription sub-page | ✅ (`/settings/subscription`) | ✅ | Plan mgmt only — `mySubscription` + cancel/reactivate; invoice link → /settings/billing (D3 split) |
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
| 7 | identity/learning/vocabulary/gamification không có outbox | [flows/00-overview.md §5](./flows/00-overview.md#5-outbox-pattern) | Mất event khi Kafka tạm down | ✅ Fixed 2026-04-25 (commits `9e94540` infra + `1fe1655` wire 14 publish sites). **Caveat**: `InsertTx` chưa thật transactional (không nhận `pgx.Tx`) — cover Kafka-outage, còn narrow window race condition khi process crash giữa domain commit và outbox insert. Phase 2 refactor thread `pgx.Tx` cho atomic. ADR-010 sẽ doc tradeoff. |

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

### P2 — ✅ Hoàn thành Wave BE (2026-04-25)

1. ✅ **Flow 02 Onboarding BE** — `onboardingState`, `updateOnboarding`, `completeOnboarding`, `placementTest`, `submitPlacement` (commits `70d1889` T3 + `9e1252b` T4). FE wire trong Wave 9 (Devin D5).
2. ✅ **Flow 03 Lesson player BE** — `lessonContent`, `submitAnswer`, `srsDueCount` (PR-A) + `todayMission` (commit `bb8d495` T6) + courses/units list (commit `866cc54` T1). FE wire `/learn` unit listing trong Devin D8.
3. ✅ **Flow 06 Progress BE** — `skillScores` + `certPredict` (PR-B) + `activityHeatmap` (T5) + `myAchievements` (T7) + `leaderboard` fix (T8). FE wire trong Devin D7.
4. ✅ **Outbox Bug #7** — 4 service identity/learning/vocabulary/gamification có outbox + 14 publish site wired (commits `9e94540` + `1fe1655`).
5. ✅ **Architecture cleanup** — learning preferences move từ identity sang learning service (commit `3955e75`).

### P2.5 — Wave 9 FE wire (Devin)

| # | Task | Branch | Status |
|---|------|--------|--------|
| D5 | Onboarding multi-step 5 sub-route | `feature/d5-onboarding-flow` | ✅ Merged |
| D6 | `/settings/learning` + `/settings/languages` + dashboard today mission | `feature/d6-settings-and-mission` | ✅ Merged |
| D7 | `/progress` heatmap + `/achievements` + `/leaderboard` + cleanup PR-B TODO (cert hardcode còn — chờ G15) | `feature/d7-progress-and-gamif` | ✅ Merged |
| D8 | `/learn` unit listing + D1 timeout cap + D2 currency consistency | `feature/d8-learn-units-and-polish` | ⏳ Đang làm |

### P2.6 — Wave 2 BE Hardening (Gemini, [brief đầy đủ](./gemini-tasks-wave2-hardening.md))

| # | Task | Branch | Status |
|---|------|--------|--------|
| G2 | GitHub Actions CI workflow | `chore/g2-github-actions-ci` | ✅ Merged |
| G3 | Prometheus `/metrics` 17/17 service | `feat/g3-prometheus-metrics` | ✅ Merged (kèm scope creep — 8 fix bugs khác) |
| G4 | OpenAPI spec 5 service core | `feat/g4-openapi-spec-5-services` | ✅ Merged (cleanup `apps/web_old` lock-file sau) |
| G1 | Rename `InsertTx` → `Enqueue` + ADR-010 outbox tradeoff | — | ⏳ Pending |
| G5 | Kafka topic naming audit + `kafka-topic-registry.md` | — | ⏳ Pending |
| G6 | Outbox cho assessment + srs (2 service producer còn thiếu) | — | ⏳ Pending |
| G7 | `learning.GetTodayMission` lessonId/Title qua content service | — | ⏳ Pending |
| G8 | `writing-ai-service` minimal stub (proxy LLM gateway) | — | ⏳ Pending |
| G9 | `dictionary-service` stub (auto-fill IPA + meaning) | — | ⏳ Pending |
| G10 | `media-service` stub (audio upload S3 signed URL) | — | ⏳ Pending |
| G11 | Local Prometheus + Grafana docker-compose extension | — | ⏳ Pending |
| G12 | E2E test scaffold Playwright (4 critical journey) — **block ship** | — | ⏳ Pending |
| G13 | Load test k6 scenario (3 scenario, p95 SLO) | — | ⏳ Pending |
| G14 | Security audit OWASP top 10 — **block ship** | — | ⏳ Pending |
| G15 | BFF expose `myLearningProfile.certGoal` (1h, fix D7 TODO) | — | ⏳ Pending |

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
