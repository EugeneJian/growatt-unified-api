# 全局参数说明

## 域名

### 正式环境

- `https://opencloud.growatt.com`
- `https://opencloud-au.growatt.com`

### 测试环境

- `https://opencloud-test.growatt.com`
- `https://opencloud-test-au.growatt.com`

## HTTP 请求头说明

- 调用 API 时需要 `access_token`。

| 参数名 | 参数说明 | 参数值说明 |
| :--- | :--- | :--- |
| `Authorization` | token 标识 | `Bearer xxxxxxx` |

## 返回码说明

### 返回格式示例

```json
{
    "code": 0,
    "data": {},
    "message": "RESPONSE_MESSAGE"
}
```

| 场景 | `code` | `data` | `message` |
| :--- | :--- | :--- | :--- |
| 操作成功 | `0` | `{}` | `"SUCCESSFUL_OPERATION"` |
| 设备 SN 无权限 | `12` | `["DEVICE_SN_1"]` | `"DEVICE_SN_DOES_NOT_HAVE_PERMISSION"` |
| Token 无效 | `2` | 未返回 | `"TOKEN_IS_INVALID"` |
| 设备离线 | `5` | `null` | `"DEVICE_OFFLINE"` |
| 读取设备参数失败 | `18` | `null` | `"READ_DEVICE_PARAM_FAIL"` |
| 参数设置响应超时 | `16` | `null` | `"PARAMETER_SETTING_RESPONSE_TIMEOUT"` |
| 参数设置设备无响应 | `15` | `null` | `"PARAMETER_SETTING_DEVICE_NOT_RESPONDING"` |
| 参数设置失败 | `6` | `null` | `"PARAMETER_SETTING_FAILED"` |
| 请求过多 | `105` | `null` | `"TOO_MANY_REQUEST"` |

## 设备参数说明

- 下表只保留当前厂商基线在全局章节明确列出的 `setType`。

| 参数名 | 参数说明 | 参数值说明 |
| :--- | :--- | :--- |
| `time_slot_charge_discharge` | 分时段充放电；`percentage` 范围 `[-100,100]`，`percentage > 0` 充电，`percentage < 0` 放电；`startTime` / `endTime` 为 UTC 时间 | `[{ "percentage": 100, "startTime": "00:00", "endTime": "23:59" }]` |
| `duration_and_power_charge_discharge` | 充放电时长和功率百分比；`percentage` 范围 `[0,100]`；支持 `selfConsumptionCommand`、`chargeOnlySelfConsumptionCommand`、`chargeCommand`、`dischargeCommand` | `{ "duration": 10, "percentage": 20, "type": "dischargeCommand" }` |
| `anti_backflow` | 防逆流设置；`antiBackflowEnabled` 为启用开关；`percentage` 范围 `[-100,100]`，正值为逆流控制，负值为顺流控制 | `{ "antiBackflowEnabled": 1, "percentage": 20 }` |

## 相关文档

- [设备调度 API](./05_api_device_dispatch.md)
- [读取设备调度参数 API](./06_api_read_dispatch.md)
