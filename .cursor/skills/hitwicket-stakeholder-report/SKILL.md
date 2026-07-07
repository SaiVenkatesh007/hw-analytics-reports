---
name: hitwicket-stakeholder-report
description: >-
  Turn finalized Hitwicket notebook analysis into self-contained HTML stakeholder
  reports for GitHub Pages. Use when the user asks for a report, stakeholder
  read, GChat handoff, GitHub Pages publish, or after a data read is agreed.
  Archives handoffs with live Dashboard URL. After writing data/{slug}.json,
  agent runs build_catalog.py --sync and validate. Publish via hitwicket-report-publish skill.
---

# Hitwicket Stakeholder HTML Report

## When to use

- User says: "make the stakeholder report", "build the HTML read", "publish to GitHub Pages", "we're done with the analysis — report it"
- GChat handoff is agreed and notebook has final `display()` tables
- **Not** for in-session exploration — use Cursor Canvas during analysis; HTML for shareable stakeholder links

## Which repo am I in?

| Clone | Paths | Publish? |
|-------|-------|----------|
| **hw-analytics-reports** (canonical) | `kit/`, `data/`, `{slug}.html` at repo root | Yes — PR workflow |
| **Hitwicket-Analytics** (private mirror) | Same files under `reports/` prefix | **No** — mirror only; open public clone for publish |

Public site: https://saivenkatesh007.github.io/hw-analytics-reports/

## Workflow

```
Notebook (VM) → GChat handoff agreed
  → open hw-analytics-reports in Cursor
  → agent writes data/{slug}.json, {slug}.html, handoffs/{slug}.txt
  → agent runs kit/build_catalog.py --sync + validate
  → user says "publish the report" → hitwicket-report-publish skill
  → PR merged on public main → Pages deploys
```

1. **Confirm readiness** — GChat handoff agreed (user pastes it); notebook outputs final
2. **Slug** — `snake_case`, descriptive, matches filename stem (e.g. `wicket_chance_ab_clean_fix`, `pvp_mm_phase1_baseline`). Never kebab-case.
3. **Archive handoff** — save to `handoffs/{slug}.txt`; Dashboard URL: `https://saivenkatesh007.github.io/hw-analytics-reports/{slug}.html` ([gchat-handoff.md](gchat-handoff.md))
4. **Write data JSON** — agent creates/updates `data/{slug}.json` from notebook outputs ([templates.md](templates.md))
5. **Pick template** — AB → `kit/ab-test.js`; whale MM → `kit/whale-mm.js`; other → shared shell
6. **Build report** — map GChat → HTML; embed `const DD = {...}` from JSON (AB: `dd` object; dashboard: all keys except `meta`)
7. **Sync catalog (agent runs)**:
   ```bash
   python3 kit/build_catalog.py --sync
   python3 kit/validate_report.py data/{slug}.json
   python3 kit/check_html_data.py data/{slug}.json {slug}.html
   ```
   Whale MM / no JSON: edit `catalog.json` manually, then `python3 kit/build_catalog.py` only
8. **Publish (agent-driven)** — user says **"publish the report"** → follow [hitwicket-report-publish](../hitwicket-report-publish/SKILL.md). Do not ask user to run git.

## Importing old reports

Drop legacy materials in **`incoming/{slug}/`** (not in catalog until refactored):

```
incoming/{slug}/
  handoff.txt
  report.html
  notes.txt
```

## File layout (public repo root)

| Path | Purpose |
|------|---------|
| `kit/report.css` | Shared design system |
| `kit/theme.js` | Dark mode, `getChartTheme()` |
| `kit/charts.js` | Chart.js helpers |
| `kit/report.js` | Tabs, chrome, a11y |
| `kit/ab-test.js` | AB experiment builders |
| `kit/whale-mm.js` | Whale MM multi-view |
| `kit/build_catalog.py` | Catalog validate + `--sync` |
| `kit/validate_report.py` | JSON schema validation |
| `kit/check_html_data.py` | HTML `const DD` vs JSON consistency |
| `kit/chart.umd.js` | Vendored Chart.js (offline-safe) |
| `kit/update_handoff_links.py` | Legacy bulk Dashboard URL repair — not normal workflow |
| `kit/scripts/git_publish.sh` | Agent publish wrapper |
| `data/{slug}.json` | Metrics export |
| `{slug}.html` | Report page |
| `handoffs/{slug}.txt` | GChat archive |
| `catalog.json` | Index metadata |

Private mirror equivalent: prefix paths with `reports/`.

## Non-negotiables

- Numbers must match notebook — no invented metrics
- Use `rank_map_ver_2` / domain labels from domain knowledge
- One recommendation in hero thesis
- Agent runs catalog sync + validate — never leave as user step

## Checklist before handoff

- [ ] GChat handoff at `handoffs/{slug}.txt` with full Dashboard URL
- [ ] Headline numbers trace to notebook or `data/{slug}.json`
- [ ] Agent ran `build_catalog.py --sync` + `validate_report.py` + `check_html_data.py` — exit 0
- [ ] PR opened on **hw-analytics-reports** (or user said publish and agent opened PR)
- [ ] CI green on PR before merge

## Publish (agent-driven)

After build + user approves numbers:

1. Invoke **hitwicket-report-publish** skill
2. User says **"publish the report"**
3. Return PR link; after merge remind user to paste `handoffs/{slug}.txt` in GChat

## Additional resources

- Design system: [hitwicket-report-design-system](../hitwicket-report-design-system/SKILL.md)
- GChat format: [gchat-handoff.md](gchat-handoff.md)
- Templates: [templates.md](templates.md)
- Hosting: [hosting.md](hosting.md)
- Examples: [examples.md](examples.md)
- Publish git flow: [hitwicket-report-publish](../hitwicket-report-publish/SKILL.md)
