"use client";

import Link from "next/link";
import type { BuildInfo } from "@/lib/build-info";
import type {
  ShineToolsDocMeta,
  ShineToolsNavGroup,
} from "@/lib/shinetools-docs";
import { CopyMarkdownButton } from "@/app/growatt-openapi/copy-markdown-button";
import { MermaidRenderer } from "@/app/growatt-openapi/mermaid-renderer";

interface ShineToolsDocsShellProps {
  docs: ShineToolsDocMeta[];
  activeSlug: string | null;
  heading: string;
  sourcePath: string;
  contentMarkdown: string;
  contentHtml: string;
  buildInfo?: BuildInfo;
}

const SHINETOOLS_NAV_GROUPS: ShineToolsNavGroup[] = [
  { key: "product", label: "产品 Handbook", description: "用户、分组、流程与高频策略" },
  { key: "foundation", label: "证据与方法", description: "来源、边界与覆盖审计" },
  { key: "current", label: "当前功能证据", description: "投运与详细设置模块" },
  { key: "reference", label: "迁移参考", description: "旧版结构与连续性基线" },
  { key: "governance", label: "来源治理", description: "批注、生命周期与遗留项" },
  { key: "sources", label: "原始来源", description: "由白板 JSON 生成的只读大纲" },
];

function ShineToolsNavigation({
  docs,
  activeSlug,
}: Pick<ShineToolsDocsShellProps, "docs" | "activeSlug">) {
  return (
    <nav className="shinetools-nav" aria-label="ShineTools 文档导航">
      <Link
        href="/shinetools"
        className={`shinetools-nav-overview ${activeSlug === null ? "active" : ""}`.trim()}
        aria-current={activeSlug === null ? "page" : undefined}
      >
        <span className="shinetools-nav-index">00</span>
        <span>
          <strong>产品总览</strong>
          <small>范围、结论与阅读入口</small>
        </span>
      </Link>

      {SHINETOOLS_NAV_GROUPS.map((group) => {
        const groupDocs = docs.filter((doc) => doc.group === group.key);
        if (groupDocs.length === 0) {
          return null;
        }

        return (
          <section className="shinetools-nav-group" key={group.key}>
            <div className="shinetools-nav-group-heading">
              <span>{group.label}</span>
              <small>{group.description}</small>
            </div>
            <div className="shinetools-nav-links">
              {groupDocs.map((doc) => (
                <Link
                  key={doc.slug}
                  href={`/shinetools/${doc.slug}`}
                  className={`shinetools-nav-link ${activeSlug === doc.slug ? "active" : ""}`.trim()}
                  aria-current={activeSlug === doc.slug ? "page" : undefined}
                >
                  <span>{doc.title}</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </nav>
  );
}

function formatBuildTime(buildTime: string): string {
  if (buildTime === "unknown") {
    return buildTime;
  }

  try {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(buildTime));
  } catch {
    return buildTime;
  }
}

export function ShineToolsDocsShell({
  docs,
  activeSlug,
  heading,
  sourcePath,
  contentMarkdown,
  contentHtml,
  buildInfo,
}: ShineToolsDocsShellProps) {
  return (
    <div className="shinetools-page">
      <div className="shinetools-shell">
        <aside className="shinetools-sidebar">
          <div className="shinetools-brand">
            <div className="shinetools-brand-mark" aria-hidden="true">
              ST
            </div>
            <div>
              <p>INTERNAL KNOWLEDGE BASE</p>
              <h1>ShineTools Energy</h1>
            </div>
          </div>

          <div className="shinetools-access-state">
            <span className="shinetools-access-dot" aria-hidden="true" />
            <span>
              <strong>Zero Trust protected</strong>
              <small>Authenticated readers only</small>
            </span>
          </div>

          <div className="shinetools-sidebar-scroll">
            <ShineToolsNavigation docs={docs} activeSlug={activeSlug} />
          </div>

          <Link className="shinetools-openapi-link" href="/growatt-openapi">
            前往公开 Open API 文档 <span aria-hidden="true">↗</span>
          </Link>
        </aside>

        <main className="shinetools-main">
          <details className="shinetools-mobile-nav">
            <summary>
              <span>ShineTools 文档导航</span>
              <span aria-hidden="true">＋</span>
            </summary>
            <div className="shinetools-mobile-nav-panel">
              <ShineToolsNavigation docs={docs} activeSlug={activeSlug} />
            </div>
          </details>

          <header className="shinetools-header">
            <div className="shinetools-breadcrumb">
              <Link href="/shinetools">ShineTools</Link>
              <span aria-hidden="true">/</span>
              <span>{activeSlug === null ? "Overview" : "Document"}</span>
            </div>

            <div className="shinetools-header-row">
              <div>
                <p className="shinetools-eyebrow">ENERGY MANAGEMENT PRODUCT HANDBOOK</p>
                <h2>{heading}</h2>
                <p className="shinetools-source-path">文档源：{sourcePath}</p>
              </div>
              <CopyMarkdownButton
                markdown={contentMarkdown}
                className="shinetools-copy-button"
                labels={{
                  idle: "复制 Markdown",
                  copied: "已复制",
                  error: "复制失败",
                  title: "复制当前阅读文档的 Markdown",
                }}
              />
            </div>

            <div className="shinetools-scope-strip" aria-label="文档覆盖范围">
              <span><strong>6</strong> 个目标参数组</span>
              <span><strong>4</strong> 类频率口径</span>
              <span><strong>A–D</strong> 高频分层</span>
              <span><strong>1</strong> 份设置事实源</span>
            </div>
          </header>

          <article className="shinetools-content-card">
            <div className="shinetools-content">
              <MermaidRenderer
                key={activeSlug ?? "overview"}
                content={contentHtml}
                mode="light"
              />
            </div>
          </article>

          <footer className="shinetools-footer">
            <span>ShineTools Energy Management · Product & evidence handbook</span>
            {buildInfo && (
              <span>
                {buildInfo.gitCommit} · {formatBuildTime(buildInfo.buildTime)}
              </span>
            )}
          </footer>
        </main>
      </div>
    </div>
  );
}
