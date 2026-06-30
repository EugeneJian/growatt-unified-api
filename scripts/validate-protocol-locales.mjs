import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const protocolRoot = path.join(repoRoot, "ProtocolMapping");
const localeRoot = path.join(protocolRoot, "data", "locales");
const ssotPath = path.join(protocolRoot, "data", "protocol_ssot.json");
const outputRoot = path.join(repoRoot, "out", "growatt-openapi", "protocol-mapping");
const supportedLocales = ["zh-CN", "en-US"];
const checkOutput = process.argv.includes("--check-output");

const requiredUiKeys = [
  "locale.name",
  "locale.switch_label",
  "locale.zh-CN",
  "locale.en-US",
  "common.loading",
  "common.back_to_map",
  "common.label_separator",
  "common.error_static_server",
  "source.document",
  "source.effective_date",
  "source.loading",
  "source.load_failed",
  "map.page_title",
  "map.hero_title",
  "map.hero_subtitle",
  "map.svg_title",
  "map.svg_subtitle",
  "map.svg_address_range",
  "map.svg_holding_lane",
  "map.svg_input_lane",
  "map.svg_overlap_notice",
  "map.svg_same_address_different_fc",
  "map.svg_sunspec_overlap",
  "map.svg_reading_logic_title",
  "map.svg_reading_logic_line_1",
  "map.svg_reading_logic_line_2",
  "map.module.part_a",
  "map.module.part_b",
  "map.legend.fc03_title",
  "map.legend.fc03_body",
  "map.legend.fc04_title",
  "map.legend.fc04_body",
  "map.legend.overlap_title",
  "map.legend.overlap_body",
  "map.legend.ssot_title",
  "map.legend.ssot_body",
  "map.note_title",
  "map.note_body",
  "map.dtc_title",
  "map.dtc_subtitle",
  "map.dtc_model_record_count",
  "map.dtc_panel_meta",
  "map.dtc_loading",
  "map.dtc_data_loading",
  "map.dtc_empty",
  "map.dtc_load_failed",
  "map.dtc_data_load_failed",
  "detail.page_title",
  "detail.loading",
  "detail.address_ranges",
  "detail.register_count",
  "detail.profile",
  "detail.models_title",
  "detail.register_table_title",
  "detail.missing_profile",
  "detail.load_error",
  "detail.placeholder_field_name",
  "detail.placeholder_data_type",
  "detail.placeholder_applicable",
  "detail.placeholder_notes",
  "detail.no_applicable_dtc",
  "applicability.vpp.lead",
  "applicability.vpp.summary",
  "applicability.vpp.notice",
  "applicability.vpp.rule_1",
  "applicability.vpp.rule_2",
  "applicability.vpp.rule_3",
  "applicability.vpp.field_note",
  "dtc.group.meta",
  "dtc.unmapped",
  "dtc.card_aria",
  "dtc.helper.product_category",
  "dtc.helper.alias",
  "dtc.helper.full_name",
  "dtc.helper.region",
  "dtc.helper.dtc_range",
  "dtc.helper.holding_register",
  "dtc.helper.input_register",
  "dtc.helper.firmware_examples",
  "dtc.helper.type",
  "dtc.helper.model",
  "dtc.helper.source",
  "dtc.status.active",
  "dtc.status.undeveloped",
  "dtc.status.unused",
  "dtc.status.deprecated",
  "dtc_type.Unmapped_DTC",
];

