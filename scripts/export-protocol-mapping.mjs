import { cp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const sourceRoot = path.join(repoRoot, "ProtocolMapping");
const uiRoot = path.join(sourceRoot, "ui");
const ssotRoot = path.join(sourceRoot, "ssot");
const localeRoot = path.join(uiRoot, "locales");
const outputRoot = path.join(repoRoot, "out", "protocol-mapping");
const legacyOutputRoot = path.join(repoRoot, "out", "growatt-openapi", "protocol-mapping");
const outputRoots = [outputRoot, legacyOutputRoot];

const publishFiles = [
  "index.html",
  "documentation.html",
  "register_index.html",
  "protocol_locale_ui.js",
  "dtc_ssot_ui.js",
];

const documentationFiles = [
  "docs/Growatt_VPP_Integration_Architecture_ReportOUT_v1_2.html",
];

const htmlFilesWithEmbeddedSsot = [
  "register_map_visual.html",
  "register_detail.html",
];

const ssotMarker = "const EMBEDDED_PROTOCOL_SSOT = null;";
const localeMarker = "const EMBEDDED_PROTOCOL_LOCALES = null;";

async function assertFileExists(filePath) {
  const fileStat = await stat(filePath);
  if (!fileStat.isFile()) {
    throw new Error(`Expected a file but found something else: ${filePath}`);
  }
}

async function copyPublishFile(relativePath) {
  const sourcePath = path.join(uiRoot, relativePath);

  await assertFileExists(sourcePath);
  for (const root of outputRoots) {
    const outputPath = path.join(root, relativePath);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await cp(sourcePath, outputPath, { force: true });
  }
}

async function copyDocumentationFile(relativePath) {
  const sourcePath = path.join(sourceRoot, relativePath);

  await assertFileExists(sourcePath);
  for (const root of outputRoots) {
    const outputPath = path.join(root, relativePath);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await cp(sourcePath, outputPath, { force: true });
  }
}

function toScriptJson(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

async function writeHtmlWithEmbeddedData(relativePath, ssot, locales) {
  const sourcePath = path.join(uiRoot, relativePath);
  const html = await readFile(sourcePath, "utf8");

  if (!html.includes(ssotMarker)) {
    throw new Error(`Missing SSOT embed marker in ${relativePath}`);
  }
  if (!html.includes(localeMarker)) {
    throw new Error(`Missing locale embed marker in ${relativePath}`);
  }

  const embeddedHtml = html
    .replace(ssotMarker, `const EMBEDDED_PROTOCOL_SSOT = ${toScriptJson(ssot)};`)
    .replace(localeMarker, `const EMBEDDED_PROTOCOL_LOCALES = ${toScriptJson(locales)};`);

  for (const root of outputRoots) {
    const outputPath = path.join(root, relativePath);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, embeddedHtml);
  }
}

for (const root of outputRoots) {
  await rm(root, { recursive: true, force: true });
  await mkdir(root, { recursive: true });
}

const ssot = JSON.parse(
  await readFile(path.join(ssotRoot, "protocol_ssot.json"), "utf8"),
);
const locales = {
  "zh-CN": JSON.parse(
    await readFile(path.join(localeRoot, "zh-CN.json"), "utf8"),
  ),
  "en-US": JSON.parse(
    await readFile(path.join(localeRoot, "en-US.json"), "utf8"),
  ),
};

for (const relativePath of publishFiles) {
  await copyPublishFile(relativePath);
}

for (const relativePath of documentationFiles) {
  await copyDocumentationFile(relativePath);
}

for (const relativePath of htmlFilesWithEmbeddedSsot) {
  await writeHtmlWithEmbeddedData(relativePath, ssot, locales);
}

console.log(
  `Exported ${publishFiles.length + documentationFiles.length + htmlFilesWithEmbeddedSsot.length} ProtocolMapping files to ${outputRoots.map((root) => path.relative(repoRoot, root)).join(" and ")}`,
);
