# Growatt Open API 专业集成指南

基线来源：`docs/3 接口列表.md`（同步自 2026 年 4 月 1 日版厂商文档）

本文档是入口型说明。端点参数、示例和返回码仍以 `Growatt API/OPENAPI.zh-CN/*.md` 为准；本页不再用联调经验覆盖基线。

## 1 文档分层

- 基线事实来源：`docs/3 接口列表.md`
- 中文拆分发布文档：`Growatt API/OPENAPI.zh-CN/*.md`
- 英文拆分发布文档：`Growatt API/OPENAPI/*.md`
- 储能术语对照表：[./OPENAPI.zh-CN/12_ess_terminology.md](./OPENAPI.zh-CN/12_ess_terminology.md)
- 联调观察来源：仓库 `test/` 目录中的环境记录

## 2 基线确认的集成路径

### `authorization_code`

1. 调用 `POST /oauth2/token`
2. 调用 `POST /oauth2/getDeviceList`
3. 调用 `POST /oauth2/bindDevice`
4. 调用设备查询、调度和回读接口

### `client_credentials`

1. 调用 `POST /oauth2/token`
2. 直接调用 `POST /oauth2/bindDevice`
3. 调用 `POST /oauth2/getDeviceListAuthed`
4. 调用设备查询、调度和回读接口

## 3 API 矩阵

| 能力 | Endpoint | 基线关键输入 |
| :--- | :--- | :--- |
| 获取 token | `/oauth2/token` | `grant_type`、`client_id`、`client_secret`、`redirect_uri` |
| 刷新 token | `/oauth2/refresh` | `refresh_token`、客户端凭证 |
| 获取可授权设备列表 | `/oauth2/getDeviceList` | Bearer token，仅 `authorization_code` |
| 绑定设备 | `/oauth2/bindDevice` | `deviceSnList`；客户端模式下 `pinCode` 必填 |
| 获取已授权设备列表 | `/oauth2/getDeviceListAuthed` | Bearer token |
| 解除授权 | `/oauth2/unbindDevice` | `deviceSnList` |
| 设备信息 | `/oauth2/getDeviceInfo` | `deviceSn` |
| 设备遥测 | `/oauth2/getDeviceData` | `deviceSn` |
| 设备调度 | `/oauth2/deviceDispatch` | `deviceSn`、`setType`、`value`、`requestId` |
| 调度回读 | `/oauth2/readDeviceDispatch` | `deviceSn`、`setType`、`requestId` |

## 4 当前基线需要特别注意的地方

- `POST /oauth2/token` 的两个厂商示例都包含 `redirect_uri`。
- `POST /oauth2/readDeviceDispatch` 的参数表要求 `requestId`，但厂商示例正文漏写了它。
- `POST /oauth2/deviceDispatch` 的参数表把 `value` 写成 `string`，但同页示例传入了对象。
- `POST /oauth2/getDeviceData` 的局部头部表写作 `token`，而全局章节统一写作 `Authorization: Bearer xxxxxxx`。

## 5 联调观察（非基线规范）

以下内容来自仓库 `test/` 目录中的环境记录，仅供实现参考：

- 多份记录使用 JSON body 调用设备级接口。
- 多份记录建议传纯 `deviceSn`，不要混用 `datalogSn` 或展示前缀。
- 个别记录观察到 `client_credentials` 调 `getDeviceList` 返回 `WRONG_GRANT_TYPE`。
- 个别记录观察到 `readDeviceDispatch.data` 会随 `setType` 返回对象结构。

这些现象不应覆盖端点文档中的基线规则。

## 6 集成检查清单

- [ ] 已区分 `authorization_code` 与 `client_credentials` 的基线能力边界
- [ ] 已在两个 token 模式示例中保留 `redirect_uri`
- [ ] 已将 `bindDevice.pinCode` 视为客户端模式必填
- [ ] 已将 `readDeviceDispatch.requestId` 视为必填
- [ ] 已按 `10_global_params.md` 中的 3 个 `setType` 实现基础映射
- [ ] 已对照 [./OPENAPI.zh-CN/12_ess_terminology.md](./OPENAPI.zh-CN/12_ess_terminology.md) 理解公开储能术语
- [ ] 已将联调经验留在兼容层，而不是提升为主规范
