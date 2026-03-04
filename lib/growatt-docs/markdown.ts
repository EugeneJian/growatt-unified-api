import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { rewriteGrowattMarkdownLinks } from "./link-rewriter";

interface RenderMarkdownOptions {
  slugByFileName: Map<string, string>;
}

interface HastNode {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
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

      if (Array.isArray(hastNode.children)) {
        hastNode.children.forEach((child) => visit(child));
      }
    };

    visit(tree);
  };
}

export async function renderGrowattMarkdownToHtml(
  markdown: string,
  options: RenderMarkdownOptions,
): Promise<string> {
  const rewrittenMarkdown = rewriteGrowattMarkdownLinks(markdown, {
    slugByFileName: options.slugByFileName,
  });

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeExternalLinksTargetBlank)
    .use(rehypeStringify)
    .process(rewrittenMarkdown);

  return String(result);
}

export function extractMarkdownTitle(
  markdown: string,
  fallbackTitle: string,
): string {
  const headingMatch = markdown.match(/^#\s+(.+)$/m);
  if (!headingMatch) {
    return fallbackTitle;
  }

  return headingMatch[1].replace(/`/g, "").trim();
}
