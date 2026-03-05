import type { MermaidConfig } from "mermaid";

export type MermaidColorMode = "light" | "dark";
export type MermaidRenderMode = "auto" | MermaidColorMode;

interface MermaidThemeTokens {
  canvas: string;
  surface: string;
  border: string;
  text: string;
  mutedText: string;
  line: string;
  actorSurface: string;
  noteSurface: string;
  noteText: string;
  edgeLabelSurface: string;
  activationSurface: string;
  accent: string;
}

const MERMAID_THEME_TOKENS: Record<MermaidColorMode, MermaidThemeTokens> = {
  light: {
    canvas: "#ffffff",
    surface: "#f1f5f9",
    border: "#2563eb",
    text: "#0b1220",
    mutedText: "#1f2937",
    line: "#334155",
    actorSurface: "#f1f5f9",
    noteSurface: "#fff7ed",
    noteText: "#7c2d12",
    edgeLabelSurface: "#ffffff",
    activationSurface: "#dbeafe",
    accent: "#2563eb",
  },
  dark: {
    canvas: "#0b1220",
    surface: "#13233a",
    border: "#7dd3fc",
    text: "#f8fafc",
    mutedText: "#e2e8f0",
    line: "#dbeafe",
    actorSurface: "#13233a",
    noteSurface: "#3b2a05",
    noteText: "#ffedd5",
    edgeLabelSurface: "#0f1d33",
    activationSurface: "#1d4ed8",
    accent: "#93c5fd",
  },
};

function extractModeFromValue(value: string | null | undefined): MermaidColorMode | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  if (normalized.includes("dark")) {
    return "dark";
  }

  if (normalized.includes("light")) {
    return "light";
  }

  return null;
}

function extractElementMode(element: Element | null | undefined): MermaidColorMode | null {
  if (!element) {
    return null;
  }

  const themeAttrs = ["data-mermaid-mode", "data-theme", "data-color-scheme", "color-scheme"];
  for (const attr of themeAttrs) {
    const modeFromAttr = extractModeFromValue(element.getAttribute(attr));
    if (modeFromAttr) {
      return modeFromAttr;
    }
  }

  const classList = element.getAttribute("class") || "";
  const modeFromClass = extractModeFromValue(classList);
  if (modeFromClass) {
    return modeFromClass;
  }

  const inlineColorScheme = extractModeFromValue((element as HTMLElement).style?.colorScheme);
  if (inlineColorScheme) {
    return inlineColorScheme;
  }

  return null;
}

export function resolveMermaidColorMode(root: HTMLElement | null): MermaidColorMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const candidates: Array<Element | null> = [
    root,
    typeof document !== "undefined" ? document.documentElement : null,
    typeof document !== "undefined" ? document.body : null,
  ];

  for (const candidate of candidates) {
    const mode = extractElementMode(candidate);
    if (mode) {
      return mode;
    }
  }

  if (typeof window.matchMedia === "function") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  return "light";
}

export function getMermaidThemeVariables(mode: MermaidColorMode): Record<string, string | boolean> {
  const tokens = MERMAID_THEME_TOKENS[mode];

  return {
    darkMode: mode === "dark",
    background: tokens.canvas,
    primaryColor: tokens.surface,
    primaryTextColor: tokens.text,
    primaryBorderColor: tokens.border,
    lineColor: tokens.line,
    secondaryColor: tokens.surface,
    tertiaryColor: tokens.canvas,
    mainBkg: tokens.surface,
    secondBkg: tokens.canvas,
    tertiaryBkg: tokens.surface,
    nodeBorder: tokens.border,
    clusterBkg: tokens.canvas,
    clusterBorder: tokens.border,
    titleColor: tokens.text,
    edgeLabelBackground: tokens.edgeLabelSurface,
    textColor: tokens.text,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif",
    fontSize: "14px",
    actorBkg: tokens.actorSurface,
    actorBorder: tokens.border,
    actorTextColor: tokens.text,
    actorLineColor: tokens.line,
    signalColor: tokens.line,
    signalTextColor: tokens.text,
    labelBoxBkgColor: tokens.edgeLabelSurface,
    labelBoxBorderColor: tokens.border,
    labelTextColor: tokens.text,
    noteBkgColor: tokens.noteSurface,
    noteBorderColor: tokens.border,
    noteTextColor: tokens.noteText,
    activationBkgColor: tokens.activationSurface,
    activationBorderColor: tokens.border,
    fillType0: tokens.surface,
    fillType1: tokens.canvas,
    fillType2: tokens.surface,
    fillType3: tokens.canvas,
    fillType4: tokens.surface,
    fillType5: tokens.canvas,
    fillType6: tokens.surface,
    fillType7: tokens.canvas,
  };
}

