# 全球平台 OAuth2 接口测试报告

## 与正式 API 文档的关系

- 正式 API 文档定义通用协议与推荐请求形态。
- 本报告仅记录 2026-03-27 在全球测试环境中的实测结果。
- 本轮按照最新正式文档执行：`bindDevice` 主流程只使用对象数组请求体，不再把字符串数组作为主测试路径。

## 测试环境

| 项目 | 内容 |
| :--- | :--- |
| 后端地址 | `https://opencloud-test.growatt.com/prod-api` |
| 前端登录地址 | `https://opencloud-test.growatt.com/#/login?client_id=testcodemode&state=<randomstr>` |
| 测试方式 | 真实环境接口联调 |
| 认证方式 | OAuth2 授权码模式 |
| 测试工具 | PowerShell `Invoke-WebRequest` / `Invoke-RestMethod` |
| 测试日期 | 2026-03-27 |
| 时区 | Asia/Shanghai (UTC+8) |
| 本轮主测设备 | `WCK6584462` |

---

## 测试凭证

- `client_id=testcodemode`
- `client_secret=***`
- `username=0auth0`
- `password=G1234567890`
- 用户补充线索：`S/N=ZG00E820UH`

---

## 结果总览

| 接口 / 步骤 | 方法 | 路径 | 结果 |
| :--- | :--- | :--- | :--- |
| 前端登录页可达 | GET | `/#/login?...` | 通过 |
| 用户登录 | POST | `/prod-api/login` | 通过 |
| 获取授权码 | GET | `/prod-api/auth` | 通过 |
| 获取 Token | POST | `/oauth2/token` | 通过 |
| 获取候选设备列表 | POST | `/oauth2/getDeviceList` | 通过 |
| 预清理旧授权关系 | POST | `/oauth2/unbindDevice` | 通过 |
| 按最新文档绑定设备 | POST | `/oauth2/bindDevice` | 通过 |
| 获取已授权设备列表 | POST | `/oauth2/getDeviceListAuthed` | 通过 |
| 获取设备信息 | POST | `/oauth2/getDeviceInfo` | 通过 |
| 获取设备数据 | POST | `/oauth2/getDeviceData` | 通过 |
| 刷新 Token | POST | `/oauth2/refresh` | 通过 |
| 刷新后旧 Token 复查 | POST | `/oauth2/getDeviceListAuthed` | 返回预期环境错误 `TOKEN_IS_INVALID` |
| 使用 fresh token 复查 | POST | `/oauth2/getDeviceListAuthed` | 通过 |
| 使用 fresh token 解绑 | POST | `/oauth2/unbindDevice` | 通过 |
| 最终复查已授权列表 | POST | `/oauth2/getDeviceListAuthed` | 通过，返回空数组 |

---

## 关键结论

1. 2026-03-27 这轮全球环境联调确认，真实可用的登录与授权码入口是 `POST /prod-api/login` 与 `GET /prod-api/auth`，不是根路径 `/login`、`/auth`。
2. 全球前端登录链路仍接受 MD5 后的密码值；本轮实际发送的密码摘要为 `77700905e5c9c02216f6c6352dfbb698`。
3. `getDeviceList` 返回的真实可绑定设备为 `deviceSn=WCK6584462`，对应 `datalogSn=ZGQ0E820UH`。用户提供的 `ZG00E820UH` 更接近采集器号而不是设备绑定时使用的 `deviceSn`。
4. 按最新正式文档的对象数组写法 `{"deviceSnList":[{"deviceSn":"WCK6584462"}]}`，`bindDevice` 在全球环境可直接成功，且本轮对这台设备不需要 `pinCode`。
5. 本轮开始前检测到上一次未清理干净的授权关系，因此先执行了一次预清理 `unbindDevice`，确认已授权列表为空后再重新绑定。
6. 这次重跑新增确认了一个全球环境行为：`/oauth2/refresh` 成功后，刷新前的旧 access token 会立即返回 `TOKEN_IS_INVALID`；后续读取与解绑必须切换到 fresh token。
7. 本轮测试结束后已使用 fresh token 成功解绑，并延迟复查确认已授权列表恢复为空。

---

## 详细用例

### 1. 前端登录页

- 访问 `https://opencloud-test.growatt.com/#/login?client_id=testcodemode&state=codexglobal20260327165812` 可正常返回 HTTP `200`。
- 这一步仅用于确认全球环境前端入口可达。

### 2. 用户登录 `/prod-api/login`

请求体：

```json
{
  "username": "0auth0",
  "password": "77700905e5c9c02216f6c6352dfbb698",
  "clientId": "testcodemode"
}
```

响应摘录：

