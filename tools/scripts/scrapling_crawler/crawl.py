#!/usr/bin/env python3
"""Config-driven web crawler using Scrapling.

Features:
- robots.txt compliance (default ON)
- domain allow-list
- list/detail crawling
- field extraction with CSS selectors
- JSONL output per source

Usage:
  python crawl.py --config ./sources.sample.json --out ./out
"""

from __future__ import annotations

import argparse
import json
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from urllib.parse import urljoin, urlparse
from urllib.robotparser import RobotFileParser

from scrapling.fetchers import FetcherSession


@dataclass
class GlobalConfig:
  user_agent: str = "OmniLingoBot/1.0"
  delay_seconds: float = 1.0
  max_pages_per_source: int = 100
  respect_robots_txt: bool = True


def load_config(path: Path) -> tuple[GlobalConfig, list[dict[str, Any]]]:
  raw = json.loads(path.read_text(encoding="utf-8"))
  global_raw = raw.get("global", {})
  cfg = GlobalConfig(
    user_agent=global_raw.get("user_agent", "OmniLingoBot/1.0"),
    delay_seconds=float(global_raw.get("delay_seconds", 1.0)),
    max_pages_per_source=int(global_raw.get("max_pages_per_source", 100)),
    respect_robots_txt=bool(global_raw.get("respect_robots_txt", True)),
  )
  return cfg, list(raw.get("sources", []))


def get_domain(url: str) -> str:
  return urlparse(url).netloc.lower()


def is_allowed_domain(url: str, allowed_domains: list[str]) -> bool:
  if not allowed_domains:
    return True
  domain = get_domain(url)
  return any(domain == d or domain.endswith(f".{d}") for d in allowed_domains)


def robots_can_fetch(url: str, ua: str, cache: dict[str, RobotFileParser]) -> bool:
  p = urlparse(url)
  root = f"{p.scheme}://{p.netloc}"
  if root not in cache:
    rp = RobotFileParser()
    rp.set_url(f"{root}/robots.txt")
    try:
      rp.read()
    except Exception:
      # If robots is unreachable, fail-closed for safety
      return False
    cache[root] = rp
  return cache[root].can_fetch(ua, url)


def normalize_url(base_url: str, maybe_relative: str | None) -> str | None:
  if not maybe_relative:
    return None
  return urljoin(base_url, maybe_relative.strip())


def select_list(page: Any, selector: str) -> list[str]:
  try:
    vals = page.css(selector).getall()
    return [str(v).strip() for v in vals if str(v).strip()]
  except Exception:
    return []


def select_one_text(page: Any, selector: str) -> str | None:
  try:
    return page.css(selector).get(default=None)
  except Exception:
    return None


def select_one_html(page: Any, selector: str) -> str | None:
  try:
    el = page.css(selector)
    if not el:
      return None
    first = el[0]
    return getattr(first, "html", None)
  except Exception:
    return None


def select_one_attr(page: Any, selector: str, attr: str) -> str | None:
  try:
    el = page.css(selector)
    if not el:
      return None
    first = el[0]
    attrib = getattr(first, "attrib", {}) or {}
    val = attrib.get(attr)
    return str(val).strip() if val else None
  except Exception:
    return None


def extract_detail(base_url: str, page: Any, detail_fields: dict[str, Any]) -> dict[str, Any]:
  row: dict[str, Any] = {}
  for key, spec in detail_fields.items():
    field_type = spec.get("type", "text")
    selector = spec.get("selector")

    if field_type == "const":
      row[key] = spec.get("value")
      continue

    if not selector:
      row[key] = None
      continue

    if field_type == "text":
      row[key] = select_one_text(page, selector)
    elif field_type == "html":
      row[key] = select_one_html(page, selector)
    elif field_type == "attr":
      attr = spec.get("attr", "href")
      val = select_one_attr(page, selector, attr)
      if key.endswith("_url") and val:
        val = urljoin(base_url, val)
      row[key] = val
    elif field_type == "list":
      row[key] = select_list(page, selector)
    else:
      row[key] = None
  return row


def crawl_source(
  source: dict[str, Any],
  gcfg: GlobalConfig,
  out_dir: Path,
) -> tuple[int, int]:
  name = source["name"]
  start_urls = list(source.get("start_urls", []))
  if not start_urls:
    return (0, 0)

  allowed_domains = list(source.get("allowed_domains", []))
  item_link_sel = source.get("link_selectors", {}).get("item_links", "")
  next_page_sel = source.get("link_selectors", {}).get("next_pages", "")
  detail_fields = dict(source.get("detail_fields", {}))
  max_pages = int(source.get("max_pages_per_source", gcfg.max_pages_per_source))

  list_queue = list(start_urls)
  seen_pages: set[str] = set()
  item_urls: set[str] = set()
  robots_cache: dict[str, RobotFileParser] = {}

  with FetcherSession(impersonate="chrome") as session:
    # Phase 1: collect item URLs from list pages
    while list_queue and len(seen_pages) < max_pages:
      url = list_queue.pop(0)
      if url in seen_pages:
        continue
      if not is_allowed_domain(url, allowed_domains):
        continue
      if gcfg.respect_robots_txt and not robots_can_fetch(url, gcfg.user_agent, robots_cache):
        continue

      page = session.get(url, stealthy_headers=True)
      seen_pages.add(url)

      if item_link_sel:
        rels = select_list(page, item_link_sel)
        for rel in rels:
          full = normalize_url(url, rel)
          if full and is_allowed_domain(full, allowed_domains):
            item_urls.add(full)

      if next_page_sel:
        nexts = select_list(page, next_page_sel)
        for n in nexts:
          full = normalize_url(url, n)
          if full and full not in seen_pages:
            list_queue.append(full)

      time.sleep(gcfg.delay_seconds)

    # Phase 2: visit each item URL and extract data
    out_file = out_dir / f"{name}.jsonl"
    out_file.parent.mkdir(parents=True, exist_ok=True)

    written = 0
    with out_file.open("w", encoding="utf-8") as f:
      for idx, item_url in enumerate(sorted(item_urls), start=1):
        if idx > max_pages:
          break
        if gcfg.respect_robots_txt and not robots_can_fetch(item_url, gcfg.user_agent, robots_cache):
          continue

        page = session.get(item_url, stealthy_headers=True)
        row = extract_detail(item_url, page, detail_fields)
        row["source_name"] = name
        row["source_url"] = item_url
        row["crawled_at"] = int(time.time())

        f.write(json.dumps(row, ensure_ascii=False) + "\n")
        written += 1
        time.sleep(gcfg.delay_seconds)

  return (len(item_urls), written)


def main() -> None:
  parser = argparse.ArgumentParser(description="Scrapling config-driven crawler")
  parser.add_argument("--config", required=True, help="Path to sources JSON config")
  parser.add_argument("--out", required=True, help="Output directory for JSONL files")
  args = parser.parse_args()

  config_path = Path(args.config).resolve()
  out_dir = Path(args.out).resolve()

  gcfg, sources = load_config(config_path)
  enabled = [s for s in sources if bool(s.get("enabled", True))]

  if not enabled:
    print("No enabled sources in config.")
    return

  print(f"Starting crawl for {len(enabled)} source(s)")

  for src in enabled:
    name = src.get("name", "unnamed")
    try:
      collected, written = crawl_source(src, gcfg, out_dir)
      print(f"[{name}] item_urls={collected} written={written}")
    except Exception as err:
      print(f"[{name}] failed: {err}")


if __name__ == "__main__":
  main()
