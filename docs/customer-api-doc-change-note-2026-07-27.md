# Growatt Open API 文档变更说明（面向客户）

发布日期：2026-07-27

适用对象：已接入或准备接入 Growatt Open API 的平台客户、聚合商、VPP 合作方与技术集成团队。

## 1. 本次更新概述

本次更新覆盖三个方面：移除不可用的遥测字段、更新支持机型列表、发布 API 限流规则文档。

本次更新重点覆盖以下内容：

- `smartLoadPower` 字段已从 `getDeviceData` 和设备数据推送中移除。
- 支持机型列表已更新，新增部分型号。
- API 限流规则已公开文档化，覆盖所有接口。

## 2. 重点变更内容

### 2.1 移除 `smartLoadPower` 字段

`smartLoadPower` 字段已从以下位置移除：

- `POST /oauth2/getDeviceData` 返回字段
- 设备数据推送 payload

说明：

- 该字段实际未通过公开 OpenAPI 提供，在文档中存在会误导开发者。
- 如果您的解析器已忽略未知字段，无需额外操作。
- 如果您在字段映射表或集成代码中引用了 `smartLoadPower`，请将其移除。

### 2.2 支持机型列表更新

支持的逆变器 / PCE 机型列表已更新：

**新增型号：**

- 扩展了 MODA 系列型号及区域变体
- 新增一体式储能机型（MINA、MODA）到确认列表

### 2.3 API 限流说明

所有公开接口的限流规则现已公开文档化。

**限流模式：**

| 模式 | 说明 |
|---|---|
| `CLIENT_ONLY` | 按 clientId 限流；同一客户的所有请求共享配额 |
| `CLIENT_AND_DEVICE` | 按 clientId + deviceSn 限流；每个设备在每个客户下独立计数 |

**各接口限流配置：**

| 接口 | 窗口 | 模式 |
|---|---|---|
| `getDeviceInfo` | 60s | `CLIENT_AND_DEVICE` |
| `getDeviceData` | 10s | `CLIENT_AND_DEVICE` |
| `deviceDispatch` | 5s | `CLIENT_AND_DEVICE` |
| `readDeviceDispatch` | 5s | `CLIENT_AND_DEVICE` |
| `getDeviceList` | 60s | `CLIENT_ONLY` |
| `getDeviceListAuthed` | 60s | `CLIENT_ONLY` |

**限流超限返回示例（错误码 105）：**

```json
{
  "code": 105,
  "data": null,
  "message": "Endpoint rate limited for clientId=client***, retry after 43217ms"
}
```

- `clientId` 仅展示前 6 位，其余以 `***` 代替
- `retry after Xms` 表示需等待的剩余毫秒数

## 3. 涉及的主要接口与文档

- `POST /oauth2/getDeviceData` — 移除 `smartLoadPower` 字段
- 设备数据推送 payload — 移除 `smartLoadPower` 字段
- 支持机型列表 — 型号新增
- API 限流 — 所有接口限流规则首次公开发布

## 4. 对客户的影响

### 4.1 对新接入客户

- 忽略 `smartLoadPower`，该字段不会通过 API 返回。
- 查阅更新后的支持机型列表，确认部署设备的兼容性。
- 阅读限流规则，在 API 客户端中实现对错误码 105 的限流处理。

### 4.2 对已接入客户

- **`smartLoadPower` 移除**：如果代码中引用了该字段，请从字段映射和解析逻辑中移除。
- **支持机型更新**：如果您维护内部兼容性矩阵，请同步新增的型号。
- **限流规则**：如果您的接口调用频率较高，请对照限流规则检查各接口窗口，并为错误码 105 实现退避重试逻辑。

## 5. 建议客户采取的动作

1. 从集成代码、字段映射或 SDK 封装中移除 `smartLoadPower`。
2. 按最新的支持机型列表更新内部设备兼容性矩阵。
3. 为错误码 105 增加限流处理：解析 `retry after Xms` 并实现指数退避。
4. 如贵司有 API 网关、SDK 或二次封装层，请同步更新对外说明文档。

## 6. 兼容性说明

- 接口路径未变化。
- OAuth2 接入方式未变化。
- 无现有字段重命名或结构调整。
- `smartLoadPower` 从未通过 API 实际提供，文档移除对运行时不产生任何影响。
- 限流规则已在服务端持续执行，现仅将规则公开文档化。
