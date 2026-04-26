# Dictionary Import Plan — JP / CN / EN (revised 2026-04-25)

> **Scope**: Import 3 nguồn open-source (JMdict tiếng Nhật, CC-CEDICT tiếng Trung, **Open English WordNet** tiếng Anh) vào **`vocabulary-service` (table `words`)** để làm vocab seed + auto-fill IPA/meaning khi user add card.
>
> **Architectural decision (2026-04-25)**: KHÔNG tạo `dictionary-service` riêng cho MVP1. Vocabulary service đã có schema `words` + `word_meanings` + `word_examples` đủ cover catalog dictionary. Tránh duplicate table và microservice hell. Tách dictionary-service riêng → defer Phase 2 nếu cần license commercial hoặc vector search.
>
> **Change (2026-04-25)**: viWiktionary bị loại bỏ (dump 500MB, quality thấp). Thay bằng **Open English WordNet** (OEWN 2024) — ~82k synset EN, definition/examples chuẩn, license CC BY 4.0, download ~30MB qua `wn` Python library. vi meanings cho JP/CN sẽ do Phase E LLM cover.
>
> **Budget**: ~2 tuần dev + ~$2 LLM cost (Claude Haiku translate top 10k JP/CN sang VN).
> **Output**: ~400k entry (JP ~190k + CN ~120k + EN ~82k synsets), queryable qua BFF `lookupWord(lang, word, uiLang)` query.

---

## 1. Nguồn dữ liệu

| Source | License | Format | Size | Entries | Status |
|--------|---------|--------|------|---------|--------|
| **JMdict** | CC BY-SA 3.0 | XML | ~60 MB | ~200k | ✅ `.cache/jmdict_e.xml` downloaded |
| **CC-CEDICT** | CC BY-SA 4.0 | Plain text | ~9.5 MB | ~120k | ✅ `.cache/cedict.txt` downloaded |
| **Open English WordNet** | CC BY 4.0 | Python `wn` lib / SQLite | ~30 MB | ~82k synsets | ⬜ download via `wn.download('oewn:2024')` |
| ~~viWiktionary~~ | ~~CC BY-SA 4.0~~ | ~~XML dump~~ | ~~500 MB~~ | ~~150k~~ | ❌ **DROPPED** — dump quá lớn, quality thấp |

**License compliance**: JMdict CC BY-SA 3.0, CC-CEDICT CC BY-SA 4.0, OEWN CC BY 4.0 → app phải có attribution page `/about/credits` liệt kê 3 nguồn + link license.

---

## 2. Schema — reuse vocabulary `words` table (locked)

**Decision**: Vocabulary service đã có schema gần đủ. Chỉ cần migration nhỏ thêm 3 cột.

### 2.1. Schema sẵn có (`services/vocabulary/migrations/00001_init_schema.sql`)

```sql
words (
  id              UUID PRIMARY KEY,
  language        TEXT NOT NULL,                 -- 'ja' | 'zh' | 'vi' | 'en'
  lemma           TEXT NOT NULL,                 -- '食べる' / '学' / 'ăn'
  pos             TEXT NOT NULL DEFAULT '',      -- 'verb' | 'noun' | ...
  ipa             TEXT NOT NULL DEFAULT '',
  frequency_rank  INT  NOT NULL DEFAULT 999999,
  level           TEXT NOT NULL DEFAULT '',      -- 'jlpt_n5' | 'hsk1' | 'cefr_a1'
  extra           JSONB NOT NULL DEFAULT '{}',   -- variants: {"kanji":"食べる","kana":"たべる"}
  UNIQUE (language, lemma, pos)
)
ix_words_lemma_trgm  USING gin (lemma gin_trgm_ops)  -- fuzzy ✓
ix_words_lang_freq   ON (language, frequency_rank)   -- ranked vocab seed ✓
ix_words_lang_level  ON (language, level)

word_meanings (word_id, ui_language, meaning, order_idx)
  -- normalized table cho meanings đa ngôn ngữ ✓
  -- ui_language: 'en' | 'vi' | 'ja' | 'zh' | 'ko'

word_examples (word_id, sentence, translation JSONB, audio_url)
  -- translation: {"vi":"Tôi ăn sushi","en":"I eat sushi"} ✓
```

