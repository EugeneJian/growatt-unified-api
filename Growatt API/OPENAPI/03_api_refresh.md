# OAuth2-refresh API

**Brief Description**

- Refreshes an expired `access_token` by using `refresh_token`.
- This API applies to flows where the token response actually includes `refresh_token`.
- If a `client_credentials` deployment does not return `refresh_token`, do not call this endpoint; obtain a new token instead.

**Request URL**

- `/oauth2/refresh`

**Request Method**

- `POST`
- `Content-Type: application/x-www-form-urlencoded`

## Refresh Lifecycle

```mermaid
%% 本代码严格遵循AI生成Mermaid代码的终极准则v4.1（Mermaid终极大师）
flowchart TD
    A["Call business API with access token"] --> B{"Token valid"}
    B -->|"Yes"| C["Continue API calls"]
    B -->|"No and refresh_token exists"| D["Call POST /oauth2/refresh"]
    B -->|"No and no refresh_token"| E["Get a new token or re-authorize"]
    D --> F{"Refresh successful"}
    F -->|"Yes"| G["Store the new token pair"]
    F -->|"No"| H["Re-authorize"]
    G --> C
```

---

## Request Parameters

| Parameter | Required | Description |
| :--- | :--- | :--- |
| `grant_type` | Yes | Fixed value `refresh_token` |
| `refresh_token` | Yes | Existing refresh token |
| `client_id` | Yes | Client ID issued to the third-party platform |
| `client_secret` | Yes | Client secret issued to the third-party platform |

---

## Request Example

```json
{
    "grant_type": "refresh_token",
    "refresh_token": "<masked_refresh_token>",
    "client_id": "<example_client_id>",
    "client_secret": "<masked_client_secret>"
}
```

---

## Response Parameters

| Parameter | Description |
| :--- | :--- |
| `access_token` | Newly issued access token |
| `refresh_token` | Newly issued refresh token |
| `refresh_expires_in` | Refresh-token lifetime in seconds |
| `token_type` | Fixed value `Bearer` |
| `expires_in` | Access-token lifetime in seconds |

---

## Response Example

```json
{
    "access_token": "<masked_access_token>",
    "refresh_token": "<masked_refresh_token>",
    "refresh_expires_in": 2592000,
    "token_type": "Bearer",
    "expires_in": 7200
}
```

---

## Related Documentation

- [Get access_token API](./02_api_access_token.md)
- [Device Authorization API](./04_api_device_auth.md)