function fail(message, details = []) {
  console.error(`Protocol locale validation failed: ${message}`);
  details.slice(0, 60).forEach((detail) => console.error(`- ${detail}`));
  if (details.length > 60) console.error(`- ... ${details.length - 60} more`);
  process.exit(1);
}

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function loadLocales() {
  if (!(await exists(localeRoot))) {
    fail("locale directory is missing", [path.relative(repoRoot, localeRoot)]);
  }

  const files = (await readdir(localeRoot)).filter((file) => file.endsWith(".json"));
  const localeCodes = files.map((file) => path.basename(file, ".json"));
  const unsupported = localeCodes.filter((code) => !supportedLocales.includes(code));
  if (unsupported.length) {
    fail("unsupported locale code found", unsupported);
  }

  const missing = supportedLocales.filter((code) => !localeCodes.includes(code));
  if (missing.length) {
    fail("required locale file is missing", missing.map((code) => `${code}.json`));
  }

  const entries = await Promise.all(supportedLocales.map(async (code) => [
    code,
    await readJson(path.join(localeRoot, `${code}.json`)),
  ]));
  return Object.fromEntries(entries);
}

function addRequiredFromSsot(requiredKeys, ssot) {
  (ssot.register_detail_schema || []).forEach((key) => requiredKeys.add(`table.${key}`));

  (ssot.register_profiles || []).forEach((profile) => {
    if (!profile.module_key) {
      fail("register profile is missing module_key", [profile.id || profile.module_cn || "unknown profile"]);
    }
    requiredKeys.add(profile.module_key);
  });

  (ssot.dtc_type_groups || []).forEach((group) => {
    if (!group.name_key) {
      fail("DTC type group is missing name_key", [group.id || group.name || "unknown group"]);
    }
    requiredKeys.add(group.name_key);
    (group.category_keys || []).forEach((key) => requiredKeys.add(key));
  });

  (ssot.device_model_dtcs || []).forEach((record) => {
    if (!record.product_category_key) {
      fail("device_model_dtcs record is missing product_category_key", [record.id || String(record.dtc)]);
    }
    requiredKeys.add(record.product_category_key);
    if (record.lifecycle_status) requiredKeys.add(`dtc.status.${record.lifecycle_status}`);
  });

  (ssot.dtc_codes || []).forEach((code) => {
    (code.product_category_keys || []).forEach((key) => requiredKeys.add(key));
    (code.lifecycle_statuses || []).forEach((status) => requiredKeys.add(`dtc.status.${status}`));
    if (code.lifecycle_status) requiredKeys.add(`dtc.status.${code.lifecycle_status}`);
  });
}

function validateLocaleKeys(locales, requiredKeys) {
  const missing = [];
  for (const locale of supportedLocales) {
    const dictionary = locales[locale] || {};
    for (const key of requiredKeys) {
      if (typeof dictionary[key] !== "string" || dictionary[key].trim() === "") {
        missing.push(`${locale}: ${key}`);
      }
    }
  }
  if (missing.length) fail("locale dictionary is missing required keys", missing);
}

async function walkFiles(root) {
  const items = await readdir(root, { withFileTypes: true });
  const files = [];
  for (const item of items) {
    const itemPath = path.join(root, item.name);
    if (item.isDirectory()) {
      files.push(...await walkFiles(itemPath));
    } else {
      files.push(itemPath);
    }
  }
  return files;
}

async function validateOutputDoesNotPublishRawJson() {
  if (!(await exists(outputRoot))) {
    fail("export output is missing; run protocol:export before --check-output", [
      path.relative(repoRoot, outputRoot),
    ]);
  }
  const files = await walkFiles(outputRoot);
  const offenders = files
    .map((file) => path.relative(outputRoot, file))
    .filter((file) => file.endsWith(".json") || file.split(path.sep).includes("data"));
  if (offenders.length) {
    fail("export output contains raw SSOT or locale JSON", offenders);
  }
}

const locales = await loadLocales();
const ssot = await readJson(ssotPath);
const requiredKeys = new Set(requiredUiKeys);
addRequiredFromSsot(requiredKeys, ssot);
validateLocaleKeys(locales, requiredKeys);

if (checkOutput) {
  await validateOutputDoesNotPublishRawJson();
}

console.log(
  `Validated ${supportedLocales.join(", ")} protocol locale dictionaries with ${requiredKeys.size} required keys.`,
);
