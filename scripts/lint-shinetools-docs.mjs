import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.join(process.cwd(), "docs", "shinetools-settings");

async function walkMarkdown(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walkMarkdown(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function toAnchor(heading) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .replace(/\s+/g, "-");
}

const files = await walkMarkdown(root);
const errors = [];
const contentByPath = new Map();

for (const file of files) {
  contentByPath.set(file, await fs.readFile(file, "utf8"));
}

for (const [file, content] of contentByPath) {
  const linkPattern = /(?<!!)\[[^\]]+\]\(([^)]+)\)/g;
  for (const match of content.matchAll(linkPattern)) {
    const rawTarget = match[1].trim().split(/\s+/)[0];
    if (!rawTarget || /^(https?:|mailto:|tel:)/i.test(rawTarget)) {
      continue;
    }

    const [rawPath, rawAnchor] = rawTarget.split("#", 2);
    const targetPath = rawPath
      ? path.resolve(path.dirname(file), decodeURIComponent(rawPath))
      : file;

    if (!contentByPath.has(targetPath)) {
      errors.push(`${path.relative(root, file)}: missing target ${rawTarget}`);
      continue;
    }

    if (rawAnchor) {
      const targetHeadings = contentByPath
        .get(targetPath)
        .split(/\r?\n/)
        .filter((line) => /^#{1,6}\s+/.test(line))
        .map((line) => toAnchor(line.replace(/^#{1,6}\s+/, "")));
      if (!targetHeadings.includes(decodeURIComponent(rawAnchor).toLowerCase())) {
        errors.push(`${path.relative(root, file)}: missing anchor ${rawTarget}`);
      }
    }
  }
}

const moduleFiles = files.filter((file) => path.dirname(file) === path.join(root, "modules"));
for (const file of moduleFiles) {
  const content = contentByPath.get(file);
  for (const requiredHeading of ["## Navigation", "## 来源追踪", "## 本轮整理状态"]) {
    if (!content.includes(requiredHeading)) {
      errors.push(`${path.relative(root, file)}: missing ${requiredHeading}`);
    }
  }
}

if (errors.length > 0) {
  errors.forEach((error) => console.error(error));
  process.exitCode = 1;
} else {
  console.log(
    `ShineTools docs lint passed: ${files.length} Markdown files, ${moduleFiles.length} module documents.`,
  );
}
