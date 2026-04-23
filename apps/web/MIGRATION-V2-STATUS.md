# Migration V2 — Kết quả & Đánh giá chuẩn tích hợp

> Ngày: 2026-04-21 | Tham chiếu: `FRONTEND-BACKEND-INTEGRATION-PLAN.md`, `CLAUDE.md`, `docs/flows/01-auth-identity.md`

---

## 1. Những gì đã hoàn thành

### Phase 0 — Backup & Swap UI shell ✅

| Hành động | Kết quả |
|-----------|---------|
| Backup `apps/web/` → `apps/web_old/` | 2.4MB preserved nguyên vẹn |
| Copy `Frontend_v2/` → `apps/web/` | 105 trang UI (vs 41 trang cũ) |
| `pnpm install` | Done, pnpm v10.33.0 |
| Dev server | HTTP 200 — Next.js 16.2.0 Turbopack |

### Phase 1 — Integration Layer ✅

| File | Status | Ghi chú |
|------|--------|---------|
| `lib/api/client.ts` | ✅ Copied | auto-refresh logic giữ nguyên |
| `lib/api/auth.ts` | ✅ Copied | serverLogin, serverRegister, serverRefresh |
| `lib/api/types.ts` | ✅ Copied + updated | Thêm `DashboardData` alias |
| `lib/api/queries.ts` | ✅ Copied | 9 queries |
| `lib/api/mutations.ts` | ✅ Copied | 5 mutations |
| `lib/auth/session.ts` | ✅ Copied | cookie read/write omni_at, omni_rt |
| `lib/auth/actions.ts` | ✅ Copied + fixed | type `undefined` cho useActionState |
| `middleware.ts` | ✅ Copied | 16 protected paths, `?next=` redirect |
| `.env.example` | ✅ Copied | |

### Phase 2 — Auth Pages ✅

| Page | Trước | Sau |
|------|-------|-----|
| `/sign-in` | `<form action="/dashboard">` | `useActionState(loginAction)` + error + loading |
| `/sign-up` | `<form action="/onboarding">` | `useActionState(registerAction)` + displayName |
| `(auth)/layout.tsx` | Không tồn tại | Tạo mới |

### Phase 3 — Core App Pages (RSC Wrapper Pattern) ✅

| Trang | Pattern | Query/Mutation | Mock fallback |
|-------|---------|---------------|---------------|
| `/dashboard` | RSC page | `DASHBOARD_QUERY` | ✅ |
| `/learn` | RSC + `learn-client.tsx` | `MY_TRACKS_QUERY` | ✅ |
| `/progress` | RSC + `progress-client.tsx` | `MY_PROGRESS_QUERY` + `WEEKLY_PROGRESS_QUERY` | ✅ |
| `/profile` | RSC + `profile-client.tsx` | `ME_QUERY` + `MY_TRACKS_QUERY` | ✅ |
| `/ai-tutor` | RSC + `ai-tutor-client.tsx` | `checkFeature` + `chatAction` | ✅ |
| `settings/actions.ts` | Server Actions | `UPDATE_PROFILE_MUTATION` + logoutAction | — |
| `ai-tutor/actions.ts` | Server Actions | `TUTOR_CHAT_MUTATION` + `EXPLAIN_MUTATION` | — |

### Phase 4 — Verify ✅

- `pnpm exec tsc --noEmit` → **0 errors**
- `pnpm dev` → HTTP 200
- `/dashboard` → HTTP 307 (route protection working)
- `/sign-in` → HTTP 200

---

## 2. Lý do nhiều file "biến mất"

Frontend_v2 là **UI shell hoàn toàn mới** — không kế thừa cấu trúc file cũ. Tất cả file cũ được backup tại `apps/web_old/`. Không có file nào bị xóa vĩnh viễn.

| Từ web_old | Ở web (mới) | Lý do |
|------------|-------------|-------|
| `(app)/lesson/[id]/page.tsx` | `lesson/[id]/page.tsx` (root) | V2 đổi route group |
| `practice/vocabulary/actions.ts` | **Chưa có** | ⚠️ Cần copy lại |
| `practice/vocabulary/vocabulary-client.tsx` | Không cần | V2 rewrite toàn bộ page |
| `practice/vocabulary/decks/[id]/actions.ts` | **Chưa có** | ⚠️ Cần copy lại |
| `practice/vocabulary/decks/new/actions.ts` | **Chưa có** | ⚠️ Cần copy lại |
| `settings/actions.ts` | `settings/actions.ts` | ✅ Tạo mới |
| `ai-tutor/actions.ts` | `ai-tutor/actions.ts` | ✅ Tạo mới |

---

## 3. Đánh giá vs chuẩn FRONTEND-BACKEND-INTEGRATION-PLAN.md

### ✅ Luật bất biến — PASSED

