-- Generated from Anki .apkg import
-- Target schema: words, word_meanings, word_examples
BEGIN;

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'afraid', '', '', 1, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228521]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'Sợ hãi', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'Sợ hãi'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'agree', '', '', 2, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228522]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'Đồng ý', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'Đồng ý'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'angry', '', '', 3, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228523]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'Tức giận', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'Tức giận'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'arrive', '', '', 4, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228524]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'Đến, tới nơi', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'Đến, tới nơi'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'attack', '', '', 5, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228525]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'Tấn công', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'Tấn công'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'bottom', '', '', 6, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228526]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'phần dưới cùng; đáy', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'phần dưới cùng; đáy'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'clever', '', '', 7, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228527]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'Thông minh', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'Thông minh'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'cruel', '', '', 8, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228528]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'Độc ác', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'Độc ác'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'finally', '', '', 9, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228529]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'Sau cùng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'Sau cùng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'hide', '', '', 10, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228530]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'Trốn, ẩn nấp', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'Trốn, ẩn nấp'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'hunt', '', '', 11, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228531]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'Săn bắn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'Săn bắn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'lot', '', '', 12, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228532]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'Mớ, lô, nhiều', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'Mớ, lô, nhiều'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'middle', '', '', 13, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228533]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'giữa, ở giữa', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'giữa, ở giữa'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'moment', '', '', 14, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228534]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'Khoảnh khắc, chốc lát', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'Khoảnh khắc, chốc lát'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'pleased', '', '', 15, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228535]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'Hài lòng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'Hài lòng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'promise', '', '', 16, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228536]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'Hứa hẹn, lời hứa', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'Hứa hẹn, lời hứa'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'reply', '', '', 17, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228537]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đáp lại, t rả lời', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đáp lại, t rả lời'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'safe', '', '', 18, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228538]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'An toàn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'An toàn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'trick', '', '', 19, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228539]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'Mẹo, thủ thuật', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'Mẹo, thủ thuật'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'well', '', '', 20, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228540]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'Tốt, được', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'Tốt, được'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'adventure', '', '', 21, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228541]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'phiêu lưu, mạo hiểm', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'phiêu lưu, mạo hiểm'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'approach', '', '', 22, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228542]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đến gần, tới gần', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đến gần, tới gần'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'carefully', '', '', 23, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228543]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cẩn thận', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cẩn thận'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'chemical', '', '', 24, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228544]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'hoá chất', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'hoá chất'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'create', '', '', 25, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228545]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tạo nên, tạo ra', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tạo nên, tạo ra'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'evil', '', '', 26, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228546]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'xấu, ác', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'xấu, ác'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'experiment', '', '', 27, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228547]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thí nghiệm', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thí nghiệm'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'kill', '', '', 28, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228548]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'giết, làm chết', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'giết, làm chết'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'laboratory', '', '', 29, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228549]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'phòng thí nghiệm', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'phòng thí nghiệm'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'laugh', '', '', 30, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228550]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tiếng cười (lớn)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tiếng cười (lớn)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'loud', '', '', 31, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228551]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'to, ầm ĩ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'to, ầm ĩ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'nervous', '', '', 32, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228552]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'căng thẳng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'căng thẳng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'noise', '', '', 33, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228553]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tiếng ồn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tiếng ồn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'project', '', '', 34, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228554]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'dự án, công trình', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'dự án, công trình'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'scare', '', '', 35, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228555]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'Dọa, làm sợ hãi', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'Dọa, làm sợ hãi'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'secret', '', '', 36, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228556]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bí mật', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bí mật'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'shout', '', '', 37, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228557]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'quát tháo, la hét', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'quát tháo, la hét'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'smell', '', '', 38, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228558]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'ngửi, đánh hơi', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'ngửi, đánh hơi'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'terrible', '', '', 39, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228559]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tồi tệ, ghê gớm, khủng khiếp', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tồi tệ, ghê gớm, khủng khiếp'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'worse', '', '', 40, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228560]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'xấu hơn, tồi hơn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'xấu hơn, tồi hơn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'alien', '', '', 41, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228561]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'Người ngoài hành tinh', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'Người ngoài hành tinh'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'among', '', '', 42, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228562]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'giữa, ở giữa', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'giữa, ở giữa'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'chart', '', '', 43, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228563]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'biểu đồ, đồ thị', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'biểu đồ, đồ thị'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'cloud', '', '', 44, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228564]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'mây, đám mây', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'mây, đám mây'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'comprehend', '', '', 45, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228565]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'hiểu, bao gồm', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'hiểu, bao gồm'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'describe', '', '', 46, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228566]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'miêu tả, mô tả', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'miêu tả, mô tả'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'ever', '', '', 47, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228567]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'Trước đến giờ, có bao giờ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'Trước đến giờ, có bao giờ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'fail', '', '', 48, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228568]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thất bại', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thất bại'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'friendly', '', '', 49, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228569]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thân thiện', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thân thiện'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'grade', '', '', 50, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228570]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'mức độ, cấp độ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'mức độ, cấp độ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'instead', '', '', 51, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228571]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'Thay cho, thay vì', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'Thay cho, thay vì'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'library', '', '', 52, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228572]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thư viện', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thư viện'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'planet', '', '', 53, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228573]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'hành tinh', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'hành tinh'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'report', '', '', 54, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228574]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bản báo cáo, biên bản', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bản báo cáo, biên bản'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'several', '', '', 55, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228575]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'vài, riêng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'vài, riêng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'solve', '', '', 56, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228576]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'giải quyết', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'giải quyết'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'suddenly', '', '', 57, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228577]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thình lình, đột ngột', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thình lình, đột ngột'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'suppose', '', '', 58, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228578]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cho rằng, nghĩ rằng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cho rằng, nghĩ rằng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'universe', '', '', 59, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228579]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'vũ trụ, thiên hà', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'vũ trụ, thiên hà'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'view', '', '', 60, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228580]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thấy, nhìn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thấy, nhìn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'appropriate', '', '', 61, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228581]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thích hợp, thích đáng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thích hợp, thích đáng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'avoid', '', '', 62, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228582]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tránh, tránh xa', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tránh, tránh xa'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'behave', '', '', 63, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228583]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đối xử, cư xử', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đối xử, cư xử'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'calm', '', '', 64, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228584]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bình tĩnh, êm đềm', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bình tĩnh, êm đềm'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'concern', '', '', 65, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228585]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'lo lắng, liên quan', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'lo lắng, liên quan'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'content', '', '', 66, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228586]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'nội dung (n), hài lòng (adj), mãn nguyện (adj)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'nội dung (n), hài lòng (adj), mãn nguyện (adj)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'expect', '', '', 67, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228587]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'trông mong, ngóng chờ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'trông mong, ngóng chờ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'frequently', '', '', 68, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228588]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thường xuyên', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thường xuyên'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'habit', '', '', 69, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228589]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thói quen, tập quán', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thói quen, tập quán'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'instruct', '', '', 70, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228590]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'hướng dẫn, đào tạo', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'hướng dẫn, đào tạo'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'issue', '', '', 71, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228591]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'vấn đề, phát hành', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'vấn đề, phát hành'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'none', '', '', 72, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228592]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'không ai, không chút nào', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'không ai, không chút nào'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'patient', '', '', 73, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228593]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'kiên nhẫn, nhẫn nại, bệnh nhân', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'kiên nhẫn, nhẫn nại, bệnh nhân'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'positive', '', '', 74, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228594]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tích cực, rõ ràng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tích cực, rõ ràng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'punish', '', '', 75, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228595]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'phạt, trừng phạt', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'phạt, trừng phạt'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'represent', '', '', 76, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228596]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thay mặt, đại diện', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thay mặt, đại diện'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'shake', '', '', 77, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228597]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'rung, lắc to shake hands: bắt tay', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'rung, lắc to shake hands: bắt tay'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'spread', '', '', 78, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228598]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'phết, trải ra', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'phết, trải ra'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'stroll', '', '', 79, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228599]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đi dạo', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đi dạo'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'village', '', '', 80, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228600]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'làng, xã', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'làng, xã'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'aware', '', '', 81, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228601]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'nhận thấy, nhận thức', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'nhận thấy, nhận thức'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'badly', '', '', 82, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228602]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'xấu, tồi, trầm trọng, khủng khiếp', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'xấu, tồi, trầm trọng, khủng khiếp'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'belong', '', '', 83, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228603]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thuộc về', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thuộc về'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'continue', '', '', 84, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228604]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tiếp tục, vẫn cứ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tiếp tục, vẫn cứ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'error', '', '', 85, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228605]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự sai sót, lỗi', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự sai sót, lỗi'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'experience', '', '', 86, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228606]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'kinh nghiệm', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'kinh nghiệm'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'field', '', '', 87, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228607]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cánh đồng, khu khai thác', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cánh đồng, khu khai thác'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'hurt', '', '', 88, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228608]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bị thương, bị đau', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bị thương, bị đau'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'judgment', '', '', 89, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228609]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự xét xử, quyết định của tòa án, ý kiến', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự xét xử, quyết định của tòa án, ý kiến'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'likely', '', '', 90, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228610]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'rất có thể, dường như, có lẽ đúng, thích hợp', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'rất có thể, dường như, có lẽ đúng, thích hợp'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'normal', '', '', 91, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228611]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bình thường, thông thường', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bình thường, thông thường'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'rare', '', '', 92, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228612]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'hiếm, ít có', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'hiếm, ít có'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'relax', '', '', 93, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228613]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thư giãn, nghỉ ngơi', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thư giãn, nghỉ ngơi'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'request', '', '', 94, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228614]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đề nghị, thỉnh cầu', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đề nghị, thỉnh cầu'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'reside', '', '', 95, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228615]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'ở tại, trú ngụ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'ở tại, trú ngụ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'result', '', '', 96, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228616]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'kết quả', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'kết quả'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'roll', '', '', 97, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228617]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'lăn, cuốn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'lăn, cuốn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'since', '', '', 98, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228618]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'từ khi, từ lúc', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'từ khi, từ lúc'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'visible', '', '', 99, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228619]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', '(có thể) thấy được', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = '(có thể) thấy được'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'wild', '', '', 100, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228620]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'hoang dã, chưa thuần', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'hoang dã, chưa thuần'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'advantage', '', '', 101, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228621]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'lợi thế, ưu điểm', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'lợi thế, ưu điểm'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'cause', '', '', 102, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228622]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'gây ra, gây nên', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'gây ra, gây nên'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'choice', '', '', 103, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228623]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự lựa chọn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự lựa chọn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'community', '', '', 104, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228624]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cộng đồng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cộng đồng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'dead', '', '', 105, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228625]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chết', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chết'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'distance', '', '', 106, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228626]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'khoảng cách, quãng đường', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'khoảng cách, quãng đường'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'escape', '', '', 107, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228627]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'trốn thoát, thoát ra', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'trốn thoát, thoát ra'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'face', '', '', 108, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228628]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đương đầu, đối mặt', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đương đầu, đối mặt'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'follow', '', '', 109, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228629]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đi theo, theo đuổi', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đi theo, theo đuổi'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'fright', '', '', 110, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228630]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự hoảng sợ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự hoảng sợ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'ghost', '', '', 111, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228631]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'con ma', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'con ma'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'individual', '', '', 112, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228632]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'riêng lẻ, riêng biệt', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'riêng lẻ, riêng biệt'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'pet', '', '', 113, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228633]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'vật nuôi, thú cưng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'vật nuôi, thú cưng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'reach', '', '', 114, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228634]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đạt tới, chạm tới, đến, tới', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đạt tới, chạm tới, đến, tới'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'return', '', '', 115, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228635]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'trở lại, trở về', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'trở lại, trở về'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'survive', '', '', 116, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228636]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sống sót, tồn tại', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sống sót, tồn tại'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'upset', '', '', 117, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228637]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thất vọng, buồn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thất vọng, buồn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'voice', '', '', 118, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228638]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'giọng nói', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'giọng nói'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'weather', '', '', 119, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228639]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thời tiết', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thời tiết'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'wise', '', '', 120, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228640]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'khôn ngoan, uyên bác', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'khôn ngoan, uyên bác'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'allow', '', '', 121, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228641]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cho phép', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cho phép'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'announce', '', '', 122, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228642]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'công bố, thông báo', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'công bố, thông báo'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'beside', '', '', 123, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228643]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bên cạnh', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bên cạnh'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'challenge', '', '', 124, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228644]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thử thách, thách thức', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thử thách, thách thức'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'claim', '', '', 125, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228645]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'xác nhận, đòi hỏi', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'xác nhận, đòi hỏi'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'condition', '', '', 126, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228646]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'điều kiện, hoàn cảnh', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'điều kiện, hoàn cảnh'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'contribute', '', '', 127, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228647]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đóng góp, góp phần', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đóng góp, góp phần'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'difference', '', '', 128, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228648]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự khác nhau, sự chênh lệch', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự khác nhau, sự chênh lệch'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'divide', '', '', 129, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228649]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chia, chia ra', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chia, chia ra'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'expert', '', '', 130, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228650]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chuyên gia', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chuyên gia'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'famous', '', '', 131, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228651]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'nổi tiếng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'nổi tiếng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'force', '', '', 132, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228652]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'lực, sức mạnh', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'lực, sức mạnh'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'harm', '', '', 133, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228653]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'hại, tổn hại', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'hại, tổn hại'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'lay', '', '', 134, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228654]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bày, nằm', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bày, nằm'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'peace', '', '', 135, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228655]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'hoà bình', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'hoà bình'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'prince', '', '', 136, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228656]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'hoàng tử', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'hoàng tử'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'protect', '', '', 137, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228657]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bảo vệ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bảo vệ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'sense', '', '', 138, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228658]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cảm nhận, cảm thấy', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cảm nhận, cảm thấy'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'sudden', '', '', 139, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228659]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thình lình, đột ngột', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thình lình, đột ngột'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'therefore', '', '', 140, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228660]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'vì thế', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'vì thế'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'accept', '', '', 141, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228661]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chấp nhận, chấp thuận', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chấp nhận, chấp thuận'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'arrange', '', '', 142, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228662]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sắp xếp, sắp đặt', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sắp xếp, sắp đặt'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'attend', '', '', 143, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228663]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tham dự, có mặt', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tham dự, có mặt'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'balance', '', '', 144, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228664]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cân bằng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cân bằng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'contrast', '', '', 145, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228665]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự tương phản, sự trái ngược', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự tương phản, sự trái ngược'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'encourage', '', '', 146, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228666]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'khuyến khích, động viên', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'khuyến khích, động viên'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'familiar', '', '', 147, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228667]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thân thuộc, quen thuộc', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thân thuộc, quen thuộc'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'grab', '', '', 148, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228668]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chộp, tóm, hái', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chộp, tóm, hái'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'hang', '', '', 149, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228669]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'treo, mắc', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'treo, mắc'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'huge', '', '', 150, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228670]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đồ sộ, khổng lồ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đồ sộ, khổng lồ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'necessary', '', '', 151, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228671]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cần thiết, thiết yếu', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cần thiết, thiết yếu'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'pattern', '', '', 152, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228672]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'mẫu, kiểu', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'mẫu, kiểu'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'propose', '', '', 153, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228673]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đề xuất, đưa ra', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đề xuất, đưa ra'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'purpose', '', '', 154, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228674]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'mục đích, ý định', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'mục đích, ý định'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'release', '', '', 155, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228675]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'giải thoát, phóng thích', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'giải thoát, phóng thích'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'require', '', '', 156, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228676]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đòi hỏi, yêu cầu', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đòi hỏi, yêu cầu'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'single', '', '', 157, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228677]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 's__ __g__ __', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 's__ __g__ __'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'success', '', '', 158, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228678]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự thành công, sự thắng lợi', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự thành công, sự thắng lợi'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'tear', '', '', 159, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228679]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'xé, làm rách, nước mắt', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'xé, làm rách, nước mắt'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'theory', '', '', 160, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228680]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'lý thuyết, học thuyết', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'lý thuyết, học thuyết'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'against', '', '', 161, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228681]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chống lại, dựa vào', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chống lại, dựa vào'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'beach', '', '', 162, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228682]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bãi biển', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bãi biển'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'damage', '', '', 163, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228683]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'phá hủy, làm hư hại', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'phá hủy, làm hư hại'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'discover', '', '', 164, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228684]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'khám phá, tìm ra', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'khám phá, tìm ra'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'emotion', '', '', 165, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228685]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cảm xúc', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cảm xúc'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'fix', '', '', 166, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228686]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đóng, gắn, sửa chữa', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đóng, gắn, sửa chữa'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'frank', '', '', 167, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228687]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thẳng thắn, bộc trực', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thẳng thắn, bộc trực'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'identify', '', '', 168, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228688]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'nhận biết,nhận ra', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'nhận biết,nhận ra'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'island', '', '', 169, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228689]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'hòn đảo', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'hòn đảo'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'ocean', '', '', 170, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228690]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đại dương', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đại dương'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'perhaps', '', '', 171, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228691]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'có lẽ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'có lẽ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'pleasant', '', '', 172, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228692]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'vui vẻ, dễ thương', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'vui vẻ, dễ thương'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'prevent', '', '', 173, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228693]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'ngăn chặn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'ngăn chặn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'rock', '', '', 174, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228694]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'hòn đá', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'hòn đá'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'save', '', '', 175, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228695]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cứu, giúp', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cứu, giúp'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'step', '', '', 176, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228696]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bước chân', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bước chân'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'still', '', '', 177, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228697]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'vẫn cứ, vẫn còn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'vẫn cứ, vẫn còn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'taste', '', '', 178, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228698]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'vị, nếm', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'vị, nếm'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'throw', '', '', 179, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228699]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'ném, vứt, quăng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'ném, vứt, quăng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'wave', '', '', 180, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228700]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sóng, làn sóng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sóng, làn sóng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'benefit', '', '', 181, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228701]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'lợi ích', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'lợi ích'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'certain', '', '', 182, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228702]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chắc chắn, tin cậy', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chắc chắn, tin cậy'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'chance', '', '', 183, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228703]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cơ hội, số phận', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cơ hội, số phận'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'effect', '', '', 184, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228704]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'hiệu quả, tác dụng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'hiệu quả, tác dụng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'essential', '', '', 185, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228705]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thiết yếu, chủ yếu', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thiết yếu, chủ yếu'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'far', '', '', 186, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228706]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'xa, xa xôi', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'xa, xa xôi'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'focus', '', '', 187, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228707]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tập trung', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tập trung'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'function', '', '', 188, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228708]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'hàm số; chức năng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'hàm số; chức năng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'grass', '', '', 189, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228709]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cỏ, bâi cỏ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cỏ, bâi cỏ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'guard', '', '', 190, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228710]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bảo vệ, canh gác', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bảo vệ, canh gác'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'image', '', '', 191, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228711]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'hình ảnh', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'hình ảnh'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'immediate', '', '', 192, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228712]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'lập tức, tức thì', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'lập tức, tức thì'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'primary', '', '', 193, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228713]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'gốc, căn bản', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'gốc, căn bản'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'proud', '', '', 194, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228714]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tự hào; hãnh diện', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tự hào; hãnh diện'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'remain', '', '', 195, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228715]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'vẫn, còn lại', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'vẫn, còn lại'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'rest', '', '', 196, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228716]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', '(n): sự nghỉ ngơi; (v): nghỉ ngơi', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = '(n): sự nghỉ ngơi; (v): nghỉ ngơi'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'separate', '', '', 197, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228717]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'riêng rẽ, riêng biệt', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'riêng rẽ, riêng biệt'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'site', '', '', 198, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228718]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'nơi, chỗ, vị trí', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'nơi, chỗ, vị trí'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'tail', '', '', 199, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228719]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đuôi, đoạn cuối', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đuôi, đoạn cuối'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'trouble', '', '', 200, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228720]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự trục trặc, sự rắc rối', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự trục trặc, sự rắc rối'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'anymore', '', '', 201, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228721]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'nữa', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'nữa'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'asleep', '', '', 202, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228722]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'ngủ, đang ngủ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'ngủ, đang ngủ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'berry', '', '', 203, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228723]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'quả dâu tây', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'quả dâu tây'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'collect', '', '', 204, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228724]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thu thập, sưu tầm', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thu thập, sưu tầm'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'compete', '', '', 205, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228725]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'ganh đua, cạnh tranh', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'ganh đua, cạnh tranh'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'conversation', '', '', 206, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228726]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cuộc chuyện trò, đàm luận, đàm thoại', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cuộc chuyện trò, đàm luận, đàm thoại'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'creature', '', '', 207, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228727]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sinh vật, loài vật', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sinh vật, loài vật'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'decision', '', '', 208, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228728]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự quyết định', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự quyết định'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'either', '', '', 209, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228729]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'một (trong hai)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'một (trong hai)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'forest', '', '', 210, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228730]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'rừng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'rừng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'ground', '', '', 211, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228731]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'mặt đất, đất', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'mặt đất, đất'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'introduce', '', '', 212, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228732]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'giới thiệu', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'giới thiệu'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'marry', '', '', 213, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228733]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cưới (vợ), lấy (chồng)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cưới (vợ), lấy (chồng)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'prepare', '', '', 214, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228734]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chuẩn bị, sửa soạn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chuẩn bị, sửa soạn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'sail', '', '', 215, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228735]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'điều khiển, lái (thuyền buồm)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'điều khiển, lái (thuyền buồm)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'serious', '', '', 216, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228736]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'nghiêm trọng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'nghiêm trọng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'spend', '', '', 217, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228737]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tiêu (tiền), dùng (thì giờ)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tiêu (tiền), dùng (thì giờ)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'strange', '', '', 218, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228738]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'xa lạ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'xa lạ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'truth', '', '', 219, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228739]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự thật, lẽ phải', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự thật, lẽ phải'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'wake', '', '', 220, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228740]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thức giấc, đánh thức', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thức giấc, đánh thức'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'alone', '', '', 221, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228741]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'một mình, trơ trọi', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'một mình, trơ trọi'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'apartment', '', '', 222, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228742]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'căn hộ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'căn hộ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'article', '', '', 223, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228743]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bài báo, điều khoản', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bài báo, điều khoản'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'artist', '', '', 224, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228744]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'nghệ sĩ, họa sĩ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'nghệ sĩ, họa sĩ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'attitude', '', '', 225, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228745]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thái độ, quan điểm', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thái độ, quan điểm'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'compare', '', '', 226, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228746]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'so sánh', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'so sánh'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'judge', '', '', 227, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228747]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'xét xử, phán đoán, đánh giá', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'xét xử, phán đoán, đánh giá'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'magazine', '', '', 228, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228748]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tạp chí', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tạp chí'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'material', '', '', 229, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228749]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'vật chất, vật liệu', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'vật chất, vật liệu'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'meal', '', '', 230, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228750]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bữa ăn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bữa ăn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'method', '', '', 231, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228751]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'phương pháp, cách thức', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'phương pháp, cách thức'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'neighbor', '', '', 232, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228752]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'người hàng xóm', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'người hàng xóm'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'professional', '', '', 233, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228753]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chuyên nghiệp', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chuyên nghiệp'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'profit', '', '', 234, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228754]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tiền lãi, lợi ích', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tiền lãi, lợi ích'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'quality', '', '', 235, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228755]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chất lượng, phẩm chất', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chất lượng, phẩm chất'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'shape', '', '', 236, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228756]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'hình dạng, hình thù', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'hình dạng, hình thù'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'space', '', '', 237, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228757]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'không gian', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'không gian'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'stair', '', '', 238, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228758]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bậc thang, cầu thang', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bậc thang, cầu thang'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'symbol', '', '', 239, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228759]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'ký hiệu, vật tượng trưng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'ký hiệu, vật tượng trưng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'thin', '', '', 240, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228760]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'gầy, mảnh khảnh', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'gầy, mảnh khảnh'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'blood', '', '', 241, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228761]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'máu, nhựa cậy', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'máu, nhựa cậy'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'burn', '', '', 242, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228762]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đốt cháy, nung', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đốt cháy, nung'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'cell', '', '', 243, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228763]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'phòng nhỏ, xà lim, ngăn nhỏ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'phòng nhỏ, xà lim, ngăn nhỏ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'contain', '', '', 244, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228764]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chứa đựng, gồm có', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chứa đựng, gồm có'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'correct', '', '', 245, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228765]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đúng, chính xác', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đúng, chính xác'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'crop', '', '', 246, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228766]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'vụ mùa, cây lương thực', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'vụ mùa, cây lương thực'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'demand', '', '', 247, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228767]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'yêu cầu, nhu cầu', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'yêu cầu, nhu cầu'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'equal', '', '', 248, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228768]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'ngang, bằng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'ngang, bằng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'feed', '', '', 249, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228769]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cho ăn, nuôi nấng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cho ăn, nuôi nấng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'hole', '', '', 250, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228770]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'hố, lỗ thủng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'hố, lỗ thủng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'increase', '', '', 251, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228771]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tăng lên, tăng thêm', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tăng lên, tăng thêm'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'lord', '', '', 252, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228772]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chúa tể', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chúa tể'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'owe', '', '', 253, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228773]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'nợ, hàm ơn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'nợ, hàm ơn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'position', '', '', 254, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228774]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'vị trí, chỗ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'vị trí, chỗ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'raise', '', '', 255, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228775]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'nâng lên, đỡ dậy', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'nâng lên, đỡ dậy'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'responsible', '', '', 256, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228776]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chịu trách nhiệm', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chịu trách nhiệm'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'sight', '', '', 257, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228777]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cảnh đẹp', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cảnh đẹp'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'spot', '', '', 258, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228778]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'nơi, chốn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'nơi, chốn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'structure', '', '', 259, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228779]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'kết cấu, cấu trúc', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'kết cấu, cấu trúc'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'whole', '', '', 260, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228780]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'toàn bộ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'toàn bộ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'coach', '', '', 261, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228781]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'huấn luyện viên', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'huấn luyện viên'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'control', '', '', 262, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228782]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'điều khiển', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'điều khiển'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'description', '', '', 263, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228783]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự diễn tả, sự mô tả', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự diễn tả, sự mô tả'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'direct', '', '', 264, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228784]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thẳng, trực tiếp', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thẳng, trực tiếp'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'exam', '', '', 265, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228785]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự thi cử; kỳ thi', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự thi cử; kỳ thi'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'example', '', '', 266, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228786]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thí dụ, ví dụ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thí dụ, ví dụ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'limit', '', '', 267, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228787]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'giới hạn, hạn chế', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'giới hạn, hạn chế'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'local', '', '', 268, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228788]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'địa phương', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'địa phương'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'magical', '', '', 269, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228789]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'ma thuật, kỳ diệu', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'ma thuật, kỳ diệu'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'mail', '', '', 270, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228790]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thư từ, bưu phẩm', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thư từ, bưu phẩm'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'novel', '', '', 271, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228791]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tiểu thuyết', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tiểu thuyết'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'outline', '', '', 272, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228792]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'phác thảo', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'phác thảo'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'poet', '', '', 273, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228793]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'nhà thơ, thi sĩ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'nhà thơ, thi sĩ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'print', '', '', 274, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228794]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'in, viết', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'in, viết'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'scene', '', '', 275, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228795]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'phân cảnh', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'phân cảnh'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'sheet', '', '', 276, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228796]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'lá, tấm, phiến, tờ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'lá, tấm, phiến, tờ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'silly', '', '', 277, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228797]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'ngớ ngẩn, khờ dại', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'ngớ ngẩn, khờ dại'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'store', '', '', 278, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228798]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cửa hàng, tiệm tạp hóa', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cửa hàng, tiệm tạp hóa'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'suffer', '', '', 279, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228799]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chịu đựng, lướt sóng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chịu đựng, lướt sóng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'technology', '', '', 280, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228800]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'công nghệ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'công nghệ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'across', '', '', 281, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228801]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'qua, ngang qua', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'qua, ngang qua'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'breathe', '', '', 282, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228802]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'hít, thở', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'hít, thở'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'characteristic', '', '', 283, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228803]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đặc tính, đặc điểm', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đặc tính, đặc điểm'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'consume', '', '', 284, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228804]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tiêu thụ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tiêu thụ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'excite', '', '', 285, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228805]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'phấn khích', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'phấn khích'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'extreme', '', '', 286, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228806]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'vô cùng, khắc nghiệt', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'vô cùng, khắc nghiệt'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'fear', '', '', 287, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228807]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự sợ hãi', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự sợ hãi'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'fortunate', '', '', 288, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228808]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'may mắn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'may mắn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'happen', '', '', 289, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228809]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tình cờ, xảy ra', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tình cờ, xảy ra'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'length', '', '', 290, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228810]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chiều dài, độ dài', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chiều dài, độ dài'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'mistake', '', '', 291, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228811]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'lỗi, sai lầm', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'lỗi, sai lầm'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'observe', '', '', 292, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228812]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'quan sát, nhận xét', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'quan sát, nhận xét'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'opportunity', '', '', 293, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228813]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cơ hội, thời cơ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cơ hội, thời cơ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'prize', '', '', 294, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228814]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'giải thưởng, phần thưởng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'giải thưởng, phần thưởng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'race', '', '', 295, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228815]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cuộc đua', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cuộc đua'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'realize', '', '', 296, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228816]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'nhận ra, nhận thức', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'nhận ra, nhận thức'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'respond', '', '', 297, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228817]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đáp lại, hưởng ứng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đáp lại, hưởng ứng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'risk', '', '', 298, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228818]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'mạo hiểm, rủi ro', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'mạo hiểm, rủi ro'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'wonder', '', '', 299, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228819]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'muốn biết, tự hỏi', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'muốn biết, tự hỏi'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'yet', '', '', 300, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228820]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chưa', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chưa'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'academy', '', '', 301, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228821]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'học viện', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'học viện'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'ancient', '', '', 302, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228822]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cổ xưa', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cổ xưa'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'board', '', '', 303, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228823]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bảng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bảng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'century', '', '', 304, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228824]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thế kỷ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thế kỷ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'clue', '', '', 305, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228825]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'manh mối, đầu mối', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'manh mối, đầu mối'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'concert', '', '', 306, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228826]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'buổi hoà nhạc (n), phối hợp/sắp đặt (v)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'buổi hoà nhạc (n), phối hợp/sắp đặt (v)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'county', '', '', 307, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228827]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'hạt, tỉnh (đơn vị hành chính)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'hạt, tỉnh (đơn vị hành chính)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'dictionary', '', '', 308, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228828]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'từ điển', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'từ điển'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'exist', '', '', 309, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228829]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tồn tại, sống', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tồn tại, sống'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'flat', '', '', 310, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228830]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'phẳng, căn hộ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'phẳng, căn hộ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'gentleman', '', '', 311, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228831]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'quý ông', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'quý ông'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'hidden', '', '', 312, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228832]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'ẩn, trốn, nấp, che giấu', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'ẩn, trốn, nấp, che giấu'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'maybe', '', '', 313, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228833]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'có lẽ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'có lẽ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'officer', '', '', 314, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228834]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sĩ quan', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sĩ quan'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'original', '', '', 315, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228835]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'nguyên bản, nguyên gốc', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'nguyên bản, nguyên gốc'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'pound', '', '', 316, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228836]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đánh đập, đóng (đinh), Pao (khoảng 450 gam)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đánh đập, đóng (đinh), Pao (khoảng 450 gam)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'process', '', '', 317, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228837]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'quá trình', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'quá trình'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'publish', '', '', 318, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228838]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'xuất bản, công bố, ban hành', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'xuất bản, công bố, ban hành'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'theater', '', '', 319, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228839]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'nhà hát, rạp hát', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'nhà hát, rạp hát'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'wealth', '', '', 320, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228840]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự giàu có, sự giàu sang', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự giàu có, sự giàu sang'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'appreciate', '', '', 321, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228841]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đánh giá, nâng giá, tăng giá', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đánh giá, nâng giá, tăng giá'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'available', '', '', 322, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228842]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sẵn sàng để dùng, sẵn có', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sẵn sàng để dùng, sẵn có'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'beat', '', '', 323, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228843]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đánh bại', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đánh bại'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'bright', '', '', 324, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228844]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sáng chói', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sáng chói'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'celebrate', '', '', 325, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228845]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'làm lễ kỷ niệm, tán dương, ca tụng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'làm lễ kỷ niệm, tán dương, ca tụng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'determine', '', '', 326, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228846]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'xác định, định rõ, quyết định', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'xác định, định rõ, quyết định'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'disappear', '', '', 327, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228847]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'biến mất', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'biến mất'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'else', '', '', 328, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228848]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'khác', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'khác'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'fair', '', '', 329, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228849]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'công bằng, hợp lý', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'công bằng, hợp lý'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'flow', '', '', 330, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228850]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chảy, dòng chảy, lưu lượng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chảy, dòng chảy, lưu lượng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'forward', '', '', 331, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228851]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'phía trước', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'phía trước'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'hill', '', '', 332, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228852]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'ngọn đồi', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'ngọn đồi'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'level', '', '', 333, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228853]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'mức, mức độ (n); phẳng, bằng (adj); làm phẳng, san bằng (v)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'mức, mức độ (n); phẳng, bằng (adj); làm phẳng, san bằng (v)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'lone', '', '', 334, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228854]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cô độc, bơ vơ, hiu quạnh', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cô độc, bơ vơ, hiu quạnh'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'puddle', '', '', 335, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228855]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'vũng nước', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'vũng nước'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'response', '', '', 336, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228856]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'trả lời, đáp lại', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'trả lời, đáp lại'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'season', '', '', 337, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228857]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'mùa trong năm', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'mùa trong năm'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'solution', '', '', 338, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228858]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'giải pháp, cách giải quyết', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'giải pháp, cách giải quyết'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'waste', '', '', 339, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228859]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'lãng phí', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'lãng phí'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'whether', '', '', 340, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228860]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'không biết có không, giữa (cái này cái kia)...', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'không biết có không, giữa (cái này cái kia)...'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'argue', '', '', 341, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228861]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tranh cãi', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tranh cãi'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'communicate', '', '', 342, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228862]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'liên lạc, giao tiếp', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'liên lạc, giao tiếp'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'crowd', '', '', 343, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228863]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đám đông', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đám đông'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'depend', '', '', 344, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228864]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'phụ thuộc, tuỳ thuộc', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'phụ thuộc, tuỳ thuộc'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'dish', '', '', 345, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228865]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đĩa (đựng thức ăn)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đĩa (đựng thức ăn)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'empty', '', '', 346, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228866]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'rỗng, trống không', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'rỗng, trống không'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'exact', '', '', 347, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228867]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chính xác, đúng đắn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chính xác, đúng đắn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'fresh', '', '', 348, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228868]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tươi (hoa, rau, cá, thịt...), trong lành (không khí)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tươi (hoa, rau, cá, thịt...), trong lành (không khí)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'gather', '', '', 349, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228869]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thu thập, tập hợp', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thu thập, tập hợp'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'indicate', '', '', 350, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228870]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cho biết, ra dấu, tỏ ra, biểu lộ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cho biết, ra dấu, tỏ ra, biểu lộ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'item', '', '', 351, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228871]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'món (ghi trong đơn hàng...), khoản, tiết mục', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'món (ghi trong đơn hàng...), khoản, tiết mục'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'offer', '', '', 352, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228872]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đưa ra đề nghị, đưa ra, chìa ra, biếu tặng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đưa ra đề nghị, đưa ra, chìa ra, biếu tặng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'price', '', '', 353, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228873]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'giá ((nghĩa đen) & (nghĩa bóng))', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'giá ((nghĩa đen) & (nghĩa bóng))'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'product', '', '', 354, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228874]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sản phẩm, vật phẩm', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sản phẩm, vật phẩm'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'property', '', '', 355, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228875]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tài sản, của cải', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tài sản, của cải'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'purchase', '', '', 356, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228876]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'mua, tậu', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'mua, tậu'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'recommend', '', '', 357, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228877]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'giới thiệu, khuyên bảo, khuyên dùng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'giới thiệu, khuyên bảo, khuyên dùng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'select', '', '', 358, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228878]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'lựa chọn, chọn lọc, tuyển lựa', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'lựa chọn, chọn lọc, tuyển lựa'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'tool', '', '', 359, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228879]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'dụng cụ, đồ nghề', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'dụng cụ, đồ nghề'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'treat', '', '', 360, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228880]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đối xử, đối đãi, cư xử, ăn ở', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đối xử, đối đãi, cư xử, ăn ở'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'alive', '', '', 361, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228881]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'còn sống, đang sống, còn tồn tại', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'còn sống, đang sống, còn tồn tại'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'bone', '', '', 362, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228882]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'xương', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'xương'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'bother', '', '', 363, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228883]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'làm phiền', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'làm phiền'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'captain', '', '', 364, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228884]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thuyền trưởng, cơ trưởng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thuyền trưởng, cơ trưởng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'conclusion', '', '', 365, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228885]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự kết luận, sự kết thúc, phần cuối', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự kết luận, sự kết thúc, phần cuối'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'doubt', '', '', 366, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228886]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự nghi ngờ, sự ngờ vực', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự nghi ngờ, sự ngờ vực'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'explore', '', '', 367, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228887]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'khám phá, thăm dò, thám hiểm', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'khám phá, thăm dò, thám hiểm'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'foreign', '', '', 368, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228888]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', '(thuộc) nước ngoài', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = '(thuộc) nước ngoài'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'glad', '', '', 369, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228889]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'vui mừng, sung sướng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'vui mừng, sung sướng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'however', '', '', 370, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228890]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tuy nhiên', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tuy nhiên'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'injustice', '', '', 371, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228891]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự bất công', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự bất công'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'international', '', '', 372, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228892]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', '(thuộc) quốc tế', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = '(thuộc) quốc tế'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'lawyer', '', '', 373, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228893]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'luật sư', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'luật sư'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'mention', '', '', 374, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228894]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đề cập, nói đến, kể ra', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đề cập, nói đến, kể ra'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'policy', '', '', 375, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228895]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chính sách', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chính sách'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'social', '', '', 376, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228896]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'có tính chất xã hội', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'có tính chất xã hội'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'speech', '', '', 377, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228897]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bài nói chuyện, bài diễn văn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bài nói chuyện, bài diễn văn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'staff', '', '', 378, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228898]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'nhân viên, nhóm nhân viên', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'nhân viên, nhóm nhân viên'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'toward', '', '', 379, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228899]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'về phía, hướng về', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'về phía, hướng về'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'wood', '', '', 380, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228900]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'gỗ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'gỗ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'achieve', '', '', 381, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228901]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đạt được, giành được', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đạt được, giành được'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'advise', '', '', 382, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228902]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'khuyên, khuyên bảo', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'khuyên, khuyên bảo'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'already', '', '', 383, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228903]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'rồi; đã... rồi', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'rồi; đã... rồi'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'basic', '', '', 384, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228904]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cơ bản, cơ sở', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cơ bản, cơ sở'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'bit', '', '', 385, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228905]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'mẩu, miếng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'mẩu, miếng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'consider', '', '', 386, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228906]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cân nhắc, xem xét, suy xét', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cân nhắc, xem xét, suy xét'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'destroy', '', '', 387, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228907]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'phá huỷ, tàn phá', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'phá huỷ, tàn phá'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'entertain', '', '', 388, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228908]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'giải trí, tiêu khiển', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'giải trí, tiêu khiển'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'extra', '', '', 389, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228909]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thừa, thượng hạng, đặc biệt', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thừa, thượng hạng, đặc biệt'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'goal', '', '', 390, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228910]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bàn thắng, mục đích, mục tiêu', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bàn thắng, mục đích, mục tiêu'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'lie', '', '', 391, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228911]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'nói dối, lừa dối', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'nói dối, lừa dối'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'meat', '', '', 392, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228912]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thịt', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thịt'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'opinion', '', '', 393, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228913]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'quan điểm, ý kiến, sự đánh giá', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'quan điểm, ý kiến, sự đánh giá'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'real', '', '', 394, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228914]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thực tế, có thực, thật (không phải giả)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thực tế, có thực, thật (không phải giả)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'reflect', '', '', 395, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228915]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'phản chiếu, phản xạ, phản ánh', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'phản chiếu, phản xạ, phản ánh'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'regard', '', '', 396, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228916]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'coi như, xem như', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'coi như, xem như'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'serve', '', '', 397, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228917]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'phục vụ, phụng sự', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'phục vụ, phụng sự'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'vegetable', '', '', 398, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228918]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'rau cỏ (noun & adj)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'rau cỏ (noun & adj)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'war', '', '', 399, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228919]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chiến tranh', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chiến tranh'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'worth', '', '', 400, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228920]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đáng giá, giá trị', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đáng giá, giá trị'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'appear', '', '', 401, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228921]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'biểu lộ, hình như, có vẻ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'biểu lộ, hình như, có vẻ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'base', '', '', 402, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228922]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'nền tảng, chân đế', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'nền tảng, chân đế'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'brain', '', '', 403, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228923]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'não', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'não'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'career', '', '', 404, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228924]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự nghiệp', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự nghiệp'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'clerk', '', '', 405, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228925]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'giao dịch viên, thư ký, nhân viên', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'giao dịch viên, thư ký, nhân viên'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'effort', '', '', 406, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228926]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'nỗ lực', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'nỗ lực'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'enter', '', '', 407, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228927]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đi vào', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đi vào'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'excellent', '', '', 408, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228928]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'xuất sắc', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'xuất sắc'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'hero', '', '', 409, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228929]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'anh hùng, người hùng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'anh hùng, người hùng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'hurry', '', '', 410, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228930]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'vội vàng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'vội vàng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'inform', '', '', 411, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228931]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thông báo, báo tin, cho biết', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thông báo, báo tin, cho biết'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'later', '', '', 412, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228932]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'muộn hơn, sau này', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'muộn hơn, sau này'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'leave', '', '', 413, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228933]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'rời đi, bỏ đi', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'rời đi, bỏ đi'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'locate', '', '', 414, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228934]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'xác định vị trí', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'xác định vị trí'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'nurse', '', '', 415, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228935]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'y tá, nữ y tá', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'y tá, nữ y tá'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'operation', '', '', 416, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228936]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự phẩu thuật, ca mổ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự phẩu thuật, ca mổ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'pain', '', '', 417, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228937]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự đau, làm đau đớn, đau nhức', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự đau, làm đau đớn, đau nhức'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'refuse', '', '', 418, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228938]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'từ chối, khước từ, cự tuyệt', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'từ chối, khước từ, cự tuyệt'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'though', '', '', 419, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228939]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cho dù, mặc dù, dẫu cho', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cho dù, mặc dù, dẫu cho'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'various', '', '', 420, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228940]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'khác nhau; nhiều thứ khác nhau', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'khác nhau; nhiều thứ khác nhau'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'actual', '', '', 421, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228941]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thực tế, có thật, hiện thời; hiện nay', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thực tế, có thật, hiện thời; hiện nay'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'amaze', '', '', 422, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228942]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'làm kinh ngạc, làm sửng sốt', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'làm kinh ngạc, làm sửng sốt'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'charge', '', '', 423, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228943]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tiền phải trả, giá tiền', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tiền phải trả, giá tiền'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'comfort', '', '', 424, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228944]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'an ủi, dỗ dành, làm khuây khoả', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'an ủi, dỗ dành, làm khuây khoả'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'contact', '', '', 425, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228945]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tiếp xúc, liên lạc', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tiếp xúc, liên lạc'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'customer', '', '', 426, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228946]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'khách hàng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'khách hàng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'deliver', '', '', 427, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228947]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'giao (hàng), phân phát (thư)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'giao (hàng), phân phát (thư)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'earn', '', '', 428, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228948]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'kiếm tiền', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'kiếm tiền'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'gate', '', '', 429, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228949]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cổng, cửa ra vào', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cổng, cửa ra vào'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'include', '', '', 430, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228950]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bao gồm, gồm có', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bao gồm, gồm có'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'manage', '', '', 431, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228951]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'quản lý, trông nom, xoay xở', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'quản lý, trông nom, xoay xở'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'mystery', '', '', 432, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228952]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'điều huyền bí, điều bí ẩn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'điều huyền bí, điều bí ẩn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'occur', '', '', 433, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228953]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'xảy ra, xảy đến', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'xảy ra, xảy đến'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'opposite', '', '', 434, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228954]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đối diện, đối nhau, ngược nhau', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đối diện, đối nhau, ngược nhau'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'plate', '', '', 435, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228955]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đĩa (để đựng thức ăn)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đĩa (để đựng thức ăn)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'receive', '', '', 436, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228956]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'nhận, lĩnh, thu', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'nhận, lĩnh, thu'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'reward', '', '', 437, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228957]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự thưởng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự thưởng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'set', '', '', 438, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228958]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thiết lập, để, đặt, bố trí', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thiết lập, để, đặt, bố trí'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'steal', '', '', 439, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228959]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'ăn cắp, ăn trộm', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'ăn cắp, ăn trộm'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'thief', '', '', 440, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228960]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'kẻ trộm, kẻ cắp', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'kẻ trộm, kẻ cắp'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'advance', '', '', 441, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228961]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tiến lên, tiến tới, tiến bộ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tiến lên, tiến tới, tiến bộ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'athlete', '', '', 442, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228962]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'vận động viên', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'vận động viên'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'average', '', '', 443, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228963]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'trung bình', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'trung bình'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'behavior', '', '', 444, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228964]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cách cư xử', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cách cư xử'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'behind', '', '', 445, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228965]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đằng sau', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đằng sau'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'course', '', '', 446, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228966]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'khoá học', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'khoá học'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'lower', '', '', 447, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228967]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thấp hơn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thấp hơn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'match', '', '', 448, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228968]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'hợp, xứng, trận đấu', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'hợp, xứng, trận đấu'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'member', '', '', 449, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228969]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thành viên, hội viên', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thành viên, hội viên'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'mental', '', '', 450, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228970]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', '(thuộc) trí tuệ, tinh thần, tâm thần, thần kinh', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = '(thuộc) trí tuệ, tinh thần, tâm thần, thần kinh'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'passenger', '', '', 451, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228971]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'hành khách (đi tàu xe...)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'hành khách (đi tàu xe...)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'personality', '', '', 452, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228972]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tính cách, nhân cách', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tính cách, nhân cách'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'poem', '', '', 453, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228973]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thơ, bài thơ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thơ, bài thơ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'pole', '', '', 454, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228974]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cực, cái sào, cột', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cực, cái sào, cột'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'remove', '', '', 455, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228975]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bỏ ra, tháo ra, lấy ra, dời đi', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bỏ ra, tháo ra, lấy ra, dời đi'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'safety', '', '', 456, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228976]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự an toàn, sự chắc chắn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự an toàn, sự chắc chắn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'shoot', '', '', 457, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228977]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bắn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bắn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'sound', '', '', 458, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228978]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'kêu, vang tiếng, nghe như, nghe có vẻ, âm thanh', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'kêu, vang tiếng, nghe như, nghe có vẻ, âm thanh'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'swim', '', '', 459, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228979]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bơi', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bơi'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'web', '', '', 460, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228980]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'mạng (nhện), tơ (lông chim)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'mạng (nhện), tơ (lông chim)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'block', '', '', 461, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228981]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'khối, tảng, súc (đá, gỗ...)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'khối, tảng, súc (đá, gỗ...)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'cheer', '', '', 462, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228982]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cổ vũ, tung hô', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cổ vũ, tung hô'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'complex', '', '', 463, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228983]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'phức tạp, rắc rối', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'phức tạp, rắc rối'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'critic', '', '', 464, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228984]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'nhà phê bình', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'nhà phê bình'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'event', '', '', 465, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228985]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự kiện, sự việc', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự kiện, sự việc'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'exercise', '', '', 466, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228986]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tập luyện, rèn luyện (thể dục thể thao)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tập luyện, rèn luyện (thể dục thể thao)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'fit', '', '', 467, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228987]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'vừa, thích hợp, phù hợp', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'vừa, thích hợp, phù hợp'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'friendship', '', '', 468, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228988]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tình bạn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tình bạn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'guide', '', '', 469, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228989]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'hướng dẫn viên, người chỉ dẫn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'hướng dẫn viên, người chỉ dẫn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'lack', '', '', 470, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228990]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thiếu, không có', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thiếu, không có'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'passage', '', '', 471, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228991]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'lối đi, sự đi qua, đoạn (bài văn, sách...)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'lối đi, sự đi qua, đoạn (bài văn, sách...)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'perform', '', '', 472, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228992]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'biểu diễn, trình bày, thực hiện', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'biểu diễn, trình bày, thực hiện'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'pressure', '', '', 473, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228993]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'áp lực', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'áp lực'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'probable', '', '', 474, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228994]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chắc hẳn , có lễ đúng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chắc hẳn , có lễ đúng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'public', '', '', 475, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228995]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'công cộng, công khai, công chúng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'công cộng, công khai, công chúng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'strike', '', '', 476, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228996]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đánh, tấn công,', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đánh, tấn công,'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'support', '', '', 477, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228997]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'hỗ trợ, ủng hộ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'hỗ trợ, ủng hộ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'task', '', '', 478, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228998]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'nhiệm vụ, công việc, bài tập, phận sự', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'nhiệm vụ, công việc, bài tập, phận sự'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'term', '', '', 479, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658228999]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thời hạn, kỳ hạn, lời lẽ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thời hạn, kỳ hạn, lời lẽ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'unite', '', '', 480, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229000]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đoàn kết, liên kết', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đoàn kết, liên kết'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'associate', '', '', 481, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229001]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'kết hợp, kết giao, liên hợp lại', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'kết hợp, kết giao, liên hợp lại'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'environment', '', '', 482, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229002]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'môi trường', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'môi trường'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'factory', '', '', 483, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229003]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'nhà máy, xí nghiệp', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'nhà máy, xí nghiệp'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'feature', '', '', 484, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229004]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'điểm đặc trưng, nét đặc biệt', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'điểm đặc trưng, nét đặc biệt'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'instance', '', '', 485, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229005]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thí dụ, ví dụ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thí dụ, ví dụ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'involve', '', '', 486, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229006]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'dính líu, dính dáng (dạng bị động) để hết tâm trí vào (cái gì)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'dính líu, dính dáng (dạng bị động) để hết tâm trí vào (cái gì)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'medicine', '', '', 487, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229007]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thuốc', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thuốc'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'mix', '', '', 488, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229008]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'hỗn hợp, trộn lẫn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'hỗn hợp, trộn lẫn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'organize', '', '', 489, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229009]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tổ chức', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tổ chức'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'period', '', '', 490, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229010]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thời kỳ, giai đoạn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thời kỳ, giai đoạn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'populate', '', '', 491, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229011]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'ở, cư trú', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'ở, cư trú'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'produce', '', '', 492, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229012]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sản xuất, ra quả', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sản xuất, ra quả'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'range', '', '', 493, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229013]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'dải, phạm vi, khoảng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'dải, phạm vi, khoảng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'recognize', '', '', 494, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229014]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'nhận ra', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'nhận ra'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'regular', '', '', 495, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229015]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thường lệ, đều đặn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thường lệ, đều đặn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'sign', '', '', 496, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229016]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'dấu hiệu, ký hiệu; ký tên, ra hiệu', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'dấu hiệu, ký hiệu; ký tên, ra hiệu'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'tip', '', '', 497, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229017]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đầu mút, tiền thưởng phục vụ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đầu mút, tiền thưởng phục vụ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'tradition', '', '', 498, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229018]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'truyền thống', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'truyền thống'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'trash', '', '', 499, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229019]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'rác', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'rác'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'wide', '', '', 500, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229020]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'rộng, rộng lớn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'rộng, rộng lớn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'advice', '', '', 501, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229021]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'lời khuyên', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'lời khuyên'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'along', '', '', 502, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229022]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'dọc theo', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'dọc theo'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'attention', '', '', 503, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229023]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự chú ý', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự chú ý'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'attract', '', '', 504, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229024]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'hấp dẫn, thu hút', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'hấp dẫn, thu hút'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'climb', '', '', 505, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229025]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'trèo, leo', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'trèo, leo'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'drop', '', '', 506, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229026]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'rơi, sụt giảm', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'rơi, sụt giảm'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'final', '', '', 507, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229027]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cuối cùng, chung kết', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cuối cùng, chung kết'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'further', '', '', 508, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229028]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'xa hơn, bên kia', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'xa hơn, bên kia'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'imply', '', '', 509, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229029]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'ý nói; ngụ ý', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'ý nói; ngụ ý'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'maintain', '', '', 510, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229030]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'duy trì', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'duy trì'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'neither', '', '', 511, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229031]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', '...... nor không ... mà cũng không', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = '...... nor không ... mà cũng không'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'otherwise', '', '', 512, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229032]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'nếu không thì, mặt khác, cách khác', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'nếu không thì, mặt khác, cách khác'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'physical', '', '', 513, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229033]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', '(thuộc) vật lý, (thuộc) vật chất', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = '(thuộc) vật lý, (thuộc) vật chất'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'prove', '', '', 514, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229034]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chứng minh', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chứng minh'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'react', '', '', 515, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229035]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'phản ứng, đối phó', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'phản ứng, đối phó'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'ride', '', '', 516, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229036]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cưỡi', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cưỡi'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'situated', '', '', 517, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229037]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'ở (một nơi, một tình thế, một hoàn cảnh)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'ở (một nơi, một tình thế, một hoàn cảnh)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'society', '', '', 518, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229038]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'xã hội', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'xã hội'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'standard', '', '', 519, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229039]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tiêu chuẩn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tiêu chuẩn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'suggest', '', '', 520, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229040]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'gợi ý, đề nghị', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'gợi ý, đề nghị'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'actually', '', '', 521, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229041]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thực sự, quả thật', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thực sự, quả thật'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'bite', '', '', 522, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229042]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cắn, ngoạm', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cắn, ngoạm'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'coast', '', '', 523, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229043]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bờ biển', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bờ biển'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'deal', '', '', 524, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229044]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'giải quyết; đối phó; sự giao dịch', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'giải quyết; đối phó; sự giao dịch'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'desert', '', '', 525, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229045]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sa mạc', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sa mạc'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'earthquake', '', '', 526, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229046]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'trận động đất', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'trận động đất'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'effective', '', '', 527, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229047]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'có hiệu quả', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'có hiệu quả'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'examine', '', '', 528, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229048]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'kiểm tra', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'kiểm tra'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'false', '', '', 529, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229049]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sai, nhầm', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sai, nhầm'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'gift', '', '', 530, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229050]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'quà tặng; tặng, biếu, cho', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'quà tặng; tặng, biếu, cho'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'hunger', '', '', 531, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229051]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự đói, tình trạng đói', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự đói, tình trạng đói'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'imagine', '', '', 532, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229052]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tưởng tượng, hình dung', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tưởng tượng, hình dung'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'journey', '', '', 533, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229053]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cuộc hành trình, chuyến đi', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cuộc hành trình, chuyến đi'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'puzzle', '', '', 534, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229054]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'trò chơi đố; câu đố, vấn đề khó', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'trò chơi đố; câu đố, vấn đề khó'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'quite', '', '', 535, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229055]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'khá, hoàn toàn, hầu hết', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'khá, hoàn toàn, hầu hết'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'rather', '', '', 536, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229056]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thích... hơn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thích... hơn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'specific', '', '', 537, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229057]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'rành mạch, rõ ràng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'rành mạch, rõ ràng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'tour', '', '', 538, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229058]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'cuộc đi du lịch', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'cuộc đi du lịch'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'trip', '', '', 539, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229059]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chuyến đi', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chuyến đi'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'value', '', '', 540, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229060]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'giá trị', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'giá trị'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'band', '', '', 541, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229061]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'ban nhạc, dải, băng, đai, nẹp', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'ban nhạc, dải, băng, đai, nẹp'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'barely', '', '', 542, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229062]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'vừa đủ, rỗng không, nghèo nàn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'vừa đủ, rỗng không, nghèo nàn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'boring', '', '', 543, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229063]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chán ngắt, buồn tẻ, sự khoan, sự đào', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chán ngắt, buồn tẻ, sự khoan, sự đào'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'cancel', '', '', 544, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229064]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'huỷ bỏ, bãi bỏ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'huỷ bỏ, bãi bỏ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'driveway', '', '', 545, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229065]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đường lái xe vào nhà', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đường lái xe vào nhà'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'garbage', '', '', 546, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229066]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'rác', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'rác'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'instrument', '', '', 547, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229067]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'dụng cụ, nhạc cụ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'dụng cụ, nhạc cụ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'list', '', '', 548, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229068]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'danh sách; liệt kê, lập danh sách', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'danh sách; liệt kê, lập danh sách'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'magic', '', '', 549, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229069]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'phép thuật, ma thuật', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'phép thuật, ma thuật'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'message', '', '', 550, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229070]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thông điệp; đưa tin', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thông điệp; đưa tin'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'notice', '', '', 551, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229071]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chú ý, để ý, báo trước', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chú ý, để ý, báo trước'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'own', '', '', 552, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229072]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sở hữu', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sở hữu'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'predict', '', '', 553, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229073]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'đoán trước, dự đoán', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'đoán trước, dự đoán'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'professor', '', '', 554, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229074]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'giáo sư', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'giáo sư'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'rush', '', '', 555, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229075]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'vội vã, đi gấp', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'vội vã, đi gấp'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'schedule', '', '', 556, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229076]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thời gian biểu, thời khóa biểu (bản kế hoạch có thời gian)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thời gian biểu, thời khóa biểu (bản kế hoạch có thời gian)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'share', '', '', 557, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229077]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chia sẻ, cổ phần', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chia sẻ, cổ phần'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'stage', '', '', 558, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229078]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sân khấu, giai đoạn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sân khấu, giai đoạn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'storm', '', '', 559, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229079]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'dông tố, cơn bão', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'dông tố, cơn bão'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'within', '', '', 560, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229080]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'trong vòng, trong phạm vi, bên trong, phía trong', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'trong vòng, trong phạm vi, bên trong, phía trong'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'advertise', '', '', 561, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229081]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'quảng cáo', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'quảng cáo'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'assign', '', '', 562, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229082]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'phân việc, phân công', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'phân việc, phân công'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'audience', '', '', 563, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229083]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thính giả, khán giả, bạn đọc', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thính giả, khán giả, bạn đọc'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'breakfast', '', '', 564, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229084]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bữa ăn sáng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bữa ăn sáng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'competition', '', '', 565, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229085]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự cạnh tranh, cuộc thi', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự cạnh tranh, cuộc thi'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'cool', '', '', 566, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229086]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'mát mẻ, trầm tĩnh', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'mát mẻ, trầm tĩnh'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'gain', '', '', 567, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229087]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tăng tốc (tốc độ...); lên (cân...)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tăng tốc (tốc độ...); lên (cân...)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'importance', '', '', 568, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229088]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sự quan trọng, tầm quan trọng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sự quan trọng, tầm quan trọng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'knowledge', '', '', 569, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229089]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'kiến thức, tri thức', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'kiến thức, tri thức'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'major', '', '', 570, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229090]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chính, chủ yếu, trọng đại', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chính, chủ yếu, trọng đại'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'mean', '', '', 571, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229091]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'verb : nghĩa là, có nghĩa là adj : hèn hạ, bần tiện, kém cỏi, n óng tính ???', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'verb : nghĩa là, có nghĩa là adj : hèn hạ, bần tiện, kém cỏi, n óng tính ???'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'prefer', '', '', 572, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229092]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thích hơn, ưa hơn, đề bạt, đưa ra', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thích hơn, ưa hơn, đề bạt, đưa ra'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'president', '', '', 573, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229093]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tổng thống, chủ tịch', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tổng thống, chủ tịch'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'progress', '', '', 574, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229094]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'noun&verb : tiến triển, tiến bộ, tiến hành', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'noun&verb : tiến triển, tiến bộ, tiến hành'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'respect', '', '', 575, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229095]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'noun&verb : tôn trọng, kính trọng, lưu tâm, chú ý', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'noun&verb : tôn trọng, kính trọng, lưu tâm, chú ý'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'rich', '', '', 576, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229096]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'giàu, giàu có', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'giàu, giàu có'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'skill', '', '', 577, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229097]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'kỹ năng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'kỹ năng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'somehow', '', '', 578, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229098]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'vì lý do này khác, không biết làm sao', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'vì lý do này khác, không biết làm sao'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'strength', '', '', 579, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229099]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'sức mạnh, sức lực, sức khoẻ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'sức mạnh, sức lực, sức khoẻ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'vote', '', '', 580, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229100]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bỏ phiếu, bầu cử', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bỏ phiếu, bầu cử'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'above', '', '', 581, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229101]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'ở trên, trên đầu', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'ở trên, trên đầu'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'ahead', '', '', 582, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229102]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'adv : thẳng phía trước adj : hơn, vượt', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'adv : thẳng phía trước adj : hơn, vượt'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'amount', '', '', 583, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229103]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tổng giá trị (hợp đồng), tổng số (tiền)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tổng giá trị (hợp đồng), tổng số (tiền)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'belief', '', '', 584, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229104]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'niềm tin, lòng tin, đức tin', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'niềm tin, lòng tin, đức tin'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'center', '', '', 585, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229105]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'trung tâm', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'trung tâm'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'common', '', '', 586, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229106]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thông thường, chung, phổ thông', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thông thường, chung, phổ thông'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'cost', '', '', 587, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229107]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chi phí, giá thành, phí tổn', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chi phí, giá thành, phí tổn'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'demonstrate', '', '', 588, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229108]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chứng minh, giải thích, biểu lộ, biểu tình', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chứng minh, giải thích, biểu lộ, biểu tình'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'different', '', '', 589, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229109]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'khác biệt, khác nhau', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'khác biệt, khác nhau'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'evidence', '', '', 590, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229110]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'chứng cớ, bằng chứng', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'chứng cớ, bằng chứng'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'honesty', '', '', 591, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229111]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'tính trung thực, tính lương thiện', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'tính trung thực, tính lương thiện'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'idiom', '', '', 592, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229112]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thành ngữ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thành ngữ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'independent', '', '', 593, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229113]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'độc lập, không phụ thuộc', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'độc lập, không phụ thuộc'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'inside', '', '', 594, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229114]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bên trong, phía trong, phần trong', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bên trong, phía trong, phần trong'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'master', '', '', 595, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229115]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bậc thầy, thợ cả', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bậc thầy, thợ cả'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'memory', '', '', 596, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229116]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'trí nhớ, ký ức, sự tưởng nhớ', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'trí nhớ, ký ức, sự tưởng nhớ'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'proper', '', '', 597, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229117]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'thích đáng, thích hợp, đúng mực', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'thích đáng, thích hợp, đúng mực'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'scan', '', '', 598, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229118]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'quét, nhìn chăm chú, đọc lướt', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'quét, nhìn chăm chú, đọc lướt'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'section', '', '', 599, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229119]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'mặt cắt, lát cắt, đoạn (trong sách)', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'mặt cắt, lát cắt, đoạn (trong sách)'
);

WITH upsert_word AS (
  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)
  VALUES ('en', 'surface', '', '', 600, '', '{"source": "anki_4000_essential_words_1", "source_url": "", "note_ids": [1565658229120]}'::jsonb)
  ON CONFLICT (language, lemma, pos) DO UPDATE
  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,
      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
      extra = words.extra || EXCLUDED.extra,
      updated_at = now()
  RETURNING id
)
INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)
SELECT u.id, 'vi', 'bề mặt', 0 FROM upsert_word u
WHERE NOT EXISTS (
  SELECT 1 FROM word_meanings wm
  WHERE wm.word_id = u.id AND wm.ui_language = 'vi' AND wm.meaning = 'bề mặt'
);

COMMIT;
