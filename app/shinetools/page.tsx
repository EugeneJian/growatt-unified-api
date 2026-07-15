import { getBuildInfo } from "@/lib/build-info";
import {
  getShineToolsDocMetas,
  getShineToolsOverview,
} from "@/lib/shinetools-docs";
import { ShineToolsDocsShell } from "./shinetools-docs-shell";

export const dynamic = "force-static";

export default async function ShineToolsOverviewPage() {
  const [docs, overview, buildInfo] = await Promise.all([
    getShineToolsDocMetas(),
    getShineToolsOverview(),
    getBuildInfo(),
  ]);

  return (
    <ShineToolsDocsShell
      docs={docs}
      activeSlug={null}
      heading={overview.title}
      sourcePath={overview.sourcePath}
      contentMarkdown={overview.displayMarkdown}
      contentHtml={overview.html}
      buildInfo={buildInfo}
    />
  );
}
