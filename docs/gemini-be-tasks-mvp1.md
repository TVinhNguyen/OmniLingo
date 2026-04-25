# Gemini — Backend Tasks để hoàn thiện MVP1

> Nguồn: [wiring-status-2026-04-22.md](./wiring-status-2026-04-22.md) §5 (P2/P3) + Wave 8 PRs (A/B/D/E) đã wire xong FE, còn thiếu BE endpoints/resolvers.
> Mục tiêu: đưa MVP1 wire-up từ **~87% → 100%**.
> Phạm vi: **chỉ BE** (service + BFF). FE đã có page/component, chỉ thay mock bằng data thật.

---

## Cách làm (áp dụng cho mọi task)

1. **Service**: thêm/sửa handler + repo + migration (nếu cần).
2. **BFF**: thêm type trong `services/web-bff/src/schema/schema.ts`, resolver, và method trong `datasources.ts`.
3. **Verify**:
   - `cd services/<svc> && go test ./... ` (hoặc ngôn ngữ tương ứng).
   - `cd services/web-bff && pnpm tsc --noEmit`.
   - `curl` endpoint thật + chạy `pnpm dev` trong `apps/web` để xem page render thật.
4. **Không đụng FE** trừ khi sửa TODO comment đã đánh dấu (PR-B có 2 TODO: `language`, `cert`).

---

## P0 — Unblock Wave 8 FE (đã merge nhưng còn TODO)

### T1. Content listing — `courses(trackId)` + `units(courseId)`

**Vì sao**: `/learn/page.tsx` hiện chỉ render track card, click vào không có unit list. PR content-service đã có `GET /lessons/:id`, `GET /exercises?ids=` nhưng chưa có list-by-parent.

- **Service** `services/content`:
  - `GET /api/v1/content/courses?trackId=<id>` → `[{id, title, description, order, unitIds}]`
  - `GET /api/v1/content/units?courseId=<id>` → `[{id, title, order, lessonIds}]`
  - Đọc từ Mongo collection `courses`, `units` (model đã tồn tại, chỉ thiếu list handler).
- **BFF** `services/web-bff`:
  - Schema: `type Course { id, title, description, unitIds }`, `type Unit { id, title, order, lessonIds }`.
  - Query: `courses(trackId: ID!): [Course!]!`, `units(courseId: ID!): [Unit!]!`.
  - DataSource: `ContentDataSource.getCoursesByTrack`, `getUnitsByCourse`.
- **FE wire** (nhỏ): sửa [apps/web/app/(app)/learn/page.tsx](../apps/web/app/(app)/learn/page.tsx) `Promise.allSettled` thêm `courses(trackId)` cho mỗi track đã enroll; truyền xuống client card.
- **DoD**: click track ở `/learn` thấy unit list thật từ DB.
- **Effort**: ~4h.

### T2. User profile extension — `dailyGoalMinutes`, `reminderTime`, `learningLanguages`

**Vì sao**: `/settings/learning` và `/settings/languages` đang hardcode. FE action `updateProfileAction` chỉ nhận displayName/uiLanguage.

- **Service** `services/identity`:
  - Migration: `ALTER TABLE users ADD COLUMN daily_goal_minutes INT NOT NULL DEFAULT 10, ADD COLUMN reminder_time TIME NULL, ADD COLUMN learning_languages TEXT[] NOT NULL DEFAULT '{}';`
  - `PATCH /api/v1/users/me` mở rộng DTO nhận thêm 3 field (optional, partial update).
  - `GET /api/v1/users/me` trả về 3 field mới.
- **BFF**:
  - `type User` thêm `dailyGoalMinutes: Int!, reminderTime: String, learningLanguages: [String!]!`.
  - `updateProfile` input thêm 3 field optional.
- **DoD**: `/settings/learning` save → reload → thấy giá trị đã lưu.
- **Effort**: ~4h.

---

## P1 — Flow 02 Onboarding (0% → full)

### T3. Onboarding state machine

**Vì sao**: Flow 02 hiện 40% (chỉ có `completeOnboardingAction`). Sign-up xong user vào thẳng dashboard, thiếu bước chọn ngôn ngữ/mục tiêu/trình độ.

