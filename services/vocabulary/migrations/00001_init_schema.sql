-- +goose Up
-- +goose StatementBegin

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ─── System vocabulary catalog ────────────────────────────────────────────────

CREATE TABLE words (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    language        TEXT NOT NULL,
    lemma           TEXT NOT NULL,
    pos             TEXT NOT NULL DEFAULT '',  -- noun, verb, adjective, adverb, particle, ...
    ipa             TEXT NOT NULL DEFAULT '',
    frequency_rank  INT  NOT NULL DEFAULT 999999,
    level           TEXT NOT NULL DEFAULT '',  -- A1, A2, B1, N5, N4, HSK1 ...
    extra           JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (language, lemma, pos)
);

-- Trigram index for fuzzy search on lemma
CREATE INDEX ix_words_lemma_trgm  ON words USING gin (lemma gin_trgm_ops);
-- Composite index for catalog pagination by language
CREATE INDEX ix_words_lang_freq   ON words (language, frequency_rank);
CREATE INDEX ix_words_lang_level  ON words (language, level);

-- ─── Meanings (translations) ──────────────────────────────────────────────────

CREATE TABLE word_meanings (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word_id     UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    ui_language TEXT NOT NULL,   -- 'en', 'vi', 'ja', 'zh', 'ko'
    meaning     TEXT NOT NULL,
    order_idx   INT  NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_word_meanings_word ON word_meanings (word_id, ui_language, order_idx);

-- ─── Example sentences ───────────────────────────────────────────────────────

CREATE TABLE word_examples (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word_id     UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    sentence    TEXT NOT NULL,
    translation JSONB NOT NULL DEFAULT '{}',  -- {"vi": "...", "en": "..."}
    audio_url   TEXT NOT NULL DEFAULT '',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_word_examples_word ON word_examples (word_id);

-- ─── Decks ────────────────────────────────────────────────────────────────────

CREATE TABLE decks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id    UUID NOT NULL,   -- user UUID; 'system' decks use a known sentinel UUID
    language    TEXT NOT NULL,
    name        TEXT NOT NULL,
    is_public   BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_decks_owner    ON decks (owner_id);
CREATE INDEX ix_decks_language ON decks (language, is_public);

-- ─── User cards ───────────────────────────────────────────────────────────────

CREATE TABLE user_cards (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL,
    deck_id     UUID NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
    word_id     UUID NOT NULL REFERENCES words(id),
    suspended   BOOLEAN NOT NULL DEFAULT false,  -- true = marked known, paused from SRS
    added_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, deck_id, word_id)
);

CREATE INDEX ix_user_cards_user_deck ON user_cards (user_id, deck_id);
CREATE INDEX ix_user_cards_user      ON user_cards (user_id, added_at DESC);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS user_cards;
DROP TABLE IF EXISTS decks;
DROP TABLE IF EXISTS word_examples;
DROP TABLE IF EXISTS word_meanings;
DROP TABLE IF EXISTS words;
-- +goose StatementEnd
