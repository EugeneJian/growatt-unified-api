import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { buildGrowattSlugByFileName, toGrowattDocSlug } from "./link-rewriter";
import { GROWATT_CODES_SLUG } from "./growatt-codes";
import {
  extractMarkdownTitle,
  prepareGrowattMarkdown,
  renderGrowattMarkdownToHtml,
} from "./markdown";
export { GROWATT_CODES_SLUG, getGrowattCodesPage } from "./growatt-codes";

const GROWATT_API_ROOT_DIR = path.join(process.cwd(), "Growatt API");
const EN_OPENAPI_ROOT_DIR = path.join(GROWATT_API_ROOT_DIR, "OPENAPI");
const ZH_OPENAPI_ROOT_DIR = path.join(GROWATT_API_ROOT_DIR, "OPENAPI.zh-CN");
const GROWATT_DOCS_ROOT_DIR = path.join(process.cwd(), "docs");
const README_FILE_NAME = "README.md";
const EN_QUICK_GUIDE_FILE_NAME = "Growatt Open API Professional Integration Guide.md";
const ZH_QUICK_GUIDE_FILE_NAME = "Growatt Open API Professional Integration Guide.zh-CN.md";
const GROWATT_SEMANTIC_MODEL_FILE_NAME = "growatt-ess-semantic-model-preliminary-review.md";
const GROWATT_SEMANTIC_MODEL_SOURCE_FILE = `docs/${GROWATT_SEMANTIC_MODEL_FILE_NAME}`;
const GROWATT_TERMINOLOGY_DOC_SLUG = "12_ess_terminology";
const NUMBERED_DOC_PATTERN = /^(\d+)_([a-z0-9_]+)\.md$/i;
export const GROWATT_QUICK_GUIDE_SLUG = "quick-guide";
export const GROWATT_APPENDIX_TERMINOLOGY_SLUG = "appendix-terminology";
export const GROWATT_SEMANTIC_MODEL_SLUG = "semantic-model";

export type GrowattDocLocale = "en" | "zh-CN";

export interface GrowattSpecialPageNavMeta {
  slug: string;
  labelByLocale: Record<GrowattDocLocale, string>;
  placement?: "beforeDocs" | "afterDocs";
  requiresDocumentNavigation?: boolean;
}

interface LocaleSourceConfig {
  openApiRootDir: string;
  quickGuideFileName: string;
  quickGuidePath: string;
  overviewFallbackTitle: string;
  quickGuideFallbackTitle: string;
}

const GROWATT_DOC_SOURCE_CONFIG: Record<GrowattDocLocale, LocaleSourceConfig> = {
  en: {
    openApiRootDir: EN_OPENAPI_ROOT_DIR,
    quickGuideFileName: EN_QUICK_GUIDE_FILE_NAME,
    quickGuidePath: path.join(GROWATT_API_ROOT_DIR, EN_QUICK_GUIDE_FILE_NAME),
    overviewFallbackTitle: "Growatt Open API Documentation",
    quickGuideFallbackTitle: "Quick Guide",
  },
  "zh-CN": {
    openApiRootDir: ZH_OPENAPI_ROOT_DIR,
    quickGuideFileName: ZH_QUICK_GUIDE_FILE_NAME,
    quickGuidePath: path.join(GROWATT_API_ROOT_DIR, ZH_QUICK_GUIDE_FILE_NAME),
    overviewFallbackTitle: "Growatt Open API 文档",
    quickGuideFallbackTitle: "快速指南",
  },
};

const APPENDIX_A_LABELS: Record<GrowattDocLocale, string> = {
  en: "Appendix A Growatt Codes",
  "zh-CN": "附录A Growatt Codes",
};

const APPENDIX_B_LABELS: Record<GrowattDocLocale, string> = {
  en: "Appendix B Glossary",
  "zh-CN": "附录B 术语表",
};

