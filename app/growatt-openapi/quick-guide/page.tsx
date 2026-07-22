import type { Metadata } from "next";
import { GrowattDocsShell } from "../docs-shell";
import "../docs.css";
import {
  getGrowattDocMetas,
  getGrowattQuickGuide,
  getGrowattSpecialPages,
} from "@/lib/growatt-docs";

export const metadata: Metadata = {
  title: "Quick Guide | Growatt Open API Docs",
  description: "Professional quick-start integration guide for Growatt Open API.",
};

export const dynamic = "force-static";

export default async function GrowattOpenApiQuickGuidePage() {
  const [docsEn, docsZh, quickGuideEn, quickGuideZh] = await Promise.all([
    getGrowattDocMetas("en"),
    getGrowattDocMetas("zh-CN"),
    getGrowattQuickGuide("en"),
    getGrowattQuickGuide("zh-CN"),
  ]);

  return (
    <GrowattDocsShell
      docsByLocale={{ en: docsEn, "zh-CN": docsZh }}
      specialPages={getGrowattSpecialPages()}
      activeSlug={quickGuideEn.slug}
      headingByLocale={{ en: quickGuideEn.title, "zh-CN": quickGuideZh.title }}
      subheadingByLocale={{
        en: "Plan authentication, device authorization, data access, and dispatch integration.",
        "zh-CN": "规划认证、设备授权、数据访问与调度接入。",
      }}
      contentMarkdownByLocale={{
        en: quickGuideEn.displayMarkdown,
        "zh-CN": quickGuideZh.displayMarkdown,
      }}
      contentHtmlByLocale={{ en: quickGuideEn.html, "zh-CN": quickGuideZh.html }}
    />
  );
}
