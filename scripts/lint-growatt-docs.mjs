#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";

const OPENAPI_DIR = path.join(process.cwd(), "Growatt API", "OPENAPI");
const README_FILE = "README.md";
const DOC_FILE_PATTERN = /^(\d{2})_[a-z0-9_]+\.md$/;

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

async function lintGrowattDocs() {
  const entries = await fs.readdir(OPENAPI_DIR, { withFileTypes: true });
  const markdownFiles = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
    .map((entry) => entry.name)
    .sort();

  const docFiles = markdownFiles.filter((fileName) => fileName !== README_FILE);
  const errors = [];

  for (const fileName of docFiles) {
    if (!DOC_FILE_PATTERN.test(fileName)) {
      errors.push(
        `Invalid file name "${fileName}". Expected pattern: NN_descriptive_name.md`,
      );
    }
  }

  const slugToFile = new Map();
  for (const fileName of docFiles) {
    const slug = toSlug(fileName).toLowerCase();
    if (slugToFile.has(slug)) {
      errors.push(
        `Duplicate slug detected: "${toSlug(fileName)}" from "${slugToFile.get(slug)}" and "${fileName}"`,
      );
      continue;
    }
    slugToFile.set(slug, fileName);
  }

  const readmePath = path.join(OPENAPI_DIR, README_FILE);
  const readmeContent = await fs.readFile(readmePath, "utf8");
  const readmeDocLinks = [...readmeContent.matchAll(/\[[^\]]+\]\(\.\/([^)#\s]+\.md)(?:#[^)]+)?\)/g)]
    .map((match) => match[1]);

  const readmeLinkSet = new Set(readmeDocLinks);
  for (const fileName of docFiles) {
    if (!readmeLinkSet.has(fileName)) {
      errors.push(`README coverage missing: ${fileName} is not listed as ./<file>.md`);
    }
  }

  for (const fileName of readmeLinkSet) {
    if (!docFiles.includes(fileName)) {
      errors.push(`README references unknown doc: ${fileName}`);
    }
  }

  for (const fileName of markdownFiles) {
    const fullPath = path.join(OPENAPI_DIR, fileName);
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

      // Legacy tolerance: some files currently use ../xx.md while source files live in OPENAPI/.
      const basename = linkWithoutHash.replace(/\\/g, "/").split("/").filter(Boolean).pop();
      const fallbackTargetPath = basename ? path.join(OPENAPI_DIR, basename) : "";
      const fallbackTargetExists = basename ? await fileExists(fallbackTargetPath) : false;

      if (!directTargetExists && !fallbackTargetExists) {
        errors.push(`Broken markdown link in ${fileName}: ${rawLink}`);
      }
    }
  }

  if (errors.length > 0) {
    console.error("Growatt docs lint failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`Growatt docs lint passed: ${docFiles.length} docs checked.`);
}

lintGrowattDocs().catch((error) => {
  console.error("Growatt docs lint crashed:", error);
  process.exit(1);
});
