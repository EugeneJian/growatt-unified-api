import {
  buildGrowattSlugByFileName,
  rewriteGrowattMarkdownLink,
  rewriteGrowattMarkdownLinks,
} from "@/lib/growatt-docs/link-rewriter";

describe("growatt markdown link rewriter", () => {
  const slugByFileName = buildGrowattSlugByFileName([
    "01_authentication.md",
    "04_api_device_auth.md",
    "10_global_params.md",
  ]);

  it("rewrites cross-doc markdown links to growatt docs route", () => {
    const rewritten = rewriteGrowattMarkdownLink(
      "../04_api_device_auth.md#authorize-device",
      { slugByFileName },
    );

    expect(rewritten).toBe("/growatt-openapi/04_api_device_auth#authorize-device");
  });

  it("keeps external links unchanged", () => {
    const rewritten = rewriteGrowattMarkdownLink("https://opencloud.growatt.com", {
      slugByFileName,
    });

    expect(rewritten).toBe("https://opencloud.growatt.com");
  });

  it("rewrites markdown blocks deterministically", () => {
    const markdown = [
      "[Auth](../01_authentication.md)",
      "[Device](./04_api_device_auth.md#authorize-device)",
      "[Global](../10_global_params.md)",
    ].join("\n");

    expect(
      rewriteGrowattMarkdownLinks(markdown, {
        slugByFileName,
      }),
    ).toMatchInlineSnapshot(`
"[Auth](/growatt-openapi/01_authentication)
[Device](/growatt-openapi/04_api_device_auth#authorize-device)
[Global](/growatt-openapi/10_global_params)"
`);
  });
});
