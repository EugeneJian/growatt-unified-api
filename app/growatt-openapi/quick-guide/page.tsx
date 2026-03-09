import type { Metadata } from "next";
import { GrowattDocsShell } from "../docs-shell";
import "../docs.css";
import {
  GROWATT_QUICK_GUIDE_SLUG,
  getGrowattDocMetas,
  getGrowattQuickGuide,
} from "@/lib/growatt-docs";

export const metadata: Metadata = {
  title: "Quick Guide | Growatt Open API Docs",
  description: "Professional quick-start integration guide for Growatt Open API.",
};

export const dynamic = "force-static";

export default async function GrowattOpenApiQuickGuidePage() {
  const [docs, quickGuide] = await Promise.all([
    getGrowattDocMetas(),
    getGrowattQuickGuide(),
  ]);

  return (
    <GrowattDocsShell
      docs={docs}
      quickGuide={{ slug: GROWATT_QUICK_GUIDE_SLUG, label: "Quick Guide" }}
      activeSlug={quickGuide.slug}
      heading={quickGuide.title}
      subheading={`Source file: ${quickGuide.fileName}`}
      contentMarkdown={quickGuide.displayMarkdown}
      contentHtml={quickGuide.html}
    />
  );
}
