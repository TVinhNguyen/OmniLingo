# OmniLingo — Development Plan & Architecture Audit (2026-04-25)

> Scope: đánh giá thực trạng triển khai so với thiết kế (`02-features`, `03-high-level-architecture`, `04-microservices-breakdown`) và lập plan chi tiết cho 4 tuần tới đến khi ship MVP1.
> Source of truth: `git status` snapshot + GitNexus index (10,730 symbols, 300 processes) + 4 doc kiến trúc + [wiring-status-2026-04-22.md](./wiring-status-2026-04-22.md).

---

## 1. Bức tranh thực tế (state-of-codebase)

### 1.1. Service catalog vs design (doc 04 Phase 1 = 18 services + 2 BFFs)

| # | Service | Doc 04 stack | Implemented? | Files | Note |
|---|---------|--------------|-------------|-------|------|
| 1 | identity | Go | ✅ | 19 | + outbox WIP |
| 2 | learning | Go | ✅ | 17 | + onboarding WIP, outbox WIP |
| 3 | content | Node TS | ✅ | 23 | full CRUD + admin seed |
| 4 | vocabulary | Go | ✅ | 24 | + outbox WIP |
| 5 | grammar | Node TS | ✅ | 22 | đã có endpoints |
| 6 | srs | Rust | ✅ | 16 | FSRS engine |
| 7 | assessment | Go | ✅ | 19 | + placement WIP |
| 8 | progress | Go | ✅ | 14 | heatmap đã wired |
| 9 | gamification | Go | ✅ | 16 | + outbox WIP |
| 10 | billing | Go | ✅ | 15 | có outbox |
| 11 | payment | Go | ✅ | 20 | có outbox |
| 12 | entitlement | Go | ✅ | 12 | thiếu outbox |
| 13 | notification | Node TS | ✅ | 8 | minimal — chỉ consumer + 1 route file |
| 14 | speech-ai | Python | ✅ | 12 | stateless |
| 15 | ai-tutor | Python | ✅ | 12 | full tutor |
| 16 | llm-gateway | Go | ✅ | 11 | proxy |
| 17 | web-bff | Node TS | ✅ | 16 | 24+ queries |
| **— Phase 2 (chưa cần MVP1) —** | | | | | |
| 18 | tutor | Node TS | ❌ | — | marketplace |
| 19 | booking | Go | ❌ | — | |
| 20 | classroom | Node TS | ❌ | — | |
| 21 | social | Node TS | ❌ | — | |
| 22 | search | Python | ❌ | — | MVP1 dùng PG full-text OK |
| 23 | media | Node TS | ❌ | — | flagged §7 wiring blocker |
| 24 | dictionary | Python | ❌ | — | flagged §7 wiring blocker |
| 25 | moderation | Python | ❌ | — | |
| 26 | proctoring | Python | ❌ | — | Test Prep Phase 2 |
| 27 | video | Go + mediasoup | ❌ | — | live class |
| 28 | writing-ai | Python | ❌ | — | MVP1 chấp nhận stub |
| 29 | mobile-bff | Node TS | ❌ | — | mobile app Phase 2 |

**Verdict**: 17/18 service Phase 1 đã build (thiếu writing-ai). Đủ MVP1.

### 1.2. Architectural deviations vs doc 03

| # | Doc 03 nói | Thực tế | Severity | Hành động |
|---|-----------|---------|----------|-----------|
| 1 | BFF ↔ services dùng **gRPC** (§4.2) | Dùng **REST** (`call<T>` HTTP) | Medium | Defer Phase 2; REST OK cho MVP1 (15 services × 5 endpoints, không quá tải). Cần ADR ghi nhận. |
| 2 | "Mỗi service có `openapi.yaml` hoặc `.proto`" (§quy ước) | **0 file OpenAPI/proto** | High | P2: viết OpenAPI cho 4-5 service core (identity, learning, content, billing, vocabulary). Defer cho Phase 2 các service còn lại. |
| 3 | Helm chart per service (§quy ước) | **0 Helm chart**, chỉ docker-compose | High | Phase 2 deploy work. MVP1 ship qua docker-compose lên 1 VPS được. |
| 4 | `/metrics` Prometheus endpoint | 13/17 service có | Low | 4 service thiếu: bổ sung khi gặp. Không block MVP1. |
| 5 | Outbox pattern cho Kafka producer | 2/8 producer có (billing, payment); Gemini đang làm 4 (id/learning/vocab/gamification) | **Critical** | Đang fix trong working tree — cần verify khi commit. |
| 6 | mTLS giữa services (§principle 8) | Chưa setup | Low | Phase 2 (k8s service mesh — Linkerd/Istio). |
| 7 | identity-service KHÔNG quản preferences (doc 04 §1) | Lúc đầu vi phạm — đã thêm `daily_goal_minutes` | Đang fix | Working tree có `00005_drop_learning_preferences.sql` (identity) + `00002_add_learning_preferences.sql` (learning) → move sang đúng bounded context. |

