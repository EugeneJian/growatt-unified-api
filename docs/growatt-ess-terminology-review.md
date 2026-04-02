# Growatt ESS Terminology Review

Review date: 2026-04-02  
Scope: public bilingual Growatt Open API docs, with primary normalization on the English publication layer

## Review Guardrails

- This review standardizes terminology only; it does not change wire formats, vendor JSON keys, endpoint names, or enum values.
- English public docs are the primary target of normalization.
- Chinese public docs stay largely unchanged except for the new glossary page and glossary entry links.
- When a vendor key contains non-preferred wording, the prose changes but the key stays untouched.

## Summary Findings

- `04_api_device_auth.md` and `07_api_device_info.md` used `nominal power` for inverter and battery ratings; public English should use `rated power`.
- `08_api_device_data.md` and `09_api_device_push.md` mixed `grid import` semantics with the less stable term `feed-in`; public English should use the `grid import / grid export` pair consistently.
- `08_api_device_data.md` and `09_api_device_push.md` used `on-grid`; public English should prefer `grid-connected`.
- `08_api_device_data.md` and `09_api_device_push.md` spelled out battery status terms without the usual ESS acronyms `SOC` and `SOH`.
- `10_global_params.md` uses the vendor key `anti_backflow`, but the preferred public term is now `Export Limit`, which is more standard for ESS/VPP/API design contexts.
- `datalogger`, `reactive power`, `capacitive`, `inductive`, `load power`, and `operating priority` were already acceptable and are retained.

## Review Matrix

| Domain | 中文源词 | Current English | Recommended English | Allowed Alias | Avoid | Reason | Affected Pages | Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Inverter power rating | 额定功率 | nominal inverter power | rated inverter power | nameplate power | nominal inverter power | `rated power` is the safer public-facing ESS term for nameplate capability | `04`, `07` | replace |
| Battery power rating | 电池额定功率 | battery nominal power | battery rated power | nameplate battery power | battery nominal power | Aligns battery rating language with inverter rating language | `07` | replace |
| Battery capacity rating | 电池额定容量 | battery nominal capacity | battery rated capacity | rated battery capacity | battery nominal capacity | Keeps power/capacity rating language parallel | `07` | replace |
| Datalogger | 采集器 | datalogger | datalogger | logger | collector | `datalogger` is already standard and matches installed hardware naming | `04`, `07`, guide, FAQ | keep |
| Grid meter power | 电表功率 | meter power | grid meter power | meter reading power | generic meter power | The field is specifically grid-side in the published docs | `08`, `09` | replace |
| Grid import | 取电 | imported energy | grid import energy | imported-from-grid energy | user-side import | Public wording should preserve the grid perspective explicitly | `08`, `09` | replace |
| Grid export | 馈电 | exported energy / feed-in | grid export energy | export to grid | feed-in | `grid export` is clearer and more stable across markets than `feed-in` | `08`, `09` | replace |
| Grid-connected mode | 并网 | on-grid | grid-connected | grid-tied | on-grid | `grid-connected` is the more standard technical term in ESS/inverter docs | `08`, `09` | replace |
| Off-grid mode | 离网 | off-grid | off-grid | islanded | standalone mode | `off-grid` is already acceptable and widely used | `08`, `09` | keep |
| Battery charge level | 荷电状态 | battery state of charge in percent | battery state of charge (SOC) in percent | SOC | charge percentage | ESS readers expect the acronym on first mention | `08`, `09`, glossary | replace |
| Battery health | 健康状态 | battery state of health | battery state of health (SOH) | SOH | health percentage | ESS readers expect the acronym on first mention | `08`, `09`, glossary | replace |
| Battery power sign convention | 电池总充/放电功率 | total battery charge/discharge power | battery power | charge/discharge power | unsigned battery power wording | Shorter and clearer once the sign convention is stated explicitly | `08`, `09` | replace |
| Charge/discharge energy | 充放电量 | battery charge energy / battery discharge energy | charged energy / discharged energy | charging energy / discharging energy | generic charge quantity | Energy wording reads more naturally in field descriptions | `08`, `09` | replace |
| PV power | PV 功率 | local PV power | PV power | photovoltaic power | local PV power | `local` adds meaning not established by the baseline | `08`, `09` | replace |
| Export limit | 防逆流 | anti-backflow setting | Export Limit | export limiting | anti-backflow as the primary public term | `Export Limit` is the more standard ESS/VPP term, with clearer abstraction and better API design fit; keep `anti_backflow` only as the vendor key | `10`, glossary | replace+annotate |
| Load power | 负载功率 | total load power | load power / total load power | load demand | payload power in prose | Keep prose readable while leaving `payLoadPower` untouched | `08`, `09`, glossary | keep |
| Operating priority | 工作优先级 | operating priority | operating priority | dispatch priority | work priority | Existing English is already natural and clear | `08`, `09`, glossary | keep |
| Vendor-key preservation | 字段原名 | mixed | keep vendor key names unchanged | documented prose override | renaming keys in public docs | Prevents accidental API drift while still improving prose | `07`, `08`, `09`, `10`, glossary | annotate |

## Resulting Public Outputs

- Added public glossary pages:
  - `Growatt API/OPENAPI/12_ess_terminology.md`
  - `Growatt API/OPENAPI.zh-CN/12_ess_terminology.md`
- Updated README indexes and Quick Guide entry points to expose the glossary.
- Normalized the English terminology in the ESS-heavy pages without changing JSON keys.
- Kept `anti_backflow` as the vendor field name while promoting `Export Limit` as the public-facing English terminology.
