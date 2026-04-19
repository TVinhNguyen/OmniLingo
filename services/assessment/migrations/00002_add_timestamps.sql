-- +goose Up
-- +goose StatementBegin

-- Add missing created_at/updated_at per coding-standards.md §3.3
-- submissions already has submitted_at; add standard timestamps as aliases/additions

ALTER TABLE submissions
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE test_sessions
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Auto-update updated_at trigger for submissions
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_submissions_updated_at
    BEFORE UPDATE ON submissions
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_test_sessions_updated_at
    BEFORE UPDATE ON test_sessions
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER IF EXISTS trg_test_sessions_updated_at ON test_sessions;
DROP TRIGGER IF EXISTS trg_submissions_updated_at ON submissions;
DROP FUNCTION IF EXISTS set_updated_at;
ALTER TABLE test_sessions DROP COLUMN IF EXISTS created_at, DROP COLUMN IF EXISTS updated_at;
ALTER TABLE submissions DROP COLUMN IF EXISTS created_at, DROP COLUMN IF EXISTS updated_at;
-- +goose StatementEnd
