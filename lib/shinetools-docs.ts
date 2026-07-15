import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { extractMarkdownTitle } from "@/lib/growatt-docs/markdown";

const SHINETOOLS_ROOT_DIR = path.join(
  process.cwd(),
  "docs",
  "shinetools-settings",
);
const SHINETOOLS_ROUTE_PREFIX = "/shinetools";
const OVERVIEW_SOURCE_PATH = "README.md";

export type ShineToolsNavGroupKey =
  | "product"
  | "foundation"
  | "current"
  | "reference"
  | "governance"
  | "sources";

export interface ShineToolsNavGroup {
  key: ShineToolsNavGroupKey;
  label: string;
  description: string;
}

export interface ShineToolsDocMeta {
  slug: string;
  sourcePath: string;
  sourceFileName: string;
  title: string;
  group: ShineToolsNavGroupKey;
  order: number;
}

export interface ShineToolsDocPage extends ShineToolsDocMeta {
  markdown: string;
  displayMarkdown: string;
  html: string;
}

interface ShineToolsDocSource {
  slug: string;
  sourcePath: string;
  group: ShineToolsNavGroupKey;
  order: number;
  fallbackTitle: string;
}

interface HastNode {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

export const SHINETOOLS_NAV_GROUPS: ShineToolsNavGroup[] = [
  {
    key: "product",
    label: "产品 Handbook",
    description: "用户、分组、流程与高频策略",
  },
  {
    key: "foundation",
    label: "证据与方法",
    description: "来源、边界与覆盖审计",
  },
  {
    key: "current",
    label: "当前功能证据",
    description: "投运与详细设置模块",
  },
  {
    key: "reference",
    label: "迁移参考",
    description: "旧版结构与连续性基线",
  },
  {
    key: "governance",
    label: "来源治理",
    description: "批注、生命周期与遗留项",
  },
  {
    key: "sources",
    label: "原始来源",
    description: "由白板 JSON 生成的只读大纲",
  },
];

const SHINETOOLS_DOC_SOURCES: ShineToolsDocSource[] = [
  {
    slug: "product-handbook",
    sourcePath: "product-handbook.md",
    group: "product",
    order: 5,
    fallbackTitle: "ShineTools 能量管理设置 Handbook 导航",
  },
  {
    slug: "problem-and-users",
    sourcePath: "handbook/01-problem-and-users.md",
    group: "product",
    order: 6,
    fallbackTitle: "为什么能管设置难用，用户真正要完成什么？",
  },
  {
    slug: "parameter-grouping",
    sourcePath: "handbook/02-parameter-grouping.md",
    group: "product",
    order: 7,
    fallbackTitle: "复杂能管参数应该如何分组？",
  },
  {
    slug: "configuration-flow",
    sourcePath: "handbook/03-configuration-flow.md",
    group: "product",
    order: 8,
    fallbackTitle: "用户应该按什么顺序完成能管配置？",
  },
  {
    slug: "frequency-and-priority",
    sourcePath: "handbook/04-frequency-and-priority.md",
    group: "product",
    order: 9,
    fallbackTitle: "哪些设置高频，产品应该优先什么？",
  },
  {
    slug: "safety-and-validation",
    sourcePath: "handbook/05-safety-and-validation.md",
    group: "product",
    order: 10,
    fallbackTitle: "怎样安全写入并证明配置已经生效？",
  },
  {
    slug: "setting-contract",
    sourcePath: "handbook/06-setting-contract.md",
    group: "product",
    order: 11,
    fallbackTitle: "怎样保持一份设置事实，避免页面重复？",
  },
  {
    slug: "document-conventions",
    sourcePath: "00-document-conventions.md",
    group: "foundation",
    order: 20,
    fallbackTitle: "文档约定与整理方法",
  },
  {
    slug: "source-map",
    sourcePath: "01-source-map.md",
    group: "foundation",
    order: 30,
    fallbackTitle: "来源、视图和结构映射",
  },
  {
    slug: "coverage-audit",
    sourcePath: "02-coverage-audit.md",
    group: "foundation",
    order: 40,
    fallbackTitle: "全量覆盖审计",
  },
  {
    slug: "deployment-and-access",
    sourcePath: "03-deployment-and-access.md",
    group: "foundation",
    order: 45,
    fallbackTitle: "ShineTools 文档部署与 Zero Trust 访问管理",
  },
  {
    slug: "quick-site-setup",
    sourcePath: "modules/01-quick-site-setup.md",
    group: "current",
    order: 50,
    fallbackTitle: "Quick Site Setup 模块解析",
  },
  {
    slug: "direct-settings-platform",
    sourcePath: "modules/02-direct-settings-platform.md",
    group: "current",
    order: 60,
    fallbackTitle: "直连设置（Shinetools 平台）模块解析",
  },
  {
    slug: "reference-quick-setting",
    sourcePath: "modules/03-reference-quick-setting.md",
    group: "reference",
    order: 70,
    fallbackTitle: "quick Setting 参考版解析",
  },
  {
    slug: "reference-direct-mode",
    sourcePath: "modules/04-reference-direct-mode.md",
    group: "reference",
    order: 80,
    fallbackTitle: "直连模式参考版解析",
  },
  {
    slug: "layout-annotations-and-legacy-artifacts",
    sourcePath: "modules/05-layout-annotations-and-legacy-artifacts.md",
    group: "governance",
    order: 90,
    fallbackTitle: "标题、批注与旧版残留解析",
  },
  {
    slug: "source-market-mod-xh",
    sourcePath: "sources/market-mod-xh-outline.md",
    group: "sources",
    order: 100,
    fallbackTitle: "市场端 MOD XH 生成大纲",
  },
  {
    slug: "source-market-min-xh",
    sourcePath: "sources/market-min-xh-outline.md",
    group: "sources",
    order: 110,
    fallbackTitle: "市场端 MIN-XH 生成大纲",
  },
  {
    slug: "source-rd",
    sourcePath: "sources/rd-outline.md",
    group: "sources",
    order: 120,
    fallbackTitle: "研发端生成大纲",
  },
];

function normalizeSourcePath(sourcePath: string): string {
  return sourcePath.replace(/\\/g, "/");
}

function buildSourceRouteMap(): Map<string, string> {
  const routeBySourcePath = new Map<string, string>();
  routeBySourcePath.set(OVERVIEW_SOURCE_PATH, SHINETOOLS_ROUTE_PREFIX);

  for (const source of SHINETOOLS_DOC_SOURCES) {
    routeBySourcePath.set(
      normalizeSourcePath(source.sourcePath),
      `${SHINETOOLS_ROUTE_PREFIX}/${source.slug}`,
    );
  }

  return routeBySourcePath;
}

const SOURCE_ROUTE_MAP = buildSourceRouteMap();

export function rewriteShineToolsMarkdownLink(
  href: string,
  currentSourcePath: string,
): string {
  if (!href || href.startsWith("#")) {
    return href;
  }

  if (/^(https?:\/\/|mailto:|tel:)/i.test(href)) {
    return href;
  }

  const hashIndex = href.indexOf("#");
  const rawPath = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";

  if (!rawPath.toLowerCase().endsWith(".md")) {
    return href;
  }

  const currentDirectory = path.posix.dirname(normalizeSourcePath(currentSourcePath));
  const normalizedTarget = path.posix.normalize(
    path.posix.join(currentDirectory, normalizeSourcePath(rawPath)),
  );
  const route = SOURCE_ROUTE_MAP.get(normalizedTarget);

  return route ? `${route}${hash}` : href;
}

export function rewriteShineToolsMarkdownLinks(
  markdown: string,
  currentSourcePath: string,
): string {
  if (!markdown) {
    return markdown;
  }

  return markdown.replace(
    /(?<!!)\[([^\]]+)\]\(([^)]+)\)/g,
    (fullMatch, label: string, rawTarget: string) => {
      const trimmedTarget = rawTarget.trim();
      if (!trimmedTarget) {
        return fullMatch;
      }

      const [targetHref, ...titleParts] = trimmedTarget.split(/\s+/);
      const rewrittenHref = rewriteShineToolsMarkdownLink(
        targetHref,
        currentSourcePath,
      );
      const titleSegment = titleParts.length > 0 ? ` ${titleParts.join(" ")}` : "";

      return `[${label}](${rewrittenHref}${titleSegment})`;
    },
  );
}

