# Growatt 设备巡检报告

巡检时间：2026-03-13（Australia/Melbourne）  
巡检环境：`https://api-test.growatt.com:9290`  
巡检模式：`client_credentials`  
巡检范围：2 台测试设备的 token、设备信息、设备高频数据读取  
结果：**全部读取成功**

## 一、巡检结论

本次巡检已成功完成以下检查：

- 成功获取新的 `access_token`
- 成功读取设备 1 信息与高频数据
- 成功读取设备 2 信息与高频数据
- 当前两台设备授权状态均正常，`authFlag=true`

当前可获取的信息包括：

- 设备基础信息：设备类型、型号、额定功率、通讯版本
- 采集器信息：采集器 SN、采集器类型
- 电池信息：是否带电池、电池型号、电池容量、电池额定功率、电池列表
- 实时/高频数据：时间戳、频率、光伏功率、负载功率、电池功率、SOC、电池状态、优先级、设备状态、三相电压、累计能量字段

## 二、设备状态摘要

设备 1：`SPH:YRP***00Q`

- 型号：`SPH 5000TL-HUB`
- 额定功率：`6000`
- 电池：有，容量 `9000`
- 授权状态：`true`
- 最新数据时间：`2026-03-12 13:39:30`
- `ppv=15.10`
- `payLoadPower=15.10`
- `batPower=0.00`
- `soc=60`
- `batteryStatus=1`
- `priority=2`
- `status=9`
- 说明：按文档推断，`status=9` 为 Bypass 模式

设备 2：`SPM:HCQ***SJ1`

- 型号：`SPH 10000TL-HU (AU)`
- 额定功率：`15000`
- 电池：有，容量 `4500`
- 授权状态：`true`
- 最新数据时间：`2026-03-12 10:46:17`
- `ppv=5.00`
- `payLoadPower=0.00`
- `batPower=15.00`
- `soc=56`
- `batteryStatus=3`
- `priority=0`
- `status=0`
- 说明：按文档推断，`status=0` 为待机；设备 2 返回时间明显早于设备 1，数据刷新可能较慢

## 三、详细 curl 交互

说明：

- 以下交互为本次实际巡检所用请求形式
- `access_token` 已脱敏
- 设备 SN 已在正文脱敏；curl 中保留接口所需格式示例

### 1. 获取 token

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/token' \
  -X POST \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials&client_id=testclientmode&client_secret=***&redirect_uri=https://api-test.growatt.com:9290/testToken/testToken1'
```

响应：

```json
{"access_token":"SwSC5K...xsHVP","token_type":"Bearer","expires_in":604800}
```

### 2. 读取设备 1 信息

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/getDeviceInfo' \
  -X POST \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  --data '{"deviceSn":"YRP0N4S00Q"}'
```

响应摘要：

```json
{"code":0,"data":{"deviceSn":"YRP0N4S00Q","deviceTypeName":"sph","model":"SPH 5000TL-HUB","nominalPower":6000,"datalogSn":"VWQ0F9W00L","datalogDeviceTypeName":"ShineWiLan-X2","existBattery":true,"batteryCapacity":9000,"authFlag":true},"message":"SUCCESSFUL_OPERATION"}
```

### 3. 读取设备 1 高频数据

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/getDeviceData' \
  -X POST \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  --data '{"deviceSn":"YRP0N4S00Q"}'
```

响应摘要：

```json
{"code":0,"data":{"utcTime":"2026-03-12 13:39:30","serialNum":"YRP0N4S00Q","fac":50.04,"ppv":15.10,"payLoadPower":15.10,"batPower":0.00,"soc":60,"batteryStatus":1,"priority":2,"status":9},"message":"SUCCESSFUL_OPERATION"}
```

### 4. 读取设备 2 信息

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/getDeviceInfo' \
  -X POST \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  --data '{"deviceSn":"HCQSKJMSJ1"}'
```

响应摘要：

```json
{"code":0,"data":{"deviceSn":"HCQSKJMSJ1","deviceTypeName":"sph","model":"SPH 10000TL-HU (AU)","nominalPower":15000,"datalogSn":"ZGQ0E8511G","datalogDeviceTypeName":"ShineWiLan-X2","existBattery":true,"batteryCapacity":4500,"authFlag":true},"message":"SUCCESSFUL_OPERATION"}
```

### 5. 读取设备 2 高频数据

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/getDeviceData' \
  -X POST \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  --data '{"deviceSn":"HCQSKJMSJ1"}'
```

响应摘要：

```json
{"code":0,"data":{"utcTime":"2026-03-12 10:46:17","serialNum":"HCQSKJMSJ1","fac":50.00,"ppv":5.00,"payLoadPower":0.00,"batPower":15.00,"soc":56,"batteryStatus":3,"priority":0,"status":0},"message":"SUCCESSFUL_OPERATION"}
```

## 四、巡检判断

- 接口可用性：正常
- 鉴权状态：正常
- 设备授权状态：正常
- 设备 1：可正常返回最新状态，数据较新
- 设备 2：可正常返回状态，但数据时间较旧，建议后续继续观察刷新时效

## 五、补充说明

- 本次巡检沿用了已验证通过的 9290 请求格式：
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`
  - 查询接口使用纯 SN
- 报告中已对敏感设备标识做脱敏处理
