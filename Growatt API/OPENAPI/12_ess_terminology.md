# ESS Terminology Glossary

This page standardizes the bilingual ESS terminology used in the public Growatt Open API documentation. It does not rename vendor JSON keys, endpoint names, or enum values.

## Usage Rules

- Use the recommended English in public prose, field descriptions, FAQs, and guides.
- Keep vendor keys unchanged, including `nominalPower`, `batteryNominalPower`, `payLoadPower`, and `export_limit`.
- On first mention, prefer full forms plus acronyms for `state of charge (SOC)` and `state of health (SOH)`.

## Public Glossary

| Concept | Chinese Source Term | Recommended English | Field / `setType` | Usage Note |
| :--- | :--- | :--- | :--- | :--- |
| Power rating | 额定功率 | rated power | `nominalPower`, `batteryNominalPower` | Use `rated power` in prose; keep vendor keys unchanged. |
| Capacity rating | 额定容量 | rated capacity | `batteryCapacity` | Use for battery energy capacity in Wh. |
| Datalogger | 采集器 | datalogger | `datalogSn`, `datalogDeviceTypeName` | Do not replace with `collector`. |
| Grid meter | 电网表 | grid meter | `meterPower`, `etoUserToday`, `etoUserTotal`, `etoGridToday`, `etoGridTotal` | Site boundary asset against the utility grid; distinguish from the external generation boundary in AC-couple topologies. |
| Grid meter power | 电网表功率 | grid meter power | `meterPower` | Positive means grid import; negative means grid export at the grid-meter boundary. |
| External generation boundary | 外部发电边界 | external generation boundary | `pexPower` | AC-couple external-generation boundary, typically sourced from a third-party meter or Solar Inverter. |
| External generation power | 外部发电功率 | external generation power | `pexPower` | Use for third-party meter / Solar Inverter generation power; treat as a non-negative observational magnitude, not an import/export sign field. |
| Generator power | 发电机功率 | generator power | `genPower` | Use for off-grid generator telemetry when reported; it is not the AC-couple external-generation boundary signal. |
| Grid import | 电网取电 | grid import | `meterPower`, `etoUserToday`, `etoUserTotal` | Use for electricity imported from the grid. |
| Grid export | 向电网送电 | grid export | `meterPower`, `etoGridToday`, `etoGridTotal` | Prefer `grid export` over `feed-in` in prose. |
| Reactive power | 无功功率 | reactive power | `reactivePower` | Keep the capacitive/inductive sign note in field descriptions when needed. |
| Grid frequency | 电网频率 | grid frequency | `fac` | Use `Hz` in field-level unit descriptions. |
| Line voltage | 线电压 | line voltage | `vac1`, `vac2`, `vac3` | Use for per-line voltage values in V. |
| Grid operating mode | 并网 / 离网 | grid-connected / off-grid | Runtime status values `5`-`8` | Prefer `grid-connected` over `on-grid`. |
| Battery charge level | 电池荷电状态 | state of charge (SOC) | `soc`, `batteryList[].soc` | `soc` is system-level SOC; `batteryList[].soc` is per-pack SOC. First mention should include the acronym. |
| Battery health | 电池健康状态 | state of health (SOH) | `batteryList[].soh` | First mention should include the acronym. |
| Battery pack status | 电池包状态 | battery pack status | `batteryList[].status` | Use for per-pack status codes when the payload exposes them. |
| Battery power | 电池功率 | battery power | `batPower` | Explain the sign convention when first used: positive = charging, negative = discharging. |
| Charged/discharged energy | 充放电电量 | charged energy today / total charged energy / discharged energy today / total discharged energy | `echargeToday`, `echargeTotal`, `edischargeToday`, `edischargeTotal` | Prefer explicit energy wording over generic charge/discharge quantity wording. |
| PV power | PV 功率 | PV power | `ppv` | Use for device-local PV telemetry. In AC-couple topologies, it remains auxiliary and does not replace external-generation boundary semantics. |
| Total PV generation | PV 累计发电量 | total PV generation | `epvTotal` | Keep units in the surrounding field description. |
| Export limit | 防逆流 | Export Limit | `export_limit` | Preferred public term for API design and VPP contexts; keep the vendor key unchanged. |
| Load power | 负载功率 | load power | `payLoadPower`, `smartLoadPower` | Keep the vendor key spelling unchanged in field names. |
| Smart-load power | Smart Load 负载功率 | smart-load power | `smartLoadPower` | Use for the dedicated smart-load channel when it is present. |
| Operating priority | 工作优先级 | operating priority | `priority` | Keep the value labels `load priority`, `battery priority`, and `grid priority`. |

## Related Documentation

- [Device Information Query API](./07_api_device_info.md)
- [Device Data Query API](./08_api_device_data.md)
- [Device Data Push API](./09_api_device_push.md)
- [Global Parameters](./10_global_params.md)
- [ESS Semantic Model](./13_ess_semantic_model.md)
- [../Growatt Open API Professional Integration Guide.md](../Growatt Open API Professional Integration Guide.md)
