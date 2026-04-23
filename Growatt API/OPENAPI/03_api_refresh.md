# OAuth2-refresh API

## Brief Description

- Use `refresh_token` to refresh `access_token`.
- This endpoint applies only when the previous token response issued a `refresh_token`.
- In the 2026-04-23 AU full run, `authorization_code` issued a refresh token and `client_credentials` did not.

## Request URL

- `/oauth2/refresh`

## Request Method

- `POST`
- `Content-Type: application/x-www-form-urlencoded`

## Refresh Lifecycle (Concept)

```mermaid
%% 本代码严格遵循AI生成Mermaid代码的终极准则v4.1（Mermaid终极大师）
flowchart TD
    A["API call with access token"] --> B{"Token valid"}
    B -->|"Yes"| C["Continue business API calls"]
    B -->|"No"| D["Call oauth2 refresh API"]
    D --> E{"Refresh success"}
    E -->|"Yes"| F["Store new access token and refresh token"]
    F --> C
    E -->|"No"| G["Trigger re authorization flow"]
```

## Refresh Lifecycle (Sequence)

```mermaid
%% 本代码严格遵循AI生成Mermaid代码的终极准则v4.1（Mermaid终极大师）
sequenceDiagram
    participant Service as ServiceAPI
    participant OAuth as OAuthServer
    participant API as API

    Service->>API: Call API with access token
    alt Token valid
        API-->>Service: Return response
    else Token invalid
        API-->>Service: Return token invalid
        Service->>OAuth: POST /oauth2/refresh
        alt Refresh success
            OAuth-->>Service: Return new token pair
            Service->>API: Retry API call
            API-->>Service: Return response
        else Refresh failed
            OAuth-->>Service: Return refresh error
            Service-->>Service: Trigger re-authorization
        end
    end
```

## Request Parameters

| Parameter | Required | Description |
| :--- | :--- | :--- |
| `grant_type` | Yes | Must be `refresh_token` |
| `refresh_token` | Yes | Previous refresh token used to obtain a new access token; normally from an `authorization_code` token response |
| `client_id` | Yes | The `client_id` issued to the third-party platform |
| `client_secret` | Yes | The `client_secret` issued to the third-party platform |

## Request Example

```json
{
    "grant_type": "refresh_token",
    "refresh_token": "<masked_refresh_token>",
    "client_id": "<example_client_id>",
    "client_secret": "<masked_client_secret>"
}
```

## Response Parameters

| Parameter | Description |
| :--- | :--- |
| `access_token` | Newly issued access token |
| `refresh_token` | Newly issued refresh token; the old one becomes invalid |
| `refresh_expires_in` | New refresh-token TTL in seconds |
| `token_type` | Fixed as `Bearer` |
| `expires_in` | New access-token TTL in seconds |

## Response Example

```json
{
    "access_token": "<masked_access_token>",
    "refresh_token": "<masked_refresh_token>",
    "refresh_expires_in": 2592000,
    "token_type": "Bearer",
    "expires_in": 604800
}
```

## Implementation Note

- The original source sample mixes JSON and inline comments in a malformed way; this page rewrites it into equivalent readable JSON without changing the field contract.
- Do not call this endpoint for a `client_credentials` token unless the token response explicitly included `refresh_token`.
- The 2026-04-23 AU full run confirmed that `client_credentials` token responses did not include `refresh_token` or `refresh_expires_in`.
- The latest global refresh run on 2026-03-27 returned `expires_in=604800` and `refresh_expires_in=2592000`.
- In that same run, the previous access token immediately returned `TOKEN_IS_INVALID` after a successful refresh.
- Replace the old access token immediately after refresh, and always treat the live response as the TTL source of truth.

## Related Documentation

- [Get access_token API](./02_api_access_token.md)
- [Device Authorization API](./04_api_device_auth.md)
