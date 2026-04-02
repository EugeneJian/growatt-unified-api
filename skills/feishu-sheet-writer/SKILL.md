---
name: feishu-sheet-writer
description: Create or update Feishu/Lark spreadsheets from CSV or structured rows on Windows using the locally authenticated `lark-cli`, with a deterministic UTF-8-safe workflow that avoids Chinese text turning into `?`. Use when Codex needs to build PMO check tables, rollout trackers, imported CSV sheets, or repair garbled Chinese content in Feishu spreadsheets.
---

# Feishu Sheet Writer

Use this skill to create or overwrite Feishu spreadsheets through the local `lark-cli` without re-discovering the Windows encoding workaround.

This skill exists because raw PowerShell calls such as `lark-cli sheets +write --values ...` are unreliable for Chinese text on Windows. They can corrupt cell values into `?` before the CLI sends the request. Treat that path as known-bad for non-ASCII sheet content.

## Hard Rules

- Verify login first with `lark-cli auth status --verify`.
- Use the bundled Python script for all sheet writes that contain Chinese or other non-ASCII text.
- Feed the script a UTF-8 CSV file or a UTF-8 JSON rows file. Do not paste Chinese cell content directly into shell arguments.
- Read back a small preview after every write and confirm the returned values contain intact Chinese.
- Reuse an existing spreadsheet only when the user explicitly gives a token or URL. Otherwise create a new spreadsheet.
- Prefer user identity (`--as user`) unless the user explicitly asks for bot identity and the bot has the needed scopes.

## Default Workflow

1. Check auth.

   Run:

   ```powershell
   cmd /c C:\Users\Administrator\AppData\Roaming\npm\lark-cli.cmd auth status --verify
   ```

   Continue only if:

   - `verified` is `true`
   - the token has sheet create/write/read scopes

2. Prepare UTF-8 input.

   - If the user gives a CSV block, write it to a temporary UTF-8 CSV file first.
   - If the task is a PMO check table, start from [assets/pmo-check-template.csv](assets/pmo-check-template.csv) and edit rows before writing.
   - If the user asks for extra PMO fields, extend the CSV before calling the script instead of post-editing cells one by one.

3. Create or update the sheet with the script.

   Create a new spreadsheet:

   ```powershell
   python skills/feishu-sheet-writer/scripts/write_feishu_sheet.py `
     --title "PMO Check - VPP Rollout Tracking" `
     --csv "skills/feishu-sheet-writer/assets/pmo-check-template.csv"
   ```

   Overwrite an existing spreadsheet:

   ```powershell
   python skills/feishu-sheet-writer/scripts/write_feishu_sheet.py `
     --spreadsheet-token "<token>" `
     --sheet-id "<sheet_id>" `
     --csv "<utf8-file>.csv"
   ```

   Target by URL when the user only provides a link:

   ```powershell
   python skills/feishu-sheet-writer/scripts/write_feishu_sheet.py `
     --url "https://.../sheets/<token>" `
     --csv "<utf8-file>.csv"
   ```

4. Validate immediately.

   The script already reads back a preview range. Use that preview as the source of truth.

   If the preview contains `?` where Chinese should exist:

   - assume the input file was not UTF-8, or
   - the wrong write path was used

   Fix the input file encoding and rerun the script. Do not fall back to raw inline `lark-cli` arguments.

5. Report the result.

   Return:

   - spreadsheet URL
   - spreadsheet token
   - sheet ID
   - written range
   - preview rows
   - any assumptions you filled in

## PMO Check Conventions

When the user says "as PMO check", default to these columns unless they ask for a different schema:

- `阶段`
- `时间区间`
- `用户规模`
- `设备型号`
- `备注`
- `状态`
- `负责人`
- `区域`
- `是否支持1min telemetry`
- `VPP接口版本`
- `风险等级`

If the user provides only rollout rows and asks for PMO formatting, add the PMO columns before writing.

For default `状态` filling, use the local date when the user did not specify values:

- date range fully in the past -> `已完成`
- current date falls inside the range -> `进行中`
- date range in the future -> `未开始`

Do not infer `负责人`, `1min telemetry`, `VPP接口版本`, or `风险等级` unless the user explicitly asks for assumptions.

## Repair Workflow For Garbled Chinese

If the user reports Feishu cells showing `?`:

1. Export or reconstruct the intended rows locally as UTF-8.
2. Use the bundled script to overwrite the affected range.
3. Read back the first 2-3 rows.
4. Confirm the preview is correct before closing the task.

Do not diagnose this by repeatedly trying shell-quoted Chinese literals. The skill already knows that path is unreliable on Windows.

## Bundled Resources

- Script: [scripts/write_feishu_sheet.py](scripts/write_feishu_sheet.py)
  - Create a new spreadsheet or overwrite an existing one.
  - Call `lark-cli.exe` with argument arrays instead of shell-encoded JSON.
  - Read back a preview using UTF-8 decoding.
- Template: [assets/pmo-check-template.csv](assets/pmo-check-template.csv)
  - Ready-to-write PMO check example with Chinese headers and rows.

## Output Expectations

When using this skill, finish with a short result summary that includes:

- the final sheet link
- whether the sheet was newly created or updated
- whether the preview confirmed correct Chinese rendering
- any remaining manual follow-up, if any