### 1.3. Coverage tests + observability + CI/CD

| Hạng mục | Hiện trạng | Doc nói | Gap |
|---------|-----------|---------|-----|
| Test files | 583 (Go + TS + Rust) | "tests/" per service | OK — không đo coverage được, nhưng có infra |
| GitHub Actions / CI | **0 workflow** | doc 08 implies | **Critical**: cần ít nhất 1 workflow chạy `go test`, `pnpm test`, `cargo test` per PR. |
| Helm/k8s | docker-compose only | doc 08 Helm + k8s | Phase 2 |
| Prometheus | 13/17 service có `/metrics` | doc 12 yêu cầu hết | 4 service hổng |
| Grafana / Loki | Chưa wire | doc 12 yêu cầu | Phase 2 (sau ship MVP1 lên staging) |
| Distributed tracing | — | doc 12 | Phase 2 |

### 1.4. Wiring snapshot (so với [wiring-status §1](./wiring-status-2026-04-22.md))

Hiện tại (cộng cả Wave 8 PRs đã review xong + Gemini BE branch chưa merge):

| Flow | Trước | Sau merge tuần này | Sau Gemini BE merge | Sau Devin FE wave 9 |
|------|-------|-------------------|--------------------|---------------------|
| 01 Auth | 100% | 100% | 100% | 100% |
| 02 Onboarding | 40% | 40% | 90% (BE) | **100%** (FE multi-step) |
| 03 Lesson | 65% | 90% (PR-A wire) | 95% (todayMission) | **100%** (unit listing) |
| 04 Vocabulary | 90% | 90% | 90% | 95% (bulk add — phase 2 OK) |
| 05 AI Tutor | 95% | 95% | 95% | 95% |
| 06 Progress | 85% | 95% (PR-B wire) | 100% (heatmap) | **100%** |
| 07 Billing | 70% | 95% (PR-D wire) | 95% | 100% (3DS + cancel polish) |
| 08 Notifications | 80% | 95% (PR-E wire) | 95% | 95% (push register defer) |

**Tổng**: 87% → **~99% sau 2 tuần** nếu execute đúng plan này.

---

## 2. Plan 4 tuần đến ship MVP1

### Tuần 1 (2026-04-25 → 2026-05-01) — Đóng dứt Wave 8 + commit Gemini BE

#### Goal
- Merge Wave 8 PRs (A/B/D/E) vào main.
- Gemini commit + push tất cả working tree thay đổi (T3/T4/outbox/identity refactor).
- Cập nhật wiring-status từ 87% → ~95%.

#### Tasks

| # | Task | Owner | Effort | DoD |
|---|------|-------|--------|-----|
| W1.1 | Merge `devin/1776998849-pr-a-lesson-wire` → main | bạn | 30m | CI green, branch deleted |
| W1.2 | Merge `devin/1776998850-pr-b-progress-wire` → main | bạn | 30m | tương tự |
| W1.3 | Merge `devin/1776998851-pr-d-billing-polish` → main | bạn | 30m | tương tự |
| W1.4 | Merge `devin/1776998852-pr-e-notifications-bell` → main | bạn | 30m | tương tự |
| W1.5 | **Gemini commit BE working tree** (chia 4 commit logic) | Gemini | 1d | Xem §2.1 dưới |
| W1.6 | Gemini tạo PR `feature/be-mvp1-completion` → review → merge | Gemini + bạn | 1d | typecheck + go build clean |
| W1.7 | Cập nhật `wiring-status-2026-04-22.md` → snapshot mới | bạn | 30m | % đúng thực tế |

