#!/usr/bin/env python3
"""Validate reports/catalog.json and sync catalog entries from reports/data/*.json meta."""

import argparse
import json
import re
import sys
from pathlib import Path

REPORTS_DIR = Path(__file__).resolve().parents[1]
CATALOG_PATH = REPORTS_DIR / "catalog.json"
DATA_DIR = REPORTS_DIR / "data"
HANDOFFS_DIR = REPORTS_DIR / "handoffs"

CATALOG_ENTRY_FIELDS = (
    "slug",
    "title",
    "owner",
    "date",
    "date_label",
    "tags",
    "thesis",
    "description",
    "handoff",
)

LINK_PLACEHOLDER = re.compile(r"(?:Dashboard|Report):\s*\[link\]", re.IGNORECASE)


def load_json(path: Path) -> dict:
    return json.loads(path.read_text())


def meta_to_catalog_entry(meta: dict) -> dict:
    slug = meta["slug"]
    entry = {
        "slug": slug,
        "title": meta["title"],
        "owner": meta["owner"],
        "date": meta["date"],
        "date_label": meta["date_label"],
        "tags": list(meta["tags"]),
        "thesis": meta["thesis"],
        "description": meta["description"],
        "handoff": meta.get("handoff", f"handoffs/{slug}.txt"),
    }
    return entry


def catalog_entry_from_data(path: Path) -> dict:
    data = load_json(path)
    meta = data.get("meta", {})
    missing = [f for f in CATALOG_ENTRY_FIELDS if f not in meta and f != "handoff"]
    if "slug" not in meta:
        missing.append("slug")
    if missing:
        raise ValueError(f"{path.name}: meta missing catalog fields: {', '.join(missing)}")
    return meta_to_catalog_entry(meta)


def validate_catalog_entry(entry: dict, prefix: str) -> list[str]:
    errors = []
    for field in CATALOG_ENTRY_FIELDS:
        if field not in entry or entry[field] in (None, ""):
            errors.append(f"{prefix}.{field} missing or empty")
    slug = entry.get("slug", "")
    if slug:
        html = REPORTS_DIR / f"{slug}.html"
        if not html.exists():
            errors.append(f"{prefix}: missing {html.relative_to(REPORTS_DIR)}")
        handoff = REPORTS_DIR / entry.get("handoff", "")
        if not handoff.exists():
            errors.append(f"{prefix}: missing {handoff.relative_to(REPORTS_DIR)}")
        elif LINK_PLACEHOLDER.search(handoff.read_text()):
            errors.append(f"{prefix}: handoff still has [link] placeholder")
    tags = entry.get("tags")
    if tags is not None and not isinstance(tags, list):
        errors.append(f"{prefix}.tags must be a list")
    return errors


def entries_match(a: dict, b: dict) -> list[str]:
    errors = []
    for field in CATALOG_ENTRY_FIELDS:
        av, bv = a.get(field), b.get(field)
        if field == "handoff" and not bv:
            bv = f"handoffs/{a['slug']}.txt"
        if av != bv:
            errors.append(f"catalog vs data meta mismatch on {field}: {av!r} != {bv!r}")
    return errors


def validate(catalog: dict) -> list[str]:
    errors = []
    if "site" not in catalog:
        errors.append("catalog.site missing")
    reports = catalog.get("reports")
    if not isinstance(reports, list):
        return errors + ["catalog.reports must be a list"]

    slugs_in_catalog = set()
    for i, entry in enumerate(reports):
        prefix = f"catalog.reports[{i}] ({entry.get('slug', '?')})"
        errors.extend(validate_catalog_entry(entry, prefix))
        slug = entry.get("slug")
        if slug:
            if slug in slugs_in_catalog:
                errors.append(f"duplicate catalog slug: {slug}")
            slugs_in_catalog.add(slug)

    data_paths = sorted(DATA_DIR.glob("*.json"))
    for path in data_paths:
        try:
            from_data = catalog_entry_from_data(path)
        except ValueError as exc:
            errors.append(str(exc))
            continue
        slug = from_data["slug"]
        catalog_entries = [e for e in reports if e.get("slug") == slug]
        if not catalog_entries:
            errors.append(f"data/{path.name}: slug {slug} not in catalog.json (run --sync)")
        elif len(catalog_entries) > 1:
            errors.append(f"duplicate catalog entries for slug {slug}")
        else:
            errors.extend(entries_match(catalog_entries[0], from_data))

    return errors


def sync_catalog() -> dict:
    catalog = load_json(CATALOG_PATH)
    data_entries = {}
    for path in sorted(DATA_DIR.glob("*.json")):
        data_entries[path.stem] = catalog_entry_from_data(path)

    catalog_only = [
        e for e in catalog.get("reports", [])
        if e.get("slug") not in data_entries
    ]

    merged = list(data_entries.values()) + catalog_only
    merged.sort(key=lambda e: e["date"], reverse=True)
    catalog["reports"] = merged
    return catalog


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--sync",
        action="store_true",
        help="Rewrite catalog.reports from data/*.json meta + catalog-only entries (no data file)",
    )
    args = parser.parse_args()

    if args.sync:
        try:
            catalog = sync_catalog()
        except ValueError as exc:
            print(f"FAIL sync: {exc}", file=sys.stderr)
            sys.exit(1)
        CATALOG_PATH.write_text(json.dumps(catalog, indent=2) + "\n")
        print(f"SYNC {CATALOG_PATH} ({len(catalog['reports'])} reports)")

    catalog = load_json(CATALOG_PATH)
    errors = validate(catalog)
    if errors:
        print(f"FAIL catalog validation ({len(errors)} issues):")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)

    print(f"OK catalog ({len(catalog['reports'])} reports)")


if __name__ == "__main__":
    main()
