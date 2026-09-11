# 全局参数

Growatt Open API 的公共约定：基础地址、请求头、响应信封、错误码，以及设备调度参数的 `setType` 枚举。

---

## 生产环境基础地址

请使用为你的接入区域分配的正式环境基础地址：

| 区域 | Base URL |
|------|----------|
| 全球 | `https://opencloud.growatt.com` |
| 澳洲 | `https://opencloud-au.growatt.com` |

授权、token 与设备 API 必须使用同一区域。如果无法确定账号所属区域，请在接入前向 Growatt 对接人员确认。

---

## HTTP 请求头

受保护接口需要 access token。

| 参数 | 位置 | 类型 | 约束 | 值 |
|------|------|------|------|-----|
| `Authorization` | header | string | **required** | `Bearer <access_token>` |

---

## 响应信封

所有接口统一返回 `code` / `data` / `message` 三层结构。

```json
{
  "code": 0,
  "data": "<endpoint-dependent>",
  "message": "RESPONSE_MESSAGE"
}
```

- `code`：`0` 表示成功，非 `0` 表示失败。请以 `code` 作为主要成功标志。
- `data`：可能不返回，也可能为 `null`、对象、数组或数值，取决于接口与结果。
- `message`：响应描述文本。

---

## 错误码

| `code` | `message` | 场景 | `data` 返回 | 处理建议 |
|--------|-----------|------|-------------|----------|
| `0` | `SUCCESSFUL_OPERATION` | 操作成功 | 取决于接口 | 正常处理 |
| `2` | `TOKEN_IS_INVALID` | access token 无效或过期 | 不返回 | 刷新或重新获取 token |
| `5` | `DEVICE_OFFLINE` | 设备离线 | `null` | 检查设备在线状态 |
| `6` | `PARAMETER_SETTING_FAILED` | 参数设置失败 | `null` | 校验参数格式与范围 |
| `12` | `DEVICE_SN_DOES_NOT_HAVE_PERMISSION` | 设备未授权给当前 token | `["DEVICE_SN_1"]` | 确认设备授权列表 |
| `15` | `PARAMETER_SETTING_DEVICE_NOT_RESPONDING` | 设备无响应 | `null` | 检查设备通讯状态 |
| `16` | `PARAMETER_SETTING_RESPONSE_TIMEOUT` | 参数设置响应超时 | `null` | 使用 `readDeviceDispatch` 回读确认 |
| `18` | `READ_DEVICE_PARAM_FAIL` | 读取设备参数失败 | `null` | 检查设备是否支持该参数 |
| `103` | `WRONG_GRANT_TYPE` | 授权模式错误 | 不返回 | 确认 `grant_type` 与接口匹配 |
| `105` | `TOO_MANY_REQUEST` | 请求过于频繁 | `null` | 降低调用频率，参考限流规则 |

---

## 设备调度参数

`deviceDispatch` 与 `readDeviceDispatch` 接口通过 `setType` 指定操作类型。每个 `setType` 对应特定的 `value` 结构。

### `time_slot_charge_discharge`

分时段充放电。`percentage` 范围 `[-100,100]`，正值充电、负值放电；时间使用 UTC，最多可设置 16 个时段。

| 字段 | 类型 | 约束 | 描述 |
|------|------|------|------|
| `percentage` | integer | **required** | 充放电功率百分比，范围 `[-100,100]` |
| `startTime` | string | **required** | 开始时间，格式 `HH:mm`（UTC） |
| `endTime` | string | **required** | 结束时间，格式 `HH:mm`（UTC） |

**`value` 结构**：Array

```json
[
  { "percentage": 100, "startTime": "00:00", "endTime": "23:59" }
]
```

**`readDeviceDispatch.data` 回读示例**：

```json
[
  { "startTime": "16:00", "endTime": "18:00", "percentage": 80 }
]
```

---

### `duration_and_power_charge_discharge`

按时长与功率百分比充放电。`percentage` 范围 `[0,100]`。

| 字段 | 类型 | 约束 | 描述 |
|------|------|------|------|
| `duration` | integer | **required** | 持续时长，单位分钟 |
| `percentage` | integer | **required** | 功率百分比，范围 `[0,100]` |
| `type` | string | **required** | 命令类型。Possible enum values: `selfConsumptionCommand`, `chargeOnlySelfConsumptionCommand`, `chargeCommand`, `dischargeCommand` |

**`value` 结构**：Object

```json
{ "duration": 10, "percentage": 20, "type": "dischargeCommand" }
```

**`readDeviceDispatch.data` 回读示例**：

```json
{ "remotePowerControlEnable": 1, "duration": 10, "percentage": 80, "acChargingEnabled": 1 }
```

---

### `export_limit`

Export Limit。`exportLimitEnabled` 用于启用设置；`percentage` 范围 `[-100,100]`，正值表示逆流限制，负值表示顺流控制。

| 字段 | 类型 | 约束 | 描述 |
|------|------|------|------|
| `exportLimitEnabled` | integer | **required** | `1` = 启用，`0` = 关闭 |
| `percentage` | integer | **required** | 百分比，范围 `[-100,100]` |

**`value` 结构**：Object

```json
{ "exportLimitEnabled": 1, "percentage": 20 }
```

**`readDeviceDispatch.data` 回读示例**：

```json
{ "exportLimitEnabled": 1, "percentage": 20 }
```

---

### `enable_control`

启用或关闭 VPP 控制。

**`value` 结构**：Number

| 值 | 描述 |
|----|------|
| `1` | 开启 VPP 控制 |
| `0` | 关闭 VPP 控制 |

```json
1
```

**`readDeviceDispatch.data` 回读示例**：

```json
1
```

---

### `active_power_derating_percentage`

有功功率降额百分比。

**`value` 结构**：Number，范围 `[0,100]`

```json
50
```

**`readDeviceDispatch.data` 回读示例**：

```json
50
```

---

### `active_power_percentage`

有功功率百分比。

**`value` 结构**：Number，范围 `[0,100]`

```json
60
```

**`readDeviceDispatch.data` 回读示例**：

```json
60
```

---

### `remote_charge_discharge_power`

远程充放电功率。正值充电、负值放电。

**`value` 结构**：Number，范围 `[-100,100]`

```json
-30
```

**`readDeviceDispatch.data` 回读示例**：

```json
-30
```

---

## 相关文档

- [设备调度 API](./05_api_device_dispatch.md)
- [读取设备调度参数 API](./06_api_read_dispatch.md)
- [常见问题与排查](./11_api_troubleshooting.md)