### 2.2. Migration mới — chỉ thêm 3 cột

```sql
-- services/vocabulary/migrations/00003_add_dictionary_fields.sql

-- +goose Up
-- +goose StatementBegin
ALTER TABLE words
  ADD COLUMN IF NOT EXISTS reading   TEXT NOT NULL DEFAULT '',  -- kana (たべる) / pinyin (xué)
  ADD COLUMN IF NOT EXISTS source    TEXT,                       -- 'jmdict'|'cc_cedict'|'viwiktionary'|null=manual
  ADD COLUMN IF NOT EXISTS source_id TEXT;                       -- entry id gốc cho re-import idempotent

-- Unique cho re-import idempotent (chỉ apply entry có source, không phải user-added manual)
CREATE UNIQUE INDEX IF NOT EXISTS ix_words_source_dedup
  ON words (source, source_id)
  WHERE source IS NOT NULL AND source_id IS NOT NULL;

COMMENT ON COLUMN words.reading   IS 'Pronunciation reading: kana for ja, pinyin for zh, null otherwise';
COMMENT ON COLUMN words.source    IS 'Origin source for imported entries; NULL for user-added';
COMMENT ON COLUMN words.source_id IS 'Original entry id in source for dedup on re-import';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS ix_words_source_dedup;
ALTER TABLE words
  DROP COLUMN IF EXISTS source_id,
  DROP COLUMN IF EXISTS source,
  DROP COLUMN IF EXISTS reading;
-- +goose StatementEnd
```

### 2.3. Mapping importer → schema sẵn có

| Source field | → words column |
|--------------|----------------|
| JMdict `keb` (kanji form) | `lemma` |
| JMdict `reb` (kana) | `reading` (mới) |
| JMdict `pos` | `pos` |
| JMdict `ke_pri` (frequency tag) | `frequency_rank` |
| JMdict JLPT level | `level` (e.g. `jlpt_n5`) |
| JMdict alt forms | `extra.kanji_alt`, `extra.kana_alt` |
| JMdict gloss[en] | `word_meanings (ui_language='en', meaning=...)` rows |
| JMdict examples | `word_examples` rows |
| CEDICT pinyin | `reading` |
| CEDICT trad | `extra.trad` |
| CEDICT simp | `lemma` |
| CEDICT meanings (split `/`) | `word_meanings (ui_language='en')` rows |
| viWiktionary ipa | `ipa` |
| viWiktionary VN definitions | `word_meanings (ui_language='vi', ...)` |

**Important**: meanings dùng **normalized table** (`word_meanings`) thay vì JSONB. Phù hợp hơn với schema hiện có và search per-language nhanh hơn.

---

## 3. 5 phase, 4 importer

```
Phase A — Setup       (1 ngày)  ✅ implemented
Phase B — Importer JP (3 ngày)  ✅ jmdict_e.xml downloaded; parser scaffold done; B4 JLPT wire pending
Phase C — Importer CN (2 ngày)  ✅ cedict.txt downloaded; parser scaffold done; C3 HSK wire pending
Phase D — Importer EN (2 ngày)  🔄 CHANGED: viWiktionary → Open English WordNet; import_wordnet.py TODO
Phase E — LLM enrich  (2 ngày)  scaffold implemented; API/data run pending (after B+C import done)
Phase F — BFF wire    (1 ngày)  ✅ implemented for lookup/search + add-card auto-fill
─────────────────────────
Tổng: ~2 tuần (1 dev fulltime; B/C/D parallel còn ~1 tuần actual import)
```

### Phase A — Setup (1 ngày) — `feat/dict-A-setup`

**Tasks**:
- [x] **A1** — Tạo migration `services/vocabulary/migrations/00003_add_dictionary_fields.sql` với schema §2
- [x] **A2** — Setup Python project `services/vocabulary/scripts/` cho importer (lxml + asyncpg + httpx + anthropic + mwparserfromhell)
- [x] **A3** — Tạo `scripts/Makefile` với target `import-jp`, `import-cn`, `import-vi`, `import-all`, `enrich-vn`
- [x] **A4** — Common module `scripts/common.py`: bulk_insert helper, normalize_pos, frequency_loader

