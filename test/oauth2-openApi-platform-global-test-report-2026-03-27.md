# 全球平台 OAuth2 接口测试报告

## 与正式 API 文档的关系

- 正式 API 文档描述通用规范。
- 本报告仅记录 2026-03-27 在全球测试环境中的实测结果，用于说明环境联调现状，不替代正式 API 文档。

## 测试环境

| 项目 | 内容 |
| :--- | :--- |
| 后端地址 | `https://opencloud-test.growatt.com/prod-api` |
| 前端登录地址 | `https://opencloud-test.growatt.com/#/login?client_id=testcodemode&state=<randomstr>` |
| 测试方式 | 真实环境接口联调 |
| 认证方式 | OAuth2 授权码模式 |
| 测试工具 | PowerShell `Invoke-RestMethod` |
| 测试日期 | 2026-03-27 |
| 时区 | Asia/Shanghai (UTC+8) |
| 测试设备 | `WCK6584462` |

---

## 测试凭证

- `client_id=testcodemode`
- `client_secret=***`
- `username=0auth0`
- `password=G1234567890`
- 用户补充设备线索：`S/N=ZG00E820UH`

---

## 结果总览

| 接口 / 步骤 | 方法 | 路径 | 结果 |
| :--- | :--- | :--- | :--- |
| 前端登录页可达性 | GET | `/#/login?...` | 通过 |
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

---

## 关键结论

1. 全球测试环境的授权码模式链路已整体跑通，`/login -> /auth -> /oauth2/token -> /oauth2/getDeviceList -> /oauth2/bindDevice -> /oauth2/getDeviceListAuthed -> /oauth2/getDeviceInfo -> /oauth2/getDeviceData -> /oauth2/refresh -> /oauth2/unbindDevice` 都成功。
2. 当前账号下返回的真实候选设备为 `deviceSn=WCK6584462`，对应 `datalogSn=ZGQ0E820UH`。
3. 用户提供的 `ZG00E820UH` 与实测返回的 `ZGQ0E820UH` 很接近，但并不完全一致；这条线索更像 `datalogSn`，不是接口调用时使用的 `deviceSn`。
4. 在全球环境的授权码模式下，`bindDevice` 对这台设备使用字符串数组会返回 `SYSTEM_ERROR`，但改成对象数组且不带 `pinCode` 后成功。
5. 本轮测试结束后已执行 `unbindDevice`，并延迟复查确认该设备已从已授权列表中移除。

---

## 详细用例

### 1. 前端登录页

- 访问 `https://opencloud-test.growatt.com/#/login?client_id=testcodemode&state=codexglobal0327` 返回 HTTP `200`。
- 页面最终 URL 保持在同一登录地址。

### 2. 用户登录 `/login`

请求体形态：

```json
{
  "username": "0auth0",
  "password": "<md5_of_password>",
  "clientId": "testcodemode"
}
```

结果：

- `code=200`
- 返回 `redirectUri=https://opencloud-test.growatt.com/prod-api/testToken/testToken1`
- 返回临时登录 token，用于后续 `/auth`

结论：

- 全球前端登录链路仍可接受 MD5 后的密码值

### 3. 获取授权码 `/auth`

请求形态：

```text
GET /auth?response_type=code&client_id=testcodemode&redirect_uri=https://opencloud-test.growatt.com/prod-api/testToken/testToken1&scope=scope&state=codexglobal0327-obj
Authorization: Bearer ***
```

结果：

- `code=200`
- 成功返回授权码

### 4. 获取 Token `/oauth2/token`

结果摘录：

```json
{
  "access_token": "***",
  "refresh_token": "***",
  "token_type": "Bearer",
  "expires_in": 604379,
  "refresh_expires_in": 2591347
}
```

### 5. 获取候选设备列表 `/oauth2/getDeviceList`

响应摘录：

```json
{
  "code": 0,
  "data": [
    {
      "deviceSn": "WCK6584462",
      "deviceTypeName": "sph",
      "model": "SPH 6000TL BL-UP",
      "nominalPower": 6000,
      "datalogSn": "ZGQ0E820UH",
      "dtc": 3502,
      "communicationVersion": "ZCBC-0009",
      "authFlag": false
    }
  ],
  "message": "SUCCESSFUL_OPERATION"
}
```

结论：

- 当前账号在全球环境下可以看到 1 台候选设备
- 接口真正返回的可绑定设备标识是 `deviceSn=WCK6584462`
- 用户提供的 S/N 更接近 `datalogSn`，且实测返回值为 `ZGQ0E820UH`

### 6. 绑定设备 `/oauth2/bindDevice`

先试字符串数组：

```json
{
  "deviceSnList": [
    "WCK6584462"
  ]
}
```

返回：

```json
{
  "code": 1,
  "data": null,
  "message": "SYSTEM_ERROR"
}
```

再试对象数组且不带 `pinCode`：

```json
{
  "deviceSnList": [
    {
      "deviceSn": "WCK6584462"
    }
  ]
}
```

返回：

```json
{
  "code": 0,
  "data": 1,
  "message": "SUCCESSFUL_OPERATION"
}
```

结论：

- 当前全球环境的授权码模式下，这台设备需要使用对象数组格式绑定
- 这次成功绑定时不需要 `pinCode`

### 7. 获取已授权设备列表 `/oauth2/getDeviceListAuthed`

响应摘录：

```json
{
  "code": 0,
  "data": [
    {
      "deviceSn": "WCK6584462",
      "deviceTypeName": "sph",
      "model": "SPH 6000TL BL-UP",
      "nominalPower": 6000,
      "datalogSn": "ZGQ0E820UH",
      "dtc": 3502,
      "communicationVersion": "ZCBC-0009",
      "authFlag": true
    }
  ],
  "message": "SUCCESSFUL_OPERATION"
}
```

### 8. 获取设备信息 `/oauth2/getDeviceInfo`

响应摘录：

```json
{
  "code": 0,
  "data": {
    "deviceSn": "WCK6584462",
    "deviceTypeName": "sph",
    "model": "SPH 6000TL BL-UP",
    "nominalPower": 6000,
    "datalogSn": "ZGQ0E820UH",
    "datalogDeviceTypeName": "ShineWiLan-X2",
    "existBattery": true,
    "batterySn": "SK01234567890000",
    "batteryCapacity": 14400,
    "batteryNominalPower": 4000,
    "authFlag": true
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

### 9. 获取设备数据 `/oauth2/getDeviceData`

响应摘录：

```json
{
  "code": 0,
  "data": {
    "utcTime": "2026-03-27 07:13:48",
    "ppv": 0.0,
    "payLoadPower": 0.0,
    "batPower": 0.0,
    "status": 6
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

### 10. 刷新 Token `/oauth2/refresh`

结果摘录：

```json
{
  "access_token": "***",
  "refresh_token": "***",
  "token_type": "Bearer",
  "expires_in": 604800,
  "refresh_expires_in": 2591999
}
```

结果：通过

### 11. 解绑设备 `/oauth2/unbindDevice`

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

这轮全球环境授权码模式联调已经完整跑通，并确认了一个重要环境行为差异：

- 真实候选设备为 `WCK6584462`
- 其 `datalogSn=ZGQ0E820UH`
- 授权码模式下，字符串数组绑定失败
- 改为对象数组 `{"deviceSnList":[{"deviceSn":"WCK6584462"}]}` 后绑定成功
- 成功后 `getDeviceInfo`、`getDeviceData`、`refresh`、`unbindDevice` 都可正常工作

因此，当前全球测试环境对这台设备的授权码模式绑定请求，建议按对象数组格式处理。
