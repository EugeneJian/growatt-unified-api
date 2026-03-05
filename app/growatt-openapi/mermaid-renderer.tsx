"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";
import {
  buildMermaidConfig,
  resolveMermaidColorMode,
  type MermaidColorMode,
  type MermaidRenderMode,
} from "@/lib/mermaid/theme";
import { sanitizeMermaidDefinition } from "@/lib/mermaid/sanitize";

interface MermaidRendererProps {
  content: string;
  mode?: MermaidRenderMode;
}

export function MermaidRenderer({ content, mode = "auto" }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedModeRef = useRef<MermaidColorMode | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    let disposed = false;
    let renderRunId = 0;
    let activeMode: MermaidColorMode = mode === "auto"
      ? resolveMermaidColorMode(container)
      : mode;

    const renderMermaid = async (targetMode: MermaidColorMode) => {
      const thisRunId = ++renderRunId;
      const host = containerRef.current;
      if (!host || disposed) {
        return;
      }

      // Reset to source HTML so reruns (e.g. mode changes) always start from raw mermaid code blocks.
      host.innerHTML = content;

      if (initializedModeRef.current !== targetMode) {
        mermaid.initialize(buildMermaidConfig(targetMode));
        initializedModeRef.current = targetMode;
      }

      const codeBlocks = host.querySelectorAll("pre code.language-mermaid");

      for (const block of codeBlocks) {
        if (disposed || thisRunId !== renderRunId) {
          return;
        }

        const parent = block.closest("pre");
        if (!parent) {
          continue;
        }

        const rawDefinition = block.textContent || "";
        const graphDefinition = sanitizeMermaidDefinition(rawDefinition);
        if (!graphDefinition) {
          continue;
        }

        const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`;

        try {
          let rendered = await mermaid.render(id, graphDefinition);
          if (!rendered?.svg) {
            const fallbackDefinition = graphDefinition
              .replace(/[“”]/g, "\"")
              .replace(/[‘’]/g, "'")
              .replace(/\t/g, "    ");
            rendered = await mermaid.render(`${id}-fallback`, fallbackDefinition);
          }

          if (disposed || thisRunId !== renderRunId) {
            return;
          }

          const { svg, bindFunctions } = rendered;
          const wrapper = document.createElement("figure");
          wrapper.className = "mermaid-diagram";
          wrapper.setAttribute("data-mermaid-mode", targetMode);
          wrapper.innerHTML = svg;

          const svgElement = wrapper.querySelector("svg");
          if (svgElement) {
            svgElement.classList.add("mermaid-svg");
            svgElement.style.maxWidth = "none";
            svgElement.style.height = "auto";
            svgElement.setAttribute("role", "img");
            svgElement.setAttribute("aria-label", "Mermaid diagram");
          }

          bindFunctions?.(wrapper);
          parent.replaceWith(wrapper);
        } catch (error) {
          console.error("Mermaid render error:", error);
        }
      }
    };

    void renderMermaid(activeMode);

    if (mode !== "auto" || typeof window === "undefined") {
      return () => {
        disposed = true;
      };
    }

    const refreshModeIfNeeded = () => {
      const nextMode = resolveMermaidColorMode(containerRef.current);
      if (nextMode === activeMode) {
        return;
      }

      activeMode = nextMode;
      void renderMermaid(activeMode);
    };

    const media = typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;
    if (media) {
      if (typeof media.addEventListener === "function") {
        media.addEventListener("change", refreshModeIfNeeded);
      } else if (typeof media.addListener === "function") {
        media.addListener(refreshModeIfNeeded);
      }
    }

    let observer: MutationObserver | null = null;
    if (typeof MutationObserver !== "undefined" && typeof document !== "undefined") {
      observer = new MutationObserver(refreshModeIfNeeded);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "data-theme", "data-color-scheme", "style", "data-mermaid-mode"],
      });
    }

    return () => {
      disposed = true;

      if (media) {
        if (typeof media.removeEventListener === "function") {
          media.removeEventListener("change", refreshModeIfNeeded);
        } else if (typeof media.removeListener === "function") {
          media.removeListener(refreshModeIfNeeded);
        }
      }

      observer?.disconnect();
    };
  }, [content, mode]);

  return <div ref={containerRef} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: content }} />;
}
