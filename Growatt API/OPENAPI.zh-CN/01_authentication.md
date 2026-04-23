# Growatt Open API - 身份认证说明

本页整理 Growatt Open API 支持的认证模式与能力边界；若后续环境联调出现差异，应视为环境观察，不应替代本页的端点说明。

## 推荐集成流程

```mermaid
%% 本代码严格遵循AI生成Mermaid代码的终极准则v4.1（Mermaid终极大师）
flowchart TD
    A["开始集成"] --> B{"选择 OAuth 模式"}
    B -->|"授权码模式"| C["打开 Growatt 登录页"]
    B -->|"客户端凭证模式"| D["调用 oauth2 token 接口"]
    C --> E["获取 authorization code"]
    E --> F["用 code 换取 access token"]
    D --> G["获取 access token"]
    F --> H["调用设备授权接口"]
    G --> H
    H --> I["调用业务接口"]
    I --> J{"Token 是否过期"}
    J -->|"是"| K["调用 oauth2 refresh 接口"]
    K --> I
    J -->|"否"| L["继续业务操作"]
```

## 支持的授权模式

| `grant_type` | 说明 | 能力边界 |
| :--- | :--- | :--- |
| `authorization_code` | 终端用户授权码换取 `access_token` | 支持 `POST /oauth2/getDeviceList` |
| `client_credentials` | 平台通过 `client_id` / `client_secret` 获取 `access_token` | `POST /oauth2/bindDevice` 时客户端模式需要 `pinCode` |

## Token 相关规则

- 两种模式都通过 `POST /oauth2/token` 获取 `access_token`。
- `authorization_code` 模式下，`redirect_uri` 必填，token 响应返回 `access_token`、`refresh_token`、`refresh_expires_in`、`token_type`、`expires_in`。
- `client_credentials` 模式下，`redirect_uri` 为可选 / 兼容接受字段。2026-04-23 AU 全量实测中，携带或不携带 `redirect_uri` 均可获取 token，响应仅返回 `access_token`、`token_type`、`expires_in`。
- `POST /oauth2/refresh` 仅适用于上一次 token 响应签发了 `refresh_token` 的场景；不要默认假设 `client_credentials` token 一定可以刷新。

## 能力矩阵

| 能力 | `authorization_code` | `client_credentials` |
| :--- | :--- | :--- |
| 获取 access token | 支持 | 支持 |
| 刷新 access token | 签发了 `refresh_token` 时支持 | 2026-04-23 AU `client_credentials` 响应未签发 `refresh_token`，因此不可按 refresh 流程处理 |
| 获取可授权设备列表 `getDeviceList` | 支持 | 不支持 |
| 授权设备 `bindDevice` | 支持 | 支持，且 `pinCode` 为客户端模式必填 |
| 获取已授权设备列表 `getDeviceListAuthed` | 支持 | 支持 |

## OAuth2.0 授权流程总览

```mermaid
%% 本代码严格遵循AI生成Mermaid代码的终极准则v4.1（Mermaid终极大师）
sequenceDiagram
    participant User as EndUser
    participant App as ClientApp
    participant Server as BackendServer
    participant Growatt as GrowattAPI

    User->>App: 发起操作
    App->>Server: 需要有效 token
    Server-->>App: 跳转到登录流程
    App->>Growatt: 用户登录
    Growatt-->>App: 校验凭据
    App->>Server: 发送授权上下文
    Server->>Growatt: 用 code 换取 token
    Growatt-->>Server: 返回 token 响应
    Server->>Growatt: 携带 access token 调用 API
    Growatt-->>Server: 返回接口结果
    Server-->>App: 返回结果
    App-->>User: 展示结果

    Note over Server,Growatt: 签发 refresh token 时可在过期后刷新
```

## 实施提示

- 如果只需要端点参数与示例，请继续阅读 [获取 access_token 接口](./02_api_access_token.md) 与 [设备授权 API](./04_api_device_auth.md)。
- 如果需要环境联调经验，请阅读 [常见问题与排查 FAQ](./11_api_troubleshooting.md) 中的“联调观察”部分。
