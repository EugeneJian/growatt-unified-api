"use client";

import { useSearchParams } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import type { GrowattDocLocale } from "@/lib/growatt-docs";

const LABELS: Record<GrowattDocLocale, { label: string; latest: string }> = {
  en: { label: "Version", latest: "latest" },
  "zh-CN": { label: "版本", latest: "最新" },
};

interface VersionSelectorProps {
  versions: string[];
  currentVersion: string;
}

function getLocale(searchParams: URLSearchParams): GrowattDocLocale {
  const raw = searchParams.get("lang");
  if (raw === "zh-CN") return "zh-CN";
  return "en";
}

export function VersionSelector({ versions, currentVersion }: VersionSelectorProps) {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const locale = getLocale(searchParams);
  const texts = LABELS[locale];
  const isLatest = currentVersion === versions[0];

  const handleSelect = useCallback(
    (version: string) => {
      setOpen(false);
      const params = new URLSearchParams(window.location.search);
      // Keep existing lang param, update version
      if (version === versions[0]) {
        params.delete("version");
      } else {
        params.set("version", version);
      }
      const queryString = params.toString();
      window.location.href = queryString
        ? `${window.location.pathname}?${queryString}`
        : window.location.pathname;
    },
    [versions],
  );

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close dropdown on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div className="growatt-docs-version-selector" ref={containerRef}>
      <span className="growatt-docs-version-label">{texts.label}</span>
      <button
        type="button"
        className="growatt-docs-version-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="growatt-docs-version-trigger-text">
          {currentVersion}
          {isLatest && (
            <span className="growatt-docs-version-latest-badge">{texts.latest}</span>
          )}
        </span>
        <svg
          className={`growatt-docs-version-chevron ${open ? "open" : ""}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="growatt-docs-version-dropdown" role="listbox">
          {versions.map((version) => {
            const isSelected = version === currentVersion;
            return (
              <button
                key={version}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`growatt-docs-version-option ${isSelected ? "selected" : ""}`}
                onClick={() => handleSelect(version)}
              >
                <span className="growatt-docs-version-option-text">
                  {version}
                  {version === versions[0] && (
                    <span className="growatt-docs-version-latest-badge">{texts.latest}</span>
                  )}
                </span>
                {isSelected && (
                  <svg
                    className="growatt-docs-version-check"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2.5 7L5.5 10L11.5 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