**DoD**: chạy `make -C services/vocabulary/scripts import-all` không lỗi khi chưa có data (skip missing source cache).

---

### Phase B — JMdict importer (3 ngày) — `feat/dict-B-jmdict`

**Source**: http://ftp.edrdg.org/pub/Nihongo/JMdict_e.gz (~50MB)

**Đặc điểm**:
- XML lớn (200k `<entry>` element)
- Mỗi entry: `<k_ele>` (kanji forms) + `<r_ele>` (kana readings) + `<sense>` (meanings)
- Không có frequency built-in → cần combine với JLPT vocab list (open-source: `kanjivg` + `tanos jlpt list`)

**Mapping**:
```python
entry.k_ele[0].keb        → lemma         (e.g. "食べる")
entry.r_ele[0].reb        → reading       (e.g. "たべる")
entry.sense[*].pos        → pos           (verb/noun/...)
entry.sense[*].gloss[en]  → meanings.en   (["to eat", "to drink"])
entry.k_ele[0].ke_pri     → frequency tag (news1/news2/ichi1 → rank)
```

**Tasks**:
- [x] **B1** — Download script `scripts/download.sh jmdict` → cache `.cache/jmdict_e.xml`
- [x] **B2** — Parser `scripts/import_jmdict.py` dùng `lxml.etree.iterparse` (streaming, không load 50MB vào RAM)
- [x] **B3** — POS mapping table: JMdict tag (`v1`, `v5k`, `n`, ...) → standard ('verb', 'noun', ...)
- [ ] **B4** — Frequency: load `tanos JLPT N5-N1` lists từ GitHub mirror, gán `level` (loader hook exists; source list wiring pending)
- [x] **B5** — Bulk insert: batch 1000 entry / COPY FROM
- [ ] **B6** — Verify: `SELECT count(*) WHERE lang='ja'` ≈ 180-200k

**DoD**: `make import-jp` chạy 5 phút, sinh ~190k row JP, lookup `食べる` trả entry với reading + 4-5 meanings English.

---

### Phase C — CC-CEDICT importer (2 ngày) — `feat/dict-C-cedict`

**Source**: https://www.mdbg.net/chinese/dictionary?page=cedict (cedict_1_0_ts_utf-8_mdbg.zip ~12MB)

**Format text đơn giản**:
```
學 学 [xue2] /to learn/to study/learning/study/
```
- 4 phần phân cách: traditional, simplified, [pinyin], /meaning1/meaning2/

**Mapping**:
```python
trad        → variants.trad
simp        → lemma + variants.simp
pinyin      → reading
meanings_en → meanings.en  (split by '/')
freq        → load từ "HSK Most Common Words" list
level       → hsk1..hsk9 từ HSK official vocab list
```

**Tasks**:
- [x] **C1** — Download `download.sh cedict` → cache `.cache/cedict.txt`
- [x] **C2** — Parser `import_cedict.py` regex line-by-line (đơn giản, không cần lxml)
- [ ] **C3** — Pinyin → IPA conversion (optional, dùng `python-pinyin` hoặc skip MVP)
- [ ] **C4** — HSK level: load HSK 3.0 vocab list (CC BY: github.com/krmanik/HSK-3.0-words-list; loader hook exists, source list wiring pending)
- [x] **C5** — Bulk insert ~120k entry
- [ ] **C6** — Verify: lookup `学` trả simp + trad + pinyin + meanings + hsk_level

**DoD**: `make import-cn` chạy 2 phút, ~120k row CN, lookup `学` đầy đủ field.

---

### Phase D — Open English WordNet importer (2 ngày) — `feat/dict-D-wordnet`

> ⚠️ **CHANGED 2026-04-25**: viWiktionary bị loại. Thay bằng Open English WordNet (OEWN 2024).

**Source**: Open English WordNet 2024 — download tự động qua Python `wn` library
- License: CC BY 4.0 (no ShareAlike)
- ~82.000 synsets → ~155.000 sense entries (EN)
- Có sẵn: POS (n/v/adj/adv), definition, examples, lemma forms

