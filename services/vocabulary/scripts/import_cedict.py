from __future__ import annotations

import argparse
import re
from pathlib import Path

from common import CACHE_DIR, WordRow, corpus_freq_rank, load_frequency_file, normalize_pos, run_import


CEDICT_LINE = re.compile(r"^(?P<trad>\S+)\s+(?P<simp>\S+)\s+\[(?P<pinyin>[^\]]+)\]\s+/(?P<defs>.*)/$")


def parse_cedict(path: Path) -> list[WordRow]:
    # HSK file is used for level tagging only (hsk1, hsk6, etc.)
    hsk_levels = load_frequency_file(CACHE_DIR / "hsk.tsv")
    rows: list[WordRow] = []
    with path.open("r", encoding="utf-8") as fh:
        for line_no, line in enumerate(fh, start=1):
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            match = CEDICT_LINE.match(line)
            if not match:
                continue
            simp = match.group("simp")

            # Frequency rank from real corpus data (wordfreq)
            rank = corpus_freq_rank(simp, "zh")
            # Level from HSK list (if available)
            _, level = hsk_levels.get(simp, (0, ""))

            meanings = [
                ("en", meaning.strip(), idx)
                for idx, meaning in enumerate(match.group("defs").split("/"))
                if meaning.strip()
            ]
            rows.append(
                WordRow(
                    language="zh",
                    lemma=simp,
                    reading=match.group("pinyin"),
                    pos=normalize_pos(""),
                    frequency_rank=rank,
                    level=level,
                    extra={"trad": match.group("trad"), "simp": simp, "line": line_no},
                    source="cc_cedict",
                    source_id=f"{match.group('trad')}|{simp}|{line_no}",
                    meanings=meanings,
                )
            )
    return rows


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--path", type=Path, default=CACHE_DIR / "cedict.txt")
    parser.add_argument("--skip-missing", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if not args.path.exists():
        if args.skip_missing:
            print(f"cedict: {args.path} missing, skipping")
            return
        raise SystemExit(f"missing {args.path}; run ./download.sh cedict")

    rows = parse_cedict(args.path)
    print(f"cedict: parsed {len(rows)} rows")
    if not args.dry_run:
        run_import(rows)


if __name__ == "__main__":
    main()
