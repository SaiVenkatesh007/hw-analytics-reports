# Hitwicket Analytics — Stakeholder Reports

Interactive analysis reads for Hitwicket Superstars stakeholders.

**Browse reports:** [index.html](https://saivenkatesh007.github.io/hw-analytics-reports/)

Handoff archives in `handoffs/` include the live `Dashboard:` URL. Index is driven by [`catalog.json`](catalog.json), synced from `data/*.json` meta by the agent (`build_catalog.py --sync`). **You only push** — agent runs catalog sync/validate before handoff.

This repository is auto-published from the private [Hitwicket-Analytics](https://github.com/SaiVenkatesh007/Hitwicket-Analytics) `reports/` folder. Do not edit files here directly.

## Design system

Shared kit in `kit/`: cricket-grounded palette, dark mode (auto + toggle), scoreboard hero stat, theme-aware Chart.js helpers, accessibility tab roles.

- **Style guide:** [kit/styleguide.html](kit/styleguide.html)
- **Agent skill:** `.cursor/skills/hitwicket-report-design-system/SKILL.md` (private repo only — not published)
