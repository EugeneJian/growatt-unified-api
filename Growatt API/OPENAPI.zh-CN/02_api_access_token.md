# 获取 access_token 接口

**简要说明**

- 使用 `POST /oauth2/token` 获取访问 Growatt Open API 所需的 `access_token`。
- 支持 `authorization_code` 与 `client_credentials` 两种 `grant_type`。
- 不同模式返回字段存在差异，客户端必须以实际响应体为准。

**请求 URL**

- `/oauth2/token`

**请求方式**

- `POST`
- `Content-Type: application/x-www-form-urlencoded`

## Token 交换时序

```mermaid
%% 本代码严格遵循AI生成Mermaid代码的终极准则v4.1（Mermaid终极大师）
sequenceDiagram
    participant Client as ClientApp
    participant Service as IntegrationService
    participant OAuth as OAuthServer

    Client->>Service: 触发 token 获取
    Service->>OAuth: POST /oauth2/token
    OAuth-->>Service: 返回 token 响应
    Service-->>Client: 保存可用 token
```

---

## 请求参数说明

| 参数名 | 必填 | 适用模式 | 说明 |
| :--- | :--- | :--- | :--- |
| `grant_type` | 是 | 全部 | `authorization_code` 或 `client_credentials` |
| `code` | 授权码模式必填 | `authorization_code` | Growatt 返回的授权码 |
| `client_id` | 是 | 全部 | 第三方平台申请的客户端 ID |
| `client_secret` | 是 | 全部 | 第三方平台申请的客户端密钥 |
| `redirect_uri` | 授权码模式必填 | `authorization_code` | 授权成功后回跳的地址 |

---

## 请求示例

### `authorization_code` 模式

```json
{
    "grant_type": "authorization_code",
    "code": "by1c6oH8lLpllkczRFxuKnMWTEQPO8GmpqkcnDhOcRjLFF4BU5hBvt6whdmd",
    "client_id": "client123",
    "client_secret": "secret123",
    "redirect_uri": "http://localhost:9290/hello"
}
```

> 示例中的 TTL 仅用于说明字段形态。生产或测试环境的实际 `expires_in` / `refresh_expires_in` 以实时返回值为准。

### `client_credentials` 模式

```json
{
    "grant_type": "client_credentials",
    "client_id": "client123",
    "client_secret": "secret123"
}
```

---

## 返回参数说明

| 参数名 | 返回时机 | 说明 |
| :--- | :--- | :--- |
| `access_token` | 全部 | 访问受保护资源所需的访问令牌 |
| `token_type` | 全部 | 固定为 `Bearer` |
| `expires_in` | 全部 | 当前 `access_token` 有效期，单位：秒 |
| `refresh_token` | 授权码模式返回 | 用于刷新 `access_token` 的刷新令牌 |
| `refresh_expires_in` | 授权码模式返回 | `refresh_token` 有效期，单位：秒 |

> `client_credentials` 模式下不要默认假定一定返回 `refresh_token`。如某个环境有额外字段，以该环境实际返回为准。

---

## 返回示例

### `authorization_code` 模式

```json
{
    "access_token": "avYDaEcmPfaphbE8oDmraKM6FOzq7nYI42iz4KTLClpvWegyREQnyiYUG2VA",
    "refresh_token": "BG6DGTZYpZPq0PHei3N4Rvb2yjM4YMZEFrvrf1A8LxI1xKbH2aEOHG3zfNy9",
    "refresh_expires_in": 2592000,
    "token_type": "Bearer",
    "expires_in": 7200
}
```

### `client_credentials` 模式

```json
{
    "access_token": "3s91d7ErRkTczOHkQronnfT3oc9jckXefj6Kp0HMaMkCbiHUpIhGtrf9a90P",
    "token_type": "Bearer",
    "expires_in": 604800
}
```

### 9290 测试环境兼容说明

`https://api-test.growatt.com:9290` 已验证的 `client_credentials` 响应为上面的精简结构，即不默认返回 `refresh_token`。

---

## 相关文档

- [身份认证说明](./01_authentication.md)
- [OAuth2-refresh 接口](./03_api_refresh.md)
