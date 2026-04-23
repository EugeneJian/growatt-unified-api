# Growatt Open API 文档

本目录是面向站点发布的中文拆分文档，负责按端点组织说明、补足交叉引用，并将联调观察与主要 API 描述分开展示。

## 集成路线图（概念）

```mermaid
%% 本代码严格遵循AI生成Mermaid代码的终极准则v4.1（Mermaid终极大师）
flowchart TD
    A["01 身份认证"] --> B["02 获取 access token"]
    B --> C["03 refresh token 生命周期"]
    C --> D["04 设备授权"]
    D --> E["07 设备信息"]
    D --> F["08 设备数据查询"]
    D --> G["09 设备数据推送"]
    F --> H["05 设备下发"]
    H --> I["06 读取下发参数"]
    G --> H
    I --> J["10 全局参数"]
    J --> K["11 常见问题与排查"]
```

## 集成路线图（请求顺序）

```mermaid
%% 本代码严格遵循AI生成Mermaid代码的终极准则v4.1（Mermaid终极大师）
sequenceDiagram
    participant Platform as PlatformApp
    participant OAuth as OAuthAPI
    participant Device as DeviceAPI
    participant Push as WebhookAPI

    Platform->>OAuth: POST /oauth2/token
    OAuth-->>Platform: 返回 access token 或 token 对
    Platform->>OAuth: 执行 bindDevice 流程
    OAuth-->>Platform: 返回已授权设备集合
    Platform->>Device: 查询设备信息与数据
    Device-->>Platform: 返回遥测数据
    Platform->>Device: 下发控制并回读
    Device-->>Platform: 返回控制结果
    Push-->>Platform: 推送 dfcData
    Platform->>OAuth: 需要时调用 POST /oauth2/refresh
```

## 文档结构

| 文件 | 说明 |
| :--- | :--- |
| [01_authentication.md](./01_authentication.md) | 身份认证说明 |
| [02_api_access_token.md](./02_api_access_token.md) | 获取 `access_token` |
| [03_api_refresh.md](./03_api_refresh.md) | 刷新 `access_token` |
| [04_api_device_auth.md](./04_api_device_auth.md) | 设备授权与解除授权 |
| [05_api_device_dispatch.md](./05_api_device_dispatch.md) | 设备调度 |
| [06_api_read_dispatch.md](./06_api_read_dispatch.md) | 读取设备调度参数 |
| [07_api_device_info.md](./07_api_device_info.md) | 设备信息查询 |
| [08_api_device_data.md](./08_api_device_data.md) | 设备数据查询 |
| [09_api_device_push.md](./09_api_device_push.md) | 设备数据推送 |
| [10_global_params.md](./10_global_params.md) | 全局参数说明 |
| [11_api_troubleshooting.md](./11_api_troubleshooting.md) | 常见问题与排查 FAQ |

## 快速导航

- [身份认证说明](./01_authentication.md)
- [获取 access_token 接口](./02_api_access_token.md)
- [OAuth2-refresh 接口](./03_api_refresh.md)
- [设备授权 API](./04_api_device_auth.md)
- [设备调度 API](./05_api_device_dispatch.md)
- [读取设备调度参数 API](./06_api_read_dispatch.md)
- [设备信息查询 API](./07_api_device_info.md)
- [设备数据查询 API](./08_api_device_data.md)
- [设备数据推送 API](./09_api_device_push.md)
- [全局参数说明](./10_global_params.md)
- [常见问题与排查 FAQ](./11_api_troubleshooting.md)

## 关键说明

- `authorization_code` token 请求要求 `redirect_uri`，并返回可刷新的 token 集。
- `client_credentials` token 请求可不携带 `redirect_uri`；2026-04-23 AU 实测返回 access-token-only 字段。
- `POST /oauth2/getDeviceList` 仅在 `authorization_code` 模式下支持。
- `POST /oauth2/bindDevice` 中，`deviceSnList[].pinCode` 在客户端模式下必填。
- `POST /oauth2/readDeviceDispatch` 的参数表将 `requestId` 标为必填。
- 测试环境域名包含 `https://opencloud-test-au.growatt.com`。

## 入口指南

如需阅读整合型说明，请参阅：

- [../Growatt Open API Professional Integration Guide.zh-CN.md](../Growatt Open API Professional Integration Guide.zh-CN.md)

## 附录

- [附录A Growatt Codes](/growatt-openapi/growatt-codes)
- [附录B 术语表](./12_ess_terminology.md)
- [附录C 语义模型](./13_ess_semantic_model.md)
