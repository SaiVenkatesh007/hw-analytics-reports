---
name: hitwicket-report-publish
description: >-
  Agent-driven git publish for hw-analytics-reports. Use when the user says
  publish the report, push the report, open PR, ship it, or merge and ship.
  Runs check_publish_env, pull main, branch, commit, push, gh pr create,
  optional squash merge for owner only.
---

# Hitwicket Report Publish (agent-driven Git)

## When to use

- User says: **"publish the report"**, **"push the report"**, **"open PR"**, **"ship it"**
- **"merge and ship"** — only after CI green AND user is repo owner (Venkatesh)

Do **not** ask the user to run git commands manually.

## Prerequisites

User must have run `gh auth login` once. `git_publish.sh` runs env checks automatically (branches from `main` first).

## Repo context

- Work in **hw-analytics-reports** clone (repo root = site root)
- Paths: `data/{slug}.json`, `{slug}.html`, `handoffs/{slug}.txt`, `catalog.json`
- Never publish from private `Hitwicket-Analytics/reports/` mirror

## Publish pipeline

**Shortcut (preferred):** `bash kit/scripts/git_publish.sh --slug {slug} --mode pr`

Script order internally:
1. `check_publish_env.sh` (no `--publish` on `main`)
2. Branch `report/{slug}` from `main` if needed
3. `check_publish_env.sh --publish`
4. `build_catalog.py --sync`, `validate_report.py`, `check_html_data.py`
5. Commit slug files + `catalog.json`, push, open PR
6. Wait for CI — **abort on failure** (merge mode will not merge if CI red)

## Merge policy

| User | On "merge and ship" |
|------|---------------------|
| Owner (Venkatesh) | `bash kit/scripts/git_publish.sh --slug {slug} --mode merge` after CI green |
| Analysts | **Stop at PR URL** — tell them Venkatesh will merge |

## Security guardrails

- **Never** `git push origin main`
- **Never** `git push --force` on shared branches
- **Never** `git add -A` — only report files listed above
- **Never** commit `.env`, tokens, credentials
- **Never** merge without explicit **"merge and ship"**

## On failure

- Push rejected → `git pull --rebase origin main`, fix conflicts, push again
- CI failed → `gh pr checks`, `gh run view`, fix files, push to same branch
- Wrong repo → open `hw-analytics-reports` clone in Cursor

## Private mirror (owner only)

On `Hitwicket-Analytics`, user says **"sync reports from public"**:

```bash
gh workflow run sync-reports-from-public.yml --repo SaiVenkatesh007/Hitwicket-Analytics
```

Merge the bot PR when ready.
