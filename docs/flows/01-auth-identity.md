# Flow 01 — Auth & Identity

> Register, Login, OAuth, Refresh, Logout, Verify email, Forgot/Reset password, MFA, Change password, Delete account.
>
> **Service chính**: `identity-service:3001` (Go + Postgres `identity_db`).
> **Không qua BFF** — auth đi REST trực tiếp.

---

## 1. Register (Email + Password)

### Trigger
- Page: `/sign-up` → form submit.

### Sequence

```
User ─► Next.js /sign-up
         ├─ Server Action: registerAction()
         │    ├─ validate input (email format, password strength)
         │    └─ POST identity:3001/api/v1/auth/register
         │          { email, password, displayName, nativeLanguage }
         │
         ├─ identity:
         │    1. BEGIN TX
         │    2. INSERT users (hashed password bcrypt cost 12)
         │    3. INSERT user_profile (default)
         │    4. Publish identity.user.registered (direct publish ⚠️ — cần outbox)
         │    5. Send verification email (via notification)
         │    6. COMMIT
         │    → 201 { user: { id, email, displayName, emailVerified: false } }
         │
         ├─ Server Action: auto-login
         │    └─ POST identity:3001/api/v1/auth/login → { access_token, refresh_token }
         │
         └─ Set cookies (omni_at, omni_rt) → redirect /onboarding
```

### Kafka fan-out

| Consumer | Hành động khi nhận `identity.user.registered` |
|----------|----------------------------------------------|
| entitlement | Tạo record `user_entitlements(user_id, plan='free')`, insert default features |
| gamification | Tạo `user_gamification(user_id, xp=0, level=1, streak=0)` |
| notification | Send welcome email (template `welcome_v1`) |
| learning | Tạo `user_preferences(user_id)` placeholder — chờ onboarding điền |

### Response contract (UI cần)

```typescript
{ userId: string, email: string, requiresEmailVerify: boolean }
```

### Edge cases

| Case | Xử lý |
|------|-------|
| Email đã tồn tại | 409 → UI hiện "Email đã được đăng ký. [Đăng nhập]" |
| Email hợp lệ nhưng SMTP fail | 201 vẫn trả về, email gửi lại từ /settings |
| Password < 8 ký tự / không có số | 400 → UI show inline error |
| Rate limit (5 registers/IP/h) | 429 → UI show cooldown |

---

## 2. Login (Email + Password)

### Trigger
- Page: `/sign-in` → submit.

### Sequence

```
User ─► Next.js /sign-in
         ├─ POST identity:3001/api/v1/auth/login
         │        { email, password, mfaCode? }
         │
         ├─ identity:
         │    1. SELECT users WHERE email=? (+ check account_locked, email_verified)
         │    2. bcrypt compare password
         │    3. Nếu user có MFA enabled:
         │         • Nếu request không có mfaCode → 401 { requiresMfa: true, mfaChallengeId }
         │         • Nếu có → verify TOTP
         │    4. Generate JWT RS256 (access 15m, refresh 30d)
         │    5. INSERT refresh_tokens (hashed)
         │    6. Publish identity.user.logged_in (audit only)
         │    → { access_token, refresh_token, expires_in: 900, user: {...} }
         │
         └─ Next.js: set 2 cookies → redirect ?next=/dashboard
```

### MFA flow (nếu enabled)

```
Login → 401 { requiresMfa: true, mfaChallengeId }
 → UI navigate /sign-in?mfa=<challengeId>
 → User nhập 6 số TOTP từ authenticator
 → POST /auth/login với { email, password, mfaCode, mfaChallengeId }
 → Trả về token pair như login thường.
```

### Edge cases

| Case | Response | UI xử lý |
|------|----------|----------|
| Sai mật khẩu | 401 `INVALID_CREDENTIALS` | "Email hoặc mật khẩu sai" (không tiết lộ field nào sai) |
| Chưa verify email | 403 `EMAIL_NOT_VERIFIED` | Link gửi lại email |
| Account locked (> 5 lần sai) | 423 `ACCOUNT_LOCKED` | "Tài khoản khoá tạm 15 phút" |
| MFA code sai | 401 `INVALID_MFA_CODE` | Input nhập lại |

---

## 3. OAuth (Google / Facebook / Apple)

