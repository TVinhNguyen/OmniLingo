# 04 — Microservices Breakdown

Phần này liệt kê chi tiết từng service: trách nhiệm (bounded context), API chính, dữ liệu, ngôn ngữ/framework, và ai gọi ai. Tổng số service ở Phase 1: **18 services + 2 BFFs**. Phase 2 sẽ tách thêm khi có nhu cầu (dự kiến 25–30 services).

## Tổng quan service catalog

| # | Service | Bounded Context | Ngôn ngữ | Storage chính |
|---|---------|-----------------|----------|----------------|
| 1 | `identity-service` | Auth, users, RBAC | Go | PostgreSQL, Redis |
| 2 | `learning-service` | Lesson orchestration, progress | Go | PostgreSQL |
| 3 | `content-service` | Courses, lessons, content tree | Node.js (TS) | MongoDB, S3 |
| 4 | `vocabulary-service` | Word entries, user decks | Go | PostgreSQL |
| 5 | `grammar-service` | Grammar points, drills | Node.js (TS) | MongoDB |
| 6 | `srs-service` | Spaced repetition scheduling (FSRS) | Rust | PostgreSQL, Redis |
| 7 | `assessment-service` | Grading exercises, tests, mock | Go | PostgreSQL, Mongo |
| 8 | `progress-service` | Skill scores, level tracking | Go | PostgreSQL, ClickHouse (read) |
| 9 | `gamification-service` | XP, streaks, leagues, badges | Go | PostgreSQL, Redis |
| 10 | `social-service` | Forums, feed, friends, groups | Node.js (TS) | PostgreSQL |
| 11 | `tutor-service` | Teacher profiles, availability | Node.js (TS) | PostgreSQL |
| 12 | `booking-service` | Lesson bookings, scheduling | Go | PostgreSQL |
| 13 | `classroom-service` | Live group classes, enrollment | Node.js (TS) | PostgreSQL |
| 14 | `billing-service` | Subscriptions, invoices | Go | PostgreSQL |
| 15 | `payment-service` | Payment providers adapters | Go | PostgreSQL |
| 16 | `entitlement-service` | Feature access control | Go | PostgreSQL, Redis |
| 17 | `notification-service` | Push, email, in-app | Node.js (TS) | PostgreSQL, Redis |
| 18 | `search-service` | Full-text search, semantic search | Python | Elasticsearch, Vector DB |
| **AI** | | | | |
| 19 | `speech-ai-service` | STT, TTS, pronunciation scoring | Python | — (stateless) |
| 20 | `writing-ai-service` | Essay grading, correction | Python | Vector DB, PostgreSQL |
| 21 | `ai-tutor-service` | Chat/voice tutor, roleplay | Python | Vector DB, Redis |
| 22 | `llm-gateway` | Routing LLM calls, cache, budget | Go | Redis |
| **Support** | | | | |
| 23 | `media-service` | Upload, transcode audio/video | Node.js (TS) | S3, RabbitMQ |
| 24 | `dictionary-service` | Multi-lang dictionary | Python | PostgreSQL, Redis |
| 25 | `moderation-service` | Content moderation (AI + rules) | Python | PostgreSQL |
| 26 | `proctoring-service` | Mock test surveillance | Python | S3, PostgreSQL |
| 27 | `video-service` | WebRTC SFU for live | Go + mediasoup | Redis |
| **BFF** | | | | |
| 28 | `web-bff` | GraphQL aggregator cho web | Node.js (TS) | Redis |
| 29 | `mobile-bff` | GraphQL aggregator cho mobile | Node.js (TS) | Redis |

Dưới đây là chi tiết từng service.

---

## 1. identity-service

**Trách nhiệm**: Đăng ký, đăng nhập, cấp/refresh JWT, quản lý session, RBAC (role: user, teacher, admin, content-editor), MFA, social login, account recovery.

**Không làm**: subscription/entitlement (thuộc billing/entitlement), user profile rộng như bio, preferences (sống trong learning hoặc profile service riêng ở Phase 2).

**API tiêu biểu (gRPC + REST public):**
```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
POST   /auth/oauth/{provider}/callback
POST   /auth/mfa/enroll
POST   /auth/mfa/verify
GET    /users/me
PATCH  /users/me
DELETE /users/me          # GDPR delete
```

**Events emit:**
- `identity.user.registered`
- `identity.user.logged_in`
- `identity.user.deleted`

**Tech**: Go (Fiber/Echo). Passwords: argon2id. JWT RS256. Session store: Redis.

