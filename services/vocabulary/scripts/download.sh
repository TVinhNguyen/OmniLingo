#!/usr/bin/env bash
set -euo pipefail

mkdir -p .cache

case "${1:-}" in
  jmdict)
    curl -L "http://ftp.edrdg.org/pub/Nihongo/JMdict_e.gz" -o ".cache/jmdict_e.xml.gz"
    gzip -dkf ".cache/jmdict_e.xml.gz"
    ;;
  cedict)
    curl -L "https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.zip" -o ".cache/cedict.zip"
    python3 -m zipfile -e ".cache/cedict.zip" ".cache"
    find ".cache" -name "cedict*.u8" -exec mv {} ".cache/cedict.txt" \;
    ;;
  wordnet)
    # Download Open English WordNet 2024 via wn Python library (~30MB)
    # wn stores its SQLite in ~/.wn_data by default; we export the path via WN_DATA
    # so the DB lands in .cache/ for portability.
    WN_DATA="$(pwd)/.cache/wn_data" python3 - <<'PYEOF'
import os, sys
os.environ.setdefault("WN_DATA", os.path.join(os.getcwd(), ".cache", "wn_data"))
try:
    import wn
except ImportError:
    print("ERROR: wn not installed. Run: pip install wn>=0.9", file=sys.stderr)
    sys.exit(1)
print("Downloading Open English WordNet 2024 (first run ~30 MB)...")
wn.download("oewn:2024")
print("Done. WordNet data stored in .cache/wn_data/")
PYEOF
    ;;
  *)
    echo "usage: $0 {jmdict|cedict|wordnet}" >&2
    exit 2
    ;;
esac
