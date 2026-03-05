# OAuth2-refresh API

**Brief Description**
- OAuth2, refresh
- The Client backend uses `refresh_token` to refresh the `access_token`.

**Request URL**
- `/oauth2/refresh`

**Request Method**
- `POST`
- In the request header, `ContentType` must be `application/x-www-form-urlencoded;`

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

---

## Request Parameter Description

| Parameter Name | Parameter Description | Required | Parameter Value Description |
| :--- | :--- | :--- | :--- |
| `grant_type` | Authorization Type | Yes | Must be `refresh_token` |
| `refresh_token` | Refresh Token | Yes | The old `refresh_token`, used to exchange for a new access token |
| `client_id` | Client ID | Yes | `client_id` applied for by the third-party platform |
| `client_secret` | Client Secret | Yes | `client_secret` applied for by the third-party platform |

---

## Request Example

```json
{
    "grant_type": "refresh_token",
    "refresh_token": "bkabsDaCYRWVPHMPqYij1O2rEWPNc34dH97FmQsDzuaopf1RxdDofp63HL4x",
    "client_id": "client123",
    "client_secret": "secret123"
}
```

---

## Return Parameter Description

| Parameter Name | Parameter Description | Parameter Value Description |
| :--- | :--- | :--- |
| `access_token` | Access Token | The newly issued access token |
| `refresh_token` | Refresh Token | The newly issued refresh token (the old token will become invalid) |
| `refresh_expires_in` | New Refresh Token Validity Period | Unit: seconds |
| `token_type` | Token Type | Fixed as `Bearer` |
| `expires_in` | New Access Token Validity Period | Unit: seconds |

---

## Return Example

```json
// Authorization successful, HTTP status code 200
{
    "access_token": "avYDaEcmPfaphbE8oDmraKM6FOzq7nYI42iz4KTLClpvWegyREQnyiYUG2VA",
    "refresh_token": "BG6DGTZYpZPq0PHei3N4Rvb2yjM4YMZEFrvrf1A8LxI1xKbH2aEOHG3zfNy9",
    "refresh_expires_in": 2592000,
    "token_type": "Bearer",
    "expires_in": 7200
}
```

---

## Related Documentation

- [Get access_token API](../02_api_access_token.md)
- [Device Authorization API](../04_api_device_auth.md)
