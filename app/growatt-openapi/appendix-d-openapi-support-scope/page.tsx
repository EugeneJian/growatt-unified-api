import type { Metadata } from "next";
import { GrowattDocsShell } from "../docs-shell";
import "../docs.css";
import {
  getGrowattAppendixDOpenApiSupportScopePage,
  getGrowattDocMetas,
  getGrowattSpecialPages,
} from "@/lib/growatt-docs";

export const metadata: Metadata = {
  title: "Appendix D OpenAPI Product Support Scope | Growatt Open API Docs",
  description: "Public appendix entry for the model-level Growatt OpenAPI support scope.",
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
        en: "Model-level OpenAPI support scope appendix.",
        "zh-CN": "\u578b\u53f7\u7ea7 OpenAPI \u652f\u6301\u8303\u56f4\u9644\u5f55\u3002",
      }}
      contentMarkdownByLocale={{
        en: appendixEn.displayMarkdown,
        "zh-CN": appendixZh.displayMarkdown,
      }}
      contentHtmlByLocale={{ en: appendixEn.html, "zh-CN": appendixZh.html }}
    />
  );
}