**SLOs**: P99 login < 200ms, availability 99.95%.

---

## 2. learning-service

**Trách nhiệm**: Điều phối trải nghiệm học của người dùng — "hôm nay tôi nên làm gì?". Nó tra plan cá nhân, quyết định lesson tiếp theo, ghi nhận completion, trả về path trong khoá học.

**Không làm**: Không chấm bài (assessment-service), không chứa nội dung bài học (content-service).

**API tiêu biểu:**
```
GET  /learning/home              # dashboard "hôm nay"
GET  /learning/paths/:id
GET  /learning/next-lesson
POST /learning/lessons/:id/start
POST /learning/lessons/:id/complete
GET  /learning/history
POST /learning/goals             # đặt mục tiêu (cert, timeline)
```

**Depend on**: content-service (metadata), progress-service (score), srs-service (due items).

**Events**: `learning.lesson.started/completed`, `learning.goal.set`.

**Tech**: Go. PostgreSQL để lưu UserLearningPlan, UserLessonAttempt.

---

## 3. content-service

**Trách nhiệm**: Nguồn sự thật cho mọi nội dung học — courses, lessons, exercises, audio scripts, reading passages, grammar points metadata. Dạng cây: `Language → Track → Course → Unit → Lesson → Exercise`.

Content được content-editor tạo qua CMS nội bộ (Strapi hoặc custom admin), xuất qua API. Hỗ trợ versioning (content có version, student đang học giữ version cũ cho tới hết lesson).

**API:**
```
GET  /content/languages
GET  /content/tracks?language=ja
GET  /content/courses/:id
GET  /content/lessons/:id
GET  /content/exercises/:id
# Admin:
POST /content/lessons
PATCH /content/lessons/:id
POST /content/lessons/:id/publish
```

**Dữ liệu**: MongoDB (lesson có cấu trúc lồng và thay đổi theo loại), S3 cho media reference.

**Tech**: Node.js + TypeScript + Fastify. Content editor sẽ dùng admin dashboard riêng, viết bằng Next.js.

**Caching**: Lesson đã publish là immutable (per version) → cache rất mạnh ở CDN với surrogate key, invalidate khi version mới.

---

## 4. vocabulary-service

**Trách nhiệm**: Quản lý từ vựng — catalog từ (hệ thống) và deck cá nhân (user). Mỗi entry chứa: lemma, part of speech, pronunciation, meanings (theo ngôn ngữ UI), examples, collocations, level.

**API:**
```
GET  /vocab/entries/:id
POST /vocab/entries/search
GET  /vocab/decks
POST /vocab/decks
POST /vocab/decks/:id/cards
DELETE /vocab/decks/:id/cards/:cardId
POST /vocab/cards/:id/mark-known
POST /vocab/import/anki
```

**Tích hợp**: gọi dictionary-service để enrich; emit event khi user add word → srs-service tự schedule.

**Tech**: Go. PostgreSQL với table `words`, `user_cards`. Full-text search dùng tsvector + pg_trgm (nhẹ), hoặc đẩy sang search-service (Elasticsearch) khi catalog > 1M entries.

---

## 5. grammar-service

**Trách nhiệm**: Grammar points (giải thích) + sinh drill động dựa trên template.

**Template drill ví dụ** (cho ngữ pháp Nhật "~たい"):
```json
{
  "template": "{subject}は{verb-tai}。",
  "slots": {
    "subject": { "pool": "pronouns_ja" },
    "verb-tai": { "pool": "verbs_tai_form" }
  },
  "answer_key": "conjugate verb to -tai form"
}
```

Engine sinh ra câu hỏi cụ thể, assessment-service chấm.

**API:**
```
GET /grammar/points?language=ja&level=N4
GET /grammar/points/:id
GET /grammar/drills?point=:pointId
```

**Tech**: Node.js TS. MongoDB cho template grammar point.

---

## 6. srs-service

**Trách nhiệm**: Spaced repetition scheduling. Thuật toán chính: **FSRS v4/v5** (có thể upgrade). Input: user + item + rating (Again/Hard/Good/Easy) + time reviewed. Output: next due date, new stability/difficulty.

**Tại sao tách service riêng**: SRS là tính toán tần suất cao (user cày vocab có thể 100 reviews/phiên) + thuật toán có tính state machine phức tạp, cần scale độc lập.

**API (gRPC internal):**
```
Schedule(userId, itemId, rating, reviewedAt) → nextDueAt
GetDue(userId, limit) → List<ItemDue>
Batch Schedule for import
```

