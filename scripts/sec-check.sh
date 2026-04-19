#!/usr/bin/env bash
# scripts/sec-check.sh
# ─────────────────────────────────────────────────────────────────────────────
# CI Security Gate — fail fast if insecure JWT patterns are detected.
# Run this in CI before any build/test step.
#
# Usage:  bash scripts/sec-check.sh [path]
#   path  Root directory to scan (default: services/)
#
# Exit: 0 = clean, 1 = violations found.
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

SCAN_DIR="${1:-services}"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

VIOLATIONS=0

check() {
  local label="$1" pattern="$2" includes="$3"
  # shellcheck disable=SC2086
  local hits
  hits=$(grep -rn --include="$includes" "$pattern" "$SCAN_DIR" 2>/dev/null || true)
  if [[ -n "$hits" ]]; then
    echo -e "${RED}[FAIL]${NC} ${label}"
    echo "$hits" | sed 's/^/       /'
    VIOLATIONS=$((VIOLATIONS + 1))
  fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  OmniLingo Security Gate"
echo "  Scanning: $SCAN_DIR"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ── Go: insecure JWT patterns ─────────────────────────────────────────────────
check "Go: ParseUnverified in middleware"    "ParseUnverified"              "*.go"
check "Go: // simplified JWT"               "// simplified.*JWT"           "*.go"
check "Go: // TODO.*verify"                 "// TODO.*verify"              "*.go"
check "Go: jwt.Parse without key func"      'jwt\.Parse([^,)]+, nil)'      "*.go"
check "Go: AllowOrigin(Any) in non-dev"     'allow_origin\(Any\)'          "*.go"

# ── TypeScript/JavaScript: insecure JWT patterns ──────────────────────────────
check "TS: base64 JWT decode stub"          'Buffer\.from.*parts\[1\].*base64' "*.ts"
check "TS: base64url manual decode"         'base64url.*toString'          "*.ts"
check "TS: console.log in src (not tests)"  'console\.(log|warn|error)'    "*.ts"

# ── Rust: CORS AllowOrigin::Any in non-config context ────────────────────────
check "Rust: allow_origin(Any)"             'allow_origin\(Any\)'          "*.rs"

echo ""
if [[ $VIOLATIONS -eq 0 ]]; then
  echo -e "${GREEN}✅  No security violations found.${NC}"
  exit 0
else
  echo -e "${RED}❌  $VIOLATIONS violation(s) detected. Fix before merging.${NC}"
  exit 1
fi
