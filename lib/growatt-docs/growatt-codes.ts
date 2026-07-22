import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { load as loadYaml } from "js-yaml";

const GROWATT_CODES_SOURCE_FILE = "growatt_fault_code_enterprise_ssot.yaml";
const GROWATT_CODES_SOURCE_PATH = path.join(
  process.cwd(),
  "Growatt API",
  "SSOT",
  GROWATT_CODES_SOURCE_FILE,
);

const SEVERITY_ORDER = ["error", "protect", "warning"] as const;

export const GROWATT_CODES_SLUG = "growatt-codes";

type GrowattFaultSeverity = (typeof SEVERITY_ORDER)[number];

interface GrowattFaultCodeSource {
  workbook: string;
  sheet: string;
  row: number;
}

interface GrowattFaultCodeRecord {
  id: string;
  severity: GrowattFaultSeverity;
  severity_rank: number;
  family: string;
  code: number;
  code_range_end: number | null;
  code_text: string;
  category: string;
  category_key: string;
  sub_code: string | null;
  lcd_display: string | null;
  inverter_state: string | null;
  fault_description: string;
  troubleshooting_steps: string[];
  external_visibility: string;
  source: GrowattFaultCodeSource;
  reserved: boolean;
  auto_recover_default: boolean;
  affects_dispatch_default: boolean;
  recommended_vpp_action: string[];
}

interface GrowattFaultCodeSummary {
  total_records: number;
  by_severity: Partial<Record<GrowattFaultSeverity, number>>;
  by_category: Record<string, number>;
  reserved_records: number;
}

interface GrowattFaultCodeDocument {
  spec_version: string;
  title: string;
  vendor: string;
  source_workbook: string;
  scope: string;
  last_generated_from_source: string;
  summary: GrowattFaultCodeSummary;
  records: GrowattFaultCodeRecord[];
}

export interface GrowattFaultCodeCategoryGroup {
  category: string;
  categoryKey: string;
  anchor: string;
  records: GrowattFaultCodeRecord[];
}

export interface GrowattFaultCodeSeverityGroup {
  severity: GrowattFaultSeverity;
  anchor: string;
  categories: GrowattFaultCodeCategoryGroup[];
}

export interface GrowattCodesPage {
  slug: string;
  title: string;
  sourceFileName: string;
  markdown: string;
  html: string;
  summary: GrowattFaultCodeSummary;
  lastGeneratedFromSource: string;
  severityGroups: GrowattFaultCodeSeverityGroup[];
}

