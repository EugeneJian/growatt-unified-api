# Growatt Docs SSOT Workflow

## Goal

Keep a single source of truth (SSOT) for Growatt API docs while publishing a customer-friendly HTML site at `/growatt-openapi`.

## SSOT Rules

1. The only editable source for Growatt API docs is:
   - `Growatt API/OPENAPI/*.md`
2. `Growatt API/Growatt Unified API.md` is reference-only and must not be edited as the primary source.
3. Add new API docs with the file naming pattern:
   - `NN_descriptive_name.md` (example: `11_api_new_feature.md`)
4. Keep `Growatt API/OPENAPI/README.md` updated with:
   - Version
   - Release Date
   - Full document index links

## Build and Validation

Run these commands before merge:

```bash
npm run docs:check
npm run build
```

`docs:check` includes:

1. `docs:lint:growatt`
   - File naming validation
   - README index coverage
   - Duplicate slug detection
   - Markdown link reachability
2. `docs:test:growatt`
   - Link rewriter unit tests
   - Docs loader and render tests

## Publish Flow (Cloudflare Pages)

1. Commit changes to `Growatt API/OPENAPI/*.md` and related docs code.
2. Open PR and ensure `growatt-docs-check` CI is green.
3. Merge to `main`.
4. Cloudflare Pages 自动构建并发布（或使用 Wrangler 手动发布）。
5. Share customer URL:
   - `https://<your-cloudflare-domain>/growatt-openapi`
6. Deployment setup reference:
   - `docs/CLOUDFLARE_DEPLOYMENT.md`

## Content Update Checklist

1. Edit or add markdown files in `Growatt API/OPENAPI`.
2. Verify cross-document markdown links (`./xx.md` or `../xx.md`) are valid.
3. Update `README.md` in the same folder with any new files.
4. Run local checks.
5. Merge and publish.
