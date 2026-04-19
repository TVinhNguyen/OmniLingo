#!/usr/bin/env python3
"""Import an Anki .apkg package into OmniLingo vocabulary SQL.

Output targets tables:
- words
- word_meanings
- word_examples

Usage:
  python import_apkg_to_vocab_sql.py \
    --apkg /path/to/4000-essential.apkg \
    --out-sql ./out/apkg_import.sql \
    --ui-language vi
"""

from __future__ import annotations

import argparse
import csv
import html
import json
import re
import sqlite3
import tempfile
import zipfile
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

FIELD_SEP = "\x1f"
SOUND_RE = re.compile(r"\[sound:([^\]]+)\]", re.IGNORECASE)
TAG_RE = re.compile(r"<[^>]+>")
WS_RE = re.compile(r"\s+")

WORD_KEYS = ("word", "term", "front", "question", "vocab", "expression", "english")
MEANING_KEYS = ("meaning", "definition", "back", "translation", "answer", "vi", "vietnamese")
EXAMPLE_KEYS = ("example", "sentence", "usage", "context")
IPA_KEYS = ("ipa", "phonetic", "pronunciation")
POS_KEYS = ("pos", "partofspeech", "part_of_speech", "wordclass")


@dataclass
class Entry:
  lemma: str
  pos: str = ""
  ipa: str = ""
  meanings: list[str] = field(default_factory=list)
  examples: list[str] = field(default_factory=list)
  audio: str = ""
  source_note_ids: list[int] = field(default_factory=list)


def clean_text(text: str) -> str:
  if not text:
    return ""
  text = SOUND_RE.sub(" ", text)
  text = text.replace("<br>", "\n").replace("<br/>", "\n").replace("<br />", "\n")
  text = TAG_RE.sub(" ", text)
  text = html.unescape(text)
  text = WS_RE.sub(" ", text).strip()
  return text


def extract_sound(text: str) -> str:
  m = SOUND_RE.search(text or "")
  return m.group(1).strip() if m else ""


def pick_by_name(field_map: dict[str, str], keys: tuple[str, ...]) -> str:
  for name, value in field_map.items():
    n = name.lower().replace("_", "").replace(" ", "")
    if any(k in n for k in keys):
      v = clean_text(value)
      if v:
        return v
  return ""


def pick_word(field_map: dict[str, str]) -> str:
  word = pick_by_name(field_map, WORD_KEYS)
  if word:
    return word
  # fallback: first non-empty field
  for value in field_map.values():
    v = clean_text(value)
    if v:
      return v
  return ""


def pick_meaning(field_map: dict[str, str], word: str) -> str:
  meaning = pick_by_name(field_map, MEANING_KEYS)
  if meaning:
    return meaning
  # fallback: choose first non-empty field different from word
  w = word.lower()
  for value in field_map.values():
    v = clean_text(value)
    if v and v.lower() != w:
      return v
  return ""


def sql_escape(value: str) -> str:
  return value.replace("'", "''")


def load_models(conn: sqlite3.Connection) -> dict[int, list[str]]:
  models_raw = conn.execute("SELECT models FROM col LIMIT 1").fetchone()
  if not models_raw:
    return {}
  models = json.loads(models_raw[0])
  result: dict[int, list[str]] = {}
  for mid, model in models.items():
    try:
      model_id = int(mid)
    except Exception:
      continue
    field_names = [f.get("name", "") for f in model.get("flds", [])]
    result[model_id] = field_names
  return result


def collection_path_from_apkg(apkg_path: Path, temp_dir: Path) -> Path:
  with zipfile.ZipFile(apkg_path, "r") as zf:
    zf.extractall(temp_dir)

  for name in ("collection.anki2", "collection.anki21"):
    p = temp_dir / name
    if p.exists():
      return p
  raise FileNotFoundError("No collection.anki2 or collection.anki21 found in .apkg")


def parse_apkg(apkg_path: Path) -> list[Entry]:
  entries_by_lemma: dict[str, Entry] = {}

  with tempfile.TemporaryDirectory(prefix="apkg_import_") as td:
    temp_dir = Path(td)
    collection = collection_path_from_apkg(apkg_path, temp_dir)

    conn = sqlite3.connect(str(collection))
    try:
      models = load_models(conn)
      rows = conn.execute("SELECT id, mid, flds FROM notes ORDER BY id ASC").fetchall()

      for note_id, mid, flds in rows:
        field_values = str(flds).split(FIELD_SEP)
        field_names = models.get(int(mid), [])

        if field_names and len(field_names) == len(field_values):
          field_map = {field_names[i]: field_values[i] for i in range(len(field_names))}
        else:
          field_map = {f"field_{i+1}": field_values[i] for i in range(len(field_values))}

        raw_all = "\n".join(field_values)
        word = pick_word(field_map).lower()
        if not word:
          continue
        if len(word) > 120:
          continue

        meaning = pick_meaning(field_map, word)
        example = pick_by_name(field_map, EXAMPLE_KEYS)
        ipa = pick_by_name(field_map, IPA_KEYS)
        pos = pick_by_name(field_map, POS_KEYS).lower()
        audio = extract_sound(raw_all)

        if word not in entries_by_lemma:
          entries_by_lemma[word] = Entry(lemma=word, pos=pos, ipa=ipa, audio=audio)

        e = entries_by_lemma[word]
        if pos and not e.pos:
          e.pos = pos
        if ipa and not e.ipa:
          e.ipa = ipa
        if audio and not e.audio:
          e.audio = audio

        if meaning and meaning not in e.meanings:
          e.meanings.append(meaning)
        if example and example not in e.examples:
          e.examples.append(example)

        e.source_note_ids.append(int(note_id))
    finally:
      conn.close()

  return list(entries_by_lemma.values())


