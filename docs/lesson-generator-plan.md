# Lesson Plan Generator — Pipeline Design (2026-04-26)

> **Mục đích**: Sau khi import xong 3 dictionary (JMdict + CEDICT + WordNet) → có ~520k vocab entry với frequency rank chuẩn → dùng làm **input cho LLM-assisted content pipeline** sinh lesson + exercise + audio cho content-service.
>
> **Output mục tiêu MVP1**: 1 track English A1-A2 đầy đủ (5 unit / 40 lesson / 600 vocab / 40 audio file) trong ~3 tuần (1 dev + 1 freelance reviewer).
>
> **Cost estimate**: ~$300 Claude API + ~$300 ElevenLabs TTS + $2k freelance reviewer = **~$2,600** cho track demo.

---

## 1. Architectural decision: script trong `content-service`

| Câu hỏi | Quyết định | Lý do |
|---------|-----------|-------|
| Generator là **service** hay **script offline**? | **Script offline** | Generate là 1-time per lesson, không cần 24/7. Pattern giống `vocabulary/scripts/` |
| Đặt ở đâu? | `services/content/scripts/` | Gần Mongo content-service, dùng chung connection + types |
| Ngôn ngữ? | Python + Anthropic SDK | Same stack với vocabulary importer, reuse common patterns |
| Output đến đâu? | Content-service REST `POST /content/lessons` (đã có) | Không bypass service, đảm bảo validation + cache invalidation |

**Tránh**:
- Tạo `content-generator-service` riêng → over-engineering, không cần 24/7
- Generate trực tiếp Mongo bypass service → bypass validation
- Inline trong web-bff → vi phạm BFF responsibility

---

## 2. Pipeline architecture

```
┌──────────────────────────────────────────────────────────────────┐
│ Author input (CLI args hoặc YAML config)                         │
│  - track:       "english_a1_for_vi"                              │
│  - unit:        "greetings"                                      │
│  - lesson_id:   "hello_basics"                                   │
│  - target_words: ["hello","hi","goodbye","thanks"]               │
│  - level:       "cefr_a1"                                        │
└────────────────────────┬─────────────────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│ 1. Vocab Selector (query vocabulary-service words table)         │
│    SELECT lemma, ipa, reading, level FROM words                  │
│    WHERE language='en' AND level IN ('cefr_a1','')               │
│      AND frequency_rank < 1000                                   │
│      AND lemma = ANY($target_words)                              │
└────────────────────────┬─────────────────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│ 2. Lesson Skeleton Generator (Claude Sonnet)                     │
│    Prompt: rubric + vocab list + level → JSON                    │
│    Output: { intro, grammar_note, exercises: [{type, spec}] }    │
└────────────────────────┬─────────────────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│ 3. Exercise Generator (per exercise type)                        │
│    For each exercise spec → Claude generate full content + key   │
│    Types: multiple_choice, gap_fill, matching, dictation,        │
│           audio_to_type, sentence_construct                      │
└────────────────────────┬─────────────────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│ 4. Audio Generator (ElevenLabs TTS → S3)                         │
│    Extract all sentences → for each:                             │
│      - cache key = sha256(text + voice_id + lang)                │
│      - if S3 exists: skip                                        │
│      - else: ElevenLabs synthesize → upload S3                   │
│      - replace text with {audio: s3_signed_url}                  │
└────────────────────────┬─────────────────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│ 5. Validator                                                     │
│    - JSON schema validate (matches lesson.model.ts)              │
│    - Level appropriate check (vocab not above level)             │
│    - Moderation: claude moderation API                            │
│    - Answer key verification (no nulls, all exercises gradable)  │
└────────────────────────┬─────────────────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│ 6. Reviewer Queue (status='draft')                               │
│    - Save to file: drafts/{track}/{lesson_id}.json               │
│    - Reviewer opens, edits, marks approved                       │
│    - Or: minimal review web UI (defer Phase 2)                   │
└────────────────────────┬─────────────────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│ 7. Publisher                                                     │
│    POST /api/v1/content/admin/lessons → content-service          │
│    Status='published', Kafka emit content.lesson.published       │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Cấu trúc thư mục

```
services/content/scripts/
├── pyproject.toml              # anthropic + httpx + asyncpg + boto3 + pyyaml
├── Makefile                    # gen-lesson, gen-unit, gen-track, audio-cache, publish
├── common/
│   ├── claude_client.py        # Wrapped Anthropic API with retry + cost tracking
│   ├── vocab_query.py          # asyncpg query vocabulary words table
│   ├── tts_client.py           # ElevenLabs API + S3 upload + cache
│   ├── content_api.py          # REST client → content-service
│   └── schema.py               # Pydantic models matching lesson.model.ts
├── prompts/
│   ├── lesson_skeleton.md      # Rubric prompt for skeleton generation
│   ├── exercise_multiple_choice.md
│   ├── exercise_gap_fill.md
│   ├── exercise_matching.md
│   ├── exercise_dictation.md
│   ├── exercise_audio_to_type.md
│   └── exercise_sentence_construct.md
├── tracks/
│   ├── english_a1_for_vi.yaml  # Track config: unit list + theme + target words
│   ├── japanese_n5_for_vi.yaml
│   └── chinese_hsk1_for_vi.yaml
├── generators/
│   ├── skeleton.py             # Phase 2: lesson skeleton from track config
│   ├── exercises.py            # Phase 3: exercise content per type
│   ├── audio.py                # Phase 4: TTS pipeline
│   └── validator.py            # Phase 5: schema + level + moderation
├── publish.py                  # Phase 7: post to content-service
└── drafts/                     # gitignored — reviewer working dir
    └── english_a1_for_vi/
        ├── 01_hello_basics.draft.json
        ├── 01_hello_basics.approved.json   # after review
        └── ...
