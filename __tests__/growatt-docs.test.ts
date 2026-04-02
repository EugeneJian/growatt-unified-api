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
  GROWATT_QUICK_GUIDE_SLUG,
  getGrowattCodesPage,
  getGrowattDocBySlug,
  getGrowattDocMetas,
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
    expect(overview.html).toContain("/growatt-openapi/12_ess_terminology");
    expect(overview.html).toContain("/growatt-openapi/growatt-codes");
    expect(overview.displayMarkdown).toContain("/growatt-openapi/02_api_access_token");
    expect(overview.displayMarkdown).toContain("/growatt-openapi/12_ess_terminology");
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
    expect(quickGuide.displayMarkdown).toContain("/growatt-openapi/12_ess_terminology");
    expect(quickGuide.markdown).toContain("## 5 Integration Observations (Non-Normative)");
    expect(quickGuide.markdown).toContain("## 6 Integration Checklist");
  });

  it("loads localized Chinese overview and doc titles without mojibake", async () => {
    const [overview, docs] = await Promise.all([
      getGrowattOverview("zh-CN"),
      getGrowattDocMetas("zh-CN"),
    ]);

    expect(overview.title).toBe("Growatt Open API 文档");
    expect(docs[0]?.title).toContain("身份认证");
  });

  it("loads localized Chinese quick guide markdown", async () => {
    const quickGuide = await getGrowattQuickGuide("zh-CN");

    expect(quickGuide.fileName).toBe(
      "Growatt Open API Professional Integration Guide.zh-CN.md",
    );
    expect(quickGuide.title).toBe("Growatt Open API 专业集成指南");
    expect(quickGuide.displayMarkdown).toContain("/growatt-openapi/12_ess_terminology");
    expect(quickGuide.markdown).toContain("## 5 联调观察（非基线规范）");
    expect(quickGuide.markdown).toContain("## 6 集成检查清单");
  });

  it("loads the bilingual ESS glossary as a numbered documentation page", async () => {
    const [docsEn, docsZh, glossaryEn, glossaryZh] = await Promise.all([
      getGrowattDocMetas("en"),
      getGrowattDocMetas("zh-CN"),
      getGrowattDocBySlug("12_ess_terminology", "en"),
      getGrowattDocBySlug("12_ess_terminology", "zh-CN"),
    ]);

    expect(docsEn.map((doc) => doc.fileName)).toContain("12_ess_terminology.md");
    expect(docsZh.map((doc) => doc.fileName)).toContain("12_ess_terminology.md");
    expect(glossaryEn?.title).toBe("ESS Terminology Glossary");
    expect(glossaryZh?.title).toBe("储能术语对照表");
    expect(glossaryEn?.markdown).toContain("state of charge (SOC)");
    expect(glossaryEn?.markdown).toContain("Export Limit");
    expect(glossaryZh?.markdown).toContain("state of charge (SOC)");
  });

  it("registers quick guide and growatt codes special pages with corrected labels", () => {
    const specialPages = getGrowattSpecialPages();

    expect(specialPages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slug: GROWATT_QUICK_GUIDE_SLUG,
          labelByLocale: expect.objectContaining({
            en: "Quick Guide",
            "zh-CN": "快速指南",
          }),
          placement: "beforeDocs",
        }),
        expect.objectContaining({
          slug: GROWATT_CODES_SLUG,
          labelByLocale: expect.objectContaining({
            en: "Appendix: Growatt Codes",
            "zh-CN": "附录：Growatt Codes",
          }),
          placement: "afterDocs",
        }),
      ]),
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

  it("restores baseline global parameters and response codes", async () => {
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

  it("publishes push payloads from the baseline instead of query-model wording", async () => {
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

    expect(faqDoc?.markdown).toContain("[ESS Terminology Glossary](./12_ess_terminology.md)");
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

    expect(guideEn.markdown.indexOf("## 5 Integration Observations (Non-Normative)")).toBeGreaterThan(
      -1,
    );
    expect(guideZh.markdown.indexOf("## 5 联调观察（非基线规范）")).toBeGreaterThan(-1);
    expect(faqEn?.markdown.indexOf("## Integration Observations (Non-Normative)")).toBeGreaterThan(
      -1,
    );
    expect(faqZh?.markdown.indexOf("## 联调观察（非基线规范）")).toBeGreaterThan(-1);

    expect(guideEn.markdown.indexOf("WRONG_GRANT_TYPE")).toBeGreaterThan(
      guideEn.markdown.indexOf("## 5 Integration Observations (Non-Normative)"),
    );
    expect(guideZh.markdown.indexOf("WRONG_GRANT_TYPE")).toBeGreaterThan(
      guideZh.markdown.indexOf("## 5 联调观察（非基线规范）"),
    );
    expect(faqEn?.markdown.indexOf("WRONG_GRANT_TYPE") ?? -1).toBeGreaterThan(
      faqEn?.markdown.indexOf("## Integration Observations (Non-Normative)") ?? -1,
    );
    expect(faqZh?.markdown.indexOf("WRONG_GRANT_TYPE") ?? -1).toBeGreaterThan(
      faqZh?.markdown.indexOf("## 联调观察（非基线规范）") ?? -1,
    );
  });
});
