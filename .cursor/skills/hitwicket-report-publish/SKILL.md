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

```bash
bash kit/scripts/check_publish_env.sh --publish
```

Fix any FAIL before continuing. User must have run `gh auth login` once.

## Repo context

- Work in **hw-analytics-reports** clone (repo root = site root)
- Paths: `data/{slug}.json`, `{slug}.html`, `handoffs/{slug}.txt`, `catalog.json`
- Never publish from private `Hitwicket-Analytics/reports/` mirror

## Publish pipeline (run in order)

1. `git fetch origin`
2. If on `main`: `git pull --ff-only origin main` then `git checkout -b report/{slug}`
3. If already on `report/{slug}`: continue
4. `python3 kit/build_catalog.py --sync && python3 kit/build_catalog.py`
5. `python3 kit/validate_report.py data/{slug}.json` if AB JSON exists
6. Stage **only**: `data/{slug}.json`, `{slug}.html`, `handoffs/{slug}.txt`, `catalog.json`
7. Commit with message `Add {slug} stakeholder report` or `Update {slug} stakeholder report`
8. `git push -u origin HEAD`
9. `gh pr create` (or use existing PR if branch already has one)
10. `gh pr checks --watch` — wait for **validate-reports**
11. Return PR URL to user

**Shortcut:** `bash kit/scripts/git_publish.sh --slug {slug} --mode pr`

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
- Wrong repo → user must open `hw-analytics-reports` clone in Cursor

## Private mirror (owner only)

On `Hitwicket-Analytics`, user says **"sync reports from public"**:

```bash
gh workflow run sync-reports-from-public.yml --repo SaiVenkatesh007/Hitwicket-Analytics
```

Merge the bot PR when ready.
