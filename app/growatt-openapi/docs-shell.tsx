import Link from "next/link";
import type { GrowattDocMeta } from "@/lib/growatt-docs";
import type { BuildInfo } from "@/lib/build-info";
import { CopyMarkdownButton } from "./copy-markdown-button";
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
  contentMarkdown: string;
  contentHtml: string;
  buildInfo?: BuildInfo;
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
  contentMarkdown,
  contentHtml,
  buildInfo,
}: GrowattDocsShellProps) {
  const formatBuildTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      });
    } catch {
      return isoString;
    }
  };

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
            <div className="growatt-docs-header-top">
              <div className="growatt-docs-header-copy-content">
                <h2>{heading}</h2>
                {subheading && <p>{subheading}</p>}
              </div>
              <CopyMarkdownButton markdown={contentMarkdown} />
            </div>
            {buildInfo && (
              <div className="growatt-docs-header-meta">
                <span className="build-info">
                  <span className="build-info-label">Version:</span>{" "}
                  <code>{buildInfo.gitVersion}</code>
                </span>
                <span className="build-info-divider">|</span>
                <span className="build-info">
                  <span className="build-info-label">Commit:</span>{" "}
                  <code>{buildInfo.gitCommit}</code>
                </span>
                <span className="build-info-divider">|</span>
                <span className="build-info">
                  <span className="build-info-label">Last Update:</span>{" "}
                  <code>{formatBuildTime(buildInfo.buildTime)}</code>
                </span>
              </div>
            )}
          </header>

          <article className="growatt-docs-content">
            <MermaidRenderer content={contentHtml} />
          </article>
        </main>
      </div>
    </div>
  );
}
