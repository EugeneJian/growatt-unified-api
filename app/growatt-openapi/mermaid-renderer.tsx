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
  fillType0: "#f8fafc",
  fillType1: "#f1f5f9",
  fillType2: "#ffffff",
  fillType3: "#f8fafc",
  fillType4: "#f1f5f9",
  fillType5: "#ffffff",
  fillType6: "#f8fafc",
  fillType7: "#f1f5f9",
};

const MERMAID_SVG_ENFORCED_STYLE = `
  svg { background: #ffffff !important; color: #0f172a !important; }
  .background, rect.background, path.background {
    fill: #ffffff !important;
    stroke: none !important;
    stroke-width: 0 !important;
  }
  svg > rect:first-child {
    stroke: none !important;
    stroke-width: 0 !important;
  }
  .cluster rect,
  .stateGroup rect,
  .statediagram rect,
  .statediagram-cluster rect {
    fill: #ffffff !important;
    stroke: #2563eb !important;
  }
  .sequenceDiagram .actor,
  .sequenceDiagram .actor rect,
  .sequenceDiagram .labelBox,
  .sequenceDiagram .note {
    fill: #f8fafc !important;
    stroke: #2563eb !important;
  }
  .sequenceDiagram .actor-line,
  .sequenceDiagram .messageLine0,
  .sequenceDiagram .messageLine1,
  .sequenceDiagram .loopLine,
  .sequenceDiagram .sequenceNumber {
    stroke: #334155 !important;
    stroke-width: 1.8px !important;
  }
  .sequenceDiagram .messageText,
  .sequenceDiagram .labelText,
  .sequenceDiagram .actor text,
  .sequenceDiagram text,
  .statediagram text,
  .stateLabel text,
  .state-title,
  .flowchart-label text {
    fill: #0f172a !important;
    color: #0f172a !important;
  }
  .statediagram .transition,
  .statediagram .relation,
  .statediagram .line,
  .statediagram path,
  .statediagram line {
    stroke: #334155 !important;
    stroke-width: 1.8px !important;
  }
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

function parseSize(value: string | null): number {
  if (!value) {
    return 0;
  }
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeMermaidDefinition(raw: string): string {
  return raw
    .replace(/\r\n?/g, "\n")
    .replace(/\u00A0/g, " ")
    .split("\n")
    .filter((line) => !line.trim().startsWith("%%"))
    .join("\n")
    .trim();
}

function forceLightDiagramBackground(svgElement: SVGSVGElement): void {
  const rects = Array.from(svgElement.querySelectorAll("rect"));
  let largestRect: SVGRectElement | null = null;
  let largestArea = 0;

  for (const rect of rects) {
    const width = parseSize(rect.getAttribute("width"));
    const height = parseSize(rect.getAttribute("height"));
    const area = width * height;
    if (area > largestArea) {
      largestArea = area;
      largestRect = rect;
    }
  }

  if (largestRect) {
    largestRect.setAttribute("fill", "#ffffff");
    largestRect.style.fill = "#ffffff";
    largestRect.setAttribute("stroke", "none");
    largestRect.style.stroke = "none";
    largestRect.setAttribute("stroke-width", "0");
    largestRect.style.strokeWidth = "0";
  }

  // Additional fallback for non-rect background shapes used by some Mermaid types.
  const bgCandidates = Array.from(
    svgElement.querySelectorAll("path.background, .background path, .statediagram path.rect"),
  );
  for (const candidate of bgCandidates) {
    candidate.setAttribute("fill", "#ffffff");
    candidate.setAttribute("stroke", "none");
    candidate.setAttribute("stroke-width", "0");
    if (candidate instanceof SVGElement) {
      candidate.style.fill = "#ffffff";
      candidate.style.stroke = "none";
      candidate.style.strokeWidth = "0";
    }
  }

  // Ultimate fallback: ensure the root svg background is white even when internal theme draws dark layers.
  const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bgRect.setAttribute("x", "0");
  bgRect.setAttribute("y", "0");
  bgRect.setAttribute("width", "100%");
  bgRect.setAttribute("height", "100%");
  bgRect.setAttribute("fill", "#ffffff");
  bgRect.setAttribute("stroke", "none");
  bgRect.setAttribute("stroke-width", "0");
  bgRect.style.fill = "#ffffff";
  bgRect.style.stroke = "none";
  bgRect.style.strokeWidth = "0";
  svgElement.insertBefore(bgRect, svgElement.firstChild);
}

export function MermaidRenderer({ content }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
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

        const rawDefinition = block.textContent || "";
        const graphDefinition = normalizeMermaidDefinition(rawDefinition);
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

        try {
          let rendered = await mermaid.render(id, graphDefinition);
          if (!rendered?.svg) {
            const fallbackDefinition = graphDefinition
              .replace(/[“”]/g, "\"")
              .replace(/[‘’]/g, "'")
              .replace(/\t/g, "    ");
            rendered = await mermaid.render(`${id}-fallback`, fallbackDefinition);
          }

          const { svg, bindFunctions } = rendered;
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

            forceLightDiagramBackground(svgElement);
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
