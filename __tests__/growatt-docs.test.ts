jest.mock("@/lib/growatt-docs/markdown", () => {
  const actualLinkRewriter = jest.requireActual(
    "@/lib/growatt-docs/link-rewriter",
  ) as typeof import("@/lib/growatt-docs/link-rewriter");

  return {
    extractMarkdownTitle: (markdown: string, fallbackTitle: string) => {
      const headingMatch = markdown.match(/^#\s+(.+)$/m);
      return headingMatch ? headingMatch[1].trim() : fallbackTitle;
    },
    renderGrowattMarkdownToHtml: async (
      markdown: string,
      { slugByFileName }: { slugByFileName: Map<string, string> },
    ) => {
      const rewritten = actualLinkRewriter.rewriteGrowattMarkdownLinks(markdown, {
        slugByFileName,
      });
      return `<article>${rewritten}</article>`;
    },
  };
});

import { getGrowattDocBySlug, getGrowattDocMetas, getGrowattOverview } from "@/lib/growatt-docs";

describe("growatt docs source-of-truth loader", () => {
  it("discovers numbered OPENAPI docs and excludes README from doc list", async () => {
    const docs = await getGrowattDocMetas();
    const fileNames = docs.map((doc) => doc.fileName);

    expect(fileNames.length).toBeGreaterThan(0);
    expect(fileNames).not.toContain("README.md");
    expect(fileNames[0]).toMatch(/^01_/);
  });

  it("loads and renders the README overview", async () => {
    const overview = await getGrowattOverview();

    expect(overview.title).toContain("Growatt");
    expect(overview.html).toContain("<article>");
    expect(overview.html).toContain("/growatt-openapi/02_api_access_token");
  });

  it("loads markdown by slug and rewrites internal markdown links", async () => {
    const docs = await getGrowattDocMetas();
    const firstDoc = docs[0];
    const page = await getGrowattDocBySlug(firstDoc.slug);

    expect(page).not.toBeNull();
    expect(page?.fileName).toBe(firstDoc.fileName);
    expect(page?.html).toContain("<article>");
    expect(page?.html).toContain("/growatt-openapi/04_api_device_auth");
  });
});
