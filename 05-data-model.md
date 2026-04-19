# 05 — Data Model & OmniLingo Persistence

## 1. Chiến lược data (OmniLingo Persistence)

Một database không đáp ứng nổi toàn bộ workload đa dạng của nền tảng. Ta chia theo đặc điểm workload:

| Loại dữ liệu | Đặc điểm | Database | Tại sao |
|--------------|----------|----------|---------|
| User, subscription, billing, progress | OLTP, transactional, quan hệ mạnh | **PostgreSQL** | ACID, joins, extension tốt (pgvector, pg_trgm, ltree, timescaledb) |
| Content (lessons, grammar, questions) | Semi-structured, nested, versioning | **MongoDB** | Document model khớp shape content; search nhẹ |
| Cache, leaderboard, session, rate limit | Ephemeral, TTL, ops cực nhanh | **Redis** | Datastructure server; sorted set, streams |
| Full-text search | Ranking, highlighting, scale | **Elasticsearch / OpenSearch** | Chuyên search, facet, geo |
| Semantic search / embeddings | Nearest neighbor, high-dimension vector | **pgvector (MVP) / Qdrant (scale)** | pgvector đủ cho Phase 1; Qdrant khi > 10M vectors |
| Analytics, event stream query | Ingestion lớn, aggregate query | **ClickHouse** | Cột, nén cao, query aggregate nhanh, self-host |
| Media (audio, video, image) | Binary lớn, phân phối | **S3 + CDN** | Object storage, pay per use, CDN native |
| Offline queue / tasks | At-least-once, retry, DLQ | **RabbitMQ** | Simpler than Kafka cho tasks |
| Event bus | Ordered, replayable, fan-out | **Apache Kafka** | Streaming, exactly-once, cornerstone DDD |

## 2. Ranh giới data theo service (schema-per-service)

Mỗi service **sở hữu** DB của mình. Không service nào truy cập trực tiếp DB service khác — chỉ qua API hoặc event. Về vật lý có thể host cùng cụm Postgres nhưng **schema riêng**, có IAM role riêng.

Ví dụ schema ownership:

```
postgres-cluster/
├── identity_db      (owned by identity-service)
├── learning_db      (owned by learning-service)
├── vocabulary_db    (owned by vocabulary-service)
├── srs_db           (owned by srs-service)
├── progress_db      (owned by progress-service)
├── billing_db       (owned by billing-service)
├── entitlement_db   (owned by entitlement-service)
├── tutor_db
├── booking_db
└── gamification_db
```

## 3. Core schemas (PostgreSQL)

Dưới đây là schema chính (đã đơn giản hoá). Thực tế mỗi bảng còn `created_at`, `updated_at`, `deleted_at` (soft delete), indexes, constraints.

### 3.1. identity_db

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           CITEXT UNIQUE,           -- case-insensitive
    phone           TEXT UNIQUE,
    password_hash   TEXT,                    -- argon2id; NULL nếu chỉ social
    display_name    TEXT NOT NULL,
    avatar_url      TEXT,
    ui_language     TEXT NOT NULL DEFAULT 'en',
    timezone        TEXT NOT NULL DEFAULT 'UTC',
    status          TEXT NOT NULL DEFAULT 'active',  -- active|suspended|deleted
    email_verified  BOOLEAN DEFAULT false,
    mfa_enabled     BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_oauth_identities (
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    provider        TEXT NOT NULL,           -- google|apple|facebook|zalo
    provider_user_id TEXT NOT NULL,
    linked_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (provider, provider_user_id)
);

CREATE TABLE sessions (
    id              UUID PRIMARY KEY,
    user_id         UUID NOT NULL REFERENCES users(id),
    refresh_token_hash TEXT NOT NULL,
    device_info     JSONB,
    ip              INET,
    created_at      TIMESTAMPTZ DEFAULT now(),
    expires_at      TIMESTAMPTZ NOT NULL,
    revoked_at      TIMESTAMPTZ
);

CREATE TABLE roles (
    id              SERIAL PRIMARY KEY,
    name            TEXT UNIQUE NOT NULL      -- user|teacher|admin|content_editor|moderator
);