#### §2.1. Cách Gemini chia commit (trước khi push)

Working tree hiện tại có 4 nhóm thay đổi không liên quan, **không được nhét vào 1 commit**:

```
Commit 1 — fix(arch): move learning preferences from identity to learning service
  - services/identity/migrations/00005_drop_learning_preferences.sql
  - services/identity/internal/domain/user.go
  - services/identity/internal/repository/user_repository.go
  - services/learning/migrations/00002_add_learning_preferences.sql
  - (tương ứng learning domain/repo update để hold prefs)
  - (BFF schema move: User.dailyGoalMinutes → query trên learning service)

Commit 2 — feat(learning): T3 onboarding state machine
  - services/learning/internal/domain/onboarding.go
  - services/learning/internal/repository/onboarding_repository.go
  - services/learning/migrations/00003_add_onboarding.sql
  - services/learning/internal/handler/handler.go (3 endpoint)
  - services/learning/internal/service/learning_service.go
  - services/learning/cmd/server/main.go (DI)
  - BFF: schema OnboardingState type + 3 query/mutation + datasource

Commit 3 — feat(assessment): T4 placement test
  - services/assessment/internal/domain/placement.go
  - services/assessment/internal/service/placement_service.go
  - services/assessment/internal/handler/assessment_handler.go (2 endpoint)
  - services/assessment/cmd/server/main.go (DI)
  - BFF: PlacementTest schema + 2 query/mutation + datasource

Commit 4 — feat(infra): outbox pattern for 4 producer services (Bug #7)
  - services/identity/{messaging/outbox.go, migrations/00006_add_outbox.sql, cmd/server/main.go}
  - services/learning/{messaging/outbox.go, migrations/00004_add_outbox.sql, cmd/server/main.go}
  - services/vocabulary/{messaging/outbox.go, migrations/00002_add_outbox.sql, cmd/server/main.go}
  - services/gamification/{messaging/outbox.go, migrations/00002_add_outbox.sql, cmd/server/main.go}
```

**Lý do chia 4 commit**: rollback từng phần được (nếu outbox có bug, không phải revert luôn onboarding).

#### Acceptance criteria tuần 1
- [ ] 4 PR Devin đã merge
- [ ] Gemini BE branch đã merge với 4 commit sạch
- [ ] `pnpm tsc --noEmit` xanh ở `services/web-bff` và `apps/web`
- [ ] `go build ./...` xanh ở identity, learning, assessment, vocabulary, gamification, progress
- [ ] Migration test: chạy `goose up` rồi `goose down` trên local DB từng service không lỗi
- [ ] wiring-status cập nhật: Flow 02 = 90% BE, Flow 03 = 95%, Flow 06 = 100%

---

### Tuần 2 (2026-05-02 → 2026-05-08) — Devin wire FE Wave 9

#### Goal
- Wire 7 page FE còn mock thành data thật.
- Kết thúc Tuần 2: MVP1 wire-up 99%.

#### Tasks

| # | Task | Owner | Effort | DoD |
|---|------|-------|--------|-----|
| W2.1 | Wire `/learn` unit listing (expand track card show units) | Devin | 1d | Click track → thấy unit list từ DB |
| W2.2 | Wire `/onboarding` 5 sub-route state machine (`language` → `goal` → `level` → `placement` → `done`) | Devin | 2d | User mới register → guided flow → enrollTrack |
| W2.3 | Wire `/placement-test` chấm CEFR thật | Devin | 0.5d | Submit → hiện CEFR + recommendedTrackId |
| W2.4 | Wire `/settings/learning` (dailyGoal + reminderTime) + `/settings/languages` (BCP-47 list add/remove) | Devin | 1d | Save → reload → giữ giá trị |
| W2.5 | Wire `/progress` heatmap calendar 365d | Devin | 0.5d | Hiện activity thật từ `activityHeatmap` query |
| W2.6 | Wire dashboard "Nhiệm vụ hôm nay" widget | Devin | 0.5d | Hiển thị `minutesToGoal`, `dueCardCount` thật. Note: `lessonId/Title` còn null → fallback "Chọn lesson" CTA |
| W2.7 | Wire `/achievements` + `/leaderboard` | Devin | 1d | Render từ `myAchievements` + `leaderboard(global)` |
| ~~W2.8~~ | ~~Polish `/checkout/3ds-callback` + `/checkout/cancel` (FE-only)~~ | ~~Devin~~ | ~~0.5d~~ | ✅ **Done** — 4 nhánh `devin/d1-3ds-callback`, `devin/d2-cancel-polish`, `devin/d3-split-billing-subscription`, `devin/fix-pr5-review-bugs` (2026-04-25) |

