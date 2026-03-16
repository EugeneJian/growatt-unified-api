import type { Metadata } from "next";
import { GrowattDocsShell } from "./docs-shell";
import "./docs.css";
import {
  getGrowattDocMetas,
  getGrowattOverview,
  getGrowattSpecialPages,
} from "@/lib/growatt-docs";
import { getBuildInfo } from "@/lib/build-info";

export const metadata: Metadata = {
  title: "Growatt Open API Docs",
  description: "Customer-friendly HTML documentation rendered from Growatt OPENAPI markdown.",
};

export const dynamic = "force-static";

export default async function GrowattOpenApiOverviewPage() {
  const [docsEn, docsZh, overviewEn, overviewZh, buildInfo] = await Promise.all([
    getGrowattDocMetas("en"),
    getGrowattDocMetas("zh-CN"),
    getGrowattOverview("en"),
    getGrowattOverview("zh-CN"),
    getBuildInfo(),
  ]);

  return (
    <GrowattDocsShell
      docsByLocale={{ en: docsEn, "zh-CN": docsZh }}
      specialPages={getGrowattSpecialPages()}
      activeSlug={null}
      headingByLocale={{ en: overviewEn.title, "zh-CN": overviewZh.title }}
      contentMarkdownByLocale={{
        en: overviewEn.displayMarkdown,
        "zh-CN": overviewZh.displayMarkdown,
      }}
      contentHtmlByLocale={{ en: overviewEn.html, "zh-CN": overviewZh.html }}
      buildInfo={buildInfo}
    />
  );
}
