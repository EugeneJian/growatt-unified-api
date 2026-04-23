# 2026-04-23 AU 全量报告与 API 文档一致性修复记录

## 1. Evidence Source

本次修复以以下全量测试报告作为证据源：

- `test/oauth2-openApi-platform-au-full-test-report-2026-04-23.en.md`
- 测试环境：`https://opencloud-test-au.growatt.com/prod-api`
- 测试时间：`2026-04-23 16:36:33 +08:00` 至 `2026-04-23 16:36:47 +08:00`
- 测试模式：`authorization_code` 与 `client_credentials` 全量重跑
- 测试设备：`WUP0N3500C`

报告保留了完整请求与响应体，敏感值以 `***` 脱敏。本次不重新跑 live API，而是以该全量报告修正文档和测试。

## 2. Key Findings

### 2.1 Token grant type 行为存在文档冲突

修复前，`01_authentication` 与 `02_api_access_token` 将两种 `grant_type` 写成共享 token pair 返回模型。

AU 全量报告显示：

- `authorization_code` token 请求必须携带 `redirect_uri`，响应包含 `access_token`、`refresh_token`、`refresh_expires_in`、`token_type`、`expires_in`。
- `client_credentials` token 请求不携带 `redirect_uri` 可以成功。
- `client_credentials` token 请求携带兼容 `redirect_uri` 也可以成功。
- 两种 `client_credentials` 响应都只包含 `access_token`、`token_type`、`expires_in`，不包含 `refresh_token` 或 `refresh_expires_in`。

### 2.2 refresh 接口适用前提需要收窄

`POST /oauth2/refresh` 只能在上一次 token 响应签发了 `refresh_token` 时使用。AU 全量报告确认 `client_credentials` 本轮没有返回 refresh token，因此不能继续把 refresh 能力写成两种模式共享。

### 2.3 getDeviceInfo 版本字段缺失

AU 全量报告的 `getDeviceInfo` 成功响应包含以下字段：

- `unifiedAPIver: null`
- `deviceVersion: null`
- `datalogVersion: "7.6.1.9"`

修复前，`07_api_device_info` 中英文示例与字段表未记录这些字段。

### 2.4 getDeviceData / push 字段表缺少 backupPower

AU 全量报告的 `getDeviceData` 成功响应包含 `data.backupPower=0.1`。现有 08/09 示例中也已经出现 `backupPower`，但字段表缺少 `data.backupPower`。

修复口径：

- `backupPower` 是公开端点字段，补入 `08_api_device_data` 与 `09_api_device_push` 的中英文字段表。
- `backupPower` is not part of the Appendix C VPP core semantic model.
- 附录 C 语义模型和术语表继续不纳入 `backupPower`。

### 2.5 system-level SOC 与 pack-level SOC 口径确认

AU 全量报告在两种 OAuth 模式下都返回：

- `data.soc=39`
- `batteryList[0].soc=39`

修复延续此前已完成的系统级 SOC 口径：

- `data.soc`：系统级 SOC，表示整个 ESS 电池系统。
- `batteryList[].soc`：pack 级 SOC，表示单个电池包。

### 2.6 getDeviceList 的错误码需要正文化

AU 全量报告显示 `client_credentials` 调用 `POST /oauth2/getDeviceList` 返回：

```json
{
  "code": 103,
  "message": "WRONG_GRANT_TYPE"
}
```

因此补入 `04_api_device_auth` 的正式响应示例，并在 `10_global_params` 响应码表中新增 `103 WRONG_GRANT_TYPE`。

### 2.7 成功响应 data 形态不能写死为对象

AU 全量报告显示成功响应的 `data` 形态随接口变化，包括对象、数组、空数组、`null`、数字 `1`。因此 `10_global_params` 的成功响应示例改为 endpoint-dependent，不再写成固定 `{}`。

### 2.8 bindDevice pinCode 口径需要补充

修复前文档已写明 `pinCode` 在 `client_credentials` 模式下必填。AU 全量报告进一步显示授权码模式携带对象数组 + `pinCode` 可成功。

修复后口径：

- `client_credentials`：`deviceSnList[].pinCode` 必填。
- `authorization_code`：`pinCode` 可选但可接受；部分环境或设备可能要求携带。

## 3. Files Changed

### English API docs

- `Growatt API/OPENAPI/01_authentication.md`
- `Growatt API/OPENAPI/02_api_access_token.md`
- `Growatt API/OPENAPI/03_api_refresh.md`
- `Growatt API/OPENAPI/04_api_device_auth.md`
- `Growatt API/OPENAPI/07_api_device_info.md`
- `Growatt API/OPENAPI/08_api_device_data.md`
- `Growatt API/OPENAPI/09_api_device_push.md`
- `Growatt API/OPENAPI/10_global_params.md`
- `Growatt API/OPENAPI/11_api_troubleshooting.md`
- `Growatt API/OPENAPI/README.md`

### Chinese API docs

- `Growatt API/OPENAPI.zh-CN/01_authentication.md`
- `Growatt API/OPENAPI.zh-CN/02_api_access_token.md`
- `Growatt API/OPENAPI.zh-CN/03_api_refresh.md`
- `Growatt API/OPENAPI.zh-CN/04_api_device_auth.md`
- `Growatt API/OPENAPI.zh-CN/07_api_device_info.md`
- `Growatt API/OPENAPI.zh-CN/08_api_device_data.md`
- `Growatt API/OPENAPI.zh-CN/09_api_device_push.md`
- `Growatt API/OPENAPI.zh-CN/10_global_params.md`
- `Growatt API/OPENAPI.zh-CN/11_api_troubleshooting.md`
- `Growatt API/OPENAPI.zh-CN/README.md`

### Tests and audit record

- `__tests__/growatt-docs.test.ts`
- `docs/oauth2-au-full-report-vs-docs-fix-2026-04-23.md`

## 4. Test Changes

`__tests__/growatt-docs.test.ts` 更新内容：

- 将端点遥测字段集与 VPP 语义遥测字段集拆开。
- 允许 `data.backupPower` 出现在 08/09 endpoint 字段表。
- 继续断言附录 C 语义模型和术语表不包含 `backupPower`。
- 新增 grant-specific token 请求/响应断言。
- 新增 `getDeviceInfo` 版本字段断言。
- 新增 `103 WRONG_GRANT_TYPE` 与 endpoint-dependent `data` 形态断言。
- 新增本变更记录文件存在性与关键结论断言。

## 5. Verification Plan

本次修复完成后需要执行：

```bash
npm run docs:check
git diff --check
```

同时对全量 AU 报告执行敏感值扫描，确认以下敏感类别仍未泄露明文：

- token
- secret
- password
- pin / pinCode

## 6. Remaining Assumptions

- 本次不重新跑 live API，使用已生成的 2026-04-23 AU 全量报告作为修复依据。
- `backupPower` 是公开接口字段，但不是 VPP 核心语义字段。
- `client_credentials` 不应按 refresh 流程处理，除非未来响应明确签发 `refresh_token`。
- `data.soc` 与 `batteryList[].soc` 的区分保持为正式语义口径。
