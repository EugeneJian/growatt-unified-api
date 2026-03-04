"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidRendererProps {
  content: string;
}

export function MermaidRenderer({ content }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      themeVariables: {
        // Light mode colors
        primaryColor: "#e0f2fe",
        primaryTextColor: "#0f172a",
        primaryBorderColor: "#0ea5e9",
        lineColor: "#64748b",
        secondaryColor: "#f1f5f9",
        tertiaryColor: "#f8fafc",
        background: "#ffffff",
        mainBkg: "#e0f2fe",
        nodeBorder: "#0ea5e9",
        clusterBkg: "#f8fafc",
        clusterBorder: "#e2e8f0",
        titleColor: "#0f172a",
        edgeLabelBackground: "#ffffff",
        // Additional light mode variables
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif",
        fontSize: "14px",
        textColor: "#334155",
        nodeTextColor: "#1e293b",
        arrowheadColor: "#64748b",
        actorBorder: "#0ea5e9",
        actorBkg: "#e0f2fe",
        actorTextColor: "#0f172a",
        actorLineColor: "#64748b",
        signalColor: "#64748b",
        signalTextColor: "#334155",
        participantBorder: "#0ea5e9",
        participantBkg: "#e0f2fe",
        actor0Border: "#0ea5e9",
        actor0Bkg: "#e0f2fe",
        actor0TextColor: "#0f172a",
        actor1Border: "#0ea5e9",
        actor1Bkg: "#e0f2fe",
        actor1TextColor: "#0f172a",
        actor2Border: "#0ea5e9",
        actor2Bkg: "#e0f2fe",
        actor2TextColor: "#0f172a",
      },
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
          const { svg } = await mermaid.render(id, graphDefinition);
          const wrapper = document.createElement("div");
          wrapper.className = "mermaid-diagram";
          wrapper.innerHTML = svg;
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
