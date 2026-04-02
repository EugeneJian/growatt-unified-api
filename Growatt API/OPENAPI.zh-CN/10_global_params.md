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

```json
{
    "code": 0,
    "data": {},
    "message": "SUCCESSFUL_OPERATION"
}
```

```json
{
    "code": 12,
    "data": [
        "DEVICE_SN_1"
    ],
    "message": "DEVICE_SN_DOES_NOT_HAVE_PERMISSION"
}
```

```json
{
    "code": 2,
    "message": "TOKEN_IS_INVALID"
}
```

```json
{
    "code": 5,
    "data": null,
    "message": "DEVICE_OFFLINE"
}
```

```json
{
    "code": 18,
    "data": null,
    "message": "READ_DEVICE_PARAM_FAIL"
}
```

```json
{
    "code": 16,
    "data": null,
    "message": "PARAMETER_SETTING_RESPONSE_TIMEOUT"
}
```

```json
{
    "code": 15,
    "data": null,
    "message": "PARAMETER_SETTING_DEVICE_NOT_RESPONDING"
}
```

```json
{
    "code": 6,
    "data": null,
    "message": "PARAMETER_SETTING_FAILED"
}
```

```json
{
    "code": 105,
    "data": null,
    "message": "TOO_MANY_REQUEST"
}
```

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
