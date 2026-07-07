# Report Templates

Paths below are for **hw-analytics-reports** (repo root). Private mirror: prefix with `reports/`.

## Shared kit (all report types)

```html
<link rel="stylesheet" href="kit/report.css">
<script>(function(){try{var t=localStorage.getItem('hw-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
<script src="kit/theme.js"></script>
<script src="kit/icons.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"></script>
<script src="kit/charts.js"></script>
<script src="kit/report.js"></script>
```

## AB / experiment

**Reference:** `wicket_chance_ab_clean_fix.html`  
**Scripts:** `kit/ab-test.js` → `HWReport.initAbTest(DD, opts)`

## Creating a new report

1. Slug: `{slug}.html` at repo root
2. Copy structure from closest template
3. Archive GChat at `handoffs/{slug}.txt` — `Dashboard: https://saivenkatesh007.github.io/hw-analytics-reports/{slug}.html`
4. Agent writes `data/{slug}.json`
5. Agent runs:
   ```bash
   python3 kit/build_catalog.py --sync
   python3 kit/build_catalog.py
   python3 kit/validate_report.py data/{slug}.json   # AB only
   ```
6. User says **"publish the report"** — agent runs publish skill

Whale MM (no data JSON): edit `catalog.json`, then `python3 kit/build_catalog.py` only.

## Report Export (notebook cell — optional on VM)

Same as before; agent writes JSON directly to `data/{slug}.json` in the public repo clone.
