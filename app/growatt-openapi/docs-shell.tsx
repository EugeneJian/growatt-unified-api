"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { GrowattDocLocale, GrowattDocMeta } from "@/lib/growatt-docs";
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
    sidebarDescription: "Official bilingual documentation aligned to the SSOT markdown source.",
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
    sidebarDescription: "基于 SSOT Markdown 对齐维护的中英文双语文档。",
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

interface QuickGuideNavMeta {
  slug: string;
  labelByLocale: Record<GrowattDocLocale, string>;
}

interface GrowattDocsShellProps {
  docsByLocale: Record<GrowattDocLocale, GrowattDocMeta[]>;
  quickGuide: QuickGuideNavMeta;
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
  quickGuide,
  activeSlug,
  locale,
  withLocaleHref,
}: {
  docsByLocale: Record<GrowattDocLocale, GrowattDocMeta[]>;
  quickGuide: QuickGuideNavMeta;
  activeSlug: string | null;
  locale: GrowattDocLocale;
  withLocaleHref: (href: string) => string;
}) {
  const docs = docsByLocale[locale];
  const localeText = LOCALE_TEXT[locale];

  return (
    <nav className="growatt-docs-nav" aria-label={localeText.navAriaLabel}>
      <Link
        className={`growatt-docs-nav-link ${activeSlug === null ? "active" : ""}`.trim()}
        href={withLocaleHref("/growatt-openapi")}
      >
        {localeText.overviewLabel}
      </Link>
      <Link
        className={`growatt-docs-nav-link ${activeSlug === quickGuide.slug ? "active" : ""}`.trim()}
        href={withLocaleHref(`/growatt-openapi/${quickGuide.slug}`)}
      >
        {quickGuide.labelByLocale[locale]}
      </Link>
      {docs.map((doc) => (
        <Link
          key={doc.slug}
          className={`growatt-docs-nav-link ${activeSlug === doc.slug ? "active" : ""}`.trim()}
          href={withLocaleHref(`/growatt-openapi/${doc.slug}`)}
        >
          {doc.fileName} · {doc.title}
        </Link>
      ))}
    </nav>
  );
}

export function GrowattDocsShell({
  docsByLocale,
  quickGuide,
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
  const searchParamLocale = normalizeLocale(searchParams.get("lang"));
  const [locale, setLocale] = useState<GrowattDocLocale>(searchParamLocale);

  useEffect(() => {
    const rememberedLocale = normalizeLocale(window.localStorage.getItem("growatt-docs-lang"));
    const nextLocale = searchParams.get("lang") ? searchParamLocale : rememberedLocale;
    setLocale(nextLocale);
  }, [searchParamLocale, searchParams]);

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
    setLocale(nextLocale);
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
            quickGuide={quickGuide}
            activeSlug={activeSlug}
            locale={locale}
            withLocaleHref={withLocaleHref}
          />
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
                quickGuide={quickGuide}
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
