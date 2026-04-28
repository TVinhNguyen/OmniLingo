# Architecture Deepening — Tasks

> Companion của `architecture-deepening-problems.md`.
> **Quy ước**: mỗi candidate bắt buộc có một bước **Grilling loop** trước khi code — theo SKILL.md, không propose interface khi chưa thống nhất với người ra quyết định.
> Ràng buộc xuyên suốt: **không phá ADR-010** (outbox non-transactional cho MVP1). Phase-2 migration ADR-010 nằm trong từng candidate khi áp dụng.

Pre-flight chung trước khi đụng vào một symbol bất kỳ (theo `CLAUDE.md` GitNexus block):
- `gitnexus_impact({target: <symbol>, direction: "upstream"})` để có blast radius.
- `gitnexus_detect_changes()` trước khi commit.

---

## Candidate 1 — Outbox publish module → `pkg/outbox`

**Status**: Ưu tiên 1.

### 1.1 Grilling loop với người ra quyết định
- Chốt: module sâu sống ở `pkg/outbox` hay `services/shared/outbox`?
- Chốt: có gộp Kafka client wrapper không (hiện tại 2 lib: `franz-go` và `segmentio/kafka-go`) — chuẩn hoá về một lib hay giữ adapter cho cả hai?
- Chốt: worker lifecycle thuộc về module (auto-start) hay caller (`outbox.NewWorker(...).Run(ctx)`)?
- Chốt: schema bảng `outbox_events` đã đồng nhất giữa 5 service chưa? Nếu khác — liệt kê khác biệt.
- Chốt: metrics/observability hooks expose qua interface nào?

### 1.2 Khảo sát hiện trạng
- [ ] Diff side-by-side 5 file `outbox.go` để xác định khác biệt thực sự (Kafka lib, schema, retry config).
- [ ] Chạy `gitnexus_query({query: "outbox enqueue"})` để liệt kê hết publish sites (ADR-010 nói 14 sites).
- [ ] Đọc `services/payment/.../outbox.go` (bản `InsertTx` đúng pattern) để biết shape Phase-2 sẽ trông thế nào.

