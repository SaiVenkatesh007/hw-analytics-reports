#!/usr/bin/env python3
"""Validate report data JSON before publishing to GitHub Pages."""

import json
import sys
from pathlib import Path

REQUIRED_VIEWS = [
    "overall", "bat1", "bowl1", "overall_i2", "bat1_i2", "bowl1_i2",
]
REQUIRED_FIELDS = ["sample", "base", "test", "mix_base", "mix_test", "mix_pp", "qbase", "qtest", "wk_pct", "sc_pct"]
METRIC_KEYS = ["total", "balls", "wickets", "misses"]
SHOT_KEYS = ["z", "o", "t", "f", "s"]

CATALOG_META_FIELDS = ("title", "slug", "owner", "date", "tags", "thesis")


def check_ab_data(data: dict) -> list[str]:
    errors = []
    meta = data.get("meta", {})
    dd = data.get("dd", {})

    for field in ("title", "slug"):
        if field not in meta:
            errors.append(f"meta.{field} missing")

    brackets = meta.get("brackets", ["0-50k", "50k-75k", "75k-100k", "100k+"])
    n = len(brackets)

    for view in REQUIRED_VIEWS:
        if view not in dd:
            errors.append(f"dd.{view} missing")
            continue
        v = dd[view]
        for field in REQUIRED_FIELDS:
            if field not in v:
                errors.append(f"dd.{view}.{field} missing")
        if "sample" in v and len(v["sample"]) != n:
            errors.append(f"dd.{view}.sample length {len(v['sample'])} != {n}")
        for arm in ("base", "test"):
            if arm not in v:
                continue
            for mk in METRIC_KEYS:
                if mk not in v[arm]:
                    errors.append(f"dd.{view}.{arm}.{mk} missing")
                elif len(v[arm][mk]) != n:
                    errors.append(f"dd.{view}.{arm}.{mk} length mismatch")
        for mix_key in ("mix_base", "mix_test", "mix_pp"):
            if mix_key not in v:
                continue
            for sk in SHOT_KEYS:
                if sk not in v[mix_key]:
                    errors.append(f"dd.{view}.{mix_key}.{sk} missing")
                elif len(v[mix_key][sk]) != n:
                    errors.append(f"dd.{view}.{mix_key}.{sk} length mismatch")
        if "wk_pct" in v and len(v["wk_pct"]) != n:
            errors.append(f"dd.{view}.wk_pct length mismatch")
        if "sc_pct" in v and len(v["sc_pct"]) != n:
            errors.append(f"dd.{view}.sc_pct length mismatch")
        if "base" in v and "test" in v and "wk_pct" in v:
            for i in range(n):
                base_w = v["base"]["wickets"][i]
                if base_w:
                    expected = round((v["test"]["wickets"][i] - base_w) / base_w * 100, 1)
                    actual = v["wk_pct"][i]
                    if abs(expected - actual) > 0.15:
                        errors.append(
                            f"dd.{view}.wk_pct[{i}]={actual} != recomputed {expected}"
                        )

    return errors


def check_dashboard_data(data: dict) -> list[str]:
    errors = []
    meta = data.get("meta", {})
    for field in CATALOG_META_FIELDS:
        if field not in meta:
            errors.append(f"meta.{field} missing")
    if "overall" not in data:
        errors.append("overall missing")
    elif not isinstance(data["overall"], dict):
        errors.append("overall must be an object")
    return errors


def check_json(path: Path) -> tuple[list[str], str]:
    data = json.loads(path.read_text())
    tags = data.get("meta", {}).get("tags", [])
    if "dd" in data or "ab-test" in tags:
        return check_ab_data(data), "AB"
    return check_dashboard_data(data), "dashboard"


def main():
    paths = sys.argv[1:] or ["reports/data/wicket_chance_ab_clean_fix.json"]
    failed = False
    for p in paths:
        path = Path(p)
        if not path.exists():
            print(f"FAIL {path}: file not found")
            failed = True
            continue
        errors, kind = check_json(path)
        if errors:
            print(f"FAIL {path} ({kind}):")
            for e in errors:
                print(f"  - {e}")
            failed = True
        else:
            print(f"OK {path} ({kind})")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()