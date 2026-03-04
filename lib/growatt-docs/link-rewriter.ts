const INTERNAL_DOC_PREFIX = "/growatt-openapi";

export interface RewriteLinkOptions {
  slugByFileName: Map<string, string>;
}

export function toGrowattDocSlug(fileName: string): string {
  return fileName.replace(/\.md$/i, "");
}

export function buildGrowattSlugByFileName(
  fileNames: string[],
): Map<string, string> {
  const slugByFileName = new Map<string, string>();

  for (const fileName of fileNames) {
    slugByFileName.set(fileName, toGrowattDocSlug(fileName));
  }

  return slugByFileName;
}

export function rewriteGrowattMarkdownLink(
  href: string,
  { slugByFileName }: RewriteLinkOptions,
): string {
  if (!href || href.startsWith("#")) {
    return href;
  }

  if (/^(https?:\/\/|mailto:|tel:)/i.test(href)) {
    return href;
  }

  const [rawPath, rawHash] = href.split("#");
  const hash = rawHash ? `#${rawHash}` : "";

  if (!rawPath.toLowerCase().endsWith(".md")) {
    return href;
  }

  const normalizedPath = rawPath.replace(/\\/g, "/");
  const fileName = normalizedPath.split("/").filter(Boolean).pop();

  if (!fileName) {
    return href;
  }

  const slug = slugByFileName.get(fileName);
  if (!slug) {
    return href;
  }

  return `${INTERNAL_DOC_PREFIX}/${slug}${hash}`;
}

export function rewriteGrowattMarkdownLinks(
  markdown: string,
  options: RewriteLinkOptions,
): string {
  if (!markdown) {
    return markdown;
  }

  return markdown.replace(
    /(?<!!)(\[[^\]]+\]\()([^)]+)(\))/g,
    (_, prefix: string, rawTarget: string, suffix: string) => {
      const trimmedTarget = rawTarget.trim();
      if (!trimmedTarget) {
        return `${prefix}${rawTarget}${suffix}`;
      }

      // Support optional markdown link title syntax: (url "title")
      const [targetHref, ...titleParts] = trimmedTarget.split(/\s+/);
      const rewrittenHref = rewriteGrowattMarkdownLink(targetHref, options);
      const titleSegment = titleParts.length > 0 ? ` ${titleParts.join(" ")}` : "";

      return `${prefix}${rewrittenHref}${titleSegment}${suffix}`;
    },
  );
}
