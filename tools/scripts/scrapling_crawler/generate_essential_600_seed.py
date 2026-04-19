#!/usr/bin/env python3
"""Generate a DB-importable seed set of 600 essential English words.

Source:
- wordfreq (Apache-2.0): https://github.com/rspeer/wordfreq/

Outputs:
- out/essential_600_words.csv
- out/essential_600_words.sql

Targets vocabulary schema in services/vocabulary/migrations/00001_init_schema.sql
(table `words`).
"""

from __future__ import annotations

import csv
import json
from pathlib import Path

from wordfreq import top_n_list

OUT_DIR = Path(__file__).resolve().parent / "out"
OUT_CSV = OUT_DIR / "essential_600_words.csv"
OUT_SQL = OUT_DIR / "essential_600_words.sql"


def level_from_rank(rank: int) -> str:
  if rank <= 150:
    return "A1"
  if rank <= 300:
    return "A2"
  if rank <= 450:
    return "B1"
  return "B2"


def escape_sql(value: str) -> str:
  return value.replace("'", "''")


def main() -> None:
  OUT_DIR.mkdir(parents=True, exist_ok=True)

  # Pull a larger candidate set, then filter down to 600 clean entries.
  words = top_n_list("en", 1200)
  rows = []
  for idx, w in enumerate(words, start=1):
    lemma = (w or "").strip().lower()
    if not lemma:
      continue
    if not lemma.isascii():
      continue
    if any(ch.isdigit() for ch in lemma):
      continue
    rows.append(
      {
        "language": "en",
        "lemma": lemma,
        "pos": "",
        "ipa": "",
        "frequency_rank": idx,
        "level": level_from_rank(idx),
        "extra": {
          "source": "wordfreq",
          "source_url": "https://github.com/rspeer/wordfreq",
          "source_license": "Apache-2.0",
          "dataset": "top_n_list(en, 1200) filtered_ascii_dedup -> first_600",
        },
      }
    )

  # remove duplicates preserving order
  dedup = []
  seen = set()
  for r in rows:
    key = (r["language"], r["lemma"], r["pos"])
    if key in seen:
      continue
    seen.add(key)
    dedup.append(r)

  # enforce exactly 600 rows after filtering
  dedup = dedup[:600]
  if len(dedup) < 600:
    raise RuntimeError(f"Not enough clean words after filtering: {len(dedup)}")

  with OUT_CSV.open("w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(
      f,
      fieldnames=[
        "language",
        "lemma",
        "pos",
        "ipa",
        "frequency_rank",
        "level",
        "extra",
      ],
    )
    writer.writeheader()
    for r in dedup:
      writer.writerow(
        {
          "language": r["language"],
          "lemma": r["lemma"],
          "pos": r["pos"],
          "ipa": r["ipa"],
          "frequency_rank": r["frequency_rank"],
          "level": r["level"],
          "extra": json.dumps(r["extra"], ensure_ascii=False),
        }
      )

  with OUT_SQL.open("w", encoding="utf-8") as f:
    f.write("-- Seed 600 essential English words (source: wordfreq, Apache-2.0)\n")
    f.write("-- Safe re-run: UPSERT by (language, lemma, pos)\n\n")
    f.write("BEGIN;\n\n")

    for r in dedup:
      extra_json = json.dumps(r["extra"], ensure_ascii=False)
      f.write(
        "INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)\n"
        f"VALUES ('{escape_sql(r['language'])}', '{escape_sql(r['lemma'])}', '{escape_sql(r['pos'])}', '{escape_sql(r['ipa'])}', {r['frequency_rank']}, '{escape_sql(r['level'])}', '{escape_sql(extra_json)}'::jsonb)\n"
        "ON CONFLICT (language, lemma, pos) DO UPDATE\n"
        "SET frequency_rank = EXCLUDED.frequency_rank,\n"
        "    level = EXCLUDED.level,\n"
        "    extra = EXCLUDED.extra,\n"
        "    updated_at = now();\n\n"
      )

    f.write("COMMIT;\n")

  print(f"Generated {len(dedup)} rows")
  print(f"CSV: {OUT_CSV}")
  print(f"SQL: {OUT_SQL}")


if __name__ == "__main__":
  main()
