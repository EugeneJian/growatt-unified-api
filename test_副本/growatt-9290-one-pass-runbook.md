# Growatt 9290 一次跑通说明

适用范围：

- 测试环境：`https://api-test.growatt.com:9290`
- OAuth 模式：`client_credentials`
- 目标：你只提供 `SN` 和 `PINCODE`，一次执行完成 `token -> bindDevice -> getDeviceInfo -> getDeviceData`

## 1. 最短成功路径

直接运行：

```bash
./scripts/run-growatt-9290-flow.sh \
  'SPH:YRP0N4S00Q=TESTPINCODE753951' \
  'SPM:HCQSKJMSJ1=TESTPINCODE753951'
```

这条命令会自动完成：

1. 获取 fresh token
2. 去掉设备前缀，只传纯 SN 做 `bindDevice`
3. 查询 `getDeviceInfo`
4. 查询 `getDeviceData`
5. 输出每台设备的摘要结果

如果你要看和 PDF 测试报告一样的“全量 JSON 响应”，改成：

```bash
./scripts/run-growatt-9290-flow.sh --raw-json \
  'SPH:YRP0N4S00Q=TESTPINCODE753951' \
  'SPM:HCQSKJMSJ1=TESTPINCODE753951'
```

## 2. 已固定下来的参数

当前脚本已经按这次实测成功链路固化了以下参数：

- `client_id=testclientmode`
- `client_secret=testsecretgrowatt1`
- `redirect_uri=https://api-test.growatt.com:9290/testToken/testToken1`
- `grant_type=client_credentials`

如果后续 Growatt 测试环境变更了凭据，可通过环境变量覆盖：

```bash
GROWATT_CLIENT_ID=... \
GROWATT_CLIENT_SECRET=... \
GROWATT_REDIRECT_URI=... \
./scripts/run-growatt-9290-flow.sh 'SPH:YRP0N4S00Q=TESTPINCODE753951'
```

## 3. 这次真正踩过的坑

### 坑 1：模式混淆

这次已经确认，当前稳定跑通的是：

- `client_credentials`

不是：

- `authorization_code`

所以这条流程里拿 token 用的是：

- `client_id`
- `client_secret`

不是登录页里的授权码流程。

### 坑 2：`PINCODE` 不是拿 token 用的

`TESTPINCODE753951` 的用途是：

- `bindDevice`

不是：

- `/oauth2/token`

正确顺序必须是：

1. 先 `/oauth2/token`
2. 再 `/oauth2/bindDevice`
3. 再查信息和遥测

### 坑 3：设备 SN 不能带前缀

页面和沟通里经常给的是：

- `SPH:YRP0N4S00Q`
- `SPM:HCQSKJMSJ1`

但 API 实际要传的是：

- `YRP0N4S00Q`
- `HCQSKJMSJ1`

脚本已经自动处理这个问题。

### 坑 4：查询接口请求格式不能漂移

当前测试环境已验证通过的查询格式是：

- `Authorization: Bearer <access_token>`
- `Content-Type: application/json`
- body 为 `{"deviceSn":"RAW_SN"}`

`bindDevice` 也一样用：

- `Authorization: Bearer <access_token>`
- `Content-Type: application/json`

## 4. 成功标准

跑通后应看到：

- token 获取成功
- 每台设备 `bindDevice` 返回 `code=0`
- 每台设备 `getDeviceInfo` 返回 `code=0`
- 每台设备 `getDeviceData` 返回 `code=0`

如果成功，脚本会输出每台设备的最小摘要：

- `model`
- `nominalPower`
- `authFlag`
- `utcTime`
- `ppv`
- `payLoadPower`
- `batPower`
- `soc`
- `status`

## 5. 为什么有时看起来“只能拿到少量数据”

这次对比后已经确认：

- API 实际返回的数据并不少
- 之前我们自己的 Markdown 报告和脚本默认只展示了“摘要字段”
- 你手上的 PDF 更像是“接口测试报告”，保留了原始请求和原始响应，所以看起来是“全量数据”

也就是说，差异主要在“展示层”，不是接口能力差异。

例如我们实际拿到的 `getDeviceData` 里，除了常见的：

- `utcTime`
- `ppv`
- `payLoadPower`
- `batPower`
- `soc`
- `status`

还包含很多字段，例如：

- `backupPower`
- `pac`
- `etoUserToday`
- `etoUserTotal`
- `etoGridToday`
- `etoGridTotal`
- `pexPower`
- `activePower`
- `reactivePower`
- `vac1`
- `vac2`
- `vac3`
- `protectCode`
- `faultCode`
- `batteryList`

如果要用“全量响应”方式验收，请直接加：

```bash
--raw-json
```

## 6. 手工 curl 顺序

如果需要人工排查，手工顺序固定为：

1. `POST /oauth2/token`
2. `POST /oauth2/bindDevice`
3. `POST /oauth2/getDeviceInfo`
4. `POST /oauth2/getDeviceData`

更详细的 curl 示例仍保留在：

- [test/growatt-api-curl-appendix.md](/Users/kanajane/Desktop/Github/growatt_unified_api/test/growatt-api-curl-appendix.md)

## 7. 推荐日常用法

后续如果只是验证某台设备能不能跑通，不要再重复手拼 curl。

推荐直接用：

```bash
./scripts/run-growatt-9290-flow.sh '设备SN=PINCODE'
```

例如：

```bash
./scripts/run-growatt-9290-flow.sh 'HCQSKJMSJ1=TESTPINCODE753951'
```
