#!/usr/bin/env bash
# Agent-driven report publish: branch, validate, commit, push, optional PR/merge.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

SLUG=""
MODE="pr"
MESSAGE=""

usage() {
  echo "Usage: git_publish.sh --slug SLUG [--mode pr|merge|branch-only] [--message MSG]"
  exit 1
}

while [ $# -gt 0 ]; do
  case "$1" in
    --slug) SLUG="$2"; shift 2 ;;
    --mode) MODE="$2"; shift 2 ;;
    --message) MESSAGE="$2"; shift 2 ;;
    -h|--help) usage ;;
    *) echo "Unknown arg: $1"; usage ;;
  esac
done

[ -n "$SLUG" ] || usage

bash kit/scripts/check_publish_env.sh

for f in "data/${SLUG}.json" "${SLUG}.html" "handoffs/${SLUG}.txt"; do
  if [ ! -f "$f" ]; then
    echo "Missing required file: $f"
    exit 1
  fi
done

BRANCH="report/${SLUG}"
CURRENT="$(git branch --show-current)"

if [ "$CURRENT" = "main" ]; then
  git fetch origin
  git pull --ff-only origin main
  git checkout -b "$BRANCH"
elif [ "$CURRENT" = "$BRANCH" ]; then
  :
else
  echo "Expected main or $BRANCH; currently on $CURRENT"
  exit 1
fi

bash kit/scripts/check_publish_env.sh --publish

python3 kit/build_catalog.py --sync
if [ -f "data/${SLUG}.json" ]; then
  python3 kit/validate_report.py "data/${SLUG}.json"
  python3 kit/check_html_data.py "data/${SLUG}.json" "${SLUG}.html"
fi

git add "data/${SLUG}.json" "${SLUG}.html" "handoffs/${SLUG}.txt" catalog.json

if git diff --staged --quiet; then
  echo "No staged changes for $SLUG"
else
  if [ -z "$MESSAGE" ]; then
    if git log -1 --oneline 2>/dev/null | grep -q "$SLUG"; then
      MESSAGE="Update ${SLUG} stakeholder report"
    else
      MESSAGE="Add ${SLUG} stakeholder report"
    fi
  fi
  git commit -m "$MESSAGE"
fi

git push -u origin HEAD

PR_URL=""
if [ "$MODE" = "pr" ] || [ "$MODE" = "merge" ]; then
  EXISTING="$(gh pr view --head "$BRANCH" --json url -q .url 2>/dev/null || true)"
  if [ -n "$EXISTING" ]; then
    PR_URL="$EXISTING"
    echo "PR already open: $PR_URL"
  else
    PR_URL="$(gh pr create --title "${SLUG}: stakeholder report" --body "Automated publish via kit/scripts/git_publish.sh")"
    echo "Created PR: $PR_URL"
  fi
  echo "Waiting for CI..."
  if ! gh pr checks --watch --fail-fast; then
    echo "CI failed — PR left open; merge aborted"
    exit 1
  fi
fi

if [ "$MODE" = "merge" ]; then
  gh pr merge --squash --delete-branch
  echo "Merged and deleted branch $BRANCH"
  git checkout main
  git pull --ff-only origin main
fi

echo "PR_URL=${PR_URL:-none}"
echo "Dashboard=https://saivenkatesh007.github.io/hw-analytics-reports/${SLUG}.html"