```json
{
  "code": 200,
  "data": {
    "redirectUri": "https://opencloud-test.growatt.com/prod-api/testToken/testToken1",
    "country": "Singapore",
    "clientId": "testcodemode",
    "token": "***",
    "username": "0auth0"
  }
}
```

结果：通过

### 3. 获取授权码 `/prod-api/auth`

请求形态：

```text
GET /prod-api/auth?response_type=code&client_id=testcodemode&redirect_uri=https://opencloud-test.growatt.com/prod-api/testToken/testToken1&scope=scope&state=codexglobal20260327165812
Authorization: Bearer ***
```

响应摘录：

```json
{
  "code": 200,
  "data": {
    "redirect_uri": "https://opencloud-test.growatt.com/prod-api/testToken/testToken1",
    "state": "codexglobal20260327165812",
    "client_id": "testcodemode",
    "auth_code": "***"
  }
}
```

结果：通过

### 4. 获取 Token `/oauth2/token`

响应摘录：

```json
{
  "access_token": "***",
  "refresh_token": "***",
  "token_type": "Bearer",
  "expires_in": 604733,
  "refresh_expires_in": 2585309
}
```

结果：通过

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
      "authFlag": true
    }
  ],
  "message": "SUCCESSFUL_OPERATION"
}
```

结论：

- 当前账号在全球环境下可看到 1 台候选设备。
- 实际用于设备级接口的绑定目标是 `deviceSn=WCK6584462`。
- `authFlag=true` 说明该设备在本轮开始前仍残留授权关系，需要先清理。

### 6. 预清理旧授权关系

由于上一次联调在 `refresh` 后使用了旧 token 清理，导致设备仍残留在平台授权关系中。本轮先使用当前有效 token 执行一次预清理：

```json
{
  "deviceSnList": [
    "WCK6584462"
  ]
}
```

响应：

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

结果：通过，主流程从干净状态重新开始。

### 7. 按最新文档绑定设备 `/oauth2/bindDevice`

本轮仅按最新正式文档的对象数组写法测试：

```json
{
  "deviceSnList": [
    {
      "deviceSn": "WCK6584462"
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

结论：

- 全球环境下，这台设备按对象数组即可绑定成功。
- 本轮未要求 `pinCode`。

### 8. 获取已授权设备列表 `/oauth2/getDeviceListAuthed`

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

结果：通过

### 9. 获取设备信息 `/oauth2/getDeviceInfo`

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
    "batteryCapacity": 14400,
    "batteryNominalPower": 4000,
    "authFlag": true
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

结果：通过

### 10. 获取设备数据 `/oauth2/getDeviceData`

响应摘录：

```json
{
  "code": 0,
  "data": {
    "utcTime": "2026-03-27 08:58:18",
    "ppv": 0.0,
    "payLoadPower": 0.0,
    "batPower": 0.0,
    "status": 6
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

结果：通过

### 11. 刷新 Token `/oauth2/refresh`

响应摘录：

```json
{
  "access_token": "***",
  "refresh_token": "***",
  "token_type": "Bearer",
  "expires_in": 604800,
  "refresh_expires_in": 2592000
}
```

结果：通过

### 12. 刷新后旧 token 与 fresh token 对比

刷新后，继续使用刷新前的旧 access token 调 `getDeviceListAuthed`：

```json
{
  "code": 2,
  "message": "TOKEN_IS_INVALID"
}
```

切换到 fresh token 后，同一接口恢复正常：

```json
{
  "code": 0,
  "data": [
    {
      "deviceSn": "WCK6584462",
      "authFlag": true
    }
  ],
  "message": "SUCCESSFUL_OPERATION"
}
```

结论：

- 全球环境里，`refresh` 会使旧 access token 立即失效。
- 刷新后的读取与解绑应统一使用 fresh token。

### 13. 使用 fresh token 解绑 `/oauth2/unbindDevice`

请求体：

```json
{
  "deviceSnList": [
    "WCK6584462"
  ]
}
```

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

这轮基于最新正式文档的全球环境重跑已经完整跑通，且确认了以下稳定结论：

- 全球环境当前主流程应使用 `POST /prod-api/login`、`GET /prod-api/auth`。
- `bindDevice` 按对象数组写法可直接成功：`{"deviceSnList":[{"deviceSn":"WCK6584462"}]}`。
- 当前这台设备在全球环境下不需要 `pinCode`。
- `deviceSn` 才是绑定目标；用户提供的 `ZG00E820UH` 更接近采集器号线索。
- `/oauth2/refresh` 成功后，旧 access token 会立即返回 `TOKEN_IS_INVALID`，后续操作必须切换到 fresh token。
- 本轮结束后已用 fresh token 成功解绑，并复查确认已授权列表为空。
