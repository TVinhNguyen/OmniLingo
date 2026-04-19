# WEB-IMPLEMENTATION-STATUS.md

Trạng thái implement **frontend ↔ backend** cho `apps/web/`. Cập nhật lần cuối: 2026-04-19.

> **Quy chuẩn**: xem [FRONTEND-BACKEND-STANDARDS.md](./FRONTEND-BACKEND-STANDARDS.md)

---

## Tổng quan nhanh

| Nhóm | Tổng | Xong (real data) | Mock/Placeholder |
|------|-----:|--------:|--------:|
| Infrastructure | 5 | 5 | 0 |
| Auth | 3 | 3 | 0 |
| App pages | 15+ | 8 | 7+ |

---

## ✅ Infrastructure — HOÀN THÀNH

| File | Mô tả |
|------|-------|
| `middleware.ts` | Route protection — 16 path prefix, `?next=` redirect-back |
| `lib/auth/session.ts` | httpOnly cookie: `omni_at` (900s) + `omni_rt` (2592000s), SameSite=Strict |
| `lib/auth/actions.ts` | Server Actions: `loginAction`, `registerAction`, `logoutAction` |
| `lib/api/client.ts` | GraphQL client với **auto token refresh** khi `UNAUTHENTICATED` |
| `lib/api/auth.ts` | Auth REST → identity-service (`:3001`): `serverLogin`, `serverRegister`, `serverRefresh` |
| `lib/api/types.ts` | TypeScript types mirror BFF schema (8 types) |
| `lib/api/queries.ts` | 8 GraphQL queries |
| `lib/api/mutations.ts` | 4 GraphQL mutations |
| `.env.example` / `.env.local` | `NEXT_PUBLIC_BFF_URL`, `IDENTITY_SERVICE_URL`, `NEXT_PUBLIC_APP_URL` |

---

## ✅ Auth Pages — HOÀN THÀNH

### `/sign-in`
- **Pattern**: `"use client"` + `useActionState(loginAction)`
- **Real data**: POST `identity-service/auth/login` → set `omni_at` + `omni_rt` cookies
- **Features**: `?next=` redirect-back, error Vietnamese messages, loading state

### `/sign-up`
- **Pattern**: `"use client"` + `useActionState(registerAction)`
- **Real data**: POST `identity-service/auth/register` → set cookies
- **Features**: `displayName` field, password ≥ 8 ký tự validation

### Logout
- **Pattern**: `<form action={logoutAction}>` từ Settings page
- **Real data**: `clearSession()` → xóa cookies → redirect `/`

---

## ✅ App Pages — HOÀN THÀNH (real BFF data)

### `/dashboard`
- **Files**: `app/(app)/dashboard/page.tsx`
- **Pattern**: async RSC
- **Query**: `DASHBOARD_QUERY` → `user + progress + entitlement + myTracks + myDecks`
- **Mock fallback**: ✅ (BFF offline → mock data)

### `/learn`
- **Files**: `app/(app)/learn/page.tsx` (RSC) + `learn/learn-client.tsx` (client)
- **Pattern**: RSC wrapper → client component
- **Query**: `MY_TRACKS_QUERY` → track title, language, level, progressPct
- **Mock fallback**: ✅ (2 tracks mẫu)
- **Note**: Lesson nodes dùng mock exercises (content-service Phase 1.5)

### `/practice/vocabulary`
- **Files**: `app/(app)/practice/vocabulary/page.tsx` (RSC) + `vocabulary-client.tsx` (client) + `actions.ts`
- **Pattern**: RSC wrapper → client component + Server Actions
- **Query**: `MY_DECKS_QUERY` → id, name, cardCount, dueCount, masteredCount
- **Mutation**: `CREATE_DECK_MUTATION`
- **Mock fallback**: ✅

### `/ai-tutor`
- **Files**: `app/(app)/ai-tutor/page.tsx` (RSC) + `ai-tutor-client.tsx` (client) + `actions.ts`
- **Pattern**: RSC check entitlement → client chat UI → Server Action
- **Query (RSC)**: `checkFeature("ai_tutor_messages")` → quota
- **Mutation (Action)**: `TUTOR_CHAT_MUTATION` → real AI response, `conversationId` persistent
- **Features**: optimistic message append, typing indicator, quota counter, EXPLAIN_MUTATION
- **Mock fallback**: ✅ (quota = 10 nếu BFF offline)

### `/progress`
- **Files**: `app/(app)/progress/page.tsx` (RSC) + `progress-client.tsx` (client)
- **Pattern**: RSC → client
- **Query**: `MY_PROGRESS_QUERY` → streak, totalXp, minutesLearned, wordsMastered
- **Mock fallback**: ✅
- **Note**: Weekly chart dùng mock data (time-series endpoint Phase 1.5)

