---
name: hitwicket-report-design-system
description: >-
  Visual and interaction standards for Hitwicket stakeholder HTML reports.
  Use when styling reports, choosing chart types, adding UI components, or
  reviewing design consistency. Reference: reports/kit/styleguide.html
---

# Hitwicket Report Design System

Live reference: [kit/styleguide.html](../../kit/styleguide.html)

Kit changes require owner PR review (`CODEOWNERS` on `kit/`). Preview locally: `python3 -m http.server 8765` → `kit/styleguide.html`.

## Identity

Cricket-grounded analytics — not a generic SaaS dashboard. Palette evokes turf tint (light) and floodlit pitch (dark). One **scoreboard stat** per report hero (`stat-scoreboard`); everything else stays quiet.

## Color tokens (semantic)

| Token | Use | Grounding |
|-------|-----|-----------|
| `--teal` | Positive / good | Outfield green |
| `--coral` | Negative / bad | Cricket-ball leather red |
| `--amber` | Warning / caution | Scoreboard bulb |
| `--blue` | Neutral / info / base arm | Broadcast graphics blue |
| `--purple` | Rare / sixes in shot-mix | "Purple patch" idiom |

Dataset colors in JS: `HWReport.COLORS` in `kit/charts.js` — never hardcode chart chrome.

## Typography

- **Body:** DM Sans (self-hosted `kit/fonts/*.woff2` — no Google Fonts CDN)
- **Data + scoreboard stat:** DM Mono, `font-variant-numeric: tabular-nums`
- Text scale tokens: `--text-xs` … `--text-hero`
- No third display font by default

## Fonts (vendored)

- `kit/fonts/DMSans-*.woff2`, `DMMono-*.woff2`, `OFL.txt`
- `@font-face` in `report.css` — do not add `@import` from googleapis

## Spacing

`--space-1` (4px) through `--space-6` (32px). Use tokens in new CSS; existing rem values are fine in legacy markup.

## One signature stat per report

```html
<div class="hero-stat-wrap">
  <p class="stat-scoreboard-label">Close match rate</p>
  <p class="stat-scoreboard neutral" data-value="55.3" data-suffix="%" data-decimals="1">55.3%</p>
</div>
```

`HWReport.initScoreboard()` runs on load (via `report.js`). Only one per hero — don't scatter oversized numbers across KPI cards.

## Section eyebrows

Plain uppercase labels — **not** `01 —` / `02 —` unless content is a genuine ordered sequence (e.g. methodology steps).

```html
<p class="section-num">Key findings</p>
```

## Chart foundation

- Shared options: `HWReport.charts._baseOpts(kind, extra)` (internal; helpers use it)
- Format registry: `HWReport.fmt` — `pct`, `pp`, `count`, `inr`, `raw`; use in tooltips/axes via `HWReport.fmt.tick(kind)`
- Chart registry upserts in-place when same canvas + type (`_chartStore`)
- `HWReport.charts.refreshTheme()` re-tints dataset colors from `meta.colors`
- Chart wrappers: `.chart-wrap` (16:9), `.chart-wrap--tall` (4:3) — prefer classes over inline heights in new markup

## Interactive filters (opt-in)

```html
<div id="filter-bar" class="filter-bar"></div>
<script src="kit/filters.js"></script>
```

```js
HWReport.filters.init({ bar: '#filter-bar', dims: [...], url: true });
HWReport.filters.register('chart-id', { deps: ['br','inn'], render: function (vals) { ... } });
```

- Sticky below header+tabs (`--filter-top` measured on resize)
- URL hash: `#br=50k-75k&inn=bat1` (omit defaults)
- Tab switch dispatches `hwreport:tabswitch` — filters flush dirty charts
- Runtime slice helpers: `HWReport.filters.sliceBracket()`, `sliceLabels()`

## Tables + export chrome (opt-in)

```html
<script src="kit/tables.js"></script>
```