**Tổng**: ~7 ngày Devin → 1 PR/page hoặc gộp 2-3 (gọn cho review).

#### Acceptance criteria tuần 2
- [ ] 7 page hết mock, render data từ BFF
- [ ] Smoke test thủ công: register → onboarding → placement → /learn → /lesson/[id] → submit answer → /progress hiện skill score + heatmap → /achievements unlock → /leaderboard rank
- [ ] wiring-status §1 = 99% (chỉ còn polish)

---

### Tuần 3 (2026-05-09 → 2026-05-15) — Hardening + bring missing infra

#### Goal
Trước khi ship production, đóng các gap kiến trúc Phase 1.

> **Brief đầy đủ 14 task cho Gemini**: xem [gemini-tasks-wave2-hardening.md](./gemini-tasks-wave2-hardening.md) — paste-ready cho Gemini.

#### Tasks (mapping sang Gemini Wave 2)

| # | Task | Brief | Owner | Effort | DoD |
|---|------|-------|-------|--------|-----|
| W3.1 | CI workflow GitHub Actions | G2 | Gemini | 1d | `.github/workflows/ci.yml` chạy xanh, branch protection enable |
| W3.2 | Bổ sung `/metrics` cho 4 service thiếu | G3 | Gemini | 0.5d | 17/17 service expose Prometheus |
| W3.3 | OpenAPI spec cho 5 service core | G4 | Gemini | 2d | Generate được client TS bằng `openapi-typescript` |
| W3.4 | ADR-009 REST vs gRPC + ADR-010 outbox non-tx | G1 (ADR-010) + bạn (ADR-009) | bạn | 1h | 2 ADR file commit |
| W3.5 | Outbox cho assessment + srs | G6 | Gemini | 1d | 6 service có outbox đầy đủ |
| W3.6 | Kafka topic naming audit | G5 | Gemini | 1h | `kafka-topic-registry.md` đầy đủ 21+ topic |
| W3.7 | Local Prometheus + Grafana docker-compose | G11 | Gemini | 0.5d | Grafana 3001, 4 panel có data |
| W3.8 | Cleanup: rename `InsertTx` → `Enqueue` | G1 | Gemini | 2h | 14 call site renamed, ADR-010 doc |
| W3.9 | Today mission lesson lookup qua content service | G7 | Gemini | 0.5d | Dashboard widget hiện lesson title thật |
| W3.10 | writing-ai stub (proxy LLM gateway) | G8 | Gemini | 1d | Service up, grade essay endpoint trả scores |
| W3.11 | dictionary stub (auto-fill IPA) | G9 | Gemini | 1d | Service up, vocabulary auto-fill |
| W3.12 | media stub (audio upload S3 signed URL) | G10 | Gemini | 1.5d | Upload signed URL flow chạy |

#### Acceptance criteria tuần 3
- [ ] CI chạy xanh trên main branch
- [ ] 17/17 service có `/metrics`
- [ ] 5 OpenAPI spec đã commit
- [ ] ADR-009 review xong
- [ ] Local observability stack chạy được

---

### Tuần 4 (2026-05-16 → 2026-05-22) — E2E + Load + Security review → Ship