```

---

## 4. Implementation phases

### Phase G1 — Setup + content schema (1 ngày) — `feat/lesson-gen-G1-setup`

**Tasks**:
- [ ] **G1.1** — Tạo `services/content/scripts/` với pyproject.toml + Makefile + common/
- [ ] **G1.2** — `common/schema.py` Pydantic models match `lesson.model.ts` (Lesson, Exercise, Block types)
- [ ] **G1.3** — `common/vocab_query.py` async query → `words` table
- [ ] **G1.4** — `common/claude_client.py` wrap Anthropic SDK with retry + token logging
- [ ] **G1.5** — `tracks/english_a1_for_vi.yaml` template (5 unit, ~40 lesson stub config)

**DoD**: `make help` show 5 target. `python -c "from common.schema import Lesson; print(Lesson.model_json_schema())"` runs.

### Phase G2 — Lesson skeleton generator (3 ngày) — `feat/lesson-gen-G2-skeleton`

**Goal**: Given track + unit + lesson config → Claude generate JSON skeleton.

**Prompt template** (`prompts/lesson_skeleton.md`):
```
You are an English language teacher creating a CEFR {level} lesson for Vietnamese learners.

Lesson goal: {goal}
Target vocabulary: {vocab_list_with_meanings}
Theme: {theme}

Generate a lesson with:
1. Brief intro (50-80 words) in Vietnamese explaining what learner will achieve
2. 1 grammar note (if applicable, 100 words max) in Vietnamese explaining 1 key structure
3. 5-7 exercises mixed types:
   - 2 multiple_choice (vocab recognition)
   - 1 gap_fill (sentence completion)
   - 1 matching (word → meaning)
   - 1 audio_to_type (listening + typing)
   - 1 sentence_construct (build correct sentence from blocks)
4. Brief review summary

Output JSON matching this schema:
{schema}