```js
HWReport.table(el, { columns, rows, sortable, stickyHeader, caption });
HWReport.initCardChrome(); // PNG on canvas cards, CSV on tables, section link
HWReport.initSectionAnchors(); // auto `sec-{slug}` ids (report.js on load)
```

Card actions: `.card-title-row` + `.chrome-btn` in `.card-actions`

## Chart decision guide

| Question | Chart helper |
|----------|--------------|
| Base vs test by bracket | `HWReport.grouped()` |
| Composition / share | `HWReport.donut()` |
| Ranking / leaderboard | `HWReport.horizontalRankedBar()` |
| Trend over time | `HWReport.lineChart()` / `HWReport.lineChartSimple()` |
| Small trend in KPI | `HWReport.sparkline()` |
| Correlation | `HWReport.scatter()` |
| Quartile band (q25–q75 + median) | `HWReport.quantileBand()` |
| Delta decomposition | `HWReport.waterfall()` |
| Stage conversion | `HWReport.funnel()` |
| Matrix heat | `HWReport.heatmapTable()` |
| Distribution table (legacy) | `.heatmap-table` in HTML |
| Close vs one-sided | `HWReport.dualBar()` |
| Reference line / band on chart | vendored `chartjs-plugin-annotation.min.js` after `chart.umd.js` |

## Components

- `.chart-footnote` — small caption under charts
- `.term[data-tip]` — glossary tooltip (rank names, etc.)
- Rank badges: `.rank-{Rookie|Challenger|Proven|Accomplished|Remarkable}` use `--rank-*` tokens

## Dark mode

- Auto: `prefers-color-scheme: dark`
- Manual: header toggle → `localStorage['hw-theme']` → `data-theme` on `<html>`
- No-flash snippet in `<head>` before CSS (see any report HTML)
- Chart grid/ticks/tooltips: `HWReport.theme.getChartTheme()` — never `rgba(0,0,0,0.04)` in chart options

## Motion

- **Allowed:** count-up on `.stat-scoreboard` only; fast tab cross-fade (~120ms)
- **Not default:** staggered section reveals, shimmer skeletons, card hover-lift
- Always respect `prefers-reduced-motion`

## Accessibility

- Tabs: auto-enhanced with `role="tablist"` / `role="tab"` / `role="tabpanel"` + arrow keys (`report.js`)
- Skip link injected to `#main-content`
- `:focus-visible` outline on interactive elements
- `--text-tertiary` meets AA contrast on `--surface`

## Script load order (reports with charts)

```html
<script>(function(){try{var t=localStorage.getItem('hw-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
<!-- in head, before report.css -->
...
<script src="kit/theme.js"></script>
<script src="kit/icons.js"></script>
<script src="kit/chart.umd.js"></script>
<script src="kit/chartjs-plugin-annotation.min.js"></script> <!-- optional: line/bar annotations -->
<script src="kit/charts.js"></script>
<script src="kit/filters.js"></script> <!-- optional: interactive filters -->
<script src="kit/tables.js"></script> <!-- optional: data tables + card export -->
<script src="kit/report.js"></script>
<!-- report-specific: ab-test.js, whale-mm.js, inline -->
```

Index page: `theme.js` → `icons.js` → `report.js` → `index.js` (no Chart.js).

## Icons

`HWReport.icon(name)` — trend-up, trend-down, alert, users, calendar, trophy, whale, link, copy. Square stroke caps (broadcast graphic style). Insights get icons automatically via `initInsights()`.

## Checklist for new report UI

- [ ] No-flash theme snippet in `<head>`
- [ ] Kit scripts in correct order
- [ ] One `.stat-scoreboard` in hero with `data-value` attrs
- [ ] Section eyebrows without fake numbering
- [ ] Charts use `HWReport.COLORS` + `getChartTheme()` for chrome
- [ ] Verified light + dark + reduced-motion
