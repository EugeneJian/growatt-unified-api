# ShowDoc MCP Sync Reference

## Local MCP expectation

This skill assumes the local MCP client already exposes a server named `showdoc`.

Use a local configuration shaped like:

```json
{
  "mcpServers": {
    "showdoc": {
      "type": "streamable-http",
      "url": "https://www.showdoc.com.cn/mcp.php",
      "headers": {
        "Authorization": "Bearer <showdoc-token>"
      }
    }
  }
}
```

Do not hardcode the real token into repository files.

## Verified capabilities

The repository validation record confirms that the ShowDoc MCP service can expose tools including:

- `list_items`
- `get_item`
- `create_item`
- `list_catalogs`
- `create_catalog`
- `list_pages`
- `get_page`
- `create_page`
- `update_page`
- `upsert_page`
- `batch_upsert_pages`
- `delete_page`

Background:

- repo validation note: `docs/SHOWDOC_MCP_VALIDATION.zh-CN.md`
- ShowDoc runapi page: [https://www.showdoc.com.cn/runapi/30291](https://www.showdoc.com.cn/runapi/30291)

## Repository defaults

Use these defaults unless the user overrides them:

- project: `Growatt-Archetecture`
- source directory: `Growatt-Archetecture/`
- scope: internal
- top-level catalog path: `内部资料/平台架构`
- mapping rule: each Markdown file becomes one page, each subdirectory becomes one catalog
- order source: `Growatt-Archetecture/_meta.json`

## Ordered sync source of truth

If `Growatt-Archetecture/_meta.json` exists, use it as the authoritative sync manifest.

Expected uses:

- keep page order stable across repeated syncs
- keep ShowDoc page titles stable even if filenames are technical
- map files into explicit catalog paths
- allow `README.md` to be synced as an index page

## Recommended prompt

```text
Use $showdoc-mcp-sync to sync all Markdown files under `Growatt-Archetecture/` into the ShowDoc project `Growatt-Archetecture` as internal architecture materials. Reuse the existing project if present; otherwise create it, then map directories to catalogs and files to pages under `内部资料/平台架构`.
```

## Known limitation

The repository validation also recorded that `create_item` can fail if the current ShowDoc account has not completed required account setup such as email binding. In that case:

1. stop the project-creation path
2. report the blocker clearly
3. do not silently write into an unrelated project