### Trigger
- Click nút social trong `/sign-in` hoặc `/sign-up`.

### Sequence

```
User ─► click "Continue with Google"
         ├─ Next.js redirect → identity:3001/api/v1/auth/oauth/google/start
         ├─ identity redirect → accounts.google.com/... (state nonce cookie)
         ├─ User authorize → Google redirect → /auth/callback/google?code=...
         ├─ Server Action oauthCallbackAction:
         │    └─ POST identity:3001/api/v1/auth/oauth/google/callback { code, state }
         │
         ├─ identity:
         │    1. Verify state nonce
         │    2. Exchange code for Google token
         │    3. Fetch userinfo (email, name, picture)
         │    4. UPSERT users by email (link provider_id)
         │    5. Nếu user mới → publish identity.user.registered
         │    6. Generate JWT pair
         │    → { access_token, refresh_token, isNewUser: bool }
         │
         └─ Next.js: set cookies → redirect
              isNewUser ? /onboarding : /dashboard
```

### Pages cần
- `/auth/callback/google`, `/auth/callback/facebook`, `/auth/callback/apple` — xử lý redirect.

---

## 4. Refresh token

### Trigger
- Next.js middleware hoặc server action nhận 401 từ BFF → auto refresh.
- Hoặc `omni_at` expired (kiểm qua `expires_at` lưu trong JWT claim).

### Sequence

```
Next.js Server Action (e.g. any protected action)
  ├─ attempt: GraphQL mutation to BFF với omni_at
  ├─ nếu 401:
  │    └─ POST identity:3001/api/v1/auth/refresh (gửi omni_rt cookie)
  │
  ├─ identity:
  │    1. Verify refresh_token (check DB, not revoked, not expired)
  │    2. Rotate: revoke old, issue new pair
  │    3. → { access_token, refresh_token, expires_in }
  │
  └─ Next.js: update cookies → retry original request
```

**Rotation policy**: mỗi refresh sinh pair mới, token cũ bị revoke ngay. Nếu phát hiện replay (token đã dùng) → revoke toàn bộ refresh family của user → force re-login (anti-theft).

---

## 5. Logout

### Trigger
- Click "Đăng xuất" trong user menu hoặc `/settings`.

### Sequence

```
User ─► Server Action logoutAction()
         ├─ POST identity:3001/api/v1/auth/logout (gửi omni_rt)
         ├─ identity:
         │    1. DELETE refresh_tokens WHERE token_hash=?
         │    2. Publish audit event
         │    → 204
         │
         └─ Next.js: clear cookies (omni_at, omni_rt) → redirect /
```

---

## 6. Verify Email

### Trigger
- User click link trong email `https://omnilingo.io/verify-email?token=<jwt>`.

### Sequence

```
Next.js /verify-email page (RSC)
  ├─ Server-side: POST identity:3001/api/v1/auth/verify-email { token }
  ├─ identity:
  │    1. Decode JWT (verification purpose, 24h TTL)
  │    2. UPDATE users SET email_verified=true WHERE id=?
  │    3. → 200 { ok }
  │
  └─ UI: success message, auto-redirect /dashboard sau 3s
```

### Edge cases
- Token expired → form "Gửi lại email xác thực".
- User đã verify rồi → idempotent, vẫn 200 với message "Email đã xác thực".

---

## 7. Forgot Password

### Trigger
- Page `/forgot-password`.

### Sequence

```
User nhập email → Server Action
  ├─ POST identity:3001/api/v1/auth/forgot-password { email }
  ├─ identity:
  │    1. Look up user (always return 200 để tránh email enumeration)
  │    2. Nếu tồn tại:
  │         a. Generate password_reset_token (UUID, 1h TTL, single-use)
  │         b. INSERT password_resets table
  │         c. Trigger notification service → email với link
  │            https://omnilingo.io/reset-password?token=<uuid>
  │    3. → 200 { ok: true, message: "Nếu email tồn tại, bạn sẽ nhận được link" }
  │
  └─ UI: show confirmation, không tiết lộ email có tồn tại không.
```

### Reset password

