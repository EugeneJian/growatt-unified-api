# 储能术语表

本页统一 Growatt Open API 公开文档中使用的中英双语储能术语。它不会改动 vendor JSON key、接口名或枚举值。

## 使用规则

- 在公开正文、字段说明、FAQ 与指南中，优先使用表中的推荐英文。
- `nominalPower`、`batteryNominalPower`、`payLoadPower`、`anti_backflow` 等 vendor key 保持不变。
- `state of charge (SOC)` 与 `state of health (SOH)` 首次出现时，优先使用全称加缩写。

## 公开术语表

| 概念 | 中文来源词 | 推荐英文 | 对应字段 / `setType` | 使用说明 |
| :--- | :--- | :--- | :--- | :--- |
| 额定功率 | 额定功率 | rated power | `nominalPower`, `batteryNominalPower` | 正文使用 `rated power`，但 vendor key 保持原名。 |
| 额定容量 | 额定容量 | rated capacity | `batteryCapacity` | 用于表示电池额定能量容量，单位 Wh。 |
| 采集器 | 采集器 | datalogger | `datalogSn`, `datalogDeviceTypeName` | 不建议替换成 `collector`。 |
| 电网表 | 电网表 | grid meter | `meterPower`, `etoUserToday`, `etoUserTotal`, `etoGridToday`, `etoGridTotal` | 表示站点与公用电网之间的边界计量设备；在 AC-couple 拓扑中要与外部发电边界区分。 |
| 电网表功率 | 电网表功率 | grid meter power | `meterPower` | 在电网表边界上，正值表示 `grid import`，负值表示 `grid export`。 |
| 外部发电边界 | 外部发电边界 | external generation boundary | `pexPower` | 表示 AC-couple 拓扑下的外部发电边界，通常来源于第三方电表或 Solar Inverter。 |
| 外部发电功率 | 外部发电功率 | external generation power | `pexPower` | 用于表示第三方电表 / Solar Inverter 的发电功率；应视为非负观测量，而不是取电/送电方向字段。 |
| 发电机功率 | 发电机功率 | generator power | `genPower` | 用于上报离网场景下的发电机功率；它不是 AC-couple 外部发电边界信号。 |
| 电网取电 | 电网取电 | grid import | `meterPower`, `etoUserToday`, `etoUserTotal` | 用于表示从公用电网取入的功率或电量。 |
| 向电网送电 | 向电网送电 | grid export | `meterPower`, `etoGridToday`, `etoGridTotal` | 正文优先使用 `grid export`，避免混用 `feed-in`。 |
| 无功功率 | 无功功率 | reactive power | `reactivePower` | 需要时保留容性/感性的符号说明。 |
| 电网频率 | 电网频率 | grid frequency | `fac` | 字段级单位说明统一写为 `Hz`。 |
| 线电压 | 线电压 | line voltage | `vac1`, `vac2`, `vac3` | 用于各相/各线电压字段，单位 V。 |
| 电网运行方式 | 并网 / 离网 | grid-connected / off-grid | 运行状态值 `5`-`8` | 并网状态优先写 `grid-connected`，不优先使用 `on-grid`。 |
| 电池荷电状态 | 电池荷电状态 | state of charge (SOC) | `batteryList[].soc` | 首次出现优先带出缩写。 |
| 电池健康状态 | 电池健康状态 | state of health (SOH) | `batteryList[].soh` | 首次出现优先带出缩写。 |
| 电池包状态 | 电池包状态 | battery pack status | `batteryList[].status` | 用于 payload 明确返回单个电池包状态码的场景。 |
| 电池功率 | 电池功率 | battery power | `batPower` | 首次出现时说明符号方向：正值充电，负值放电。 |
| 充放电电量 | 充放电电量 | charged energy today / total charged energy / discharged energy today / total discharged energy | `echargeToday`, `echargeTotal`, `edischargeToday`, `edischargeTotal` | 优先使用明确的电量表达，而不是泛化的充放电量说法。 |
| PV 功率 | PV 功率 | PV power | `ppv` | 用于设备本地 PV 遥测；在 AC-couple 拓扑中它仍是辅助信号，不替代外部发电边界语义。 |
| PV 累计发电量 | PV 累计发电量 | total PV generation | `epvTotal` | 单位在字段说明上下文中保留。 |
| 防逆流 | 防逆流 | Export Limit | `anti_backflow` | 对外公开术语与 API 设计语境优先使用 `Export Limit`，但 vendor key 保持不变。 |
| 负载功率 | 负载功率 | load power | `payLoadPower`, `smartLoadPower` | 字段名中的 vendor key 拼写保持不变。 |
| Smart Load 负载功率 | Smart Load 负载功率 | smart-load power | `smartLoadPower` | 用于设备上报独立 smart-load 通道功率的场景。 |
| 工作优先级 | 工作优先级 | operating priority | `priority` | 值标签继续使用 `load priority`、`battery priority`、`grid priority`。 |

## 相关文档

- [设备信息查询 API](./07_api_device_info.md)
- [设备数据查询 API](./08_api_device_data.md)
- [设备数据推送 API](./09_api_device_push.md)
- [全局参数说明](./10_global_params.md)
- [ESS 语义模型](./13_ess_semantic_model.md)
- [../Growatt Open API Professional Integration Guide.zh-CN.md](../Growatt Open API Professional Integration Guide.zh-CN.md)
