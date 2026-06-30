#!/usr/bin/env python3
"""Optional repair: fix Dashboard URLs in reports/handoffs/*.txt (legacy / bulk). Not part of normal workflow — agents write the URL when archiving handoffs."""

import argparse
import os
import re
import sys
from pathlib import Path

DEFAULT_BASE = "https://saivenkatesh007.github.io/hw-analytics-reports"
HANDOFFS_DIR = Path(__file__).resolve().parents[1] / "handoffs"
DASHBOARD_RE = re.compile(r"^Dashboard:\s*(.*)$", re.MULTILINE)
PLACEHOLDER_RE = re.compile(
    r"^\[link\]$|^TBD$|^TODO$|^$|^\[url\]$",
    re.IGNORECASE,
)


def report_url(base: str, slug: str) -> str:
    return f"{base.rstrip('/')}/{slug}.html"


def expected_line(base: str, slug: str) -> str:
    return f"Dashboard: {report_url(base, slug)}"


def parse_dashboard(content: str) -> str | None:
    m = DASHBOARD_RE.search(content)
    return m.group(1).strip() if m else None


def needs_update(current: str | None, base: str, slug: str) -> bool:
    target = report_url(base, slug)
    if current is None:
        return True
    if PLACEHOLDER_RE.match(current):
        return True
    return current.rstrip("/") != target


def update_content(content: str, base: str, slug: str) -> tuple[str, bool]:
    line = expected_line(base, slug)
    if DASHBOARD_RE.search(content):
        new_content = DASHBOARD_RE.sub(line, content, count=1)
        changed = new_content != content
        return new_content, changed
    # No Dashboard line — insert after first two lines (title + meta)
    lines = content.splitlines(keepends=True)
    insert_at = min(2, len(lines))
    prefix = "".join(lines[:insert_at])
    suffix = "".join(lines[insert_at:])
    if prefix and not prefix.endswith("\n"):
        prefix += "\n"
    return f"{prefix}{line}\n{suffix}", True


def process_file(path: Path, base: str, *, dry_run: bool, check_only: bool) -> list[str]:
    errors: list[str] = []
    slug = path.stem
    content = path.read_text()
    current = parse_dashboard(content)
    if not needs_update(current, base, slug):
        print(f"OK {path.name}")
        return errors

    new_line = expected_line(base, slug)
    if check_only:
        errors.append(f"{path.name}: Dashboard still placeholder or wrong ({current!r}) — expected {new_line}")
        print(f"FAIL {path.name}")
        return errors

    new_content, _ = update_content(content, base, slug)
    if dry_run:
        print(f"WOULD UPDATE {path.name} -> {report_url(base, slug)}")
        return errors

    path.write_text(new_content)
    print(f"UPDATED {path.name} -> {report_url(base, slug)}")
    return errors


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "paths",
        nargs="*",
        help="Handoff .txt files (default: all reports/handoffs/*.txt)",
    )
    parser.add_argument(
        "--base",
        default=os.environ.get("HW_REPORTS_BASE_URL", DEFAULT_BASE),
        help=f"GitHub Pages base URL (default: {DEFAULT_BASE})",
    )
    parser.add_argument("--dry-run", action="store_true", help="Print changes without writing")
    parser.add_argument(
        "--check",
        action="store_true",
        help="Exit 1 if any handoff still has a placeholder or wrong URL",
    )
    args = parser.parse_args()

    paths = [Path(p) for p in args.paths] if args.paths else sorted(HANDOFFS_DIR.glob("*.txt"))
    if not paths:
        print("No handoff files found", file=sys.stderr)
        sys.exit(1)

    errors: list[str] = []
    for path in paths:
        if not path.exists():
            errors.append(f"{path}: file not found")
            continue
        errors.extend(process_file(path, args.base, dry_run=args.dry_run, check_only=args.check))

    if errors:
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        sys.exit(1)
    sys.exit(0)


if __name__ == "__main__":
    main()