def write_preview_csv(entries: list[Entry], out_csv: Path) -> None:
  out_csv.parent.mkdir(parents=True, exist_ok=True)
  with out_csv.open("w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(
      f,
      fieldnames=["lemma", "pos", "ipa", "meaning", "example", "audio", "note_ids"],
    )
    writer.writeheader()
    for e in entries:
      writer.writerow(
        {
          "lemma": e.lemma,
          "pos": e.pos,
          "ipa": e.ipa,
          "meaning": e.meanings[0] if e.meanings else "",
          "example": e.examples[0] if e.examples else "",
          "audio": e.audio,
          "note_ids": ",".join(str(i) for i in e.source_note_ids[:5]),
        }
      )


def write_sql(entries: list[Entry], out_sql: Path, ui_language: str, source_name: str, source_url: str) -> None:
  out_sql.parent.mkdir(parents=True, exist_ok=True)

  with out_sql.open("w", encoding="utf-8") as f:
    f.write("-- Generated from Anki .apkg import\n")
    f.write("-- Target schema: words, word_meanings, word_examples\n")
    f.write("BEGIN;\n\n")

    rank = 1
    for e in entries:
      extra = {
        "source": source_name,
        "source_url": source_url,
        "note_ids": e.source_note_ids[:20],
      }
      extra_json = sql_escape(json.dumps(extra, ensure_ascii=False))
      lemma = sql_escape(e.lemma)
      pos = sql_escape(e.pos)
      ipa = sql_escape(e.ipa)
      ui_lang = sql_escape(ui_language)

      f.write("WITH upsert_word AS (\n")
      f.write("  INSERT INTO words (language, lemma, pos, ipa, frequency_rank, level, extra)\n")
      f.write(
        f"  VALUES ('en', '{lemma}', '{pos}', '{ipa}', {rank}, '', '{extra_json}'::jsonb)\n"
      )
      f.write("  ON CONFLICT (language, lemma, pos) DO UPDATE\n")
      f.write("  SET ipa = CASE WHEN words.ipa = '' THEN EXCLUDED.ipa ELSE words.ipa END,\n")
      f.write("      frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),\n")
      f.write("      extra = words.extra || EXCLUDED.extra,\n")
      f.write("      updated_at = now()\n")
      f.write("  RETURNING id\n")
      f.write(")\n"
      )

      for idx, meaning in enumerate(e.meanings[:3]):
        m = sql_escape(meaning)
        f.write("INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx)\n")
        f.write("SELECT u.id, ")
        f.write(f"'{ui_lang}', '{m}', {idx} FROM upsert_word u\n")
        f.write("WHERE NOT EXISTS (\n")
        f.write("  SELECT 1 FROM word_meanings wm\n")
        f.write("  WHERE wm.word_id = u.id AND wm.ui_language = ")
        f.write(f"'{ui_lang}' AND wm.meaning = '{m}'\n")
        f.write(");\n")

      for example in e.examples[:2]:
        ex = sql_escape(example)
        audio = sql_escape(e.audio)
        f.write("INSERT INTO word_examples (word_id, sentence, translation, audio_url)\n")
        f.write("SELECT u.id, ")
        f.write(f"'{ex}', '{{}}'::jsonb, '{audio}' FROM upsert_word u\n")
        f.write("WHERE NOT EXISTS (\n")
        f.write("  SELECT 1 FROM word_examples we\n")
        f.write("  WHERE we.word_id = u.id AND we.sentence = ")
        f.write(f"'{ex}'\n")
        f.write(");\n")

      f.write("\n")
      rank += 1

    f.write("COMMIT;\n")


def main() -> None:
  parser = argparse.ArgumentParser(description="Import .apkg to OmniLingo SQL")
  parser.add_argument("--apkg", required=True, help="Path to .apkg file")
  parser.add_argument("--out-sql", default="./out/apkg_import.sql", help="Output SQL path")
  parser.add_argument("--out-csv", default="./out/apkg_preview.csv", help="Output preview CSV path")
  parser.add_argument("--ui-language", default="vi", help="ui_language for word_meanings")
  parser.add_argument("--source-name", default="anki_apkg", help="Source tag in words.extra")
  parser.add_argument("--source-url", default="", help="Source URL in words.extra")
  args = parser.parse_args()

  apkg_path = Path(args.apkg).resolve()
  out_sql = Path(args.out_sql).resolve()
  out_csv = Path(args.out_csv).resolve()

  if not apkg_path.exists():
    raise FileNotFoundError(f"APKG not found: {apkg_path}")

  entries = parse_apkg(apkg_path)
  if not entries:
    raise RuntimeError("No entries parsed from APKG")

  write_preview_csv(entries, out_csv)
  write_sql(entries, out_sql, args.ui_language, args.source_name, args.source_url)

  print(f"Parsed entries: {len(entries)}")
  print(f"Preview CSV: {out_csv}")
  print(f"SQL file: {out_sql}")


if __name__ == "__main__":
  main()