**Tại sao OEWN thay viWiktionary**:
- viWiktionary: dump 500MB bz2, MediaWiki markup phức tạp, quality thấp, cần `mwparserfromhell`
- OEWN: 30MB, API Python clean, definition chuẩn học thuật, không cần XML parse

**Strategy**:
- `wn.download('oewn:2024')` → lưu SQLite local (~30MB)
- Iterate synsets → expand sang individual word senses
- 1 synset = nhiều lemmas; 1 entry `words` = 1 lemma trong synset đó
- Meanings = definition của synset + examples

**Mapping**:
```python
synset.lemmas()     → [lemma, ...] — tạo 1 words row mỗi lemma
synset.definition() → meanings.en (definition text)
synset.examples()   → examples.sentence
synset.pos()        → pos ('n'→'noun', 'v'→'verb', 'a'→'adjective', 'r'→'adverb')
lemma               → lemma (lowercase)
''                  → reading (EN không cần)
''                  → ipa (skip, EN phonetics defer)
```

**Tasks**:
- [ ] **D1** — Thêm `wn` vào `pyproject.toml` dependencies
- [ ] **D2** — Download target `download.sh wordnet` → chạy `wn.download('oewn:2024')` + copy DB vào `.cache/oewn.db`
- [ ] **D3** — Viết `import_wordnet.py` dùng `wn` API:
  - Iterate `wn.words()` (tất cả senses)
  - Deduplicate by `(lemma, synset_id)` — 1 word có thể trong nhiều synset
  - Gán frequency_rank từ `wordfreq` library (pip: `wordfreq`)
- [ ] **D4** — Frequency: dùng `wordfreq.word_frequency(lemma, 'en')` → convert sang rank (lower freq → higher rank)
- [ ] **D5** — Bulk insert ~155k rows EN (`lang='en'`)
- [ ] **D6** — Verify: lookup `eat` trả EN entry với POS=verb + definitions + examples

**DoD**: `make import-en` chạy < 5 phút, ~155k rows `lang='en'`, lookup `eat` trả verb entry với 3-5 definitions.

---

### Phase E — LLM enrich top words (2 ngày) — `feat/dict-E-llm-vn-translate`

**Vấn đề**: JMdict + CC-CEDICT chỉ có meanings English. User VN học JP/CN cần `meanings.vi`. viWiktionary không cover hết top words.

**Strategy**: cho **top 5000 từ phổ biến nhất mỗi ngôn ngữ JP/CN** (theo `frequency_rank`), gọi Claude API translate `meanings.en[]` → `meanings.vi[]`, batch update PG.

**Cost**: 5000 entry × 2 lang × ~80 token/request = 800k token Claude Haiku ≈ $1-2 cho cả batch. Cheap.

**Tasks**:
- [x] **E1** — Script `enrich_vn_translations.py`: query top 5000 entry mỗi lang chưa có `meanings.vi`
- [ ] **E2** — Batch Claude API call (10 entry / request, parallel 5 worker, rate limit safe; serial batch scaffold exists)
- [x] **E3** — Prompt template:
  ```
  Translate these English meanings of a Japanese/Chinese word to natural Vietnamese.
  Return JSON: {"vi": ["...", "..."]}
  Word: {lemma}
  English meanings: {meanings_en}
  ```
- [x] **E4** — Insert PG `word_meanings(ui_language='vi')` cho mỗi entry
- [x] **E5** — Caching idempotent: nếu re-run, skip entries đã có `meanings.vi`

**DoD**: top 5000 từ JP/CN đều có meanings.vi. Lookup `食べる` trả `meanings.vi: ["ăn", "ăn uống"]`.

---

### Phase F — BFF wire + auto-fill (1 ngày) — `feat/dict-F-bff-wire`

**Tasks**:
- [x] **F1** — `vocabulary-service` thêm 2 REST endpoint:
  - `GET /api/v1/vocab/lookup?lang=ja&word=...&uiLang=vi` → `{lemma, reading, ipa, pos, level, meanings:[...], examples:[...]}`
  - `GET /api/v1/vocab/search?lang=zh&q=...&limit=10` (trigram similarity ranking)
  - Logic: query `words` LEFT JOIN `word_meanings` (filter `ui_language IN (uiLang, 'en')`) LEFT JOIN `word_examples`
