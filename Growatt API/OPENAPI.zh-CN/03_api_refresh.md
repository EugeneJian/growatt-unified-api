# OAuth2-refresh 接口

**简要说明**
- OAuth2，refresh
- Client 后端使用 `refresh_token` 刷新 `access_token`。

**请求 URL**
- `/oauth2/refresh`

**请求方式**
- `POST`
- 请求头中的 `ContentType` 必须为 `application/x-www-form-urlencoded;`

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

---

## 请求参数说明

| 参数名 | 参数说明 | 必填 | 参数值说明 |
| :--- | :--- | :--- | :--- |
| `grant_type` | 授权类型 | 是 | 必须为 `refresh_token` |
| `refresh_token` | 刷新令牌 | 是 | 旧的 `refresh_token`，用于换取新的访问令牌 |
| `client_id` | 客户端 ID | 是 | 第三方平台申请的 `client_id` |
| `client_secret` | 客户端密钥 | 是 | 第三方平台申请的 `client_secret` |

---

## 请求示例

```json
{
    "grant_type": "refresh_token",
    "refresh_token": "bkabsDaCYRWVPHMPqYij1O2rEWPNc34dH97FmQsDzuaopf1RxdDofp63HL4x",
    "client_id": "client123",
    "client_secret": "secret123"
}
```

---

## 返回参数说明

| 参数名 | 参数说明 | 参数值说明 |
| :--- | :--- | :--- |
| `access_token` | 访问令牌 | 新签发的访问令牌 |
| `refresh_token` | 刷新令牌 | 新签发的刷新令牌（旧令牌失效） |
| `refresh_expires_in` | 新 refresh token 有效期 | 单位：秒 |
| `token_type` | Token 类型 | 固定为 `Bearer` |
| `expires_in` | 新 access token 有效期 | 单位：秒 |

---

## 返回示例

```json
// 授权成功，HTTP 状态码 200
{
    "access_token": "avYDaEcmPfaphbE8oDmraKM6FOzq7nYI42iz4KTLClpvWegyREQnyiYUG2VA",
    "refresh_token": "BG6DGTZYpZPq0PHei3N4Rvb2yjM4YMZEFrvrf1A8LxI1xKbH2aEOHG3zfNy9",
    "refresh_expires_in": 2592000,
    "token_type": "Bearer",
    "expires_in": 7200
}
```

---

## 相关文档

- [获取 access_token 接口](../02_api_access_token.md)
- [设备授权 API](../04_api_device_auth.md)
