import { sanitizeMermaidDefinition } from "@/lib/mermaid/sanitize";

describe("sanitizeMermaidDefinition", () => {
  it("strips single-line init directives", () => {
    const raw = `%%{init: {'theme': 'dark'}}%%\nsequenceDiagram\nA->>B: hello`;

    expect(sanitizeMermaidDefinition(raw)).toBe("sequenceDiagram\nA->>B: hello");
  });

  it("strips multi-line directives and preserves regular comments", () => {
    const raw = [
      "%%{",
      "  init: {'theme': 'dark'},",
      "  themeVariables: { 'textColor': '#000000' }",
      "}%%",
      "%% this comment should remain",
      "sequenceDiagram",
      "A->>B: hello",
    ].join("\n");

    expect(sanitizeMermaidDefinition(raw)).toBe(
      "%% this comment should remain\nsequenceDiagram\nA->>B: hello",
    );
  });
});
