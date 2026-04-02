# 设备信息查询 API

## 简要描述

- 获取 Growatt 平台已授权设备的信息。
- 接口仅返回当前 token 有权限访问的设备查询结果；无权限设备会返回 `DEVICE_SN_DOES_NOT_HAVE_PERMISSION`。

## 请求 URL

- `/oauth2/getDeviceInfo`

## 请求方式

- `POST`
- `Content-Type: application/json`
- `Authorization: Bearer <token>`

## HTTP 头部参数及说明

| 参数名 | 必选 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `Authorization` | 是 | string | 密钥令牌 |

## HTTP Body 参数及说明

| 参数名 | 必选 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `deviceSn` | 是 | string | 设备唯一序列号（SN） |

## 接口返回参数和说明

| 参数名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `code` | int | 接口返回状态码，`0` 成功，其余失败 |
| `data` | obj | 数据返回 |
| `message` | string | 返回说明 |

## 请求示例

```json
{
    "deviceSn": "DEVICE_SN_1"
}
```

## 返回示例

```json
{
    "code": 0,
    "data": {
        "deviceSn": "DEVICE_SN_1",
        "deviceTypeName": "min",
        "model": "BDCBAT",
        "nominalPower": 6000,
        "datalogSn": "DATALOG_SN_1",
        "datalogDeviceTypeName": "ShineWiFi-X",
        "dtc": 5100,
        "communicationVersion": "ZABA-0021",
        "existBattery": true,
        "batterySn": "BATTERY_SN_1",
        "batteryModel": "ARK 5.12-25.6XH-A1",
        "batteryCapacity": 5000,
        "batteryNominalPower": 2500,
        "authFlag": true,
        "batteryList": [
            {
                "batterySn": "BATTERY_SN_1",
                "batteryModel": "ARK 5.12-25.6XH-A1",
                "batteryCapacity": 5000,
                "batteryNominalPower": 2500
            }
        ]
    },
    "message": "SUCCESSFUL_OPERATION"
}
```

```json
{
    "code": 2,
    "message": "TOKEN_IS_INVALID"
}
```

## `data` 参数说明

| 参数名 | 说明 |
| :--- | :--- |
| `deviceSn` | 设备序列号 |
| `deviceTypeName` | 设备大类型名称 |
| `model` | 设备型号 |
| `nominalPower` | 逆变器额定功率，单位 W |
| `datalogSn` | 采集器序列号 |
| `datalogDeviceTypeName` | 采集器类型名称 |
| `dtc` | 设备类型数字编码 |
| `communicationVersion` | 固件通讯版本 |
| `existBattery` | 是否有电池 |
| `batterySn` | 电池序列号 |
| `batteryModel` | 电池型号 |
| `batteryCapacity` | 电池额定容量，单位 Wh |
| `batteryNominalPower` | 电池额定功率，单位 W |
| `authFlag` | 是否已授权 |
| `batteryList` | 电池列表 |

## 相关文档

- [设备授权 API](./04_api_device_auth.md)
- [设备数据查询 API](./08_api_device_data.md)