**Tại sao chọn Rust**: hot path cao tần, cần memory-safe, performance. Thư viện rs-fsrs có sẵn. Server dùng tonic (gRPC).

**Storage**: PostgreSQL `user_srs_state(user_id, item_id, stability, difficulty, last_reviewed, due_at, ...)`, index trên (user_id, due_at) để query due items nhanh. Redis cache top-N due items.

---

## 7. assessment-service

**Trách nhiệm**: Chấm mọi bài tập + mock test. Loại:
- **Auto-gradable** (multiple choice, gap-fill, matching): chấm cục bộ, < 50ms.
- **Speaking/Writing**: delegate tới speech-ai-service / writing-ai-service.
- **Mock test**: điều phối full test, tổng hợp điểm, sinh báo cáo.

**API:**
```
POST /assessments/exercises/:id/submit
POST /assessments/tests/:id/start
POST /assessments/tests/:id/submit
GET  /assessments/tests/:id/result
GET  /assessments/question-bank?cert=ielts&skill=listening
```

**Events**: `assessment.exercise.graded`, `assessment.test.completed`.

**Tech**: Go. Shared logic cho grading rules được tách thành library chung.

---

## 8. progress-service

**Trách nhiệm**: Tính skill score (L/R/W/S, vocab, grammar) theo thời gian. Dùng exponential moving average + difficulty-weighted. Sinh "predicted score" cho chứng chỉ.

**API:**
```
GET /progress/overview
GET /progress/skills
GET /progress/history?skill=listening&range=30d
GET /progress/predicted-score?cert=toeic
```

**Storage**: PostgreSQL cho snapshot cá nhân, query analytics nặng → ClickHouse (read).

---

## 9. gamification-service

**Trách nhiệm**: XP, level, streaks, gems, hearts, badges, leagues. Consume event từ Kafka và cập nhật state.

Tính toán leaderboard dùng Redis Sorted Set (ZSET). League assignment cron hàng tuần.

**API:**
```
GET  /gamification/profile
GET  /gamification/leaderboard/:leagueId
POST /gamification/streak/freeze
GET  /gamification/achievements
```

**Tech**: Go. PostgreSQL cho state lâu dài, Redis cho leaderboard/streak counter (realtime).

---

## 10. social-service

**Trách nhiệm**: Friends, study groups, forum, feed posts, language exchange chat.

**Chat**: Dùng WebSocket (qua service riêng `chat-gateway` ở Phase 2), hoặc tích hợp SendBird / TalkJS SaaS ở MVP để tiết kiệm thời gian.

**API**: post/comment/like/follow/friend-request, gọi moderation-service trước khi publish.

**Tech**: Node.js TS. PostgreSQL.

---

## 11. tutor-service

**Trách nhiệm**: Teacher profile, chứng chỉ, kỹ năng dạy, availability rules (weekly schedule + exceptions), rating, payout history.

**API:**
```
GET  /tutors?language=en&level=B2&available=true
GET  /tutors/:id
POST /tutors/apply           # đăng ký làm giáo viên
PATCH /tutors/me/availability
```

**Verification flow**: đăng ký → upload bằng cấp → admin duyệt → emit `tutor.verified`.

---

## 12. booking-service

**Trách nhiệm**: Đặt lịch, cancel, reschedule, tính giá, hold credit. Tương tác với billing-service (hold) và video-service (tạo room).

**Concurrency**: prevent double-booking bằng DB unique constraint `(tutor_id, time_slot)` + transaction.

---

## 13. classroom-service

**Trách nhiệm**: Live group class — listing, enroll, attendance. Class được admin/teacher tạo trước, học viên đăng ký.

---

## 14. billing-service

**Trách nhiệm**: Plans catalog (tên gói, giá, feature flags), subscription lifecycle (trial, active, past_due, cancelled), invoice, proration, refund, coupon, gift.

**Source of truth** cho "user đang có gói gì". Entitlement-service là projection (đọc nhanh) của data này.

Chi tiết ở [10-subscription-and-monetization.md](./10-subscription-and-monetization.md).

---

## 15. payment-service

**Trách nhiệm**: Adapter cho các payment provider (Stripe, PayPal, VNPay, MoMo, ZaloPay, Alipay, WeChat Pay, Apple IAP, Google Play Billing). Nhận webhook, idempotent xử lý, report về billing-service.

**Tại sao tách**: provider logic thay đổi độc lập với billing (mỗi provider có quirks riêng, Apple/Google IAP có rules rất khác web payment).

---

## 16. entitlement-service

