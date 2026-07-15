jest.mock("rehype-slug", () => ({
  __esModule: true,
  default: () => undefined,
}));
jest.mock("rehype-stringify", () => ({
  __esModule: true,
  default: () => undefined,
}));
jest.mock("remark-gfm", () => ({
  __esModule: true,
  default: () => undefined,
}));
jest.mock("remark-parse", () => ({
  __esModule: true,
  default: () => undefined,
}));
jest.mock("remark-rehype", () => ({
  __esModule: true,
  default: () => undefined,
}));
jest.mock("unified", () => ({
  unified: () => {
    const processor = {
      use: () => processor,
      process: async (markdown: string) => ({
        toString: () => `<article>${markdown}</article>`,
      }),
    };
    return processor;
  },
}));
jest.mock("@/lib/growatt-docs/markdown", () => ({
  extractMarkdownTitle: (markdown: string, fallbackTitle: string) => {
    const headingMatch = markdown.match(/^#\s+(.+)$/m);
    return headingMatch ? headingMatch[1].replace(/`/g, "").trim() : fallbackTitle;
  },
}));

import {
  getShineToolsDocBySlug,
  getShineToolsDocMetas,
  getShineToolsOverview,
  rewriteShineToolsMarkdownLink,
  rewriteShineToolsMarkdownLinks,
} from "@/lib/shinetools-docs";

describe("ShineTools documentation portal", () => {
  it("publishes the controlled document registry in the expected groups", async () => {
    const docs = await getShineToolsDocMetas();

    expect(docs).toHaveLength(19);
    expect(docs.map((doc) => doc.slug)).toEqual([
      "product-handbook",
      "problem-and-users",
      "parameter-grouping",
      "configuration-flow",
      "frequency-and-priority",
      "safety-and-validation",
      "setting-contract",
      "document-conventions",
      "source-map",
      "coverage-audit",
      "deployment-and-access",
      "quick-site-setup",
      "direct-settings-platform",
      "reference-quick-setting",
      "reference-direct-mode",
      "layout-annotations-and-legacy-artifacts",
      "source-market-mod-xh",
      "source-market-min-xh",
      "source-rd",
    ]);
    expect(docs.filter((doc) => doc.group === "product")).toHaveLength(7);
    expect(docs.filter((doc) => doc.group === "current")).toHaveLength(2);
    expect(docs.filter((doc) => doc.group === "sources")).toHaveLength(3);
  });

  it("renders the overview from the Markdown source and rewrites internal links", async () => {
    const overview = await getShineToolsOverview();

    expect(overview.markdown).toContain("# ShineTools 能量管理设置导航");
    expect(overview.displayMarkdown).toContain(
      "[Handbook 导航](/shinetools/product-handbook)",
    );
    expect(overview.displayMarkdown).toContain(
      "[02 参数分组](/shinetools/parameter-grouping)",
    );
    expect(overview.displayMarkdown).toContain(
      "[全量覆盖审计](/shinetools/coverage-audit)",
    );
    expect(overview.displayMarkdown).toContain("/shinetools/quick-site-setup");
    expect(overview.html).toContain("/shinetools/coverage-audit");
  });

  it("renders module and source-audit pages from the controlled registry", async () => {
    const [handbookDoc, focusedDoc, moduleDoc, sourceDoc] = await Promise.all([
      getShineToolsDocBySlug("product-handbook"),
      getShineToolsDocBySlug("frequency-and-priority"),
      getShineToolsDocBySlug("direct-settings-platform"),
      getShineToolsDocBySlug("source-market-mod-xh"),
    ]);

    expect(handbookDoc?.group).toBe("product");
    expect(handbookDoc?.title).toContain("Handbook 导航");
    expect(handbookDoc?.displayMarkdown).toContain(
      "/shinetools/quick-site-setup",
    );
    expect(focusedDoc?.title).toContain("哪些设置高频");
    expect(focusedDoc?.displayMarkdown).toContain(
      "/shinetools/safety-and-validation",
    );
    expect(moduleDoc?.title).toContain("直连设置");
    expect(moduleDoc?.displayMarkdown).toContain(
      "[返回总导航](/shinetools)",
    );
    expect(moduleDoc?.displayMarkdown).toContain(
      "/shinetools/source-market-mod-xh",
    );
    expect(sourceDoc?.group).toBe("sources");
    expect(sourceDoc?.markdown).toContain("# Shinetools MOD XH 设置项");
    expect(sourceDoc?.markdown.startsWith("\uFEFF")).toBe(false);
  });

  it("rewrites only registered local Markdown targets", () => {
    expect(
      rewriteShineToolsMarkdownLink(
        "../sources/market-mod-xh-outline.md#section",
        "modules/02-direct-settings-platform.md",
      ),
    ).toBe("/shinetools/source-market-mod-xh#section");
    expect(
      rewriteShineToolsMarkdownLink(
        "https://q02gj5lyidv.feishu.cn/wiki/example",
        "README.md",
      ),
    ).toBe("https://q02gj5lyidv.feishu.cn/wiki/example");
    expect(
      rewriteShineToolsMarkdownLinks(
        "[Overview](../README.md)\n![Image](./preview.png)",
        "modules/01-quick-site-setup.md",
      ),
    ).toBe("[Overview](/shinetools)\n![Image](./preview.png)");
  });
});
