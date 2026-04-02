# 设备授权 API

本页整理 `getDeviceList`、`bindDevice`、`getDeviceListAuthed` 与 `unbindDevice` 四个接口。

## 1 获取可授权的设备列表

### 简要描述

- 获取 Growatt 终端用户账号下可授权给第三方平台的设备列表。
- 前提：终端用户已注册 Growatt 账号，并在账号下配网添加设备。
- 仅 `authorization_code` 模式下支持。

### 请求 URL

- `/oauth2/getDeviceList`

### 请求方式

- `POST`
- `Authorization: Bearer <token>`

### 请求示例

```json
// 无参数
```

### 返回参数说明

| 参数名 | 厂商表格类型 | 说明 |
| :--- | :--- | :--- |
| `code` | int | 接口返回状态码，`0` 成功，其余失败 |
| `data` | string | 厂商表格原文写作 `string`，实际示例为设备数组 |
| `message` | string | 返回说明 |

### 返回示例

```json
{
    "code": 0,
    "data": [
        {
            "deviceSn": "DEVICE_SN_1",
            "deviceTypeName": "sph-s",
            "model": "SPH 10000TL-HU (AU)",
            "nominalPower": 15000,
            "datalogSn": "DATALOG_SN_1",
            "dtc": 21300,
            "communicationVersion": "ZCEA-0005",
            "authFlag": true
        },
        {
            "deviceSn": "DEVICE_SN_2",
            "deviceTypeName": "min",
            "model": "MIN 5000TL-XH2",
            "nominalPower": 6000,
            "datalogSn": "DATALOG_SN_2",
            "dtc": 5100,
            "communicationVersion": "ZABA-0023",
            "authFlag": false
        }
    ],
    "message": "SUCCESSFUL_OPERATION"
}
```

```json
{
    "code": 2,
    "message": "TOKEN_IS_INVALID"
}
```

### `data` 字段说明

| 参数名 | 说明 |
| :--- | :--- |
| `deviceSn` | 设备序列号 |
| `deviceTypeName` | 设备大类型名称 |
| `model` | 设备型号 |
| `nominalPower` | 逆变器额定功率，单位 W |
| `datalogSn` | 采集器序列号 |
| `dtc` | 设备类型数字编码 |
| `communicationVersion` | 固件通讯版本 |
| `authFlag` | 是否已授权 |

## 2 授权设备

### 简要描述

- 授权 Growatt 终端用户下的设备给第三方。

### 请求 URL

- `/oauth2/bindDevice`

### 请求方式

- `POST`
- `Content-Type: application/json`
- `Authorization: Bearer <token>`

### 请求参数说明

| 参数名 | 类型 | 是否必传 | 说明 |
| :--- | :--- | :--- | :--- |
| `deviceSnList` | array | 是 | 非空，设备序列号及 `pinCode` 列表 |
| `deviceSnList[].deviceSn` | string | 是 | 设备序列号 |
| `deviceSnList[].pinCode` | string | 客户端模式下必填 | 设备 `PinCode` |

### 请求示例

#### 授权码模式

```json
{
    "deviceSnList": [
        {
            "deviceSn": "DEVICE_SN_1"
        },
        {
            "deviceSn": "DEVICE_SN_2"
        }
    ]
}
```

#### 客户端模式

```json
{
    "deviceSnList": [
        {
            "deviceSn": "DEVICE_SN_1",
            "pinCode": "PIN001"
        },
        {
            "deviceSn": "DEVICE_SN_2",
            "pinCode": "PIN002"
        }
    ]
}
```

### 返回参数说明

| 参数名 | 厂商表格类型 | 说明 |
| :--- | :--- | :--- |
| `code` | int | 接口返回状态码，`0` 成功，其余失败 |
| `data` | string | 厂商表格原文写作 `string`，成功示例为 `null`，部分失败示例为数组 |
| `message` | string | 返回说明 |

### 返回示例

```json
{
    "code": 0,
    "data": null,
    "message": "SUCCESSFUL_OPERATION"
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
    "code": 19,
    "message": "DEVICE_ID_ALREADY_EXISTS"
}
```

```json
{
    "code": 12,
    "data": [
        "DEVICE_SN_2"
    ],
    "message": "DEVICE_SN_DOES_NOT_HAVE_PERMISSION"
}
```

## 3 获取已授权的设备列表

### 简要描述

- 获取 Growatt 终端用户个人账号下已经授权的设备列表。
- 前提：终端用户已注册 Growatt 账号，并在账号下配网添加设备。

### 请求 URL

- `/oauth2/getDeviceListAuthed`

### 请求方式

- `POST`
- `Authorization: Bearer <token>`

### 请求示例

```json
// 无参数
```

### 返回参数说明

| 参数名 | 厂商表格类型 | 说明 |
| :--- | :--- | :--- |
| `code` | int | 接口返回状态码，`0` 成功，其余失败 |
| `data` | string | 厂商表格原文写作 `string`，实际示例为设备数组 |
| `message` | string | 返回说明 |

### 返回示例

```json
{
    "code": 0,
    "data": [
        {
            "deviceSn": "DEVICE_SN_1",
            "deviceTypeName": "sph-s",
            "model": "SPH 10000TL-HU (AU)",
            "nominalPower": 15000,
            "datalogSn": "DATALOG_SN_1",
            "dtc": 21300,
            "communicationVersion": "ZCEA-0005",
            "authFlag": true
        }
    ],
    "message": "SUCCESSFUL_OPERATION"
}
```

```json
{
    "code": 2,
    "message": "TOKEN_IS_INVALID"
}
```

## 4 解除授权设备

### 简要描述

- 将 Growatt 终端用户授权给第三方的下属设备解除授权。

### 请求 URL

- `/oauth2/unbindDevice`

### 请求方式

- `POST`
- `Content-Type: application/json`
- `Authorization: Bearer <token>`

### 请求参数说明

| 参数名 | 类型 | 是否必传 | 说明 |
| :--- | :--- | :--- | :--- |
| `deviceSnList` | array | 是 | Growatt 终端用户下属的设备序列号列表 |

### 请求示例

```json
{
    "deviceSnList": [
        "DEVICE_SN_1",
        "DEVICE_SN_2"
    ]
}
```

### 返回参数说明

| 参数名 | 厂商表格类型 | 说明 |
| :--- | :--- | :--- |
| `code` | int | 接口返回状态码，`0` 成功，其余失败 |
| `data` | string | 厂商表格原文写作 `string`，成功示例为 `null` |
| `message` | string | 返回说明 |

### 返回示例

```json
{
    "code": 0,
    "data": null,
    "message": "SUCCESSFUL_OPERATION"
}
```

```json
{
    "code": 2,
    "message": "TOKEN_IS_INVALID"
}
```

## 相关文档

- [身份认证说明](./01_authentication.md)
- [常见问题与排查 FAQ](./11_api_troubleshooting.md)
