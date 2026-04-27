# OmniLingo Security Audit — OWASP Top 10 (2026-04)

**Date**: 2026-04-25  
**Auditor**: Gemini (Automated + Manual code review)  
**Scope**: All services in `services/` and `apps/web`  
**Branch**: `main` + `feat/wave2-hardening-g6-g7-g11`

---

## Summary

| Category | Status | Finding |
|----------|--------|---------|
| A01 — Broken Access Control | ✅ PASS | RS256 JWT on all protected routes, ownership checks, CORS whitelist |
| A02 — Cryptographic Failures | ✅ PASS | argon2id passwords, RS256 JWT, no HS256 found |
| A03 — Injection | ✅ PASS | Parameterized queries everywhere; `Sprintf` usage is safe (only `$N` placeholders) |
| A04 — Insecure Design | ✅ PASS | Rate limiting (Redis), account lockout, refresh token rotation |
| A05 — Security Misconfiguration | ⚠️ WARN | CSP disabled in BFF (dev convenience), `err.Error()` leaks in Fiber handlers |
| A06 — Vulnerable Components | ⚠️ WARN | Dependency audit pending (no known CVE High found via quick check) |
| A07 — Auth Failures | ✅ PASS | Session revocation, refresh token rotation, brute-force lockout |
| A08 — Software Integrity | ⚠️ WARN | No signed images yet (Phase 2 planned) |
| A09 — Logging Failures | ⚠️ WARN | Email verification token logged in dev mode — must be gated by `ENV != production` |
| A10 — SSRF | ✅ PASS | No webhook URL exec or user-controlled HTTP calls found |

---

## A01 — Broken Access Control ✅

### Findings

**JWT verification on protected routes**: All Go services use `middleware.NewJWKSAuth()` with RS256 validation. BFF (`@fastify/jwt`) also enforces JWT on all mutations.

```
services/assessment/internal/middleware/middleware.go:43:
    if _, ok := t.Method.(*jwt.SigningMethodRSA); !ok { ... }
    jwt.WithValidMethods([]string{"RS256"})
```

**CORS whitelist**: All services configure `CORS(cfg.AllowedOrigins)` — whitelist-only, null-origin rejected in production.

**User ownership**: vocabulary deck endpoints verified to filter by `user_id`. Learning paths scoped to authenticated `userID` extracted from JWT claims.

**RBAC**: No admin-only endpoints exposed without auth. Placement test endpoint validated.

### Issues
- [ ] Consider adding explicit `ownership_check` middleware for `DELETE /decks/:id` (low risk — validated inline but not obvious)

---

## A02 — Cryptographic Failures ✅

### Findings

**Password hashing**: argon2id implemented per OWASP recommendation.
```
services/identity/internal/config/config.go:88:
    // OWASP recommended argon2id
services/identity/internal/service/auth_service.go:750:
    hash := argon2.IDKey(...)
```

**JWT algorithm**: RS256 (asymmetric) used everywhere. Zero HS256 usage found.
```bash
grep -rn "HS256" services/ → 0 matches
```

**DB/Redis TLS**: Connection strings use `sslmode=disable` in defaults — **must be `sslmode=require` in staging/production** (env override expected).

### Issues
- [ ] Update default `DATABASE_URL` to require TLS for staging env (low — env var override)

---

## A03 — Injection ✅

### Findings

**SQL (pgx parameterized)**: Zero raw `fmt.Sprintf` with user-controlled string concatenation in SQL. Two `Sprintf` usages found — both only build column/placeholder names (`$N`), not user values:

```go
// vocabulary/internal/repository/word_repository.go:109
where = append(where, fmt.Sprintf("level = $%d", pIdx))
// Only builds "$1, $2" — values are in args slice → parameterized ✅
countQ := fmt.Sprintf("SELECT COUNT(*) FROM words WHERE %s", whereClause)
// whereClause only contains "level = $2 AND pos = ANY($3)" — SAFE ✅
```

**MongoDB (Mongoose)**: `content-service` uses Mongoose `find({unitId, status: 'published'})` — object-based queries, no string concatenation.

**Command injection**: No `exec`, `os.system()`, or `child_process.exec()` with user input found.

---

## A04 — Insecure Design ✅

### Findings

**Rate limiting** (Redis token bucket, per IP + per email):
```
services/identity/internal/service/auth_service.go:140:
    rl, err := s.limiter.Allow(ctx, ...)
    // login_ip, login_email, register all rate-limited
```

**Account lockout**: BruteForce lockout tracked after 5 failed login attempts.
```
services/identity/internal/service/auth_service.go:273:
    // Check brute force lockout
services/identity/internal/metrics/metrics.go:54:
    BruteForceEvents.WithLabelValues("lockout")
```

**Password reset token**: Single-use with TTL enforced via DB deletion after use.

