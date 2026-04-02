import type { Metadata } from "next";
import { GrowattDocsShell } from "../docs-shell";
import "../docs.css";
import {
  getGrowattDocMetas,
  getGrowattSemanticModelPage,
  getGrowattSpecialPages,
} from "@/lib/growatt-docs";

export const metadata: Metadata = {
  title: "Appendix C Semantic Model | Growatt Open API Docs",
  description: "Public appendix entry for the Growatt ESS semantic model standard.",
};

export const dynamic = "force-static";

export default async function GrowattOpenApiSemanticModelPage() {
  const [docsEn, docsZh, semanticEn, semanticZh] = await Promise.all([
    getGrowattDocMetas("en"),
    getGrowattDocMetas("zh-CN"),
    getGrowattSemanticModelPage("en"),
    getGrowattSemanticModelPage("zh-CN"),
  ]);

  return (
    <GrowattDocsShell
      docsByLocale={{ en: docsEn, "zh-CN": docsZh }}
      specialPages={getGrowattSpecialPages()}
      activeSlug={semanticEn.slug}
      headingByLocale={{ en: semanticEn.title, "zh-CN": semanticZh.title }}
      subheadingByLocale={{
        en: "Public semantic model and dispatch validation standard.",
        "zh-CN": "公开语义模型与调度校验标准。",
      }}
      contentMarkdownByLocale={{
        en: semanticEn.displayMarkdown,
        "zh-CN": semanticZh.displayMarkdown,
      }}
      contentHtmlByLocale={{ en: semanticEn.html, "zh-CN": semanticZh.html }}
    />
  );
}
