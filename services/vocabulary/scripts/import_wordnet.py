from __future__ import annotations

"""Import Open English WordNet (OEWN 2024) into vocabulary-service `words` table.

Source  : Open English WordNet 2024 — CC BY 4.0
Download: ./download.sh wordnet     (uses `wn` Python library, stores in .cache/wn_data/)
Run     : make import-en
          DATABASE_URL=postgres://... python import_wordnet.py

Strategy
--------
- Iterate every synset in OEWN.
- For each (synset, lemma) pair → 1 WordRow with lang='en'.
- meanings.en = synset definition  (one row, order_idx=0)
- examples    = synset examples    (sentence only, no translation needed)
- pos         = normalized from synset.pos() ('n','v','a','s','r')
- frequency_rank assigned via wordfreq.word_frequency(lemma, 'en') — inverted so
  rare words get a high rank (999_999) and common words a low rank (≤50_000).
- source      = 'oewn'
- source_id   = f"{synset.id()}:{lemma}"  — stable across OEWN versions

Deduplication
-------------
Words table has UNIQUE(language, lemma, pos).  A lemma appearing in multiple
synsets of the same POS (e.g. "bank" noun) produces multiple rows that differ
only in source_id; the ON CONFLICT … DO UPDATE keeps the one with the
lower frequency_rank and merges meanings.
"""

import argparse
import os
from pathlib import Path

from common import CACHE_DIR, WordRow, corpus_freq_rank, normalize_pos, run_import


# ---------------------------------------------------------------------------
# POS mapping: wn uses 'n','v','a','s' (adj satellite),'r'
# ---------------------------------------------------------------------------

_WN_POS: dict[str, str] = {
    "n": "noun",
    "v": "verb",
    "a": "adjective",
    "s": "adjective",   # adj satellite — treat as adjective
    "r": "adverb",
}


def _wn_pos(pos_char: str) -> str:
    return _WN_POS.get(pos_char, pos_char or "")





# ---------------------------------------------------------------------------
# Parser
# ---------------------------------------------------------------------------

def parse_wordnet() -> list[WordRow]:
    """Iterate OEWN synsets → list[WordRow]."""
    try:
        import wn
    except ImportError:
        raise SystemExit(
            "wn not installed. Run: pip install 'wn>=0.9' or `uv sync` in scripts/"
        )

    wn_data = os.environ.get("WN_DATA", str(CACHE_DIR / "wn_data"))
    os.environ["WN_DATA"] = wn_data

    # Ensure OEWN is available; if not downloaded yet, give a helpful error.
    try:
        en_wn = wn.Wordnet("oewn:2024")
    except wn.Error:
        raise SystemExit(
            "Open English WordNet not found.\n"
            "Run: ./download.sh wordnet  (or: WN_DATA=.cache/wn_data python -c \"import wn; wn.download('oewn:2024')\")"
        )

    rows: list[WordRow] = []
    seen: set[tuple[str, str]] = set()   # (lemma, synset.id()) for dedup within run

    for synset in en_wn.synsets():
        pos_char = synset.pos or ""
        pos = _wn_pos(pos_char)
        definition = synset.definition() or ""
        examples = synset.examples() or []
        synset_id = synset.id

        for word in synset.words():
            lemma = word.lemma().lower().strip()
            if not lemma:
                continue
            key = (lemma, synset_id)
            if key in seen:
                continue
            seen.add(key)

            rank = corpus_freq_rank(lemma, "en")

            meanings: list[tuple[str, str, int]] = []
            if definition:
                meanings.append(("en", definition, 0))

            example_rows: list[tuple[str, dict, str]] = [
                (ex, {}, "") for ex in examples if ex.strip()
            ]

            rows.append(
                WordRow(
                    language="en",
                    lemma=lemma,
                    reading="",
                    pos=pos,
                    ipa="",
                    frequency_rank=rank,
                    level="",
                    extra={"synset_id": synset_id, "pos_char": pos_char},
                    source="oewn",
                    source_id=f"{synset_id}:{lemma}"[:255],  # cap length
                    meanings=meanings,
                    examples=example_rows,
                )
            )

    print(f"wordnet: parsed {len(rows)} (lemma, synset) pairs from {len(seen)} unique keys")
    return rows


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Import Open English WordNet 2024 into vocabulary-service"
    )
    parser.add_argument(
        "--wn-data",
        type=Path,
        default=CACHE_DIR / "wn_data",
        help="Path where wn library stores its SQLite data (default: .cache/wn_data)",
    )
    parser.add_argument("--dry-run", action="store_true", help="Parse only, skip DB insert")
    args = parser.parse_args()

    os.environ["WN_DATA"] = str(args.wn_data)

    rows = parse_wordnet()
    if not args.dry_run:
        run_import(rows)
    else:
        print("wordnet: dry-run; skipping DB insert")


if __name__ == "__main__":
    main()
