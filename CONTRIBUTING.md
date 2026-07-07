# Contributing — hw-analytics-reports

This is the **canonical** repo for Hitwicket stakeholder HTML reports.

## Workflow

1. Branch from `main`: `report/{slug}` or `update/{slug}`
2. Agent or author updates `data/`, `{slug}.html`, `handoffs/`, `catalog.json`
3. Run validation locally:
   ```bash
   python3 kit/build_catalog.py --sync
   python3 kit/build_catalog.py
   python3 kit/validate_report.py data/{slug}.json   # AB reports
   ```
4. Preview: `python3 -m http.server 8765`
5. Open PR → **validate-reports** CI must pass
6. Merge → GitHub Pages deploys automatically

Or say **"Publish the report"** in Cursor — agent runs `kit/scripts/git_publish.sh`.

## Branch naming

| Pattern | Use |
|---------|-----|
| `report/{slug}` | New report |
| `update/{slug}` | Refresh numbers on existing report |
| `kit/{desc}` | Design system / shared kit (owner review) |

## Paths

Repo root = site root. No `reports/` prefix:

```
kit/           shared CSS/JS
data/          metrics JSON
handoffs/      GChat archives
{slug}.html    report pages
catalog.json   index metadata
```

## Kit changes

PRs touching `kit/`, `.cursor/`, or `.github/` require owner approval (`CODEOWNERS`).

See [docs/TEAM_WORKFLOW.md](docs/TEAM_WORKFLOW.md) for analyst onboarding.
