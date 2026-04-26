from __future__ import annotations

import argparse
from pathlib import Path

from common import CACHE_DIR, WordRow, corpus_freq_rank, load_frequency_file, normalize_pos, run_import


def text_values(node, xpath: str) -> list[str]:
    return [str(v).strip() for v in node.xpath(xpath) if str(v).strip()]


def parse_jmdict(path: Path) -> list[WordRow]:
    from lxml import etree

    # JLPT file is used for level tagging only (jlpt_n5, jlpt_n1, etc.)
    jlpt_levels = load_frequency_file(CACHE_DIR / "jlpt.tsv")
    rows: list[WordRow] = []
    context = etree.iterparse(str(path), events=("end",), tag="entry", recover=True)
    for _, entry in context:
        source_ids = text_values(entry, "ent_seq/text()")
        source_id = source_ids[0] if source_ids else str(len(rows) + 1)
        kanji = text_values(entry, "k_ele/keb/text()")
        kana = text_values(entry, "r_ele/reb/text()")
        lemma = kanji[0] if kanji else (kana[0] if kana else "")
        if not lemma:
            entry.clear()
            continue
        pos_tags = text_values(entry, "sense/pos/text()")
        glosses = text_values(entry, "sense/gloss/text()")
        pri_tags = text_values(entry, "k_ele/ke_pri/text() | r_ele/re_pri/text()")

        # Frequency rank from real corpus data (wordfreq)
        rank = corpus_freq_rank(lemma, "ja")
        # Level from JLPT list (if available)
        _, level = jlpt_levels.get(lemma, (0, ""))

        pos = normalize_pos(pos_tags)
        # ix_words_source_dedup requires UNIQUE(source, source_id).
        # A single JMdict entry can produce multiple POS rows (e.g. ない=verb+adj),
        # so we append the normalized POS to keep source_id unique per row.
        dedup_id = f"{source_id}:{pos}" if pos else source_id

        rows.append(
            WordRow(
                language="ja",
                lemma=lemma,
                reading=kana[0] if kana else "",
                pos=pos,
                frequency_rank=rank,
                level=level,
                extra={"kanji_alt": kanji[1:], "kana_alt": kana[1:], "priority": pri_tags},
                source="jmdict",
                source_id=dedup_id,
                meanings=[("en", gloss, idx) for idx, gloss in enumerate(glosses)],
            )
        )
        entry.clear()
    return rows


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--path", type=Path, default=CACHE_DIR / "jmdict_e.xml")
    parser.add_argument("--skip-missing", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if not args.path.exists():
        if args.skip_missing:
            print(f"jmdict: {args.path} missing, skipping")
            return
        raise SystemExit(f"missing {args.path}; run ./download.sh jmdict")

    rows = parse_jmdict(args.path)
    print(f"jmdict: parsed {len(rows)} rows")
    if not args.dry_run:
        run_import(rows)


if __name__ == "__main__":
    main()
