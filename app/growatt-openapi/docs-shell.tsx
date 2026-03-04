import Link from "next/link";
import type { GrowattDocMeta } from "@/lib/growatt-docs";

interface GrowattDocsShellProps {
  docs: GrowattDocMeta[];
  activeSlug: string | null;
  heading: string;
  subheading: string;
  contentHtml: string;
}

function DocsNav({
  docs,
  activeSlug,
}: {
  docs: GrowattDocMeta[];
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
          <p>Single source of truth: Growatt API/OPENAPI/*.md</p>
          <DocsNav docs={docs} activeSlug={activeSlug} />
        </aside>

        <main className="growatt-docs-main">
          <details className="growatt-docs-mobile-nav">
            <summary>Browse API Docs</summary>
            <DocsNav docs={docs} activeSlug={activeSlug} />
          </details>

          <header className="growatt-docs-header">
            <h2>{heading}</h2>
            <p>{subheading}</p>
          </header>

          <article
            className="growatt-docs-content"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </main>
      </div>
    </div>
  );
}