### 1.3 Triển khai (sau grilling)
- [ ] Tạo `pkg/outbox/` với types + repo + worker.
- [ ] Test ở interface module (PGLite + fake Kafka publisher) — đây là test surface.
- [ ] Migrate identity-service đầu tiên (smallest blast radius để verify shape).
- [ ] Migrate lần lượt vocabulary → learning → billing → gamification.
- [ ] Mỗi service: chạy `gitnexus_impact` trước khi xoá `internal/messaging/outbox.go` cũ.
- [ ] Xoá test cũ ở từng service (theo DEEPENING.md: *replace, don't layer*).

### 1.4 Verify
- [ ] Tất cả integration test cũ pass với module mới.
- [ ] `gitnexus_detect_changes()` chỉ ra đúng các symbol expected.
- [ ] Không có `outbox_events` row bị mất trong manual test (Kafka down → restart → relay tiếp).

### 1.5 Phase-2 ADR-010 hook
- [ ] Note trong README của `pkg/outbox`: chỗ duy nhất cần sửa khi nâng cấp `Enqueue → InsertTx` + `WithTx`.

---

## Candidate 2 — JWKS-verify module (Node-TS)

**Status**: Ưu tiên 2 — security-critical.

### 2.1 Grilling loop
- Chốt: package nội bộ ở đâu? Monorepo-package (e.g. `packages/auth-middleware`) hay copy vào mỗi service rồi rút ra sau?
- Chốt: framework — Express, Fastify, NestJS? (notification, content, grammar, web-bff có cùng framework không?)
- Chốt: claim shape có khác giữa các service không (vd: `roles` vs `scopes`)?
- Chốt: cache invalidation strategy (TTL vs hot-reload trên 401)?

### 2.2 Khảo sát
- [ ] Liệt kê 4 implementation hiện có; diff để tìm khác biệt thật.
- [ ] Confirm identity-service JWKS endpoint contract (`/.well-known/jwks.json`) ổn định.

### 2.3 Triển khai (sau grilling)
- [ ] Tạo package `auth-middleware` với JWKS fetch + cache + verify.
- [ ] Test ở interface middleware: in-memory JWKS server, request-in / user-out.
- [ ] Migrate `notification` service đầu (ít rủi ro nhất).
- [ ] Migrate content → grammar → web-bff.
- [ ] Xoá fetch+verify code cũ ở mỗi service.

### 2.4 Verify
- [ ] E2E auth test pass (web-bff → identity → protected endpoint).
- [ ] Manual: rotate JWKS key → tất cả service refresh trong TTL.

---

## Candidate 4 — Request-parse module (Go)

**Status**: Ưu tiên 3.

### 4.1 Grilling loop
- Chốt: dùng lib có sẵn (`go-playground/validator`) hay tự viết?
- Chốt: error response shape — cố định ở module hay handler tự format?
- Chốt: parse + validate có gộp với map sang domain DTO không, hay chỉ đến validated request struct?
- Chốt: i18n cho error messages — trong scope hay không?

### 4.2 Khảo sát
- [ ] Liệt kê 5–10 handler có validation rườm rà nhất để rút common cases.
- [ ] Chạy `gitnexus_context({name: "auth_handler"})` để hiểu callers/callees của handler điển hình.

### 4.3 Triển khai (sau grilling)
- [ ] Tạo `pkg/request/` với parser + standard error response.
- [ ] Pilot trên 1 endpoint của identity-service (`/auth/register`) để verify shape.
- [ ] Migrate dần các endpoint khác — không bắt buộc trong cùng PR.

### 4.4 Verify
- [ ] Test validation rule là pure-function test.
- [ ] Handler test thu hẹp lại (chỉ test wiring + service call).
- [ ] Error response JSON shape không đổi (backward compat với frontend).

---

## Candidate 5 — Frontend backend-call module

**Status**: Ưu tiên 4.

### 5.1 Grilling loop
- Chốt: một module duy nhất `backend.*` cover cả BFF (GraphQL) lẫn identity (REST)? Hay tách `backend.gql` và `backend.identity`?
- Chốt: token refresh strategy — middleware-style (intercept 401) hay proactive (refresh trước khi expire)?
- Chốt: server-component fetch vs client-component fetch — dùng cùng module hay tách?
- Chốt: typing — tự generate từ OpenAPI/GraphQL schema, hay viết tay?

### 5.2 Khảo sát
- [ ] Grep `fetch(` trong `apps/web` để liệt kê tất cả call site ngoài `client.ts`.
- [ ] Đọc `apps/web/lib/api/auth.ts` để hiểu token refresh flow hiện tại.

### 5.3 Triển khai (sau grilling)
- [ ] Tạo `apps/web/lib/api/backend.ts` (hoặc đổi tên `client.ts`).
- [ ] Migrate auth flow đầu tiên.
- [ ] Migrate dần các page/action; mỗi PR đóng gói một flow.

### 5.4 Verify
- [ ] E2E test login → refresh → logout pass.
- [ ] Không còn `fetch(` trực tiếp trong pages/actions (grep == 0).

---

## Candidate 6 — Postgres bootstrap → `pkg/pgxutil`

**Status**: Ưu tiên 5. Depth gain thấp, làm cùng lúc với Phase-2 ADR-010.

### 6.1 Grilling loop
- Chốt: module có ôm luôn `WithTx` helper (ADR-010 Phase 2) hay chỉ pool + migration?
- Chốt: Goose lib stay hay đổi (`golang-migrate`)?
- Chốt: dial-retry policy (current: ad-hoc per service) — chuẩn hoá sao?

### 6.2 Triển khai (sau grilling)
- [ ] Tạo `pkg/pgxutil/` với `New(dsn)` + `RunMigrations(dsn, dir)`.
- [ ] Migrate 6 service `repository.go` để gọi `pgxutil.New(...)`.
- [ ] (Phase-2 ADR-010) Thêm `WithTx` vào module này; rename `Enqueue → InsertTx`; thread `pgx.Tx` qua repo.

### 6.3 Verify
- [ ] Tất cả service start được; readiness probe pass.
- [ ] Migration chạy idempotent ở môi trường sạch.

---

## Candidate 3 — Service-call HTTP (Go) — HOLD

**Status**: Hypothetical seam (chỉ 1 adapter). Không deepen ngay.

### 3.1 Trigger để re-evaluate
- [ ] Khi xuất hiện caller thứ hai (assessment→srs / progress→content / gamification→identity), re-open candidate này.
- [ ] Khi đó: rule "two adapters = real seam" sẽ thoả; tạo `pkg/rpc` (hoặc tương tự) với in-mem + HTTP adapter.

---

## Cross-candidate

- [ ] Sau khi xong candidate đầu tiên (#1), mở grilling loop để confirm lessons-learned trước khi áp dụng cho #2.
- [ ] Nếu một grilling loop kết thúc bằng "không làm" với lý do load-bearing → ghi ADR mới (`docs/adr/`) theo `ADR-FORMAT.md` để lần review tiếp theo không re-suggest.