CREATE TABLE user_roles (
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id         INT  REFERENCES roles(id),
    PRIMARY KEY (user_id, role_id)
);
```

### 3.2. learning_db

```sql
CREATE TABLE user_learning_profiles (
    user_id         UUID PRIMARY KEY,
    primary_language TEXT NOT NULL,            -- ngôn ngữ đang học chính
    secondary_languages TEXT[],
    starting_level  TEXT,                       -- A1|A2|…|N5|HSK1…
    goals           JSONB NOT NULL DEFAULT '[]',-- [{type:'cert', cert:'IELTS', target:7.0, deadline:...}]
    preferences     JSONB NOT NULL DEFAULT '{}' -- daily_goal_minutes, notif prefs, dark_mode
);

CREATE TABLE user_learning_paths (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL,
    language        TEXT NOT NULL,
    path_template_id TEXT NOT NULL,            -- reference to content-service template
    created_at      TIMESTAMPTZ DEFAULT now(),
    current_unit_id TEXT,
    progress_pct    NUMERIC(5,2) DEFAULT 0
);

CREATE TABLE user_lesson_attempts (
    id              BIGSERIAL PRIMARY KEY,
    user_id         UUID NOT NULL,
    lesson_id       TEXT NOT NULL,             -- mongo content id
    lesson_version  INT NOT NULL,
    started_at      TIMESTAMPTZ NOT NULL,
    completed_at    TIMESTAMPTZ,
    score           NUMERIC(5,2),
    xp_earned       INT,
    time_spent_sec  INT
);

CREATE INDEX ix_lesson_attempts_user ON user_lesson_attempts(user_id, started_at DESC);
```

### 3.3. vocabulary_db

```sql
CREATE TABLE words (                            -- catalog từ (system-level)
    id              UUID PRIMARY KEY,
    language        TEXT NOT NULL,
    lemma           TEXT NOT NULL,
    pos             TEXT,                        -- part of speech
    ipa             TEXT,
    frequency_rank  INT,                         -- theo frequency list
    level           TEXT,                        -- A1|N5|HSK1…
    extra           JSONB,                       -- fields đặc thù
    UNIQUE (language, lemma, pos)
);

CREATE INDEX ix_words_trgm ON words USING gin (lemma gin_trgm_ops);
CREATE INDEX ix_words_lang_rank ON words(language, frequency_rank);

CREATE TABLE word_meanings (
    id              UUID PRIMARY KEY,
    word_id         UUID REFERENCES words(id) ON DELETE CASCADE,
    ui_language     TEXT NOT NULL,               -- 'vi','en'
    meaning         TEXT NOT NULL,
    order_idx       INT DEFAULT 0
);

CREATE TABLE word_examples (
    id              UUID PRIMARY KEY,
    word_id         UUID REFERENCES words(id),
    sentence        TEXT NOT NULL,
    translation     JSONB,                       -- {'vi': '…', 'en': '…'}
    audio_url       TEXT
);

