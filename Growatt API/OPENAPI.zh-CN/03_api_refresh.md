# OAuth2-refresh 接口

## 简要描述

- 使用 `refresh_token` 刷新 `access_token`。
- 本接口仅适用于上一次 token 响应已经签发 `refresh_token` 的场景。
- 2026-04-23 AU 全量实测中，`authorization_code` 签发了 refresh token，`client_credentials` 未签发 refresh token。

## 请求 URL

- `/oauth2/refresh`

## 请求方式

- `POST`
- `Content-Type: application/x-www-form-urlencoded`

## 刷新生命周期（概念）

```mermaid
%% 本代码严格遵循AI生成Mermaid代码的终极准则v4.1（Mermaid终极大师）
flowchart TD
    A["使用 access token 调用 API"] --> B{"Token 是否有效"}
    B -->|"是"| C["继续调用业务 API"]
    B -->|"否"| D["调用 oauth2 refresh 接口"]
    D --> E{"刷新是否成功"}
    E -->|"是"| F["保存新的 access token 和 refresh token"]
    F --> C
    E -->|"否"| G["触发重新授权流程"]
```

## 刷新生命周期（时序）

```mermaid
%% 本代码严格遵循AI生成Mermaid代码的终极准则v4.1（Mermaid终极大师）
sequenceDiagram
    participant Service as ServiceAPI
    participant OAuth as OAuthServer
    participant API as API

    Service->>API: 携带 access token 调用 API
    alt Token 有效
        API-->>Service: 返回响应
    else Token 无效
        API-->>Service: 返回 token 无效
        Service->>OAuth: POST /oauth2/refresh
        alt 刷新成功
            OAuth-->>Service: 返回新的 token 对
            Service->>API: 重试 API 调用
            API-->>Service: 返回响应
        else 刷新失败
            OAuth-->>Service: 返回刷新错误
            Service-->>Service: 触发重新授权
        end
    end
```

## 请求参数说明

| 参数名 | 是否必传 | 说明 |
| :--- | :--- | :--- |
| `grant_type` | 是 | 必须为 `refresh_token` |
| `refresh_token` | 是 | 旧的 `refresh_token`，用于换取新的访问令牌；通常来自 `authorization_code` token 响应 |
| `client_id` | 是 | 第三方在平台申请的 `client_id` |
| `client_secret` | 是 | 第三方在平台申请的 `client_secret` |

## 请求示例

```json
{
    "grant_type": "refresh_token",
    "refresh_token": "<masked_refresh_token>",
    "client_id": "<example_client_id>",
    "client_secret": "<masked_client_secret>"
}
```

## 返回参数说明

| 参数名 | 说明 |
| :--- | :--- |
| `access_token` | 新颁发的访问令牌 |
| `refresh_token` | 新颁发的刷新令牌，旧令牌将失效 |
| `refresh_expires_in` | 新刷新令牌有效期，单位：秒 |
| `token_type` | 固定为 `Bearer` |
| `expires_in` | 新访问令牌有效期，单位：秒 |

## 返回示例

```json
{
    "access_token": "<masked_access_token>",
    "refresh_token": "<masked_refresh_token>",
    "refresh_expires_in": 2592000,
    "token_type": "Bearer",
    "expires_in": 604800
}
```

## 实现说明

- 原始来源示例在 JSON 注释排版上有格式问题；本页仅将其改写成等价、可读的 JSON 示例，不改变字段约束。
- 除非 token 响应明确返回了 `refresh_token`，否则不要对 `client_credentials` token 调用本接口。
- 2026-04-23 AU 全量实测确认 `client_credentials` token 响应不包含 `refresh_token` 或 `refresh_expires_in`。
- 2026-03-27 最新全球 `refresh` 实测返回 `expires_in=604800`、`refresh_expires_in=2592000`。
- 在同一轮实测里，`refresh` 成功后旧 access token 会立即返回 `TOKEN_IS_INVALID`。
- 实现时应在刷新成功后立刻替换旧 access token，并始终以实时响应值作为 TTL 依据。

## 相关文档

- [获取 access_token 接口](./02_api_access_token.md)
- [设备授权 API](./04_api_device_auth.md)
