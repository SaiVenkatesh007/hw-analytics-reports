#!/usr/bin/env bash
# Verify git + gh + repo remote before agent-driven publish.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

FAIL=0
ok() { echo "  OK  $1"; }
bad() { echo "  FAIL $1"; FAIL=1; }

echo "Hitwicket report publish environment"
echo "Repo root: $ROOT"
echo ""

command -v git >/dev/null 2>&1 && ok "git installed" || bad "git not found — install Xcode CLT or git"

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  ok "inside git repository"
else
  bad "not a git repository — clone hw-analytics-reports"
fi

ORIGIN="$(git remote get-url origin 2>/dev/null || true)"
if echo "$ORIGIN" | grep -qi 'hw-analytics-reports'; then
  ok "origin is hw-analytics-reports ($ORIGIN)"
else
  bad "origin should be hw-analytics-reports (got: ${ORIGIN:-none})"
fi

command -v python3 >/dev/null 2>&1 && ok "python3 installed" || bad "python3 not found"

command -v gh >/dev/null 2>&1 && ok "gh CLI installed" || bad "gh not found — brew install gh && gh auth login"

if command -v gh >/dev/null 2>&1; then
  if gh auth status >/dev/null 2>&1; then
    ok "gh authenticated"
  else
    bad "gh not authenticated — run: gh auth login"
  fi
fi

BRANCH="$(git branch --show-current 2>/dev/null || true)"
if [ "$BRANCH" = "main" ] && [ "${1:-}" = "--publish" ]; then
  bad "on main branch — publish must run from report/* branch (agent creates one)"
elif [ "$BRANCH" = "main" ]; then
  echo "  note on main (OK for setup check; use report/* branch to publish)"
else
  ok "branch: ${BRANCH:-unknown}"
fi

if [ -f kit/build_catalog.py ]; then
  ok "kit/build_catalog.py present"
else
  bad "kit/build_catalog.py missing — wrong directory?"
fi

echo ""
if [ "$FAIL" -eq 0 ]; then
  echo "All checks passed."
  exit 0
fi
echo "Fix failures above before publishing."
exit 1
