# 常见问题与排查 FAQ

本页分成两部分：

- 基线提醒：直接来自 `docs/3 接口列表.md` 或基于其章节之间的明确交叉校验。
- 联调观察：来自仓库 `test/` 目录的环境记录，仅供实现时参考，不构成厂商基线规范。

## 基线提醒

### 1. `client_credentials` 可以直接调用 `getDeviceList` 吗？

不可以。厂商基线明确写明：

- `POST /oauth2/getDeviceList` 仅在 `authorization_code` 模式下支持。

### 2. `bindDevice` 什么时候必须传 `pinCode`？

厂商基线在参数表中明确写明：

- `deviceSnList[].pinCode`：客户端模式下必填。

### 3. `readDeviceDispatch` 的 `requestId` 是必填吗？

厂商参数表将 `requestId` 标记为必填。虽然原始请求示例漏写了它，但公开拆分文档仍按参数表保留为必填字段。

### 4. `getDeviceData` 的鉴权头到底叫 `token` 还是 `Authorization`？

当前基线内部存在局部写法差异：

- `3.7` 小节的局部 HTTP 头表写作 `token`
- `4 全局参数说明` 明确要求 `Authorization: Bearer xxxxxxx`

公开拆分文档采用全局章节的统一写法。

## 联调观察（非基线规范）

以下内容来自仓库 `test/` 目录中的环境联调记录，不构成厂商 2026 年 4 月 1 日基线规范：

- 多份联调记录将 `bindDevice`、`getDeviceInfo`、`getDeviceData`、`deviceDispatch`、`readDeviceDispatch`、`unbindDevice` 作为 JSON body 接口处理。
- 多份联调记录建议在设备级接口中使用纯 `deviceSn`，避免误用 `datalogSn` 或展示前缀值。
- 个别联调记录观察到 `client_credentials` 调用 `getDeviceList` 时返回 `WRONG_GRANT_TYPE`。
- 个别联调记录观察到 `readDeviceDispatch.data` 会随 `setType` 出现对象结构；该现象未在 2026 年 4 月 1 日基线中被定义为主规范。

## 相关文档

- [设备授权 API](./04_api_device_auth.md)
- [读取设备调度参数 API](./06_api_read_dispatch.md)
- [设备数据查询 API](./08_api_device_data.md)
