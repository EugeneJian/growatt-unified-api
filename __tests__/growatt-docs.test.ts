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
    prepareGrowattMarkdown: (
      markdown: string,
      { slugByFileName }: { slugByFileName: Map<string, string> },
    ) => actualLinkRewriter.rewriteGrowattMarkdownLinks(markdown, { slugByFileName }),
  };
});

import {
  GROWATT_CODES_SLUG,
  getGrowattDocBySlug,
  getGrowattDocMetas,
  getGrowattCodesPage,
  getGrowattOverview,
  getGrowattQuickGuide,
  getGrowattSpecialPages,
} from "@/lib/growatt-docs";

describe("growatt docs source-of-truth loader", () => {
  it("discovers numbered OPENAPI docs and excludes README from doc list", async () => {
    const docs = await getGrowattDocMetas("en");
    const fileNames = docs.map((doc) => doc.fileName);

    expect(fileNames.length).toBeGreaterThan(0);
    expect(fileNames).not.toContain("README.md");
    expect(fileNames[0]).toMatch(/^01_/);
  });

  it("loads and renders the README overview", async () => {
    const overview = await getGrowattOverview("en");

    expect(overview.title).toContain("Growatt");
    expect(overview.html).toContain("<article>");
    expect(overview.html).toContain("/growatt-openapi/02_api_access_token");
    expect(overview.html).toContain("/growatt-openapi/growatt-codes");
    expect(overview.displayMarkdown).toContain("/growatt-openapi/02_api_access_token");
  });

  it("loads markdown by slug and rewrites internal markdown links", async () => {
    const docs = await getGrowattDocMetas("en");
    const firstDoc = docs[0];
    const page = await getGrowattDocBySlug(firstDoc.slug, "en");

    expect(page).not.toBeNull();
    expect(page?.fileName).toBe(firstDoc.fileName);
    expect(page?.html).toContain("<article>");
    expect(page?.html).toContain("/growatt-openapi/04_api_device_auth");
    expect(page?.displayMarkdown).toContain("/growatt-openapi/04_api_device_auth");
  });

  it("loads and renders quick guide markdown from Growatt API root", async () => {
    const quickGuide = await getGrowattQuickGuide("en");

    expect(quickGuide.slug).toBe("quick-guide");
    expect(quickGuide.fileName).toBe("Growatt Open API Professional Integration Guide.md");
    expect(quickGuide.title).toBe("Quick Guide");
    expect(quickGuide.html).toContain("<article>");
    expect(quickGuide.html).toContain("Integration Checklist");
    expect(quickGuide.displayMarkdown).toContain("Integration Checklist");
  });

  it("loads localized Chinese overview and doc titles", async () => {
    const [overview, docs] = await Promise.all([
      getGrowattOverview("zh-CN"),
      getGrowattDocMetas("zh-CN"),
    ]);

    expect(overview.title).toContain("文档");
    expect(docs[0]?.title).toContain("身份认证");
  });

  it("loads localized Chinese quick guide markdown", async () => {
    const quickGuide = await getGrowattQuickGuide("zh-CN");

    expect(quickGuide.fileName).toBe("Growatt Open API Professional Integration Guide.zh-CN.md");
    expect(quickGuide.title).toContain("快速指南");
    expect(quickGuide.displayMarkdown).toContain("集成检查清单");
  });

  it("loads fault-code appendix content from the enterprise SSOT", async () => {
    const codes = await getGrowattCodesPage("en");

    expect(codes.slug).toBe(GROWATT_CODES_SLUG);
    expect(codes.title).toBe("Growatt Codes");
    expect(codes.sourceFileName).toBe("growatt_fault_code_enterprise_ssot.yaml");
    expect(codes.summary.total_records).toBe(180);
    expect(codes.summary.by_severity.error).toBe(94);
    expect(codes.summary.by_severity.protect).toBe(85);
    expect(codes.summary.by_severity.warning).toBe(1);
    expect(codes.html).toContain("External customer reference");
    expect(codes.html).toContain('id="error"');
    expect(codes.html).toContain('id="error-pv-side"');
    expect(codes.html).toContain("DC arc fault has been detected");
    expect(codes.html).not.toContain("LCD Display");
  });

  it("groups fault codes by severity and preserves category/code ordering", async () => {
    const codes = await getGrowattCodesPage("en");

    expect(codes.severityGroups.map((group) => group.severity)).toEqual([
      "error",
      "protect",
      "warning",
    ]);
    expect(codes.severityGroups[0]?.categories[0]?.category).toBe("PV side");
    expect(codes.severityGroups[0]?.categories[0]?.records[0]?.code).toBe(200);
    expect(codes.severityGroups[2]?.categories[0]?.records[0]?.code).toBe(1000);
  });

  it("registers growatt codes as a special page in both locales", async () => {
    const specialPages = getGrowattSpecialPages();
    const codesZh = await getGrowattCodesPage("zh-CN");

    expect(specialPages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slug: GROWATT_CODES_SLUG,
          labelByLocale: expect.objectContaining({
            en: "🔒 Appendix: Growatt Codes",
            "zh-CN": "🔒 附录：Growatt Codes",
          }),
          placement: "afterDocs",
        }),
      ]),
    );
    expect(codesZh.html).toContain('id="protect"');
    expect(codesZh.markdown).toContain("# Growatt Codes");
  });
});