function assertFaultCodeDocument(value: unknown): GrowattFaultCodeDocument {
  if (!value || typeof value !== "object") {
    throw new Error("Growatt fault-code SSOT is empty or invalid.");
  }

  const document = value as Partial<GrowattFaultCodeDocument>;
  if (!Array.isArray(document.records) || !document.summary || !document.title) {
    throw new Error("Growatt fault-code SSOT is missing required fields.");
  }

  return document as GrowattFaultCodeDocument;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function toAnchor(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatSeverityLabel(severity: GrowattFaultSeverity): string {
  return severity.charAt(0).toUpperCase() + severity.slice(1);
}

function formatCode(record: GrowattFaultCodeRecord): string {
  if (typeof record.code_range_end === "number") {
    return `${record.code}-${record.code_range_end}`;
  }

  return `${record.code}`;
}

function escapeMarkdownCell(value: string): string {
  return value.replaceAll("|", "\\|").replaceAll("\n", "<br />");
}

function compactMultilineText(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const lines = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0 || (lines.length === 1 && lines[0] === "/")) {
    return null;
  }

  return lines.join("\n");
}

function buildSeverityGroups(records: GrowattFaultCodeRecord[]): GrowattFaultCodeSeverityGroup[] {
  const categoryOrder = new Map<string, number>();

  records.forEach((record) => {
    if (!categoryOrder.has(record.category)) {
      categoryOrder.set(record.category, categoryOrder.size);
    }
  });

  return SEVERITY_ORDER.map((severity) => {
    const severityRecords = records
      .filter((record) => record.severity === severity)
      .sort((left, right) => {
        const leftCategoryOrder = categoryOrder.get(left.category) ?? Number.MAX_SAFE_INTEGER;
        const rightCategoryOrder = categoryOrder.get(right.category) ?? Number.MAX_SAFE_INTEGER;

        if (leftCategoryOrder !== rightCategoryOrder) {
          return leftCategoryOrder - rightCategoryOrder;
        }

        const codeDiff = left.code - right.code;
        if (codeDiff !== 0) {
          return codeDiff;
        }

        return (left.code_range_end ?? left.code) - (right.code_range_end ?? right.code);
      });

    const categories = new Map<string, GrowattFaultCodeCategoryGroup>();
    severityRecords.forEach((record) => {
      const key = record.category;
      const existing = categories.get(key);
      if (existing) {
        existing.records.push(record);
        return;
      }

      categories.set(key, {
        category: record.category,
        categoryKey: record.category_key,
        anchor: `${severity}-${toAnchor(record.category)}`,
        records: [record],
      });
    });

    return {
      severity,
      anchor: severity,
      categories: [...categories.values()],
    };
  }).filter((group) => group.categories.length > 0);
}

function renderSummaryCards(summary: GrowattFaultCodeSummary): string {
  const cards = [
    {
      label: "Total Records",
      value: `${summary.total_records}`,
    },
    {
      label: "Errors",
      value: `${summary.by_severity.error ?? 0}`,
    },
    {
      label: "Protects",
      value: `${summary.by_severity.protect ?? 0}`,
    },
    {
      label: "Warnings",
      value: `${summary.by_severity.warning ?? 0}`,
    },
    {
      label: "Reserved",
      value: `${summary.reserved_records}`,
    },
  ];

  return `
    <section class="growatt-codes-summary-grid">
      ${cards
        .map(
          (card) => `
            <div class="growatt-codes-summary-card">
              <span class="growatt-codes-summary-label">${escapeHtml(card.label)}</span>
              <strong class="growatt-codes-summary-value">${escapeHtml(card.value)}</strong>
            </div>
          `,
        )
        .join("")}
    </section>
  `;
}

function renderDetailsHtml(record: GrowattFaultCodeRecord): string {
  const detailItems: string[] = [];
  const subCode = compactMultilineText(record.sub_code);

  if (subCode) {
    detailItems.push(`
      <div class="growatt-codes-detail-block">
        <h5>Sub-code</h5>
        <pre>${escapeHtml(subCode)}</pre>
      </div>
    `);
  }

  if (record.troubleshooting_steps.length > 0) {
    detailItems.push(`
      <div class="growatt-codes-detail-block">
        <h5>Troubleshooting steps</h5>
        <ol>
          ${record.troubleshooting_steps
            .map((step) => `<li>${escapeHtml(step)}</li>`)
            .join("")}
        </ol>
      </div>
    `);
  }

  detailItems.push(`
    <div class="growatt-codes-detail-block">
      <h5>Operational context</h5>
      <ul>
        <li><strong>Code text:</strong> ${escapeHtml(record.code_text)}</li>
        <li><strong>Inverter state:</strong> ${escapeHtml(record.inverter_state ?? "N/A")}</li>
      </ul>
    </div>
  `);

  return `
    <details class="growatt-codes-record-details">
      <summary>View details</summary>
      <div class="growatt-codes-detail-grid">
        ${detailItems.join("")}
      </div>
    </details>
  `;
}

function renderRecordRowHtml(record: GrowattFaultCodeRecord): string {
  const reservedBadge = record.reserved
    ? '<span class="growatt-codes-badge growatt-codes-badge-reserved">Reserved</span>'
    : "";

  return `
    <tbody>
      <tr id="${escapeHtml(record.id)}">
        <td>
          <div class="growatt-codes-code-cell">
            <strong>${escapeHtml(formatCode(record))}</strong>
            <code>${escapeHtml(record.code_text)}</code>
            ${reservedBadge}
          </div>
        </td>
        <td>${escapeHtml(record.fault_description)}</td>
      </tr>
      <tr class="growatt-codes-detail-row">
        <td colspan="2">
          ${renderDetailsHtml(record)}
        </td>
      </tr>
    </tbody>
  `;
}

function renderTableHtml(records: GrowattFaultCodeRecord[]): string {
  return `
    <div class="growatt-codes-table-wrap">
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Description</th>
          </tr>
        </thead>
        ${records.map((record) => renderRecordRowHtml(record)).join("")}
      </table>
    </div>
  `;
}

function renderGrowattCodesHtml(document: GrowattFaultCodeDocument): {
  html: string;
  severityGroups: GrowattFaultCodeSeverityGroup[];
} {
  const severityGroups = buildSeverityGroups(document.records);

  const summarySection = `
    <section class="growatt-codes-summary">
      <p class="growatt-codes-intro">
        Customer reference for Growatt fault, protection, and warning codes.
        Use the troubleshooting guidance for initial diagnosis and contact Growatt support when an issue persists.
      </p>
      ${renderSummaryCards(document.summary)}
    </section>
  `;

  const tocSection = `
    <section class="growatt-codes-toc">
      <h2 id="contents">Contents</h2>
      <ul>
        ${severityGroups
          .map(
            (group) => `
              <li>
                <a href="#${escapeHtml(group.anchor)}">${escapeHtml(formatSeverityLabel(group.severity))}</a>
                <span class="growatt-codes-toc-count">${group.categories.reduce((count, category) => count + category.records.length, 0)} records</span>
                <ul>
                  ${group.categories
                    .map(
                      (category) => `
                        <li><a href="#${escapeHtml(category.anchor)}">${escapeHtml(category.category)}</a></li>
                      `,
                    )
                    .join("")}
                </ul>
              </li>
            `,
          )
          .join("")}
      </ul>
    </section>
  `;

  const severitySections = severityGroups
    .map(
      (group) => `
        <section class="growatt-codes-severity">
          <h2 id="${escapeHtml(group.anchor)}">${escapeHtml(formatSeverityLabel(group.severity))}</h2>
          ${group.categories
            .map(
              (category) => `
                <section class="growatt-codes-category">
                  <h3 id="${escapeHtml(category.anchor)}">${escapeHtml(category.category)}</h3>
                  ${renderTableHtml(category.records)}
                </section>
              `,
            )
            .join("")}
        </section>
      `,
    )
    .join("");

  return {
    html: `
      <div class="growatt-codes-page">
        ${summarySection}
        ${tocSection}
        ${severitySections}
      </div>
    `,
    severityGroups,
  };
}

function buildMarkdownTable(records: GrowattFaultCodeRecord[]): string {
  const header = [
    "| Code | Description |",
    "| :--- | :--- |",
  ];

  const rows = records.flatMap((record) => {
    const codeLabel = `${formatCode(record)}${record.reserved ? " (Reserved)" : ""}`;
    const detailLines: string[] = [];
    const subCode = compactMultilineText(record.sub_code);

    if (subCode) {
      detailLines.push(`Sub-code: ${subCode.replaceAll("\n", " / ")}`);
    }

    if (record.troubleshooting_steps.length > 0) {
      detailLines.push(`Troubleshooting: ${record.troubleshooting_steps.join(" ")}`);
    }

    if (record.inverter_state) {
      detailLines.push(`Inverter state: ${record.inverter_state}`);
    }

    return [
      `| ${escapeMarkdownCell(codeLabel)} | ${escapeMarkdownCell(record.fault_description)} |`,
      ...detailLines.map((line) => `> ${line}`),
    ];
  });

  return [...header, ...rows].join("\n");
}

function renderGrowattCodesMarkdown(document: GrowattFaultCodeDocument, severityGroups: GrowattFaultCodeSeverityGroup[]): string {
  const tocLines = severityGroups.flatMap((group) => [
    `- [${formatSeverityLabel(group.severity)}](#${group.anchor})`,
    ...group.categories.map(
      (category) =>
        `  - [${formatSeverityLabel(group.severity)} - ${category.category}](#${category.anchor})`,
    ),
  ]);

  const categorySections = severityGroups.flatMap((group) => [
    `## ${formatSeverityLabel(group.severity)}`,
    "",
    ...group.categories.flatMap((category) => [
      `### ${formatSeverityLabel(group.severity)} - ${category.category}`,
      "",
      buildMarkdownTable(category.records),
      "",
    ]),
  ]);

  return [
    "# Growatt Codes",
    "",
    "Customer reference for Growatt fault, protection, and warning codes. Use the troubleshooting guidance for initial diagnosis and contact Growatt support when an issue persists.",
    "",
    `- Total records: ${document.summary.total_records}`,
    `- Errors: ${document.summary.by_severity.error ?? 0}`,
    `- Protects: ${document.summary.by_severity.protect ?? 0}`,
    `- Warnings: ${document.summary.by_severity.warning ?? 0}`,
    `- Reserved records: ${document.summary.reserved_records}`,
    "",
    "## Contents",
    "",
    ...tocLines,
    "",
    ...categorySections,
  ].join("\n");
}

export const getGrowattCodesPage = cache(
  async (locale: "en" | "zh-CN" = "en"): Promise<GrowattCodesPage> => {
    void locale;
    const rawYaml = await fs.readFile(GROWATT_CODES_SOURCE_PATH, "utf8");
    const document = assertFaultCodeDocument(loadYaml(rawYaml));
    const { html, severityGroups } = renderGrowattCodesHtml(document);
    const markdown = renderGrowattCodesMarkdown(document, severityGroups);

    return {
      slug: GROWATT_CODES_SLUG,
      title: "Growatt Codes",
      sourceFileName: GROWATT_CODES_SOURCE_FILE,
      markdown,
      html,
      summary: document.summary,
      lastGeneratedFromSource: document.last_generated_from_source,
      severityGroups,
    };
  },
);