**BodyLimit**: All Go services set `BodyLimit: 64*1024` (64KB) — protects against oversized payload DoS.

---

## A05 — Security Misconfiguration ⚠️

### Finding 1: Content-Security-Policy disabled in BFF

```typescript
// services/web-bff/src/app.ts:68
await app.register(helmet, {
  contentSecurityPolicy: false, // GraphQL playground needs inline scripts in dev
});
```

**Risk**: CSP is globally disabled — XSS payloads have no browser-level mitigation.  
**Fix**: Enable CSP in production, disable only in dev:

```typescript
contentSecurityPolicy: cfg.env === 'production' ? {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
  }
} : false,
```

### Finding 2: `err.Error()` message exposed in Fiber error handlers

Multiple services expose raw error messages in API responses:
```go
// services/assessment/cmd/server/main.go:102
return c.Status(code).JSON(fiber.Map{
    "error": "INTERNAL_ERROR",
    "message": err.Error(), // ← exposes internal error details
})
```

**Risk**: Internal database errors, stack details, or infrastructure info can leak to clients.  
**Fix**: In production, return generic message and log detail internally.

### Finding 3: Cookie flags not verified

App uses JWT in `Authorization` header (not cookies) — cookie-based attacks N/A for current auth flow. If cookies are added in Phase 2, must set `httpOnly`, `Secure`, `SameSite=Lax`.

---

## A06 — Vulnerable Components ⚠️

### Findings

Quick dependency check — no known CVE High found in core deps used:
- `github.com/jackc/pgx/v5` — latest v5.6.0
- `github.com/golang-jwt/jwt/v5` — v5.2.1
- `github.com/segmentio/kafka-go` — v0.4.47

**Actions needed**:
- [ ] Run `go mod tidy && nancy sleuth` or `govulncheck ./...` in CI
- [ ] Run `pnpm audit --audit-level=high` for Node services
- [ ] Run `cargo audit` for srs-service
- [ ] Enable Dependabot in GitHub repo settings

---

## A07 — Authentication Failures ✅

### Findings

**Refresh token rotation**: `session_repository.go` stores token hashes; on refresh, old token is revoked.

**Session invalidation**: `ErrSessionRevoked` domain error, `revoked_at` timestamp tracked in DB.

**Reuse detection**: Refresh token reuse triggers full session revocation:
```go
s.log.Warn("refresh token reuse detected — revoking all sessions", ...)
```

**MFA**: Optional, deferred to Phase 2 as documented.

---

## A08 — Software Integrity ⚠️

- Docker images not signed (cosign Phase 2 planned)
- SBOM (CycloneDX) not generated yet — Phase 2
- GitHub Actions pinned to specific versions (`actions/checkout@v4`, etc.) ✅

---

## A09 — Logging Failures ⚠️

### Finding: Email verification token logged (dev mode)

```go
// services/identity/internal/service/auth_service.go:474
s.log.Info("email verification token generated (dev — ...",
    zap.String("token", rawToken[:8]+"..."),   // truncated ✅
    zap.String("link", s.cfg.BaseURL+"/api/v1/auth/verify-email?token="+rawToken)) // full token in log ❌
```

**Risk**: Full password reset and email verification links logged — if log aggregation is not secured, these tokens could be replayed.

**Fix**: Gate this log behind `cfg.Env != "production"`.

**PII in logs**: Structured zap logging with `user_id` (UUID) — no raw email/name fields found in hot paths. ✅

---

## A10 — SSRF ✅

### Findings

- No webhook URL execution from user input found
- Content-service fetches use Mongoose (internal DB only) — no user-supplied URLs fetched
- Learning-service `ContentClient` fetches `CONTENT_SERVICE_URL` from config (env-controlled, not user-supplied) ✅
- File uploads: No file upload endpoint found in current MVP (media-service Phase 2)

---

## Action Items (Prioritized)

### 🔴 Fix in this PR

| # | Issue | File | Fix |
|---|-------|------|-----|
| 1 | CSP disabled globally in BFF | `services/web-bff/src/app.ts` | Gate CSP by `cfg.env` |
| 2 | `err.Error()` leaks in production | Multiple `cmd/server/main.go` | Return generic message in prod |
| 3 | Auth token logged in full | `services/identity/internal/service/auth_service.go` | Gate log by `cfg.Env != "production"` |

### 🟡 Follow-up Issues (create GitHub Issues)

| # | Issue | Priority |
|---|-------|----------|
| 4 | Enable `govulncheck` + `pnpm audit` + `cargo audit` in CI | Medium |
| 5 | Enable Dependabot | Medium |
| 6 | DB connection sslmode=require for staging | Medium |
| 7 | Signed Docker images (cosign) | Low (Phase 2) |
| 8 | SBOM generation | Low (Phase 2) |
