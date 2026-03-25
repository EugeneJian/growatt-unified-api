---
name: showdoc-mcp-sync
description: Sync internal project documents to ShowDoc through the configured `showdoc` MCP server. Use when the user asks to create or locate a ShowDoc project, create catalogs or pages, or upsert Markdown docs from this repository into ShowDoc, especially multi-file internal architecture materials under `Growatt-Archetecture/`.
---

# ShowDoc MCP Sync

Use this skill when the goal is to sync repository Markdown materials into ShowDoc through MCP.

Default target for this repository:

- project name: `Growatt-Archetecture`
- source directory: `Growatt-Archetecture/`
- document scope: internal

Do not store or print the full ShowDoc token in repository files, commit messages, or user-facing summaries. Assume the token is already configured in the local MCP server named `showdoc`.

## Default workflow

Follow this order unless the user explicitly asks for a different sync shape:

1. Confirm the local MCP server `showdoc` is available.
2. Read `_meta.json` first if it exists under `Growatt-Archetecture/`.
3. Read the source Markdown files from `Growatt-Archetecture/`.
4. Check whether project `Growatt-Archetecture` already exists.
5. If it does not exist, try to create it.
6. Map subdirectories and files to the needed ShowDoc catalog path.
7. Upsert the target page contents in the declared order.
8. Report exactly what was created, updated, skipped, or blocked.

## Project handling rules

Always treat `Growatt-Archetecture` as the primary target project for this workflow.

- First call the project-listing capability to look for an existing item with the same or very similar name.
- If a match exists, reuse it instead of creating a duplicate project.
- If no match exists, attempt project creation.
- If project creation fails because of ShowDoc account restrictions, stop and report the restriction clearly.
- Do not silently fall back to an unrelated project.

The repository already contains a validation record showing that:

- the ShowDoc MCP endpoint is real and reachable
- project creation may be blocked by account status
- page creation and page upsert style workflows are viable

Read `docs/SHOWDOC_MCP_VALIDATION.zh-CN.md` if you need the verified capability background.

## Directory sync defaults

Unless the user specifies a different information architecture, use:

- sync root: `Growatt-Archetecture/`
- top-level catalog path: `内部资料/平台架构`

Preferred write behavior:

- Prefer `upsert_page` when available.
- If bulk sync is needed, prefer `batch_upsert_pages`.
- If upsert is unavailable, use create-then-update logic.

Default mapping:

- each Markdown file maps to one ShowDoc page
- each subdirectory maps to one nested ShowDoc catalog path
- `README.md` may be used as a catalog landing page when that is useful

If `_meta.json` exists, treat it as the source of truth for:

- sync order
- page titles
- target catalog paths
- which files should be synced first

## Content rules

These source materials are internal-facing. Preserve that positioning during sync.

- Keep the original Chinese wording unless the user asks for rewriting.
- Preserve heading hierarchy, Mermaid blocks, and architecture terminology.
- Preserve distinctions such as `Legacy API`, `OpenAPI`, `0x04`, `0x03`, `VPP Protocol 2.04`, and `RTU Protocol`.
- Preserve the modeling rule that batteries are managed through inverters rather than as independently onboarded platform objects.
- Do not remove statements that clarify internal boundaries, role views, or platform evolution direction.

Default sync mode:

- Sync all supported Markdown files under `Growatt-Archetecture/`.
- Skip non-Markdown files unless the user explicitly asks for another behavior.
- Ignore metadata files during page writes, but use `_meta.json` to drive ordering and mapping.

If the current single-file architecture document is later split, prefer stable chapter-based pages such as:

1. 文档目的与核心结论
2. 平台总体架构
3. 角色视图
4. 统一架构口径与结论

## Safety rules

- Do not commit secrets into the repository.
- Do not echo the raw Bearer token back to the user unless they explicitly ask for it.
- Do not sync unrelated local files just because they are nearby.
- If the document contains obviously sensitive internal-only details beyond the requested scope, warn the user before syncing publicly visible content.

## Recommended summary format

When reporting a completed or blocked sync, use this structure:

1. target project
2. source directory
3. catalogs and pages created or updated
4. whether the sync was full, partial, or blocked
5. the exact blocker if ShowDoc refused project creation or page writes

## Additional references

- For verified MCP behavior in this repo, read [reference.md](reference.md)
- For the sync source root, read `Growatt-Archetecture/README.md`
- For ordered multi-file sync mapping, read `Growatt-Archetecture/_meta.json`