**Trách nhiệm**: Trả lời nhanh câu hỏi "user X có quyền dùng feature Y không?". Các feature được định nghĩa bằng bitmap/feature code, mapping tới plan.

Cache rất mạnh trong Redis + JWT embedded `tier` claim (TTL ngắn 5 phút để nếu downgrade/cancel sẽ phản ánh nhanh).

**API:**
```
GET /entitlements/me
GET /entitlements/check?feature=ai_voice_tutor
```

---

## 17. notification-service

**Trách nhiệm**: Gửi push (FCM, APNs), email (SES/SendGrid), SMS (Twilio), in-app. Template management, throttling, user preferences.

Consume Kafka: `learning.streak.at_risk`, `srs.items.due`, `gamification.achievement.unlocked`, `billing.trial.ending`…

**Tech**: Node.js TS.

---

## 18. search-service

**Trách nhiệm**: Full-text search (lesson, word, grammar point, user post) và semantic search (AI tutor retrieval, "find lessons about this topic").

**Tech**: Python + FastAPI. Elasticsearch cho BM25, Qdrant/pgvector cho embedding. Dùng `sentence-transformers` (multilingual) để tạo embedding offline.

---

## 19. speech-ai-service

**Trách nhiệm**: Speech-to-text (STT), text-to-speech (TTS), pronunciation assessment.

**STT stack:**
- Self-host **Whisper** (large-v3 hoặc faster-whisper) trên GPU (g5.xlarge / equivalent).
- Fallback: Azure Speech / Deepgram cho edge cases (latency nhạy, ngôn ngữ Whisper yếu).

**TTS stack:**
- ElevenLabs (chất lượng cao nhất) cho premium user.
- Azure TTS / Amazon Polly (đủ dùng, rẻ hơn) cho free tier.
- Cache file TTS đã sinh trên S3 → CDN, key = hash(text+voice+lang).

**Pronunciation scoring:**
- Custom model training từ dữ liệu học viên + native. Phase 1: dùng Azure Speech "Pronunciation Assessment" (API đã có, chấm phoneme). Phase 2: train model riêng trên dữ liệu thu thập (cần opt-in).

**API (gRPC):**
```
Transcribe(audio, lang) → text + confidence
Synthesize(text, voice, lang) → audioUrl
AssessPronunciation(audio, referenceText, lang) → score + phonemes
```

**Stateless**: mọi request self-contained, scale ngang bằng GPU pods.

---

## 20. writing-ai-service

**Trách nhiệm**: Chấm Writing (IELTS essay, TOEFL integrated, HSK writing, journal correction), highlight lỗi, đề xuất sửa.

**Approach**:
1. LLM (Claude/GPT) với prompt được tối ưu, có rubric đính kèm, yêu cầu structured output (JSON).
2. Post-process: validate structured output, map lỗi về grammar point cụ thể (dùng vector search trên grammar database).
3. Cache theo hash(prompt + essay) để user thử lại mà không tốn thêm token.

**Cost control**: batched request khi có thể, fallback model tier theo gói (Free dùng model rẻ, Ultimate dùng model mạnh).

---

## 21. ai-tutor-service

**Trách nhiệm**: Chat tutor và voice tutor. Chat: giữ conversation history, context (ngôn ngữ, level, goals của user). Voice: pipeline STT → LLM → TTS streaming (mục tiêu latency < 800ms).

**Tech stack**:
- Python + FastAPI + websockets.
- Redis cho conversation state + rate limiting.
- Vector DB (Qdrant) cho RAG — tutor có thể "nhớ" lesson của user, trả lời bằng context bài học gần đây.

**Voice pipeline**:
```
Client mic → WebRTC → speech-ai-service(STT, streaming VAD)
  → ai-tutor-service(LLM streaming)
  → speech-ai-service(TTS streaming)
  → Client speaker
```
Dùng LLM streaming + TTS streaming (ElevenLabs flash, < 150ms TTFB) để tối ưu perceived latency.

---

## 22. llm-gateway

**Trách nhiệm**: Tầng abstraction cho mọi LLM call — routing giữa provider (OpenAI, Anthropic, Google, self-host), caching, token budget per tenant, PII redaction, prompt template registry, audit log.

**Tại sao cần**: Không để mỗi service gọi LLM trực tiếp → tránh phụ thuộc provider lock-in, dễ kiểm soát chi phí, track abuse, A/B test model.

**Features**:
- Response cache (semantic cache — nếu prompt tương tự đã có answer, serve từ cache).
- Per-user & per-tenant budget limiting.
- Retry with fallback (nếu Anthropic down → fallback OpenAI).
- Cost tracking (mỗi request log tokens và cost ước tính).