- **Service** `services/learning`:
  - Table `user_onboarding (user_id PK, step VARCHAR, answers JSONB, placement_cefr VARCHAR NULL, recommended_track_id VARCHAR NULL, completed_at TIMESTAMP NULL)`.
  - `GET /api/v1/onboarding/state` → `{step, answers, placementCefr, recommendedTrackId}`.
  - `POST /api/v1/onboarding/step` body `{step, data}` → upsert answers JSONB.
  - `POST /api/v1/onboarding/complete` → set `completed_at`, trigger `enrollTrack(recommendedTrackId)`.
- **BFF**:
  - Query: `onboardingState: OnboardingState`.
  - Mutations: `updateOnboarding(step, data: JSON)`, `completeOnboarding`.
- **DoD**: user mới register → redirect `/onboarding` → 4 bước → `/dashboard` có track enrolled.
- **Effort**: ~1.5 ngày.

### T4. Placement test

**Vì sao**: `/placement-test/page.tsx` có UI nhưng không có BE; cần để T3 có `placementCefr`.

- **Service** `services/assessment` (hoặc `content`):
  - `GET /api/v1/assessments/placement?lang=en&targetLang=vi` → `{testId, questions: [{id, prompt, choices, skill}]}` (10-15 câu adaptive/static đều ok MVP).
  - `POST /api/v1/assessments/placement/submit` body `{testId, answers: [{questionId, choice}]}` → `{cefr: "A1"|..|"C1", score, recommendedTrackId}`.
  - Grading: đếm đúng → map sang CEFR theo threshold (ex: <30% = A1, 30-50% = A2, ...). Không cần ML cho MVP.
- **BFF**:
  - Query: `placementTest(lang, targetLang): PlacementTest`.
  - Mutation: `submitPlacement(testId, answers): PlacementResult`.
- **DoD**: `/placement-test` chấm ra CEFR thật, ghi vào `user_onboarding.placement_cefr`.
- **Effort**: ~1 ngày (nếu assessment grading infra đã stable từ PR-A) / ~2 ngày nếu phải build from scratch.

---

## P2 — Progress & Gamification detail

### T5. Activity heatmap 365 ngày

**Vì sao**: `/progress` tab có UI heatmap nhưng dùng mock. PR-B đã wire skillOverview + certPrediction, còn thiếu heatmap.

- **Service** `services/progress`:
  - `GET /api/v1/progress/activity-heatmap?days=365` → `[{date: "2026-04-23", minutes: 15, xp: 120, lessonsCompleted: 3}]`.
  - Query từ bảng `user_activity_daily` (nếu chưa có, tạo materialized view aggregate từ `lesson_completions`).
- **BFF**:
  - Type `ActivityDay { date, minutes, xp, lessonsCompleted }`.
  - Query `activityHeatmap(days: Int = 365): [ActivityDay!]!`.
- **DoD**: `/progress` render heatmap calendar thật.
- **Effort**: ~4h.

### T6. Today mission

**Vì sao**: `/dashboard` có widget "Nhiệm vụ hôm nay" đang hardcode mock.

- **Service** `services/learning`:
  - `GET /api/v1/learning/today-mission` → `{lessonId, lessonTitle, minutesToGoal, xpReward, dueCardCount}`.
  - Logic: lấy next lesson trong track user đang học + dailyGoal - minutes đã học hôm nay.
- **BFF**: Query `todayMission: TodayMission`.
- **DoD**: dashboard widget hiển thị lesson thật + progress bar tới daily goal.
- **Effort**: ~3h.

### T7. Achievements

**Vì sao**: `/achievements` UI có, chưa wire.

- **Service** `services/gamification`:
  - `GET /api/v1/achievements/me` → `[{id, code, title, iconUrl, unlockedAt: ISO|null, progress: {current, target}}]`.
- **BFF**: Query `achievements: [Achievement!]!`.
- **DoD**: `/achievements` hiển thị state unlocked/locked thật.
- **Effort**: ~4h.

### T8. Leaderboard

**Vì sao**: `/leaderboard` UI có, chưa wire.

- **Service** `services/gamification`:
  - `GET /api/v1/leaderboard?window=weekly&scope=global` → `[{rank, userId, displayName, avatarUrl, xp, isMe}]` (top 100 + me).
  - `window`: `weekly|monthly|all_time`. `scope`: `global|friends` (MVP chỉ cần global).
- **BFF**: Query `leaderboard(window: String!, scope: String = "global"): [LeaderboardEntry!]!`.
- **DoD**: `/leaderboard` render ranking thật.
- **Effort**: ~4h.

---

## P3 — Infra hardening (bắt buộc trước ship production)

### T9. Outbox pattern — 4 services (Bug #7 từ wiring-status §4)

