#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";

const DEFAULT_MCP_URL = "https://www.showdoc.com.cn/mcp.php";
const DEFAULT_PROJECT_DIR = "Growatt-Archetecture";
const DEFAULT_SHOWDOC_PAGE_BASE_URL = "https://www.showdoc.com.cn/web/#/page";
const DEFAULT_SHOWDOC_PAGE_SETTLE_MS = 2500;
function parseArgs(argv) {
  const options = {
    mcpUrl: process.env.SHOWDOC_MCP_URL || DEFAULT_MCP_URL,
    projectDir: DEFAULT_PROJECT_DIR,
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--project-dir") {
      options.projectDir = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--mcp-url") {
      options.mcpUrl = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--token") {
      options.token = argv[index + 1];
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

async function readJson(filePath) {
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content);
}

async function readText(filePath) {
  return fs.readFile(filePath, "utf8");
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function normalizeCatalog(catalog) {
  return typeof catalog === "string" ? catalog.trim() : "";
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getLeafCatalog(catalog) {
  return normalizeCatalog(catalog).split("/").filter(Boolean).at(-1) ?? null;
}

function buildShowDocPageUrl(pageId, hash = "") {
  const baseUrl = process.env.SHOWDOC_PAGE_BASE_URL || DEFAULT_SHOWDOC_PAGE_BASE_URL;
  return `${baseUrl}/${pageId}${hash}`;
}

function resolveLinkedMarkdownPath(fromPath, targetPath) {
  if (!targetPath || !targetPath.toLowerCase().endsWith(".md")) {
    return null;
  }

  const normalizedSourcePath = fromPath.replace(/\\/g, "/");
  const normalizedTargetPath = targetPath.replace(/\\/g, "/");
  const sourceDirectory = path.posix.dirname(normalizedSourcePath);

  return path.posix.normalize(path.posix.join(sourceDirectory, normalizedTargetPath));
}

function rewriteShowDocMarkdownLinks(markdown, currentFilePath, pageRefByPath) {
  if (!markdown) {
    return markdown;
  }

  return markdown.replace(
    /(?<!!)(\[[^\]]+\]\()([^)]+)(\))/g,
    (_, prefix, rawTarget, suffix) => {
      const trimmedTarget = rawTarget.trim();
      if (!trimmedTarget) {
        return `${prefix}${rawTarget}${suffix}`;
      }

      const [targetHref, ...titleParts] = trimmedTarget.split(/\s+/);
      if (!targetHref || targetHref.startsWith("#") || /^(https?:\/\/|mailto:|tel:)/i.test(targetHref)) {
        return `${prefix}${rawTarget}${suffix}`;
      }

      const [rawPath, rawHash] = targetHref.split("#");
      const resolvedPath = resolveLinkedMarkdownPath(currentFilePath, rawPath);
      if (!resolvedPath) {
        return `${prefix}${rawTarget}${suffix}`;
      }

      const pageRef = pageRefByPath.get(resolvedPath);
      if (!pageRef?.page_id) {
        return `${prefix}${rawTarget}${suffix}`;
      }

      const rewrittenHref = buildShowDocPageUrl(pageRef.page_id, rawHash ? `#${rawHash}` : "");
      const titleSegment = titleParts.length > 0 ? ` ${titleParts.join(" ")}` : "";

      return `${prefix}${rewrittenHref}${titleSegment}${suffix}`;
    },
  );
}

function toShowDocPagePayload(page) {
  return {
    page_title: page.page_title,
    page_content: page.page_content,
    s_number: page.s_number,
    ...(page.cat_name ? { cat_name: page.cat_name } : {}),
  };
}

function parseToolContent(result) {
  const text = result?.content?.[0]?.text;
  if (!text) {
    throw new Error("Missing MCP tool response content.");
  }
  return JSON.parse(text);
}

class ShowDocMcpClient {
  constructor({ token, mcpUrl }) {
    this.token = token;
    this.mcpUrl = mcpUrl;
    this.requestId = 1;
  }

  async request(method, params) {
    const response = await fetch(this.mcpUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: this.requestId++,
        method,
        params,
      }),
    });

    if (!response.ok) {
      throw new Error(`MCP HTTP request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(`MCP returned error: ${JSON.stringify(data.error)}`);
    }

    return data.result;
  }

  async initialize() {
    return this.request("initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: {
        name: "local-sync-script",
        version: "1.0.0",
      },
    });
  }

  async callTool(name, args) {
    const result = await this.request("tools/call", {
      name,
      arguments: args,
    });
    return parseToolContent(result);
  }
}

async function loadProjectConfig(repoRoot, projectDir) {
  const syncRoot = path.resolve(repoRoot, projectDir);
  const manifestPath = path.join(syncRoot, "_meta.json");
  const instructionsPath = path.join(syncRoot, "sync-instructions.md");
  const readmePath = path.join(syncRoot, "README.md");

  if (!(await fileExists(manifestPath))) {
    throw new Error(`Manifest not found: ${manifestPath}`);
  }

  if (!(await fileExists(instructionsPath))) {
    throw new Error(`Sync instructions not found: ${instructionsPath}`);
  }

  const manifest = await readJson(manifestPath);
  await readText(instructionsPath);
  await readText(readmePath);

  if (!manifest.project || !Array.isArray(manifest.order) || manifest.order.length === 0) {
    throw new Error("Manifest is missing required project or order fields.");
  }

  const files = [];
  for (const [index, entry] of manifest.order.entries()) {
    if (!entry.path || !entry.title || typeof entry.catalog !== "string") {
      throw new Error(`Invalid manifest entry at index ${index}.`);
    }

    const fullPath = path.join(syncRoot, entry.path);
    if (!(await fileExists(fullPath))) {
      throw new Error(`Manifest entry file is missing: ${entry.path}`);
    }

    files.push({
      ...entry,
      fullPath,
      normalizedPath: entry.path.replace(/\\/g, "/"),
      leafCatalog: getLeafCatalog(entry.catalog),
      sNumber: index + 1,
    });
  }

  return {
    syncRoot,
    manifestPath,
    instructionsPath,
    readmePath,
    manifest,
    files,
  };
}

async function ensureProject(client, manifest, dryRun) {
  const { items } = await client.callTool("list_items", {});
  const existing = items.find((item) => item.item_name === manifest.project);

  if (existing) {
    return {
      itemId: existing.item_id,
      projectStatus: "reused",
    };
  }

  if (dryRun) {
    return {
      itemId: null,
      projectStatus: "would_create",
    };
  }

  const created = await client.callTool("create_item", {
    item_name: manifest.project,
    item_description: `Synced from local ${manifest.project} markdown sources`,
    item_type: 1,
  });

  return {
    itemId: created.item_id,
    projectStatus: "created",
  };
}

async function ensureRootCatalogs(client, itemId, files, dryRun) {
  const catalogResponse = itemId
    ? await client.callTool("list_catalogs", { item_id: itemId })
    : { catalogs: [] };

  const existingCatalogs = new Map(
    (catalogResponse.catalogs || []).map((catalog) => [catalog.cat_name, catalog.cat_id]),
  );
  const createdCatalogs = [];

  for (const leafCatalog of [...new Set(files.map((file) => file.leafCatalog).filter(Boolean))]) {
    if (existingCatalogs.has(leafCatalog)) {
      continue;
    }

    if (dryRun) {
      createdCatalogs.push({ cat_name: leafCatalog, status: "would_create" });
      continue;
    }

    const created = await client.callTool("create_catalog", {
      item_id: itemId,
      cat_name: leafCatalog,
    });

    existingCatalogs.set(leafCatalog, created.cat_id);
    createdCatalogs.push({ cat_name: leafCatalog, status: "created", cat_id: created.cat_id });
  }

  return {
    existingCatalogs,
    createdCatalogs,
  };
}

async function listAllPages(client, itemId) {
  const pages = [];
  let page = 1;

  while (true) {
    const response = await client.callTool("list_pages", {
      item_id: itemId,
      page,
      page_size: 100,
    });

    const batch = response.pages || [];
    pages.push(...batch);

    if (batch.length === 0 || pages.length >= (response.total || 0)) {
      break;
    }

    page += 1;
  }

  return pages;
}

async function buildLocalPages(files, pageRefByPath = new Map()) {
  const pages = [];

  for (const file of files) {
    const rawContent = await readText(file.fullPath);
    pages.push({
      file,
      page_title: file.title,
      page_content: rewriteShowDocMarkdownLinks(rawContent, file.normalizedPath, pageRefByPath),
      cat_name: file.leafCatalog,
      s_number: file.sNumber,
    });
  }

  return pages;
}

async function upsertPages(client, itemId, pages) {
  const results = [];
  const settleMs = Number(process.env.SHOWDOC_PAGE_SETTLE_MS || DEFAULT_SHOWDOC_PAGE_SETTLE_MS);

  for (const page of pages) {
    try {
      const response = await client.callTool("upsert_page", {
        item_id: itemId,
        ...toShowDocPagePayload(page),
      });
      results.push({
        filePath: page.file.normalizedPath,
        page_title: page.page_title,
        status: "success",
        page_id: response.page_id,
        cat_id: response.cat_id,
        s_number: page.s_number,
      });
      if (settleMs > 0) {
        await sleep(settleMs);
      }
    } catch (error) {
      results.push({
        filePath: page.file.normalizedPath,
        page_title: page.page_title,
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
        s_number: page.s_number,
      });
    }
  }

  return {
    successCount: results.filter((result) => result.status === "success").length,
    failedCount: results.filter((result) => result.status !== "success").length,
    results,
  };
}

function buildPageRefByPath(syncResults) {
  const pageRefByPath = new Map();

  for (const result of syncResults) {
    if (result.status === "success" && result.filePath && result.page_id) {
      pageRefByPath.set(result.filePath, result);
    }
  }

  return pageRefByPath;
}

async function syncPages(client, itemId, files, dryRun) {
  const initialPages = await buildLocalPages(files);

  if (dryRun) {
    return {
      successCount: initialPages.length,
      failedCount: 0,
      results: initialPages.map((page) => ({
        page_title: page.page_title,
        status: "would_sync",
      })),
    };
  }

  const initialSync = await upsertPages(client, itemId, initialPages);
  const pageRefByPath = buildPageRefByPath(initialSync.results);
  const rewrittenPages = await buildLocalPages(files, pageRefByPath);

  const needsRewritePass = rewrittenPages.some(
    (page, index) => page.page_content !== initialPages[index]?.page_content,
  );

  let rewriteSync = { successCount: 0, failedCount: 0, results: [] };
  if (needsRewritePass) {
    rewriteSync = await upsertPages(client, itemId, rewrittenPages);
  }

  const finalSyncResults = needsRewritePass ? rewriteSync.results : initialSync.results;
  const verifiedResults = finalSyncResults.map((result) =>
    result.status === "success"
      ? {
          page_title: result.page_title,
          status: "success",
          page_id: result.page_id,
          cat_id: result.cat_id,
          s_number: result.s_number,
        }
      : {
          page_title: result.page_title,
          status: "missing_after_sync",
        },
  );

  const missingCount = verifiedResults.filter((result) => result.status !== "success").length;
  const verifiedSuccessCount = verifiedResults.length - missingCount;

  return {
    successCount: verifiedSuccessCount,
    failedCount: initialSync.failedCount + rewriteSync.failedCount + missingCount,
    results: verifiedResults,
  };
}

function printSummary({
  projectName,
  projectStatus,
  itemId,
  manifestPath,
  createdCatalogs,
  syncResult,
  dryRun,
}) {
  const statusLabel = dryRun ? "dry_run" : syncResult.failedCount > 0 ? "partial_sync" : "full_sync";
  const summary = {
    target_project: projectName,
    project_status: projectStatus,
    item_id: itemId,
    manifest_source: manifestPath,
    catalogs_created_or_reused: createdCatalogs,
    pages_total: syncResult.results.length,
    pages_success: syncResult.successCount,
    pages_failed: syncResult.failedCount,
    overall_status: statusLabel,
    page_results: syncResult.results,
  };

  console.log(JSON.stringify(summary, null, 2));
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const token = options.token || process.env.SHOWDOC_TOKEN;

  if (!token) {
    throw new Error("Missing ShowDoc token. Set SHOWDOC_TOKEN or pass --token.");
  }

  const repoRoot = process.cwd();
  const projectConfig = await loadProjectConfig(repoRoot, options.projectDir);
  const client = new ShowDocMcpClient({
    token,
    mcpUrl: options.mcpUrl,
  });

  await client.initialize();

  const project = await ensureProject(client, projectConfig.manifest, options.dryRun);
  const catalogs = await ensureRootCatalogs(
    client,
    project.itemId,
    projectConfig.files,
    options.dryRun,
  );
  const syncResult = await syncPages(
    client,
    project.itemId,
    projectConfig.files,
    options.dryRun,
  );

  printSummary({
    projectName: projectConfig.manifest.project,
    projectStatus: project.projectStatus,
    itemId: project.itemId,
    manifestPath: projectConfig.manifestPath,
    createdCatalogs: catalogs.createdCatalogs,
    syncResult,
    dryRun: options.dryRun,
  });

  if (syncResult.failedCount > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("ShowDoc sync failed:", error.message);
  process.exit(1);
});
