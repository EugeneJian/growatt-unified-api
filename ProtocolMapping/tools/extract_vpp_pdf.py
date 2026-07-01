#!/usr/bin/env python3
"""Convert the Growatt VPP PDF register tables into structured Markdown/JSON.

The PDF is a Word-exported protocol document. This script extracts the 0x03 and
0x04 VPP register tables, normalizes common PDF table splits, and updates the
local ProtocolMapping JSON SSOT so the visual detail page can render real rows.
"""

from __future__ import annotations

import argparse
from copy import deepcopy
import json
import re
import sys
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import pdfplumber


DEFAULT_PDF = Path(
    "ProtocolMapping/sources/protocols/vpp/v2.05/raw/古瑞瓦特逆变器VPP通信协议V2.05_20260529（临时版本）.pdf"
)
DEFAULT_JSON = Path(
    "ProtocolMapping/sources/protocols/vpp/v2.05/extracted/vpp_protocol_v2_05.json"
)
DEFAULT_MARKDOWN = Path(
    "ProtocolMapping/sources/protocols/vpp/v2.05/extracted/古瑞瓦特逆变器VPP通信协议V2.05_20260529_结构化Markdown.md"
)
DEFAULT_SSOT = Path("ProtocolMapping/ssot/protocol_ssot.json")
DEFAULT_TRANSLATION_OVERLAY = Path(
    "ProtocolMapping/sources/protocols/vpp/v2.05/overlays/register_translations/en-US/vpp_v2_05.json"
)

HAN_RE = re.compile(r"[\u3400-\u9fff]")

CANONICAL_UNITS = {
    "VAR": "VAR",
    "KW": "kW",
}

PROTOCOL_VERSION = "V2.05"
PROTOCOL_DATE = "2026-05-29"

REGISTER_TABLES = {
    "0x03": {
        "profile_id": "fc03_vpp_protocol_params_30000_32099",
        "title": "VPP 协议参数 - 0x03 Holding Register",
        "pages": range(7, 17),
        "address_range": "30000~32099",
    },
    "0x04": {
        "profile_id": "fc04_vpp_protocol_params_31000_31999",
        "title": "VPP 协议参数 - 0x04 Input Register",
        "pages": range(18, 22),
        "address_range": "31000~31999",
    },
}

VPP_PROFILE_APPLICABILITY = {
    "authority": "source_documents",
    "plain_conclusion_cn": (
        "0x03 地址 30000 动态返回设备机型 DTC，用于识别设备属于哪一种机型；"
        "返回的 DTC 必须存在于当前支持 DTC SSOT。"
    ),
    "summary_cn": (
        "流程：读 30000 → 在 DTC SSOT 匹配 code → 按匹配到的机型类型解释 VPP 寄存器。"
    ),
    "decision_steps_cn": [],
    "notices_cn": (
        "若单个寄存器备注写明 DTC 限制，以该行备注为准；下方 DTC code 即当前支持清单。"
    ),
    "rules_cn": [
        "DTC SSOT 将 VPP 0x03: 30000~32099 和 VPP 0x04: 31000~31999 列为公用寄存器字段。",
        "VPP V2.05 在地址 30000 定义“设备机型（DTC）”，备注为“见表3-1”。",
        "VPP V2.05 附表 3-1 的 DTC code 必须在当前支持 DTC SSOT 中可匹配。",
    ],
    "field_level_note_cn": (
        "逐寄存器适用性以 registers[].applicable_dtc_or_model 和 notes 为准。"
    ),
    "sources": [
        {
            "document": "机型 DTC 及固件命名规范 V06",
            "section": "3.1 逆变器与储能机公用寄存器字段",
            "evidence": "VPP 协议参数 0x03: 30000~32099；0x04: 31000~31999。",
        },
        {
            "document": "古瑞瓦特逆变器 VPP 通信协议 V2.05",
            "page": 7,
            "section": "2.1 保持寄存器",
            "evidence": "地址 30000 为“设备机型（DTC）”，备注“见表3-1”。",
        },
        {
            "document": "古瑞瓦特逆变器 VPP 通信协议 V2.05",
            "page": 22,
            "section": "附表 3-1 DTC码描述",
            "evidence": "附表列出类型、机型、DTC码。",
        },
        {
            "document": "古瑞瓦特逆变器 VPP 通信协议 V2.05",
            "page": 20,
            "section": "0x04 交流侧信息",
            "evidence": "地址 31132 备注“仅DTC为 21304~21305、21308~21309 的机型使用”。",
        },
    ],
}


