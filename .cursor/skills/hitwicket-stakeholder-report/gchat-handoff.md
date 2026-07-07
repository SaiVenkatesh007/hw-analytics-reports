# GChat Handoff → HTML Mapping

## Public URL (use when archiving)

```
https://saivenkatesh007.github.io/hw-analytics-reports/{slug}.html
```

`{slug}` = filename stem for `reports/handoffs/{slug}.txt` and `reports/{slug}.html`.

When saving the handoff, **always** write the full `Dashboard:` URL — do not leave `[link]`, `TBD`, or a separate script step. If the user pasted `Dashboard: [link]` in chat, substitute the URL above when writing `reports/handoffs/{slug}.txt`.

## Canonical GChat format

```
[Title] — [Subtitle if any]
[Meta line: filters · segments · date]

Dashboard: https://saivenkatesh007.github.io/hw-analytics-reports/{slug}.html

*Context: [supersedes / scope note if any]*
   - [methodology bullet]
   - [methodology bullet]

*1. [Finding headline]*
   - [evidence bullet with numbers]
   - [evidence bullet]

*2. [Finding headline]*
   ...

*Takeaway:* [One clear recommendation — not alternatives]
```

## Mapping to HTML

| GChat section | HTML element |
|---------------|--------------|
| Title | `<header> h1` |
| Meta line | `<header> .meta` |
| `*Context:*` block | `.caveat-banner` + Methodology tab bullets |
| `*N. Headline*` + bullets | `.insight` cards (`.warn` / `.good` / `.bad` by tone) |
| `*Takeaway:*` | `.hero-title` + `.hero-desc` |
| `Dashboard:` URL | Same URL in GChat paste after publish; optional link in report footer |

## Insight card tone

| Signal in text | CSS class |
|----------------|-----------|
| Goal not met, negative behaviour | `.insight.bad` |
| Caveat, partial win, correction | `.insight.warn` |
| Positive finding | `.insight.good` |
| Neutral fact | `.insight` |

## Archive rule

Save to `reports/handoffs/{slug}.txt` before building HTML. Copy GChat narrative verbatim for findings and numbers — only change the `Dashboard:` line from `[link]` to the full Pages URL for `{slug}`.
