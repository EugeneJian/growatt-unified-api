import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getShineToolsDocBySlug,
  getShineToolsDocMetas,
} from "@/lib/shinetools-docs";
import { ShineToolsDocsShell } from "../shinetools-docs-shell";

interface ShineToolsDocPageProps {
  params: Promise<{ doc: string }>;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const docs = await getShineToolsDocMetas();
  return docs.map((doc) => ({ doc: doc.slug }));
}

export async function generateMetadata({
  params,
}: ShineToolsDocPageProps): Promise<Metadata> {
  const { doc } = await params;
  const currentDoc = await getShineToolsDocBySlug(doc);

  if (!currentDoc) {
    return { title: "ShineTools Energy" };
  }

  return {
    title: currentDoc.title,
    description: `ShineTools energy-management handbook: ${currentDoc.sourcePath}`,
  };
}

export default async function ShineToolsDocPage({
  params,
}: ShineToolsDocPageProps) {
  const { doc } = await params;
  const [docs, currentDoc] = await Promise.all([
    getShineToolsDocMetas(),
    getShineToolsDocBySlug(doc),
  ]);

  if (!currentDoc) {
    notFound();
  }

  return (
    <ShineToolsDocsShell
      docs={docs}
      activeSlug={currentDoc.slug}
      heading={currentDoc.title}
      sourcePath={currentDoc.sourcePath}
      contentMarkdown={currentDoc.displayMarkdown}
      contentHtml={currentDoc.html}
    />
  );
}
