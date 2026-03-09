"use client";

import { useEffect, useRef, useState } from "react";

interface CopyMarkdownButtonProps {
  markdown: string;
}

type CopyState = "idle" | "copied" | "error";

function fallbackCopyText(text: string): boolean {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.top = "-9999px";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();

  try {
    return document.execCommand("copy");
  } finally {
    document.body.removeChild(textArea);
  }
}

export function CopyMarkdownButton({ markdown }: CopyMarkdownButtonProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const queueReset = () => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = window.setTimeout(() => {
      setCopyState("idle");
      resetTimerRef.current = null;
    }, 2200);
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(markdown);
      } else if (!fallbackCopyText(markdown)) {
        throw new Error("Clipboard API unavailable");
      }

      setCopyState("copied");
    } catch {
      setCopyState("error");
    } finally {
      queueReset();
    }
  };

  const buttonLabel = copyState === "copied"
    ? "Copied"
    : copyState === "error"
      ? "Copy failed"
      : "Copy Markdown";

  return (
    <button
      type="button"
      className={`growatt-docs-copy-button ${copyState !== "idle" ? `is-${copyState}` : ""}`.trim()}
      onClick={() => void handleCopy()}
      aria-live="polite"
      title="Copy this page as Markdown"
    >
      {buttonLabel}
    </button>
  );
}
