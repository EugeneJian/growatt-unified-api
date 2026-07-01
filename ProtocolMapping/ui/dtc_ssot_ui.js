(function initDtcSsotUi(global) {
  const FALLBACK_DTC_TYPE_GROUPS = [
    {
      id: "Hybrid_Inverter",
      name: "Hybrid_Inverter",
      name_key: "dtc_type.Hybrid_Inverter",
      categories: ["户用预备储能逆变器", "户用并离网储能一体机"],
      category_keys: [
        "product_category.residential_battery_ready_inverter",
        "product_category.residential_hybrid_storage_inverter",
      ],
    },
    {
      id: "PV_Inverter",
      name: "PV_Inverter",
      name_key: "dtc_type.PV_Inverter",
      categories: ["户用光伏逆变器", "工商业光伏逆变器"],
      category_keys: [
        "product_category.residential_pv_inverter",
        "product_category.commercial_industrial_pv_inverter",
      ],
    },
    {
      id: "PCS",
      name: "PCS",
      name_key: "dtc_type.PCS",
      categories: ["商用储能逆变器"],
      category_keys: ["product_category.commercial_storage_inverter"],
    },
    {
      id: "Off_Grid_Inverter",
      name: "Off_Grid_Inverter",
      name_key: "dtc_type.Off_Grid_Inverter",
      categories: ["离网储能逆变器"],
      category_keys: ["product_category.off_grid_storage_inverter"],
    },
    {
      id: "Battery",
      name: "Battery",
      name_key: "dtc_type.Battery",
      categories: ["BDC 电池", "高低压电池", "纯电池"],
      category_keys: [
        "product_category.bdc_battery",
        "product_category.hv_lv_battery",
        "product_category.standalone_battery",
      ],
    },
    {
      id: "SYN",
      name: "SYN",
      name_key: "dtc_type.SYN",
      categories: ["SYN"],
      category_keys: ["product_category.syn"],
    },
    {
      id: "Water_Pump",
      name: "Water_Pump",
      name_key: "dtc_type.Water_Pump",
      categories: ["水泵光伏逆变器"],
      category_keys: ["product_category.water_pump"],
    },
  ];

  const STATUS_CN = {
    active: "在产",
    undeveloped: "未开发",
    unused: "未使用",
    deprecated: "已废弃",
  };

  const STYLE_ID = "dtc-ssot-ui-style";

  const CATEGORY_KEY_BY_CN = {
    "户用预备储能逆变器": "product_category.residential_battery_ready_inverter",
    "户用光伏逆变器": "product_category.residential_pv_inverter",
    "商用储能逆变器": "product_category.commercial_storage_inverter",
    "工商业光伏逆变器": "product_category.commercial_industrial_pv_inverter",
    "离网储能逆变器": "product_category.off_grid_storage_inverter",
    "水泵光伏逆变器": "product_category.water_pump",
    "户用并离网储能一体机": "product_category.residential_hybrid_storage_inverter",
    "BDC 电池": "product_category.bdc_battery",
    "高低压电池": "product_category.hv_lv_battery",
    "纯电池": "product_category.standalone_battery",
    "SYN": "product_category.syn",
  };

  let localeApi = {
    t(key, vars, fallback) {
      return fallback ?? key;
    },
  };

  function esc(value) {
    return String(value ?? "").replace(/[&<>"]/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
    }[char]));
  }

  function compactList(values, limit = 4) {
    const list = (values || []).filter(Boolean);
    if (!list.length) return "-";
    const shown = list.slice(0, limit).join(" / ");
    return list.length > limit ? `${shown} / +${list.length - limit}` : shown;
  }

  function setLocaleApi(nextLocaleApi) {
    localeApi = nextLocaleApi || localeApi;
  }

  function translate(key, vars = {}, fallback = key) {
    if (!localeApi?.t) return fallback;
    return localeApi.t(key, vars, fallback);
  }

  function translateStatus(statusKey) {
    return translate(`dtc.status.${statusKey}`, {}, STATUS_CN[statusKey] || statusKey);
  }

  function localizedProductCategories(keys = [], names = []) {
    const values = [];
    const maxLength = Math.max(keys.length, names.length);
    for (let index = 0; index < maxLength; index += 1) {
      const fallback = names[index] || keys[index] || "";
      const key = keys[index] || CATEGORY_KEY_BY_CN[fallback];
      values.push(key ? translate(key, {}, fallback) : fallback);
    }
    return values.filter(Boolean);
  }

  function localizedGroupName(group) {
    return translate(group.name_key || `dtc_type.${group.id}`, {}, group.name || group.id);
  }

  function localizedGroupCategories(group) {
    return localizedProductCategories(group.category_keys || [], group.categories || []);
  }

  function buildFallbackDtcCodes(ssot) {
    const grouped = new Map();
    (ssot.device_model_dtcs || []).forEach((model) => {
      const key = String(model.dtc);
      if (!grouped.has(key)) {
        grouped.set(key, {
          id: `dtc_${key}`,
          dtc: model.dtc,
          code: key,
          product_categories_cn: [],
          product_category_keys: [],
          aliases: [],
          model_full_names: [],
          regions: [],
          lifecycle_statuses: [],
          dtc_range_raw_values: [],
          holding_register_upload_fields_raw_values: [],
          input_register_upload_fields_raw_values: [],
          firmware_examples: [],
          model_record_count: 0,
          models: [],
        });
      }

      const code = grouped.get(key);
      [
        ["product_categories_cn", model.product_category_cn],
        ["product_category_keys", model.product_category_key],
        ["aliases", model.alias],
        ["model_full_names", model.model_full_name],
        ["regions", model.region],
        ["lifecycle_statuses", model.lifecycle_status],
        ["dtc_range_raw_values", model.dtc_range_raw],
        ["holding_register_upload_fields_raw_values", model.holding_register_upload_fields_raw],
        ["input_register_upload_fields_raw_values", model.input_register_upload_fields_raw],
      ].forEach(([field, value]) => {
        if (value && !code[field].includes(value)) code[field].push(value);
      });
      (model.firmware_examples || []).forEach((value) => {
        if (value && !code.firmware_examples.includes(value)) code.firmware_examples.push(value);
      });
      code.model_record_count += 1;
      code.models.push(model);
    });

    return [...grouped.values()].map((code) => ({
      ...code,
      lifecycle_status: code.lifecycle_statuses.includes("active")
        ? "active"
        : (code.lifecycle_statuses[0] || "active"),
    }));
  }

  function dtcCodes(ssot) {
    return ssot.dtc_codes?.length ? ssot.dtc_codes : buildFallbackDtcCodes(ssot);
  }

  function dtcCodeMap(ssot) {
    return new Map(dtcCodes(ssot).map((code) => [String(code.dtc), code]));
  }

  function dtcTypeGroups(ssot) {
    return ssot.dtc_type_groups?.length ? ssot.dtc_type_groups : FALLBACK_DTC_TYPE_GROUPS;
  }

  function primaryAlias(code, fallbackRecord) {
    const aliases = (code?.aliases || []).filter(Boolean);
    if (aliases.length) return aliases.length > 1 ? `${aliases[0]} +${aliases.length - 1}` : aliases[0];
    return fallbackRecord?.alias || fallbackRecord?.model_full_name || "";
  }

  function renderHelper(code, fallbackRecord) {
    const statusKey = code?.lifecycle_status || "active";
    const status = translateStatus(statusKey);
    const fields = code ? [
      [translate("dtc.helper.product_category", {}, "产品分类"), compactList(localizedProductCategories(code.product_category_keys, code.product_categories_cn))],
      [translate("dtc.helper.alias", {}, "代称"), compactList(code.aliases)],
      [translate("dtc.helper.full_name", {}, "全称"), compactList(code.model_full_names, 3)],
      [translate("dtc.helper.region", {}, "区域"), compactList(code.regions)],
      [translate("dtc.helper.dtc_range", {}, "DTC 范围"), compactList(code.dtc_range_raw_values)],
      [translate("dtc.helper.holding_register", {}, "保持寄存器"), compactList(code.holding_register_upload_fields_raw_values, 2)],
      [translate("dtc.helper.input_register", {}, "输入寄存器"), compactList(code.input_register_upload_fields_raw_values, 2)],
      [translate("dtc.helper.firmware_examples", {}, "固件示例"), compactList(code.firmware_examples, 5)],
    ] : [
      [translate("dtc.helper.type", {}, "类型"), fallbackRecord?.type_cn || "-"],
      [translate("dtc.helper.model", {}, "机型"), fallbackRecord?.model_full_name || "-"],
      [translate("dtc.helper.source", {}, "来源"), fallbackRecord?.source || "DTC SSOT"],
    ];

    return `
      <span class="dtc-ssot-helper" role="tooltip">
        <span class="dtc-ssot-helper-title">
          <span>DTC ${esc(code?.code || fallbackRecord?.dtc || "")}</span>
          ${code ? `<span class="dtc-ssot-helper-status ${esc(statusKey)}">${esc(status)}</span>` : ""}
        </span>
        <span class="dtc-ssot-helper-grid">
          ${fields.map(([label, value]) => `
            <span class="dtc-ssot-helper-label">${esc(label)}</span>
            <span class="dtc-ssot-helper-value">${esc(value)}</span>
          `).join("")}
        </span>
      </span>
    `;
  }

  function normalizeCode(value, ssot, options = {}) {
    const codeMap = options.codeMap || dtcCodeMap(ssot);
    if (value && typeof value === "object" && "dtc" in value) {
      return value;
    }
    return codeMap.get(String(value));
  }

  function renderCard(value, options = {}) {
    const ssot = options.ssot || {};
    const code = normalizeCode(value, ssot, options);
    const fallbackRecord = options.fallbackRecord || { dtc: String(value ?? code?.dtc ?? "") };
    const key = String(code?.code || code?.dtc || fallbackRecord.dtc || "");
    const alias = primaryAlias(code, fallbackRecord);
    const tagName = options.tagName || "span";
    const typeAttr = tagName === "button" ? ' type="button"' : "";
    const classes = ["dtc-ssot-card", options.className].filter(Boolean).join(" ");
    const ariaLabel = translate("dtc.card_aria", { code: key, alias }, `DTC ${key} ${alias} 详情`);

    return `
      <${tagName} class="${esc(classes)}"${typeAttr} tabindex="0" aria-label="${esc(ariaLabel)}">
        <span class="dtc-ssot-card-code">${esc(key)}</span>
        ${alias ? `<span class="dtc-ssot-card-alias">${esc(alias)}</span>` : ""}
        ${renderHelper(code, fallbackRecord)}
      </${tagName}>
    `;
  }

  function codesForGroup(codes, group) {
    const categorySet = new Set(group.categories || []);
    return (codes || [])
      .filter((code) => (code.product_categories_cn || []).some((category) => categorySet.has(category)))
      .sort((left, right) => left.dtc - right.dtc || String(left.code).localeCompare(String(right.code)));
  }

  function groupCodesByType(ssot, values, options = {}) {
    const codeMap = options.codeMap || dtcCodeMap(ssot);
    const uniqueValues = [...new Set((values || []).map((value) => String(value)).filter(Boolean))];
    const grouped = dtcTypeGroups(ssot)
      .map((group) => {
        const categories = new Set(group.categories || []);
        const codes = uniqueValues
          .map((value) => codeMap.get(value))
          .filter(Boolean)
          .filter((code) => (code.product_categories_cn || []).some((category) => categories.has(category)))
          .sort((left, right) => left.dtc - right.dtc || String(left.code).localeCompare(String(right.code)));
        return { group, codes };
      })
      .filter((item) => item.codes.length);

    const groupedSet = new Set(grouped.flatMap((item) => item.codes.map((code) => String(code.dtc))));
    const ungroupedCodes = uniqueValues
      .filter((value) => !groupedSet.has(value))
      .map((value) => codeMap.get(value) || { dtc: Number(value), code: value, aliases: [] });

    if (ungroupedCodes.length) {
      grouped.push({
        group: {
          id: "Unmapped_DTC",
          name: "Unmapped_DTC",
          name_key: "dtc_type.Unmapped_DTC",
          categories: ["未匹配到 DTC 分类"],
          category_keys: ["dtc.unmapped"],
        },
        codes: ungroupedCodes,
      });
    }

    return grouped;
  }

  function renderGroup(item, options = {}) {
    const fallbackByDtc = options.fallbackByDtc || new Map();
    const ssot = options.ssot || {};
    const categories = localizedGroupCategories(item.group).join(" / ");
    const meta = translate("dtc.group.meta", {
      count: item.codes.length,
      categories,
    }, `${item.codes.length} 个 DTC · ${categories}`);

    return `
      <div class="dtc-ssot-group">
        <div class="dtc-ssot-group-head">
          <div class="dtc-ssot-group-name">${esc(localizedGroupName(item.group))}</div>
          <div class="dtc-ssot-group-meta">${esc(meta)}</div>
        </div>
        <div class="dtc-ssot-card-grid">
          ${item.codes.map((code) => renderCard(code, {
            ssot,
            fallbackRecord: fallbackByDtc.get(String(code.dtc)),
          })).join("")}
        </div>
      </div>
    `;
  }

  function renderGroupedCodes(ssot, values, options = {}) {
    const groups = groupCodesByType(ssot, values, options);
    if (!groups.length) return options.emptyHtml || "";
    return `<div class="dtc-ssot-groups">${groups.map((group) => renderGroup(group, { ...options, ssot })).join("")}</div>`;
  }

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .dtc-ssot-groups{display:grid;gap:12px;overflow:visible}
      .dtc-ssot-group{border:1px solid var(--dtc-line,#dbe3ed);border-radius:8px;background:#fff;overflow:visible}
      .dtc-ssot-group-head{display:flex;flex-wrap:wrap;justify-content:space-between;gap:6px 12px;align-items:center;padding:10px 12px;background:#f7f9fc;border-bottom:1px solid var(--dtc-line,#dbe3ed)}
      .dtc-ssot-group-name{font-weight:800;color:#344057}
      .dtc-ssot-group-meta{font-size:12px;color:var(--dtc-muted,#657086)}
      .dtc-ssot-card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;padding:12px;overflow:visible}
      .dtc-ssot-card{position:relative;display:block;min-height:54px;width:100%;border:1px solid #d8e2f0;border-radius:8px;background:#fff;padding:8px 10px;color:var(--dtc-ink,#172033);text-align:left;cursor:default;font:inherit}
      .dtc-ssot-card:hover,.dtc-ssot-card:focus{outline:0;border-color:var(--dtc-blue,#2563eb);box-shadow:0 6px 16px rgba(37,99,235,.14)}
      .dtc-ssot-card-code{display:block;font-family:Menlo,Consolas,monospace;font-size:14px;font-weight:800;color:#244c96}
      .dtc-ssot-card-alias{display:block;margin-top:3px;color:#526071;font-size:12px;font-weight:700;line-height:1.25;word-break:break-word}
      .dtc-ssot-helper{position:absolute;z-index:30;left:50%;top:calc(100% + 8px);width:340px;max-width:min(340px,calc(100vw - 42px));transform:translate(-50%,-4px);opacity:0;visibility:hidden;pointer-events:none;text-align:left;border:1px solid var(--dtc-line,#dbe3ed);border-radius:8px;background:#fff;box-shadow:0 14px 32px rgba(20,35,60,.18);padding:12px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",Arial,sans-serif;font-weight:400;color:var(--dtc-ink,#172033)}
      .dtc-ssot-card:hover .dtc-ssot-helper,.dtc-ssot-card:focus .dtc-ssot-helper{opacity:1;visibility:visible;transform:translate(-50%,0)}
      .dtc-ssot-helper-title{display:flex;justify-content:space-between;gap:10px;align-items:center;font-size:15px;font-weight:800;margin-bottom:8px}
      .dtc-ssot-helper-status{border-radius:5px;padding:2px 6px;font-size:11px;font-weight:800;background:#eef2f7;color:#657086}
      .dtc-ssot-helper-status.undeveloped{background:#fdecec;color:#b3261e}
      .dtc-ssot-helper-status.unused{background:#fff3df;color:#9a5b00}
      .dtc-ssot-helper-grid{display:grid;grid-template-columns:72px 1fr;gap:5px 8px;font-size:12px;line-height:1.45}
      .dtc-ssot-helper-label{color:var(--dtc-muted,#657086)}
      .dtc-ssot-helper-value{color:var(--dtc-ink,#172033);word-break:break-word}
    `;
    document.head.appendChild(style);
  }

  global.DtcSsotUi = {
    esc,
    compactList,
    dtcCodes,
    dtcCodeMap,
    dtcTypeGroups,
    codesForGroup,
    primaryAlias,
    localizedGroupName,
    localizedGroupCategories,
    setLocaleApi,
    renderCard,
    renderGroupedCodes,
    groupCodesByType,
    installStyles,
  };
}(window));
