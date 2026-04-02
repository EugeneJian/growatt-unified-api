"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import type {
  GrowattDocLocale,
  GrowattDocMeta,
  GrowattSpecialPageNavMeta,
} from "@/lib/growatt-docs";
import type { BuildInfo } from "@/lib/build-info";
import { CopyMarkdownButton } from "./copy-markdown-button";
import { MermaidRenderer } from "./mermaid-renderer";

const DEFAULT_LOCALE: GrowattDocLocale = "en";
const SUPPORTED_LOCALES: GrowattDocLocale[] = ["en", "zh-CN"];

interface LocaleText {
  overviewLabel: string;
  browseLabel: string;
  navAriaLabel: string;
  sourceFileLabel: string;
  sidebarTitle: string;
  sidebarDescription: string;
  languageLabel: string;
  languageOptions: Record<GrowattDocLocale, string>;
  copyButton: {
    idle: string;
    copied: string;
    error: string;
    title: string;
  };
  buildInfoLabels: {
    version: string;
    commit: string;
    lastUpdate: string;
  };
}

const LOCALE_TEXT: Record<GrowattDocLocale, LocaleText> = {
  en: {
    overviewLabel: "Overview",
    browseLabel: "Browse API Docs",
    navAriaLabel: "Growatt API navigation",
    sourceFileLabel: "Source file",
    sidebarTitle: "Growatt Open API",
    sidebarDescription: "Published bilingual Growatt Open API documentation.",
    languageLabel: "Language",
    languageOptions: {
      en: "EN",
      "zh-CN": "中文",
    },
    copyButton: {
      idle: "Copy Markdown",
      copied: "Copied",
      error: "Copy failed",
      title: "Copy this page as Markdown",
    },
    buildInfoLabels: {
      version: "Version",
      commit: "Commit",
      lastUpdate: "Last Update",
    },
  },
  "zh-CN": {
    overviewLabel: "总览",
    browseLabel: "浏览 API 文档",
    navAriaLabel: "Growatt API 导航",
    sourceFileLabel: "源文件",
    sidebarTitle: "Growatt Open API",
    sidebarDescription: "Growatt Open API 中英双语公开文档。",
    languageLabel: "语言",
    languageOptions: {
      en: "EN",
      "zh-CN": "中文",
    },
    copyButton: {
      idle: "复制 Markdown",
      copied: "已复制",
      error: "复制失败",
      title: "复制当前页面 Markdown",
    },
    buildInfoLabels: {
      version: "版本",
      commit: "提交",
      lastUpdate: "更新时间",
    },
  },
};

interface GrowattDocsShellProps {
  docsByLocale: Record<GrowattDocLocale, GrowattDocMeta[]>;
  specialPages: GrowattSpecialPageNavMeta[];
  activeSlug: string | null;
  headingByLocale: Record<GrowattDocLocale, string>;
  subheadingByLocale?: Partial<Record<GrowattDocLocale, string>>;
  contentMarkdownByLocale: Record<GrowattDocLocale, string>;
  contentHtmlByLocale: Record<GrowattDocLocale, string>;
  buildInfo?: BuildInfo;
}

function normalizeLocale(rawLocale: string | null | undefined): GrowattDocLocale {
  if (rawLocale === "zh-CN") {
    return "zh-CN";
  }

  return DEFAULT_LOCALE;
}

function DocsNav({
  docsByLocale,
  specialPages,
  activeSlug,
  locale,
  withLocaleHref,
}: {
  docsByLocale: Record<GrowattDocLocale, GrowattDocMeta[]>;
  specialPages: GrowattSpecialPageNavMeta[];
  activeSlug: string | null;
  locale: GrowattDocLocale;
  withLocaleHref: (href: string) => string;
}) {
  const docs = docsByLocale[locale];
  const localeText = LOCALE_TEXT[locale];
  const beforeDocsPages = specialPages.filter(
    (page) => (page.placement ?? "beforeDocs") === "beforeDocs",
  );
  const afterDocsPages = specialPages.filter((page) => page.placement === "afterDocs");

  return (
    <nav className="growatt-docs-nav" aria-label={localeText.navAriaLabel}>
      <Link
        className={`growatt-docs-nav-link ${activeSlug === null ? "active" : ""}`.trim()}
        href={withLocaleHref("/growatt-openapi")}
      >
        {localeText.overviewLabel}
      </Link>
      {beforeDocsPages.map((page) =>
        page.requiresDocumentNavigation ? (
          <a
            key={page.slug}
            className={`growatt-docs-nav-link ${activeSlug === page.slug ? "active" : ""}`.trim()}
            href={withLocaleHref(`/growatt-openapi/${page.slug}`)}
          >
            {page.labelByLocale[locale]}
          </a>
        ) : (
          <Link
            key={page.slug}
            className={`growatt-docs-nav-link ${activeSlug === page.slug ? "active" : ""}`.trim()}
            href={withLocaleHref(`/growatt-openapi/${page.slug}`)}
          >
            {page.labelByLocale[locale]}
          </Link>
        ),
      )}
      {docs.map((doc) => (
        <Link
          key={doc.slug}
          className={`growatt-docs-nav-link ${activeSlug === doc.slug ? "active" : ""}`.trim()}
          href={withLocaleHref(`/growatt-openapi/${doc.slug}`)}
        >
          {doc.fileName} - {doc.title}
        </Link>
      ))}
      {afterDocsPages.length > 0 && <div className="growatt-docs-nav-divider" aria-hidden="true" />}
      {afterDocsPages.map((page) =>
        page.requiresDocumentNavigation ? (
          <a
            key={page.slug}
            className={`growatt-docs-nav-link ${activeSlug === page.slug ? "active" : ""}`.trim()}
            href={withLocaleHref(`/growatt-openapi/${page.slug}`)}
          >
            {page.labelByLocale[locale]}
          </a>
        ) : (
          <Link
            key={page.slug}
            className={`growatt-docs-nav-link ${activeSlug === page.slug ? "active" : ""}`.trim()}
            href={withLocaleHref(`/growatt-openapi/${page.slug}`)}
          >
            {page.labelByLocale[locale]}
          </Link>
        ),
      )}
    </nav>
  );
}

