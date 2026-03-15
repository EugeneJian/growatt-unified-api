# Growatt API 技术附录（curl 示例）

## 0. 推荐先用一把跑通脚本

如果目标是“我只给 SN 和 PINCODE，一次就跑通”，优先使用：

```bash
./scripts/run-growatt-9290-flow.sh \
  'SPH:YRP0N4S00Q=TESTPINCODE753951' \
  'SPM:HCQSKJMSJ1=TESTPINCODE753951'
```

说明：

- 脚本会自动获取 token
- 自动调用 `bindDevice`
- 自动查询 `getDeviceInfo`
- 自动查询 `getDeviceData`
- 自动去掉 `SPH:` / `SPM:` 前缀，只传纯 SN
- 如果要输出原始全量 JSON 响应，可追加 `--raw-json`

更聚焦的一页式说明见：

- [test/growatt-9290-one-pass-runbook.md](/Users/kanajane/Desktop/Github/growatt_unified_api/test/growatt-9290-one-pass-runbook.md)

## 1. 说明

本附录基于 2026-03-12 的实测结果整理，仅保留联调所需的最小可用示例。

为避免泄露敏感信息，以下内容已脱敏：

- `client_id` / `client_secret` 以占位符表示
- 设备 SN 仅展示脱敏形式
- token 不展示真实值

## 2. 成功链路

推荐按以下顺序执行：

1. 获取 token
2. 绑定设备
3. 查询设备信息
4. 查询设备高频数据

## 3. 获取 token

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/token' \
  -X POST \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials&client_id=<client_id>&client_secret=<client_secret>&redirect_uri=https://api-test.growatt.com:9290/testToken/testToken1'
```

示例返回：

```json
{
  "access_token": "<access_token>",
  "token_type": "Bearer",
  "expires_in": 604800
}
```

## 4. 绑定设备

注意：

- `deviceSn` 必须传纯 SN
- 不要传 `SPH:` 或 `SPM:` 前缀
- `pinCode` 使用临时值

### 绑定设备 1

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/bindDevice' \
  -X POST \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  --data '{"deviceSnList":[{"deviceSn":"YRP***00Q","pinCode":"TESTPINCODE753951"}]}'
```

### 绑定设备 2

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/bindDevice' \
  -X POST \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  --data '{"deviceSnList":[{"deviceSn":"HCQ***SJ1","pinCode":"TESTPINCODE753951"}]}'
```

成功返回：

```json
{
  "code": 0,
  "data": 1,
  "message": "SUCCESSFUL_OPERATION"
}
```

## 5. 查询设备信息

注意：

- 该测试环境实测成功格式为 JSON body
- `deviceSn` 传纯 SN

### 查询设备 1 信息

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/getDeviceInfo' \
  -X POST \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  --data '{"deviceSn":"YRP***00Q"}'
```

### 查询设备 2 信息

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/getDeviceInfo' \
  -X POST \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  --data '{"deviceSn":"HCQ***SJ1"}'
```

成功返回结构示例：

```json
{
  "code": 0,
  "data": {
    "deviceSn": "YRP***00Q",
    "deviceTypeName": "sph",
    "model": "SPH 5000TL-HUB",
    "nominalPower": 6000,
    "datalogSn": "VWQ***00L",
    "datalogDeviceTypeName": "ShineWiLan-X2",
    "existBattery": true,
    "batteryCapacity": 9000,
    "authFlag": true
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

## 6. 查询高频数据

注意：

- 该测试环境实测成功格式为 JSON body
- 实测成功使用 `Authorization: Bearer <access_token>`

### 查询设备 1 高频数据

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/getDeviceData' \
  -X POST \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  --data '{"deviceSn":"YRP***00Q"}'
```

### 查询设备 2 高频数据

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/getDeviceData' \
  -X POST \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  --data '{"deviceSn":"HCQ***SJ1"}'
```

成功返回结构示例：

```json
{
  "code": 0,
  "data": {
    "utcTime": "2026-03-12 12:03:10",
    "serialNum": "YRP***00Q",
    "soc": 60,
    "ppv": 18.0,
    "payLoadPower": 18.2,
    "status": 9
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

## 7. 常见错误与排查

### 7.1 未绑定设备

返回示例：

```json
{
  "code": 12,
  "message": "DEVICE_SN_DOES_NOT_HAVE_PERMISSION"
}
```

处理方式：

- 先调用 `bindDevice`

### 7.2 参数错误

返回示例：

```json
{
  "message": "parameter error"
}
```

常见原因：

- `deviceSn` 传了带前缀值
- body 格式不匹配
- 查询接口未使用 JSON body

### 7.3 查询失败

返回示例：

```json
{
  "code": 400,
  "message": "fail",
  "data": null
}
```

建议排查：

- 是否使用了正确的 SN 格式
- 是否已完成设备绑定
- 是否使用了 `Authorization: Bearer <access_token>`

## 8. 联调建议

- 统一封装纯 SN 转换逻辑
- 统一封装 JSON body 请求格式
- 将 `bindDevice` 设为查询前置步骤
- 对 `code=12` 做自动引导或显式报错提示
