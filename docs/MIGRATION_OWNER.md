# Migration checklist (repo owner)

Complete **once** before teammates use the new PR workflow.

## 1. Bootstrap public repo with this commit

After merging these changes to private `Hitwicket-Analytics` `main`:

1. Actions → **Publish Reports** → **Run workflow** (manual dispatch) **one last time**  
   This copies `reports/` (including `.github/`, `.cursor/`, `docs/`) to `hw-analytics-reports`.
2. Open https://saivenkatesh007.github.io/hw-analytics-reports/ — confirm index + one report load.

## 2. Switch Pages to GitHub Actions (public repo)

`hw-analytics-reports` → Settings → Pages → Source: **GitHub Actions**

After the next push to public `main`, **Deploy GitHub Pages** workflow owns deploys.

## 3. Branch protection (public repo)

`main` branch rule:

- Require pull request
- Require status check: **validate-reports**
- No direct pushes

## 4. Collaborators

Add analysts with **Write** on `hw-analytics-reports` only.

## 5. Retire private rsync

Private **Publish Reports** no longer runs on push (workflow_dispatch only for emergencies).  
Live site updates **only** from public `main` merges.

## 6. Optional private mirror

Run **Sync Reports from Public** on `Hitwicket-Analytics` when you want `reports/` mirror updated via PR.

## 7. Your local setup

```bash
git clone https://github.com/SaiVenkatesh007/hw-analytics-reports.git
```

Use two Cursor windows: private for notebooks, public clone for reports.

Share [docs/TEAM_WORKFLOW.md](TEAM_WORKFLOW.md) with the team after steps 1–4 are done.
