# 澳洲平台 OAuth2 接口测试报告

## 与正式 API 文档的关系

- 正式 API 文档描述通用规范。
- 本报告只记录 2026-03-26 在澳洲测试环境 observed in AU test environment 的结果。
- 本报告用于说明 environment-specific behavior，不替代正式 API 文档。

## 测试环境

| 项目 | 内容 |
| :--- | :--- |
| 测试地址 | `https://opencloud-test-au.growatt.com/prod-api` |
| 前端登录地址 | `https://opencloud-test-au.growatt.com/#/login?client_id=testcodemode&state=<randomstr>` |
| 测试方式 | 真实环境接口联调 |
| 认证方式 | OAuth2 授权码模式 + 客户端模式 |
| 测试工具 | `curl` |
| 测试日期 | 2026-03-26 |
| 时区 | Asia/Shanghai (UTC+8) |
| 测试设备 | `WUP0N3500C` |

---

## 测试凭证

### 授权码模式

- `client_id=testcodemode`
- `client_secret=***`
- `username=0auth0`
- `password=G1234567890`
- 前端实际行为：登录前先对密码做 MD5

### 客户端模式

- `client_id=testclientmode`
- `client_secret=***`
- `pinCode=GROWATT147258369`

---

## 结果总览

### 授权码模式

| 接口 | 方法 | 路径 | 结果 |
| :--- | :--- | :--- | :--- |
| 用户登录 | POST | `/login` | 通过 |
| 获取授权码 | GET | `/auth` | 通过 |
| 获取 Token | POST | `/oauth2/token` | 通过 |
| 获取候选设备列表 | POST | `/oauth2/getDeviceList` | 通过 |
| 绑定设备 | POST | `/oauth2/bindDevice` | 通过 |
| 获取已授权设备列表 | POST | `/oauth2/getDeviceListAuthed` | 通过 |
| 获取设备信息 | POST | `/oauth2/getDeviceInfo` | 通过 |
| 获取设备数据 | POST | `/oauth2/getDeviceData` | 通过 |
| 刷新 Token | POST | `/oauth2/refresh` | 通过 |
| 解绑设备 | POST | `/oauth2/unbindDevice` | 通过 |

### 客户端模式

| 接口 | 方法 | 路径 | 结果 |
| :--- | :--- | :--- | :--- |
| 获取 Token | POST | `/oauth2/token` | 通过 |
| 携带 `redirect_uri` 获取 Token | POST | `/oauth2/token` | 通过 |
| 获取候选设备列表 | POST | `/oauth2/getDeviceList` | 通过，返回 `WRONG_GRANT_TYPE` |
| 绑定设备 | POST | `/oauth2/bindDevice` | 通过 |
| 获取已授权设备列表 | POST | `/oauth2/getDeviceListAuthed` | 通过 |
| 获取设备信息 | POST | `/oauth2/getDeviceInfo` | 通过 |
| 获取设备数据 | POST | `/oauth2/getDeviceData` | 通过 |
| 解绑设备 | POST | `/oauth2/unbindDevice` | 通过 |

---

## 关键结论

1. 澳洲前端登录页仍然会先做 MD5，再调用 `POST /login`。
2. 授权码模式下，`POST /oauth2/getDeviceList` 返回的候选设备为 `WUP0N3500C`。
3. 授权码模式下，如果 `bindDevice` 只传字符串数组，会返回 `SYSTEM_ERROR`；改为对象数组并携带 `pinCode` 后成功。
4. 客户端模式下，`POST /oauth2/getDeviceList` 返回文档预期的 `WRONG_GRANT_TYPE`（`code=103`）。
5. 客户端模式下，绑定前签发的 token 在绑定成功后不能立刻读取设备，重新获取 fresh token 后读取成功。
6. 两种模式都在测试后执行了 `unbindDevice`，并在延迟复查后确认已授权列表恢复为空。

---

## 详细用例

### 一、授权码模式

#### 1. 用户登录

澳洲前端实际提交的请求体：

```json
{
  "username": "0auth0",
  "password": "77700905e5c9c02216f6c6352dfbb698",
  "clientId": "testcodemode"
}
```

响应：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "redirectUri": "https://opencloud-test-au.growatt.com/prod-api/testToken/testToken1",
    "country": "Australia",
    "clientId": "testcodemode",
    "clientCompany": "testcodemode",
    "id": "2919237",
    "state": null,
    "token": "***",
    "username": "0auth0"
  }
}
```

结果：通过

#### 2. 获取授权码

请求：

```text
GET /auth?response_type=code&client_id=testcodemode&redirect_uri=https://opencloud-test-au.growatt.com/prod-api/testToken/testToken1&scope=scope&state=codextest123
Authorization: Bearer ***
```

响应：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "redirect_uri": "https://opencloud-test-au.growatt.com/prod-api/testToken/testToken1",
    "state": "codextest123",
    "client_id": "testcodemode",
    "auth_code": "***"
  }
}
```

结果：通过

#### 3. 获取 Token

响应：

```json
{
  "access_token": "***",
  "refresh_token": "***",
  "refresh_expires_in": 2563291,
  "token_type": "Bearer",
  "expires_in": 576091
}
```

结果：通过

#### 4. 获取候选设备列表

响应：

```json
{
  "code": 0,
  "data": [
    {
      "deviceSn": "WUP0N3500C",
      "deviceTypeName": "sph",
      "model": "SPH 6000TL-HUB",
      "nominalPower": 6000,
      "datalogSn": "JKN0DY60DP",
      "dtc": 3504,
      "communicationVersion": "ZCBD-0004",
      "authFlag": false
    }
  ],
  "message": "SUCCESSFUL_OPERATION"
}
```

结果：通过

#### 5. 绑定设备

