#!/usr/bin/env python3
"""Verify inline const DD in HTML matches data/{slug}.json payload."""

import json
import re
import sys
from pathlib import Path


def extract_dd_literal(html: str) -> str:
    m = re.search(r"\bconst\s+DD\s*=\s*", html)
    if not m:
        raise ValueError("const DD = ... not found in HTML")
    i = m.end()
    while i < len(html) and html[i] in " \t\n\r":
        i += 1
    if i >= len(html) or html[i] != "{":
        raise ValueError("expected object literal after const DD =")
    depth = 0
    in_str = False
    escape = False
    quote = ""
    j = i
    while j < len(html):
        ch = html[j]
        if in_str:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == quote:
                in_str = False
        else:
            if ch in ('"', "'"):
                in_str = True
                quote = ch
            elif ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    return html[i : j + 1]
        j += 1
    raise ValueError("unterminated DD object literal")


def normalize(obj):
    if isinstance(obj, float):
        return round(obj, 6)
    if isinstance(obj, dict):
        return {k: normalize(v) for k, v in sorted(obj.items())}
    if isinstance(obj, list):
        return [normalize(v) for v in obj]
    return obj


def expected_payload(data: dict) -> dict:
    tags = data.get("meta", {}).get("tags", [])
    if "dd" in data or "ab-test" in tags:
        return data["dd"]
    return {k: v for k, v in data.items() if k != "meta"}


def check_pair(json_path: Path, html_path: Path) -> list[str]:
    errors = []
    data = json.loads(json_path.read_text())
    html = html_path.read_text()
    try:
        dd_literal = extract_dd_literal(html)
        html_dd = json.loads(dd_literal)
    except (ValueError, json.JSONDecodeError) as exc:
        return [str(exc)]

    exp = normalize(expected_payload(data))
    got = normalize(html_dd)
    tags = data.get("meta", {}).get("tags", [])
    if "dd" not in data and "ab-test" not in tags and isinstance(got, dict):
        got = {k: v for k, v in got.items() if k != "meta"}
    if exp != got:
        errors.append("HTML const DD does not match JSON payload")
        exp_keys = set(exp.keys()) if isinstance(exp, dict) else set()
        got_keys = set(got.keys()) if isinstance(got, dict) else set()
        if exp_keys != got_keys:
            only_exp = sorted(exp_keys - got_keys)
            only_got = sorted(got_keys - exp_keys)
            if only_exp:
                errors.append(f"  keys in JSON only: {only_exp}")
            if only_got:
                errors.append(f"  keys in HTML only: {only_got}")
    return errors


def main():
    if len(sys.argv) != 3:
        print("Usage: check_html_data.py data/{slug}.json {slug}.html", file=sys.stderr)
        sys.exit(2)
    json_path = Path(sys.argv[1])
    html_path = Path(sys.argv[2])
    if not json_path.exists():
        print(f"FAIL {json_path}: not found")
        sys.exit(1)
    if not html_path.exists():
        print(f"FAIL {html_path}: not found")
        sys.exit(1)
    errors = check_pair(json_path, html_path)
    if errors:
        print(f"FAIL {json_path} vs {html_path}:")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)
    print(f"OK {html_path.name} matches {json_path.name}")
    sys.exit(0)


if __name__ == "__main__":
    main()
