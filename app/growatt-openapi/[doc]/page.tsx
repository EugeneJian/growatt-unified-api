import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GrowattDocsShell } from "../docs-shell";
import "../docs.css";
import { getGrowattDocBySlug, getGrowattDocMetas } from "@/lib/growatt-docs";

interface GrowattDocPageProps {
  params: Promise<{ doc: string }>;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const docs = await getGrowattDocMetas();
  return docs.map((doc) => ({ doc: doc.slug }));
}

export async function generateMetadata({
  params,
}: GrowattDocPageProps): Promise<Metadata> {
  const { doc } = await params;
  const currentDoc = await getGrowattDocBySlug(doc);

  if (!currentDoc) {
    return {
      title: "Growatt Open API Docs",
    };
  }

  return {
    title: `${currentDoc.title} | Growatt Open API Docs`,
    description: `Growatt API document ${currentDoc.fileName}.`,
  };
}

export default async function GrowattOpenApiDocPage({
  params,
}: GrowattDocPageProps) {
  const { doc } = await params;
  const [docs, currentDoc] = await Promise.all([
    getGrowattDocMetas(),
    getGrowattDocBySlug(doc),
  ]);

  if (!currentDoc) {
    notFound();
  }

  return (
    <GrowattDocsShell
      docs={docs}
      activeSlug={currentDoc.slug}
      heading={currentDoc.title}
      subheading={`Source file: ${currentDoc.fileName}`}
      contentHtml={currentDoc.html}
    />
  );
}
