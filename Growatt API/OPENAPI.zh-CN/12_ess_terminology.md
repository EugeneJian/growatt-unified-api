# 储能术语对照表

本页整理 Growatt Open API 公开文档中涉及储能行业的中英术语。它不改动 vendor JSON key、接口名或枚举值。

## 使用规则

- 英文公开正文优先使用表中的推荐英文。
- `nominalPower`、`batteryNominalPower`、`payLoadPower`、`anti_backflow` 等 vendor key 保持不变。
- `state of charge (SOC)` 与 `state of health (SOH)` 在首次出现时优先使用全称加缩写。

## 公开术语表

| 概念 | 中文来源词 | 推荐英文 | 对应字段或 `setType` | 使用说明 |
| :--- | :--- | :--- | :--- | :--- |
| 功率额定值 | 额定功率 | rated power | `nominalPower`, `batteryNominalPower` | 正文使用 `rated power`，但保留 vendor key 原名。 |
| 容量额定值 | 额定容量 | rated capacity | `batteryCapacity` | 用于表示电池额定容量，单位通常为 Wh。 |
| 采集器 | 采集器 | datalogger | `datalogSn`, `datalogDeviceTypeName` | 不建议替换成 `collector`。 |
| 电表功率 | 电表功率 | grid meter power | `meterPower` | 正值表示 `grid import`，负值表示 `grid export`。 |
| 电网取电 | 取电 | grid import | `meterPower`, `etoUserToday`, `etoUserTotal` | 用于表示从电网输入的功率或电量。 |
| 电网馈电 | 馈电 | grid export | `meterPower`, `etoGridToday`, `etoGridTotal` | 正文优先使用 `grid export`，避免混用 `feed-in`。 |
| 电网运行方式 | 并网 / 离网 | grid-connected / off-grid | 运行状态值 `5`-`8` | 并网状态优先写 `grid-connected`，不主用 `on-grid`。 |
| 电池荷电状态 | 荷电状态 | state of charge (SOC) | `batteryList[].soc` | 首次出现优先带出缩写。 |
| 电池健康状态 | 健康状态 | state of health (SOH) | `batteryList[].soh` | 首次出现优先带出缩写。 |
| 电池功率 | 电池总充/放电功率 | battery power | `batPower` | 首次出现时说明符号方向：正值充电，负值放电。 |
| 充放电量 | 今日充电量 / 总充电量 / 今日放电量 / 总放电量 | charged energy today / total charged energy / discharged energy today / total discharged energy | `echargeToday`, `echargeTotal`, `edischargeToday`, `edischargeTotal` | 优先使用明确的能量表达。 |
| PV 功率 | PV 功率 | PV power | `ppv` | 无需默认扩写为 `local PV power`。 |
| PV 总发电能量 | PV 总发电能量 | total PV generation | `epvTotal` | 单位在字段说明上下文中保留。 |
| 防逆流 | 防逆流 | Export Limit | `anti_backflow` | 对外公开术语和 API 设计优先使用 `Export Limit`，但 vendor key 保持不变。 |
| 负载功率 | 负载功率 | load power | `payLoadPower`, `smartLoadPower` | 字段名中的 vendor key 拼写保持不变。 |
| 工作优先级 | 工作优先级 | operating priority | `priority` | 值标签继续使用 `load priority`、`battery priority`、`grid priority`。 |

## 相关文档

- [设备信息查询 API](./07_api_device_info.md)
- [设备数据查询 API](./08_api_device_data.md)
- [设备数据推送 API](./09_api_device_push.md)
- [全局参数说明](./10_global_params.md)
- [../Growatt Open API Professional Integration Guide.zh-CN.md](../Growatt Open API Professional Integration Guide.zh-CN.md)
