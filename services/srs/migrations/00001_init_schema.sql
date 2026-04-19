CREATE TABLE srs_states (
    user_id         UUID        NOT NULL,
    item_kind       TEXT        NOT NULL,
    item_id         TEXT        NOT NULL,
    stability       DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    difficulty      DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    reps            INT         NOT NULL DEFAULT 0,
    lapses          INT         NOT NULL DEFAULT 0,
    state           TEXT        NOT NULL DEFAULT 'new',
    last_review_at  TIMESTAMPTZ,
    due_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, item_kind, item_id)
);

CREATE INDEX ix_srs_due       ON srs_states (user_id, due_at);
CREATE INDEX ix_srs_user_kind ON srs_states (user_id, item_kind, due_at);

CREATE TABLE srs_reviews (
    id              BIGSERIAL   PRIMARY KEY,
    user_id         UUID        NOT NULL,
    item_kind       TEXT        NOT NULL,
    item_id         TEXT        NOT NULL,
    rating          SMALLINT    NOT NULL,
    state_before    TEXT        NOT NULL,
    elapsed_days    DOUBLE PRECISION,
    scheduled_days  DOUBLE PRECISION,
    reviewed_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_srs_reviews_user ON srs_reviews (user_id, reviewed_at DESC);
CREATE INDEX ix_srs_reviews_item ON srs_reviews (user_id, item_kind, item_id);
