## Report

- **Slug:**
- **Owner:**
- **Source notebook (VM path):**
- **Report type:** AB / whale MM / other

## Checklist

- [ ] Numbers match notebook / agreed GChat handoff
- [ ] Agent ran `python3 kit/build_catalog.py --sync` and `python3 kit/build_catalog.py`
- [ ] AB reports: `python3 kit/validate_report.py data/{slug}.json` passed
- [ ] Previewed locally (`python3 -m http.server 8765`)
- [ ] `handoffs/{slug}.txt` has full Dashboard URL (not `[link]`)

## Notes

<!-- Optional: caveats, scope changes, kit changes -->
