#!/usr/bin/env python3
"""Create or update a Feishu spreadsheet through lark-cli using UTF-8-safe subprocess calls."""

from __future__ import annotations

import argparse
import csv
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any


DEFAULT_LARK_CLI = (
    Path.home()
    / "AppData"
    / "Roaming"
    / "npm"
    / "node_modules"
    / "@larksuite"
    / "cli"
    / "bin"
    / "lark-cli.exe"
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create or update a Feishu spreadsheet from UTF-8 CSV/JSON rows."
    )
    parser.add_argument("--title", help="Spreadsheet title when creating a new spreadsheet.")
    parser.add_argument("--csv", type=Path, help="Path to a UTF-8 or UTF-8-SIG CSV file.")
    parser.add_argument(
        "--rows-json",
        type=Path,
        help="Path to a UTF-8 JSON file containing a 2D array of cell values.",
    )
    parser.add_argument("--spreadsheet-token", help="Existing spreadsheet token to overwrite.")
    parser.add_argument("--url", help="Existing spreadsheet URL to overwrite.")
    parser.add_argument("--sheet-id", help="Target sheet ID. Defaults to the first sheet.")
    parser.add_argument("--start-cell", default="A1", help="Top-left write cell. Default: A1.")
    parser.add_argument("--as", dest="identity", default="user", choices=("user", "bot"))
    parser.add_argument("--lark-cli-exe", type=Path, help="Explicit path to lark-cli.exe.")
    parser.add_argument("--preview-rows", type=int, default=3, help="Preview row count.")
    parser.add_argument("--preview-cols", type=int, default=4, help="Preview column count.")
    args = parser.parse_args()

    if not args.csv and not args.rows_json:
        parser.error("one of --csv or --rows-json is required")

    if not args.spreadsheet_token and not args.url and not args.title:
        parser.error("--title is required when creating a new spreadsheet")

    return args


def resolve_cli_exe(explicit: Path | None) -> Path:
    candidates = [
        explicit,
        Path(str(DEFAULT_LARK_CLI)),
        Path(shutil.which("lark-cli.exe") or ""),
        Path(shutil.which("lark-cli") or ""),
    ]
    for candidate in candidates:
        if candidate and str(candidate) and candidate.exists():
            return candidate
    raise FileNotFoundError("Unable to find lark-cli.exe")


def run_cli(exe: Path, *args: str) -> dict[str, Any]:
    result = subprocess.run(
        [str(exe), *args],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="strict",
    )
    if result.returncode != 0:
        raise RuntimeError(
            "lark-cli failed\n"
            f"args: {args}\n"
            f"stdout: {result.stdout}\n"
            f"stderr: {result.stderr}"
        )
    return extract_json(result.stdout)


def extract_json(stdout: str) -> dict[str, Any]:
    text = stdout.strip()
    if not text:
        return {}
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end < start:
        raise ValueError(f"Expected JSON output, got: {stdout!r}")
    return json.loads(text[start : end + 1])


def ensure_auth(exe: Path) -> dict[str, Any]:
    status = run_cli(exe, "auth", "status", "--verify")
    if not status.get("verified"):
        raise RuntimeError("lark-cli auth status --verify returned verified=false")
    return status


def load_rows(csv_path: Path | None, json_path: Path | None) -> list[list[str]]:
    if csv_path:
        with csv_path.open("r", encoding="utf-8-sig", newline="") as handle:
            rows = [list(row) for row in csv.reader(handle)]
    else:
        raw = json.loads(json_path.read_text(encoding="utf-8"))
        if not isinstance(raw, list) or any(not isinstance(row, list) for row in raw):
            raise ValueError("--rows-json must be a JSON 2D array")
        rows = [list(row) for row in raw]

    if not rows:
        raise ValueError("Input rows are empty")

    max_cols = max(len(row) for row in rows)
    normalized: list[list[str]] = []
    for row in rows:
        normalized.append([cell_to_string(cell) for cell in row] + [""] * (max_cols - len(row)))
    return normalized


