# MVP1 Test Checklist (2026-04-26)

> **Scope**: Mọi việc test cần làm trước khi ship MVP1 launch VN-only.
> **Phân loại**: P0 = block ship · P1 = should have · P2 = post-launch monitor.
> **Hiện trạng**: G12 E2E scaffold + G13 k6 load + G14 OWASP audit đã có infra.

---

## 1. Code / CI tests (technical correctness)

### P0 — block ship

- [ ] **CI green** trên branch main (G2 — đã có): tất cả PR merge phải pass go-test, pnpm-tsc, cargo-test
- [ ] **Migration reversible**: `goose up` rồi `goose down` cho 11 service không lỗi (Phase A trong dictionary import đã verify cho vocabulary)
- [ ] **Build production**: `next build` (apps/web) + `go build ./...` (Go services) + `cargo build --release` (srs) — 0 error, 0 warning level
- [ ] **No console errors** trên production build: chạy `pnpm dev` ở apps/web, mở 10 page chính, F12 console = clean
- [ ] **TypeScript strict mode**: `pnpm tsc --noEmit --strict` ở web-bff + apps/web → 0 error

### P1

- [ ] **Unit test coverage** core services: identity (auth flow), billing (subscription lifecycle), srs (FSRS algorithm) ≥ 60% cho domain layer
- [ ] **Linter clean**: `pnpm lint` (ESLint/Biome) + `golangci-lint run` → 0 critical issue
- [ ] **Dependabot enabled** + `pnpm audit` + `go mod audit` không có CVE high

### P2

- [ ] Unit test cho mọi service (Phase 2 ngày)

---

## 2. Functional E2E tests (user journeys)

### P0 — block ship: 4 critical journey phải pass

| # | Journey | Coverage |
|---|---------|---------|
| 1 | **Sign-up → onboarding → first lesson** | Register → verify email → 5-step onboarding → placement test → dashboard có track → click lesson → submit answer → XP awarded |
| 2 | **Vocab learning loop** | Add deck → add card → learn mode → SRS review → due card count update đúng |
| 3 | **AI Tutor chat** | Free user check entitlement → upgrade prompt → upgrade to Plus → tutor chat unlock |
| 4 | **Billing full lifecycle** | Pricing → checkout Stripe sandbox → 3DS pass → success page → /settings/subscription active → cancel → reactivate → invoice download |

**Cách chạy**:
- G12 Playwright: `pnpm e2e` chạy 4 spec (auth/onboarding/learning/billing) — đã có scaffold, cần verify pass thực tế
- Manual smoke: bạn tự đi qua 4 journey, screenshot lại

### P1 — secondary journeys

- [ ] **Forgot password** → email reset link → đặt mật khẩu mới → login OK
- [ ] **Change password** trong settings → re-login required
- [ ] **Delete account** (GDPR) → /users/me 404 → clear session
- [ ] **OAuth login** (Google) → first-time user → redirect onboarding
- [ ] **Settings update** (display name, language, daily goal) → reload → giá trị giữ
- [ ] **Notification flow**: bell badge tăng khi event mới (mock event qua Kafka) → click → mark read → badge giảm
- [ ] **Achievement unlock**: complete 5 lesson → kafka emit → /achievements show new badge
- [ ] **Leaderboard**: 5 user fake → /leaderboard render đúng rank + isCurrentUser highlight

### P2

- [ ] Edge cases: network drop giữa lesson, double-submit answer, browser back/forward

---

## 3. Performance + load tests

### P0

- [ ] **G13 k6 dashboard.js**: 100 VU / 5 min → **p95 < 1s**, error rate < 0.5%
- [ ] **G13 k6 lesson-flow.js**: 50 VU / 3 min full pipeline → no DB connection exhaustion
- [ ] **Smoke test concurrent registration**: 50 user register cùng lúc → identity-service không 500

### P1

