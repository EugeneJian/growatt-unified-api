# Skills

This repository includes reusable Codex skills for project-specific workflows.

## Available Skills

### `growatt-9290-inspector`

Path:

- [skills/growatt-9290-inspector/SKILL.md](/Users/kanajane/Desktop/Github/growatt_unified_api/skills/growatt-9290-inspector/SKILL.md)

Use this skill when you need to work with the verified Growatt test environment on:

- `https://api-test.growatt.com:9290`

It is designed for:

- fetching a fresh `client_credentials` token
- binding test devices with the temporary pin code
- reading device information
- reading device telemetry
- troubleshooting `bindDevice`, `getDeviceInfo`, and `getDeviceData`
- generating inspection or troubleshooting reports

## When To Trigger It

Use or mention this skill when the task involves:

- Growatt 9290 test-environment inspection
- current device status checks
- token -> bind -> info -> data workflow
- `DEVICE_SN_DOES_NOT_HAVE_PERMISSION`
- `parameter error`
- `code=400, message=fail`
- explaining why prefixed labels like `SPH:xxxx` must become raw SN values in requests

Suggested invocation:

```text
Use $growatt-9290-inspector to fetch a fresh token, bind the device if needed, read device info and telemetry, and summarize the current status.
```

## Skill Structure

The skill currently includes:

- `SKILL.md` for workflow and troubleshooting guidance
- `agents/openai.yaml` for UI metadata
- `assets/` for skill icons

## Notes

- This skill is intentionally scoped to the 9290 test environment behavior.
- It should not be assumed to describe all Growatt production environments.
- The canonical API docs remain under:
  - [Growatt API/OPENAPI](/Users/kanajane/Desktop/Github/growatt_unified_api/Growatt%20API/OPENAPI)
  - [Growatt API/OPENAPI.zh-CN](/Users/kanajane/Desktop/Github/growatt_unified_api/Growatt%20API/OPENAPI.zh-CN)

### `showdoc-mcp-sync`

Path:

- [skills/showdoc-mcp-sync/SKILL.md](skills/showdoc-mcp-sync/SKILL.md)

Use this skill when you need to sync internal repository Markdown documents into ShowDoc through the configured `showdoc` MCP server.

It is designed for:

- locating or creating the target ShowDoc project
- creating catalogs for internal architecture materials
- upserting Markdown pages from repository source files
- preserving Mermaid diagrams and architecture terminology during sync
- reporting whether the sync completed, partially completed, or was blocked by ShowDoc account limits

## When To Trigger It

Use or mention this skill when the task involves:

- ShowDoc MCP
- creating or locating project `Growatt-Archetecture`
- syncing Markdown files under `Growatt-Archetecture/`
- internal architecture document synchronization
- `list_items`, `create_item`, `upsert_page`, or `batch_upsert_pages`

Suggested invocation:

```text
Use $showdoc-mcp-sync to sync the Markdown files under `Growatt-Archetecture/` into the ShowDoc project `Growatt-Archetecture` as internal architecture documents.
```

## Notes

- This skill assumes the local MCP server name is `showdoc`.
- Do not store the real ShowDoc Bearer token in repository files.
- The capability validation record lives at `docs/SHOWDOC_MCP_VALIDATION.zh-CN.md`.