export function getMermaidThemeCss(mode: MermaidColorMode): string {
  const tokens = MERMAID_THEME_TOKENS[mode];

  return `
    svg {
      background: ${tokens.canvas} !important;
      color: ${tokens.text} !important;
    }

    .background,
    rect.background,
    path.background {
      fill: ${tokens.canvas} !important;
      stroke: none !important;
      stroke-width: 0 !important;
    }

    .cluster rect,
    .stateGroup rect,
    .statediagram rect,
    .statediagram-cluster rect,
    .sequenceDiagram .actor,
    .sequenceDiagram .actor rect,
    .sequenceDiagram .labelBox,
    .sequenceDiagram .note {
      fill: ${tokens.surface} !important;
      stroke: ${tokens.border} !important;
    }

    .sequenceDiagram .actor-line,
    .sequenceDiagram .messageLine0,
    .sequenceDiagram .messageLine1,
    .sequenceDiagram .loopLine,
    .sequenceDiagram .sequenceNumber,
    .statediagram .transition,
    .statediagram .relation,
    .statediagram .line,
    .statediagram path,
    .statediagram line,
    .edgePath .path,
    .flowchart-link,
    .messageLine0,
    .messageLine1,
    .loopLine {
      stroke: ${tokens.line} !important;
      stroke-width: 1.8px !important;
    }

    marker path,
    .marker path,
    .arrowheadPath {
      fill: ${tokens.line} !important;
      stroke: ${tokens.line} !important;
    }

    .sequenceDiagram .messageText,
    .sequenceDiagram .labelText,
    .sequenceDiagram .actor text,
    .sequenceDiagram text,
    .statediagram text,
    .stateLabel text,
    .state-title,
    .flowchart-label text,
    text,
    tspan,
    .label,
    .nodeLabel,
    .edgeLabel {
      fill: ${tokens.text} !important;
      color: ${tokens.text} !important;
    }

    .edgeLabel,
    .labelBox {
      background: ${tokens.edgeLabelSurface} !important;
      fill: ${tokens.edgeLabelSurface} !important;
      color: ${tokens.text} !important;
    }

    .note {
      fill: ${tokens.noteSurface} !important;
      stroke: ${tokens.border} !important;
    }

    .noteText,
    .note text {
      fill: ${tokens.noteText} !important;
      color: ${tokens.noteText} !important;
    }

    .activation0,
    .activation1,
    .activation2,
    .activation3 {
      fill: ${tokens.activationSurface} !important;
      stroke: ${tokens.accent} !important;
    }

    .messageText,
    .loopText,
    .labelText {
      fill: ${tokens.text} !important;
      color: ${tokens.text} !important;
    }

    .taskText,
    .taskTextOutsideRight,
    .taskTextOutsideLeft {
      fill: ${tokens.mutedText} !important;
      color: ${tokens.mutedText} !important;
    }
  `;
}

export function buildMermaidConfig(mode: MermaidColorMode): MermaidConfig {
  return {
    startOnLoad: false,
    theme: "base",
    deterministicIds: true,
    darkMode: mode === "dark",
    themeVariables: getMermaidThemeVariables(mode),
    themeCSS: getMermaidThemeCss(mode),
    securityLevel: "loose",
  };
}
