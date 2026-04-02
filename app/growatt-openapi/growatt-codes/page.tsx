import type { Metadata } from "next";
import { GrowattDocsShell } from "../docs-shell";
import "../docs.css";
import {
  getGrowattCodesPage,
  getGrowattDocMetas,
  getGrowattSpecialPages,
} from "@/lib/growatt-docs";

export const metadata: Metadata = {
  title: "Appendix A Growatt Codes | Growatt Open API Docs",
  description: "External customer reference appendix for Growatt fault, protect, and warning codes.",
};

export const dynamic = "force-static";

export default async function GrowattOpenApiGrowattCodesPage() {
  const [docsEn, docsZh, codesEn, codesZh] = await Promise.all([
    getGrowattDocMetas("en"),
    getGrowattDocMetas("zh-CN"),
    getGrowattCodesPage("en"),
    getGrowattCodesPage("zh-CN"),
  ]);

  return (
    <GrowattDocsShell
      docsByLocale={{ en: docsEn, "zh-CN": docsZh }}
      specialPages={getGrowattSpecialPages()}
      activeSlug={codesEn.slug}
      headingByLocale={{
        en: "Appendix A Growatt Codes",
        "zh-CN": "附录A Growatt Codes",
      }}
      subheadingByLocale={{
        en: `Source file: ${codesEn.sourceFileName}`,
        "zh-CN": `源文件：${codesZh.sourceFileName}`,
      }}
      contentMarkdownByLocale={{
        en: codesEn.markdown,
        "zh-CN": codesZh.markdown,
      }}
      contentHtmlByLocale={{ en: codesEn.html, "zh-CN": codesZh.html }}
    />
  );
}
