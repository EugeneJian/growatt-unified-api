"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidRendererProps {
  content: string;
}

const MERMAID_THEME_VARIABLES = {
  darkMode: false,
  background: "#ffffff",
  primaryColor: "#f8fafc",
  primaryTextColor: "#0f172a",
  primaryBorderColor: "#2563eb",
  lineColor: "#334155",
  secondaryColor: "#f1f5f9",
  tertiaryColor: "#f8fafc",
  mainBkg: "#f8fafc",
  secondBkg: "#ffffff",
  tertiaryBkg: "#f8fafc",
  nodeBorder: "#2563eb",
  clusterBkg: "#ffffff",
  clusterBorder: "#cbd5e1",
  titleColor: "#0f172a",
  edgeLabelBackground: "#ffffff",
  textColor: "#0f172a",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif",
  fontSize: "14px",
  actorBkg: "#f8fafc",
  actorBorder: "#2563eb",
  actorTextColor: "#0f172a",
  actorLineColor: "#334155",
  signalColor: "#334155",
  signalTextColor: "#0f172a",
  labelBoxBkgColor: "#ffffff",
  labelBoxBorderColor: "#cbd5e1",
  labelTextColor: "#0f172a",
  noteBkgColor: "#fff7ed",
  noteBorderColor: "#fdba74",
  noteTextColor: "#7c2d12",
  activationBkgColor: "#dbeafe",
  activationBorderColor: "#2563eb",
};

const MERMAID_SVG_ENFORCED_STYLE = `
  svg { background: #ffffff !important; color: #0f172a !important; }
  .background, rect.background { fill: #ffffff !important; }
  .edgePath .path, .flowchart-link, .messageLine0, .messageLine1, .loopLine {
    stroke: #334155 !important;
    stroke-width: 1.8px !important;
  }
  marker path, .marker path, .arrowheadPath {
    fill: #334155 !important;
    stroke: #334155 !important;
  }
  text, tspan, .label, .nodeLabel, .edgeLabel {
    fill: #0f172a !important;
    color: #0f172a !important;
  }
`;

export function MermaidRenderer({ content }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "neutral",
      deterministicIds: true,
      darkMode: false,
      themeVariables: MERMAID_THEME_VARIABLES,
      securityLevel: "loose",
    });

    const initMermaid = async () => {
      if (!containerRef.current) return;

      // Find all mermaid code blocks
      const codeBlocks = containerRef.current.querySelectorAll("pre code.language-mermaid, code.mermaid");

      for (const block of codeBlocks) {
        const parent = block.parentElement;
        if (!parent) continue;

        const graphDefinition = block.textContent || "";
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

        try {
          const { svg, bindFunctions } = await mermaid.render(id, graphDefinition);
          const wrapper = document.createElement("figure");
          wrapper.className = "mermaid-diagram";
          wrapper.setAttribute("data-mermaid-theme", "light");
          wrapper.innerHTML = svg;

          const svgElement = wrapper.querySelector("svg");
          if (svgElement) {
            svgElement.classList.add("mermaid-svg");
            svgElement.style.backgroundColor = "#ffffff";
            svgElement.style.maxWidth = "none";
            svgElement.style.height = "auto";
            svgElement.setAttribute("role", "img");
            svgElement.setAttribute("aria-label", "Mermaid diagram");

            const styleElement = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "style",
            );
            styleElement.textContent = MERMAID_SVG_ENFORCED_STYLE;
            svgElement.prepend(styleElement);
          }

          if (bindFunctions) {
            bindFunctions(wrapper);
          }

          parent.replaceWith(wrapper);
        } catch (error) {
          console.error("Mermaid render error:", error);
          // Keep the original code block if render fails
        }
      }
    };

    initMermaid();
  }, [content]);

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: content }} />;
}
