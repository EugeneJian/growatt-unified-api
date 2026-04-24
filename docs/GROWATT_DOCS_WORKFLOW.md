# Growatt Docs Baseline Workflow

## Goal

Use the imported vendor baseline as the factual source, then publish aligned bilingual HTML documentation at `/growatt-openapi`.

## Source Order

1. Upstream baseline snapshots:
   - Latest approved dated snapshot, for example `docs/3 接口列表20260424.md`
   - Keep `docs/3 接口列表.md` as the 2026-04-01 historical reference so older audits and line references remain stable.
   - Sync the latest dated snapshot from the approved vendor document first.
2. Published split docs:
   - `Growatt API/OPENAPI/*.md`
   - `Growatt API/OPENAPI.zh-CN/*.md`
3. Entry guides and FAQ:
   - `Growatt API/Growatt Open API Professional Integration Guide.md`
   - `Growatt API/Growatt Open API Professional Integration Guide.zh-CN.md`
4. Historical references and integration reports:
   - `Growatt API/Growatt Unified API.md`
   - `test/*.md`

The baseline is normative. Split docs, guides, and FAQ are publication layers and must not override it.

## Publication Rules

1. Update the latest dated baseline snapshot before editing any published OPENAPI page.
2. Reconcile the bilingual split docs against the baseline before touching Quick Guide or FAQ.
3. Keep environment-specific findings explicitly labeled as non-normative observations.
4. If the vendor baseline is internally inconsistent, document the inconsistency instead of silently inventing a new rule.
5. Keep both OPENAPI README indexes aligned with the current published file inventory.

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
   - Placeholder and masked-secret checks for public docs
2. `docs:test:growatt`
   - Link rewriter unit tests
   - Docs loader and render tests
   - Bilingual title and regression assertions

## Publish Flow

1. Update the baseline and derived public docs.
2. Update guides, FAQ, shared UI strings, and tests if user-facing wording changes.
3. Open a PR and ensure the docs checks are green.
4. Merge to `main`.
5. Publish through Cloudflare Pages or Wrangler.
6. Share the customer URL:
   - `https://<your-cloudflare-domain>/growatt-openapi`

## Content Update Checklist

1. Sync the latest dated vendor snapshot, for example `docs/3 接口列表20260424.md`, from the approved upstream file.
2. Update `Growatt API/OPENAPI*` docs to reflect the baseline.
3. Move environment-specific findings into clearly labeled observation sections.
4. Update README indexes when file inventory changes.
5. Run local checks and build verification.