| Luật | Check | Status |
|------|-------|--------|
| Browser không gọi service trực tiếp | `grep -r "fetch.*:3001"` trong `/app` → 0 kết quả | ✅ |
| Auth → REST identity (không mix GQL) | `lib/api/auth.ts` chỉ REST; `client.ts` chỉ GQL | ✅ |
| LLM qua llm-gateway | `tutorChat` → BFF → ai-tutor → llm-gateway | ✅ |
| Entitlement gate feature | AI Tutor check `checkFeature` trước khi allow chat | ✅ |
| RSC page pattern | 5 RSC page: không có `"use client"` | ✅ |
| Mock fallback pattern | try/catch + MOCK constant trong mọi RSC | ✅ |

### ❌ Vi phạm cần sửa — P0

#### Bug 1: `logoutAction` thiếu gọi REST logout identity (BẢO MẬT)

- **Flow 01 §5 yêu cầu**: `POST identity:3001/api/v1/auth/logout` để revoke refresh token trong DB
- **Thực tế**: `logoutAction()` chỉ `clearSession()` → xóa cookie, nhưng **token server vẫn còn sống**
- **Hậu quả**: Refresh token bị leak vẫn dùng được tối đa 30 ngày

#### Bug 2: Password validation mismatch

- **Form** `sign-up/page.tsx`: `minLength={10}`
- **Server Action** `lib/auth/actions.ts`: `password.length < 8`
- Không đồng bộ → client bypass được nếu dùng trực tiếp action

#### Bug 3: `(auth)/layout.tsx` import thừa

- Import `AuthShell` nhưng không dùng
- Vi phạm CLAUDE.md §3: "Remove imports that your changes made unused"

#### Bug 4: 3 vocabulary actions.ts chưa copy

- `practice/vocabulary/actions.ts`
- `practice/vocabulary/decks/[id]/actions.ts`
- `practice/vocabulary/decks/new/actions.ts`
- Vocabulary page đang 100% mock, không gọi được `createDeckAction`

---

## 4. Đánh giá vs chuẩn CLAUDE.md

| Rule | Status | Ghi chú |
|------|--------|---------|
| §1 Think Before Coding | ✅ | Có plan, có backup trước khi replace |
| §2 Simplicity First | ⚠️ | Import thừa trong layout.tsx |
| §3 Surgical Changes | ⚠️ | `progress-client.tsx` còn `xpData` const không dùng (orphan) |
| §4 Goal-Driven Execution | ✅ | TSC 0 errors, dev server working, route protection OK |

---

## 5. Các file chưa wire (làm tiếp)

| File / Route | Trạng thái | Ưu tiên |
|-------------|-----------|---------|
| Vocabulary 3 actions.ts | ⚠️ Chưa copy từ web_old | **P0** |
| `logoutAction` server revoke | ⚠️ Bug bảo mật | **P0** |
| Password validation đồng bộ | ⚠️ Inconsistency | **P0** |
| `/verify-email` | ⚠️ UI có, chưa wire | P1 |
| `/forgot-password` | ⚠️ UI có, endpoint chưa confirm | P1 |
| `/onboarding` | 🔴 Toàn bộ flow chưa wire | P1 |
| `/lesson/[id]` | ⚠️ Chưa wire `startLesson` | P1 |
| Settings sub-pages (account, security...) | ⚠️ UI có, chưa wire | P2 |
| `/leaderboard`, `/achievements` | 🔴 Chưa wire | P2 |

---

## 6. Fix ngay (commands)

```bash
# Fix 1: Copy vocabulary actions.ts từ backup
OLD=apps/web_old NEW=apps/web

cp "$OLD/app/(app)/practice/vocabulary/actions.ts" \
   "$NEW/app/(app)/practice/vocabulary/actions.ts"

cp "$OLD/app/(app)/practice/vocabulary/decks/[id]/actions.ts" \
   "$NEW/app/(app)/practice/vocabulary/decks/[id]/actions.ts"

cp "$OLD/app/(app)/practice/vocabulary/decks/new/actions.ts" \
   "$NEW/app/(app)/practice/vocabulary/decks/new/actions.ts"
```

```typescript
// Fix 2: lib/auth/actions.ts - đồng bộ password check
if (password.length < 10) {   // ← đổi từ 8 thành 10
  return { error: "Mật khẩu phải có ít nhất 10 ký tự." }
}

// Fix 3: (auth)/layout.tsx - xóa import thừa
// Xóa dòng: import { AuthShell } from "@/components/auth/auth-shell"

// Fix 4: logoutAction - gọi serverLogout trước clearSession
export async function logoutAction(): Promise<void> {
  const session = await getSession()           // thêm
  if (session?.refreshToken) {                  // thêm
    await serverLogout(session.refreshToken)    // thêm - implement serverLogout() trong lib/api/auth.ts
      .catch(() => {})                         // best-effort, không block logout
  }
  await clearSession()
  redirect("/")
}
```

---

> **Tổng kết**: Migration đạt ~85% chuẩn. Kiến trúc đúng (RSC + Server Actions + mock fallback). 4 bugs P0 cần fix ngay, đặc biệt logout security.
