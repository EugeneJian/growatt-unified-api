import type { Metadata } from "next";
import { GrowattDocsShell } from "./docs-shell";
import "./docs.css";
import {
  GROWATT_QUICK_GUIDE_SLUG,
  getGrowattDocMetas,
  getGrowattOverview,
} from "@/lib/growatt-docs";

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
      quickGuide={{ slug: GROWATT_QUICK_GUIDE_SLUG, label: "Quick Guide" }}
      activeSlug={null}
      heading={overview.title}
      subheading="Rendered from README.md. All API docs are statically generated from OPENAPI markdown files."
      contentHtml={overview.html}
    />
  );
}
