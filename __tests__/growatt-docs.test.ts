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
  GROWATT_APPENDIX_TERMINOLOGY_SLUG,
  GROWATT_CODES_SLUG,
  GROWATT_QUICK_GUIDE_SLUG,
  GROWATT_SEMANTIC_MODEL_SLUG,
  getGrowattAppendixTerminologyPage,
  getGrowattCodesPage,
  getGrowattDocBySlug,
  getGrowattDocMetas,
  getGrowattOverview,
  getGrowattQuickGuide,
  getGrowattSemanticModelPage,
  getGrowattSpecialPages,
} from "@/lib/growatt-docs";

const EXPECTED_MERMAID_COUNTS_BY_SLUG = {
  "01_authentication": 2,
  "02_api_access_token": 1,
  "03_api_refresh": 2,
  "04_api_device_auth": 1,
  "05_api_device_dispatch": 1,
  "06_api_read_dispatch": 2,
  "07_api_device_info": 2,
  "08_api_device_data": 2,
  "09_api_device_push": 1,
  "10_global_params": 2,
  "11_api_troubleshooting": 0,
} as const;

function countMermaidBlocks(markdown: string | null | undefined) {
  return markdown?.match(/```mermaid/g)?.length ?? 0;
}

describe("growatt docs source-of-truth loader", () => {
  it("discovers numbered OPENAPI docs and excludes README plus appendix-only glossary from doc list", async () => {
    const docs = await getGrowattDocMetas("en");
    const fileNames = docs.map((doc) => doc.fileName);

    expect(fileNames.length).toBeGreaterThan(0);
    expect(fileNames).not.toContain("README.md");
    expect(fileNames).not.toContain("12_ess_terminology.md");
    expect(fileNames[0]).toMatch(/^01_/);
  });

  it("loads and renders the README overview", async () => {
    const overview = await getGrowattOverview("en");

    expect(overview.title).toContain("Growatt");
    expect(overview.html).toContain("<article>");
    expect(overview.html).toContain("/growatt-openapi/02_api_access_token");
    expect(overview.html).toContain("/growatt-openapi/growatt-codes");
    expect(overview.html).toContain("/growatt-openapi/appendix-terminology");
    expect(overview.html).toContain("/growatt-openapi/semantic-model");
    expect(overview.displayMarkdown).toContain("/growatt-openapi/02_api_access_token");
    expect(overview.displayMarkdown).toContain("/growatt-openapi/growatt-codes");
    expect(overview.displayMarkdown).toContain("/growatt-openapi/appendix-terminology");
    expect(overview.displayMarkdown).toContain("/growatt-openapi/semantic-model");
    expect(overview.displayMarkdown).not.toContain("12_ess_terminology");
    expect(overview.displayMarkdown.indexOf("/growatt-openapi/growatt-codes")).toBeLessThan(
      overview.displayMarkdown.indexOf("/growatt-openapi/appendix-terminology"),
    );
    expect(overview.displayMarkdown.indexOf("/growatt-openapi/appendix-terminology")).toBeLessThan(
      overview.displayMarkdown.indexOf("/growatt-openapi/semantic-model"),
    );
    expect(overview.markdown).not.toContain("Baseline source:");
    expect(overview.markdown).not.toContain("vendor baseline");
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

  it("loads and renders the English quick guide from the Growatt API root", async () => {
    const quickGuide = await getGrowattQuickGuide("en");

    expect(quickGuide.slug).toBe(GROWATT_QUICK_GUIDE_SLUG);
    expect(quickGuide.fileName).toBe("Growatt Open API Professional Integration Guide.md");
    expect(quickGuide.title).toBe("Growatt Open API Professional Integration Guide");
    expect(quickGuide.html).toContain("<article>");
    expect(quickGuide.displayMarkdown).toContain("/growatt-openapi/appendix-terminology");
    expect(quickGuide.displayMarkdown).not.toContain("12_ess_terminology");
    expect(quickGuide.markdown).toContain("## 5 Integration Observations");
    expect(quickGuide.markdown).toContain("## 6 Integration Checklist");
    expect(quickGuide.markdown).not.toContain("Baseline source:");
    expect(quickGuide.markdown).not.toContain("vendor baseline");
  });

  it("loads localized Chinese overview and doc titles without mojibake", async () => {
    const [overview, docs] = await Promise.all([
      getGrowattOverview("zh-CN"),
      getGrowattDocMetas("zh-CN"),
    ]);

    expect(overview.title).toBe("Growatt Open API 文档");
    expect(docs[0]?.title).toContain("身份认证");
    expect(overview.markdown).not.toContain("基线来源：");
    expect(overview.markdown).not.toContain("厂商基线");
  });

  it("loads localized Chinese quick guide markdown", async () => {
    const quickGuide = await getGrowattQuickGuide("zh-CN");

    expect(quickGuide.fileName).toBe(
      "Growatt Open API Professional Integration Guide.zh-CN.md",
    );
    expect(quickGuide.title).toBe("Growatt Open API 专业集成指南");
    expect(quickGuide.displayMarkdown).toContain("/growatt-openapi/appendix-terminology");
    expect(quickGuide.displayMarkdown).not.toContain("12_ess_terminology");
    expect(quickGuide.markdown).toContain("## 5 联调观察");
    expect(quickGuide.markdown).toContain("## 6 集成检查清单");
    expect(quickGuide.markdown).not.toContain("基线来源：");
    expect(quickGuide.markdown).not.toContain("厂商基线");
  });

  it("publishes appendix A/B/C links in both overview locales", async () => {
    const [overviewEn, overviewZh] = await Promise.all([
      getGrowattOverview("en"),
      getGrowattOverview("zh-CN"),
    ]);

    for (const overview of [overviewEn, overviewZh]) {
      expect(overview.displayMarkdown).toContain("/growatt-openapi/growatt-codes");
      expect(overview.displayMarkdown).toContain("/growatt-openapi/appendix-terminology");
      expect(overview.displayMarkdown).toContain("/growatt-openapi/semantic-model");
      expect(overview.displayMarkdown.indexOf("/growatt-openapi/growatt-codes")).toBeLessThan(
        overview.displayMarkdown.indexOf("/growatt-openapi/appendix-terminology"),
      );
      expect(overview.displayMarkdown.indexOf("/growatt-openapi/appendix-terminology")).toBeLessThan(
        overview.displayMarkdown.indexOf("/growatt-openapi/semantic-model"),
      );
    }
  });

  it("loads appendix terminology alias pages and the shared semantic model page", async () => {
    const [appendixTermEn, appendixTermZh, semanticEn, semanticZh] = await Promise.all([
      getGrowattAppendixTerminologyPage("en"),
      getGrowattAppendixTerminologyPage("zh-CN"),
      getGrowattSemanticModelPage("en"),
      getGrowattSemanticModelPage("zh-CN"),
    ]);

    expect(appendixTermEn.slug).toBe(GROWATT_APPENDIX_TERMINOLOGY_SLUG);
    expect(appendixTermZh.slug).toBe(GROWATT_APPENDIX_TERMINOLOGY_SLUG);
    expect(appendixTermEn.fileName).toBe("12_ess_terminology.md");
    expect(appendixTermZh.fileName).toBe("12_ess_terminology.md");
    expect(appendixTermEn.title).toBe("Appendix B Glossary");
    expect(appendixTermZh.title).toBe("附录B 术语表");
    expect(appendixTermEn.markdown).toContain("state of charge (SOC)");
    expect(appendixTermZh.markdown).toContain("公开术语表");
    expect(appendixTermEn.displayMarkdown).not.toContain("12_ess_terminology");

    expect(semanticEn.slug).toBe(GROWATT_SEMANTIC_MODEL_SLUG);
    expect(semanticZh.slug).toBe(GROWATT_SEMANTIC_MODEL_SLUG);
    expect(semanticEn.fileName).toBe("docs/growatt-ess-semantic-model-preliminary-review.md");
    expect(semanticZh.fileName).toBe("docs/growatt-ess-semantic-model-preliminary-review.md");
    expect(semanticEn.title).toBe("Appendix C Semantic Model");
    expect(semanticZh.title).toBe("附录C Semantic Model");
    expect(semanticEn.markdown).toBe(semanticZh.markdown);
    expect(semanticEn.markdown).toContain("# Growatt ESS Semantic Model and Dispatch Specification");
    expect(semanticEn.markdown).toContain("**Status**: Public Standard");
    expect(semanticEn.markdown).not.toContain("Amber / AGL / Origin / Evergen");
    expect(semanticEn.markdown).not.toContain("对外口径");
    expect(countMermaidBlocks(semanticEn.markdown)).toBeGreaterThan(0);
  });

  it("restores expected Mermaid diagrams across overview, endpoint docs, and quick guide", async () => {
    const locales = ["en", "zh-CN"] as const;

    for (const locale of locales) {
      const [overview, quickGuide] = await Promise.all([
        getGrowattOverview(locale),
        getGrowattQuickGuide(locale),
      ]);

      expect(countMermaidBlocks(overview.markdown)).toBe(2);
      expect(countMermaidBlocks(quickGuide.markdown)).toBe(1);

      for (const [slug, expectedCount] of Object.entries(EXPECTED_MERMAID_COUNTS_BY_SLUG)) {
        const page = await getGrowattDocBySlug(slug, locale);

        expect(page).not.toBeNull();
        expect(countMermaidBlocks(page?.markdown)).toBe(expectedCount);
      }
    }
  });

  it("keeps the bilingual ESS glossary available only through appendix B", async () => {
    const [docsEn, docsZh, glossaryEn, glossaryZh, appendixEn, appendixZh] = await Promise.all([
      getGrowattDocMetas("en"),
      getGrowattDocMetas("zh-CN"),
      getGrowattDocBySlug("12_ess_terminology", "en"),
      getGrowattDocBySlug("12_ess_terminology", "zh-CN"),
      getGrowattAppendixTerminologyPage("en"),
      getGrowattAppendixTerminologyPage("zh-CN"),
    ]);

    expect(docsEn.map((doc) => doc.fileName)).not.toContain("12_ess_terminology.md");
    expect(docsZh.map((doc) => doc.fileName)).not.toContain("12_ess_terminology.md");
    expect(glossaryEn).toBeNull();
    expect(glossaryZh).toBeNull();
    expect(appendixEn.title).toBe("Appendix B Glossary");
    expect(appendixZh.title).toBe("附录B 术语表");
    expect(appendixEn.markdown).toContain("state of charge (SOC)");
    expect(appendixEn.markdown).toContain("Export Limit");
    expect(appendixZh.markdown).toContain("state of charge (SOC)");
    expect(appendixZh.markdown).not.toContain("基线来源：");
  });

  it("registers quick guide and appendix A/B/C special pages in navigation order", () => {
    const specialPages = getGrowattSpecialPages();

    expect(specialPages.map((page) => page.slug)).toEqual([
      GROWATT_QUICK_GUIDE_SLUG,
      GROWATT_CODES_SLUG,
      GROWATT_APPENDIX_TERMINOLOGY_SLUG,
      GROWATT_SEMANTIC_MODEL_SLUG,
    ]);
    expect(specialPages[0]).toEqual(
      expect.objectContaining({
        slug: GROWATT_QUICK_GUIDE_SLUG,
        labelByLocale: expect.objectContaining({
          en: "Quick Guide",
          "zh-CN": "快速指南",
        }),
        placement: "beforeDocs",
      }),
    );
    expect(specialPages[1]).toEqual(
      expect.objectContaining({
        slug: GROWATT_CODES_SLUG,
        labelByLocale: expect.objectContaining({
          en: "Appendix A Growatt Codes",
          "zh-CN": "附录A Growatt Codes",
        }),
        placement: "afterDocs",
      }),
    );
    expect(specialPages[2]).toEqual(
      expect.objectContaining({
        slug: GROWATT_APPENDIX_TERMINOLOGY_SLUG,
        labelByLocale: expect.objectContaining({
          en: "Appendix B Glossary",
          "zh-CN": "附录B 术语表",
        }),
        placement: "afterDocs",
      }),
    );
    expect(specialPages[3]).toEqual(
      expect.objectContaining({
        slug: GROWATT_SEMANTIC_MODEL_SLUG,
        labelByLocale: expect.objectContaining({
          en: "Appendix C Semantic Model",
          "zh-CN": "附录C Semantic Model",
        }),
        placement: "afterDocs",
      }),
    );
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

  it("keeps redirect_uri in both token grant examples", async () => {
    const [tokenDocEn, tokenDocZh] = await Promise.all([
      getGrowattDocBySlug("02_api_access_token", "en"),
      getGrowattDocBySlug("02_api_access_token", "zh-CN"),
    ]);

    expect(tokenDocEn).not.toBeNull();
    expect(tokenDocZh).not.toBeNull();
    expect(tokenDocEn?.markdown.match(/redirect_uri/g)?.length ?? 0).toBeGreaterThanOrEqual(3);
    expect(tokenDocZh?.markdown.match(/redirect_uri/g)?.length ?? 0).toBeGreaterThanOrEqual(3);
  });

  it("marks readDeviceDispatch requestId as required in both locales", async () => {
    const [readDispatchEn, readDispatchZh] = await Promise.all([
      getGrowattDocBySlug("06_api_read_dispatch", "en"),
      getGrowattDocBySlug("06_api_read_dispatch", "zh-CN"),
    ]);

    expect(readDispatchEn).not.toBeNull();
    expect(readDispatchZh).not.toBeNull();
    expect(readDispatchEn?.markdown).toContain("| `requestId` | string | Yes |");
    expect(readDispatchZh?.markdown).toContain("| `requestId` | string | 是 |");
  });

  it("keeps global parameters and response codes aligned in the published docs", async () => {
    const [globalParamsEn, globalParamsZh] = await Promise.all([
      getGrowattDocBySlug("10_global_params", "en"),
      getGrowattDocBySlug("10_global_params", "zh-CN"),
    ]);

    expect(globalParamsEn).not.toBeNull();
    expect(globalParamsZh).not.toBeNull();
    expect(globalParamsEn?.markdown).toContain("Response Format Example");
    expect(globalParamsEn?.markdown).toContain("| Scenario | `code` | `data` | `message` |");

    for (const page of [globalParamsEn, globalParamsZh]) {
      expect(page).not.toBeNull();
      expect(page?.markdown).toContain("opencloud-test-au.growatt.com");
      expect(page?.markdown).toContain("READ_DEVICE_PARAM_FAIL");
      expect(page?.markdown).toContain("time_slot_charge_discharge");
      expect(page?.markdown).toContain("duration_and_power_charge_discharge");
      expect(page?.markdown).toContain("anti_backflow");
      expect(page?.markdown).not.toContain("enable_control");
      expect(page?.markdown).toContain('"message": "RESPONSE_MESSAGE"');
      expect(page?.markdown).toContain("`code` | `data` | `message`");
      expect(page?.markdown).toContain('| `18` | `null` | `"READ_DEVICE_PARAM_FAIL"` |');
      expect(page?.markdown).toContain('| `105` | `null` | `"TOO_MANY_REQUEST"` |');
    }
  });

  it("publishes push payloads directly instead of reusing query-model wording", async () => {
    const [pushDocEn, pushDocZh] = await Promise.all([
      getGrowattDocBySlug("09_api_device_push", "en"),
      getGrowattDocBySlug("09_api_device_push", "zh-CN"),
    ]);

    for (const page of [pushDocEn, pushDocZh]) {
      expect(page).not.toBeNull();
      expect(page?.markdown).toContain('"dataType": "dfcData"');
      expect(page?.markdown).toContain('"deviceSn": "DEVICE_SN_1"');
      expect(page?.markdown).not.toContain("same as the query model");
      expect(page?.markdown).not.toContain("same model as query");
      expect(page?.markdown).not.toContain("与查询模型一致");
    }
  });

  it("adds example columns and concrete values to device-data query tables", async () => {
    const [queryDocEn, queryDocZh] = await Promise.all([
      getGrowattDocBySlug("08_api_device_data", "en"),
      getGrowattDocBySlug("08_api_device_data", "zh-CN"),
    ]);

    expect(queryDocEn).not.toBeNull();
    expect(queryDocZh).not.toBeNull();

    expect(queryDocEn?.markdown).toContain("| Parameter | Type | Description | Example |");
    expect(queryDocEn?.markdown).toContain('| `data.reactivePower` | double | Reactive power (positive: capacitive, negative: inductive) | `174.90` |');
    expect(queryDocEn?.markdown).toContain('| `data.vac1` | double | Line voltage 1 in V | `236.90` |');
    expect(queryDocEn?.markdown).toContain('| `message` | string | Response description | `"SUCCESSFUL_OPERATION"` |');

    expect(queryDocZh?.markdown).toContain("| 参数名 | 类型 | 说明 | 示例 |");
    expect(queryDocZh?.markdown).toContain('| `data.reactivePower` | double | 无功功率（正值：容性，负值：感性） | `174.90` |');
    expect(queryDocZh?.markdown).toContain('| `data.vac1` | double | 线电压 1，单位 V | `236.90` |');
    expect(queryDocZh?.markdown).toContain('| `message` | string | 返回说明 | `"SUCCESSFUL_OPERATION"` |');
  });

  it("adds example columns and nested battery details to device-info tables", async () => {
    const [infoDocEn, infoDocZh] = await Promise.all([
      getGrowattDocBySlug("07_api_device_info", "en"),
      getGrowattDocBySlug("07_api_device_info", "zh-CN"),
    ]);

    expect(infoDocEn).not.toBeNull();
    expect(infoDocZh).not.toBeNull();

    expect(infoDocEn?.markdown).toContain("| Parameter | Type | Description | Example |");
    expect(infoDocEn?.markdown).toContain('| `deviceTypeName` | string | Device type name | `"min"` |');
    expect(infoDocEn?.markdown).toContain('| `existBattery` | boolean | Whether the device has a battery | `true` |');
    expect(infoDocEn?.markdown).toContain('| `batteryList[].batteryNominalPower` | int | Battery rated power in W | `2500` |');

    expect(infoDocZh?.markdown).toContain("| 参数名 | 类型 | 说明 | 示例 |");
    expect(infoDocZh?.markdown).toContain('| `deviceTypeName` | string | 设备大类型名称 | `"min"` |');
    expect(infoDocZh?.markdown).toContain('| `existBattery` | boolean | 是否有电池 | `true` |');
    expect(infoDocZh?.markdown).toContain('| `batteryList[].batteryNominalPower` | int | 电池额定功率，单位 W | `2500` |');
  });

  it("standardizes ESS terminology in the reviewed English docs without renaming vendor keys", async () => {
    const [authDoc, infoDoc, dataDoc, pushDoc, globalDoc, faqDoc] = await Promise.all([
      getGrowattDocBySlug("04_api_device_auth", "en"),
      getGrowattDocBySlug("07_api_device_info", "en"),
      getGrowattDocBySlug("08_api_device_data", "en"),
      getGrowattDocBySlug("09_api_device_push", "en"),
      getGrowattDocBySlug("10_global_params", "en"),
      getGrowattDocBySlug("11_api_troubleshooting", "en"),
    ]);

    expect(authDoc).not.toBeNull();
    expect(infoDoc).not.toBeNull();
    expect(dataDoc).not.toBeNull();
    expect(pushDoc).not.toBeNull();
    expect(globalDoc).not.toBeNull();
    expect(faqDoc).not.toBeNull();

    expect(authDoc?.markdown).toContain("Rated inverter power in W");
    expect(authDoc?.markdown).toContain("Datalogger serial number");

    expect(infoDoc?.markdown).toContain("Rated inverter power in W");
    expect(infoDoc?.markdown).toContain("Battery rated capacity in Wh");
    expect(infoDoc?.markdown).toContain("Battery rated power in W");
    expect(infoDoc?.markdown).toContain("`batteryNominalPower`");

    expect(dataDoc?.markdown).toContain(
      "Grid meter power. Positive means grid import and negative means grid export, unit: W",
    );
    expect(pushDoc?.markdown).toContain(
      "Grid meter power. Positive means grid import and negative means grid export, unit: W",
    );
    expect(dataDoc?.markdown).toContain("Battery state of charge (SOC) in percent");
    expect(pushDoc?.markdown).toContain("Battery state of health (SOH) `[0,100]`");
    expect(dataDoc?.markdown).toContain("grid-connected");
    expect(pushDoc?.markdown).toContain("grid-connected");
    expect(dataDoc?.markdown).toContain("`data.payLoadPower`");

    expect(globalDoc?.markdown).toContain("Export Limit.");
    expect(globalDoc?.markdown).toContain("`anti_backflow`");

    expect(faqDoc?.displayMarkdown).toContain(
      "[ESS Terminology Glossary](/growatt-openapi/appendix-terminology)",
    );
  });

  it("renders device-dispatch response outcomes as tables", async () => {
    const [dispatchDocEn, dispatchDocZh] = await Promise.all([
      getGrowattDocBySlug("05_api_device_dispatch", "en"),
      getGrowattDocBySlug("05_api_device_dispatch", "zh-CN"),
    ]);

    expect(dispatchDocEn).not.toBeNull();
    expect(dispatchDocZh).not.toBeNull();

    expect(dispatchDocEn?.markdown).toContain("## Response Format Example");
    expect(dispatchDocEn?.markdown).toContain('"message": "RESPONSE_MESSAGE"');
    expect(dispatchDocEn?.markdown).toContain("| Scenario | `code` | `data` | `message` |");
    expect(dispatchDocEn?.markdown).toContain("| Response timeout | `16` | `null` | `PARAMETER_SETTING_RESPONSE_TIMEOUT` |");
    expect(dispatchDocEn?.markdown).toContain("| Too many requests | `105` | `null` | `TOO_MANY_REQUEST` |");

    expect(dispatchDocZh?.markdown).toContain("## 返回格式示例");
    expect(dispatchDocZh?.markdown).toContain('"message": "RESPONSE_MESSAGE"');
    expect(dispatchDocZh?.markdown).toContain("| 场景 | `code` | `data` | `message` |");
    expect(dispatchDocZh?.markdown).toContain("| 参数设置响应超时 | `16` | `null` | `PARAMETER_SETTING_RESPONSE_TIMEOUT` |");
    expect(dispatchDocZh?.markdown).toContain("| 请求次数限制 | `105` | `null` | `TOO_MANY_REQUEST` |");
  });

  it("keeps integration-only findings inside explicit observation sections", async () => {
    const [guideEn, guideZh, faqEn, faqZh] = await Promise.all([
      getGrowattQuickGuide("en"),
      getGrowattQuickGuide("zh-CN"),
      getGrowattDocBySlug("11_api_troubleshooting", "en"),
      getGrowattDocBySlug("11_api_troubleshooting", "zh-CN"),
    ]);

    expect(guideEn.markdown.indexOf("## 5 Integration Observations")).toBeGreaterThan(-1);
    expect(guideZh.markdown.indexOf("## 5 联调观察")).toBeGreaterThan(-1);
    expect(faqEn?.markdown.indexOf("## Integration Observations")).toBeGreaterThan(-1);
    expect(faqZh?.markdown.indexOf("## 联调观察")).toBeGreaterThan(-1);

    expect(guideEn.markdown.indexOf("WRONG_GRANT_TYPE")).toBeGreaterThan(
      guideEn.markdown.indexOf("## 5 Integration Observations"),
    );
    expect(guideZh.markdown.indexOf("WRONG_GRANT_TYPE")).toBeGreaterThan(
      guideZh.markdown.indexOf("## 5 联调观察"),
    );
    expect(faqEn?.markdown.indexOf("WRONG_GRANT_TYPE") ?? -1).toBeGreaterThan(
      faqEn?.markdown.indexOf("## Integration Observations") ?? -1,
    );
    expect(faqZh?.markdown.indexOf("WRONG_GRANT_TYPE") ?? -1).toBeGreaterThan(
      faqZh?.markdown.indexOf("## 联调观察") ?? -1,
    );
  });
});
