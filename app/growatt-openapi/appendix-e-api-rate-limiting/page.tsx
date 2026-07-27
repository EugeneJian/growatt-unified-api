import type { Metadata } from "next";
import { GrowattDocsShell } from "../docs-shell";
import "../docs.css";
import {
  getGrowattAppendixEApiRateLimitingPage,
  getGrowattDocMetas,
  getGrowattSpecialPages,
} from "@/lib/growatt-docs";

export const metadata: Metadata = {
  title: "Appendix E API Rate Limiting | Growatt Open API Docs",
  description: "Rate limiting guidelines for Growatt OpenAPI endpoints.",
};

export const dynamic = "force-static";

export default async function GrowattOpenApiAppendixEApiRateLimitingPage() {
  const [docsEn, docsZh, appendixEn, appendixZh] = await Promise.all([
    getGrowattDocMetas("en"),
    getGrowattDocMetas("zh-CN"),
    getGrowattAppendixEApiRateLimitingPage("en"),
    getGrowattAppendixEApiRateLimitingPage("zh-CN"),
  ]);

  return (
    <GrowattDocsShell
      docsByLocale={{ en: docsEn, "zh-CN": docsZh }}
      specialPages={getGrowattSpecialPages()}
      activeSlug={appendixEn.slug}
      headingByLocale={{ en: appendixEn.title, "zh-CN": appendixZh.title }}
      subheadingByLocale={{
        en: "Rate limiting rules and best practices for API integration.",
        "zh-CN": "API 集成的限流规则与最佳实践。",
      }}
      contentMarkdownByLocale={{
        en: appendixEn.displayMarkdown,
        "zh-CN": appendixZh.displayMarkdown,
      }}
      contentHtmlByLocale={{ en: appendixEn.html, "zh-CN": appendixZh.html }}
    />
  );
}
