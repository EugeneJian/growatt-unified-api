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

function parseCssColorToRgb(color: string): [number, number, number] | null {
  const value = color.trim().toLowerCase();
  if (!value || value === "none" || value === "transparent" || value === "currentcolor") {
    return null;
  }

  const hexMatch = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    const raw = hexMatch[1];
    if (raw.length === 3) {
      return [
        Number.parseInt(raw[0] + raw[0], 16),
        Number.parseInt(raw[1] + raw[1], 16),
        Number.parseInt(raw[2] + raw[2], 16),
      ];
    }
    return [
      Number.parseInt(raw.slice(0, 2), 16),
      Number.parseInt(raw.slice(2, 4), 16),
      Number.parseInt(raw.slice(4, 6), 16),
    ];
  }

  const rgbMatch = value.match(/^rgba?\(([^)]+)\)$/);
  if (rgbMatch) {
    const parts = rgbMatch[1]
      .split(",")
      .slice(0, 3)
      .map((part) => Number.parseFloat(part.trim()));
    if (parts.length === 3 && parts.every((part) => Number.isFinite(part))) {
      return [parts[0], parts[1], parts[2]];
    }
  }

  return null;
}

function getRelativeLuminance([r, g, b]: [number, number, number]): number {
  const toLinear = (channel: number) => {
    const normalized = channel / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
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
  svgElement.style.backgroundColor = "#ffffff";

  const viewBox = svgElement.viewBox?.baseVal;
  let canvasWidth = viewBox?.width || 0;
  let canvasHeight = viewBox?.height || 0;

  if (!canvasWidth || !canvasHeight) {
    const widthAttr = parseSize(svgElement.getAttribute("width"));
    const heightAttr = parseSize(svgElement.getAttribute("height"));
    canvasWidth = widthAttr;
    canvasHeight = heightAttr;
  }

  if (!canvasWidth || !canvasHeight) {
    try {
      const bbox = svgElement.getBBox();
      canvasWidth = bbox.width;
      canvasHeight = bbox.height;
    } catch {
      canvasWidth = 1200;
      canvasHeight = 800;
    }
  }

  const backgroundCandidates = Array.from(
    svgElement.querySelectorAll("rect, path, polygon, ellipse, circle"),
  ).filter((element) => element instanceof SVGGraphicsElement) as SVGGraphicsElement[];

  for (const candidate of backgroundCandidates) {
    const tagName = candidate.tagName.toLowerCase();
    const className = candidate.getAttribute("class") || "";
    const fillAttr = candidate.getAttribute("fill");
    const inlineFill = (candidate as SVGElement).style?.fill;
    const color = parseCssColorToRgb(fillAttr || inlineFill || "");

    let bboxWidth = 0;
    let bboxHeight = 0;
    try {
      const bbox = candidate.getBBox();
      bboxWidth = bbox.width;
      bboxHeight = bbox.height;
    } catch {
      // Ignore elements without measurable bbox.
    }

    const area = bboxWidth * bboxHeight;
    const widthRatio = canvasWidth ? bboxWidth / canvasWidth : 0;
    const heightRatio = canvasHeight ? bboxHeight / canvasHeight : 0;
    const isLargeCover = area > 0 && (
      area >= canvasWidth * canvasHeight * 0.35 ||
      (widthRatio >= 0.8 && heightRatio >= 0.6)
    );
    const isLikelyBackgroundClass = /background|root/i.test(className);
    const isDarkFill = color ? getRelativeLuminance(color) < 0.2 : false;

    if (
      isLikelyBackgroundClass ||
      (isLargeCover && isDarkFill && (tagName === "rect" || tagName === "path" || tagName === "polygon"))
    ) {
      candidate.setAttribute("fill", "#ffffff");
      candidate.setAttribute("stroke", "none");
      candidate.setAttribute("stroke-width", "0");
      (candidate as SVGElement).style.fill = "#ffffff";
      (candidate as SVGElement).style.stroke = "none";
      (candidate as SVGElement).style.strokeWidth = "0";
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
