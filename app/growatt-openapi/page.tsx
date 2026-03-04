import type { Metadata } from "next";
import { GrowattDocsShell } from "./docs-shell";
import "./docs.css";
import { getGrowattDocMetas, getGrowattOverview } from "@/lib/growatt-docs";

export const metadata: Metadata = {
  title: "Growatt Open API Docs",
  description: "Customer-friendly HTML documentation rendered from Growatt OPENAPI markdown.",
};

export const dynamic = "force-static";

export default async function GrowattOpenApiOverviewPage() {
  const [docs, overview] = await Promise.all([
    getGrowattDocMetas(),
    getGrowattOverview(),
  ]);

  return (
    <GrowattDocsShell
      docs={docs}
      activeSlug={null}
      heading={overview.title}
      subheading="Rendered from README.md. All API docs are statically generated from OPENAPI markdown files."
      contentHtml={overview.html}
    />
  );
}
