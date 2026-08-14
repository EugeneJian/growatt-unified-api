# Growatt Open API 文档变更说明

发布日期：2026-07-17

适用对象：已接入或准备接入 Growatt Open API 的平台客户、聚合商、VPP 合作方与技术集成团队。

## 1. 本次更新概述

本次更新为设备信息与设备数据相关接口补充了一批面向 VPP 聚合商集成的新字段，覆盖站点位置信息、放电截止 SOC、电池最大充放电功率与 PV 当日发电量。

本次更新重点覆盖以下内容：

- `getDeviceInfo` 新增站点名称、经纬度、时区与放电截止 SOC 字段。
- `getDeviceData` 与设备数据推送报文新增电池最大充放电功率与 PV 当日发电量字段。
- 推送报文字段与 `getDeviceData` 查询字段保持一致。

## 2. 重点变更内容

### 2.1 `getDeviceInfo` 新增字段

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| `siteName` | string | 设备所属站点（电站）名称 |
| `latitude` | string | 站点纬度（十进制度） |
| `longitude` | string | 站点经度（十进制度） |
| `timezone` | string | 站点时区（UTC 偏移小时数） |
| `dischargeCutOffSOC` | int | 电池放电截止 SOC（百分比） |
| `backupCutOffSOC` | int | 离网（备用）放电截止 SOC（百分比） |

说明：


### 2.2 `getDeviceData` 与推送报文新增字段

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| `maxChargePower` | int | 电池最大充电功率，单位 W |
| `maxDischargePower` | int | 电池最大放电功率，单位 W |
| `epvToday` | double | PV 今日发电量，单位 kWh |

说明：

- `maxChargePower` / `maxDischargePower` 在 SPA/SPH 机型上暂不支持。
- 设备数据推送报文与 `getDeviceData` 查询结果的字段保持一致，以上新增字段同样出现在推送报文中。

## 3. 涉及的主要接口

本次文档更新主要影响以下公开接口：

- `POST /oauth2/getDeviceInfo`
- `POST /oauth2/getDeviceData`
- 设备数据推送（push）报文

## 4. 对客户的影响

### 4.1 对新接入客户

建议直接按照最新文档实现，将新增字段纳入数据模型与解析逻辑。

### 4.2 对已接入客户

- 新增字段均为响应新增内容，接口路径、请求参数与既有字段含义均未变化，存量解析逻辑不受影响。
- 如果您的平台对响应或推送报文做了严格 JSON schema 校验（禁止未知字段），请及时放开或补充上述新增字段，避免校验失败。
- 如需按当地时区上报时间戳或匹配用户账单地址，可使用 `siteName`、`latitude`、`longitude`、`timezone` 字段。
- `dischargeCutOffSOC` 表示电池放电截止 SOC；`backupCutOffSOC` 表示离网（备用）放电截止 SOC。

## 5. 建议客户采取的动作

1. 更新 `getDeviceInfo` / `getDeviceData` / 推送报文的字段映射表，纳入本次新增字段。
2. 检查报文校验逻辑是否兼容新增字段。
3. 针对 SPA/SPH 机型，确认 `maxChargePower` / `maxDischargePower` 缺失时的兼容处理。
4. 如贵司有 API 网关、SDK 或二次封装层，请同步更新对外说明文档。

## 6. 兼容性说明

- 接口路径未变化。
- OAuth2 接入方式未变化。
- 本次为纯新增字段，不涉及既有字段的重命名或结构调整。
- 部分新增字段存在机型差异（见第 2 节说明），客户侧解析时建议将其视为可选字段。
