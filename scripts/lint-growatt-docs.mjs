#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";

const README_FILE = "README.md";
const DOC_FILE_PATTERN = /^(\d{2})_[a-z0-9_]+\.md$/;
const OPENAPI_DIRS = [
  {
    label: "en",
    dir: path.join(process.cwd(), "Growatt API", "OPENAPI"),
  },
  {
    label: "zh-CN",
    dir: path.join(process.cwd(), "Growatt API", "OPENAPI.zh-CN"),
  },
];

function removeHash(url) {
  const hashIndex = url.indexOf("#");
  if (hashIndex === -1) {
    return url;
  }
  return url.slice(0, hashIndex);
}

function isExternalLink(url) {
  return /^(https?:\/\/|mailto:|tel:)/i.test(url);
}

function toSlug(fileName) {
  return fileName.replace(/\.md$/i, "");
}

async function fileExists(fullPath) {
  try {
    await fs.access(fullPath);
    return true;
  } catch {
    return false;
  }
}

async function lintGrowattDocsInDir(openApiDir, label) {
  const entries = await fs.readdir(openApiDir, { withFileTypes: true });
  const markdownFiles = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
    .map((entry) => entry.name)
    .sort();

  const docFiles = markdownFiles.filter((fileName) => fileName !== README_FILE);
  const errors = [];

  for (const fileName of docFiles) {
    if (!DOC_FILE_PATTERN.test(fileName)) {
      errors.push(
        `[${label}] Invalid file name "${fileName}". Expected pattern: NN_descriptive_name.md`,
      );
    }
  }

  const slugToFile = new Map();
  for (const fileName of docFiles) {
    const slug = toSlug(fileName).toLowerCase();
    if (slugToFile.has(slug)) {
      errors.push(
        `[${label}] Duplicate slug detected: "${toSlug(fileName)}" from "${slugToFile.get(slug)}" and "${fileName}"`,
      );
      continue;
    }
    slugToFile.set(slug, fileName);
  }

  const readmePath = path.join(openApiDir, README_FILE);
  const readmeContent = await fs.readFile(readmePath, "utf8");
  const readmeDocLinks = [...readmeContent.matchAll(/\[[^\]]+\]\(\.\/([^)#\s]+\.md)(?:#[^)]+)?\)/g)]
    .map((match) => match[1]);

  const readmeLinkSet = new Set(readmeDocLinks);
  for (const fileName of docFiles) {
    if (!readmeLinkSet.has(fileName)) {
      errors.push(`[${label}] README coverage missing: ${fileName} is not listed as ./<file>.md`);
    }
  }

  for (const fileName of readmeLinkSet) {
    if (!docFiles.includes(fileName)) {
      errors.push(`[${label}] README references unknown doc: ${fileName}`);
    }
  }

  for (const fileName of markdownFiles) {
    const fullPath = path.join(openApiDir, fileName);
    const content = await fs.readFile(fullPath, "utf8");
    const sourceDir = path.dirname(fullPath);

    const links = [...content.matchAll(/(?<!!)\[[^\]]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)]
      .map((match) => match[1]);

    for (const rawLink of links) {
      const trimmedLink = rawLink.trim();
      if (!trimmedLink || trimmedLink.startsWith("#") || isExternalLink(trimmedLink)) {
        continue;
      }

      const linkWithoutHash = removeHash(trimmedLink);
      if (!linkWithoutHash.toLowerCase().endsWith(".md")) {
        continue;
      }

      const directTargetPath = path.resolve(sourceDir, linkWithoutHash);
      const directTargetExists = await fileExists(directTargetPath);

      const basename = linkWithoutHash.replace(/\\/g, "/").split("/").filter(Boolean).pop();
      const fallbackTargetPath = basename ? path.join(openApiDir, basename) : "";
      const fallbackTargetExists = basename ? await fileExists(fallbackTargetPath) : false;

      if (!directTargetExists && !fallbackTargetExists) {
        errors.push(`[${label}] Broken markdown link in ${fileName}: ${rawLink}`);
      }
    }
  }

  return { errors, docCount: docFiles.length };
}

async function lintGrowattDocs() {
  const errors = [];
  let totalDocCount = 0;

  for (const { dir, label } of OPENAPI_DIRS) {
    const result = await lintGrowattDocsInDir(dir, label);
    errors.push(...result.errors);
    totalDocCount += result.docCount;
  }

  if (errors.length > 0) {
    console.error("Growatt docs lint failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`Growatt docs lint passed: ${totalDocCount} docs checked.`);
}

lintGrowattDocs().catch((error) => {
  console.error("Growatt docs lint crashed:", error);
  process.exit(1);
});