```
User click link → /reset-password?token=<uuid>
  ├─ UI: form nhập password mới 2 lần
  ├─ Server Action: POST identity:3001/api/v1/auth/reset-password
  │                 { token, newPassword }
  ├─ identity:
  │    1. SELECT password_resets WHERE token=? AND used=false AND expires_at > NOW()
  │    2. UPDATE users SET password_hash=? WHERE id=?
  │    3. UPDATE password_resets SET used=true
  │    4. Revoke all existing refresh_tokens của user (force re-login mọi device)
  │    5. → 200
  │
  └─ UI: success → redirect /sign-in
```

---

## 8. MFA Enroll / Disable

### Enroll (TOTP)

```
User vào /settings/security → click "Enable 2FA"
  ├─ POST identity:3001/api/v1/auth/mfa/enroll
  ├─ identity:
  │    1. Generate TOTP secret (base32, 32 chars)
  │    2. Store encrypted trong user_mfa (chưa active)
  │    3. → { secret, qrCodeUrl: "otpauth://totp/OmniLingo:email?secret=...&issuer=OmniLingo" }
  │
  ├─ UI: render QR + input 6 số
  │
  └─ POST identity:3001/api/v1/auth/mfa/verify { code }
      ├─ identity:
      │    1. Verify TOTP code
      │    2. UPDATE user_mfa SET enabled=true
      │    3. Generate 10 recovery codes (bcrypt hashed)
      │    4. → { recoveryCodes: [...] } (hiện 1 lần, user phải lưu)
```

### Disable

```
POST /auth/mfa/disable { password } (re-auth required)
→ UPDATE user_mfa SET enabled=false, secret=NULL
```

---

## 9. Change Password (khi đã login)

```
/settings/security → form old + new password
  ├─ POST identity:3001/api/v1/users/me/change-password
  │        { oldPassword, newPassword } (JWT required)
  ├─ identity:
  │    1. Verify oldPassword bcrypt
  │    2. UPDATE users SET password_hash=<new hash>
  │    3. Revoke all refresh tokens (force re-login other devices)
  │    → 200
  └─ UI: toast "Đổi mật khẩu thành công, các thiết bị khác đã bị đăng xuất."
```

---

## 10. Delete Account (GDPR)

```
/settings/account → "Xoá tài khoản" → modal confirm + nhập password
  ├─ POST identity:3001/api/v1/users/me/delete { password, reason? }
  ├─ identity:
  │    1. Verify password
  │    2. Soft delete: UPDATE users SET deleted_at=NOW(), email=<anon>, ...
  │    3. Publish identity.user.deleted { userId, timestamp }
  │    4. → 204
  │
  ├─ Kafka fan-out:
  │    • entitlement: soft delete entitlements
  │    • billing: cancel active subscription (pro-rate refund nếu có)
  │    • vocabulary: anonymize user decks (hoặc xoá nếu không share)
  │    • progress: keep aggregated data anonymized
  │    • gamification: remove from leaderboard
  │    • notification: send "Account deleted" confirmation email
  │
  └─ UI: clear cookies, redirect / với flash message.
```

---

## 11. UI pages liên quan (từ missing-pages doc)

| Page | Status | Flow reference |
|------|--------|---------------|
| /sign-in | ✅ wired | §2 Login, §3 OAuth, MFA |
| /sign-up | ✅ wired | §1 Register |
| /verify-email | ✅ wired | §6 Verify |
| /forgot-password | ⚠️ UI đã có, backend endpoint chưa confirm | §7 |
| /reset-password | ⚠️ UI đã có | §7 |
| /auth/callback/[provider] | 🔴 CHƯA CÓ — cần tạo | §3 |
| /settings/security (2FA + change password) | 🔴 | §8, §9 |
| /settings/account (delete) | 🔴 | §10 |

---

## 12. Tóm tắt events publish từ identity

| Event | Khi nào | Consumer |
|-------|---------|----------|
| `identity.user.registered` | Register thành công | entitlement, gamification, notification |
| `identity.user.logged_in` | Login thành công | audit only (SIEM) |
| `identity.user.deleted` | Xoá account | entitlement, billing, vocabulary, progress, gamification, notification |
| `audit.identity.events` | Mọi security event (login fail, password change, MFA enroll) | SIEM/S3 |

**⚠️ Lưu ý**: Identity đang dùng direct publish (không outbox) — nếu Kafka down khi register, user sẽ tạo được account nhưng không có entitlement → cần migrate sang outbox pattern trước khi ship MVP1.
