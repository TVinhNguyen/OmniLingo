-- Seed 600 essential English words (source: wordfreq, Apache-2.0)
-- Safe re-run: UPSERT by (language, lemma, pos)

BEGIN;

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'the', '', '', 1, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'to', '', '', 2, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'and', '', '', 3, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'of', '', '', 4, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'a', '', '', 5, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'in', '', '', 6, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'i', '', '', 7, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'is', '', '', 8, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'for', '', '', 9, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'that', '', '', 10, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'you', '', '', 11, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'it', '', '', 12, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'on', '', '', 13, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'with', '', '', 14, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'this', '', '', 15, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'was', '', '', 16, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'be', '', '', 17, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'as', '', '', 18, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'are', '', '', 19, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'have', '', '', 20, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'at', '', '', 21, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'he', '', '', 22, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'not', '', '', 23, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'by', '', '', 24, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'but', '', '', 25, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'from', '', '', 26, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'my', '', '', 27, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'or', '', '', 28, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'we', '', '', 29, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'an', '', '', 30, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'your', '', '', 31, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'all', '', '', 32, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'so', '', '', 33, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'his', '', '', 34, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'they', '', '', 35, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'me', '', '', 36, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'if', '', '', 37, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'one', '', '', 38, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'can', '', '', 39, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'will', '', '', 40, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'just', '', '', 41, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'like', '', '', 42, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'about', '', '', 43, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'up', '', '', 44, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'out', '', '', 45, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'what', '', '', 46, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'has', '', '', 47, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'when', '', '', 48, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'more', '', '', 49, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'do', '', '', 50, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'no', '', '', 51, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'were', '', '', 52, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'who', '', '', 53, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'had', '', '', 54, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'it''s', '', '', 55, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'their', '', '', 56, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'there', '', '', 57, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'her', '', '', 58, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'which', '', '', 59, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'time', '', '', 60, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'get', '', '', 61, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'been', '', '', 62, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'would', '', '', 63, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'she', '', '', 64, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'new', '', '', 65, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'people', '', '', 66, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'how', '', '', 67, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'don''t', '', '', 68, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'some', '', '', 69, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'also', '', '', 70, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'them', '', '', 71, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'now', '', '', 72, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'other', '', '', 73, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'i''m', '', '', 74, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'its', '', '', 75, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'our', '', '', 76, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'than', '', '', 77, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'good', '', '', 78, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'only', '', '', 79, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'after', '', '', 80, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'first', '', '', 81, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'him', '', '', 82, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'into', '', '', 83, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'know', '', '', 84, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'see', '', '', 85, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'two', '', '', 86, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'make', '', '', 87, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'over', '', '', 88, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'think', '', '', 89, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'any', '', '', 90, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'then', '', '', 91, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'could', '', '', 92, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'back', '', '', 93, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'these', '', '', 94, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'us', '', '', 95, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'want', '', '', 96, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'because', '', '', 97, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'go', '', '', 98, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'well', '', '', 99, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'said', '', '', 100, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'way', '', '', 101, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'most', '', '', 104, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'much', '', '', 105, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'very', '', '', 106, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'where', '', '', 107, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'even', '', '', 108, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'should', '', '', 109, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'may', '', '', 110, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'here', '', '', 111, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'need', '', '', 112, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'really', '', '', 113, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'did', '', '', 114, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'right', '', '', 115, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'work', '', '', 116, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'year', '', '', 117, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'years', '', '', 118, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'being', '', '', 119, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'day', '', '', 120, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'too', '', '', 121, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'going', '', '', 122, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'before', '', '', 123, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'off', '', '', 124, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'why', '', '', 125, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'made', '', '', 126, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'still', '', '', 127, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'take', '', '', 128, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'got', '', '', 130, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'many', '', '', 131, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'never', '', '', 132, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'those', '', '', 133, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'life', '', '', 134, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'say', '', '', 135, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'world', '', '', 136, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'down', '', '', 137, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'great', '', '', 138, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'through', '', '', 139, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'you''re', '', '', 140, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'last', '', '', 141, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 's', '', '', 142, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'that''s', '', '', 143, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'while', '', '', 144, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'best', '', '', 145, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'such', '', '', 146, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'love', '', '', 147, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'man', '', '', 148, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'home', '', '', 149, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'long', '', '', 150, 'A1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'look', '', '', 151, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'something', '', '', 152, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'use', '', '', 153, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'can''t', '', '', 154, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'same', '', '', 155, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'used', '', '', 156, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'both', '', '', 157, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'every', '', '', 158, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'am', '', '', 160, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'come', '', '', 161, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'part', '', '', 162, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'state', '', '', 163, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'three', '', '', 164, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'around', '', '', 165, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'between', '', '', 166, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'always', '', '', 167, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'better', '', '', 168, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'find', '', '', 169, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'help', '', '', 171, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'high', '', '', 172, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'little', '', '', 173, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'old', '', '', 174, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'since', '', '', 175, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'another', '', '', 176, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'does', '', '', 177, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'own', '', '', 178, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'things', '', '', 179, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'under', '', '', 180, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'during', '', '', 181, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'game', '', '', 182, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'i''ve', '', '', 183, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'thing', '', '', 184, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'give', '', '', 185, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'house', '', '', 186, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'place', '', '', 187, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'school', '', '', 188, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'again', '', '', 189, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'next', '', '', 190, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'each', '', '', 191, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'mr', '', '', 192, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'without', '', '', 193, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'against', '', '', 194, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'didn''t', '', '', 195, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'end', '', '', 196, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'found', '', '', 197, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'must', '', '', 198, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'show', '', '', 199, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'big', '', '', 200, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'feel', '', '', 201, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'sure', '', '', 202, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'team', '', '', 203, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'ever', '', '', 204, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'family', '', '', 205, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'keep', '', '', 206, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'might', '', '', 207, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'please', '', '', 208, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'put', '', '', 209, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'money', '', '', 210, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'free', '', '', 211, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'second', '', '', 212, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'someone', '', '', 213, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'away', '', '', 214, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'left', '', '', 215, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'number', '', '', 216, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'city', '', '', 217, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'days', '', '', 218, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'lot', '', '', 219, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'name', '', '', 220, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'night', '', '', 221, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'play', '', '', 222, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'until', '', '', 223, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'company', '', '', 224, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'doing', '', '', 225, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'few', '', '', 226, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'he''s', '', '', 227, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'let', '', '', 228, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'real', '', '', 229, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'called', '', '', 231, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'different', '', '', 232, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'having', '', '', 233, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'set', '', '', 234, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'thought', '', '', 235, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'done', '', '', 236, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'however', '', '', 237, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'getting', '', '', 238, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'god', '', '', 239, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'government', '', '', 240, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'group', '', '', 241, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'looking', '', '', 242, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'public', '', '', 243, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'top', '', '', 244, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'women', '', '', 245, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'business', '', '', 246, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'care', '', '', 247, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'start', '', '', 248, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'system', '', '', 249, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'times', '', '', 250, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'week', '', '', 251, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'already', '', '', 253, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'anything', '', '', 254, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'case', '', '', 255, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'nothing', '', '', 256, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'person', '', '', 257, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'today', '', '', 258, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'change', '', '', 259, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'enough', '', '', 260, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'everything', '', '', 261, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'full', '', '', 262, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'live', '', '', 263, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'making', '', '', 264, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'point', '', '', 265, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'read', '', '', 266, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'there''s', '', '', 267, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'told', '', '', 268, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'yet', '', '', 269, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'bad', '', '', 270, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'doesn''t', '', '', 271, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'four', '', '', 272, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'hard', '', '', 273, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'mean', '', '', 274, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'once', '', '', 275, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'support', '', '', 276, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'tell', '', '', 277, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'including', '', '', 278, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'music', '', '', 279, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'power', '', '', 280, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'seen', '', '', 281, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'states', '', '', 282, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'stop', '', '', 283, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'water', '', '', 284, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'based', '', '', 285, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'believe', '', '', 286, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'call', '', '', 287, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'head', '', '', 288, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'men', '', '', 289, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'national', '', '', 290, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'small', '', '', 291, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'took', '', '', 292, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'white', '', '', 293, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'came', '', '', 294, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'far', '', '', 295, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'job', '', '', 296, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'side', '', '', 297, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'though', '', '', 298, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'try', '', '', 299, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'went', '', '', 300, 'A2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'yes', '', '', 301, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'actually', '', '', 302, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'american', '', '', 303, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'later', '', '', 304, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'less', '', '', 305, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'line', '', '', 306, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'order', '', '', 307, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'party', '', '', 308, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'run', '', '', 309, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'says', '', '', 310, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'service', '', '', 311, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'country', '', '', 313, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'open', '', '', 314, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'season', '', '', 315, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'shit', '', '', 316, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'thank', '', '', 317, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'children', '', '', 318, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'everyone', '', '', 319, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'general', '', '', 320, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'they''re', '', '', 321, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'trying', '', '', 322, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'united', '', '', 323, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'using', '', '', 324, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'area', '', '', 325, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'black', '', '', 326, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'd', '', '', 327, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'following', '', '', 328, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'law', '', '', 329, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'makes', '', '', 330, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'together', '', '', 331, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'war', '', '', 332, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'whole', '', '', 333, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'car', '', '', 334, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'face', '', '', 335, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'five', '', '', 336, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'kind', '', '', 337, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'maybe', '', '', 338, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'per', '', '', 339, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'president', '', '', 340, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'story', '', '', 341, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'working', '', '', 342, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'course', '', '', 343, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'games', '', '', 344, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'health', '', '', 345, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'hope', '', '', 346, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'important', '', '', 347, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'least', '', '', 348, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'means', '', '', 349, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'news', '', '', 350, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'within', '', '', 351, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'able', '', '', 352, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'book', '', '', 353, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'early', '', '', 354, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'friends', '', '', 355, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'i''ll', '', '', 356, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'information', '', '', 357, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'local', '', '', 358, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'oh', '', '', 359, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'post', '', '', 360, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 't', '', '', 361, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'thanks', '', '', 362, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'video', '', '', 363, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'young', '', '', 364, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'ago', '', '', 365, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'others', '', '', 366, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'social', '', '', 367, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'talk', '', '', 368, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'court', '', '', 370, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'fact', '', '', 371, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'given', '', '', 372, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'guys', '', '', 373, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'half', '', '', 374, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'hand', '', '', 375, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'isn''t', '', '', 376, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'level', '', '', 377, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'mind', '', '', 378, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'often', '', '', 379, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'single', '', '', 380, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'become', '', '', 381, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'body', '', '', 382, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'coming', '', '', 383, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'control', '', '', 384, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'death', '', '', 385, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'food', '', '', 386, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'guy', '', '', 387, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'hours', '', '', 388, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'office', '', '', 389, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'pay', '', '', 390, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'problem', '', '', 391, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'south', '', '', 392, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'true', '', '', 393, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'we''re', '', '', 394, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'almost', '', '', 395, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'fuck', '', '', 396, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'history', '', '', 397, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'known', '', '', 398, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'large', '', '', 399, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'lost', '', '', 400, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'm', '', '', 401, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'research', '', '', 402, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'room', '', '', 403, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'several', '', '', 404, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'started', '', '', 405, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'taking', '', '', 406, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'university', '', '', 407, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'win', '', '', 408, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'wrong', '', '', 409, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'along', '', '', 410, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'anyone', '', '', 411, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'else', '', '', 412, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'girl', '', '', 413, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'john', '', '', 414, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'matter', '', '', 415, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'pretty', '', '', 416, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'remember', '', '', 417, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'air', '', '', 418, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'bit', '', '', 419, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'friend', '', '', 420, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'hit', '', '', 421, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'needs', '', '', 422, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'nice', '', '', 423, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'playing', '', '', 424, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'probably', '', '', 425, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'saying', '', '', 426, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'understand', '', '', 427, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'yeah', '', '', 428, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'york', '', '', 429, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'class', '', '', 430, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'close', '', '', 431, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'comes', '', '', 432, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'i''d', '', '', 433, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'idea', '', '', 434, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'international', '', '', 435, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'looks', '', '', 436, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'past', '', '', 437, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'possible', '', '', 438, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'wanted', '', '', 439, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'b', '', '', 440, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'cause', '', '', 441, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'due', '', '', 442, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'happy', '', '', 443, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'human', '', '', 444, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'members', '', '', 445, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'months', '', '', 446, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'move', '', '', 447, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'question', '', '', 448, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'r', '', '', 449, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'series', '', '', 450, 'B1', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'wait', '', '', 451, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'woman', '', '', 452, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'ask', '', '', 453, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'community', '', '', 454, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'data', '', '', 455, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'late', '', '', 456, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'leave', '', '', 457, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'north', '', '', 458, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'saw', '', '', 459, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'special', '', '', 460, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'watch', '', '', 461, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'won''t', '', '', 462, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'c', '', '', 463, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'either', '', '', 464, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'fucking', '', '', 465, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'future', '', '', 466, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'light', '', '', 467, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'low', '', '', 468, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'million', '', '', 469, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'morning', '', '', 470, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'police', '', '', 471, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'short', '', '', 472, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'stay', '', '', 473, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'taken', '', '', 474, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'age', '', '', 475, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'buy', '', '', 476, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'deal', '', '', 477, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'rather', '', '', 478, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'reason', '', '', 479, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'red', '', '', 480, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'report', '', '', 481, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'soon', '', '', 482, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'third', '', '', 483, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'turn', '', '', 484, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'whether', '', '', 485, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'among', '', '', 486, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'check', '', '', 487, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'development', '', '', 488, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'form', '', '', 489, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'further', '', '', 490, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'heart', '', '', 491, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'minutes', '', '', 492, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'myself', '', '', 493, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'services', '', '', 494, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'u.s', '', '', 495, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'yourself', '', '', 496, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'act', '', '', 497, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'although', '', '', 498, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'asked', '', '', 499, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'child', '', '', 500, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'fire', '', '', 501, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'fun', '', '', 502, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'living', '', '', 503, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'major', '', '', 504, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'media', '', '', 505, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'phone', '', '', 506, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'players', '', '', 507, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'art', '', '', 508, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'behind', '', '', 509, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'building', '', '', 510, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'easy', '', '', 511, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'gonna', '', '', 512, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'market', '', '', 513, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'near', '', '', 514, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'non', '', '', 515, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'plan', '', '', 516, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'political', '', '', 517, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'quite', '', '', 518, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'six', '', '', 519, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'talking', '', '', 520, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'west', '', '', 521, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'works', '', '', 522, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'according', '', '', 523, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'available', '', '', 524, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'e', '', '', 525, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'education', '', '', 526, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'final', '', '', 527, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'former', '', '', 528, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'front', '', '', 529, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'kids', '', '', 530, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'list', '', '', 531, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'ready', '', '', 532, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'sometimes', '', '', 533, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'son', '', '', 534, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'street', '', '', 535, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'wasn''t', '', '', 536, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'bring', '', '', 537, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'college', '', '', 538, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'current', '', '', 539, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'example', '', '', 540, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'experience', '', '', 541, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'heard', '', '', 542, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'london', '', '', 543, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'meet', '', '', 544, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'program', '', '', 545, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'type', '', '', 546, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'baby', '', '', 547, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'chance', '', '', 548, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'father', '', '', 549, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'march', '', '', 550, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'process', '', '', 551, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'she''s', '', '', 552, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'song', '', '', 553, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'study', '', '', 554, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'word', '', '', 555, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'across', '', '', 556, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'action', '', '', 557, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'clear', '', '', 558, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'gave', '', '', 559, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'gets', '', '', 560, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'himself', '', '', 561, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'month', '', '', 562, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'outside', '', '', 563, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'self', '', '', 564, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'students', '', '', 565, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'words', '', '', 566, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'board', '', '', 567, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'cost', '', '', 568, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'cut', '', '', 569, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'dr', '', '', 570, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'field', '', '', 571, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'held', '', '', 572, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'instead', '', '', 573, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'main', '', '', 574, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'moment', '', '', 575, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'mother', '', '', 576, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'road', '', '', 577, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'seems', '', '', 578, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'thinking', '', '', 579, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'town', '', '', 580, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'wants', '', '', 581, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'de', '', '', 582, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'department', '', '', 583, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'energy', '', '', 584, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'fight', '', '', 585, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'fine', '', '', 586, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'force', '', '', 587, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'hear', '', '', 588, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'issue', '', '', 589, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'played', '', '', 590, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'points', '', '', 591, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'price', '', '', 592, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 're', '', '', 593, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'rest', '', '', 594, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'results', '', '', 595, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'running', '', '', 596, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'shows', '', '', 597, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'space', '', '', 598, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'summer', '', '', 599, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'term', '', '', 600, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'wife', '', '', 601, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'america', '', '', 603, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'beautiful', '', '', 604, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'date', '', '', 605, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'goes', '', '', 606, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'killed', '', '', 607, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'land', '', '', 608, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'miss', '', '', 609, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'project', '', '', 610, 'B2', '{"source": "wordfreq", "source_url": "https://github.com/rspeer/wordfreq", "source_license": "Apache-2.0", "dataset": "top_n_list(en, 600)"}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

COMMIT;