def group_vpp_dtc_records(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    grouped: dict[str, list[dict[str, Any]]] = {}
    for record in records:
        grouped.setdefault(record["type_cn"], []).append(record)
    return [
        {
            "type_cn": type_cn,
            "dtc_values": [record["dtc"] for record in items],
            "records": items,
        }
        for type_cn, items in grouped.items()
    ]


def extract_vpp_dtc_table(pdf_path: Path) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    current_type = ""
    last_record: dict[str, Any] | None = None

    with pdfplumber.open(pdf_path) as pdf:
        for page_no in [22, 23]:
            for table in pdf.pages[page_no - 1].extract_tables() or []:
                for raw_row in table:
                    cells = [clean_note(cell) for cell in raw_row]
                    compact = [cell for cell in cells if cell]
                    if not compact:
                        continue
                    if "类型" in compact and "DTC码" in compact:
                        continue

                    if page_no == 22:
                        type_cn = clean_inline(cells[0]) if len(cells) > 0 else ""
                        model = clean_note(cells[3]) if len(cells) > 3 else ""
                        dtc_text = clean_inline(cells[6]) if len(cells) > 6 else ""
                    else:
                        if len(cells) < 3:
                            continue
                        type_cn = clean_inline(cells[0])
                        model = clean_note(cells[1])
                        dtc_text = clean_inline(cells[2])

                    if type_cn:
                        current_type = type_cn
                    if not model:
                        continue

                    if not dtc_text and last_record:
                        last_record["model_full_name"] = clean_note(
                            f"{last_record['model_full_name']}\n{model}"
                        )
                        continue
                    if not dtc_text.isdigit():
                        continue

                    record = {
                        "type_cn": current_type,
                        "model_full_name": model,
                        "dtc": int(dtc_text),
                        "source": {
                            "document": "古瑞瓦特逆变器 VPP 通信协议 V2.05",
                            "section": "附表 3-1 DTC码描述",
                            "page": page_no,
                        },
                    }
                    records.append(record)
                    last_record = record

    return records


@dataclass
class RegisterRow:
    sequence: str
    field_name: str
    access: str
    data_type: str
    unit: str
    scale: str
    address: str
    address_start: int | None
    address_end: int | None
    quantity: int | None
    notes: str
    function_code: str
    register_type: str
    section: str
    protocol_version: str = PROTOCOL_VERSION
    source_pages: list[int] = field(default_factory=list)

    def to_detail_row(self) -> dict[str, Any]:
        dtc_scope = extract_dtc_scope(self.notes)
        detail = {
            "address": self.address,
            "field_name": self.field_name,
            "data_type": self.data_type,
            "unit": self.unit,
            "scale": self.scale,
            "access": self.access,
            "applicable_dtc_or_model": "VPP",
            "protocol_version": self.protocol_version,
            "notes": self.notes,
            "sequence": self.sequence,
            "address_start": self.address_start,
            "address_end": self.address_end,
            "quantity": self.quantity,
            "function_code": self.function_code,
            "register_type": self.register_type,
            "section": self.section,
            "source_pages": self.source_pages,
        }
        if dtc_scope:
            detail["applicable_dtc_or_model"] = dtc_scope["label"]
            detail["applicable_dtc_ranges"] = dtc_scope["ranges"]
            detail["applicability_source"] = "VPP register note"
        return detail


def clean_inline(value: str | None) -> str:
    if value is None:
        return ""
    value = value.replace("\u3000", " ").replace("\xa0", " ")
    value = re.sub(r"\s+", " ", value).strip()
    value = re.sub(r"(?<=[\u4e00-\u9fff]) (?=[\u4e00-\u9fff（(])", "", value)
    value = re.sub(r"(?<=[）)]) (?=[\u4e00-\u9fff])", "", value)
    return value


def clean_note(value: str | None) -> str:
    if value is None:
        return ""
    lines = [clean_inline(line) for line in str(value).splitlines()]
    return "\n".join(line for line in lines if line)


def extract_dtc_scope(notes: str) -> dict[str, Any] | None:
    compact = re.sub(r"\s+", "", notes or "")
    if "DTC" not in compact:
        return None

    ranges: list[dict[str, Any]] = []
    for match in re.findall(r"\d{4,5}(?:[~～-]\d{4,5})?", compact):
        normalized = match.replace("～", "~").replace("-", "~")
        if "~" in normalized:
            start, end = normalized.split("~", 1)
            ranges.append({"start": int(start), "end": int(end), "raw": f"{start}~{end}"})
        else:
            value = int(normalized)
            ranges.append({"start": value, "end": value, "raw": normalized})

    if not ranges:
        return None

    return {
        "label": "DTC " + "、".join(item["raw"] for item in ranges),
        "ranges": ranges,
    }


def compact_row(row: list[str | None]) -> list[str]:
    return [clean_note(cell) for cell in row if clean_note(cell)]


def normalize_address(raw: str) -> tuple[str, int | None, int | None]:
    text = re.sub(r"\s+", "", raw or "")
    text = text.replace("－", "-").replace("—", "-").replace("~", "-")
    match = re.fullmatch(r"(\d{5})(?:-(\d{5}))?", text)
    if not match:
        return clean_inline(raw), None, None
    start = int(match.group(1))
    end = int(match.group(2) or match.group(1))
    return (f"{start}~{end}" if start != end else str(start), start, end)


def quantity_to_int(raw: str) -> int | None:
    text = clean_inline(raw)
    return int(text) if re.fullmatch(r"\d+", text) else None


def derive_end(start: int | None, end: int | None, quantity: int | None) -> int | None:
    if start is None:
        return end
    if end is not None and end != start:
        return end
    if quantity and quantity > 1:
        return start + quantity - 1
    return start


def parse_unit_scale(raw_unit: str) -> tuple[str, str]:
    unit = clean_inline(raw_unit)
    if not unit or unit == "-":
        return unit or "-", "-"
    match = re.match(r"^\*?([0-9]+(?:\.[0-9]+)?)(.+)$", unit)
    if match:
        return normalize_unit(match.group(2)), match.group(1)
    return normalize_unit(unit), "-"


def normalize_unit(raw_unit: str) -> str:
    unit = clean_inline(raw_unit)
    compact = re.sub(r"\s+", "", unit).upper()
    return CANONICAL_UNITS.get(compact, unit)


def is_sequence(value: str) -> bool:
    return bool(re.fullmatch(r"\d+\.?", clean_inline(value)))


def is_header(cells: list[str]) -> bool:
    joined = "|".join(cells)
    return "参数名" in joined or joined in {"号|写", "号"} or "序|参数名" in joined


def extract_range_from_text(text: str) -> tuple[str, int | None, int | None]:
    match = re.search(r"(\d{5})\s*[~\-－]\s*(\d{5})", text)
    if not match:
        return "", None, None
    start = int(match.group(1))
    end = int(match.group(2))
    return f"{start}~{end}", start, end


def append_continuation(rows: list[RegisterRow], cells: list[str], page_no: int) -> None:
    if not rows or not cells:
        return
    last = rows[-1]
    last.source_pages = sorted(set(last.source_pages + [page_no]))

    # Known PDF page-break splits in the V2.05 source table.
    if page_no == 14 and cells[0].startswith("功率"):
        last.field_name = clean_inline(last.field_name + cells[0])
        return
    if page_no == 15 and cells[0].startswith("制值"):
        last.field_name = clean_inline(last.field_name + cells[0])
        if len(cells) > 1:
            last.notes = join_notes(last.notes, cells[1])
        return

    last.notes = join_notes(last.notes, " ".join(cells))


def join_notes(left: str, right: str) -> str:
    right = clean_note(right)
    if not right:
        return left
    if not left or left == "-":
        return right
    return f"{left}\n{right}"


def parse_register_row(
    cells: list[str],
    function_code: str,
    section: str,
    page_no: int,
) -> RegisterRow | None:
    if not cells or not is_sequence(cells[0]):
        return None

    sequence = clean_inline(cells[0]).rstrip(".")
    if len(cells) >= 2 and cells[1].startswith("."):
        cells = [cells[0], cells[1].lstrip(". ").strip(), *cells[2:]]

    if len(cells) >= 7:
        address, start, end = normalize_address(cells[5])
        quantity = quantity_to_int(cells[6])
        if start is None and end is None:
            return None
        end = derive_end(start, end, quantity)
        unit, scale = parse_unit_scale(cells[4])
        return RegisterRow(
            sequence=sequence,
            field_name=clean_inline(cells[1]),
            access=clean_inline(cells[2]),
            data_type=clean_inline(cells[3]),
            unit=unit,
            scale=scale,
            address=address,
            address_start=start,
            address_end=end,
            quantity=quantity,
            notes=clean_note(cells[7]) if len(cells) > 7 else "-",
            function_code=function_code,
            register_type="holding_register" if function_code == "0x03" else "input_register",
            section=section,
            source_pages=[page_no],
        )

    # Reference rows such as "31300~31399内容参考31200~31299".
    if len(cells) == 2:
        address, start, end = extract_range_from_text(cells[1])
        if address:
            return RegisterRow(
                sequence=sequence,
                field_name=clean_inline(cells[1]),
                access="RO" if function_code == "0x04" else "-",
                data_type="参考",
                unit="-",
                scale="-",
                address=address,
                address_start=start,
                address_end=end,
                quantity=(end - start + 1) if start is not None and end is not None else None,
                notes="参考前一簇电池信息定义",
                function_code=function_code,
                register_type="holding_register" if function_code == "0x03" else "input_register",
                section=section,
                source_pages=[page_no],
            )

    return None


def extract_registers(pdf_path: Path) -> dict[str, Any]:
    results: dict[str, list[RegisterRow]] = {"0x03": [], "0x04": []}
    source_sections: dict[str, list[str]] = {"0x03": [], "0x04": []}

    with pdfplumber.open(str(pdf_path)) as pdf:
        for function_code, cfg in REGISTER_TABLES.items():
            current_section = cfg["title"]
            rows = results[function_code]
            for page_no in cfg["pages"]:
                page = pdf.pages[page_no - 1]
                for table in page.extract_tables() or []:
                    for raw_row in table:
                        cells = compact_row(raw_row)
                        if not cells or is_header(cells):
                            continue

                        if len(cells) == 1:
                            maybe_section = cells[0]
                            if extract_range_from_text(maybe_section)[0] and not is_sequence(maybe_section):
                                current_section = clean_inline(maybe_section)
                                source_sections[function_code].append(current_section)
                            else:
                                append_continuation(rows, cells, page_no)
                            continue

                        register = parse_register_row(cells, function_code, current_section, page_no)
                        if register:
                            rows.append(register)
                            continue

                        append_continuation(rows, cells, page_no)

    return {
        "0x03": [row.to_detail_row() for row in results["0x03"]],
        "0x04": [row.to_detail_row() for row in results["0x04"]],
        "sections": source_sections,
    }


def build_payload(
    pdf_path: Path,
    extracted: dict[str, Any],
    vpp_dtc_records: list[dict[str, Any]],
) -> dict[str, Any]:
    applicability = deepcopy(VPP_PROFILE_APPLICABILITY)
    applicability["supported_dtc_records"] = vpp_dtc_records
    applicability["supported_dtc_groups"] = group_vpp_dtc_records(vpp_dtc_records)
    applicability["supported_dtc_count"] = len(vpp_dtc_records)

    return {
        "schema_version": "1.0.0",
        "source": {
            "path": str(pdf_path),
            "document_name": "古瑞瓦特逆变器VPP通信协议",
            "protocol_version": PROTOCOL_VERSION,
            "document_date": PROTOCOL_DATE,
            "converted_at": datetime.now(timezone.utc).isoformat(),
        },
        "register_profiles": [
            {
                "id": REGISTER_TABLES[function_code]["profile_id"],
                "module_cn": "VPP 协议参数",
                "function_code": function_code,
                "register_type": "holding_register" if function_code == "0x03" else "input_register",
                "address_ranges_raw": REGISTER_TABLES[function_code]["address_range"],
                "applicability": deepcopy(applicability),
                "registers": extracted[function_code],
                "sections": extracted["sections"][function_code],
            }
            for function_code in ["0x03", "0x04"]
        ],
        "stats": {
            "holding_register_rows": len(extracted["0x03"]),
            "input_register_rows": len(extracted["0x04"]),
            "holding_register_span_count": sum((r.get("quantity") or 0) for r in extracted["0x03"]),
            "input_register_span_count": sum((r.get("quantity") or 0) for r in extracted["0x04"]),
        },
    }


def has_han(value: str) -> bool:
    return bool(HAN_RE.search(value or ""))


def apply_register_translations(payload: dict[str, Any], overlay_path: Path) -> None:
    if not overlay_path.exists():
        raise SystemExit(f"Missing VPP register translation overlay: {overlay_path}")

    overlay = json.loads(overlay_path.read_text(encoding="utf-8"))
    if overlay.get("locale") != "en-US":
        raise SystemExit(f"Unsupported register translation overlay locale: {overlay.get('locale')}")

    records = overlay.get("records", [])
    translations: dict[tuple[str, str], dict[str, Any]] = {}
    errors: list[str] = []
    for record in records:
        key = (str(record.get("profile_id", "")), str(record.get("address", "")))
        if key in translations:
            errors.append(f"Duplicate translation record: {key[0]} {key[1]}")
        translations[key] = record

    expected_keys: set[tuple[str, str]] = set()
    for profile in payload.get("register_profiles", []):
        profile_id = profile["id"]
        for row in profile.get("registers", []):
            address = str(row.get("address", ""))
            key = (profile_id, address)
            expected_keys.add(key)
            record = translations.get(key)
            if not record:
                errors.append(f"Missing translation: {profile_id} {address}")
                continue

            if record.get("field_name_source") != row.get("field_name"):
                errors.append(
                    "Stale field_name translation source: "
                    f"{profile_id} {address} overlay={record.get('field_name_source')!r} "
                    f"current={row.get('field_name')!r}"
                )
            if record.get("notes_source") != row.get("notes"):
                errors.append(
                    "Stale notes translation source: "
                    f"{profile_id} {address} overlay={record.get('notes_source')!r} "
                    f"current={row.get('notes')!r}"
                )

            field_name_en = str(record.get("field_name_en", "")).strip()
            notes_en = str(record.get("notes_en", "")).strip()
            if not field_name_en:
                errors.append(f"Empty field_name_en: {profile_id} {address}")
            if not notes_en:
                errors.append(f"Empty notes_en: {profile_id} {address}")
            if has_han(field_name_en):
                errors.append(f"field_name_en contains Chinese: {profile_id} {address} {field_name_en!r}")
            if has_han(notes_en):
                errors.append(f"notes_en contains Chinese: {profile_id} {address} {notes_en!r}")

            row["field_name_en"] = field_name_en
            row["notes_en"] = notes_en

    extra_keys = sorted(set(translations) - expected_keys)
    for profile_id, address in extra_keys:
        errors.append(f"Stale extra translation record: {profile_id} {address}")

    if errors:
        message = "VPP register translation overlay validation failed:\n" + "\n".join(f"- {error}" for error in errors[:80])
        if len(errors) > 80:
            message += f"\n- ... {len(errors) - 80} more"
        raise SystemExit(message)


def md_escape(value: Any) -> str:
    text = "" if value is None else str(value)
    text = text.replace("|", "\\|")
    return text.replace("\n", "<br>")


def write_markdown(payload: dict[str, Any], output: Path) -> None:
    lines: list[str] = []
    source = payload["source"]
    stats = payload["stats"]
    lines.extend(
        [
            "# 古瑞瓦特逆变器 VPP 通信协议 V2.05 - 结构化 Markdown",
            "",
            f"> 来源 PDF：`{source['path']}`",
            f"> 协议版本：{source['protocol_version']}",
            f"> 文档日期：{source['document_date']}",
            "> 说明：本文件由 `scripts/extract_vpp_pdf.py` 从 PDF 表格抽取生成，适合作为 JSON SSOT 的人工审阅层。",
            "",
            "## 0. 抽取统计",
            "",
            "| 对象 | 数量 |",
            "|---|---:|",
            f"| 0x03 Holding Register 结构化行 | {stats['holding_register_rows']} |",
            f"| 0x03 Holding Register 覆盖寄存器数 | {stats['holding_register_span_count']} |",
            f"| 0x04 Input Register 结构化行 | {stats['input_register_rows']} |",
            f"| 0x04 Input Register 覆盖寄存器数 | {stats['input_register_span_count']} |",
            "",
        ]
    )

    for profile in payload["register_profiles"]:
        applicability = profile["applicability"]
        lines.extend(
            [
                f"## {profile['function_code']} {profile['module_cn']}",
                "",
                f"- Profile ID: `{profile['id']}`",
                f"- 地址范围: `{profile['address_ranges_raw']}`",
                f"- 结构化行数: `{len(profile['registers'])}`",
                f"- 适用性结论: {applicability['plain_conclusion_cn']}",
                "",
                "### 适用 DTC / 机型依据",
                "",
                f"- 判断方法: {applicability['summary_cn']}",
                *[f"- {step}" for step in applicability["decision_steps_cn"]],
                f"- {applicability['notices_cn']}",
                "",
                "### VPP 附表 3-1 DTC 清单",
                "",
                *[
                    f"- {group['type_cn']}: "
                    + "、".join(str(value) for value in group["dtc_values"])
                    for group in applicability["supported_dtc_groups"]
                ],
                "",
                "| 序号 | 地址 | 数量 | 字段名 | 读写 | 数据类型 | 单位 | Scale | 范围 / 备注 | 分组 |",
                "|---:|---|---:|---|---|---|---|---|---|---|",
            ]
        )
        for row in profile["registers"]:
            lines.append(
                "| "
                + " | ".join(
                    [
                        md_escape(row.get("sequence")),
                        md_escape(row.get("address")),
                        md_escape(row.get("quantity")),
                        md_escape(row.get("field_name")),
                        md_escape(row.get("access")),
                        md_escape(row.get("data_type")),
                        md_escape(row.get("unit")),
                        md_escape(row.get("scale")),
                        md_escape(row.get("notes")),
                        md_escape(row.get("section")),
                    ]
                )
                + " |"
            )
        lines.append("")

    while lines and lines[-1] == "":
        lines.pop()
    output.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_json(payload: dict[str, Any], output: Path) -> None:
    output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def update_protocol_ssot(payload: dict[str, Any], ssot_path: Path) -> None:
    if not ssot_path.exists():
        return
    ssot = json.loads(ssot_path.read_text(encoding="utf-8"))
    by_id = {profile["id"]: profile for profile in payload["register_profiles"]}
    for profile in ssot.get("register_profiles", []):
        incoming = by_id.get(profile.get("id"))
        if not incoming:
            continue
        profile["registers"] = incoming["registers"]
        profile["applicability"] = incoming["applicability"]
        profile["source_detail_ref"] = {
            "path": DEFAULT_JSON.as_posix(),
            "source_pdf": payload["source"]["path"],
            "protocol_version": payload["source"]["protocol_version"],
            "document_date": payload["source"]["document_date"],
        }
    ssot_path.write_text(json.dumps(ssot, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


REGISTER_COMPARE_FIELDS = [
    "field_name",
    "field_name_en",
    "data_type",
    "unit",
    "scale",
    "access",
    "applicable_dtc_or_model",
    "notes",
    "notes_en",
    "quantity",
    "address_start",
    "address_end",
]


def address_sort_key(row: dict[str, Any]) -> tuple[int, str]:
    if isinstance(row.get("address_start"), int):
        return row["address_start"], str(row.get("address", ""))
    match = re.search(r"\d+", str(row.get("address", "")))
    return (int(match.group(0)) if match else 0, str(row.get("address", "")))


def comparable_register(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "address": row.get("address"),
        **{field: row.get(field) for field in REGISTER_COMPARE_FIELDS},
    }


def normalize_compare_value(value: Any) -> Any:
    if isinstance(value, str):
        return clean_note(value)
    return value


def compare_register_lists(
    ssot_registers: list[dict[str, Any]],
    pdf_registers: list[dict[str, Any]],
) -> dict[str, Any]:
    ssot_by_address = {str(row.get("address")): row for row in ssot_registers}
    pdf_by_address = {str(row.get("address")): row for row in pdf_registers}

    added_addresses = sorted(set(pdf_by_address) - set(ssot_by_address), key=lambda key: address_sort_key(pdf_by_address[key]))
    removed_addresses = sorted(set(ssot_by_address) - set(pdf_by_address), key=lambda key: address_sort_key(ssot_by_address[key]))
    common_addresses = sorted(set(ssot_by_address) & set(pdf_by_address), key=lambda key: address_sort_key(pdf_by_address[key]))

    changed: list[dict[str, Any]] = []
    for address in common_addresses:
        ssot_row = ssot_by_address[address]
        pdf_row = pdf_by_address[address]
        field_diffs = {}
        for field in REGISTER_COMPARE_FIELDS:
            ssot_value = normalize_compare_value(ssot_row.get(field))
            pdf_value = normalize_compare_value(pdf_row.get(field))
            if ssot_value != pdf_value:
                field_diffs[field] = {
                    "ssot": ssot_value,
                    "pdf": pdf_value,
                }
        if field_diffs:
            changed.append(
                {
                    "address": address,
                    "field_name": pdf_row.get("field_name") or ssot_row.get("field_name"),
                    "diffs": field_diffs,
                }
            )

    return {
        "added_in_pdf": [comparable_register(pdf_by_address[address]) for address in added_addresses],
        "removed_from_pdf": [comparable_register(ssot_by_address[address]) for address in removed_addresses],
        "changed": changed,
    }


def compare_vpp_dtc_records(
    ssot_applicability: dict[str, Any],
    pdf_applicability: dict[str, Any],
) -> dict[str, Any]:
    ssot_records = ssot_applicability.get("supported_dtc_records", [])
    pdf_records = pdf_applicability.get("supported_dtc_records", [])
    ssot_by_dtc = {record.get("dtc"): record for record in ssot_records}
    pdf_by_dtc = {record.get("dtc"): record for record in pdf_records}

    added = [pdf_by_dtc[dtc] for dtc in sorted(set(pdf_by_dtc) - set(ssot_by_dtc))]
    removed = [ssot_by_dtc[dtc] for dtc in sorted(set(ssot_by_dtc) - set(pdf_by_dtc))]
    changed = []
    for dtc in sorted(set(ssot_by_dtc) & set(pdf_by_dtc)):
        ssot_record = ssot_by_dtc[dtc]
        pdf_record = pdf_by_dtc[dtc]
        diffs = {}
        for field in ["type_cn", "model_full_name"]:
            if normalize_compare_value(ssot_record.get(field)) != normalize_compare_value(pdf_record.get(field)):
                diffs[field] = {
                    "ssot": ssot_record.get(field),
                    "pdf": pdf_record.get(field),
                }
        if diffs:
            changed.append({"dtc": dtc, "diffs": diffs})

    return {
        "added_in_pdf": added,
        "removed_from_pdf": removed,
        "changed": changed,
    }


def compare_payload_to_ssot(payload: dict[str, Any], ssot_path: Path) -> dict[str, Any]:
    ssot = json.loads(ssot_path.read_text(encoding="utf-8"))
    ssot_profiles = {profile.get("id"): profile for profile in ssot.get("register_profiles", [])}
    profile_reports: list[dict[str, Any]] = []

    totals = {
        "profiles_missing_in_ssot": 0,
        "registers_added_in_pdf": 0,
        "registers_removed_from_pdf": 0,
        "registers_changed": 0,
        "dtc_added_in_pdf": 0,
        "dtc_removed_from_pdf": 0,
        "dtc_changed": 0,
    }

    for pdf_profile in payload.get("register_profiles", []):
        profile_id = pdf_profile["id"]
        ssot_profile = ssot_profiles.get(profile_id)
        if not ssot_profile:
            totals["profiles_missing_in_ssot"] += 1
            profile_reports.append(
                {
                    "profile_id": profile_id,
                    "status": "missing_in_ssot",
                    "pdf_register_count": len(pdf_profile.get("registers", [])),
                }
            )
            continue

        register_diff = compare_register_lists(ssot_profile.get("registers", []), pdf_profile.get("registers", []))
        dtc_diff = compare_vpp_dtc_records(
            ssot_profile.get("applicability", {}),
            pdf_profile.get("applicability", {}),
        )

        totals["registers_added_in_pdf"] += len(register_diff["added_in_pdf"])
        totals["registers_removed_from_pdf"] += len(register_diff["removed_from_pdf"])
        totals["registers_changed"] += len(register_diff["changed"])
        totals["dtc_added_in_pdf"] += len(dtc_diff["added_in_pdf"])
        totals["dtc_removed_from_pdf"] += len(dtc_diff["removed_from_pdf"])
        totals["dtc_changed"] += len(dtc_diff["changed"])

        profile_reports.append(
            {
                "profile_id": profile_id,
                "status": "compared",
                "register_diff": register_diff,
                "vpp_dtc_diff": dtc_diff,
            }
        )

    has_differences = any(count > 0 for count in totals.values())
    return {
        "schema_version": "1.0.0",
        "report_type": "vpp_pdf_against_json_ssot",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "ssot_path": str(ssot_path),
        "pdf_source": payload["source"],
        "summary": {
            "has_differences": has_differences,
            **totals,
        },
        "profiles": profile_reports,
    }


def print_validation_report(report: dict[str, Any]) -> None:
    summary = report["summary"]
    print("VPP PDF vs JSON SSOT validation")
    print(f"SSOT: {report['ssot_path']}")
    print(f"PDF: {report['pdf_source']['path']}")
    if not summary["has_differences"]:
        print("Result: OK - PDF extraction matches current JSON SSOT.")
        return

    print("Result: DIFFERENCES FOUND - review report before changing SSOT.")
    print(
        "Summary: "
        f"profiles_missing={summary['profiles_missing_in_ssot']}, "
        f"registers_added={summary['registers_added_in_pdf']}, "
        f"registers_removed={summary['registers_removed_from_pdf']}, "
        f"registers_changed={summary['registers_changed']}, "
        f"dtc_added={summary['dtc_added_in_pdf']}, "
        f"dtc_removed={summary['dtc_removed_from_pdf']}, "
        f"dtc_changed={summary['dtc_changed']}."
    )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--pdf", type=Path, default=DEFAULT_PDF)
    parser.add_argument("--json", type=Path, default=DEFAULT_JSON)
    parser.add_argument("--markdown", type=Path, default=DEFAULT_MARKDOWN)
    parser.add_argument("--ssot", type=Path, default=DEFAULT_SSOT)
    parser.add_argument("--translation-overlay", type=Path, default=DEFAULT_TRANSLATION_OVERLAY)
    parser.add_argument(
        "--validate-against-ssot",
        action="store_true",
        help="Extract the PDF in memory and compare it with the current JSON SSOT without writing SSOT files.",
    )
    parser.add_argument(
        "--validation-report",
        type=Path,
        help="Optional path for a JSON diff report when using --validate-against-ssot.",
    )
    parser.add_argument(
        "--update-ssot",
        action="store_true",
        help="Adopt the extracted PDF result into protocol_ssot.json after human review.",
    )
    parser.add_argument("--no-ssot-update", action="store_true", help=argparse.SUPPRESS)
    args = parser.parse_args()

    extracted = extract_registers(args.pdf)
    vpp_dtc_records = extract_vpp_dtc_table(args.pdf)
    payload = build_payload(args.pdf, extracted, vpp_dtc_records)
    apply_register_translations(payload, args.translation_overlay)

    if args.validate_against_ssot:
        report = compare_payload_to_ssot(payload, args.ssot)
        print_validation_report(report)
        if args.validation_report:
            args.validation_report.parent.mkdir(parents=True, exist_ok=True)
            args.validation_report.write_text(
                json.dumps(report, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )
            print(f"Validation report: {args.validation_report}")
        return_code = 1 if report["summary"]["has_differences"] else 0
        sys.exit(return_code)

    args.json.parent.mkdir(parents=True, exist_ok=True)
    write_json(payload, args.json)
    write_markdown(payload, args.markdown)
    if args.update_ssot:
        update_protocol_ssot(payload, args.ssot)

    stats = payload["stats"]
    print(
        "Extracted VPP registers: "
        f"0x03 rows={stats['holding_register_rows']} span={stats['holding_register_span_count']}; "
        f"0x04 rows={stats['input_register_rows']} span={stats['input_register_span_count']}."
    )
    print(f"JSON: {args.json}")
    print(f"Markdown: {args.markdown}")
    if args.update_ssot:
        print(f"Updated SSOT: {args.ssot}")
    else:
        print("SSOT not updated. JSON SSOT remains authoritative; use --update-ssot only after review.")


if __name__ == "__main__":
    main()
