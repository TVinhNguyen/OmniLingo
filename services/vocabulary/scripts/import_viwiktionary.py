from __future__ import annotations

import argparse
import bz2
import re
from pathlib import Path
from xml.etree.ElementTree import iterparse

from common import CACHE_DIR, WordRow, run_import


NS_RE = re.compile(r"^\{.*\}")
IPA_RE = re.compile(r"\{\{IPA\|([^}|]+)")
LANG_RE = re.compile(r"^==\s*(?P<name>[^=]+?)\s*==\s*$", re.MULTILINE)


def strip_ns(tag: str) -> str:
    return NS_RE.sub("", tag)


def definition_lines(text: str) -> list[str]:
    out: list[str] = []
    for line in text.splitlines():
        if line.startswith("# ") and not line.startswith("#:"):
            clean = re.sub(r"\{\{[^{}]*\}\}", "", line[2:]).strip()
            clean = clean.replace("[[", "").replace("]]", "")
            if clean:
                out.append(clean)
    return out


def section_for_language(text: str, language_name: str) -> str:
    matches = list(LANG_RE.finditer(text))
    for idx, match in enumerate(matches):
        if match.group("name").strip().lower() != language_name.lower():
            continue
        end = matches[idx + 1].start() if idx + 1 < len(matches) else len(text)
        return text[match.end() : end]
    return ""


def parse_viwiktionary(path: Path) -> list[WordRow]:
    opener = bz2.open if path.suffix == ".bz2" else open
    rows: list[WordRow] = []
    with opener(path, "rb") as fh:
        for _, page in iterparse(fh, events=("end",)):
            if strip_ns(page.tag) != "page":
                continue
            title = ""
            text = ""
            for child in page.iter():
                tag = strip_ns(child.tag)
                if tag == "title":
                    title = child.text or ""
                elif tag == "text":
                    text = child.text or ""
            section = section_for_language(text, "Tiếng Việt")
            defs = definition_lines(section)
            if title and defs:
                ipa_match = IPA_RE.search(section)
                rows.append(
                    WordRow(
                        language="vi",
                        lemma=title,
                        ipa=ipa_match.group(1) if ipa_match else "",
                        source="viwiktionary",
                        source_id=title,
                        meanings=[("vi", meaning, idx) for idx, meaning in enumerate(defs)],
                    )
                )
            page.clear()
    return rows


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--path", type=Path, default=CACHE_DIR / "viwiktionary.xml")
    parser.add_argument("--skip-missing", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if not args.path.exists():
        bz2_path = args.path.with_suffix(args.path.suffix + ".bz2")
        if bz2_path.exists():
            args.path = bz2_path
        elif args.skip_missing:
            print(f"viwiktionary: {args.path} missing, skipping")
            return
        else:
            raise SystemExit(f"missing {args.path}; run ./download.sh viwiktionary")

    rows = parse_viwiktionary(args.path)
    print(f"viwiktionary: parsed {len(rows)} rows")
    if not args.dry_run:
        run_import(rows)


if __name__ == "__main__":
    main()
