# 常见问题与排查

## 1. `client_credentials` 能否调用 `getDeviceList`？

不能。`POST /oauth2/getDeviceList` 仅支持 `authorization_code` 模式。使用不支持的授权模式调用时，接口可能返回 `code=103`、`message="WRONG_GRANT_TYPE"`。

`client_credentials` 模式应直接调用 `POST /oauth2/bindDevice`，并为每台设备提供必填的 PIN Code。

## 2. `bindDevice` 何时必须提供 `pinCode`？

客户端凭证模式下，`deviceSnList[].pinCode` 必填。授权码模式应绑定终端用户在授权流程中选择的设备。

## 3. `readDeviceDispatch` 是否必须提供 `requestId`？

是。每次调用 `deviceDispatch` 和 `readDeviceDispatch` 都应提供唯一的 `requestId`。建议使用时间戳与随机数据组合成 32 位字符串。

## 4. 受保护接口应使用哪个认证请求头？

统一使用：

```http
Authorization: Bearer <access_token>
```

不要通过自定义 `token` 请求头或 URL 查询参数传递 access token。

## 5. 按设备计算的请求频率限制是多少？

- `getDeviceData`：`1 request / min / device`
- `deviceDispatch` 与 `readDeviceDispatch`：`1 request / 5 sec / device`（`12 RPM`）

超过限制时，接口可能返回 `code` `105` 与 `TOO_MANY_REQUEST`。请按设备 SN 限流，并在重试前执行退避。

## 6. 设备级 API 应使用 `deviceSn` 还是 `datalogSn`？

使用 `deviceSn`。`datalogSn` 标识数据采集器，不能替代设备级请求体中的设备序列号。

## 7. 如何判断 `bindDevice` 是否成功？

以 `code=0` 作为成功条件。解析器应允许接口相关的 `data` 值，不要把成功响应限定为单一固定结构。

## 8. 能否直接使用示例中的 token 有效期？

不能。每次都从当前响应读取 `expires_in`，并在返回时读取 `refresh_expires_in`。请根据这些数值安排续期，并为时钟偏差和在途请求预留安全余量。

## 9. Token 刷新成功后应如何处理？

立即、原子化地替换已保存的 access token 与 refresh token。之后所有受保护请求都必须使用新返回的 access token。

## 10. 为什么 `readDeviceDispatch.data` 有多种结构？

返回结构由 `setType` 决定：

- 数组：`time_slot_charge_discharge`
- 对象：`duration_and_power_charge_discharge`、`export_limit`
- 数值：`enable_control`、`active_power_derating_percentage`、`active_power_percentage`、`remote_charge_discharge_power`

请根据请求使用的 `setType` 选择解析器，不要假设 `data` 始终为字符串。

## 11. 调度超时后应如何重试？

调度返回超时或设备无响应时，应先遵守按设备限流要求并调用 `readDeviceDispatch`。只有回读确认目标设置未生效时，才重试原调度请求。

## 相关文档

- [身份认证说明](./01_authentication.md)
- [设备授权 API](./04_api_device_auth.md)
- [设备调度 API](./05_api_device_dispatch.md)
- [读取设备调度参数 API](./06_api_read_dispatch.md)
- [全局参数](./10_global_params.md)
- [ESS 术语表](./12_ess_terminology.md)