**Vì sao**: identity/learning/vocabulary/gamification publish Kafka trực tiếp trong commit handler → nếu Kafka down, mất event vĩnh viễn. Entitlement + billing đã có outbox, 4 service còn lại chưa.

- **Per service** (identity, learning, vocabulary, gamification):
  - Migration: `CREATE TABLE outbox (id UUID PK, aggregate_type VARCHAR, event_type VARCHAR, payload JSONB, created_at TIMESTAMP, processed_at TIMESTAMP NULL, INDEX (processed_at, created_at));`
  - Wrap save domain + insert outbox trong **cùng 1 transaction** (repository layer).
  - Relay worker: goroutine poll `WHERE processed_at IS NULL ORDER BY created_at LIMIT 100` → publish Kafka → `UPDATE SET processed_at = NOW()`.
  - Graceful shutdown: SIGTERM → wait pending publish → exit.
- **Tham khảo**: implementation trong `services/billing/internal/outbox/` hoặc `services/entitlement/internal/outbox/` (chọn cái nào đã có).
- **DoD**: kill Kafka 1 phút → restart → tất cả event dồn lại publish ra đủ, không mất.
- **Effort**: ~2 ngày/service × 4 = ~8 ngày (nhưng parallelize được).

---

## P4 — Nice-to-have (có thể defer sau MVP1)

### T10. Push token register

- **Service** `services/notification`: `POST /api/v1/notifications/push-tokens` body `{token, platform: "web"|"ios"|"android"}`.
- **BFF**: Mutation `registerPushToken(token, platform)`.
- **Effort**: ~3h. **Defer OK** nếu chưa có FCM/APNs account.

### T11. Shop (`/shop` gems/powerups)

- **Defer sang phase 2**. MVP1 chưa có gem economy → để UI static cũng không chặn release.

---

## Tổng effort

| Priority | Task | Effort |
|----------|------|--------|
| P0 | T1 Content listing | 4h |
| P0 | T2 User schema extension | 4h |
| P1 | T3 Onboarding state | 1.5d |
| P1 | T4 Placement test | 1-2d |
| P2 | T5 Activity heatmap | 4h |
| P2 | T6 Today mission | 3h |
| P2 | T7 Achievements | 4h |
| P2 | T8 Leaderboard | 4h |
| P3 | T9 Outbox × 4 services | 8d (parallel) |
| P4 | T10 Push token | 3h (defer OK) |

**Nếu chỉ làm P0+P1+P2** (đủ wire MVP1 100%): **~5-6 ngày** 1 dev BE.
**Nếu + P3 (production-ready infra)**: **+8 ngày** (parallelize được xuống ~3 ngày nếu 3 người).

---

## Checklist done MVP1 BE

- [ ] T1 courses/units — `/learn` navigation thật
- [ ] T2 user schema — `/settings/learning`, `/settings/languages` save được
- [ ] T3 onboarding state — user mới → `/onboarding` 4 bước
- [ ] T4 placement test — chấm CEFR thật
- [ ] T5 activity heatmap — `/progress` calendar thật
- [ ] T6 today mission — dashboard widget thật
- [ ] T7 achievements — `/achievements` state thật
- [ ] T8 leaderboard — `/leaderboard` ranking thật
- [ ] T9 outbox — 4 service có outbox + relay
- [ ] Sau mỗi task: update `docs/wiring-status-2026-04-22.md` (bump %, xoá dòng khỏi §5)

---

## Lưu ý cho Gemini

- **Không đụng FE** ngoài TODO đã đánh dấu (PR-B: `language`, `cert` hardcoded — wire từ `me.uiLanguage` + `onboardingState.placementCefr` sau khi T3 done).
- **Mỗi task = 1 PR riêng** (`feature/be-<task-name>`). PR title: `feat(be): <task>`. Base branch: `main`.
- **Schema BFF**: giữ naming convention camelCase (FE style), không snake_case (kể cả khi service trả snake_case, map trong datasource).
- **Test**: mỗi handler có ít nhất 1 unit test happy path + 1 validation error. BFF resolver có integration test gọi xuống mock datasource.
- **Impact analysis**: trước khi sửa symbol nào đã tồn tại, chạy `gitnexus_impact({target: "symbolName", direction: "upstream"})` và báo risk trong PR description.
- **Commit message**: conventional commits (`feat`, `fix`, `chore`). Không có `Co-Authored-By` Claude trừ khi bạn thực sự dùng Claude Code.
