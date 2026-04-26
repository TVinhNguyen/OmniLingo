# MVP1 Product Readiness Checklist (2026-04-25, decisions locked)

> **Mục đích**: phân biệt rõ "tech wire xong" với "ship được product thật".
> Tech wire-up = ~99% (xem [wiring-status](./wiring-status-2026-04-22.md)).
> **Product readiness = ~60%** vì còn content + production deployment + provider integration + legal.

## 🎯 5 quyết định đã locked (2026-04-25)

| # | Decision | Choice | Implication |
|---|----------|--------|-------------|
| 1 | Content strategy | **(b) LLM-assisted + (d) Open-source import** | Faster (~2.5 tuần thay 4), cost ~$5-8k thay $30-50k |
| 2 | Mock test trong MVP1 | **Ship** — giới hạn 2 set: 1 TOEIC + 1 IELTS (mock test mini) | +1.5 tuần content. Skip TOEFL/HSK/JLPT mock test → defer Phase 2 |
| 3 | Hosting | **VPS self-host** (Hetzner CX41 / DO 4vCPU 16GB) | Rẻ ($30-50/month), control cao, DevOps cần làm thật |
| 4 | Launch geography | **VN-only first** | Skip GDPR/COPPA, chỉ cần PDPL (VN). Email/UI Vietnamese ưu tiên |
| 5 | Content team | Default: **1 freelance reviewer (CELTA/IELTS)** + dev team chạy LLM pipeline | $1.5-2k/tháng × 1-2 tháng |

**Tác động ETA**: 10-12 tuần → **7-9 tuần** đến launch.

---

## Phân loại 4 milestone

| Milestone | Định nghĩa | Trạng thái | ETA |
|-----------|-----------|------------|-----|
| **Tech Wire** | FE↔BE wired, CI green, code build clean | ✅ ~99% (sau D9/D10 merge) | Done |
| **MVP1 Alpha** | + content demo + staging deploy → demo cho stakeholder | ⏳ ~30% | ~4 tuần |
| **MVP1 Beta** | + provider thật (email/push/Stripe sandbox) + 100 user UAT | ⏳ ~10% | ~7 tuần |
| **MVP1 Launch** | + legal review + production scale + content licensed/produced full | ⏳ ~5% | ~10-12 tuần |

---

## Phần 1 — Content (BLOCKER lớn nhất, scope locked)

Hiện tại: **0 lesson, 0 exercise, 0 audio file, 0 đề thi, 0 dictionary entry trong DB**.

### 1.1. Strategy (b) LLM-assisted + (d) Open-source — chi tiết

**Pipeline**:
```
Open-source dict (JMdict/CC-CEDICT/WordNet/viWiktionary)
   → Postgres (dictionary-service)
   → Vocab seed: top 600 từ phổ biến/level

Claude API (claude-sonnet-4-6)
   → Lesson plan generator (rubric template per skill)
   → Exercise generator (multiple-choice / gap-fill / matching / dictation)
   → Native reviewer (1 freelance, $20-30/h × ~40h)
   → Final lesson published
```

**Cost breakdown**:
- Anthropic API: ~$500 (~10M token = ~150 lesson + 600 exercise)
- ElevenLabs TTS: ~$300 (Pro plan / 100k char audio)
- Freelance reviewer (CELTA): $1.5-2k × 1 tháng = $2k
- Open-source dict: $0
- **Total**: ~$3-4k content cost cho MVP1 launch

### 1.2. Content seed scope (VN-only launch — locked)