- [ ] **G13 k6 api-burst.js**: 200 RPS spike → API gateway / web-bff không OOM
- [ ] **DB connection pool**: monitor pg_stat_activity dưới load, không exhaust max_connections (default 100)
- [ ] **Cold start**: VPS restart → tất cả 17 service ready trong 60s

### P2

- [ ] Cache hit rate > 80% cho dashboard query (Redis)
- [ ] LLM latency: AI tutor chat p95 < 3s (Claude streaming)
- [ ] Audio TTS first-byte < 500ms (cached) / < 2s (cold)

---

## 4. Security tests (G14 OWASP đã audit)

### P0 — đã fix trong G14

- [x] A05 CSP env-gated production
- [x] A09 Token logs hidden production
- [x] Error messages gated

### P0 — cần verify trước launch

- [ ] **JWT refresh rotation**: login → save AT+RT → wait 15min → request → AT auto-refresh, RT rotated
- [ ] **Session invalidation**: change password → old session token → 401
- [ ] **Rate limit**: 100 request/min/IP cho /auth/login → 429 sau ngưỡng
- [ ] **Account lockout**: 5 failed login → lock 15 min
- [ ] **CSRF**: form submission cross-origin → reject (SameSite=Lax)
- [ ] **XSS**: paste `<script>alert(1)</script>` vào display name → render escaped
- [ ] **SQL injection**: deck name = `'; DROP TABLE words; --` → bị reject (pgx parameterized)
- [ ] **Webhook signature**: forge Stripe webhook payload → 400 (signature mismatch)

### P1

- [ ] **Cookie httpOnly + Secure + SameSite**: F12 → Application → Cookies kiểm cờ
- [ ] **HSTS header**: production response header có `Strict-Transport-Security`
- [ ] **CORS strict**: request từ malicious-site.com → reject
- [ ] **File upload type whitelist**: upload .exe vào avatar → 415

### P2

- [ ] Penetration test thuê outside firm (Phase 2 trước scale lớn)
- [ ] Bug bounty program

---

## 5. Content QA (lesson/audio/vocab)

### P0 — block launch nếu user gặp content kém

- [ ] **40 lesson English A1**: reviewer (CELTA freelance) duyệt mỗi lesson, mark `.approved.json`
- [ ] **No embarrassing typo**: mọi intro/grammar/exercise text đọc qua 1 lượt VN reviewer + 1 lượt EN reviewer
- [ ] **Audio quality**: mỗi audio file (40 files) nghe qua đảm bảo:
  - Pronunciation chuẩn (ElevenLabs voice "Rachel" cho EN)
  - Tốc độ phù hợp A1 (slow/medium)
  - Không có artifact (clipping, pop, silence padding > 1s)
- [ ] **Vocab level appropriate**: lesson A1 không có từ B2+ (verify qua words.frequency_rank threshold)
- [ ] **Mock test TOEIC + IELTS mini**: format đúng chuẩn ETS/Cambridge, examiner reviewer duyệt
- [ ] **Cultural sensitivity**: không dùng example về politics/religion/violence (G14 validator có filter cơ bản)

### P1

- [ ] **Vocab translation accuracy**: random 50 từ → bilingual reviewer check meanings.vi đúng
- [ ] **Grammar explanation accuracy**: random 5 lesson → CELTA reviewer check grammar note correct
- [ ] **Exercise difficulty progression**: trong 1 lesson, exercise dễ → khó → review từ B0 đến B6

### P2

- [ ] A/B test exercise variety: 2 lesson với same target_words, khác exercise → đo retention

---

## 6. Provider integration tests (sandbox)

### P0

