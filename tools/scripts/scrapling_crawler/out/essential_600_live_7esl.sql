-- Fresh 600-word seed from live 7ESL crawl
BEGIN;

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'time', '', '', 1, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'day', '', '', 2, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'there', '', '', 3, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'someone', '', '', 4, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'combination', '', '', 5, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'other', '', '', 6, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'language', '', '', 7, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'take', '', '', 8, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'look', '', '', 9, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'eta', '', '', 10, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'christmas', '', '', 11, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'compound', '', '', 12, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'something', '', '', 13, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'new', '', '', 14, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'refers', '', '', 15, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'person', '', '', 16, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'both', '', '', 17, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'people', '', '', 18, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'during', '', '', 19, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'different', '', '', 20, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'contents', '', '', 21, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'sight', '', '', 22, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'utc', '', '', 23, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'might', '', '', 24, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'cooking', '', '', 25, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'daylight', '', '', 26, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'without', '', '', 27, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'standard', '', '', 28, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'pint', '', '', 29, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'term', '', '', 30, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'well', '', '', 31, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'antonyms', '', '', 32, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'year', '', '', 33, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'generation', '', '', 34, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'boomers', '', '', 35, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'escort', '', '', 36, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'gmt', '', '', 37, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'describe', '', '', 38, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'while', '', '', 39, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'see', '', '', 40, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'start', '', '', 41, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'another', '', '', 42, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'here', '', '', 43, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'days', '', '', 44, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'gen', '', '', 45, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'help', '', '', 46, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'way', '', '', 47, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'units', '', '', 48, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'now', '', '', 49, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'hobbies', '', '', 50, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'common', '', '', 51, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'part', '', '', 52, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'opposite', '', '', 53, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 're', '', '', 54, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'type', '', '', 55, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'months', '', '', 56, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'understand', '', '', 57, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'sentence', '', '', 58, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'world', '', '', 59, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'going', '', '', 60, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'let', '', '', 61, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'food', '', '', 62, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'halloween', '', '', 63, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'writing', '', '', 64, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'important', '', '', 65, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'related', '', '', 66, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'always', '', '', 67, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'get', '', '', 68, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'length', '', '', 69, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'hour', '', '', 70, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'back', '', '', 71, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'hours', '', '', 72, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'refer', '', '', 73, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'week', '', '', 74, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'may', '', '', 75, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'child', '', '', 76, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'work', '', '', 77, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'arrival', '', '', 78, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'saving', '', '', 79, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'est', '', '', 80, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'epitome', '', '', 81, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'pst', '', '', 82, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'around', '', '', 83, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'essential', '', '', 84, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'children', '', '', 85, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'crucial', '', '', 86, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'measurement', '', '', 87, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'quart', '', '', 88, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'imperial', '', '', 89, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'event', '', '', 90, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'go', '', '', 91, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'portmanteau', '', '', 92, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'services', '', '', 93, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'pdt', '', '', 94, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'communication', '', '', 95, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'commonly', '', '', 96, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'estimated', '', '', 97, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'need', '', '', 98, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'teaching', '', '', 99, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'width', '', '', 100, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'typically', '', '', 101, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'united', '', '', 102, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'form', '', '', 103, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'holiday', '', '', 104, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'thanksgiving', '', '', 105, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'same', '', '', 106, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'size', '', '', 107, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'name', '', '', 108, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'end', '', '', 109, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'side', '', '', 110, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'making', '', '', 111, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'transportation', '', '', 112, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'sometimes', '', '', 113, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'various', '', '', 114, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'contexts', '', '', 115, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'especially', '', '', 116, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'remember', '', '', 117, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'business', '', '', 118, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'fall', '', '', 119, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'things', '', '', 120, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'say', '', '', 121, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'edt', '', '', 122, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'years', '', '', 123, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'skills', '', '', 124, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'types', '', '', 125, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'quite', '', '', 126, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'usually', '', '', 127, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'legal', '', '', 128, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'would', '', '', 129, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'though', '', '', 130, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'specific', '', '', 131, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'states', '', '', 132, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'system', '', '', 133, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'th', '', '', 134, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'events', '', '', 135, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'create', '', '', 136, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'll', '', '', 137, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'thing', '', '', 138, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'crime', '', '', 139, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'written', '', '', 140, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'sound', '', '', 141, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'social', '', '', 142, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'recognize', '', '', 143, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'others', '', '', 144, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'technology', '', '', 145, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'want', '', '', 146, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'home', '', '', 147, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'because', '', '', 148, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'longer', '', '', 149, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'give', '', '', 150, 'A1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'item', '', '', 151, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'referring', '', '', 152, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'looking', '', '', 153, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'baking', '', '', 154, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'stands', '', '', 155, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'quick', '', '', 156, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'feedback', '', '', 157, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'similar', '', '', 158, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'associated', '', '', 159, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'describes', '', '', 160, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'talking', '', '', 161, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'winter', '', '', 162, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'certain', '', '', 163, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'verb', '', '', 164, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'concept', '', '', 165, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'zone', '', '', 166, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'seconds', '', '', 167, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'naturally', '', '', 168, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'speaking', '', '', 169, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'process', '', '', 170, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'basic', '', '', 171, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'should', '', '', 172, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'reading', '', '', 173, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'easy', '', '', 174, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'could', '', '', 175, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'confusion', '', '', 176, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'below', '', '', 177, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'large', '', '', 178, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'hand', '', '', 179, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'measuring', '', '', 180, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'milliliters', '', '', 181, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'known', '', '', 182, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'unit', '', '', 183, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'pm', '', '', 184, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'adding', '', '', 185, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'times', '', '', 186, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'still', '', '', 187, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'add', '', '', 188, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'celebrate', '', '', 189, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'quality', '', '', 190, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'find', '', '', 191, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'context', '', '', 192, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'across', '', '', 193, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'real', '', '', 194, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'set', '', '', 195, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'within', '', '', 196, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'know', '', '', 197, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'own', '', '', 198, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'able', '', '', 199, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'once', '', '', 200, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'long', '', '', 201, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'talk', '', '', 202, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'fluid', '', '', 203, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'gallon', '', '', 204, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'point', '', '', 205, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'keep', '', '', 206, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'short', '', '', 207, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'happy', '', '', 208, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'don', '', '', 209, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'high', '', '', 210, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'case', '', '', 211, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'less', '', '', 212, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'santa', '', '', 213, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'friends', '', '', 214, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'football', '', '', 215, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'law', '', '', 216, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'eastern', '', '', 217, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'protection', '', '', 218, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'born', '', '', 219, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'clear', '', '', 220, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'useful', '', '', 221, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'building', '', '', 222, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'improve', '', '', 223, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'online', '', '', 224, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'strong', '', '', 225, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'order', '', '', 226, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'shorter', '', '', 227, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'difficult', '', '', 228, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'never', '', '', 229, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'sentences', '', '', 230, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'critical', '', '', 231, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'object', '', '', 232, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'implies', '', '', 233, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'encounter', '', '', 234, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'accurate', '', '', 235, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'ounces', '', '', 236, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'uk', '', '', 237, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'beer', '', '', 238, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'volume', '', '', 239, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'schooner', '', '', 240, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'measure', '', '', 241, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'quarts', '', '', 242, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'convert', '', '', 243, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'due', '', '', 244, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'beginning', '', '', 245, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'departure', '', '', 246, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'representation', '', '', 247, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'come', '', '', 248, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'past', '', '', 249, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'posts', '', '', 250, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'extremely', '', '', 251, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'relationship', '', '', 252, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'names', '', '', 253, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'blanching', '', '', 254, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'highly', '', '', 255, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'ways', '', '', 256, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'families', '', '', 257, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'celebrated', '', '', 258, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'service', '', '', 259, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'ahead', '', '', 260, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'officer', '', '', 261, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'taking', '', '', 262, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'article', '', '', 263, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'november', '', '', 264, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'clocks', '', '', 265, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'security', '', '', 266, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'accompanying', '', '', 267, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'destination', '', '', 268, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'baby', '', '', 269, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'easier', '', '', 270, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'based', '', '', 271, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'everyday', '', '', 272, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'expressions', '', '', 273, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'usage', '', '', 274, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'situations', '', '', 275, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'level', '', '', 276, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'life', '', '', 277, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'native', '', '', 278, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'early', '', '', 279, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'simply', '', '', 280, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'put', '', '', 281, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'particular', '', '', 282, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'individual', '', '', 283, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'although', '', '', 284, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'considered', '', '', 285, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'becomes', '', '', 286, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'read', '', '', 287, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'school', '', '', 288, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'technique', '', '', 289, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'avoid', '', '', 290, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'group', '', '', 291, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'ensure', '', '', 292, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'simple', '', '', 293, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'fun', '', '', 294, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'regular', '', '', 295, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'state', '', '', 296, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'equal', '', '', 297, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'inches', '', '', 298, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'cut', '', '', 299, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'precise', '', '', 300, 'A2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'every', '', '', 301, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'pass', '', '', 302, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'fundamental', '', '', 303, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'dimensions', '', '', 304, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'liquids', '', '', 305, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'systems', '', '', 306, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'milk', '', '', 307, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'liters', '', '', 308, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'larger', '', '', 309, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'water', '', '', 310, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'number', '', '', 311, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'break', '', '', 312, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'december', '', '', 313, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'midnight', '', '', 314, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'flight', '', '', 315, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'scheduled', '', '', 316, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'close', '', '', 317, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'include', '', '', 318, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'letter', '', '', 319, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'complementary', '', '', 320, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'binary', '', '', 321, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'scale', '', '', 322, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'opposites', '', '', 323, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'away', '', '', 324, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'unlike', '', '', 325, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'little', '', '', 326, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'realizing', '', '', 327, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'ask', '', '', 328, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'cream', '', '', 329, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'fry', '', '', 330, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'ice', '', '', 331, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'soak', '', '', 332, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'ingredients', '', '', 333, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'acidic', '', '', 334, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'solution', '', '', 335, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'leave', '', '', 336, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'merry', '', '', 337, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'parade', '', '', 338, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'men', '', '', 339, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'comes', '', '', 340, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'together', '', '', 341, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'ever', '', '', 342, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'call', '', '', 343, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'witness', '', '', 344, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'court', '', '', 345, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'public', '', '', 346, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'evidence', '', '', 347, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'summer', '', '', 348, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'providing', '', '', 349, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'vehicle', '', '', 350, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'logistics', '', '', 351, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'internet', '', '', 352, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'games', '', '', 353, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'month', '', '', 354, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'earth', '', '', 355, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'modern', '', '', 356, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'rules', '', '', 357, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'explore', '', '', 358, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'support', '', '', 359, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'professional', '', '', 360, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'american', '', '', 361, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'british', '', '', 362, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'helps', '', '', 363, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'learners', '', '', 364, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'spoken', '', '', 365, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'phrases', '', '', 366, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'conversations', '', '', 367, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'however', '', '', 368, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'knowing', '', '', 369, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'success', '', '', 370, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'far', '', '', 371, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'learned', '', '', 372, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'against', '', '', 373, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'easily', '', '', 374, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'teach', '', '', 375, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'best', '', '', 376, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'offer', '', '', 377, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'meters', '', '', 378, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'along', '', '', 379, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'room', '', '', 380, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'project', '', '', 381, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'perfect', '', '', 382, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'space', '', '', 383, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'ideal', '', '', 384, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'safety', '', '', 385, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'measurements', '', '', 386, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'discuss', '', '', 387, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'customary', '', '', 388, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'liter', '', '', 389, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'worldwide', '', '', 390, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'range', '', '', 391, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'pints', '', '', 392, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'approximately', '', '', 393, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'engage', '', '', 394, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'following', '', '', 395, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'serving', '', '', 396, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'actual', '', '', 397, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'middle', '', '', 398, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'meet', '', '', 399, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'midday', '', '', 400, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'period', '', '', 401, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'planning', '', '', 402, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'daily', '', '', 403, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'transition', '', '', 404, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'antonym', '', '', 405, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'again', '', '', 406, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'area', '', '', 407, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'good', '', '', 408, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'hot', '', '', 409, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'else', '', '', 410, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'present', '', '', 411, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'probably', '', '', 412, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'provide', '', '', 413, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'pan', '', '', 414, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'cook', '', '', 415, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'remove', '', '', 416, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'action', '', '', 417, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'popular', '', '', 418, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'birth', '', '', 419, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'family', '', '', 420, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'festive', '', '', 421, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'man', '', '', 422, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'north', '', '', 423, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'presents', '', '', 424, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'season', '', '', 425, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'log', '', '', 426, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'called', '', '', 427, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'america', '', '', 428, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'starting', '', '', 429, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'open', '', '', 430, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'cross', '', '', 431, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'free', '', '', 432, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'variety', '', '', 433, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'suspect', '', '', 434, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'police', '', '', 435, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'enforcement', '', '', 436, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'lives', '', '', 437, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'current', '', '', 438, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'march', '', '', 439, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'reason', '', '', 440, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'behind', '', '', 441, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'change', '', '', 442, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'greek', '', '', 443, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'heard', '', '', 444, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'companionship', '', '', 445, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'accompany', '', '', 446, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'financial', '', '', 447, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'guiding', '', '', 448, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'rather', '', '', 449, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'black', '', '', 450, 'B1', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'meal', '', '', 451, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'timekeeping', '', '', 452, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'right', '', '', 453, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'faster', '', '', 454, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'subcategories', '', '', 455, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'practical', '', '', 456, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'topics', '', '', 457, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'focused', '', '', 458, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'develop', '', '', 459, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'exchange', '', '', 460, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'tips', '', '', 461, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'informal', '', '', 462, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'speaker', '', '', 463, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'age', '', '', 464, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'begin', '', '', 465, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'clearly', '', '', 466, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'uses', '', '', 467, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'involves', '', '', 468, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'correctly', '', '', 469, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'think', '', '', 470, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'write', '', '', 471, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'ideas', '', '', 472, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'complicated', '', '', 473, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'frequently', '', '', 474, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'great', '', '', 475, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'feel', '', '', 476, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'verbs', '', '', 477, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'sure', '', '', 478, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'longest', '', '', 479, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'dimension', '', '', 480, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'paper', '', '', 481, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'finish', '', '', 482, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'must', '', '', 483, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'vehicles', '', '', 484, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'distance', '', '', 485, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'base', '', '', 486, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'signifies', '', '', 487, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'general', '', '', 488, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'fields', '', '', 489, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'items', '', '', 490, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'wide', '', '', 491, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'product', '', '', 492, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'including', '', '', 493, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'international', '', '', 494, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'vary', '', '', 495, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'smaller', '', '', 496, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'kingdom', '', '', 497, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'cups', '', '', 498, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'four', '', '', 499, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'conversely', '', '', 500, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'depending', '', '', 501, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'receive', '', '', 502, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'meeting', '', '', 503, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'begins', '', '', 504, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'noon', '', '', 505, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'sun', '', '', 506, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'arrive', '', '', 507, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'happen', '', '', 508, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'schedules', '', '', 509, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'latin', '', '', 510, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'instead', '', '', 511, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'collocations', '', '', 512, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'chair', '', '', 513, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'few', '', '', 514, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'pair', '', '', 515, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'ends', '', '', 516, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'buying', '', '', 517, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'prefix', '', '', 518, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'indicates', '', '', 519, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'hard', '', '', 520, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'moisture', '', '', 521, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'represent', '', '', 522, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'ancient', '', '', 523, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'thus', '', '', 524, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'reasons', '', '', 525, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'fact', '', '', 526, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'generally', '', '', 527, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'bread', '', '', 528, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'favorite', '', '', 529, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'delicious', '', '', 530, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'metal', '', '', 531, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'dish', '', '', 532, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'christ', '', '', 533, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'bells', '', '', 534, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'boxing', '', '', 535, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'candy', '', '', 536, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'eve', '', '', 537, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'tree', '', '', 538, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'magic', '', '', 539, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'music', '', '', 540, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'package', '', '', 541, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'party', '', '', 542, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'snowman', '', '', 543, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'wish', '', '', 544, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'greeting', '', '', 545, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'cards', '', '', 546, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'excellent', '', '', 547, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'eat', '', '', 548, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'global', '', '', 549, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'closed', '', '', 550, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'adjective', '', '', 551, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'full', '', '', 552, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'car', '', '', 553, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'today', '', '', 554, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'minded', '', '', 555, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'apart', '', '', 556, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'drop', '', '', 557, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'five', '', '', 558, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'forms', '', '', 559, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'description', '', '', 560, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'defendant', '', '', 561, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'scene', '', '', 562, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'military', '', '', 563, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'worn', '', '', 564, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'conversation', '', '', 565, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'happened', '', '', 566, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'shortened', '', '', 567, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'abbreviation', '', '', 568, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'sunday', '', '', 569, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'enjoy', '', '', 570, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'typical', '', '', 571, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'forward', '', '', 572, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'interesting', '', '', 573, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'whether', '', '', 574, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'formal', '', '', 575, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'provides', '', '', 576, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'industry', '', '', 577, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'company', '', '', 578, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'traditional', '', '', 579, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'delivery', '', '', 580, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'travel', '', '', 581, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'countries', '', '', 582, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'banking', '', '', 583, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'play', '', '', 584, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'pacific', '', '', 585, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'hobby', '', '', 586, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'broadcast', '', '', 587, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'pilgrims', '', '', 588, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'rotation', '', '', 589, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'leap', '', '', 590, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'greenwich', '', '', 591, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'topic', '', '', 592, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'bar', '', '', 593, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'content', '', '', 594, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'master', '', '', 595, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'expand', '', '', 596, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'accurately', '', '', 597, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'spelling', '', '', 598, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'descriptive', '', '', 599, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
VALUES ('en', 'digital', '', '', 600, 'B2', '{"source": "7esl_live_crawl", "source_url": "https://7esl.com/vocabulary/", "source_license": "verify_terms_before_production", "dataset": "live crawl token frequency", "crawled_at": 1776530734}'::jsonb)
ON CONFLICT (language, lemma, pos) DO UPDATE
SET frequency_rank = EXCLUDED.frequency_rank,
    level = EXCLUDED.level,
    extra = EXCLUDED.extra,
    updated_at = now();

COMMIT;
