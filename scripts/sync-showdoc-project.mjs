#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";

const DEFAULT_MCP_URL = "https://www.showdoc.com.cn/mcp.php";
const DEFAULT_PROJECT_DIR = "Growatt-Archetecture";
const MAX_BATCH_SIZE = 50;

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

function chunkArray(items, chunkSize) {
  const chunks = [];
  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }
  return chunks;
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
    if (!entry.path || !entry.title || !entry.catalog) {
      throw new Error(`Invalid manifest entry at index ${index}.`);
    }

    const fullPath = path.join(syncRoot, entry.path);
    if (!(await fileExists(fullPath))) {
      throw new Error(`Manifest entry file is missing: ${entry.path}`);
    }

    files.push({
      ...entry,
      fullPath,
      leafCatalog: entry.catalog.split("/").filter(Boolean).at(-1),
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

  for (const leafCatalog of [...new Set(files.map((file) => file.leafCatalog))]) {
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

async function syncPages(client, itemId, files, dryRun) {
  const pages = [];
  for (const file of files) {
    pages.push({
      page_title: file.title,
      page_content: await readText(file.fullPath),
      cat_name: file.leafCatalog,
      s_number: file.sNumber,
    });
  }

  if (dryRun) {
    return {
      successCount: pages.length,
      failedCount: 0,
      results: pages.map((page) => ({
        page_title: page.page_title,
        status: "would_sync",
      })),
    };
  }

  const results = [];
  let successCount = 0;
  let failedCount = 0;

  for (const chunk of chunkArray(pages, MAX_BATCH_SIZE)) {
    const response = await client.callTool("batch_upsert_pages", {
      item_id: itemId,
      pages: chunk,
    });

    successCount += response.success_count || 0;
    failedCount += response.failed_count || 0;
    results.push(...(response.results || []));
  }

  const remotePages = await listAllPages(client, itemId);
  const remotePageByNumber = new Map(remotePages.map((page) => [page.s_number, page]));
  const verifiedResults = pages.map((page) => {
    const remotePage = remotePageByNumber.get(page.s_number);
    if (!remotePage) {
      return {
        page_title: page.page_title,
        status: "missing_after_sync",
      };
    }

    return {
      page_title: page.page_title,
      status: "success",
      cat_id: remotePage.cat_id,
      s_number: remotePage.s_number,
    };
  });

  const missingCount = verifiedResults.filter((result) => result.status !== "success").length;

  return {
    successCount: successCount - missingCount,
    failedCount: failedCount + missingCount,
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