**Tech**: Go (hiệu năng tốt cho proxy layer), Redis.

---

## 23. media-service

**Trách nhiệm**: Upload audio/video (student submission, teacher material), transcode (ffmpeg job), generate thumbnails, store S3, emit URL signed.

**Async**: upload → queue (RabbitMQ) → worker transcode → update metadata.

**Tech**: Node.js TS + ffmpeg workers (có thể dùng AWS MediaConvert cho video nặng).

---

## 24. dictionary-service

**Trách nhiệm**: Multi-language dictionary API. Import từ nguồn (Wiktionary dumps, JMdict/JMnedict cho Nhật, CC-CEDICT cho Trung, English wordnet, …) + licensed (Oxford, Collins nếu ngân sách cho phép).

**API**:
```
GET /dict/lookup?lang=ja&word=食べる&uiLang=vi
GET /dict/search?lang=zh&q=学
```

**Tech**: Python + FastAPI. PostgreSQL. Heavy caching (Redis + CDN) vì dictionary entry immutable.

---

## 25. moderation-service

**Trách nhiệm**: Kiểm duyệt mọi user-generated content (forum post, bio, shared deck, profile picture, language exchange chat).

**Pipeline**:
1. Rule-based filter (regex, blocklist).
2. AI classifier (toxic, hate speech, sexual content, PII) — OpenAI moderation API hoặc self-host (unitary/toxic-bert).
3. Image: AWS Rekognition hoặc Hive moderation.
4. Human review queue cho edge case.

---

## 26. proctoring-service

**Trách nhiệm**: Giám sát mock test. Nhận webcam snapshot mỗi 5s, mic stream. AI phân tích: có mặt người khác không, có đang nhìn ra ngoài màn hình không, có giọng thứ hai không, có mở tab mới không (client reporting).

Output "trust score" cho mỗi lần mock test.

Privacy: opt-in rõ ràng, delete data sau N ngày.

---

## 27. video-service

**Trách nhiệm**: WebRTC infrastructure cho voice tutor, tutor 1-1, live class. Dùng **mediasoup** (SFU) hoặc LiveKit.

Architecture:
- Signaling qua WebSocket.
- Media qua SFU (không peer-to-peer vì scale + NAT traversal).
- Recording job xuất MP4 ra S3.

---

## 28, 29. BFF services (web-bff, mobile-bff)

**Trách nhiệm**: Aggregate data từ nhiều services, expose GraphQL cho client. Thêm response-specific caching, auth enforcement, field-level authorization.

**Tech**: Node.js + Apollo Server / Yoga. Dataloader để tránh N+1. Use persisted queries (client gửi query hash thay vì full query).

---

## Service communication matrix (selected)

| Caller ↓ / Callee → | identity | learning | content | vocab | srs | assess | speech-ai | billing | entitle |
|---------------------|:--------:|:--------:|:-------:|:-----:|:---:|:------:|:---------:|:-------:|:-------:|
| web-bff / mobile-bff | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| learning-service | — | — | ✓ | ✓ | ✓ | — | — | — | ✓ |
| vocabulary-service | — | — | — | — | ✓ (add) | — | — | — | — |
| assessment-service | — | — | ✓ | — | — | — | ✓ | — | ✓ |
| ai-tutor-service | — | — | ✓ | — | — | — | ✓ | — | ✓ |
| booking-service | ✓ | — | — | — | — | — | — | ✓ (hold) | — |

(✓ = sync call; event-based interactions qua Kafka không thể hiện ở đây — xem sơ đồ ở [03](./03-high-level-architecture.md).)

## Quy ước phát triển service mới

1. Mỗi service sống trong repo riêng (polyrepo) HOẶC monorepo với bounded module (Turborepo/Nx). Giai đoạn đầu đề xuất **monorepo** để share types và tooling dễ hơn, tách polyrepo khi team > 30.
2. Mọi service có: `openapi.yaml` hoặc `.proto`, `Dockerfile`, `helm chart`, `README`, `migrations/`, `tests/`.
3. Health endpoints: `/healthz` (liveness), `/readyz` (readiness).
4. Metrics: `/metrics` Prometheus format.
5. Log structured JSON, include `trace_id`, `user_id` (nếu có), `tenant_id`.
6. Migration DB phải backward-compatible trong 1 sprint (expand → migrate data → contract).
7. Không service nào được truy cập DB của service khác. Chỉ qua API/event.