const APPENDIX_C_LABELS: Record<GrowattDocLocale, string> = {
  en: "Appendix C Semantic Model",
  "zh-CN": "附录C Semantic Model",
};

export interface GrowattDocMeta {
  fileName: string;
  slug: string;
  order: number;
  title: string;
}

export interface GrowattDocPage extends GrowattDocMeta {
  markdown: string;
  displayMarkdown: string;
  html: string;
}

export interface GrowattQuickGuidePage {
  slug: string;
  fileName: string;
  title: string;
  markdown: string;
  displayMarkdown: string;
  html: string;
}

export interface GrowattSpecialMarkdownPage {
  slug: string;
  fileName: string;
  title: string;
  markdown: string;
  displayMarkdown: string;
  html: string;
}

export function getGrowattSpecialPages(): GrowattSpecialPageNavMeta[] {
  return [
    {
      slug: GROWATT_QUICK_GUIDE_SLUG,
      labelByLocale: { en: "Quick Guide", "zh-CN": "快速指南" },
      placement: "beforeDocs",
    },
    {
      slug: GROWATT_CODES_SLUG,
      labelByLocale: {
        en: APPENDIX_A_LABELS.en,
        "zh-CN": APPENDIX_A_LABELS["zh-CN"],
      },
      placement: "afterDocs",
      requiresDocumentNavigation: true,
    },
    {
      slug: GROWATT_APPENDIX_TERMINOLOGY_SLUG,
      labelByLocale: {
        en: APPENDIX_B_LABELS.en,
        "zh-CN": APPENDIX_B_LABELS["zh-CN"],
      },
      placement: "afterDocs",
    },
    {
      slug: GROWATT_SEMANTIC_MODEL_SLUG,
      labelByLocale: {
        en: APPENDIX_C_LABELS.en,
        "zh-CN": APPENDIX_C_LABELS["zh-CN"],
      },
      placement: "afterDocs",
    },
  ];
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

function getLocaleSourceConfig(locale: GrowattDocLocale): LocaleSourceConfig {
  return GROWATT_DOC_SOURCE_CONFIG[locale];
}

async function readOpenApiMarkdownFiles(locale: GrowattDocLocale): Promise<string[]> {
  const entries = await fs.readdir(getLocaleSourceConfig(locale).openApiRootDir, {
    withFileTypes: true,
  });

  return entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
    .map((entry) => entry.name);
}

async function readOpenApiFile(fileName: string, locale: GrowattDocLocale): Promise<string> {
  const fullPath = path.join(getLocaleSourceConfig(locale).openApiRootDir, fileName);
  return fs.readFile(fullPath, "utf8");
}

export const getGrowattDocMetas = cache(
  async (locale: GrowattDocLocale = "en"): Promise<GrowattDocMeta[]> => {
    const markdownFileNames = await readOpenApiMarkdownFiles(locale);
    const docFileNames = markdownFileNames
      .filter((fileName) => fileName !== README_FILE_NAME)
      .sort(compareDocFiles);

    const docs = await Promise.all(
      docFileNames.map(async (fileName) => {
        const markdown = await readOpenApiFile(fileName, locale);

        return {
          fileName,
          slug: toGrowattDocSlug(fileName),
          order: extractOrder(fileName),
          title: extractMarkdownTitle(markdown, formatFallbackTitle(fileName)),
        };
      }),
    );

    return docs;
  },
);

export const getGrowattOverview = cache(async (locale: GrowattDocLocale = "en") => {
  const sourceConfig = getLocaleSourceConfig(locale);
  const markdown = await readOpenApiFile(README_FILE_NAME, locale);
  const docMetas = await getGrowattDocMetas(locale);
  const slugByFileName = buildGrowattSlugByFileName(docMetas.map((doc) => doc.fileName));

  const displayMarkdown = prepareGrowattMarkdown(markdown, { slugByFileName });
  const html = await renderGrowattMarkdownToHtml(displayMarkdown, { slugByFileName });

  return {
    title: extractMarkdownTitle(markdown, sourceConfig.overviewFallbackTitle),
    markdown,
    displayMarkdown,
    html,
  };
});

export const getGrowattDocBySlug = cache(
  async (
    slug: string,
    locale: GrowattDocLocale = "en",
  ): Promise<GrowattDocPage | null> => {
    const docs = await getGrowattDocMetas(locale);
    const currentDoc = docs.find((doc) => doc.slug === slug);
    if (!currentDoc) {
      return null;
    }

    const markdown = await readOpenApiFile(currentDoc.fileName, locale);
    const slugByFileName = buildGrowattSlugByFileName(docs.map((doc) => doc.fileName));
    const displayMarkdown = prepareGrowattMarkdown(markdown, { slugByFileName });
    const html = await renderGrowattMarkdownToHtml(displayMarkdown, { slugByFileName });

    return {
      ...currentDoc,
      markdown,
      displayMarkdown,
      html,
    };
  },
);

export const getGrowattQuickGuide = cache(
  async (locale: GrowattDocLocale = "en"): Promise<GrowattQuickGuidePage> => {
    const sourceConfig = getLocaleSourceConfig(locale);
    const [docMetas, markdown] = await Promise.all([
      getGrowattDocMetas(locale),
      fs.readFile(sourceConfig.quickGuidePath, "utf8"),
    ]);

    const slugByFileName = buildGrowattSlugByFileName(docMetas.map((doc) => doc.fileName));
    const displayMarkdown = prepareGrowattMarkdown(markdown, { slugByFileName });
    const html = await renderGrowattMarkdownToHtml(displayMarkdown, { slugByFileName });

    return {
      slug: GROWATT_QUICK_GUIDE_SLUG,
      fileName: sourceConfig.quickGuideFileName,
      title: extractMarkdownTitle(markdown, sourceConfig.quickGuideFallbackTitle),
      markdown,
      displayMarkdown,
      html,
    };
  },
);

export const getGrowattAppendixTerminologyPage = cache(
  async (locale: GrowattDocLocale = "en"): Promise<GrowattSpecialMarkdownPage> => {
    const glossaryPage = await getGrowattDocBySlug(GROWATT_TERMINOLOGY_DOC_SLUG, locale);
    if (!glossaryPage) {
      throw new Error(`Missing Growatt terminology doc for slug: ${GROWATT_TERMINOLOGY_DOC_SLUG}`);
    }

    return {
      slug: GROWATT_APPENDIX_TERMINOLOGY_SLUG,
      fileName: glossaryPage.fileName,
      title: APPENDIX_B_LABELS[locale],
      markdown: glossaryPage.markdown,
      displayMarkdown: glossaryPage.displayMarkdown,
      html: glossaryPage.html,
    };
  },
);

export const getGrowattSemanticModelPage = cache(
  async (locale: GrowattDocLocale = "en"): Promise<GrowattSpecialMarkdownPage> => {
    const [docMetas, markdown] = await Promise.all([
      getGrowattDocMetas(locale),
      fs.readFile(path.join(GROWATT_DOCS_ROOT_DIR, GROWATT_SEMANTIC_MODEL_FILE_NAME), "utf8"),
    ]);

    const slugByFileName = buildGrowattSlugByFileName(docMetas.map((doc) => doc.fileName));
    const displayMarkdown = prepareGrowattMarkdown(markdown, { slugByFileName });
    const html = await renderGrowattMarkdownToHtml(displayMarkdown, { slugByFileName });

    return {
      slug: GROWATT_SEMANTIC_MODEL_SLUG,
      fileName: GROWATT_SEMANTIC_MODEL_SOURCE_FILE,
      title: APPENDIX_C_LABELS[locale],
      markdown,
      displayMarkdown,
      html,
    };
  },
);

export function getGrowattOpenApiRootDir(locale: GrowattDocLocale = "en"): string {
  return getLocaleSourceConfig(locale).openApiRootDir;
}
