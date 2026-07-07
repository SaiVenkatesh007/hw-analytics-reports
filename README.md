# Hitwicket Analytics — Stakeholder Reports

Interactive analysis reads for Hitwicket Superstars stakeholders.

**Browse live:** https://saivenkatesh007.github.io/hw-analytics-reports/

## Canonical repo

**This repository (`hw-analytics-reports`) is the source of truth.**  
All report work happens here via branch + PR. GitHub Pages deploys from `main`.

The private [Hitwicket-Analytics](https://github.com/SaiVenkatesh007/Hitwicket-Analytics) repo holds notebooks only; `reports/` there is an optional mirror (may lag).

## Quick start (analysts)

1. Clone this repo → open in Cursor
2. `gh auth login` once
3. `bash kit/scripts/check_publish_env.sh`
4. Read [docs/TEAM_WORKFLOW.md](docs/TEAM_WORKFLOW.md)

**Cursor phrases:** *"Build stakeholder report for {slug}"* → *"Publish the report"*

## Design system

- [kit/styleguide.html](kit/styleguide.html) — living reference
- Agent skills in `.cursor/skills/`

## Index

Driven by [`catalog.json`](catalog.json), synced from `data/*.json` meta via `kit/build_catalog.py --sync`.

## Owner migration

First-time setup after workflow change: [docs/MIGRATION_OWNER.md](docs/MIGRATION_OWNER.md)

trying small edit
