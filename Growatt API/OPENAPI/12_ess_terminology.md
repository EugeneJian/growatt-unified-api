# ESS Terminology Glossary

Baseline source: `docs/3 接口列表.md` (synced from the approved vendor document dated April 1, 2026)

This page standardizes the bilingual ESS terminology used in the public Growatt Open API documentation. It does not rename vendor JSON keys, endpoint names, or enum values.

## Usage Rules

- Use the recommended English in public prose, field descriptions, FAQs, and guides.
- Keep vendor keys unchanged, including `nominalPower`, `batteryNominalPower`, `payLoadPower`, and `anti_backflow`.
- On first mention, prefer full forms plus acronyms for `state of charge (SOC)` and `state of health (SOH)`.

## Public Glossary

| Concept | 中文基线词 | Recommended English | Field / `setType` | Usage Note |
| :--- | :--- | :--- | :--- | :--- |
| Power rating | 额定功率 | rated power | `nominalPower`, `batteryNominalPower` | Use `rated power` in prose; keep vendor keys unchanged. |
| Capacity rating | 额定容量 | rated capacity | `batteryCapacity` | Use for battery energy capacity in Wh. |
| Datalogger | 采集器 | datalogger | `datalogSn`, `datalogDeviceTypeName` | Do not replace with `collector`. |
| Grid meter power | 电表功率 | grid meter power | `meterPower` | Positive means grid import; negative means grid export. |
| Grid import | 取电 | grid import | `meterPower`, `etoUserToday`, `etoUserTotal` | Use for electricity imported from the grid. |
| Grid export | 馈电 | grid export | `meterPower`, `etoGridToday`, `etoGridTotal` | Prefer `grid export` over `feed-in` in prose. |
| Grid operating mode | 并网 / 离网 | grid-connected / off-grid | Runtime status values `5`-`8` | Prefer `grid-connected` over `on-grid`. |
| Battery charge level | 荷电状态 | state of charge (SOC) | `batteryList[].soc` | First mention should include the acronym. |
| Battery health | 健康状态 | state of health (SOH) | `batteryList[].soh` | First mention should include the acronym. |
| Battery power | 电池总充/放电功率 | battery power | `batPower` | Explain the sign convention when first used: positive = charging, negative = discharging. |
| Charged/discharged energy | 今日充电量 / 总充电量 / 今日放电量 / 总放电量 | charged energy today / total charged energy / discharged energy today / total discharged energy | `echargeToday`, `echargeTotal`, `edischargeToday`, `edischargeTotal` | Prefer explicit energy wording over generic charge/discharge quantity wording. |
| PV power | PV 功率 | PV power | `ppv` | Do not expand to `local PV power` unless a contrast is required. |
| Total PV generation | PV 总发电能量 | total PV generation | `epvTotal` | Keep units in the surrounding field description. |
| Export limit | 防逆流 | Export Limit | `anti_backflow` | Preferred public term for API design and VPP contexts; keep the vendor key unchanged. |
| Load power | 负载功率 | load power | `payLoadPower`, `smartLoadPower` | Keep the vendor key spelling unchanged in field names. |
| Operating priority | 工作优先级 | operating priority | `priority` | Keep the value labels `load priority`, `battery priority`, and `grid priority`. |

## Related Documentation

- [Device Information Query API](./07_api_device_info.md)
- [Device Data Query API](./08_api_device_data.md)
- [Device Data Push API](./09_api_device_push.md)
- [Global Parameters](./10_global_params.md)
- [../Growatt Open API Professional Integration Guide.md](../Growatt Open API Professional Integration Guide.md)
