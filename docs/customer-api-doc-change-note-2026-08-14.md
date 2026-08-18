# Growatt Open API 文档变更说明

发布日期：2026-08-14

适用对象：已接入或准备接入 Growatt Open API 的平台客户、聚合商、VPP 合作方与技术集成团队。

## 1. 本次更新概述

本次更新为设备信息查询接口新增电站级唯一标识字段，并补充了按时长与功率百分比充放电调度参数的字段取值说明。

本次更新重点覆盖以下内容：

- `getDeviceInfo` 接口新增 `systemId` 字段，用于标识设备所属电站。
- 补充 `duration_and_power_charge_discharge` 调度参数中 `duration`、`percentage`、`type` 字段的取值说明。

## 2. 重点变更内容

### 2.1 `getDeviceInfo` 新增 `systemId` 字段

设备信息查询接口的返回数据中新增 `systemId` 字段，用于标识设备所属的电站。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| `systemId` | string | 电站全局唯一标识，由 Growatt 云端生成；同一电站下所有设备返回相同值，电站生命周期内保持不变 |

**要点：**

- 一个 `systemId` 唯一对应一个电站。
- 同一电站下的所有设备返回相同的 `systemId`。
- `systemId` 在电站生命周期内保持不变。

### 2.2 `duration_and_power_charge_discharge` 字段取值说明

对按时长与功率百分比充放电调度参数补充字段取值说明：

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| `duration` | int | 持续时长（分钟）。`0` 表示不限时，`1~1440` 分钟按设定时长控制 |
| `percentage` | int | 基于电池额定充放电功率的百分比，范围 `[-100,100]`，正值充电、负值放电 |
| `type` | string | 指令类型：`selfConsumptionCommand`、`chargeOnlySelfConsumptionCommand`、`chargeCommand`、`dischargeCommand`；其中前两者默认以最大可充放电功率充放电，此时 `percentage` 不生效 |

## 3. 涉及的主要接口与文档

- 更新：`POST /oauth2/getDeviceInfo` — 返回数据新增 `systemId` 字段
- 更新：全局参数 — 补充 `duration_and_power_charge_discharge` 字段取值说明

## 4. 对客户的影响

### 4.1 对新接入客户

- 接入 `getDeviceInfo` 时，可读取 `systemId` 以识别设备所属电站。
- 设置 `duration_and_power_charge_discharge` 时，按上述字段取值说明传参。

### 4.2 对已接入客户

- 无破坏性变更。现有接口路径、请求参数和返回结构均未变化。
- `getDeviceInfo` 返回数据为新增字段，原有字段不变；如您的解析逻辑对字段做了严格校验，建议放行新增字段。

## 5. 建议客户采取的动作

1. 阅读 `getDeviceInfo` API 文档，确认是否需要在集成中读取 `systemId`。
2. 使用 `duration_and_power_charge_discharge` 时，按字段取值说明正确设置 `duration`、`percentage`、`type`。

## 6. 兼容性说明

- 现有接口路径未变化。
- OAuth2 接入方式未变化。
- 无现有字段重命名或结构调整；`systemId` 为纯新增字段。
- 本次更新无破坏性变更，不影响已有集成。