CREATE TABLE decks (
    id              UUID PRIMARY KEY,
    owner_id        UUID NOT NULL,              -- user hoặc 'system' UUID cho deck chính
    language        TEXT NOT NULL,
    name            TEXT NOT NULL,
    is_public       BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_cards (
    id              UUID PRIMARY KEY,
    user_id         UUID NOT NULL,
    deck_id         UUID NOT NULL,
    word_id         UUID NOT NULL REFERENCES words(id),
    added_at        TIMESTAMPTZ DEFAULT now(),
    suspended       BOOLEAN DEFAULT false
);

CREATE INDEX ix_user_cards_user ON user_cards(user_id, deck_id);
```

### 3.4. srs_db

```sql
CREATE TABLE srs_states (
    user_id         UUID NOT NULL,
    item_kind       TEXT NOT NULL,               -- 'vocab'|'kanji'|'grammar'|'listening_phrase'
    item_id         TEXT NOT NULL,
    stability       DOUBLE PRECISION NOT NULL,
    difficulty      DOUBLE PRECISION NOT NULL,
    reps            INT NOT NULL DEFAULT 0,
    lapses          INT NOT NULL DEFAULT 0,
    last_review_at  TIMESTAMPTZ,
    due_at          TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (user_id, item_kind, item_id)
);

CREATE INDEX ix_srs_due ON srs_states(user_id, due_at);

CREATE TABLE srs_reviews (                       -- history, hữu ích để train lại FSRS
    id              BIGSERIAL PRIMARY KEY,
    user_id         UUID NOT NULL,
    item_kind       TEXT NOT NULL,
    item_id         TEXT NOT NULL,
    rating          SMALLINT NOT NULL,           -- 1=Again, 2=Hard, 3=Good, 4=Easy
    elapsed_days    DOUBLE PRECISION,
    reviewed_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Partition theo tháng để trim lịch sử
```

### 3.5. progress_db

```sql
CREATE TABLE skill_scores (
    user_id         UUID NOT NULL,
    language        TEXT NOT NULL,
    skill           TEXT NOT NULL,               -- listening|reading|writing|speaking|vocab|grammar
    score           NUMERIC(6,2) NOT NULL,       -- 0..100 hoặc scale riêng
    ci_low          NUMERIC(6,2),                -- confidence interval
    ci_high         NUMERIC(6,2),
    updated_at      TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (user_id, language, skill)
);

CREATE TABLE cert_predictions (
    user_id         UUID,
    cert_code       TEXT,                        -- IELTS|TOEIC|HSK|JLPT_N3…
    predicted_score NUMERIC(6,2),
    predicted_band  TEXT,
    model_version   TEXT,
    computed_at     TIMESTAMPTZ,
    PRIMARY KEY (user_id, cert_code)
);
```

### 3.6. billing_db (simplified)

```sql
CREATE TABLE plans (
    code            TEXT PRIMARY KEY,            -- 'plus_monthly','pro_annual'…
    name            TEXT NOT NULL,
    tier            TEXT NOT NULL,               -- free|plus|pro|ultimate|family|b2b
    price_cents     INT NOT NULL,
    currency        TEXT NOT NULL,
    interval        TEXT NOT NULL,               -- month|year|lifetime
    features        JSONB NOT NULL,              -- feature flags array
    is_active       BOOLEAN DEFAULT true
);

CREATE TABLE subscriptions (
    id              UUID PRIMARY KEY,
    user_id         UUID NOT NULL,
    plan_code       TEXT REFERENCES plans(code),
    status          TEXT NOT NULL,               -- trialing|active|past_due|canceled|expired
    provider        TEXT NOT NULL,               -- stripe|apple_iap|google_iap|vnpay…
    provider_sub_id TEXT,
    current_period_start TIMESTAMPTZ,
    current_period_end   TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE invoices (
    id              UUID PRIMARY KEY,
    user_id         UUID NOT NULL,
    subscription_id UUID REFERENCES subscriptions(id),
    amount_cents    INT NOT NULL,
    currency        TEXT NOT NULL,
    status          TEXT NOT NULL,               -- open|paid|void|refunded
    provider_invoice_id TEXT,
    issued_at       TIMESTAMPTZ,
    paid_at         TIMESTAMPTZ
);

CREATE INDEX ix_subs_user ON subscriptions(user_id, status);
```

### 3.7. tutor_db, booking_db

```sql
CREATE TABLE tutor_profiles (
    user_id         UUID PRIMARY KEY,
    languages       TEXT[] NOT NULL,
    specializations TEXT[],                      -- 'IELTS','JLPT','kids','business'
    bio             TEXT,
    hourly_rate_cents INT NOT NULL,
    currency        TEXT NOT NULL,
    rating_avg      NUMERIC(3,2),
    rating_count    INT DEFAULT 0,
    verified_at     TIMESTAMPTZ,
    timezone        TEXT
);

CREATE TABLE tutor_availability (
    tutor_id        UUID REFERENCES tutor_profiles(user_id),
    weekday         SMALLINT NOT NULL,           -- 0=Sun..6
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    PRIMARY KEY (tutor_id, weekday, start_time)
);

CREATE TABLE bookings (
    id              UUID PRIMARY KEY,
    tutor_id        UUID NOT NULL,
    student_id      UUID NOT NULL,
    scheduled_start TIMESTAMPTZ NOT NULL,
    duration_min    INT NOT NULL,
    status          TEXT NOT NULL,               -- held|confirmed|canceled|completed|no_show
    price_cents     INT NOT NULL,
    room_id         TEXT,                        -- video-service room id
    UNIQUE (tutor_id, scheduled_start)           -- ngăn double book
);
```

### 3.8. gamification_db

```sql
CREATE TABLE user_xp (
    user_id         UUID PRIMARY KEY,
    total_xp        BIGINT NOT NULL DEFAULT 0,
    level           INT NOT NULL DEFAULT 1,
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_streaks (
    user_id         UUID PRIMARY KEY,
    current         INT NOT NULL DEFAULT 0,
    longest         INT NOT NULL DEFAULT 0,
    last_active_date DATE,
    freezes_left    INT NOT NULL DEFAULT 0
);

CREATE TABLE achievements (
    code            TEXT PRIMARY KEY,
    name            TEXT,
    description     TEXT,
    icon            TEXT,
    xp_reward       INT DEFAULT 0
);

CREATE TABLE user_achievements (
    user_id         UUID,
    achievement_code TEXT REFERENCES achievements(code),
    earned_at       TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, achievement_code)
);

-- Leaderboard hiện tại LIVE trong Redis ZSET; snapshot cuối tuần lưu table này
CREATE TABLE league_history (
    user_id         UUID,
    week_start      DATE,
    league          TEXT,
    rank            INT,
    xp              INT,
    promoted        BOOLEAN,
    PRIMARY KEY (user_id, week_start)
);
```

## 4. MongoDB schemas (content_db)

Content dùng Mongo vì cấu trúc nested và variant nhiều.

### 4.1. `lessons` collection

```json
{
  "_id": "ObjectId",
  "id": "lesson_ja_n5_greetings_01",
  "version": 3,
  "language": "ja",
  "track": "general",
  "level": "N5",
  "unit_id": "unit_ja_n5_01",
  "title": {"ja": "あいさつ", "en": "Greetings", "vi": "Chào hỏi"},
  "objective": {"vi": "Biết chào hỏi cơ bản", "en": "..."},
  "estimated_minutes": 12,
  "blocks": [
    { "type": "explanation", "content": {"vi": "...", "en": "..."} },
    { "type": "vocab_intro", "words": ["word_id_1", "word_id_2"] },
    { "type": "exercise", "exercise_id": "ex_123" },
    { "type": "dictation", "audio_ref": "s3://media/lessons/ja/greet01.mp3",
      "sentences": [{"text": "おはようございます", "start_ms": 300, "end_ms": 2400}] }
  ],
  "published_at": "2025-01-10T00:00:00Z",
  "status": "published"
}
```

### 4.2. `exercises` collection (polymorphic)

Vì có nhiều loại bài, dùng `type` discriminator:

```json
{
  "id": "ex_123",
  "type": "multiple_choice",
  "language": "ja",
  "level": "N5",
  "skill": "grammar",
  "prompt": {"text": "___を食べます。", "audio_ref": null},
  "choices": ["りんご", "いきます", "おおきい", "きれい"],
  "answer": 0,
  "explanation": {"vi": "…", "en": "…"},
  "tags": ["particle_wo", "verb_food"]
}
```

```json
{
  "id": "ex_456",
  "type": "dictation",
  "audio_ref": "s3://...",
  "reference_text": "今日は良い天気ですね",
  "length_seconds": 3.2
}
```

```json
{
  "id": "ex_789",
  "type": "speaking_prompt",
  "prompt": {"vi": "Hãy giới thiệu bản thân trong 30 giây"},
  "duration_seconds": 30,
  "rubric_code": "ielts_speaking_part1"
}
```

### 4.3. `question_bank` (test prep)

```json
{
  "id": "q_toeic_l_part2_0001",
  "cert": "toeic",
  "section": "listening",
  "part": 2,
  "difficulty": 0.4,            // 0..1
  "audio_ref": "s3://...",
  "transcript": "...",
  "choices": ["A","B","C"],
  "answer": "B",
  "explanation_ref": "...",
  "skills_tested": ["wh_question","tense"],
  "source": "internal|licensed_cambridge|etc"
}
```

## 5. ClickHouse schema (analytics_db)

Wide event table, flatten, optimized for aggregate.

```sql
CREATE TABLE events
(
    event_id    UUID,
    event_name  LowCardinality(String),
    event_ts    DateTime64(3, 'UTC'),
    user_id     UUID,
    session_id  UUID,
    device      LowCardinality(String),
    app_version LowCardinality(String),
    language    LowCardinality(String),
    properties  String,                -- JSON
    -- denormalized from user_dim
    user_tier   LowCardinality(String),
    user_level  LowCardinality(String)
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(event_ts)
ORDER BY (event_name, event_ts, user_id)
TTL event_ts + INTERVAL 2 YEAR;
```

Materialized views cho các query thường:
- DAU/MAU rollup theo ngày/tháng.
- Funnel: register → first_lesson → day_7_active.
- Content engagement: lesson_id → start/complete/abandon rate.

## 6. Redis usage

| Key pattern | Mục đích | TTL |
|-------------|----------|-----|
| `session:{sessionId}` | Session data | 24h |
| `rate:{userId}:{endpoint}` | Rate limiting | 60s rolling |
| `srs:due:{userId}` | Cache danh sách due items | 5 phút, invalidate on review |
| `leaderboard:league:{leagueId}:{week}` | ZSET, score = XP | 7 ngày |
| `streak:{userId}` | Counter streak, expire-at local midnight | Daily |
| `entitle:{userId}` | Cache feature flags của user | 5 phút |
| `tts:{hash}` | URL audio TTS đã sinh | 30 ngày |
| `lock:{resource}:{id}` | Distributed lock (Redlock) | <10s |
| `budget:llm:{tenant}:day` | Token counter AI | 24h |

## 7. S3 layout (media)

```
s3://omnilingo-media/
├── lessons/              # audio + video bài chính, versioned
│   └── {language}/{lessonId}/v{n}/{file}
├── questions/            # audio đề thi
├── user-uploads/         # student recording, essay images
│   └── {userId}/{yyyy}/{mm}/{uuid}.webm
├── tts-cache/            # TTS generated reusable
├── teacher-materials/
└── proctoring/           # raw proctor frames, auto-delete after 30d
```

CloudFront/Cloudflare CDN ngoài cho public content. Signed URL cho user content riêng tư.

## 8. Event schemas (Kafka)

Schema được định nghĩa ở Schema Registry (Avro hoặc Protobuf). Ví dụ:

```proto
syntax = "proto3";
package omnilingo.events.learning;

message LessonCompleted {
  string event_id = 1;
  google.protobuf.Timestamp occurred_at = 2;
  string user_id = 3;
  string lesson_id = 4;
  int32 lesson_version = 5;
  float score = 6;
  int32 xp_earned = 7;
  int32 time_spent_sec = 8;
  string language = 9;
  string skill_emphasis = 10;    // listening|vocab|…
}
```

Naming convention topic: `<domain>.<entity>.<action>` ví dụ:
- `learning.lesson.completed`
- `assessment.exercise.graded`
- `billing.subscription.created`
- `gamification.achievement.unlocked`

Partition key = `user_id` (đảm bảo ordering trong cùng user), partitions = 32 (scale tới ~32k write TPS).

## 9. Migrations & versioning

- Tool: **goose** cho Go services (PostgreSQL), **Alembic** cho Python (PostgreSQL), Rust dùng **sqlx migrate**.
- Node.js services hiện tại dùng **MongoDB** (không cần SQL migration — schema quản lý trong code). Nếu tương lai có Node service dùng PostgreSQL → dùng **Prisma Migrate** hoặc **Knex**.
- Forward-only migrations. Nếu cần rollback — forward fix.
- Expand-contract pattern cho breaking change:
  1. Expand: thêm cột mới, cho phép NULL, code ghi vào cả cột cũ và mới.
  2. Backfill job cập nhật cột mới.
  3. Contract: đổi code chỉ đọc/ghi cột mới, drop cột cũ ở release sau.

## 10. Data privacy & retention

| Loại dữ liệu | Retention | Lý do |
|--------------|-----------|-------|
| User account | cho tới khi delete | |
| Learning events | 2 năm hot (ClickHouse), 5 năm cold (S3 + Glacier) | Research, product analytics |
| Recording tutor 1-1 | 60 ngày (có thể opt-in lâu hơn) | Chất lượng, dispute resolution |
| Proctoring raw | 30 ngày | Verification, privacy |
| Chat AI tutor | 90 ngày (default), user có thể xoá bất cứ lúc nào | |
| Payment data | 7 năm (theo luật thuế) | |
| Anonymized aggregate | forever | |

GDPR delete: cascade qua tất cả service (saga) trong 30 ngày. Chi tiết ở [09](./09-security-and-compliance.md).

## 11. Backup & DR

- Postgres: WAL archiving + daily logical dump lên S3 khác region. PITR 30 ngày.
- Mongo: managed backup (Atlas) hoặc `mongodump` daily.
- Redis: AOF + RDB snapshot (chấp nhận mất < 1 phút data cache).
- ClickHouse: backup via `BACKUP` statement, test restore monthly.
- RPO: 5 phút cho transactional; 1 giờ cho analytics.
- RTO: 1 giờ cho tier-1 service, 4 giờ cho phần còn lại.