def cell_to_string(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value
    return str(value)


def create_spreadsheet(exe: Path, identity: str, title: str) -> dict[str, Any]:
    payload = json.dumps({"title": title}, ensure_ascii=False)
    response = run_cli(
        exe,
        "sheets",
        "spreadsheets",
        "create",
        "--as",
        identity,
        "--format",
        "json",
        "--data",
        payload,
    )
    spreadsheet = response["data"]["spreadsheet"]
    return {
        "spreadsheet_token": spreadsheet["spreadsheet_token"],
        "url": spreadsheet["url"],
        "title": spreadsheet.get("title") or title,
    }


def get_info(
    exe: Path,
    identity: str,
    spreadsheet_token: str | None = None,
    url: str | None = None,
) -> dict[str, Any]:
    cmd = ["sheets", "+info", "--as", identity]
    if spreadsheet_token:
        cmd += ["--spreadsheet-token", spreadsheet_token]
    elif url:
        cmd += ["--url", url]
    else:
        raise ValueError("spreadsheet_token or url is required")
    return run_cli(exe, *cmd)


def parse_sheet_context(info: dict[str, Any], requested_sheet_id: str | None) -> dict[str, str]:
    spreadsheet = info["data"]["spreadsheet"]["spreadsheet"]
    sheets = info["data"]["sheets"]["sheets"]
    if not sheets:
        raise RuntimeError("Spreadsheet has no sheets")

    target_sheet = None
    if requested_sheet_id:
        for sheet in sheets:
            if sheet["sheet_id"] == requested_sheet_id:
                target_sheet = sheet
                break
        if target_sheet is None:
            raise RuntimeError(f"Sheet ID not found: {requested_sheet_id}")
    else:
        target_sheet = sheets[0]

    return {
        "spreadsheet_token": spreadsheet["token"],
        "url": spreadsheet["url"],
        "title": spreadsheet["title"],
        "sheet_id": target_sheet["sheet_id"],
        "sheet_title": target_sheet["title"],
    }


def parse_start_cell(cell: str) -> tuple[int, int]:
    match = re.fullmatch(r"([A-Z]+)([1-9][0-9]*)", cell.upper())
    if not match:
        raise ValueError(f"Invalid start cell: {cell}")
    letters, row = match.groups()
    col = 0
    for ch in letters:
        col = col * 26 + (ord(ch) - ord("A") + 1)
    return int(row), col


def col_to_letters(col_number: int) -> str:
    letters = []
    while col_number > 0:
        col_number, rem = divmod(col_number - 1, 26)
        letters.append(chr(ord("A") + rem))
    return "".join(reversed(letters))


def build_range(sheet_id: str, start_cell: str, row_count: int, col_count: int) -> str:
    start_row, start_col = parse_start_cell(start_cell)
    end_row = start_row + row_count - 1
    end_col = start_col + col_count - 1
    return f"{sheet_id}!{col_to_letters(start_col)}{start_row}:{col_to_letters(end_col)}{end_row}"


def write_values(
    exe: Path,
    identity: str,
    spreadsheet_token: str,
    target_range: str,
    values: list[list[str]],
) -> dict[str, Any]:
    payload = json.dumps(values, ensure_ascii=False)
    return run_cli(
        exe,
        "sheets",
        "+write",
        "--as",
        identity,
        "--spreadsheet-token",
        spreadsheet_token,
        "--range",
        target_range,
        "--values",
        payload,
    )


def read_preview(
    exe: Path,
    identity: str,
    spreadsheet_token: str,
    sheet_id: str,
    start_cell: str,
    row_count: int,
    col_count: int,
) -> dict[str, Any]:
    preview_range = build_range(sheet_id, start_cell, row_count, col_count)
    return run_cli(
        exe,
        "sheets",
        "+read",
        "--as",
        identity,
        "--spreadsheet-token",
        spreadsheet_token,
        "--range",
        preview_range,
    )


def main() -> int:
    args = parse_args()
    exe = resolve_cli_exe(args.lark_cli_exe)
    auth = ensure_auth(exe)
    rows = load_rows(args.csv, args.rows_json)
    created = False

    if args.spreadsheet_token or args.url:
        info = get_info(exe, args.identity, args.spreadsheet_token, args.url)
        context = parse_sheet_context(info, args.sheet_id)
    else:
        created_info = create_spreadsheet(exe, args.identity, args.title)
        created = True
        info = get_info(exe, args.identity, created_info["spreadsheet_token"], None)
        context = parse_sheet_context(info, args.sheet_id)

    target_range = build_range(context["sheet_id"], args.start_cell, len(rows), len(rows[0]))
    write_response = write_values(
        exe, args.identity, context["spreadsheet_token"], target_range, rows
    )
    preview_response = read_preview(
        exe,
        args.identity,
        context["spreadsheet_token"],
        context["sheet_id"],
        args.start_cell,
        min(args.preview_rows, len(rows)),
        min(args.preview_cols, len(rows[0])),
    )

    summary = {
        "created": created,
        "identity": args.identity,
        "auth_user": auth.get("userName"),
        "spreadsheet_token": context["spreadsheet_token"],
        "spreadsheet_url": context["url"],
        "spreadsheet_title": context["title"],
        "sheet_id": context["sheet_id"],
        "sheet_title": context["sheet_title"],
        "written_range": write_response["data"]["updatedRange"],
        "row_count": len(rows),
        "column_count": len(rows[0]),
        "revision": write_response["data"]["revision"],
        "preview": preview_response["data"]["valueRange"]["values"],
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
