# 常见问题与排查 FAQ

本页分成两部分：

- 公开 API 说明：面向使用者的接口规则与已发布说明。
- 联调观察：来自仓库 `test/` 目录的环境记录，仅供实现时参考。

## 公开 API 说明

### 1. `client_credentials` 可以直接调用 `getDeviceList` 吗？

不可以。

- `POST /oauth2/getDeviceList` 仅在 `authorization_code` 模式下支持。

### 2. `bindDevice` 什么时候必须传 `pinCode`？

公开参数表中明确写明：

- `deviceSnList[].pinCode`：客户端模式下必填。

### 3. `readDeviceDispatch` 的 `requestId` 是必填吗？

请求参数表将 `requestId` 标记为必填。虽然原始请求示例漏写了它，但公开拆分文档仍按参数表保留为必填字段。

### 4. `getDeviceData` 的鉴权头到底叫 `token` 还是 `Authorization`？

当前公开材料中存在局部写法差异：

- `3.7` 小节的局部 HTTP 头表写作 `token`
- `4 全局参数说明` 明确要求 `Authorization: Bearer xxxxxxx`

公开拆分文档采用全局章节的统一写法。

### 5. 遥测与下发的设备级请求频率上限是多少？

- 遥测轮询 `getDeviceData`：`1 request / min / device`
- 下发与下发回读 `deviceDispatch` / `readDeviceDispatch`：`1 request / 5 sec / device`（`12 RPM`）
- 超过设备级频率限制时，接口可能返回 `TOO_MANY_REQUEST`，对应 `code` `105`。

## 联调观察

以下内容来自仓库 `test/` 目录中的环境联调记录，仅供实现参考：

- 2026-03-27 最新全球授权码联调在 `POST /oauth2/token` 之前，实际经过了 `GET /#/login?...`、`POST /prod-api/login`、`GET /prod-api/auth`。
- 多份联调记录将 `bindDevice`、`getDeviceInfo`、`getDeviceData`、`deviceDispatch`、`readDeviceDispatch`、`unbindDevice` 作为 JSON body 接口处理。
- 多份联调记录建议在设备级接口中使用纯 `deviceSn`，避免误用 `datalogSn` 或展示前缀值。
- 个别联调记录观察到 `client_credentials` 调用 `getDeviceList` 时返回 `WRONG_GRANT_TYPE`。
- 个别联调记录观察到 `readDeviceDispatch.data` 会随 `setType` 出现对象结构；该现象保留为实现观察，不作为端点规范。

### 6. 最新全球授权码联调实际经过了哪些入口？

2026-03-27 全球环境记录的实际链路是：

- 前端登录页：`GET /#/login?...`
- 用户登录提交：`POST /prod-api/login`
- 授权码步骤：`GET /prod-api/auth`
- token 兑换：`POST /oauth2/token`

### 7. 设备级接口到底该用 `deviceSn` 还是 `datalogSn`？

应使用 `deviceSn`。

- 最新全球记录返回的是 `deviceSn=WCK6584462`、`datalogSn=ZGQ0E820UH`。
- 同一轮联调用 `deviceSn` 调了 `bindDevice`、`getDeviceInfo`、`getDeviceData`、`unbindDevice`。

### 8. `bindDevice` 成功时为什么会返回 `data: 1`？

这是最新全球实测里出现过的成功形态。

- 该次成功响应为 `{"code":0,"data":1,"message":"SUCCESSFUL_OPERATION"}`。
- 实现上应以 `code=0` 作为成功判断，不要把成功结果写死成只接受 `data: null`。

### 9. TTL 逻辑能不能直接照抄 `7200` 这类示例值？

不建议。

- 最新全球 `token` 实测返回 `expires_in=604733`、`refresh_expires_in=2585309`。
- 随后的 `refresh` 实测返回 `expires_in=604800`、`refresh_expires_in=2592000`。
- 代码里应始终读取接口实时返回的 TTL。

### 10. `refresh` 成功后还能继续用旧 access token 吗？

在最新全球联调里不能。

- 2026-03-27 的 `POST /oauth2/refresh` 成功后，旧 access token 立即返回 `TOKEN_IS_INVALID`。
- 后续读取和解绑调用都必须切换到 fresh token。

## 相关文档

- [设备授权 API](./04_api_device_auth.md)
- [读取设备调度参数 API](./06_api_read_dispatch.md)
- [设备数据查询 API](./08_api_device_data.md)
