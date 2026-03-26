# 澳洲平台 OAuth2 接口测试报告 | AU oauth2-openApi Platform Test Report

## 测试环境 | Test Environment

| 项目 | Item | 内容 | Content |
| :--- | :--- | :--- | :--- |
| 测试地址 | Test Address | `https://opencloud-test-au.growatt.com/prod-api` | [https://opencloud-test-au.growatt.com/prod-api](https://opencloud-test-au.growatt.com/prod-api) |
| 前端登录地址 | Frontend Login Address | `https://opencloud-test-au.growatt.com/#/login?client_id=testcodemode&state=<randomstr>` | [Login URL](https://opencloud-test-au.growatt.com/#/login?client_id=testcodemode&state=%3Crandomstr%3E) |
| 测试方式 | Test Method | 真实环境接口联调 | Live API interface test |
| 认证方式 | Authentication | OAuth2 授权码模式 + 客户端模式 | OAuth2 authorization-code mode + client-credentials mode |
| 测试工具 | Test Tool | `curl` | `curl` |
| 测试日期 | Test Date | 2026-03-26 | 2026-03-26 |
| 时区 | Time Zone | Asia/Shanghai (UTC+8) | Asia/Shanghai (UTC+8) |
| 测试设备 | Test Device | `WUP0N3500C` | `WUP0N3500C` |

---

## 测试凭证 | Credentials Used

### 授权码模式 | Authorization Code Mode

- `client_id=testcodemode`
- `client_secret=***`
- `username=0auth0`
- `password=G1234567890`
- 前端实际行为：登录前先对密码做 MD5
  Frontend behavior confirmed: the password is MD5-hashed before `POST /login`.

### 客户端模式 | Client Credentials Mode

- `client_id=testclientmode`
- `client_secret=***`
- `pinCode=GROWATT147258369`

---

## 结果总览 | Test Results Summary

### 授权码模式 | Authorization Code Mode

| 接口 | API | 方法 | Method | 路径 | Path | 结果 | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 用户登录 | User Login | POST | POST | `/login` | `/login` | 通过 | PASS |
| 获取授权码 | Get Auth Code | GET | GET | `/auth` | `/auth` | 通过 | PASS |
| 获取 Token | Get Token | POST | POST | `/oauth2/token` | `/oauth2/token` | 通过 | PASS |
| 获取候选设备列表 | Get Available Device List | POST | POST | `/oauth2/getDeviceList` | `/oauth2/getDeviceList` | 通过 | PASS |
| 绑定设备 | Bind Device | POST | POST | `/oauth2/bindDevice` | `/oauth2/bindDevice` | 通过 | PASS |
| 获取已授权设备列表 | Get Authorized Device List | POST | POST | `/oauth2/getDeviceListAuthed` | `/oauth2/getDeviceListAuthed` | 通过 | PASS |
| 获取设备信息 | Get Device Info | POST | POST | `/oauth2/getDeviceInfo` | `/oauth2/getDeviceInfo` | 通过 | PASS |
| 获取设备数据 | Get Device Data | POST | POST | `/oauth2/getDeviceData` | `/oauth2/getDeviceData` | 通过 | PASS |
| 刷新 Token | Refresh Token | POST | POST | `/oauth2/refresh` | `/oauth2/refresh` | 通过 | PASS |
| 解绑设备 | Unbind Device | POST | POST | `/oauth2/unbindDevice` | `/oauth2/unbindDevice` | 通过 | PASS |

### 客户端模式 | Client Credentials Mode

| 接口 | API | 方法 | Method | 路径 | Path | 结果 | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 获取 Token | Get Token | POST | POST | `/oauth2/token` | `/oauth2/token` | 通过 | PASS |
| 携带 `redirect_uri` 获取 Token | Get Token with `redirect_uri` | POST | POST | `/oauth2/token` | `/oauth2/token` | 通过 | PASS |
| 获取候选设备列表 | Get Available Device List | POST | POST | `/oauth2/getDeviceList` | `/oauth2/getDeviceList` | 通过，返回 `WRONG_GRANT_TYPE` | PASS with expected `WRONG_GRANT_TYPE` |
| 绑定设备 | Bind Device | POST | POST | `/oauth2/bindDevice` | `/oauth2/bindDevice` | 通过 | PASS |
| 获取已授权设备列表 | Get Authorized Device List | POST | POST | `/oauth2/getDeviceListAuthed` | `/oauth2/getDeviceListAuthed` | 通过 | PASS |
| 获取设备信息 | Get Device Info | POST | POST | `/oauth2/getDeviceInfo` | `/oauth2/getDeviceInfo` | 通过 | PASS |
| 获取设备数据 | Get Device Data | POST | POST | `/oauth2/getDeviceData` | `/oauth2/getDeviceData` | 通过 | PASS |
| 解绑设备 | Unbind Device | POST | POST | `/oauth2/unbindDevice` | `/oauth2/unbindDevice` | 通过 | PASS |

---

## 关键结论 | Key Findings

1. 澳洲前端登录页仍然会先做 MD5，再调用 `POST /login`。
   The Australia frontend still MD5-hashes the password before calling `POST /login`.
2. 授权码模式下，`POST /oauth2/getDeviceList` 返回的候选设备为 `WUP0N3500C`。
   In authorization-code mode, `POST /oauth2/getDeviceList` returned one candidate device: `WUP0N3500C`.
3. 授权码模式下，如果 `bindDevice` 只传字符串数组，会返回 `SYSTEM_ERROR`；改为对象数组并携带 `pinCode` 后成功。
   In authorization-code mode, binding with a plain string array returned `SYSTEM_ERROR`; binding succeeded when retried with object form plus `pinCode`.
4. 客户端模式下，`POST /oauth2/getDeviceList` 返回文档预期的 `WRONG_GRANT_TYPE`（`code=103`）。
   In client-credentials mode, `POST /oauth2/getDeviceList` returned the documented `WRONG_GRANT_TYPE` (`code=103`).
5. 客户端模式下，绑定前签发的 token 在绑定成功后不能立刻读取设备，重新获取 fresh token 后读取成功。
   In client-credentials mode, a token issued before `bindDevice` could not immediately read the device after bind; a freshly issued token after bind worked.
6. 两种模式都在测试后执行了 `unbindDevice`，并在延迟复查后确认已授权列表恢复为空。
   In both modes, cleanup was verified by calling `unbindDevice` and rechecking that the authorized-device list returned to empty.

---

## 详细用例 | Detailed Test Cases

### 一、授权码模式 | 1. Authorization Code Mode

#### 1. 用户登录 | User Login

澳洲前端实际提交的请求体：
Actual request body accepted by the AU frontend flow:

```json
{
  "username": "0auth0",
  "password": "77700905e5c9c02216f6c6352dfbb698",
  "clientId": "testcodemode"
}
```

响应：
Response:

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
Result: PASS

#### 2. 获取授权码 | Get Auth Code

请求：
Request:

```text
GET /auth?response_type=code&client_id=testcodemode&redirect_uri=https://opencloud-test-au.growatt.com/prod-api/testToken/testToken1&scope=scope&state=codextest123
Authorization: Bearer ***
```

响应：
Response:

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
Result: PASS

#### 3. 获取 Token | Get Token

响应：
Response:

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
Result: PASS

#### 4. 获取候选设备列表 | Get Available Device List

响应：
Response:

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
Result: PASS

#### 5. 绑定设备 | Bind Device

观察到的行为：
Observed behavior:

- 请求体 `{"deviceSnList":["WUP0N3500C"]}` 返回：
  Request body `{"deviceSnList":["WUP0N3500C"]}` returned:

```json
{
  "code": 1,
  "data": null,
  "message": "SYSTEM_ERROR"
}
```

- 改为携带 `pinCode` 的对象数组后成功：
  Retrying with object form plus `pinCode` succeeded:

```json
{
  "code": 0,
  "data": 1,
  "message": "SUCCESSFUL_OPERATION"
}
```

结论：最终通过，但当前澳洲环境下，这台测试设备在授权码模式也需要按对象数组并携带 `pinCode` 绑定。
Conclusion: final result is PASS, but in the current AU environment this device must be bound with object-array format plus `pinCode` even in authorization-code mode.

#### 6. 获取已授权设备列表 | Get Authorized Device List

响应：
Response:

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
Result: PASS

#### 7. 获取设备信息 | Get Device Info

响应摘录：
Response excerpt:

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
Result: PASS

#### 8. 获取设备数据 | Get Device Data

响应摘录：
Response excerpt:

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
Result: PASS

#### 9. 刷新 Token | Refresh Token

响应：
Response:

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
Result: PASS

#### 10. 解绑设备 | Unbind Device

即时响应：
Immediate response:

```json
{
  "code": 0,
  "data": null,
  "message": "SUCCESSFUL_OPERATION"
}
```

延迟约 5 秒后复查 `getDeviceListAuthed`：
Delayed recheck of `getDeviceListAuthed` after about 5 seconds:

```json
{
  "code": 0,
  "data": [],
  "message": "SUCCESSFUL_OPERATION"
}
```

结果：通过
Result: PASS

---

### 二、客户端模式 | 2. Client Credentials Mode

#### 1. 获取 Token | Get Token

响应：
Response:

```json
{
  "access_token": "***",
  "token_type": "Bearer",
  "expires_in": 604800
}
```

结果：通过
Result: PASS

#### 2. 获取候选设备列表 | Get Available Device List

响应：
Response:

```json
{
  "code": 103,
  "data": null,
  "message": "WRONG_GRANT_TYPE"
}
```

结果：通过，且符合预期
Result: PASS, expected behavior

#### 3. 绑定设备 | Bind Device

请求体：
Request body:

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
Response:

```json
{
  "code": 0,
  "data": 1,
  "message": "SUCCESSFUL_OPERATION"
}
```

结果：通过
Result: PASS

#### 4. 获取已授权设备列表 | Get Authorized Device List

响应：
Response:

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
Result: PASS

#### 5. 获取设备信息 / 获取设备数据 | Get Device Info / Get Device Data

绑定前签发的旧 token 在绑定成功后立刻读取，返回：
With the token issued before bind, immediate reads after a successful bind returned:

```json
{
  "code": 12,
  "data": null,
  "message": "DEVICE_SN_DOES_NOT_HAVE_PERMISSION"
}
```

重新获取 fresh token 后，两个读取接口都成功。
After fetching a fresh client token, both read APIs succeeded.

`getDeviceInfo` 响应摘录：
`getDeviceInfo` response excerpt:

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
`getDeviceData` response excerpt:

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
Conclusion: final result is PASS, but the current AU environment requires a fresh token after bind before device read APIs gain permission.

#### 6. 解绑设备 | Unbind Device

即时响应：
Immediate response:

```json
{
  "code": 0,
  "data": null,
  "message": "SUCCESSFUL_OPERATION"
}
```

延迟约 5 秒后复查 `getDeviceListAuthed`：
Delayed recheck of `getDeviceListAuthed` after about 5 seconds:

```json
{
  "code": 0,
  "data": [],
  "message": "SUCCESSFUL_OPERATION"
}
```

结果：通过
Result: PASS

---

## 最终结论 | Final Conclusion

1. 澳洲测试环境可正常访问，授权码模式和客户端模式均可整体跑通。
   The Australia test environment is reachable, and both OAuth2 modes can be completed end to end.
2. 测试设备 `WUP0N3500C` 在两种模式下都可以成功读取设备信息和遥测数据。
   The test device `WUP0N3500C` can be read successfully in both modes.
3. 当前澳洲环境存在两个需要记录的集成差异：
   The current AU environment has two integration nuances that should be documented:
   - 授权码模式下，这台设备绑定时需要携带 `pinCode`。
     In authorization-code mode, this device currently requires `pinCode` during bind.
   - 客户端模式下，`bindDevice` 成功后需要重新获取 fresh token，旧 token 无法立刻读取设备。
     In client-credentials mode, a fresh token is required after `bindDevice`; the pre-bind token cannot immediately read the device.
4. 本次联调结束后，两种模式均已执行解绑并复查为空，环境已恢复到测试前状态。
   After testing, cleanup was verified in both modes: the device was unbound and the authorized-device list returned to empty.
