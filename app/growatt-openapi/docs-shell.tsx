import Link from "next/link";
import type { GrowattDocMeta } from "@/lib/growatt-docs";
import { MermaidRenderer } from "./mermaid-renderer";

interface QuickGuideNavMeta {
  slug: string;
  label: string;
}

interface GrowattDocsShellProps {
  docs: GrowattDocMeta[];
  quickGuide: QuickGuideNavMeta;
  activeSlug: string | null;
  heading: string;
  subheading?: string;
  contentHtml: string;
}

function DocsNav({
  docs,
  quickGuide,
  activeSlug,
}: {
  docs: GrowattDocMeta[];
  quickGuide: QuickGuideNavMeta;
  activeSlug: string | null;
}) {
  return (
    <nav className="growatt-docs-nav" aria-label="Growatt API navigation">
      <Link
        className={`growatt-docs-nav-link ${activeSlug === null ? "active" : ""}`.trim()}
        href="/growatt-openapi"
      >
        Overview
      </Link>
      <Link
        className={`growatt-docs-nav-link ${activeSlug === quickGuide.slug ? "active" : ""}`.trim()}
        href={`/growatt-openapi/${quickGuide.slug}`}
      >
        {quickGuide.label}
      </Link>
      {docs.map((doc) => (
        <Link
          key={doc.slug}
          className={`growatt-docs-nav-link ${activeSlug === doc.slug ? "active" : ""}`.trim()}
          href={`/growatt-openapi/${doc.slug}`}
        >
          {doc.fileName} · {doc.title}
        </Link>
      ))}
    </nav>
  );
}

export function GrowattDocsShell({
  docs,
  quickGuide,
  activeSlug,
  heading,
  subheading,
  contentHtml,
}: GrowattDocsShellProps) {
  return (
    <div className="growatt-docs-page">
      <div className="growatt-docs-shell">
        <aside className="growatt-docs-sidebar">
          <h1>Growatt Open API</h1>
          <DocsNav docs={docs} quickGuide={quickGuide} activeSlug={activeSlug} />
        </aside>

        <main className="growatt-docs-main">
          <details className="growatt-docs-mobile-nav">
            <summary>Browse API Docs</summary>
            <DocsNav docs={docs} quickGuide={quickGuide} activeSlug={activeSlug} />
          </details>

          <header className="growatt-docs-header">
            <h2>{heading}</h2>
            {subheading && <p>{subheading}</p>}
          </header>

          <article className="growatt-docs-content">
            <MermaidRenderer content={contentHtml} />
          </article>
        </main>
      </div>
    </div>
  );
}
