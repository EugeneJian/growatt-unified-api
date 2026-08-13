"use client";

import { useSearchParams } from "next/navigation";
import type { GrowattDocLocale, GrowattDocMeta, GrowattSpecialMarkdownPage, GrowattSpecialPageNavMeta } from "@/lib/growatt-docs";
import { GrowattDocsShell } from "../docs-shell";
import { VersionSelector } from "../version-selector";

interface ReleaseNotesViewerProps {
  versions: string[];
  docsByLocale: Record<GrowattDocLocale, GrowattDocMeta[]>;
  specialPages: GrowattSpecialPageNavMeta[];
  pagesByVersion: Record<string, Record<GrowattDocLocale, GrowattSpecialMarkdownPage>>;
}

export function ReleaseNotesViewer({
  versions,
  docsByLocale,
  specialPages,
  pagesByVersion,
}: ReleaseNotesViewerProps) {
  const searchParams = useSearchParams();

  const requestedVersion = searchParams.get("version");
  const currentVersion =
    requestedVersion && versions.includes(requestedVersion)
      ? requestedVersion
      : (versions[0] ?? "unknown");

  const currentPages = pagesByVersion[currentVersion];

  if (!currentPages) {
    return (
      <div className="growatt-docs-page">
        <div className="growatt-docs-main" style={{ padding: 32 }}>
          <p>No release notes found for version {currentVersion}.</p>
        </div>
      </div>
    );
  }

  const enPage = currentPages.en;
  const zhPage = currentPages["zh-CN"];

  return (
    <GrowattDocsShell
      docsByLocale={docsByLocale}
      specialPages={specialPages}
      activeSlug={enPage?.slug ?? "release-notes"}
      headingByLocale={{
        en: enPage?.title ?? "Release Notes",
        "zh-CN": zhPage?.title ?? enPage?.title ?? "Release Notes",
      }}
      subheadingByLocale={{
        en: "Customer-facing version summary and website announcement entry.",
        "zh-CN": "面向客户的版本说明与官网公告入口。",
      }}
      contentMarkdownByLocale={{
        en: enPage?.displayMarkdown ?? "",
        "zh-CN": zhPage?.displayMarkdown ?? "",
      }}
      contentHtmlByLocale={{
        en: enPage?.html ?? "",
        "zh-CN": zhPage?.html ?? "",
      }}
      headerExtra={
        versions.length > 1 ? (
          <VersionSelector versions={versions} currentVersion={currentVersion} />
        ) : null
      }
    />
  );
}