function rehypeExternalLinksTargetBlank() {
  return (tree: unknown) => {
    const visit = (node: unknown): void => {
      if (!node || typeof node !== "object") {
        return;
      }

      const hastNode = node as HastNode;
      if (hastNode.type === "element" && hastNode.tagName === "a") {
        const href = hastNode.properties?.href;
        if (typeof href === "string" && /^https?:\/\//i.test(href)) {
          hastNode.properties = {
            ...hastNode.properties,
            target: "_blank",
            rel: "noopener noreferrer",
          };
        }
      }

      hastNode.children?.forEach((child) => visit(child));
    };

    visit(tree);
  };
}

function rehypeMarkMermaidBlocks() {
  return (tree: unknown) => {
    const visit = (node: unknown): void => {
      if (!node || typeof node !== "object") {
        return;
      }

      const hastNode = node as HastNode;
      if (hastNode.type === "element" && hastNode.tagName === "code") {
        const className = hastNode.properties?.className;
        if (Array.isArray(className) && className.includes("language-mermaid")) {
          hastNode.properties = {
            ...hastNode.properties,
            className: [...className, "mermaid"],
          };
        }
      }

      hastNode.children?.forEach((child) => visit(child));
    };

    visit(tree);
  };
}

async function renderShineToolsMarkdown(
  markdown: string,
  currentSourcePath: string,
): Promise<{ displayMarkdown: string; html: string }> {
  const displayMarkdown = rewriteShineToolsMarkdownLinks(
    markdown,
    currentSourcePath,
  );
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeMarkMermaidBlocks)
    .use(rehypeExternalLinksTargetBlank)
    .use(rehypeStringify)
    .process(displayMarkdown);

  return { displayMarkdown, html: String(result) };
}