观察到的行为：

- 请求体 `{"deviceSnList":["WUP0N3500C"]}` 返回：

```json
{
  "code": 1,
  "data": null,
  "message": "SYSTEM_ERROR"
}
```

- 改为携带 `pinCode` 的对象数组后成功：

```json
{
  "code": 0,
  "data": 1,
  "message": "SUCCESSFUL_OPERATION"
}
```

结论：最终通过，但当前澳洲环境下，这台测试设备在授权码模式也需要按对象数组并携带 `pinCode` 绑定。

#### 6. 获取已授权设备列表

响应：

```json
{
  "code": 0,
  "data": [
    {
      "deviceSn": "WUP0N3500C",
      "deviceTypeName": "sph",
      "model": "SPH 6000TL-HUB",
      "nominalPower": 6000,
      "datalogSn": "JKN0DY60DP",
      "dtc": 3504,
      "communicationVersion": "ZCBD-0004",
      "authFlag": true
    }
  ],
  "message": "SUCCESSFUL_OPERATION"
}
```

结果：通过

#### 7. 获取设备信息

响应摘录：

```json
{
  "code": 0,
  "data": {
    "deviceSn": "WUP0N3500C",
    "deviceTypeName": "sph",
    "model": "SPH 6000TL-HUB",
    "nominalPower": 6000,
    "datalogSn": "JKN0DY60DP",
    "datalogDeviceTypeName": "ShineWiLan-X2",
    "existBattery": true,
    "batteryCapacity": 9000,
    "authFlag": true
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

结果：通过

#### 8. 获取设备数据

响应摘录：

```json
{
  "code": 0,
  "data": {
    "utcTime": "2026-03-26 11:16:36",
    "ppv": 790.0,
    "payLoadPower": 324.3,
    "batPower": -1800.0,
    "status": 5,
    "batteryList": [
      {
        "soc": 56
      }
    ]
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

结果：通过

#### 9. 刷新 Token

响应：

```json
{
  "access_token": "***",
  "refresh_token": "***",
  "refresh_expires_in": 2591999,
  "token_type": "Bearer",
  "expires_in": 604800
}
```

结果：通过

#### 10. 解绑设备

即时响应：

```json
{
  "code": 0,
  "data": null,
  "message": "SUCCESSFUL_OPERATION"
}
```

延迟约 5 秒后复查 `getDeviceListAuthed`：

```json
{
  "code": 0,
  "data": [],
  "message": "SUCCESSFUL_OPERATION"
}
```

结果：通过

---

### 二、客户端模式

#### 1. 获取 Token

响应：

```json
{
  "access_token": "***",
  "token_type": "Bearer",
  "expires_in": 604800
}
```

结果：通过

#### 2. 获取候选设备列表

响应：

```json
{
  "code": 103,
  "data": null,
  "message": "WRONG_GRANT_TYPE"
}
```

结果：通过，且符合预期

#### 3. 绑定设备

请求体：

```json
{
  "deviceSnList": [
    {
      "deviceSn": "WUP0N3500C",
      "pinCode": "GROWATT147258369"
    }
  ]
}
```

响应：

```json
{
  "code": 0,
  "data": 1,
  "message": "SUCCESSFUL_OPERATION"
}
```

结果：通过

#### 4. 获取已授权设备列表

响应：

```json
{
  "code": 0,
  "data": [
    {
      "deviceSn": "WUP0N3500C",
      "deviceTypeName": "sph",
      "model": "SPH 6000TL-HUB",
      "nominalPower": 6000,
      "datalogSn": "JKN0DY60DP",
      "dtc": 3504,
      "communicationVersion": "ZCBD-0004",
      "authFlag": true
    }
  ],
  "message": "SUCCESSFUL_OPERATION"
}
```

结果：通过

#### 5. 获取设备信息 / 获取设备数据

绑定前签发的旧 token 在绑定成功后立刻读取，返回：

```json
{
  "code": 12,
  "data": null,
  "message": "DEVICE_SN_DOES_NOT_HAVE_PERMISSION"
}
```

重新获取 fresh token 后，两个读取接口都成功。

`getDeviceInfo` 响应摘录：

```json
{
  "code": 0,
  "data": {
    "deviceSn": "WUP0N3500C",
    "model": "SPH 6000TL-HUB",
    "batteryCapacity": 9000,
    "authFlag": true
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

`getDeviceData` 响应摘录：

```json
{
  "code": 0,
  "data": {
    "utcTime": "2026-03-26 11:19:16",
    "ppv": 790.0,
    "payLoadPower": 324.4,
    "batPower": -1800.0,
    "status": 5,
    "batteryList": [
      {
        "soc": 55
      }
    ]
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

结论：最终通过，但澳洲环境当前要求在绑定成功后重新获取 token，再读取设备接口。

#### 6. 解绑设备

即时响应：

```json
{
  "code": 0,
  "data": null,
  "message": "SUCCESSFUL_OPERATION"
}
```

延迟约 5 秒后复查 `getDeviceListAuthed`：

```json
{
  "code": 0,
  "data": [],
  "message": "SUCCESSFUL_OPERATION"
}
```

结果：通过

---

## 最终结论

1. 澳洲测试环境可正常访问，授权码模式和客户端模式均可整体跑通。
2. 测试设备 `WUP0N3500C` 在两种模式下都可以成功读取设备信息和遥测数据。
3. 当前澳洲环境存在两个需要记录的集成差异：
   - 授权码模式下，这台设备绑定时需要携带 `pinCode`。
   - 客户端模式下，`bindDevice` 成功后需要重新获取 fresh token，旧 token 无法立刻读取设备。
4. 本次联调结束后，两种模式均已执行解绑并复查为空，环境已恢复到测试前状态。