- [ ] **Stripe sandbox**: complete subscription flow với test card `4242 4242 4242 4242` → invoice paid → entitlement updated → user thấy Plus features
- [ ] **Stripe webhook**: ngrok → forward webhook → service nhận → update DB. Test 5 event type: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- [ ] **VNPay sandbox**: complete flow tương tự với VNPay test gateway
- [ ] **Anthropic API**: tutor chat → thấy real Claude response (không mock)
- [ ] **ElevenLabs**: audio TTS sinh ra file .mp3 valid, accessible từ S3 signed URL
- [ ] **SendGrid/SES**: send verify email → user nhận email trong inbox (không spam folder)

### P1

- [ ] **Refund flow**: Stripe refund → invoice.refunded → entitlement downgrade trong 5 phút
- [ ] **Email template render**: verify email + reset password + welcome email — render đúng VN/EN, không broken HTML, không "Hello {{name}}" leak

### P2

- [ ] FCM/APNs push (mobile defer)
- [ ] WeChat/Alipay (defer mở TQ)

---

## 7. Production deployment tests

### P0 — block ship

- [ ] **Hetzner VPS deploy**: `docker stack deploy` → 17 service + 5 infra all healthy trong 5 phút
- [ ] **Domain + TLS**: `curl https://omnilingo.vn` → 200 + valid TLS cert
- [ ] **All `/healthz` 200**: verify 17 service `curl https://api.omnilingo.vn/<svc>/healthz`
- [ ] **All `/metrics` 200**: Prometheus scrape thành công 17/17 service
- [ ] **Database backup**: `pg_dump` chạy trong cron → file lên Hetzner Storage Box → restore test thành công
- [ ] **Rollback procedure**: deploy revision N → bug → rollback to N-1 trong 5 phút (test thực sự, không assume)

### P1

- [ ] **Zero-downtime deploy**: rolling update 1 service → connection không drop
- [ ] **Kafka outage simulation**: stop Kafka 2 phút → outbox queue events → restart → catch up
- [ ] **DB outage**: pg restart → service reconnect tự động (pgx pool config OK)
- [ ] **Disk monitoring alert**: disk > 80% → PagerDuty/Slack alert fire

### P2

- [ ] Multi-region failover (defer Phase 2)
- [ ] Chaos engineering (Phase 2)

---

## 8. Observability tests

### P0

- [ ] **Grafana dashboard có data**: G11 stack chạy → 4 panel chính (req/s, p99, error rate, kafka lag) hiện chart trong 5 min
- [ ] **Log aggregation**: tail logs 17 service từ 1 chỗ (Loki query)
- [ ] **Trace 1 request** flow đi qua: client → Cloudflare → web-bff → identity → response (request_id propagated)
- [ ] **Alert fire test**: drop 1 service xuống → alert "service down" trong 2 phút

### P1

- [ ] **Cost dashboard**: LLM token spent / day / user (llm-gateway logs)
- [ ] **Slow query log**: pg slow query > 1s logged
- [ ] **PII redacted in logs**: search logs cho password/token leak → 0 match

---

## 9. UAT (User Acceptance Testing)

### P0 — phải có trước launch

- [ ] **Recruit 30-50 tester**: friends/family + community VN learners
- [ ] **Onboarding survey**: trước UAT, biết level + device + language goal của mỗi tester
- [ ] **Test scenario**: yêu cầu mỗi tester:
  - Register + onboarding 5-step
  - Hoàn thành 1 unit (5 lesson) trong 1 tuần
  - Thử AI tutor chat 5 lượt
  - Thử upgrade Plus (test card)
  - Cancel subscription
  - Submit feedback form
- [ ] **Bug tracking**: GitHub Issues label `uat-feedback` → triage daily
- [ ] **Critical bug exit criteria**: 0 P0 + < 5 P1 trước khi public launch

### P1

- [ ] **Accessibility test**: 1 tester dùng screen reader (NVDA/VoiceOver)
- [ ] **Mobile responsive test**: 5 tester chỉ dùng iPhone Safari + Android Chrome (không desktop)
- [ ] **Slow network test**: throttle 3G → verify lesson load < 5s

### P2

