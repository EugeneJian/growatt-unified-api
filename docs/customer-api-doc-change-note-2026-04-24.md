# Growatt Open API 文档变更说明（面向客户）

发布日期：2026-04-24

适用对象：已接入或准备接入 Growatt Open API 的平台客户、聚合商、VPP 合作方与技术集成团队。

## 1. 本次更新概述

本次更新主要是对公开 API 文档进行同步和澄清，使其与最新厂商设置项基线及最新联调结论保持一致。

本次更新重点覆盖以下内容：

- 设备调度与调度回读相关文档已同步到最新公开设置项基线。
- 防逆流相关英文名称已统一调整为 `export_limit` / `exportLimitEnabled`。
- 公开调度 `setType` 已由原先的 3 个扩展为 7 个。
- `readDeviceDispatch` 的回读结果说明已补充为按 `setType` 返回不同结构，不再默认只有数组结构。

## 2. 重点变更内容

### 2.1 防逆流设置命名更新

原公开文档中的防逆流设置名称：

- `anti_backflow`
- `antiBackflowEnabled`

现统一更新为：

- `export_limit`
- `exportLimitEnabled`

说明：

- 文档中的公开术语统一使用 `Export Limit`。
- 新接入和后续维护建议统一按 `export_limit` 口径实现。

### 2.2 公开调度 `setType` 扩展为 7 个

当前公开文档中的调度 `setType` 为以下 7 项：

1. `time_slot_charge_discharge`
2. `duration_and_power_charge_discharge`
3. `export_limit`
4. `enable_control`
5. `active_power_derating_percentage`
6. `active_power_percentage`
7. `remote_charge_discharge_power`

其中新增补充到公开文档的设置项包括：

- `enable_control`
- `active_power_derating_percentage`
- `active_power_percentage`
- `remote_charge_discharge_power`

### 2.3 调度回读数据结构说明更新

`POST /oauth2/readDeviceDispatch` 的返回字段 `data` 现已在文档中明确为：

- 可能返回数组
- 可能返回对象
- 可能返回数值

返回结构取决于具体的 `setType`。

示例：

- `time_slot_charge_discharge`：通常返回数组
- `export_limit`：通常返回对象
- `enable_control`：通常返回数值

因此，客户侧如果对回读结果做了解析或校验，建议按 `setType` 做分支处理，不要将 `data` 固定按单一结构解析。

## 3. 涉及的主要接口

本次文档更新主要影响以下公开接口的理解与实现方式：

- `POST /oauth2/deviceDispatch`
- `POST /oauth2/readDeviceDispatch`

同时更新了以下配套说明页面：

- 全局参数说明
- 储能术语表
- 储能语义模型
- Quick Guide / Unified API 汇总说明

## 4. 对客户的影响

### 4.1 对新接入客户

建议直接按照最新文档实现，不再使用旧的 `anti_backflow` 命名。

### 4.2 对已接入客户

如果您当前的实现中已经使用了旧文档中的以下名称：

- `anti_backflow`
- `antiBackflowEnabled`

建议尽快完成文档与代码映射核对，并在测试环境验证后切换到：

- `export_limit`
- `exportLimitEnabled`

如果您当前仅使用原先的 3 个 `setType`，也建议同步补充对新增 4 个公开设置项的识别与兼容能力。

### 4.3 对调度回读逻辑

如果您的平台会对 `readDeviceDispatch.data` 进行自动解析、结构校验或字段比较，请重点检查以下逻辑：

- 是否假设 `data` 一定为数组
- 是否按固定 JSON schema 校验所有 `setType`
- 是否支持对象型与数值型返回

## 5. 建议客户采取的动作

建议您在后续版本中完成以下检查：

1. 更新 `deviceDispatch` / `readDeviceDispatch` 的 `setType` 枚举表。
2. 将防逆流相关字段映射更新为 `export_limit` / `exportLimitEnabled`。
3. 将 `readDeviceDispatch.data` 的解析逻辑调整为按 `setType` 处理数组、对象、数值三类返回。
4. 补充新增 4 个公开设置项的参数校验与联调测试。
5. 如贵司有 API 网关、SDK 或二次封装层，请同步更新对外说明文档。

## 6. 兼容性说明

本次更新以公开文档同步为主，重点是将文档与最新设置项基线对齐。

需要特别注意的是：

- 接口路径未变化。
- OAuth2 接入方式未变化。
- 主要变化集中在调度参数枚举、字段命名和回读结构说明。
- 如客户侧实现曾严格依赖旧文档中的命名或固定返回结构，仍需要进行适配。

## 7. 建议沟通口径

如需面向业务方或项目方做简要说明，可使用以下口径：

“本次 Growatt Open API 文档更新主要补充了最新公开调度设置项，并统一了防逆流设置的命名。对新接入客户建议直接按最新文档实现；对已接入客户建议重点检查调度参数枚举、`export_limit` 命名替换，以及 `readDeviceDispatch` 回读结构的兼容处理。” 

## 8. 建议发布时间

建议将本说明与最新 API 文档同步发布，并在客户群、项目对接群或版本更新通知中重点提示以下三点：

- 防逆流命名更新为 `export_limit`
- 公开 `setType` 扩展为 7 个
- `readDeviceDispatch.data` 不再默认只有数组结构
