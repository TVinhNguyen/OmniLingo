# FRONTEND-BACKEND-STANDARDS.md

Quy chuẩn bắt buộc khi implement tương tác giữa **Next.js frontend** (`apps/web/`) và **backend services**. Bất kỳ code nào vi phạm các quy tắc trong file này đều phải được sửa trước khi merge.

> **Tại sao file này tồn tại**: Các quy tắc kiến trúc nằm rải rác trong 13 file `.md`, khiến developer (hoặc AI) dễ giả định sai khi implement. File này rút gọn tất cả thành 1 nguồn sự thật duy nhất cho frontend-backend integration.

---

## 1. Sơ đồ kết nối — PHẢI tuân thủ

```
Browser ──→ Next.js Server (SSR / RSC / Server Actions)
              │                    │
              │ (Auth REST)        │ (Data GraphQL)
              ▼                    ▼
        identity-service       web-bff (:4000/graphql)
           (:3001)               │ (Mercurius + Fastify)
                                 │
                                 ▼
                         Domain services (gRPC/REST)
                         identity, learning, content,
                         vocabulary, srs, assessment,
                         progress, gamification, billing,
                         entitlement, ai-tutor, speech-ai...
```

### Quy tắc tuyệt đối:

| Quy tắc | Chi tiết |
|---------|---------|
| **Auth calls → identity-service trực tiếp** | Login, register, refresh, logout gọi `IDENTITY_SERVICE_URL` (`:3001`). BFF KHÔNG có REST proxy — chỉ phục vụ GraphQL. |
| **Data calls → web-bff qua GraphQL** | Mọi truy vấn dữ liệu (dashboard, decks, tracks, progress, entitlement, ai-tutor) đi qua `NEXT_PUBLIC_BFF_URL` (`:4000/graphql`). |
| **Browser KHÔNG BAO GIỜ gọi trực tiếp backend** | Mọi request đều đi qua Next.js server (RSC / Server Action / Route Handler). Client JS chỉ nói chuyện với Next.js server. |
| **Service KHÔNG truy cập DB service khác** | Chỉ qua API hoặc Kafka event. (Ref: `04-microservices-breakdown.md` §quy ước #7) |

---

## 2. Authentication — Cookie Strategy

### 2.1. Token storage

| Token | Storage | TTL | `maxAge` (giây) | Cookie name |
|-------|---------|-----|-----------------|-------------|
| Access token (JWT RS256) | httpOnly cookie | 15 phút | `900` (15 × 60) | `omni_at` |
| Refresh token (opaque) | httpOnly cookie | 30 ngày | `2592000` (30 × 24 × 3600) | `omni_rt` |

**Cookie attributes** (bắt buộc):
```typescript
{
  httpOnly: true,                              // JS không truy cập được
  secure: process.env.NODE_ENV === "production", // HTTPS only ở prod
  sameSite: "strict",                          // Không gửi cross-site
  path: "/",                                   // App-wide
}
```

> **Tại sao SameSite=Strict**: Doc `09-security-and-compliance.md` §5.3 yêu cầu. Cookies chỉ được đọc server-side bởi Next.js, không gửi cross-origin.

### 2.2. JWT Claims

```json
{
  "sub": "uuid-user-id",
  "scopes": ["user"],
  "plan_tier": "free|plus|pro|ultimate",
  "lang": "en",
  "iat": 1713456789,
  "exp": 1713457689
}
```
**KHÔNG chứa PII** (email, tên, phone) trong JWT. (Ref: `09-security-and-compliance.md` §2.2)

### 2.3. Auth endpoints (identity-service)

```
POST /api/v1/auth/register    → { user }  (then auto-login for tokens)
POST /api/v1/auth/login       → { access_token, refresh_token, expires_in, token_type }
POST /api/v1/auth/refresh     → { access_token, refresh_token, expires_in, token_type }
                                 Body: { refresh_token: "..." }
POST /api/v1/auth/logout      → 204
POST /api/v1/auth/oauth/{provider}/callback
GET  /api/v1/users/me         → User profile
PATCH /api/v1/users/me        → Updated User profile
```

### 2.4. Token refresh lifecycle

```
Request → GQL client → BFF trả 200 (OK)
                ✅ Return data

Request → GQL client → BFF trả UNAUTHENTICATED
                │
                ▼
         Đọc refresh_token từ cookie
                │
                ▼
         POST /auth/refresh → identity-service
                │
                ├── 200 OK → ghi access_token mới vào cookie → retry request
                │
                └── 401 → refresh cũng hết hạn → return error (middleware redirect /sign-in)
```

**File implement**: `lib/api/client.ts` — hàm `gql()` phải có logic retry.

### 2.5. Middleware route protection

| Route prefix | Hành vi |
|-------------|---------|
| `/dashboard`, `/learn`, `/lesson`, `/practice`, `/test-prep`, `/ai-tutor`, `/tutors`, `/community`, `/progress`, `/profile`, `/achievements`, `/shop`, `/settings`, `/leaderboard`, `/notifications`, `/messages` | **Protected** — redirect `/sign-in?next={pathname}` nếu không có `omni_at` cookie |
| `/sign-in`, `/sign-up`, `/forgot-password` | **Auth pages** — redirect `/dashboard` nếu đã login |
| `/`, `/courses`, `/pricing`, `/about`, `/blog`, `/help`, `/contact`, `/become-tutor`, `/terms`, `/privacy`, `/cookies` | **Public** — không check auth |

**Login redirect-back**: Sau khi login thành công, đọc `?next=` param và redirect về đó thay vì cứng `/dashboard`.

---

## 3. Data Fetching Pattern

### 3.1. Server Components (RSC) cho queries

```
page.tsx (async RSC)
  → getAccessToken() từ cookie
  → gql(QUERY, {}, token) → web-bff
  → render HTML server-side
  → stream về browser
```

**Quy tắc**:
- Page-level data fetch **PHẢI** ở RSC (`page.tsx`)
- RSC pass data xuống client component qua props
- Client component KHÔNG tự fetch initial data — chỉ nhận props
- Luôn có **mock fallback** khi BFF offline (dev experience)

### 3.2. Server Actions cho mutations

```
form action={serverAction}
  → "use server" function
  → gql(MUTATION, variables, token):
  → revalidatePath() nếu cần
  → redirect() nếu cần
```

**Quy tắc**:
- `redirect()` PHẢI nằm **ngoài** try/catch (nó throw `NEXT_REDIRECT` internally)
- Server Actions return `{ error?: string }` cho UI hiển thị
- Dùng `revalidatePath()` sau mutation để RSC refetch data

### 3.3. Pattern RSC wrapper cho interactive pages

```
📁 practice/vocabulary/
├── page.tsx              ← RSC: fetch data, map BFF→client shape, pass props
├── vocabulary-client.tsx ← "use client": nhận props, render interactive UI
└── actions.ts            ← "use server": mutations (createDeck, etc.)
```

```typescript
// page.tsx (RSC)
export default async function Page() {
  const data = await fetchData();
  return <ClientComponent initialData={data} />;
}

// client-component.tsx
"use client"
export default function ClientComponent({ initialData }: Props) {
  // useState, useEffect, event handlers... 
  // initialData is the real data from BFF
}
```

---

## 4. GraphQL Contract

### 4.1. Schema source of truth

**File BFF (source)**: `services/web-bff/src/schema/schema.ts`

Khi thêm/sửa field, **phải update theo thứ tự** — BFF schema trước, sau đó 3 file frontend:

```
[1] services/web-bff/src/schema/schema.ts   ← source of truth (BFF)
        │
        ├─→ [2] apps/web/lib/api/types.ts       ← TS type mirrors
        ├─→ [3] apps/web/lib/api/queries.ts     ← query field selections
        └─→ [4] apps/web/lib/api/mutations.ts   ← mutation shapes
```

> Không được đổi frontend types rồi mới đổi BFF schema — luôn đổi schema trước để tránh type drift.

### 4.2. Naming convention

| BFF Schema | Frontend TS | Ví dụ |
|-----------|-------------|-------|
| `snake_case` (REST response từ domain service) | `camelCase` (TypeScript) | `access_token` → `accessToken` |
| GraphQL field | `camelCase` | `cardCount`, `dueCount` |
| Query name | `SCREAMING_SNAKE` | `DASHBOARD_QUERY` |
| Mutation name | `SCREAMING_SNAKE` | `CREATE_DECK_MUTATION` |

### 4.3. Available queries / mutations (Current)

**Queries:**
```graphql
dashboard        → Dashboard!         # Aggregated: user + progress + entitlement + tracks + decks
me               → User!              # Current user profile  
myEntitlements   → Entitlement!       # Plan tier + features
myTracks         → [LearningTrack!]!  # User's learning tracks
lessons(unitId)  → [Lesson!]!         # Lessons in a unit
myDecks          → [Deck!]!           # User's vocabulary decks
checkFeature(code) → FeatureSummary!  # Single feature check
myProgress       → ProgressSummary!   # XP, streak, minutes, words
```

**Mutations:**
```graphql
startLesson(lessonId)                         → StartLessonResult!
createDeck(name, language)                    → Deck!
tutorChat(conversationId?, message, language?) → ChatResult!
explain(text, context?, language?)            → ExplainResult!
```

---

## 5. Environment Variables

### Frontend (`apps/web/`)

| Variable | Mặc định | Mô tả |
|----------|---------|-------|
| `NEXT_PUBLIC_BFF_URL` | `http://localhost:4000/graphql` | Web-BFF GraphQL endpoint |
| `IDENTITY_SERVICE_URL` | `http://localhost:3001` | Identity service (auth calls, server-only) |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Frontend public URL |

**Quy tắc**:
- `NEXT_PUBLIC_*` = truy cập được từ client bundle (CHỈ dùng cho URL public)
- Không prefix `NEXT_PUBLIC_` = server-only (KHÔNG LỘ qua client JS)
- `IDENTITY_SERVICE_URL` **KHÔNG** được prefix `NEXT_PUBLIC_` vì chỉ Next.js server gọi

### BFF (`services/web-bff/`)

#### Service URLs (gọi downstream qua gRPC/REST)

| Variable | Default port | Service |
|----------|-------------|--------|
| `IDENTITY_SERVICE_URL` | `:3001` | identity-service (JWKS + user API) |
| `LEARNING_SERVICE_URL` | `:3002` | learning-service |
| `CONTENT_SERVICE_URL` | `:3003` | content-service |
| `VOCABULARY_SERVICE_URL` | `:3004` | vocabulary-service |
| `SRS_SERVICE_URL` | `:3005` | srs-service |
| `ASSESSMENT_SERVICE_URL` | `:3006` | assessment-service |
| `PROGRESS_SERVICE_URL` | `:3007` | progress-service |
| `GAMIFICATION_SERVICE_URL` | `:3008` | gamification-service |
| `NOTIFICATION_SERVICE_URL` | `:3009` | notification-service |
| `BILLING_SERVICE_URL` | `:3010` | billing-service |
| `ENTITLEMENT_SERVICE_URL` | `:3016` | entitlement-service |
| `AI_TUTOR_SERVICE_URL` | `:3021` | ai-tutor-service |
| `SPEECH_AI_SERVICE_URL` | `:3022` | speech-ai-service |

#### BFF runtime config

| Variable | Mặc định | Mô tả |
|----------|---------|-------|
| `ENV` | `development` | Runtime environment (`development` / `production`) |
| `PORT` | `4000` | BFF listening port |
| `VERSION` | `dev` | App version string (injected at build) |
| `JWKS_CACHE_TTL_MS` | `3600000` | JWKS public key cache TTL (ms) — default 1 giờ |
| `CACHE_DEFAULT_TTL_SEC` | `60` | Redis response cache TTL (giây) |
| `REDIS_URL` | `redis://localhost:6379` | Redis URL cho response cache |
| `ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:5173` | CORS origin whitelist (comma-separated) |

---

## 6. Security Constraints

### 6.0. GraphQL Error Codes

BFF trả lỗi theo chuẩn GraphQL `extensions.code`. Frontend xử lý theo bảng:

| Code | Ý nghĩa | Frontend action |
|------|---------|----------------|
| `UNAUTHENTICATED` | Token hết hạn hoặc thiếu | Trigger token refresh → retry; nếu refresh fail → redirect `/sign-in` |
| `FORBIDDEN` | Token hợp lệ nhưng không đủ quyền (plan/role) | Hiển thị upgrade prompt hoặc 403 page |
| `BAD_USER_INPUT` | Input validation fail | Hiển thị error message từ `error.message` |
| `NOT_FOUND` | Resource không tồn tại | Hiển thị 404 state trong UI |
| `RATE_LIMITED` | Vượt quota (AI tutor, pronunciation, v.v.) | Hiển thị cooldown / upgrade prompt |
| `INTERNAL_ERROR` | Lỗi upstream service | Hiển thị generic error, không lộ detail |

**Trong `client.ts`**, chỉ `UNAUTHENTICATED` (và `FORBIDDEN` nếu muốn) mới trigger auto-refresh. Các code khác throw để caller tự xử lý.

```typescript
function isAuthError(errors): boolean {
  return errors.some(
    e => e.extensions?.code === "UNAUTHENTICATED"
      || e.message.toLowerCase().includes("jwt expired")
      || e.message.toLowerCase().includes("not authenticated")
  );
}
```

### 6.1. CSRF Protection

Hiện tại mitigated vì:
1. Cookies chỉ đọc **server-side** (bởi Next.js RSC / Server Action)
2. BFF nhận `Authorization: Bearer` header, không đọc cookie trực tiếp
3. Next.js Server Actions có built-in origin verification
4. `SameSite=Strict` ngăn cookie gửi cross-site

### 6.2. CORS (BFF side)

- Whitelist **chỉ** `ALLOWED_ORIGINS` — không wildcard
- Methods: GET, POST, OPTIONS
- Credentials: true
- Allowed headers: `Content-Type`, `Authorization`, `X-Request-ID`
- Exposed headers: `X-Request-ID`

### 6.3. Request ID Propagation

BFF tự sinh `X-Request-ID` nếu không có header đến. **Frontend KHÔNG cần generate** — Next.js server forward request đến BFF, BFF trả về `X-Request-ID` trong response header.

Tuy nhiên nếu muốn trace end-to-end (Next.js → BFF → domain service):
```typescript
// Trong gql() client, optionally forward:
const rid = crypto.randomUUID();
headers["X-Request-ID"] = rid;
// Dùng rid để correlate logs ở frontend nếu cần
```

**Ref**: `services/web-bff/src/app.ts` `onRequest` hook — BFF luôn set `X-Request-ID` + `Vary: Origin`.

### 6.4. JWT Verification (BFF side)

- BFF verify JWT bằng JWKS từ `identity-service/.well-known/jwks.json`
- Algorithm: RS256 only
- Audience: `omnilingo`
- Clock tolerance: 30 giây
- Cache JWKS keys: 1 giờ

### 6.5. Những gì TUYỆT ĐỐI KHÔNG LÀM

| ❌ Cấm | Lý do |
|--------|-------|
| Lưu token trong localStorage / sessionStorage | XSS đọc được → account takeover |
| Gửi password/token qua query string | Lộ trong URL, logs, referrer |
| Client JS gọi trực tiếp identity-service / domain service | Expose internal service; bypass BFF auth |
| Prefix `NEXT_PUBLIC_` cho secret / internal URL | Lộ qua client bundle |
| Hardcode tokens / credentials trong code | Secret scanning sẽ block |
| Lưu PII (email, phone) trong JWT claims | Token có thể bị log/cache ở nhiều nơi |
| `SameSite=None` hoặc `SameSite=Lax` cho auth cookies | Strict theo security doc |
| Gọi `redirect()` bên trong try/catch | Next.js `NEXT_REDIRECT` bị catch → silent fail |

---

## 7. File Structure Reference

```
apps/web/
├── app/
│   ├── (auth)/                     # Auth pages (unprotected layout)
│   │   ├── sign-in/page.tsx        # useActionState(loginAction)
│   │   ├── sign-up/page.tsx        # useActionState(registerAction)
│   │   └── forgot-password/page.tsx
│   ├── (app)/                      # Protected app shell layout
│   │   ├── dashboard/page.tsx      # RSC → gql(DASHBOARD_QUERY)
│   │   ├── practice/
│   │   │   └── vocabulary/
│   │   │       ├── page.tsx        # RSC wrapper → fetchMyDecks()
│   │   │       ├── vocabulary-client.tsx  # "use client" interactive
│   │   │       └── actions.ts      # "use server" mutations
│   │   ├── learn/page.tsx          # RSC → gql(MY_TRACKS_QUERY)
│   │   └── ...
│   └── (marketing)/                # Public marketing pages
├── lib/
│   ├── api/
│   │   ├── client.ts               # gql() with auto token refresh
│   │   ├── auth.ts                 # serverLogin/Register/Refresh → identity-service
│   │   ├── types.ts                # TS types mirror BFF schema
│   │   ├── queries.ts              # GraphQL query strings
│   │   └── mutations.ts            # GraphQL mutation strings
│   └── auth/
│       ├── session.ts              # Cookie read/write (omni_at, omni_rt)
│       └── actions.ts              # Server Actions (login/register/logout)
├── middleware.ts                    # Route protection + redirect
├── .env.example                    # Template
└── .env.local                      # Local secrets (gitignored)
```

---

## 8. Checklist khi implement page mới

- [ ] Page cần auth? → Đảm bảo route prefix ở `middleware.ts` PROTECTED_PATHS
- [ ] Cần data từ BFF? → Dùng RSC pattern (async page → gql → pass props)
- [ ] Cần mutation? → Tạo Server Action trong `actions.ts` cùng folder
- [ ] Data mới từ BFF? → Update `schema.ts` → `types.ts` → `queries.ts` / `mutations.ts` (3 file sync)
- [ ] Interactive UI? → Tách `page.tsx` (RSC) + `*-client.tsx` (client component)
- [ ] Mock fallback? → Có fallback data khi BFF offline
- [ ] Error handling? → Return `{ error: string }` từ Server Action, hiển thị alert
- [ ] Redirect sau mutation? → `redirect()` NGOÀI try/catch
- [ ] ENV mới? → Thêm vào `.env.example` + `.env.local` + BFF `config.ts` nếu cần

---

## 9. Source References

| Rule | Source document |
|------|----------------|
| BFF serves GraphQL only | `services/web-bff/src/app.ts` (chỉ register Mercurius) |
| Auth REST endpoints | `04-microservices-breakdown.md` §1 identity-service |
| JWT RS256, 15min AT, 30d RT | `09-security-and-compliance.md` §2.2 |
| httpOnly + SameSite=Strict | `09-security-and-compliance.md` §5.3 |
| No PII in JWT | `09-security-and-compliance.md` §2.2 |
| CORS whitelist only | `09-security-and-compliance.md` §5.2 |
| Schema-per-service | `05-data-model.md` §2 |
| BFF aggregates via DataLoader | `03-high-level-architecture.md` §4.1 |
| JWKS verification | `services/web-bff/src/middleware/auth.ts` |
| GraphQL schema | `services/web-bff/src/schema/schema.ts` |
| Domain service URLs | `services/web-bff/src/config.ts` |
