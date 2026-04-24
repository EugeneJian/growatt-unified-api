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
const GUIDE_FILES = [
  {
    label: "guide-en",
    file: path.join(
      process.cwd(),
      "Growatt API",
      "Growatt Open API Professional Integration Guide.md",
    ),
  },
  {
    label: "guide-zh-CN",
    file: path.join(
      process.cwd(),
      "Growatt API",
      "Growatt Open API Professional Integration Guide.zh-CN.md",
    ),
  },
];
const README_OPTIONAL_DOC_FILES = new Set([
  "12_ess_terminology.md",
  "14_appendix_d_openapi_support_scope.md",
]);
const FORBIDDEN_OFFICIAL_DOC_PATTERN = /9290/;
const UNMASKED_TOKEN_FIELD_PATTERN =
  /"(access_token|refresh_token)"\s*:\s*"(?!<masked_(?:access|refresh)_token>")[^"]{16,}"/;
const UNMASKED_CLIENT_SECRET_PATTERN =
  /"client_secret"\s*:\s*"(?!<masked_client_secret>")[^"]+"/;
const UNMASKED_AUTH_CODE_PATTERN =
  /"code"\s*:\s*"(?!<masked_authorization_code>")[^"]+"/;
const NON_PLACEHOLDER_CLIENT_ID_PATTERN =
  /"client_id"\s*:\s*"(?!<example_client_id>")[^"]+"/;

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

function scanOfficialDocForForbiddenMarkers(content, relativePath, label) {
  const errors = [];
  const lines = content.split(/\r?\n/);

  for (const [index, line] of lines.entries()) {
    if (FORBIDDEN_OFFICIAL_DOC_PATTERN.test(line)) {
      errors.push(
        `[${label}] Official docs must stay environment-neutral: found "9290" in ${relativePath}:${index + 1}`,
      );
    }

    if (UNMASKED_TOKEN_FIELD_PATTERN.test(line)) {
      errors.push(
        `[${label}] Official docs must not expose full token examples: ${relativePath}:${index + 1}`,
      );
    }

    if (UNMASKED_CLIENT_SECRET_PATTERN.test(line)) {
      errors.push(
        `[${label}] Official docs must not expose full client_secret examples: ${relativePath}:${index + 1}`,
      );
    }

    if (UNMASKED_AUTH_CODE_PATTERN.test(line)) {
      errors.push(
        `[${label}] Official docs must not expose full authorization code examples: ${relativePath}:${index + 1}`,
      );
    }

    if (NON_PLACEHOLDER_CLIENT_ID_PATTERN.test(line)) {
      errors.push(
        `[${label}] Official docs must use a placeholder for client_id examples: ${relativePath}:${index + 1}`,
      );
    }
  }

  return errors;
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
    if (README_OPTIONAL_DOC_FILES.has(fileName)) {
      continue;
    }

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
    const relativePath = path.relative(process.cwd(), fullPath);

    errors.push(...scanOfficialDocForForbiddenMarkers(content, relativePath, label));

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

async function lintGuideFile(filePath, label) {
  const content = await fs.readFile(filePath, "utf8");
  const relativePath = path.relative(process.cwd(), filePath);
  const errors = scanOfficialDocForForbiddenMarkers(content, relativePath, label);
  return { errors, docCount: 1 };
}

async function lintGrowattDocs() {
  const errors = [];
  let totalDocCount = 0;

  for (const { dir, label } of OPENAPI_DIRS) {
    const result = await lintGrowattDocsInDir(dir, label);
    errors.push(...result.errors);
    totalDocCount += result.docCount;
  }

  for (const { file, label } of GUIDE_FILES) {
    const result = await lintGuideFile(file, label);
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
