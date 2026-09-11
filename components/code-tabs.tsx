"use client";

import { useState } from "react";
import "./code-tabs.css";

export interface CodeExample {
  language: string;
  label: string;
  code: string;
}

interface CodeTabsProps {
  examples: CodeExample[];
  highlightPlaceholders?: string[];
}

export function CodeTabs({ examples, highlightPlaceholders = [] }: CodeTabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(examples[activeTab].code);
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2000);
    }
  };

  const highlightCode = (code: string) => {
    let highlighted = code;
    highlightPlaceholders.forEach((placeholder) => {
      const regex = new RegExp(`(${placeholder})`, "g");
      highlighted = highlighted.replace(
        regex,
        '<span class="code-placeholder">$1</span>'
      );
    });
    return highlighted;
  };

  return (
    <div className="code-tabs">
      <div className="code-tabs-header">
        <div className="code-tabs-nav">
          {examples.map((example, index) => (
            <button
              key={example.language}
              type="button"
              className={`code-tab ${activeTab === index ? "active" : ""}`}
              onClick={() => setActiveTab(index)}
            >
              {example.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="code-copy-button"
          onClick={handleCopy}
          title="复制代码"
        >
          {copyStatus === "idle" && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 4V12C4 12.5523 4.44772 13 5 13H11"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <rect
                x="6"
                y="3"
                width="7"
                height="9"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          )}
          {copyStatus === "copied" && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8L6 11L13 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {copyStatus === "error" && "✗"}
          <span className="code-copy-label">
            {copyStatus === "idle" && "复制"}
            {copyStatus === "copied" && "已复制"}
            {copyStatus === "error" && "失败"}
          </span>
        </button>
      </div>
      <div className="code-tabs-content">
        <pre>
          <code
            className={`language-${examples[activeTab].language}`}
            dangerouslySetInnerHTML={{
              __html: highlightCode(examples[activeTab].code),
            }}
          />
        </pre>
      </div>
    </div>
  );
}
