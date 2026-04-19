#!/usr/bin/env python3
"""Generate a fresh 600-word import set from live crawl data (7ESL).

- Crawls current vocabulary category pages and article pages
- Extracts tokens from headings + list items + short paragraphs
- Produces DB-importable CSV + SQL for `words` table

This is a *fresh* crawl dataset (run-time generated), not a static corpus.
"""

from __future__ import annotations

import csv
import json
import re
import time
from collections import Counter
from pathlib import Path
from urllib.parse import urljoin

from scrapling.fetchers import FetcherSession

BASE = "https://7esl.com/vocabulary/"
OUT_DIR = Path(__file__).resolve().parent / "out"
OUT_CSV = OUT_DIR / "essential_600_live_7esl.csv"
OUT_SQL = OUT_DIR / "essential_600_live_7esl.sql"

TOKEN_RE = re.compile(r"[a-z]{2,}")
STOP = {
  "a", "an", "the", "to", "of", "in", "is", "it", "on", "at", "by", "be", "as", "or", "if",
  "do", "does", "did", "done", "doing", "am", "been", "being", "i", "me", "my", "mine", "we",
  "us", "he", "him", "his", "she", "her", "hers", "they", "them", "theirs", "themself", "themselves",
  "myself", "yourself", "ourselves", "himself", "herself", "up", "down", "out", "off", "so",
  "no", "yes", "too", "via", "per", "vs", "etc",
  "the", "and", "for", "with", "that", "this", "from", "are", "you", "your", "into", "have",
  "has", "had", "was", "were", "will", "can", "not", "but", "all", "any", "our", "their", "about",
  "what", "when", "where", "which", "who", "how", "why", "its", "than", "then", "also", "more",
  "most", "some", "such", "use", "used", "using", "under", "over", "after", "before", "each",
  "between", "through", "these", "those", "english", "learn", "learning", "example", "examples",
  "difference", "differences", "understanding", "main", "guide", "list", "lists", "terms", "word",
  "words", "vocabulary", "mean", "means", "meaning", "meanings", "very", "much", "many", "often",
  "make", "made", "like", "just", "only", "even", "one", "two", "three", "first", "second",
}


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


def tokenize(text: str) -> list[str]:
  toks = [t.lower() for t in TOKEN_RE.findall(text.lower())]
  return [t for t in toks if t not in STOP and len(t) <= 24]


def main() -> None:
  OUT_DIR.mkdir(parents=True, exist_ok=True)
  started_at = int(time.time())

  article_urls: list[str] = []
  seen_pages = set()
  queue = [BASE]

  with FetcherSession(impersonate="chrome") as s:
    # collect category pages (up to 40 pages)
    while queue and len(seen_pages) < 40:
      page_url = queue.pop(0)
      if page_url in seen_pages:
        continue
      page = s.get(page_url, stealthy_headers=True)
      seen_pages.add(page_url)

      links = page.css("main a::attr(href)").getall()
      for href in links:
        full = urljoin(page_url, href)
        if not full.startswith("https://7esl.com/"):
          continue
        if "/category/" in full:
          continue
        if any(x in full for x in ["/tag/", "/author/", "/about", "/contact", "/privacy", "/terms"]):
          continue
        if full.count("/") < 3:
          continue
        article_urls.append(full)

      nexts = page.css("a.next.page-numbers::attr(href)").getall()
      for href in nexts:
        full = urljoin(page_url, href)
        if full not in seen_pages:
          queue.append(full)

    article_urls = list(dict.fromkeys(article_urls))[:320]

    token_counter: Counter[str] = Counter()
    for u in article_urls:
      p = s.get(u, stealthy_headers=True)
      chunks: list[str] = []
      chunks.extend([x for x in p.css("h1::text").getall() if x])
      chunks.extend([x for x in p.css("main li::text").getall() if x])
      chunks.extend([x for x in p.css("main p::text").getall()[:15] if x])
      text_blob = "\n".join(chunks)
      token_counter.update(tokenize(text_blob))

  # choose top 600 tokens from live crawl
  top = [w for w, _ in token_counter.most_common(1200)]
  rows = []
  for idx, lemma in enumerate(top, start=1):
    rows.append(
      {
        "language": "en",
        "lemma": lemma,
        "pos": "",
        "ipa": "",
        "frequency_rank": idx,
        "level": level_from_rank(idx),
        "extra": {
          "source": "7esl_live_crawl",
          "source_url": "https://7esl.com/vocabulary/",
          "source_license": "verify_terms_before_production",
          "dataset": "live crawl token frequency",
          "crawled_at": started_at,
        },
      }
    )

  dedup = []
  seen = set()
  for r in rows:
    k = (r["language"], r["lemma"], r["pos"])
    if k in seen:
      continue
    seen.add(k)
    dedup.append(r)
    if len(dedup) == 600:
      break

  if len(dedup) < 600:
    raise RuntimeError(f"Only collected {len(dedup)} words; increase crawl scope")

  with OUT_CSV.open("w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(
      f,
      fieldnames=["language", "lemma", "pos", "ipa", "frequency_rank", "level", "extra"],
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
    f.write("-- Fresh 600-word seed from live 7ESL crawl\n")
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

  print(f"Generated {len(dedup)} words")
  print(f"CSV: {OUT_CSV}")
  print(f"SQL: {OUT_SQL}")


if __name__ == "__main__":
  main()
