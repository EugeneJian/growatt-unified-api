import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { buildGrowattSlugByFileName, toGrowattDocSlug } from "./link-rewriter";
import { extractMarkdownTitle, renderGrowattMarkdownToHtml } from "./markdown";

const OPENAPI_ROOT_DIR = path.join(process.cwd(), "Growatt API", "OPENAPI");
const README_FILE_NAME = "README.md";
const NUMBERED_DOC_PATTERN = /^(\d+)_([a-z0-9_]+)\.md$/i;

export interface GrowattDocMeta {
  fileName: string;
  slug: string;
  order: number;
  title: string;
}

export interface GrowattDocPage extends GrowattDocMeta {
  markdown: string;
  html: string;
}

function formatFallbackTitle(fileName: string): string {
  return fileName
    .replace(/\.md$/i, "")
    .replace(/^\d+_/, "")
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function extractOrder(fileName: string): number {
  const match = fileName.match(NUMBERED_DOC_PATTERN);
  if (!match) {
    return Number.MAX_SAFE_INTEGER;
  }

  return Number(match[1]);
}

function compareDocFiles(a: string, b: string): number {
  const orderDiff = extractOrder(a) - extractOrder(b);
  if (orderDiff !== 0) {
    return orderDiff;
  }

  return a.localeCompare(b);
}

async function readOpenApiMarkdownFiles(): Promise<string[]> {
  const entries = await fs.readdir(OPENAPI_ROOT_DIR, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
    .map((entry) => entry.name);
}

async function readOpenApiFile(fileName: string): Promise<string> {
  const fullPath = path.join(OPENAPI_ROOT_DIR, fileName);
  return fs.readFile(fullPath, "utf8");
}

export const getGrowattDocMetas = cache(async (): Promise<GrowattDocMeta[]> => {
  const markdownFileNames = await readOpenApiMarkdownFiles();
  const docFileNames = markdownFileNames
    .filter((fileName) => fileName !== README_FILE_NAME)
    .sort(compareDocFiles);

  const docs = await Promise.all(
    docFileNames.map(async (fileName) => {
      const markdown = await readOpenApiFile(fileName);

      return {
        fileName,
        slug: toGrowattDocSlug(fileName),
        order: extractOrder(fileName),
        title: extractMarkdownTitle(markdown, formatFallbackTitle(fileName)),
      };
    }),
  );

  return docs;
});

export const getGrowattOverview = cache(async () => {
  const markdown = await readOpenApiFile(README_FILE_NAME);
  const docMetas = await getGrowattDocMetas();
  const slugByFileName = buildGrowattSlugByFileName(
    docMetas.map((doc) => doc.fileName),
  );

  const html = await renderGrowattMarkdownToHtml(markdown, { slugByFileName });

  return {
    title: extractMarkdownTitle(markdown, "Growatt Open API Documentation"),
    markdown,
    html,
  };
});

export const getGrowattDocBySlug = cache(
  async (slug: string): Promise<GrowattDocPage | null> => {
    const docs = await getGrowattDocMetas();
    const currentDoc = docs.find((doc) => doc.slug === slug);
    if (!currentDoc) {
      return null;
    }

    const markdown = await readOpenApiFile(currentDoc.fileName);
    const slugByFileName = buildGrowattSlugByFileName(
      docs.map((doc) => doc.fileName),
    );
    const html = await renderGrowattMarkdownToHtml(markdown, { slugByFileName });

    return {
      ...currentDoc,
      markdown,
      html,
    };
  },
);

export function getGrowattOpenApiRootDir(): string {
  return OPENAPI_ROOT_DIR;
}