| Content | Quantity | Approach |
|---------|----------|----------|
| **English track A1-A2** (priority #1 for VN learners) | 1 track / 5 unit / 40 lesson | LLM gen + reviewer |
| Vocab essential English | 600 từ A1-A2 | WordNet import + Claude gen example/sentence |
| Vocab essential JP/CN/KR | 200 từ N5/HSK1/TOPIK1 mỗi lang | JMdict/CC-CEDICT/CC-CEDICT-Korean import |
| **Mock test TOEIC mini** | 1 set: 50 câu LR (Listening 25 + Reading 25) | LLM gen theo format ETS, reviewer chỉnh band |
| **Mock test IELTS mini** | 1 set: Listening Section 1 + Reading Passage 1 + Writing Task 1 | LLM gen theo format Cambridge |
| Audio | 40 lesson × 3-5 phút TTS | ElevenLabs bulk → S3 cache |
| Reading passage | 15 graded reader A1-B1 | LLM gen edit |
| Dictionary import | 4 source: WordNet (EN), JMdict (JP), CC-CEDICT (CN), viWiktionary (VI) | Bulk import script |

~~Skip cho MVP1~~: TOEFL mock, HSK mock đầy đủ, JLPT mock, TOPIK mock. Defer Phase 2 sau khi có user feedback.

### 1.3. Tasks (effort revised với LLM-assisted)

- [ ] **C1** — Hire 1 freelance reviewer (CELTA/IELTS, prefer VN-based, có thể remote) — 3-5 ngày tuyển
- [ ] **C2** — Import 4 open-source dictionary (G9 stub) — 3 ngày
- [ ] **C3** — LLM pipeline: Claude generate lesson plan + exercise theo rubric template — 4-5 ngày
- [ ] **C4** — Audio bulk upload script: ElevenLabs TTS → S3 (MinIO local first, Hetzner Spaces production) — 4 ngày
- [ ] **C5** — Seed English A1-A2 track full (5 unit / 40 lesson / 600 vocab / 40 audio) — **1.5 tuần** (LLM nhanh)
- [ ] **C6** — Mock test mini: 1 TOEIC LR (50 câu) + 1 IELTS mini (Listening + Reading + Writing) — 1 tuần (parallel C5)
- [ ] **C7** — Vocab seed JP/CN/KR (200 từ × 3 lang = 600 từ) — 3 ngày (chủ yếu là filter từ dict import + LLM gen example)

**Tổng**: ~3 tuần content (parallel với deploy/legal). Trễ 1-2 tuần bù review revision.

---

## Phần 2 — Production deployment (VPS self-host — locked)

Hiện tại: chỉ chạy `docker-compose up` local dev. Chưa có VPS, domain, TLS, CDN.

### 2.1. Hosting architecture (locked)

```
Cloudflare (DNS + CDN + WAF + TLS, free tier)
   ↓
Hetzner CX41 VPS (4 vCPU AMD / 16GB RAM / 160GB NVMe / €15/month)
   ├── Docker Swarm (đơn giản hơn k3s cho 1 node MVP)
   ├── docker-compose.production.yml (17 service + Postgres + Mongo + Redis + Kafka + MinIO)
   ├── Caddy reverse proxy (auto-TLS thay Cloudflare origin cert)
   └── Hetzner Storage Box 100GB (€3/month) — backup PG dump + S3 sync
```

**Lý do chọn Hetzner**:
- Region Helsinki/Falkenstein latency tới VN ~250-300ms (chấp nhận được cho MVP)
- Phase 2 có thể migrate sang Vultr Singapore / DO Singapore khi traffic VN tăng (latency 50-80ms)
- Hetzner CX41 chạy 17 container đủ resource cho MVP1 (test: ~8GB RAM stable, 30% CPU peak)

**Cost month 1**: VPS €15 + Storage €3 + Domain $12/year = **~$25/month** infrastructure.

### 2.2. Tasks

- [ ] **D1** — Domain register `omnilingo.vn` hoặc `omnilingo.com` (Namecheap ~$10/year) — 30 phút
- [ ] **D2** — Hetzner CX41 VPS rent — 30 phút
- [ ] **D3** — Cloudflare DNS + CDN + WAF + TLS proxy mode — 2h
- [ ] **D4** — Docker Swarm init + secrets management (swarm secrets, không cần Vault cho MVP) — 4h
- [ ] **D5** — Tạo `docker-compose.production.yml` từ docker-compose.yml dev — 1 ngày (env-specific config, secrets ref, healthcheck, resource limits)
- [ ] **D6** — Deploy 17 service + 5 infra (PG/Mongo/Redis/Kafka/MinIO) lên VPS — 1 ngày
- [ ] **D7** — Caddy reverse proxy cấu hình routing: `api.omnilingo.vn → web-bff:4000`, `omnilingo.vn → web:3000` — 4h
- [ ] **D8** — Smoke test staging URL: register → onboarding → lesson → AI chat — 1 ngày
- [ ] **D9** — Backup automation: pg_dump cron + rsync sang Storage Box mỗi 6h — 4h
- [ ] **D10** — CI/CD: GitHub Actions deploy job (SSH + docker stack deploy) sau khi merge main — 1 ngày
- [ ] **D11** — DNS records cho email: SPF + DKIM + DMARC (chuẩn bị cho SES P6) — 2h

**Tổng**: ~5-7 ngày DevOps.

---

## Phần 3 — Observability production

Hiện tại: G11 đã có **local stack** (Grafana + Prometheus). **Chưa deploy production**.

### 3.1. Tasks

- [ ] **O1** — Grafana Cloud free tier (10k metric / 14-day retention) hoặc self-host trên VPS — 0.5 ngày
- [ ] **O2** — Prometheus federation hoặc remote_write từ 17 service container → Grafana Cloud — 1 ngày
- [ ] **O3** — Loki log aggregation: container logs ship qua promtail → Loki — 1 ngày
- [ ] **O4** — Alert rules: error rate > 5%, p99 > 2s, kafka lag > 10k, disk > 80% — 0.5 ngày
- [ ] **O5** — Dashboard chính: req/s, p99, error rate, kafka lag, DB connections, cost (LLM token / day) — 1 ngày
- [ ] **O6** — On-call setup: PagerDuty free tier hoặc Slack webhook — 0.5 ngày

**Tổng**: ~4 ngày.

---

## Phần 4 — External providers

Hiện tại: code adapter có nhưng chưa có API key thật.

### 4.1. Tasks

- [ ] **P1** — OpenAI API key + Anthropic API key (cho llm-gateway + ai-tutor) — 30 phút
- [ ] **P2** — ElevenLabs API key (TTS premium) — 30 phút
- [ ] **P3** — Self-host Whisper trên VPS GPU (Hetzner GPU dedicated $50/month) hoặc Azure Speech fallback — 1 ngày
- [ ] **P4** — Stripe sandbox keys + webhook URL → e2e test checkout flow — 2 ngày
- [ ] **P5** — VNPay sandbox keys + webhook URL → e2e test VN flow — 2 ngày
- [ ] **P6** — SendGrid hoặc Amazon SES — domain verify + template approval (verification + reset password) — 1 tuần (chờ template approval)
- [ ] **P7** — FCM (Android) + APNs cert (iOS) — defer mobile app Phase 2
- [ ] **P8** — Sentry / Bugsnag error tracking — 0.5 ngày
- [ ] **P9** — Cloudflare Turnstile / hCaptcha cho sign-up bot protection — 0.5 ngày

**Tổng**: ~2 tuần (chủ yếu chờ SES/SendGrid approval).

---

## Phần 5 — Legal + compliance (VN-only — locked, scope giảm mạnh)

Hiện tại: 0 doc legal. Vì launch VN-only nên scope nhẹ hơn nhiều.

### 5.1. Locked scope: PDPL VN only

- ❌ ~~GDPR (EU)~~ — defer Phase 2 khi mở EU
- ❌ ~~CCPA (California)~~ — defer Phase 2 khi mở US
- ❌ ~~COPPA (US child)~~ — VN không yêu cầu nhưng **policy app: minimum age 13** trong ToS, không cần parental consent flow phức tạp
- ✅ **PDPL Việt Nam** (Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân) — yêu cầu chính
- ✅ **Luật An ninh mạng VN** (data localization considerations)
- ✅ **Luật Thương mại điện tử VN** (cho thanh toán)

### 5.2. Tasks

- [ ] **L1** — Privacy Policy (tiếng Việt + tiếng Anh) tuân thủ PDPL VN — 4-5 ngày (template open-source + lawyer VN review 1 vòng)
- [ ] **L2** — Terms of Service VN/EN — 4-5 ngày (template + lawyer review)
- [ ] **L3** — Cookie consent banner đơn giản (analytics opt-in) — 0.5 ngày code
- [ ] **L4** — Data export + delete account (đã có DELETE /users/me, cần thêm GET /users/me/export trả ZIP) — 2 ngày
- [ ] **L5** — DPA mini (Anthropic, OpenAI, Stripe, ElevenLabs có sẵn standard DPA, chỉ cần download + sign) — 0.5 ngày
- [ ] **L6** — Open-source attribution page `/about/credits` (JMdict, CC-CEDICT, WordNet license terms) — 0.5 ngày
- [ ] **L7** — ToS clause: minimum age 13, không phục vụ trẻ em < 13 (đơn giản hoá COPPA) — gộp vào L2
- [ ] **L8** — DPIA (Data Protection Impact Assessment) lite cho PDPL — 1 ngày tự làm (không cần lawyer)
- [ ] **L9** — Hợp đồng VPNay/MoMo merchant + giấy phép thương mại điện tử — 2-3 tuần (chờ Bộ Công Thương duyệt) — **start sớm, song song**

**Tổng**: ~1.5-2 tuần (lawyer VN review nhẹ hơn EU). L9 là bottleneck → start ngay tuần 1.

---

## Phần 6 — Tính năng còn thiếu so với doc 02

### 6.1. Defer Phase 1.5 (sau MVP1 Launch, ~2-4 tháng)

- [ ] writing-ai-service (G8 brief có)
- [ ] dictionary-service (G9 brief có)
- [ ] media-service (G10 brief có)
- [ ] Voice Tutor (WebRTC + speech-ai streaming)
- [ ] Mobile app (React Native + offline mode)
- [ ] Search service (Elasticsearch + Qdrant)

### 6.2. Defer Phase 2 (~6-12 tháng)

- [ ] Test Prep full (mock test 5000+ câu / cert)
- [ ] Marketplace giáo viên (italki/Preply-style)
- [ ] Live group classes (mediasoup SFU + classroom-service)
- [ ] Social features (forums, study groups, language exchange)
- [ ] Parental dashboard
- [ ] B2B / Schools admin console + SSO + LMS integration

### 6.3. Phase 3+ (>1 năm)

- [ ] Multi-region deployment (EU + US + APAC)
- [ ] Proctoring service (mock test surveillance)
- [ ] Custom pronunciation model training (thay Azure)
- [ ] White-label B2B option
- [ ] Cambridge/ETS official license deal (nếu scale lớn)

---

## Tổng effort sau decisions locked

### Critical path 7-9 tuần đến launch VN

| Tuần | Mục tiêu | Tasks chính | Owner |
|------|---------|------------|-------|
| **1** | Setup + start L9 (MoMo/VNPay merchant) | C1 hire reviewer, D1-D2 domain+VPS, P1-P2 LLM keys, L9 start MoMo merchant | Bạn + DevOps |
| **2** | Content pipeline + dictionary import | C2 import 4 dict, C3 LLM pipeline + audio script, D3-D5 deploy infra | Dev |
| **3** | Content gen sprint 1 | C5 English A1-A2 lesson 1-20, C7 vocab JP/CN/KR | Reviewer + LLM |
| **4** | Content gen sprint 2 + deploy staging | C5 lesson 21-40, C6 mock test, D6-D7 staging deploy | Reviewer + DevOps |
| **5** | Audio + provider integration | C4 audio bulk upload, P3-P5 Whisper+Stripe+VNPay sandbox, P6 SES setup | Dev |
| **6** | Observability + UAT prep | O1-O6 Grafana + alerts, P8-P9 Sentry+Turnstile, L1-L4 legal docs | DevOps + Bạn |
| **7** | UAT 30-50 user friends/family | Bug fix sprint, L5-L8 hoàn thiện DPA + DPIA | Cả team |
| **8** | Public soft launch | Marketing landing, support email, on-call rotation | Bạn |
| **9** | Buffer (chờ MoMo merchant approve hoặc bug critical) | — | — |

**ETA launch**: ~2026-06-25 (9 tuần từ 2026-04-25). Buffer 1 tuần cho L9 MoMo approval bottleneck.

### Cost ước tính launch

| Hạng mục | One-time | Recurring/month |
|---------|----------|----------------|
| Anthropic API content gen | $500 | $50 (post-launch usage) |
| ElevenLabs TTS | $300 | $30 (Pro plan) |
| Freelance reviewer | $2,000 (1 tháng) | $0 sau launch |
| Hetzner VPS + Storage | $0 | $25 |
| Cloudflare | $0 | $0 (free tier) |
| Domain | $12 | $1 |
| Stripe + VNPay | $0 | 2.9% + 30¢ / transaction |
| SES email | $0 | $0.10 / 1000 email |
| Sentry | $0 | $0 (free tier 5k errors) |
| Lawyer VN review | $500 | $0 |
| MoMo merchant fee | $0-200 | varies |
| **Total launch** | **~$3,500** | **~$60/month** |

Rất rẻ vì VPS-self-host + free-tier mọi thứ + LLM thay người biên soạn.

---

## Decisions đã locked → nội dung tham khảo cũ

5 quyết định đã lock ở header file. Reference thêm:

- **Content team kế hoạch full**: 1 freelance reviewer ($2k × 1-2 tháng) + dev team chạy LLM pipeline. Sau launch: chuyển sang community content + crowd review (Phase 2).
- **Mock test scope**: chỉ 2 set (TOEIC + IELTS) — focus vào market VN. Defer Phase 2 cho TOEFL/HSK/JLPT/TOPIK khi user feedback đủ.
- **Hosting Phase 2**: Khi traffic > 1000 DAU → migrate sang Vultr Singapore hoặc multi-VPS với swarm. Database vẫn 1 PG primary + 1 read replica.
- **VN expansion**: Sau launch VN ổn → mở Đông Nam Á (TH, ID, MY) → mở EU (cần GDPR work).

---

## Tracking

Khi 1 task xong, tick `[x]` và link tới commit/PR. File này cập nhật weekly cho đến khi launch.
