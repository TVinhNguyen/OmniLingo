-- +goose Up
-- +goose StatementBegin
ALTER TABLE words
  ADD COLUMN IF NOT EXISTS reading   TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS source    TEXT,
  ADD COLUMN IF NOT EXISTS source_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS ix_words_source_dedup
  ON words (source, source_id)
  WHERE source IS NOT NULL AND source_id IS NOT NULL;

COMMENT ON COLUMN words.reading   IS 'Pronunciation reading: kana for ja, pinyin for zh, empty otherwise';
COMMENT ON COLUMN words.source    IS 'Origin source for imported entries; NULL for user-added/manual entries';
COMMENT ON COLUMN words.source_id IS 'Original entry id in source for idempotent re-import';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS ix_words_source_dedup;

ALTER TABLE words
  DROP COLUMN IF EXISTS source_id,
  DROP COLUMN IF EXISTS source,
  DROP COLUMN IF EXISTS reading;
-- +goose StatementEnd
