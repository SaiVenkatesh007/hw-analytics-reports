# Analyst workflow — stakeholder reports

Canonical repo: **hw-analytics-reports**  
Live site: https://saivenkatesh007.github.io/hw-analytics-reports/

You do **not** need to learn Git. Cursor handles publish when you use the phrases below.

## One-time setup (~5 min)

1. Accept the GitHub collaborator invite.
2. Clone and open in Cursor:
   ```bash
   git clone https://github.com/SaiVenkatesh007/hw-analytics-reports.git
   cd hw-analytics-reports
   ```
3. Authenticate GitHub CLI once:
   ```bash
   brew install gh    # if needed
   gh auth login
   ```
4. Verify environment:
   ```bash
   bash kit/scripts/check_publish_env.sh
   ```

## Per report

| Step | What you do |
|------|-------------|
| 1 | Finish notebook on VM; paste GChat handoff + key tables into Cursor |
| 2 | Say: **"Build stakeholder report for `{slug}`"** |
| 3 | Preview: `python3 -m http.server 8765` → http://localhost:8765/{slug}.html |
| 4 | Say: **"Publish the report"** → agent opens a PR |
| 5 | Venkatesh merges the PR → paste `handoffs/{slug}.txt` in GChat |

## Cursor phrases

- **Build:** *"Build stakeholder report for `{slug}`"*
- **Publish:** *"Publish the report"*
- **Do not say** *"merge and ship"* unless Venkatesh told you to (owner-only)

## Rules

- Never push to `main` directly — always let the agent publish via PR.
- One branch per report (`report/{slug}`) — agent creates this.
- If two people work the same slug, coordinate in chat first.
- Kit/design changes (`kit/`) need owner review — don't edit unless asked.

## Appendix — if something breaks

```bash
git status
git branch
bash kit/scripts/check_publish_env.sh
gh auth status
```

For fork-based contributors: fork the repo, add `upstream` remote, PR from your fork to `SaiVenkatesh007/hw-analytics-reports` `main`.