#### Goal
Ship MVP1 lên staging environment. Đáp ứng [wiring-status §8 checklist](./wiring-status-2026-04-22.md#8-checklist-trước-khi-ship-mvp1).

#### Tasks (mapping sang Gemini Wave 2)

| # | Task | Brief | Owner | Effort | DoD |
|---|------|-------|-------|--------|-----|
| W4.1 | E2E test Playwright (4 critical journey) | G12 | Gemini | 1d | 4/4 test xanh local + CI |
| W4.2 | Load test k6 (3 scenario) | G13 | Gemini | 0.5d | p95 < 1s cho dashboard |
| W4.3 | Security audit OWASP top 10 | G14 | Gemini + bạn | 1d | A01-A05 pass, issue tạo cho ❌ |
| W4.4 | Deploy lên staging VPS (1 server đủ cho 18 container) | — | bạn | 1d | URL staging chạy được |
| W4.5 | UAT 3-5 tester thật làm flow đầy đủ | — | bạn | 2d | Bug list filed |
| W4.6 | Bug-fix sprint cuối | — | Devin + Gemini | 2d | Tất cả P0/P1 fix |

**Critical path tới ship**: G2 (CI) + G12 (E2E) + G14 (Security) = 3 ngày Gemini blocker.

#### Acceptance criteria tuần 4 — đủ để ship MVP1
- [ ] 6 bugs P0 fix xong (đã 6/7 ở [wiring §4](./wiring-status-2026-04-22.md#4-bugs-p0-phát-hiện-hôm-nay))
- [ ] 4 Kafka naming thống nhất
- [ ] 6 service producer có outbox (id/learning/vocab/gamification + billing/payment)
- [ ] Wave 8 + Wave 9 wire xong
- [ ] E2E test pass
- [ ] Load test pass (p95 < 1s)
- [ ] Security review pass
- [ ] Observability dashboard có data
- [ ] Staging deploy reachable

---

## 3. Out-of-scope MVP1 — đẩy sang Phase 2 chính thức

Theo doc 02 + 13 (roadmap), những thứ sau **không vào MVP1**:

### 3.1. Service mới (Phase 2)
- `tutor-service`, `booking-service`, `classroom-service` — marketplace giáo viên + live class.
- `video-service` (WebRTC SFU) — voice tutor + 1-1 + live class.
- `social-service` + `moderation-service` — forums, study groups.
- `media-service` — audio upload (cần khi listening/speaking module hoạt động đầy đủ).
- `dictionary-service` — auto-fill IPA/meaning khi add card.
- `search-service` (Elasticsearch + Qdrant) — MVP1 dùng PG full-text đủ.
- `writing-ai-service` — chấm essay; MVP1 stub bằng prompt template thẳng tới `llm-gateway`.
- `proctoring-service` — Test Prep Phase 2.
- `mobile-bff` — khi build mobile app.

### 3.2. Feature defer (doc 02)
- Voice Tutor (§4.2) — cần WebRTC + Whisper streaming setup.
- Test Prep đầy đủ (§3) — cần question bank 5,000+ câu cho mỗi cert (content team).
- Marketplace tutoring (§5).
- Live group classes (§6).
- Social features (§7).
- Handwriting recognition cho CJK (§2.6 cuối).
- Offline mode (§13) — cần mobile app.
- Parental/Institutional dashboard (§11).
- Family/B2B plan (chỉ giữ Free/Plus/Pro/Ultimate cho MVP1).

### 3.3. Infra defer (doc 03 + 08)
- BFF→service gRPC migration.
- mTLS service mesh.
- Multi-region deployment.
- Helm + k8s manifests.
- Distributed tracing (Tempo).
- Feature flag system (GrowthBook).

---

## 4. Đánh giá kiến trúc tổng thể

### 4.1. Điểm mạnh

- **DDD bounded context tuân thủ tốt sau khi Gemini fix prefs**: identity chỉ làm auth/RBAC, learning quản lesson + onboarding + prefs, content quản nội dung. Không có service nào truy cập DB của service khác.
- **Persistence diversity đúng theo doc 03**: PG cho transactional, Mongo cho content tree (lesson/exercise lồng), Redis cho leaderboard/cache, ClickHouse được spec sẵn cho analytics (Phase 2 dùng).
- **Event-driven Kafka topology nhất quán**: 21 topic, naming `<domain>.<entity>.<action>`. Bugs naming đã fix (entitlement, gamification consumer).
- **Test coverage có infra**: 583 test file across Go/TS/Rust — không đo % nhưng có nền.
- **17/29 service đã build** đủ cho Phase 1 (chỉ thiếu writing-ai trong nhóm core, có thể stub).

### 4.2. Điểm yếu cần lưu ý

| # | Điểm yếu | Risk | Mitigation |
|---|----------|------|-----------|
| 1 | **Outbox đang triển khai dở** (Gemini WIP cho 4 service) | Production: mất event khi Kafka tạm down → data inconsistency (XP không cộng, badge không trao) | Hoàn thành tuần 1, verify bằng kafka kill test tuần 4 |
| 2 | **Không có CI** | PR có thể merge code không build | Tuần 3 W3.1 setup |
| 3 | **REST thay gRPC cho BFF↔service** | Không type-safe, dễ drift schema | Defer + ADR-009; long-term migrate Phase 2 |
| 4 | **Không có OpenAPI spec** | Frontend không có type generation, drift risk | Tuần 3 viết cho 5 service core |
| 5 | **Notification service rất minimal** (8 file) | Push/email chưa có template management | OK cho MVP1 (chỉ in-app notif), Phase 2 mở rộng |
| 6 | **`learning.GetTodayMission` lessonId/Title vẫn nil** | Dashboard widget thiếu thông tin "next lesson" | Phase 1.5: viết gRPC client trong learning-service gọi content-service `GetNextLesson(pathId)` |
| 7 | **Chưa có k8s manifest** | Khó scale lên multi-instance | MVP1 ship 1 VPS docker-compose OK; Phase 2 migrate k8s |
| 8 | **Không thấy schema registry cho Kafka** (Avro/Protobuf) | Schema drift giữa producer/consumer | Phase 2 setup Confluent Schema Registry hoặc custom JSON Schema check |

### 4.3. Verdict

**Kiến trúc cốt lõi đúng**, ít nợ kỹ thuật nghiêm trọng. Code quality OK theo chuẩn industry cho startup MVP. Sau 4 tuần plan này, MVP1 đủ điều kiện ship lên staging và bắt đầu UAT.

**Risk lớn nhất**: outbox chưa tested. Phải simulate Kafka outage để verify event không mất.

**Risk thứ hai**: thiếu CI → ai cũng có thể merge code broken. Phải fix tuần 3.

---

## 5. Action items hôm nay

| # | Việc | Ai | Thời gian | Status |
|---|------|-----|----------|--------|
| 1 | Review & merge 4 PR Wave 8 (A/B/D/E) | bạn | 2h | ✅ reviewed clean — chờ merge |
| 2 | Yêu cầu Gemini split working tree thành 4 commit theo §2.1 | bạn → Gemini | trong ngày | ⏳ |
| 3 | Pin doc này vào repo | — | done | ✅ |
| 4 | Review & merge 4 PR Devin polish (D1/D2/D3/fix-pr5) | bạn | 1.5h | ✅ reviewed clean — chờ merge |

**Merge order khuyến nghị** (4 PR Devin polish):
1. `devin/1777059314-fix-pr5-review-bugs` — không đụng wiring-status
2. `devin/1777075144-d1-3ds-callback` — 3DS row 🔴→✅
3. `devin/1777075359-d2-cancel-polish` — cancel row 🟡→✅ (rebase lên main sau D1 merge để tránh conflict)
4. `devin/1777075838-d3-split-billing-subscription` — billing/subscription rows reword (rebase lên main sau D2)

**2 minor follow-up cho Devin (không block merge)**:
- D2: thay `"$9/tháng"` hardcode bằng currency động từ `pricingPlans` query (consistency với VND).
- D1: thêm timeout cap ~5min cho `pending-client` poll, sau đó redirect `/pricing` thay vì poll vô hạn.

---

## 6. Reference

- [02-features-and-learning-modules.md](../02-features-and-learning-modules.md) — feature catalog đầy đủ
- [03-high-level-architecture.md](../03-high-level-architecture.md) — kiến trúc tổng + capacity targets
- [04-microservices-breakdown.md](../04-microservices-breakdown.md) — chi tiết 29 service
- [wiring-status-2026-04-22.md](./wiring-status-2026-04-22.md) — % wire FE↔BE từng flow
- [gemini-be-tasks-mvp1.md](./gemini-be-tasks-mvp1.md) — brief BE task cho Gemini
- GitNexus index: 10,730 symbols, 300 processes — `gitnexus://repo/OmniLingo/context`
