# Stakeholder Reports Hosting

## Architecture

| Repo | Visibility | Role |
|------|------------|------|
| `SaiVenkatesh007/hw-analytics-reports` | Public | **Canonical** — reports, kit, CI, GitHub Pages |
| `SaiVenkatesh007/Hitwicket-Analytics` | Private | Notebooks + optional `reports/` mirror |

**Public URL:** https://saivenkatesh007.github.io/hw-analytics-reports/

All authors work in **hw-analytics-reports**: branch → PR → merge → Pages deploys from `main`.

Never edit the live site by pushing private `reports/` — the old rsync publish is retired.

---

## Publishing a new report

1. Open **hw-analytics-reports** in Cursor
2. Agent writes `data/{slug}.json`, `{slug}.html`, `handoffs/{slug}.txt`
3. Agent runs `python3 kit/build_catalog.py --sync` + validate
4. User says **"publish the report"** — agent opens PR via `kit/scripts/git_publish.sh`
5. Merge PR → Pages updates in ~1–2 min
6. Share `handoffs/{slug}.txt` in GChat

Analysts: see [docs/TEAM_WORKFLOW.md](../../docs/TEAM_WORKFLOW.md)

---

## GitHub setup (owner, one-time)

See [docs/MIGRATION_OWNER.md](../../docs/MIGRATION_OWNER.md):

1. Bootstrap public repo (final manual rsync from private if needed)
2. Pages source: **GitHub Actions** (`pages.yml`)
3. Branch protection on `main` — require PR + **validate-reports** check
4. Add analyst collaborators (Write access)
5. Disable private rsync push on `Hitwicket-Analytics`

---

## CI workflows (public repo)

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `validate-reports.yml` | PR to `main` | `build_catalog.py` + `validate_report.py` on all `data/*.json` |
| `pages.yml` | Push to `main` | Deploy GitHub Pages |

---

## CODEOWNERS

`kit/`, `.cursor/`, `.github/` require owner review.

---

## Private mirror (optional)

`Hitwicket-Analytics` workflow **Sync Reports from Public**:

- Nightly + manual dispatch
- Opens PR updating `reports/` from public `main`
- Owner merges when local mirror should match

Trigger: `gh workflow run sync-reports-from-public.yml --repo SaiVenkatesh007/Hitwicket-Analytics`

---

## Relative paths

At public repo root:

```html
<link rel="stylesheet" href="kit/report.css">
<script src="kit/report.js"></script>
```

`.nojekyll` at repo root disables Jekyll.

---

## Troubleshooting

**PR CI fails:** Run `python3 kit/build_catalog.py` locally; fix catalog/data mismatch.

**Pages not updating:** Check **Deploy GitHub Pages** workflow on public repo after merge.

**`catalog.json` merge conflict:** On branch, run `python3 kit/build_catalog.py --sync` after resolving `data/` files.

**Agent publish fails:** `bash kit/scripts/check_publish_env.sh` — usually `gh auth login`.

**Wrong repo:** Report work must be in `hw-analytics-reports` clone, not private mirror.
