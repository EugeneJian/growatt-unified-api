export function sanitizeMermaidDefinition(raw: string): string {
  const normalized = raw.replace(/\r\n?/g, "\n").replace(/\u00A0/g, " ");
  const lines = normalized.split("\n");

  const cleanedLines: string[] = [];
  let strippingDirective = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!strippingDirective && /^%%\{\s*/.test(trimmed)) {
      if (!/\}\s*%%$/.test(trimmed)) {
        strippingDirective = true;
      }
      continue;
    }

    if (strippingDirective) {
      if (/\}\s*%%$/.test(trimmed)) {
        strippingDirective = false;
      }
      continue;
    }

    cleanedLines.push(line);
  }

  return cleanedLines.join("\n").trim();
}