- [ ] Beta test 1 tháng public sign-up trước launch chính thức

---

## 10. Cross-browser + device

### P0

- [ ] **Desktop Chrome (latest)**: full functionality
- [ ] **Desktop Safari (latest)**: full functionality (audio, video critical)
- [ ] **Mobile Safari iOS 16+**: register + lesson + AI chat
- [ ] **Mobile Chrome Android 12+**: register + lesson + AI chat

### P1

- [ ] **Desktop Firefox latest**: critical paths
- [ ] **Desktop Edge latest**: critical paths
- [ ] **iPad Safari**: layout không vỡ
- [ ] **Tablet Android**: layout không vỡ

### P2

- [ ] IE11, old browsers — defer

---

## 11. Legal compliance tests (VN PDPL)

### P0

- [ ] **Privacy Policy** publicly accessible từ footer
- [ ] **Terms of Service** publicly accessible từ footer
- [ ] **Cookie consent banner** xuất hiện cho user EU-IP (defer dùng JS geo-detect đơn giản hoặc set Cookie consent cho mọi user VN)
- [ ] **Data export GET /users/me/export**: trả ZIP với JSON data — chạy thử với 1 test user
- [ ] **Delete account DELETE /users/me**: tài khoản → status='deleted', sau 30 ngày → hard delete

### P1

- [ ] **Open-source attribution `/about/credits`**: list JMdict + CC-CEDICT + WordNet (import-time licenses)
- [ ] **DPA signed** với Anthropic, OpenAI (LLM gateway), Stripe, ElevenLabs, SendGrid

### P2

- [ ] GDPR-ready cho EU expansion (defer)

---

## 12. Post-launch monitoring (24h+ sau ship)

### P0 — first 24h watch

- [ ] **On-call rotation**: 1 người trực 24h đầu tiên
- [ ] **Slack/Discord channel** `#omnilingo-launch` cho realtime issue
- [ ] **Dashboard refresh mỗi 30 phút**: error rate, signup count, payment success rate
- [ ] **Hot bugfix branch ready**: `hotfix/launch-day` ready để deploy ngay nếu critical

### P1 — first week

- [ ] **Daily health report**: signup, DAU, lesson completion rate, churn
- [ ] **User feedback channel**: in-app form + email
- [ ] **A/B test framework**: ready cho experiment đầu tiên (giả lập rate-limit khác nhau)

---

## Tổng kết — phân lượng việc

| Nhóm test | P0 count | Effort |
|----------|----------|--------|
| Code/CI | 5 | 1 ngày verify (CI đã có) |
| Functional E2E | 4 journey | 2 ngày (manual + Playwright) |
| Performance | 3 | 1 ngày (G13 đã có scenario) |
| Security | 8 manual verify | 1 ngày (G14 đã audit) |
| Content QA | 6 | **1 tuần (reviewer bottleneck)** |
| Provider integration | 6 sandbox | 2 ngày |
| Production deploy | 6 | 2 ngày |
| Observability | 4 | 1 ngày (G11 stack chạy) |
| UAT | 1 (recruit + run) | **1 tuần** |
| Cross-browser | 4 | 0.5 ngày |
| Legal | 5 | 0.5 ngày + lawyer review |
| Post-launch | 4 setup | 0.5 ngày |

**Tổng P0 effort**: ~3 tuần (parallel UAT + Content QA là bottleneck).

**Critical path**:
```
Week 1: CI + functional + security + provider sandbox + observability  (parallel)
Week 2: Content QA (reviewer) + production deploy + cross-browser
Week 3: UAT (50 tester) + legal docs + post-launch setup
Week 4: Soft launch (10% traffic) → full launch
```

---

## Tracking

Mỗi item P0 chưa tick → **không ship**. P1 không tick → ship được nhưng phải có plan fix trong 2 tuần đầu. P2 → defer Phase 2.

File này cập nhật weekly cho đến launch.
