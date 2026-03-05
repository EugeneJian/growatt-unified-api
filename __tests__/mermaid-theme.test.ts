import {
  buildMermaidConfig,
  getMermaidThemeCss,
  getMermaidThemeVariables,
  resolveMermaidColorMode,
} from "@/lib/mermaid/theme";

interface MockElementOptions {
  attrs?: Record<string, string>;
  className?: string;
  colorScheme?: string;
}

type MutableGlobal = typeof globalThis & {
  window?: {
    matchMedia?: (query: string) => { matches: boolean };
  };
  document?: {
    documentElement?: HTMLElement;
    body?: HTMLElement;
  };
};

function mockElement(options: MockElementOptions = {}): HTMLElement {
  const { attrs = {}, className = "", colorScheme = "" } = options;

  return {
    getAttribute(name: string): string | null {
      if (name === "class") {
        return className || null;
      }
      return attrs[name] ?? null;
    },
    style: {
      colorScheme,
    },
  } as unknown as HTMLElement;
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  const pairs = normalized.length === 3
    ? normalized.split("").map((char) => char + char)
    : [normalized.slice(0, 2), normalized.slice(2, 4), normalized.slice(4, 6)];

  return [
    Number.parseInt(pairs[0], 16),
    Number.parseInt(pairs[1], 16),
    Number.parseInt(pairs[2], 16),
  ];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const toLinear = (channel: number) => {
    const normalized = channel / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(a: string, b: string): number {
  const l1 = relativeLuminance(hexToRgb(a));
  const l2 = relativeLuminance(hexToRgb(b));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe("mermaid theme SSOT", () => {
  const mutableGlobal = globalThis as MutableGlobal;
  let previousWindow: MutableGlobal["window"];
  let previousDocument: MutableGlobal["document"];

  beforeEach(() => {
    previousWindow = mutableGlobal.window;
    previousDocument = mutableGlobal.document;
  });

  afterEach(() => {
    if (previousWindow === undefined) {
      delete mutableGlobal.window;
    } else {
      mutableGlobal.window = previousWindow;
    }

    if (previousDocument === undefined) {
      delete mutableGlobal.document;
    } else {
      mutableGlobal.document = previousDocument;
    }
  });

  it("prefers explicit root theme signal", () => {
    mutableGlobal.window = {
      matchMedia: () => ({ matches: false }),
    };
    mutableGlobal.document = {
      documentElement: mockElement({ attrs: { "data-theme": "light" } }),
      body: mockElement(),
    };

    expect(resolveMermaidColorMode(mockElement({ attrs: { "data-theme": "dark" } }))).toBe("dark");
  });

  it("uses document theme signal before system preference", () => {
    mutableGlobal.window = {
      matchMedia: () => ({ matches: false }),
    };
    mutableGlobal.document = {
      documentElement: mockElement({ attrs: { "data-color-scheme": "dark" } }),
      body: mockElement(),
    };

    expect(resolveMermaidColorMode(null)).toBe("dark");
  });

  it("falls back to system preference", () => {
    mutableGlobal.window = {
      matchMedia: () => ({ matches: true }),
    };
    mutableGlobal.document = {
      documentElement: mockElement(),
      body: mockElement(),
    };

    expect(resolveMermaidColorMode(null)).toBe("dark");
  });

  it("defaults to light when window is unavailable", () => {
    delete mutableGlobal.window;
    delete mutableGlobal.document;

    expect(resolveMermaidColorMode(null)).toBe("light");
  });

  it("builds stable config and css per mode", () => {
    const lightConfig = buildMermaidConfig("light");
    const darkConfig = buildMermaidConfig("dark");

    expect(lightConfig.theme).toBe("base");
    expect(lightConfig.darkMode).toBe(false);
    expect(darkConfig.darkMode).toBe(true);
    expect(lightConfig.themeCSS).toBe(getMermaidThemeCss("light"));
    expect(darkConfig.themeCSS).toBe(getMermaidThemeCss("dark"));
  });

  it("keeps text and edge labels above minimum contrast", () => {
    const modes = ["light", "dark"] as const;

    for (const mode of modes) {
      const variables = getMermaidThemeVariables(mode);
      const text = variables.textColor as string;
      const background = variables.background as string;
      const edgeLabelBackground = variables.edgeLabelBackground as string;

      expect(contrastRatio(text, background)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(text, edgeLabelBackground)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