export function GrowattDocsShell({
  docsByLocale,
  specialPages,
  activeSlug,
  headingByLocale,
  subheadingByLocale,
  contentMarkdownByLocale,
  contentHtmlByLocale,
  buildInfo,
}: GrowattDocsShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasExplicitLocale = Boolean(searchParams.get("lang"));
  const locale = normalizeLocale(searchParams.get("lang"));

  useEffect(() => {
    if (hasExplicitLocale) {
      return;
    }

    const rememberedLocale = normalizeLocale(window.localStorage.getItem("growatt-docs-lang"));
    if (rememberedLocale === DEFAULT_LOCALE) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", rememberedLocale);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [hasExplicitLocale, pathname, router, searchParams]);

  const localeText = LOCALE_TEXT[locale];
  const heading = headingByLocale[locale];
  const subheading = subheadingByLocale?.[locale];
  const contentMarkdown = contentMarkdownByLocale[locale];
  const contentHtml = contentHtmlByLocale[locale];

  const withLocaleHref = useMemo(
    () => (href: string) => {
      const separator = href.includes("?") ? "&" : "?";
      return `${href}${separator}lang=${locale}`;
    },
    [locale],
  );

  const handleLocaleChange = (nextLocale: GrowattDocLocale) => {
    window.localStorage.setItem("growatt-docs-lang", nextLocale);

    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", nextLocale);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const formatBuildTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString(locale === "zh-CN" ? "zh-CN" : "en-US", {
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
          <div className="growatt-docs-sidebar-inner">
            <h1>{localeText.sidebarTitle}</h1>
            <p>{localeText.sidebarDescription}</p>
            <div className="growatt-docs-language-switcher">
              <span className="growatt-docs-language-label">{localeText.languageLabel}</span>
              <div className="growatt-docs-language-options">
                {SUPPORTED_LOCALES.map((supportedLocale) => (
                  <button
                    key={supportedLocale}
                    type="button"
                    className={`growatt-docs-language-option ${locale === supportedLocale ? "active" : ""}`.trim()}
                    onClick={() => handleLocaleChange(supportedLocale)}
                  >
                    {localeText.languageOptions[supportedLocale]}
                  </button>
                ))}
              </div>
            </div>
            <DocsNav
              docsByLocale={docsByLocale}
              specialPages={specialPages}
              activeSlug={activeSlug}
              locale={locale}
              withLocaleHref={withLocaleHref}
            />
          </div>
        </aside>

        <main className="growatt-docs-main">
          <details className="growatt-docs-mobile-nav">
            <summary>{localeText.browseLabel}</summary>
            <div className="growatt-docs-mobile-nav-panel">
              <div className="growatt-docs-language-switcher growatt-docs-language-switcher-mobile">
                <span className="growatt-docs-language-label">{localeText.languageLabel}</span>
                <div className="growatt-docs-language-options">
                  {SUPPORTED_LOCALES.map((supportedLocale) => (
                    <button
                      key={supportedLocale}
                      type="button"
                      className={`growatt-docs-language-option ${locale === supportedLocale ? "active" : ""}`.trim()}
                      onClick={() => handleLocaleChange(supportedLocale)}
                    >
                      {localeText.languageOptions[supportedLocale]}
                    </button>
                  ))}
                </div>
              </div>
              <DocsNav
                docsByLocale={docsByLocale}
                specialPages={specialPages}
                activeSlug={activeSlug}
                locale={locale}
                withLocaleHref={withLocaleHref}
              />
            </div>
          </details>

          <header className="growatt-docs-header">
            <div className="growatt-docs-header-top">
              <div className="growatt-docs-header-copy-content">
                <h2>{heading}</h2>
                {subheading && <p>{subheading}</p>}
              </div>
              <CopyMarkdownButton markdown={contentMarkdown} labels={localeText.copyButton} />
            </div>
            {buildInfo && (
              <div className="growatt-docs-header-meta">
                <span className="build-info">
                  <span className="build-info-label">{localeText.buildInfoLabels.version}:</span>{" "}
                  <code>{buildInfo.gitVersion}</code>
                </span>
                <span className="build-info-divider">|</span>
                <span className="build-info">
                  <span className="build-info-label">{localeText.buildInfoLabels.commit}:</span>{" "}
                  <code>{buildInfo.gitCommit}</code>
                </span>
                <span className="build-info-divider">|</span>
                <span className="build-info">
                  <span className="build-info-label">{localeText.buildInfoLabels.lastUpdate}:</span>{" "}
                  <code>{formatBuildTime(buildInfo.buildTime)}</code>
                </span>
              </div>
            )}
          </header>

          <article className="growatt-docs-content">
            <MermaidRenderer
              key={`${activeSlug ?? "overview"}:${locale}`}
              content={contentHtml}
            />
          </article>
        </main>
      </div>
    </div>
  );
}
