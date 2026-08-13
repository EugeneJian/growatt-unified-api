import type { Metadata } from "next";
import type { GrowattDocLocale, GrowattSpecialMarkdownPage } from "@/lib/growatt-docs";
import "../docs.css";
import {
  getGrowattDocMetas,
  getGrowattReleaseNoteVersions,
  getGrowattReleaseNotesPageByVersion,
  getGrowattSpecialPages,
} from "@/lib/growatt-docs";
import { ReleaseNotesViewer } from "./release-notes-viewer";

export const metadata: Metadata = {
  title: "Release Notes | Growatt Open API Docs",
  description: "Customer-facing release notes for Growatt Open API documentation updates.",
};

export const dynamic = "force-static";

export default async function GrowattOpenApiReleaseNotesPage() {
  const versions = await getGrowattReleaseNoteVersions();

  const locales: GrowattDocLocale[] = ["en", "zh-CN"];

  const [docsEn, docsZh] = await Promise.all([
    getGrowattDocMetas("en"),
    getGrowattDocMetas("zh-CN"),
  ]);

  const pagesByVersion: Record<string, Record<GrowattDocLocale, GrowattSpecialMarkdownPage>> = {};

  await Promise.all(
    versions.map(async (version) => {
      const entries = await Promise.all(
        locales.map(async (locale) => {
          const page = await getGrowattReleaseNotesPageByVersion(version, locale);
          return { locale, page };
        }),
      );
      const map: Record<GrowattDocLocale, GrowattSpecialMarkdownPage> = {} as Record<
        GrowattDocLocale,
        GrowattSpecialMarkdownPage
      >;
      for (const { locale, page } of entries) {
        map[locale] = page;
      }
      pagesByVersion[version] = map;
    }),
  );

  return (
    <ReleaseNotesViewer
      versions={versions}
      docsByLocale={{ en: docsEn, "zh-CN": docsZh }}
      specialPages={getGrowattSpecialPages()}
      pagesByVersion={pagesByVersion}
    />
  );
}
