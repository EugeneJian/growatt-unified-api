#!/usr/bin/env python3
"""Extract ProtocolMapping Markdown tables into a JSON SSOT.

The source Markdown is intentionally kept as the human-reviewable import layer.
This script converts its register ranges and DTC tables into a stable JSON
shape used by the navigation UI.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


DEFAULT_SOURCE = Path("ProtocolMapping/机型DTC及固件命名规范V06_结构化Markdown.md")
DEFAULT_OUTPUT = Path("ProtocolMapping/data/protocol_ssot.json")

REGISTER_DETAIL_COLUMNS = [
    "address",
    "field_name",
    "data_type",
    "unit",
    "scale",
    "access",
    "applicable_dtc_or_model",
    "protocol_version",
    "notes",
]

CATEGORY_EN = {
    "户用预备储能逆变器": "residential_battery_ready_inverter",
    "户用光伏逆变器": "residential_pv_inverter",
    "商用储能逆变器": "commercial_storage_inverter",
    "工商业光伏逆变器": "commercial_industrial_pv_inverter",
    "离网储能逆变器": "off_grid_storage_inverter",
    "水泵光伏逆变器": "water_pump",
    "户用并离网储能一体机": "residential_hybrid_storage_inverter",
    "BDC 电池": "bdc_battery",
    "高低压电池": "hv_lv_battery",
    "纯电池": "standalone_battery",
    "SYN": "syn",
}

DTC_TYPE_GROUPS = [
    {
        "id": "Hybrid_Inverter",
        "name": "Hybrid_Inverter",
        "name_key": "dtc_type.Hybrid_Inverter",
        "categories": ["户用预备储能逆变器", "户用并离网储能一体机"],
        "category_keys": [
            "product_category.residential_battery_ready_inverter",
            "product_category.residential_hybrid_storage_inverter",
        ],
    },
    {
        "id": "PV_Inverter",
        "name": "PV_Inverter",
        "name_key": "dtc_type.PV_Inverter",
        "categories": ["户用光伏逆变器", "工商业光伏逆变器"],
        "category_keys": [
            "product_category.residential_pv_inverter",
            "product_category.commercial_industrial_pv_inverter",
        ],
    },
    {
        "id": "PCS",
        "name": "PCS",
        "name_key": "dtc_type.PCS",
        "categories": ["商用储能逆变器"],
        "category_keys": ["product_category.commercial_storage_inverter"],
    },
    {
        "id": "Off_Grid_Inverter",
        "name": "Off_Grid_Inverter",
        "name_key": "dtc_type.Off_Grid_Inverter",
        "categories": ["离网储能逆变器"],
        "category_keys": ["product_category.off_grid_storage_inverter"],
    },
    {
        "id": "Battery",
        "name": "Battery",
        "name_key": "dtc_type.Battery",
        "categories": ["BDC 电池", "高低压电池", "纯电池"],
        "category_keys": [
            "product_category.bdc_battery",
            "product_category.hv_lv_battery",
            "product_category.standalone_battery",
        ],
    },
    {
        "id": "SYN",
        "name": "SYN",
        "name_key": "dtc_type.SYN",
        "categories": ["SYN"],
        "category_keys": ["product_category.syn"],
    },
    {
        "id": "Water_Pump",
        "name": "Water_Pump",
        "name_key": "dtc_type.Water_Pump",
        "categories": ["水泵光伏逆变器"],
        "category_keys": ["product_category.water_pump"],
    },
]

CATEGORY_CN = {
    "扬水": "水泵光伏逆变器",
}

MODULE_SLUGS = {
    "电池 PM 数据": "battery_pm_data",
    "电池 BM 数据": "battery_bm_data",
    "一键升级功能": "one_click_upgrade",
    "逆变器并网并机功能": "inverter_parallel_grid",
    "福达采集器配网、证书、WiFi 参数": "collector_wifi_certificate",
    "VPP 协议参数": "vpp_protocol_params",
    "一键安装诊断功能": "one_click_install_diagnosis",
    "事件日志功能": "event_log",
    "SunSpec 协议参数": "sunspec_protocol_params",
}


@dataclass
class MarkdownTable:
    headers: list[str]
    rows: list[dict[str, str]]
    source_line: int
    headings: dict[int, str]


def clean_cell(value: str | None) -> str:
    if value is None:
        return ""
    return re.sub(r"\s+", " ", value.replace("<br>", "; ")).strip()


def normalize_category_cn(value: str) -> str:
    return CATEGORY_CN.get(clean_cell(value), clean_cell(value))


def slugify(value: str, fallback: str) -> str:
    value = value.lower()
    value = value.replace("x-h", "xh")
    parts = re.findall(r"[a-z0-9]+", value)
    return "_".join(parts) if parts else fallback


def product_category_key(category: str) -> str:
    return f"product_category.{CATEGORY_EN.get(category, slugify(category, 'unknown'))}"


def module_display_key(module: str) -> str:
    return f"module.{MODULE_SLUGS.get(module, slugify(module, 'unknown'))}"


def split_markdown_row(line: str) -> list[str]:
    text = line.strip()
    if text.startswith("|"):
        text = text[1:]
    if text.endswith("|"):
        text = text[:-1]
    return [clean_cell(cell) for cell in text.split("|")]


def is_separator_row(cells: list[str]) -> bool:
    return bool(cells) and all(re.fullmatch(r":?-{3,}:?", cell.strip()) for cell in cells)


def is_table_start(lines: list[str], index: int) -> bool:
    if index + 1 >= len(lines):
        return False
    if not lines[index].lstrip().startswith("|"):
        return False
    next_cells = split_markdown_row(lines[index + 1])
    return is_separator_row(next_cells)


def parse_tables(markdown: str) -> list[MarkdownTable]:
    lines = markdown.splitlines()
    tables: list[MarkdownTable] = []
    headings: dict[int, str] = {}
    i = 0
    while i < len(lines):
        heading_match = re.match(r"^(#{1,6})\s+(.*)$", lines[i])
        if heading_match:
            level = len(heading_match.group(1))
            headings = {k: v for k, v in headings.items() if k < level}
            headings[level] = clean_cell(heading_match.group(2))
            i += 1
            continue

        if not is_table_start(lines, i):
            i += 1
            continue

        source_line = i + 1
        headers = split_markdown_row(lines[i])
        i += 2
        body: list[list[str]] = []
        while i < len(lines) and lines[i].lstrip().startswith("|"):
            cells = split_markdown_row(lines[i])
            if len(cells) < len(headers):
                cells += [""] * (len(headers) - len(cells))
            body.append(cells[: len(headers)])
            i += 1
        rows = [dict(zip(headers, row)) for row in body]
        tables.append(MarkdownTable(headers=headers, rows=rows, source_line=source_line, headings=dict(headings)))
    return tables


def table_title(table: MarkdownTable) -> str:
    return " > ".join(table.headings[level] for level in sorted(table.headings))


def parse_ranges(raw: str) -> list[dict[str, Any]]:
    ranges: list[dict[str, Any]] = []
    if not raw:
        return ranges
    normalized = raw.replace("，", ",").replace("；", ";")
    for match in re.finditer(r"(\d+)\s*[~\-－]\s*(\d+)", normalized):
        start = int(match.group(1))
        end = int(match.group(2))
        ranges.append({"start": min(start, end), "end": max(start, end), "raw": match.group(0).replace(" ", "")})
    return ranges


def split_items(raw: str) -> list[str]:
    if not raw or raw in {"/", "-", "—"}:
        return []
    return [item.strip() for item in re.split(r"[;；]", raw) if item.strip()]


def split_firmware_examples(raw: str) -> list[str]:
    if not raw or raw in {"/", "-", "—", "暂无", "无", "未开发"}:
        return []
    parts = re.split(r"[;；,，]", raw)
    return [part.strip() for part in parts if part.strip()]


def count_from_raw(raw: str) -> dict[str, Any]:
    parts = [int(x) for x in re.findall(r"\d+", raw)]
    return {"raw": raw, "parts": parts, "total": sum(parts) if parts else None}


def register_type(function_code: str) -> str:
    return "holding_register" if function_code == "0x03" else "input_register"


def semantic_scope(module: str) -> list[str]:
    if module.startswith("电池"):
        return ["battery"]
    if "逆变器" in module:
        return ["inverter"]
    return []


def profile_id(function_code: str, module: str, ranges: list[dict[str, Any]]) -> str:
    module_slug = MODULE_SLUGS.get(module, slugify(module, "profile"))
    range_slug = "_".join(f"{r['start']}_{r['end']}" for r in ranges[:2])
    fc_slug = function_code.lower().replace("0x", "fc")
    return f"{fc_slug}_{module_slug}_{range_slug}"


def infer_device_type(category: str, headings: dict[int, str]) -> str:
    heading_text = " ".join(headings.values())
    if category == "SYN" or "SYN DTC" in heading_text:
        return "syn"
    if "电池" in category or "电池 DTC" in heading_text:
        return "battery"
    return "inverter"


def owner_org(headings: dict[int, str]) -> str | None:
    values = list(headings.values())
    for value in values:
        if "研发中心逆变器" in value:
            return "研发中心逆变器"
        if "尚科逆变器" in value:
            return "尚科逆变器"
    if any("电池 DTC" in value for value in values):
        return "电池"
    if any("SYN DTC" in value for value in values):
        return "SYN"
    return None


def lifecycle_status(*values: str) -> str:
    text = " ".join(values)
    if "未开发" in text:
        return "undeveloped"
    if "未使用" in text:
        return "unused"
    return "active"


def normalize_region(raw: str) -> str | None:
    raw = clean_cell(raw)
    if not raw or raw in {"-", "—", "/"}:
        return None
    return raw


def resolve_same_as(raw: str, previous: str | None) -> tuple[str, bool]:
    if clean_cell(raw) == "同上" and previous:
        return previous, True
    return clean_cell(raw), False


def build_register_profiles(tables: list[MarkdownTable]) -> list[dict[str, Any]]:
    profiles: list[dict[str, Any]] = []
    for table in tables:
        if table.headers != ["序号", "功能模块", "功能码", "寄存器个数", "字段范围"]:
            continue
        for row in table.rows:
            module = row["功能模块"]
            function_code = row["功能码"]
            address_ranges = parse_ranges(row["字段范围"])
            count = count_from_raw(row["寄存器个数"])
            scope = semantic_scope(module)
            profile = {
                "id": profile_id(function_code, module, address_ranges),
                "module_cn": module,
                "module_key": module_display_key(module),
                "function_code": function_code,
                "register_type": register_type(function_code),
                "register_count": count["total"],
                "register_count_raw": count["raw"],
                "register_count_parts": count["parts"],
                "address_ranges": address_ranges,
                "address_ranges_raw": row["字段范围"],
                "semantic_scope": scope,
                "detail_schema": REGISTER_DETAIL_COLUMNS,
                "registers": [],
                "source_ref": {
                    "document_section": table_title(table),
                    "line": table.source_line,
                },
            }
            profiles.append(profile)
    return profiles


def is_dtc_table(table: MarkdownTable) -> bool:
    headers = set(table.headers)
    required = {"DTC 范围", "DTC", "固件命名示例"}
    has_model = bool({"全称", "英文全称"} & headers)
    has_alias = bool({"统称/代称", "代称"} & headers)
    return required <= headers and has_model and has_alias


def get_first(row: dict[str, str], keys: list[str]) -> str:
    for key in keys:
        if key in row:
            return row[key]
    return ""


def build_device_models(tables: list[MarkdownTable]) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    seen_ids: dict[str, int] = {}
    for table in tables:
        if not is_dtc_table(table):
            continue
        previous: dict[str, str] = {}
        for row in table.rows:
            category_raw = get_first(row, ["分类"])
            category = normalize_category_cn(category_raw)
            alias = get_first(row, ["统称/代称", "代称"])
            model = get_first(row, ["全称", "英文全称"])
            region = normalize_region(get_first(row, ["地区/说明", "地区"]))
            holding_raw, holding_inherited = resolve_same_as(
                get_first(row, ["保持寄存器上传字段", "保持寄存器范围"]),
                previous.get("holding_register_upload_fields_raw"),
            )
            input_raw, input_inherited = resolve_same_as(
                get_first(row, ["输入寄存器上传字段", "输入寄存器范围"]),
                previous.get("input_register_upload_fields_raw"),
            )
            firmware_raw, firmware_inherited = resolve_same_as(
                row.get("固件命名示例", ""),
                previous.get("firmware_examples_raw"),
            )

            previous = {
                "holding_register_upload_fields_raw": holding_raw,
                "input_register_upload_fields_raw": input_raw,
                "firmware_examples_raw": firmware_raw,
            }

            dtc_raw = clean_cell(row["DTC"])
            if not re.fullmatch(r"\d+", dtc_raw):
                continue
            dtc = int(dtc_raw)
            device_type = infer_device_type(category, table.headings)
            base_id = f"dtc_{dtc}_{slugify(alias + ' ' + model, str(dtc))}"
            seen_ids[base_id] = seen_ids.get(base_id, 0) + 1
            record_id = base_id if seen_ids[base_id] == 1 else f"{base_id}_{seen_ids[base_id]}"
            status = lifecycle_status(category, alias, model, firmware_raw)
            record = {
                "id": record_id,
                "dtc": dtc,
                "dtc_range_raw": row["DTC 范围"],
                "dtc_range": parse_ranges(row["DTC 范围"])[:1],
                "device_layer_cn": "端",
                "device_type": device_type,
                "product_category_cn": category,
                "product_category_key": product_category_key(category),
                "product_category_raw": category_raw,
                "product_category_en": CATEGORY_EN.get(category, slugify(category, "unknown")),
                "owner_org": owner_org(table.headings),
                "alias": alias,
                "model_full_name": model,
                "region": region,
                "lifecycle_status": status,
                "holding_register_upload_fields_raw": holding_raw,
                "holding_register_upload_fields": split_items(holding_raw),
                "holding_register_upload_field_ranges": parse_ranges(holding_raw),
                "holding_register_upload_fields_inherited": holding_inherited,
                "input_register_upload_fields_raw": input_raw,
                "input_register_upload_fields": split_items(input_raw),
                "input_register_upload_field_ranges": parse_ranges(input_raw),
                "input_register_upload_fields_inherited": input_inherited,
                "firmware_examples_raw": firmware_raw,
                "firmware_examples": split_firmware_examples(firmware_raw),
                "firmware_examples_inherited": firmware_inherited,
                "source_ref": {
                    "document_section": table_title(table),
                    "line": table.source_line,
                },
            }
            if "..." in holding_raw or "…" in holding_raw or "..." in input_raw or "…" in input_raw:
                record["data_quality_flags"] = ["contains_ellipsis_range"]
            records.append(record)
    return records


def append_unique(values: list[Any], value: Any) -> None:
    if value in (None, "", [], {}):
        return
    if value not in values:
        values.append(value)


def extend_unique(values: list[Any], candidates: list[Any]) -> None:
    for candidate in candidates:
        append_unique(values, candidate)


def primary_lifecycle_status(statuses: list[str]) -> str:
    for status in ["active", "unused", "undeveloped", "deprecated"]:
        if status in statuses:
            return status
    return statuses[0] if statuses else "active"


def unique_ranges(records: list[dict[str, Any]], key: str) -> list[dict[str, Any]]:
    ranges: list[dict[str, Any]] = []
    seen: set[tuple[int, int, str]] = set()
    for record in records:
        for item in record.get(key, []):
            range_key = (item["start"], item["end"], item.get("raw", ""))
            if range_key in seen:
                continue
            ranges.append(item)
            seen.add(range_key)
    return ranges


def unique_source_refs(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    refs: list[dict[str, Any]] = []
    seen: set[tuple[str, int | None]] = set()
    for record in records:
        ref = record.get("source_ref") or {}
        key = (ref.get("document_section", ""), ref.get("line"))
        if key in seen:
            continue
        refs.append(ref)
        seen.add(key)
    return refs


def build_dtc_codes(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    grouped: dict[int, list[dict[str, Any]]] = {}
    for record in records:
        grouped.setdefault(record["dtc"], []).append(record)

    codes: list[dict[str, Any]] = []
    for dtc in sorted(grouped):
        dtc_records = grouped[dtc]
        product_categories_cn: list[str] = []
        product_categories_en: list[str] = []
        product_category_keys: list[str] = []
        aliases: list[str] = []
        model_names: list[str] = []
        regions: list[str] = []
        lifecycle_statuses: list[str] = []
        owner_orgs: list[str] = []
        holding_raw_values: list[str] = []
        input_raw_values: list[str] = []
        firmware_examples: list[str] = []
        firmware_raw_values: list[str] = []
        dtc_range_raw_values: list[str] = []
        data_quality_flags: list[str] = []
        models: list[dict[str, Any]] = []

        for record in dtc_records:
            append_unique(product_categories_cn, record.get("product_category_cn"))
            append_unique(product_categories_en, record.get("product_category_en"))
            append_unique(product_category_keys, record.get("product_category_key"))
            append_unique(aliases, record.get("alias"))
            append_unique(model_names, record.get("model_full_name"))
            append_unique(regions, record.get("region"))
            append_unique(lifecycle_statuses, record.get("lifecycle_status"))
            append_unique(owner_orgs, record.get("owner_org"))
            append_unique(holding_raw_values, record.get("holding_register_upload_fields_raw"))
            append_unique(input_raw_values, record.get("input_register_upload_fields_raw"))
            append_unique(firmware_raw_values, record.get("firmware_examples_raw"))
            append_unique(dtc_range_raw_values, record.get("dtc_range_raw"))
            extend_unique(firmware_examples, record.get("firmware_examples", []))
            extend_unique(data_quality_flags, record.get("data_quality_flags", []))
            models.append(
                {
                    "device_model_id": record["id"],
                    "alias": record["alias"],
                    "model_full_name": record["model_full_name"],
                    "product_category_cn": record["product_category_cn"],
                    "product_category_key": record["product_category_key"],
                    "region": record.get("region"),
                    "lifecycle_status": record["lifecycle_status"],
                }
            )

        device_types = sorted({record["device_type"] for record in dtc_records})
        code = {
            "id": f"dtc_{dtc}",
            "dtc": dtc,
            "code": str(dtc),
            "device_type": device_types[0] if len(device_types) == 1 else "mixed",
            "device_types": device_types,
            "product_categories_cn": product_categories_cn,
            "product_categories_en": product_categories_en,
            "product_category_keys": product_category_keys,
            "aliases": aliases,
            "model_full_names": model_names,
            "regions": regions,
            "lifecycle_statuses": lifecycle_statuses,
            "lifecycle_status": primary_lifecycle_status(lifecycle_statuses),
            "owner_orgs": owner_orgs,
            "dtc_range_raw_values": dtc_range_raw_values,
            "dtc_ranges": unique_ranges(dtc_records, "dtc_range"),
            "holding_register_upload_fields_raw_values": holding_raw_values,
            "holding_register_upload_field_ranges": unique_ranges(
                dtc_records,
                "holding_register_upload_field_ranges",
            ),
            "input_register_upload_fields_raw_values": input_raw_values,
            "input_register_upload_field_ranges": unique_ranges(
                dtc_records,
                "input_register_upload_field_ranges",
            ),
            "firmware_examples_raw_values": firmware_raw_values,
            "firmware_examples": firmware_examples,
            "model_record_count": len(dtc_records),
            "models": models,
            "source_refs": unique_source_refs(dtc_records),
        }
        if data_quality_flags:
            code["data_quality_flags"] = data_quality_flags
        codes.append(code)
    return codes


def build_dtc_ranges(tables: list[MarkdownTable]) -> list[dict[str, Any]]:
    ranges: list[dict[str, Any]] = []
    for table in tables:
        if table.headers != ["DTC 范围", "产品/平台", "说明"]:
            continue
        for row in table.rows:
            parsed = parse_ranges(row["DTC 范围"])
            ranges.append(
                {
                    "dtc_range_raw": row["DTC 范围"],
                    "dtc_range": parsed[:1],
                    "product_or_platform": row["产品/平台"],
                    "description": row["说明"].replace("扬水", "水泵光伏逆变器"),
                    "source_ref": {
                        "document_section": table_title(table),
                        "line": table.source_line,
                    },
                }
            )
    return ranges


def ranges_overlap(left: dict[str, Any], right: dict[str, Any]) -> bool:
    return left["start"] <= right["end"] and right["start"] <= left["end"]


def range_intersection(left: dict[str, Any], right: dict[str, Any]) -> dict[str, Any] | None:
    if not ranges_overlap(left, right):
        return None
    return {"start": max(left["start"], right["start"]), "end": min(left["end"], right["end"])}


def any_range_overlap(left: list[dict[str, Any]], right: list[dict[str, Any]]) -> bool:
    return any(ranges_overlap(a, b) for a in left for b in right)


def build_profile_overlaps(profiles: list[dict[str, Any]]) -> list[dict[str, Any]]:
    overlaps: list[dict[str, Any]] = []
    for i, left in enumerate(profiles):
        for right in profiles[i + 1 :]:
            intersections = [
                hit
                for a in left["address_ranges"]
                for b in right["address_ranges"]
                if (hit := range_intersection(a, b))
            ]
            if not intersections:
                continue
            relation = "same_function_code" if left["function_code"] == right["function_code"] else "different_function_code"
            overlaps.append(
                {
                    "id": f"overlap_{left['id']}__{right['id']}",
                    "left_profile_id": left["id"],
                    "right_profile_id": right["id"],
                    "function_code_relation": relation,
                    "intersection_ranges": intersections,
                    "severity": "warning",
                    "message_cn": (
                        "同一功能码地址范围重叠，必须由 register_profile / 协议上下文隔离。"
                        if relation == "same_function_code"
                        else "地址范围重叠但功能码不同，解析时必须同时使用 function_code。"
                    ),
                }
            )
    return overlaps


def build_register_links(profiles: list[dict[str, Any]], records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    links: list[dict[str, Any]] = []
    seen: set[tuple[str, str, str]] = set()
    for profile in profiles:
        function_code = profile["function_code"]
        field_key = (
            "holding_register_upload_field_ranges"
            if function_code == "0x03"
            else "input_register_upload_field_ranges"
        )
        for record in records:
            scope = profile.get("semantic_scope") or []
            if scope and record["device_type"] not in scope:
                continue
            record_ranges = record.get(field_key, [])
            if any_range_overlap(profile["address_ranges"], record_ranges):
                key = (profile["id"], record["id"], "direct")
                if key not in seen:
                    links.append(
                        {
                            "register_profile_id": profile["id"],
                            "device_model_id": record["id"],
                            "dtc": record["dtc"],
                            "confidence": "direct",
                            "reason_cn": "DTC 上传字段与该寄存器段地址重叠",
                        }
                    )
                    seen.add(key)
            elif scope == ["battery"] and record["device_type"] == "battery":
                key = (profile["id"], record["id"], "inferred")
                if key not in seen:
                    links.append(
                        {
                            "register_profile_id": profile["id"],
                            "device_model_id": record["id"],
                            "dtc": record["dtc"],
                            "confidence": "inferred",
                            "reason_cn": "电池公共 PM/BM 寄存器段，按设备类型推断适用",
                        }
                    )
                    seen.add(key)
    return links


def extract_metadata(tables: list[MarkdownTable]) -> dict[str, str]:
    for table in tables:
        if table.headers == ["字段", "内容"]:
            return {row["字段"]: row["内容"] for row in table.rows}
    return {}


def build_ssot(source: Path) -> dict[str, Any]:
    markdown = source.read_text(encoding="utf-8")
    tables = parse_tables(markdown)
    metadata = extract_metadata(tables)
    profiles = build_register_profiles(tables)
    records = build_device_models(tables)
    dtc_codes = build_dtc_codes(records)
    dtc_ranges = build_dtc_ranges(tables)
    profile_overlaps = build_profile_overlaps(profiles)
    register_links = build_register_links(profiles, records)
    checksum = hashlib.sha256(markdown.encode("utf-8")).hexdigest()

    return {
        "$schema": "./protocol_ssot.schema.json",
        "schema_version": "1.0.0",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source": {
            "path": str(source),
            "sha256": checksum,
            "document_metadata": metadata,
            "tables_extracted": len(tables),
        },
        "identity_key": [
            "dtc",
            "function_code",
            "address",
            "register_profile_id",
            "protocol_version",
        ],
        "register_detail_schema": REGISTER_DETAIL_COLUMNS,
        "register_profiles": profiles,
        "dtc_ranges": dtc_ranges,
        "dtc_type_groups": DTC_TYPE_GROUPS,
        "dtc_codes": dtc_codes,
        "device_model_dtcs": records,
        "derived": {
            "register_profile_overlaps": profile_overlaps,
            "register_profile_dtc_links": register_links,
            "stats": {
                "register_profile_count": len(profiles),
                "dtc_range_count": len(dtc_ranges),
                "dtc_type_group_count": len(DTC_TYPE_GROUPS),
                "dtc_code_count": len(dtc_codes),
                "device_model_dtc_count": len(records),
                "overlap_warning_count": len(profile_overlaps),
                "register_profile_dtc_link_count": len(register_links),
            },
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()

    ssot = build_ssot(args.source)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(ssot, ensure_ascii=False, indent=2, sort_keys=False) + "\n",
        encoding="utf-8",
    )
    stats = ssot["derived"]["stats"]
    print(
        "Extracted "
        f"{stats['register_profile_count']} register profiles, "
        f"{stats['device_model_dtc_count']} DTC records, "
        f"{stats['overlap_warning_count']} overlap warnings -> {args.output}"
    )


if __name__ == "__main__":
    main()
