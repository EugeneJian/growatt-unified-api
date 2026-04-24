# Growatt Open API 专业集成指南

本文档是入口型说明。端点参数、示例和返回码统一维护在 `Growatt API/OPENAPI.zh-CN/*.md`；环境联调记录则单独放在观察部分，便于实现时参考。

## 1 文档分层

- 中文拆分发布文档：`Growatt API/OPENAPI.zh-CN/*.md`
- 英文拆分发布文档：`Growatt API/OPENAPI/*.md`
- 附录 B 术语表：[/growatt-openapi/appendix-terminology](/growatt-openapi/appendix-terminology)
- 联调观察来源：仓库 `test/` 目录中的环境记录

## 2 支持的集成路径

### 集成流程

```mermaid
flowchart TD
    A["申请 client_id / client_secret"] --> B{"选择 OAuth 模式"}
    B -->|"authorization_code"| C["登录 Growatt 并换取 token 对"]
    B -->|"client_credentials"| D["直接获取 access token"]
    C --> E["getDeviceList -> bindDevice"]
    D --> F["bindDevice"]
    E --> G["getDeviceInfo / getDeviceData"]
    F --> G
    G --> H["deviceDispatch -> readDeviceDispatch"]
    G --> I["接收 dfcData 推送"]
```

### `authorization_code`

2026-03-27 全球环境实测主流程：

1. 打开前端登录页 `GET /#/login?...`
2. 通过 `POST /prod-api/login` 提交登录
3. 通过 `GET /prod-api/auth` 获取授权码
4. 通过 `POST /oauth2/token` 换取 token 对
5. 调用 `POST /oauth2/getDeviceList`
6. 调用 `POST /oauth2/bindDevice`
7. 调用设备查询、调度和回读接口

### `client_credentials`

1. 调用 `POST /oauth2/token`
2. 直接调用 `POST /oauth2/bindDevice`
3. 调用 `POST /oauth2/getDeviceListAuthed`
4. 调用设备查询、调度和回读接口

## 3 API 矩阵

| 能力 | Endpoint | 关键输入 |
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

## 4 需要特别注意的事项

- `POST /oauth2/token` 的两个公开示例都包含 `redirect_uri`。
- `POST /oauth2/readDeviceDispatch` 的参数表要求 `requestId`，但公开请求示例正文漏写了它。
- `10_global_params.md` 现在公开发布的调度 `setType` 共 7 个：`time_slot_charge_discharge`、`duration_and_power_charge_discharge`、`export_limit`、`enable_control`、`active_power_derating_percentage`、`active_power_percentage`、`remote_charge_discharge_power`。
- `readDeviceDispatch.data` 会随 `setType` 返回数组、对象或数值。
- `POST /oauth2/deviceDispatch` 的参数表把 `value` 写成 `string`，但公开 `setType` 请求形态实际包含数组、对象和数值。
- `POST /oauth2/getDeviceData` 的局部头部表写作 `token`，而全局章节统一写作 `Authorization: Bearer xxxxxxx`。

## 5 联调观察

以下内容来自仓库 `test/` 目录中的环境记录，仅供实现参考：

- 最新全球授权码联调（2026-03-27）在 `POST /oauth2/token` 之前，实际经过了 `GET /#/login?...`、`POST /prod-api/login`、`GET /prod-api/auth` 三步。
- 多份记录使用 JSON body 调用设备级接口。
- 最新全球候选设备记录返回 `deviceSn=WCK6584462`、`datalogSn=ZGQ0E820UH`；设备级接口使用的是 `deviceSn`。
- 最新全球 `bindDevice` 记录使用 `{"deviceSnList":[{"deviceSn":"WCK6584462"}]}` 直接成功，返回 `data: 1`。
- 在同一条授权码实测链路里，这台全球环境设备未要求 `pinCode`；这不改变公开文档中“客户端模式下必填”的规范口径。
- 最新全球 `token` 实测返回 `expires_in=604733`、`refresh_expires_in=2585309`；随后 `refresh` 返回 `expires_in=604800`、`refresh_expires_in=2592000`。
- `POST /oauth2/refresh` 成功后，旧 access token 会立即返回 `TOKEN_IS_INVALID`；后续读取和解绑必须切换到 fresh token。
- 个别记录观察到 `client_credentials` 调 `getDeviceList` 返回 `WRONG_GRANT_TYPE`。

这些现象不应替代端点文档中的 API 说明。

## 6 集成检查清单

- [ ] 已区分 `authorization_code` 与 `client_credentials` 的能力边界
- [ ] 已在两个 token 模式示例中保留 `redirect_uri`
- [ ] 已将 `bindDevice.pinCode` 视为客户端模式必填
- [ ] 已将 `readDeviceDispatch.requestId` 视为必填
- [ ] 面向全球授权码接入时，已处理 `/#/login`、`/prod-api/login`、`/prod-api/auth`
- [ ] 已按运行时返回值读取 `expires_in` / `refresh_expires_in`，而不是写死示例 TTL
- [ ] 已在 `refresh` 成功后立刻替换旧 access token
- [ ] 已按 `10_global_params.md` 中的 7 个公开 `setType` 实现基础映射
- [ ] 已对照 [/growatt-openapi/appendix-terminology](/growatt-openapi/appendix-terminology) 理解公开储能术语
- [ ] 已将联调经验留在兼容层，而不是提升为端点规范