- [x] **F2** — BFF schema thêm Query `lookupWord(lang, word, uiLang): DictEntry` + `searchWords(lang, q, limit): [DictEntry!]!`
- [x] **F3** — `VocabularyDataSource` (đã có) thêm method `lookupWord()` + `searchWords()`
- [x] **F4** — BFF resolver `lookupWord` + `searchWords` wired
- [x] **F5** — `vocabulary-service` `addCard` tự enrich: nếu không có `word_id`, dùng deck language + `lemma` → repo lookup → auto-fill rồi insert card; nếu lookup miss thì tạo manual word từ input
- [x] **F6** — Redis cache 24h TTL per `lookup(lang,word,uiLang)`

**DoD**:
- GraphQL: `query { lookupWord(lang:"ja", word:"食べる", uiLang:"vi") { lemma reading meanings { uiLanguage meaning } examples { sentence } } }` trả full data
- FE add card flow: user gõ "学" lang=zh → form auto-fill pinyin + meaning VN + level HSK

---

## 4. Cấu trúc thư mục

```
services/vocabulary/
├── migrations/
│   ├── 00001_init_schema.sql           # đã có (words + decks + cards)
│   ├── 00002_add_outbox.sql            # đã có
│   └── 00003_add_dictionary_fields.sql # đã có — thêm reading + source + source_id
├── cmd/                                # đã có (Go service)
├── internal/                           # đã có (Go handler/service/repo)
└── scripts/                            # Python importer
    ├── pyproject.toml                  # ✅ lxml, asyncpg, httpx, anthropic, wn, wordfreq
    ├── Makefile                        # ✅ import-jp, import-cn, import-en, import-all, enrich-vn
    ├── common.py                       # ✅ bulk_insert via asyncpg COPY
    ├── download.sh                     # ✅ fetch jmdict/cedict + wordnet download
    ├── import_jmdict.py                # ✅ parser scaffold; B4 JLPT wiring pending
    ├── import_cedict.py                # ✅ parser scaffold; C3 HSK wiring pending
    ├── import_wordnet.py               # ⬜ TODO (Phase D)
    ├── enrich_vn_translations.py       # ✅ Claude API scaffold; E2 parallel batch pending
    └── .cache/                         # gitignored
        ├── jmdict_e.xml                # ✅ 60MB downloaded
        ├── cedict.txt                  # ✅ 9.5MB downloaded
        └── oewn.db                     # ⬜ WordNet SQLite (~30MB), created by download.sh wordnet
```

**Lý do**: importer scripts là **offline tools** (chạy 1 lần khi seed hoặc cron monthly), không phải runtime service. Đặt trong vocabulary repo để gần schema đích, dùng chung Postgres connection.

---

## 5. Re-import strategy

- **Source files cập nhật mỗi tháng** (JMdict + CEDICT + OEWN release mỗi năm)
- **Re-import** không break gì nhờ `UNIQUE (source, source_id)`:
  ```sql
  INSERT INTO words (...)
  ON CONFLICT (source, source_id) WHERE source IS NOT NULL AND source_id IS NOT NULL DO UPDATE SET
    lemma = EXCLUDED.lemma,
    reading = EXCLUDED.reading,
    extra = words.extra || EXCLUDED.extra,
    updated_at = NOW();
  ```
- **Cron job** Phase 2: chạy import hàng tháng auto (workflow_dispatch GitHub Action hoặc cron trên VPS)

---

## 6. Verification queries

Sau khi import xong, chạy queries này để verify:

