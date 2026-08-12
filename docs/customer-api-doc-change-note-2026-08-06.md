# Growatt Open API 文档变更说明（面向客户）

发布日期：2026-08-06

适用对象：已接入或准备接入 Growatt Open API 的平台客户、聚合商、VPP 合作方与技术集成团队。

## 1. 本次更新概述

本次更新新增了设备电池工作模式查询接口，并同步更新了限流规则表。

本次更新重点覆盖以下内容：

- 新增 `getDeviceOperationMode` API，用于查询设备当前电池工作模式。
- 限流表已更新，纳入新接口。

## 2. 重点变更内容

### 2.1 新增 `getDeviceOperationMode` API

新增接口，允许 VPP 聚合商查询设备的当前电池工作模式。

**接口：** `POST /oauth2/getDeviceOperationMode`

**请求参数：**

| 参数 | 必填 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `deviceSn` | 是 | string | 设备唯一序列号 |
| `setType` | 是 | string | 请求类型：`"duration_and_power_charge_discharge"` |
| `requestId` | 是 | string | 唯一请求标识 |

**返回参数：**

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| `code` | int | `0` 表示成功 |
| `data` | string | 当前电池工作模式值 |
| `message` | string | 返回描述 |

**工作模式值：**

| 值 | 业务含义 | 典型场景 |
| :--- | :--- | :--- |
| `SELF_RELIANCE` | 自发自用模式 | 自用优化，减少电网依赖 |
| `TIME_OF_USE` | 分时电价优化 | 基于分时电价进行充放电成本优化 |
| `IMPORT_FOCUS` | 充电优先模式 | 低电价充电、事件前电池准备 |
| `EXPORT_FOCUS` | 放电优先模式 | VPP 调度、需求响应、削峰 |
| `IDLE` | 空闲模式 | 电池保护、SoC 锁定、策略切换过渡 |

**限流：** 每设备每分钟 1 次请求（`CLIENT_AND_DEVICE` 模式）。

### 2.2 限流表更新

限流表已新增 `getDeviceOperationMode`：

| 接口 | 窗口 | 模式 |
|---|---|---|
| `getDeviceOperationMode` | 60s | `CLIENT_AND_DEVICE` |

## 3. 涉及的主要接口与文档

- 新增：`POST /oauth2/getDeviceOperationMode`
- 更新：限流表 — 新增接口限流规则

## 4. 对客户的影响

### 4.1 对新接入客户

- 如果您的 VPP 平台需要监控电池调度状态，请将 `getDeviceOperationMode` 纳入集成范围。
- 遵守每设备每分钟 1 次的限流规则，避免 `TOO_MANY_REQUEST` 错误。

### 4.2 对已接入客户

- 无破坏性变更。所有现有接口路径、请求参数和返回结构均未变化。
- 如果您维护 API 网关、SDK 或封装层，请新增对该接口的支持。

## 5. 建议客户采取的动作

1. 阅读 `getDeviceOperationMode` API 文档，评估平台是否需要电池工作模式可见性。
2. 如采用新接口，按每设备每分钟 1 次限流实现轮询逻辑。
3. 查询前确保设备已通过 Device Authorization API 授权。
4. 对 `DEVICE_OFFLINE` 返回实现指数退避重试。

## 6. 兼容性说明

- 现有接口路径未变化。
- OAuth2 接入方式未变化。
- 无现有字段重命名或结构调整。
- 本次更新纯属增量，不影响已有集成。