Respond ONLY with valid JSON, no markdown.
```

**Tasks**:
- [ ] **G2.1** — `prompts/lesson_skeleton.md` rubric template với placeholders
- [ ] **G2.2** — `generators/skeleton.py` orchestrator: load config → query vocab → call Claude → parse JSON → save draft
- [ ] **G2.3** — Retry logic: nếu Claude trả invalid JSON → retry 2 lần với "your last output had X issue" prompt
- [ ] **G2.4** — Cost tracking: log token usage per lesson, dump CSV report
- [ ] **G2.5** — CLI: `python generators/skeleton.py --track english_a1_for_vi --unit greetings --lesson hello_basics`

**DoD**: Generate 1 lesson skeleton từ test config, output valid JSON pass schema.

### Phase G3 — Exercise generators (4 ngày) — `feat/lesson-gen-G3-exercises`

Per exercise type, có riêng prompt + generator. Skeleton chỉ define `{type, spec}`, G3 fill in full content.

**Tasks**:
- [ ] **G3.1** — `prompts/exercise_multiple_choice.md` + generator: 1 question, 4 choices, 1 correct, distractor must be plausible
- [ ] **G3.2** — `prompts/exercise_gap_fill.md` + generator: sentence với `___` placeholder, accept multiple correct
- [ ] **G3.3** — `prompts/exercise_matching.md` + generator: 4-6 word-meaning pairs
- [ ] **G3.4** — `prompts/exercise_dictation.md` + generator: short sentence để gõ lại từ audio
- [ ] **G3.5** — `prompts/exercise_audio_to_type.md` + generator: hear word → type
- [ ] **G3.6** — `prompts/exercise_sentence_construct.md` + generator: shuffled blocks → assemble sentence
- [ ] **G3.7** — Quality check: answer key validate (no ambiguous answers in MC, gap_fill regex anchored)

**DoD**: Mỗi loại exercise generate được 5 example pass schema validation.

### Phase G4 — Audio pipeline (3 ngày) — `feat/lesson-gen-G4-audio`

**Goal**: Mỗi sentence trong lesson → ElevenLabs TTS → S3 → URL trong lesson JSON.

**Tasks**:
- [ ] **G4.1** — `common/tts_client.py` ElevenLabs API wrapper
- [ ] **G4.2** — Cache layer: S3 key = `audio/{lang}/{voice_id}/{sha256(text)}.mp3`. Nếu key exists → skip TTS call.
- [ ] **G4.3** — `generators/audio.py`: walk lesson JSON, extract all sentences (intro + exercise prompts + dictation), batch TTS, upload S3, replace text với `{text, audio_url}` object
- [ ] **G4.4** — Voice selection: track config define `voice_id` per language (e.g. "Rachel" for EN, "Asahi" for JA — ElevenLabs voice IDs)
- [ ] **G4.5** — Cost tracking: ElevenLabs char count per lesson

**DoD**: 1 lesson đi qua audio pipeline, all sentences có S3 URL accessible. Cache hit second run = 0 ElevenLabs call.

### Phase G5 — Validator + reviewer queue (2 ngày) — `feat/lesson-gen-G5-validate`

**Tasks**:
- [ ] **G5.1** — `generators/validator.py`:
  - JSON schema validate via Pydantic
  - Level check: extract all vocab in lesson, verify `frequency_rank` <= threshold for level
  - Answer key check: every exercise has non-null `answer` field
  - Moderation: send to Anthropic moderation API (or basic regex blocklist)
- [ ] **G5.2** — Save validated lesson as `drafts/{track}/{lesson_id}.draft.json`
- [ ] **G5.3** — Reviewer flow:
  - Reviewer opens .draft.json in editor
  - Edit any field (intro/exercises/correct answers)
  - Rename file `.draft.json` → `.approved.json` để mark approved
  - Optional: simple Streamlit UI cho review (defer Phase 2)

**DoD**: Validator catches 5 test cases (invalid JSON, vocab too hard, missing answer key, etc.)

### Phase G6 — Publisher (1 ngày) — `feat/lesson-gen-G6-publish`

**Tasks**:
- [ ] **G6.1** — `publish.py`: scan `drafts/*.approved.json`, POST to content-service
- [ ] **G6.2** — Idempotency: check if lesson_id exists, PATCH instead of POST
- [ ] **G6.3** — Move file `.approved.json` → `.published.json` after success
- [ ] **G6.4** — Bulk publish: `make publish-track TRACK=english_a1_for_vi`

**DoD**: 1 approved lesson publish → content-service Mongo có document, BFF query `lesson(id)` trả full content.

---

## 5. Track config example (`tracks/english_a1_for_vi.yaml`)

```yaml
track:
  id: english_a1_for_vi
  title: "English A1 for Vietnamese Learners"
  description: "Khoá học tiếng Anh từ con số 0 dành cho người Việt"
  source_lang: en
  ui_lang: vi
  cefr_level: A1

units:
  - id: greetings
    title: "Chào hỏi"
    theme: greetings
    lessons:
      - id: hello_basics
        title: "Hello & Hi"
        target_words: [hello, hi, hey, greetings]
        grammar_focus: null
        target_minutes: 5
      - id: introducing_yourself
        title: "Tự giới thiệu"
        target_words: [my, name, am, is]
        grammar_focus: "verb 'to be' (am/is)"
        target_minutes: 7
      - id: how_are_you
        title: "How are you?"
        target_words: [how, are, you, fine, thanks]
        grammar_focus: null
        target_minutes: 5
      - id: goodbye
        title: "Tạm biệt"
        target_words: [bye, goodbye, see, you, later]
        grammar_focus: null
        target_minutes: 5

  - id: family
    title: "Gia đình"
    # ...

voice:
  primary: "21m00Tcm4TlvDq8ikWAM"   # ElevenLabs Rachel
  fallback: "ErXwobaYiN019PkySvjV"  # ElevenLabs Antoni
```

---

## 6. Cost breakdown — 40 lesson English A1 track

| Phase | Cost item | Per lesson | × 40 lessons |
|-------|-----------|-----------|--------------|
| G2 Skeleton | Claude Sonnet ~5k input + 3k output token | $0.05 | $2 |
| G3 Exercises | Claude Sonnet ~10k input + 5k output token (6 exercises) | $0.10 | $4 |
| G4 Audio | ElevenLabs ~3000 char @ $0.30/1k char | $0.90 | $36 |
| G5 Validator | Claude moderation API | $0.001 | $0.04 |
| **Total content cost** | | **~$1.05** | **~$42** |
| Reviewer time | 30-45 min/lesson | — | ~25 hours @ $40/hour = $1,000 |
| **Total per track** | | | **~$1,050 (40 lesson)** |

**Scale economics**: cost-per-lesson < $1.10 means:
- Adding new track = ~$50 LLM + reviewer time
- Re-generate lesson nếu format change = ~$1
- Even cheap enough to A/B test 2 versions per lesson (~$84/track)

---

## 7. Quality control checklist (mỗi lesson trước publish)

- [ ] Vocab tất cả thuộc level target hoặc thấp hơn (kiểm tra qua words table frequency_rank)
- [ ] Mọi câu trả lời chính xác và unambiguous
- [ ] Audio file accessible từ S3 signed URL
- [ ] Intro/grammar note tiếng Việt natural, không Google Translate-ish
- [ ] Exercise difficulty progression: dễ → khó trong 1 lesson
- [ ] Cultural sensitivity: không dùng example phản cảm/political/religious
- [ ] Reviewer marked `.approved.json`

---

## 8. Effort + timeline tổng

| Phase | Effort | Kết quả |
|-------|--------|---------|
| G1 Setup | 1 ngày | Project skeleton + schema models |
| G2 Skeleton gen | 3 ngày | 1 lesson skeleton từ config |
| G3 Exercise gen | 4 ngày | 6 exercise type generators |
| G4 Audio pipeline | 3 ngày | TTS + S3 cache + URL injection |
| G5 Validator | 2 ngày | Quality gate before reviewer |
| G6 Publisher | 1 ngày | content-service POST integration |
| **Pipeline build** | **~14 ngày (2 tuần)** | Pipeline ready cho content team |
| English A1 track gen (40 lesson) | 1 tuần Claude + 25h reviewer | 40 lesson published |

**→ ~3 tuần tổng** từ bây giờ đến có 1 track demo full.

---

## 9. Brief paste cho Gemini (start với G1)

```
Task: Phase G1 — Lesson generator pipeline setup.

Context:
Sau khi import 3 dictionary (JMdict + CEDICT + WordNet) xong, vocabulary words table
có ~520k entry với frequency rank chuẩn. Giờ build pipeline content cho content-service:
generate lesson + exercise + audio cho track English A1.

Goal:
1. Setup services/content/scripts/ Python project:
   - pyproject.toml: anthropic, httpx, asyncpg, boto3, pyyaml, pydantic, jsonschema
   - Makefile target: gen-lesson, gen-unit, gen-track, audio-cache, validate, publish
   - common/schema.py: Pydantic Lesson, Unit, Exercise, Block models match
     services/content/src/domain/models/lesson.model.ts
   - common/vocab_query.py: asyncpg connect → query words table by lemma list
   - common/claude_client.py: wrap Anthropic SDK với retry (3x exponential), token cost log
   - common/content_api.py: httpx client → POST /api/v1/content/admin/lessons (auth qua admin token)

2. tracks/english_a1_for_vi.yaml: skeleton với 5 unit + 40 lesson stub
   (see docs/lesson-generator-plan.md §5 for example)

3. Verify:
   - python -m common.schema → models compile
   - python -m common.vocab_query --lemma hello → trả entry từ DB
   - make help show 5+ target

Branch: feat/lesson-gen-G1-setup
Effort: 1 ngày.
DoD: project skeleton ready, không có generator logic — chỉ infrastructure.
```

Sau G1 merge → paste tiếp G2 (skeleton generator).