async function readSource(sourcePath: string): Promise<string> {
  const content = await fs.readFile(
    path.join(SHINETOOLS_ROOT_DIR, sourcePath),
    "utf8",
  );
  return content.replace(/^\uFEFF/, "");
}

export const getShineToolsDocMetas = cache(
  async (): Promise<ShineToolsDocMeta[]> => {
    const docs = await Promise.all(
      SHINETOOLS_DOC_SOURCES.map(async (source) => {
        const markdown = await readSource(source.sourcePath);
        return {
          slug: source.slug,
          sourcePath: normalizeSourcePath(source.sourcePath),
          sourceFileName: path.basename(source.sourcePath),
          title: extractMarkdownTitle(markdown, source.fallbackTitle),
          group: source.group,
          order: source.order,
        } satisfies ShineToolsDocMeta;
      }),
    );

    return docs.sort((left, right) => left.order - right.order);
  },
);

export const getShineToolsOverview = cache(async () => {
  const markdown = await readSource(OVERVIEW_SOURCE_PATH);
  const rendered = await renderShineToolsMarkdown(markdown, OVERVIEW_SOURCE_PATH);

  return {
    title: extractMarkdownTitle(markdown, "ShineTools 能量管理设置产品文档"),
    sourcePath: OVERVIEW_SOURCE_PATH,
    markdown,
    ...rendered,
  };
});

export const getShineToolsDocBySlug = cache(
  async (slug: string): Promise<ShineToolsDocPage | null> => {
    const source = SHINETOOLS_DOC_SOURCES.find((candidate) => candidate.slug === slug);
    if (!source) {
      return null;
    }

    const markdown = await readSource(source.sourcePath);
    const rendered = await renderShineToolsMarkdown(markdown, source.sourcePath);

    return {
      slug: source.slug,
      sourcePath: normalizeSourcePath(source.sourcePath),
      sourceFileName: path.basename(source.sourcePath),
      title: extractMarkdownTitle(markdown, source.fallbackTitle),
      group: source.group,
      order: source.order,
      markdown,
      ...rendered,
    };
  },
);

export function getShineToolsRootDir(): string {
  return SHINETOOLS_ROOT_DIR;
}
