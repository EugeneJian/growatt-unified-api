import type { Metadata } from "next";
import { GrowattDocsShell } from "../docs-shell";
import "../docs.css";
import {
  getGrowattAppendixTerminologyPage,
  getGrowattDocMetas,
  getGrowattSpecialPages,
} from "@/lib/growatt-docs";

export const metadata: Metadata = {
  title: "Appendix B Glossary | Growatt Open API Docs",
  description: "Appendix entry for the published ESS terminology glossary.",
};

export const dynamic = "force-static";

export default async function GrowattOpenApiAppendixTerminologyPage() {
  const [docsEn, docsZh, appendixEn, appendixZh] = await Promise.all([
    getGrowattDocMetas("en"),
    getGrowattDocMetas("zh-CN"),
    getGrowattAppendixTerminologyPage("en"),
    getGrowattAppendixTerminologyPage("zh-CN"),
  ]);

  return (
    <GrowattDocsShell
      docsByLocale={{ en: docsEn, "zh-CN": docsZh }}
      specialPages={getGrowattSpecialPages()}
      activeSlug={appendixEn.slug}
      headingByLocale={{ en: appendixEn.title, "zh-CN": appendixZh.title }}
      subheadingByLocale={{
        en: "Published ESS terminology glossary reference.",
        "zh-CN": "公开储能术语表参考页。",
      }}
      contentMarkdownByLocale={{
        en: appendixEn.displayMarkdown,
        "zh-CN": appendixZh.displayMarkdown,
      }}
      contentHtmlByLocale={{ en: appendixEn.html, "zh-CN": appendixZh.html }}
    />
  );
}