### `/profile`
- **Files**: `app/(app)/profile/page.tsx` (RSC) + `profile-client.tsx` (client)
- **Pattern**: RSC parallel fetch → client
- **Queries**: `ME_QUERY` (username, avatarUrl, bio, createdAt) + `MY_TRACKS_QUERY` (language progress)
- **Mock fallback**: ✅
- **Note**: Badges + Activity tab là mock (Phase 1.5)

### `/lesson/[id]`
- **Files**: `app/(app)/lesson/[id]/page.tsx` (RSC) + `lesson-player.tsx` (client)
- **Pattern**: RSC → mutation → client
- **Mutation**: `START_LESSON_MUTATION` → `sessionId` từ BFF
- **Features**: multiple-choice + translate exercises, XP tracking, completion screen
- **Note**: Exercise content là mock (content-service Phase 1.5)

### `/settings`
- **Files**: `app/(app)/settings/page.tsx` (RSC) + `settings-client.tsx` (client)
- **Pattern**: RSC → client
- **Query**: `ME_QUERY` → pre-fill username, bio
- **Real action**: Logout button → `logoutAction` → clear cookies → redirect
- **Note**: Save profile cần thêm `updateProfile` mutation vào BFF (Phase 1.5)

### `/test-prep`
- **Files**: `app/(app)/test-prep/page.tsx` (RSC) + `test-prep-client.tsx` + `test-prep-gate.tsx`
- **Pattern**: RSC entitlement check → gate hoặc full page
- **Query**: `checkFeature("test_prep")` → `allowed`, `quota`
- **Features**: Upgrade wall cho Free users, quota hiển thị cho Paid users
- **Note**: Nội dung đề thi mock (content-service Phase 1.5)

---

## ⚠️ App Pages — CHƯA WIRE (mock/placeholder)

| Page | State | Lý do defer |
|------|-------|-------------|
| `/practice/grammar` | Mock UI | content-service |
| `/practice/listening` | Mock UI | speech-ai-service |
| `/practice/speaking` | Mock UI | speech-ai-service |
| `/practice/pronunciation` | Mock UI | speech-ai-service |
| `/practice/reading` | Mock UI | content-service |
| `/practice/writing` | Mock UI | writing-ai-service |
| `/test-prep/ielts` | Mock UI | content-service |
| `/shop` | Mock UI | billing-service |
| `/leaderboard` | Mock UI | gamification-service (Phase 1.5) |
| `/achievements` | Mock UI | gamification-service (Phase 1.5) |
| `/community` | Mock UI | social-service (Phase 2) |
| `/messages` | Mock UI | notification-service (Phase 1.5) |
| `/notifications` | Mock UI | notification-service (Phase 1.5) |
| `/tutors` / `/tutors/[id]` | Mock UI | tutor-service (Phase 2) |

---

## 🔵 BFF Queries / Mutations đang dùng

| Operation | Dùng ở | Endpoint |
|-----------|--------|---------|
| `DASHBOARD_QUERY` | `/dashboard` | `web-bff :4000/graphql` |
| `MY_TRACKS_QUERY` | `/learn`, `/profile` | `web-bff :4000/graphql` |
| `MY_DECKS_QUERY` | `/practice/vocabulary` | `web-bff :4000/graphql` |
| `MY_PROGRESS_QUERY` | `/progress` | `web-bff :4000/graphql` |
| `ME_QUERY` | `/profile`, `/settings` | `web-bff :4000/graphql` |
| `CHECK_FEATURE_QUERY` | `/ai-tutor`, `/test-prep` | `web-bff :4000/graphql` |
| `START_LESSON_MUTATION` | `/lesson/[id]` | `web-bff :4000/graphql` |
| `CREATE_DECK_MUTATION` | `/practice/vocabulary` | `web-bff :4000/graphql` |
| `TUTOR_CHAT_MUTATION` | `/ai-tutor` | `web-bff :4000/graphql` |
| `EXPLAIN_MUTATION` | `/ai-tutor` | `web-bff :4000/graphql` |
| `POST /auth/login` | `loginAction` | `identity-service :3001` |
| `POST /auth/register` | `registerAction` | `identity-service :3001` |
| `POST /auth/refresh` | `gql()` auto-refresh | `identity-service :3001` |

---

## 🟡 Cần làm tiếp (Phase 1.5)

1. **`updateProfile` mutation** → thêm vào BFF schema → wire Settings save button
2. **Weekly time-series query** → thêm vào BFF → replace mock chart data trong `/progress`
3. **Content-service integration** → real exercises cho `/lesson/[id]`
4. **`shop/page.tsx`** → billing-service entitlement gate
5. **`notifications/page.tsx`** → mark-read action → notification-service
6. **E2E test**: sign-in → dashboard → vocabulary → logout flow

---

## 🔴 Không làm trong MVP (Phase 2+)

- `/community` — social-service
- `/tutors` + `/tutors/[id]` — tutor marketplace
- `/messages` — real-time messaging
- Live group classes
- Writing AI grading UI
- Voice AI tutor UI