```sql
-- Tổng entry per language
SELECT language, count(*) FROM words GROUP BY language;
-- Expected: ja ~190k, zh ~120k, en ~155k

-- Top 10 JP từ phổ biến có meanings.vi
SELECT w.lemma, w.reading, array_agg(m.meaning ORDER BY m.order_idx) AS vi_meanings
FROM words w
JOIN word_meanings m ON m.word_id = w.id AND m.ui_language = 'vi'
WHERE w.language='ja'
GROUP BY w.id, w.lemma, w.reading, w.frequency_rank
ORDER BY w.frequency_rank LIMIT 10;

-- Lookup smoke test JP
SELECT w.lemma, w.reading, m.ui_language, m.meaning, e.sentence
FROM words w
LEFT JOIN word_meanings m ON m.word_id = w.id
LEFT JOIN word_examples e ON e.word_id = w.id
WHERE w.language='ja' AND w.lemma='食べる';

-- Lookup smoke test CN
SELECT w.lemma, w.extra->>'trad' AS trad, w.reading, m.meaning
FROM words w
LEFT JOIN word_meanings m ON m.word_id = w.id AND m.ui_language='en'
WHERE w.language='zh' AND w.lemma='学';

-- Lookup smoke test EN (WordNet)
SELECT w.lemma, w.pos, m.meaning, e.sentence
FROM words w
LEFT JOIN word_meanings m ON m.word_id = w.id AND m.ui_language='en'
LEFT JOIN word_examples e ON e.word_id = w.id
WHERE w.language='en' AND w.lemma='eat'
ORDER BY w.frequency_rank LIMIT 5;

-- Fuzzy search
SELECT lemma, similarity(lemma, 'tabe') AS score
FROM words WHERE language='ja' AND lemma % 'tabe'
ORDER BY score DESC LIMIT 5;
```

---

## 7. Tiếp theo (Next steps)

### Immediate (Phase B + C — import thật)

```
1. Wire B4: download JLPT frequency list → .cache/jlpt.tsv
   Source: https://github.com/mjakubowski/jlpt-word-lists (TSV format)
   Format: lemma\tlevel  (e.g. 食べる\tjlpt_n5)

2. Wire C3: download HSK 3.0 vocab list → .cache/hsk.tsv
   Source: https://github.com/krmanik/HSK-3.0-words-list (CSV)
   Format: lemma\thsk_level  (e.g. 学\thsk1)

3. Chạy thật:
   cd services/vocabulary/scripts
   DATABASE_URL=postgres://... make import-jp   # ~190k rows, ~5 min
   DATABASE_URL=postgres://... make import-cn   # ~120k rows, ~2 min

4. Phase D: implement import_wordnet.py (xem §Phase D)
   DATABASE_URL=postgres://... make import-en   # ~155k rows, ~5 min

5. Phase E: enrich VN meanings (sau khi JP+CN đã import)
   ANTHROPIC_API_KEY=... DATABASE_URL=... make enrich-vn
```

### Verification sau import

```bash
# Quick smoke test (không cần DB local nếu có psql access)
psql $DATABASE_URL -c "SELECT language, count(*) FROM words GROUP BY language ORDER BY language;"
# Expected:
# en | ~155000
# ja | ~190000
# zh | ~120000
```

---

## 8. Tracking

| Phase | Task | Status |
|-------|------|--------|
| A | Migration 00003 | ✅ |
| A | pyproject.toml | ✅ |
| A | common.py | ✅ |
| A | Makefile | ✅ |
| A | download.sh (jp+cn) | ✅ |
| B | import_jmdict.py scaffold | ✅ |
| B | jmdict_e.xml downloaded | ✅ |
| B | B4: JLPT frequency file | ⬜ (frecuency_rank fallback: pri_tags used) |
| B | **B6: verify ~190k rows** | ✅ **213,933 rows ja** (2026-04-26) |
| C | import_cedict.py scaffold | ✅ |
| C | cedict.txt downloaded | ✅ |
| C | C3: HSK level file | ⬜ (level='' for now; HSK tsv optional) |
| C | **C6: verify ~120k rows** | ✅ **121,142 rows zh** (2026-04-26) |
| D | import_wordnet.py | ✅ |
| D | download wordnet (oewn:2024) | ✅ `.cache/wn_data/` |
| D | **D6: verify ~155k rows EN** | ✅ **160,327 rows en** (2026-04-26) |
| E | enrich_vn_translations.py scaffold | ✅ |
| E | E2: parallel batch (10 entry/req) | ⬜ |
| E | top 5000 JP/CN → meanings.vi | ⬜ |
| F | BFF lookupWord + searchWords | ✅ |
| F | addCard auto-fill | ✅ |
| F | Redis cache 24h | ✅ |
