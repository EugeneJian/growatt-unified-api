import type { Metadata } from "next";
import { GrowattDocsShell } from "../docs-shell";
import "../docs.css";
import {
  getGrowattAppendixDOpenApiSupportScopePage,
  getGrowattDocMetas,
  getGrowattSpecialPages,
} from "@/lib/growatt-docs";

export const metadata: Metadata = {
  title: "Appendix D Supported Inverter Models | Growatt Open API Docs",
  description: "Customer-facing Growatt OpenAPI support matrix for confirmed inverter and PCE models.",
};

export const dynamic = "force-static";

export default async function GrowattOpenApiAppendixDOpenApiSupportScopePage() {
  const [docsEn, docsZh, appendixEn, appendixZh] = await Promise.all([
    getGrowattDocMetas("en"),
    getGrowattDocMetas("zh-CN"),
    getGrowattAppendixDOpenApiSupportScopePage("en"),
    getGrowattAppendixDOpenApiSupportScopePage("zh-CN"),
  ]);

  return (
    <GrowattDocsShell
      docsByLocale={{ en: docsEn, "zh-CN": docsZh }}
      specialPages={getGrowattSpecialPages()}
      activeSlug={appendixEn.slug}
      headingByLocale={{ en: appendixEn.title, "zh-CN": appendixZh.title }}
      subheadingByLocale={{
        en: "Check confirmed OpenAPI capabilities by inverter and PCE model.",
        "zh-CN": "按逆变器与 PCE 型号查看已确认的 OpenAPI 能力。",
      }}
      contentMarkdownByLocale={{
        en: appendixEn.displayMarkdown,
        "zh-CN": appendixZh.displayMarkdown,
      }}
      contentHtmlByLocale={{ en: appendixEn.html, "zh-CN": appendixZh.html }}
    />
  );
}
