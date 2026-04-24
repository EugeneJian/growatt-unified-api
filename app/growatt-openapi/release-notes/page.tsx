import type { Metadata } from "next";
import { GrowattDocsShell } from "../docs-shell";
import "../docs.css";
import {
  getGrowattDocMetas,
  getGrowattReleaseNotesPage,
  getGrowattSpecialPages,
} from "@/lib/growatt-docs";

export const metadata: Metadata = {
  title: "Release Notes | Growatt Open API Docs",
  description: "Customer-facing release notes for Growatt Open API documentation updates.",
};

export const dynamic = "force-static";

export default async function GrowattOpenApiReleaseNotesPage() {
  const [docsEn, docsZh, releaseNotesEn, releaseNotesZh] = await Promise.all([
    getGrowattDocMetas("en"),
    getGrowattDocMetas("zh-CN"),
    getGrowattReleaseNotesPage("en"),
    getGrowattReleaseNotesPage("zh-CN"),
  ]);

  return (
    <GrowattDocsShell
      docsByLocale={{ en: docsEn, "zh-CN": docsZh }}
      specialPages={getGrowattSpecialPages()}
      activeSlug={releaseNotesEn.slug}
      headingByLocale={{ en: releaseNotesEn.title, "zh-CN": releaseNotesZh.title }}
      subheadingByLocale={{
        en: "Customer-facing version summary and website announcement entry.",
        "zh-CN": "面向客户的版本说明与官网公告入口。",
      }}
      contentMarkdownByLocale={{
        en: releaseNotesEn.displayMarkdown,
        "zh-CN": releaseNotesZh.displayMarkdown,
      }}
      contentHtmlByLocale={{ en: releaseNotesEn.html, "zh-CN": releaseNotesZh.html }}
    />
  );
}
