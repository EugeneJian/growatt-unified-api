# Get access_token API

**Brief Description**

- `POST /oauth2/token` returns the `access_token` required for Growatt Open API calls.
- Both `authorization_code` and `client_credentials` are supported.
- The response shape depends on the grant type and deployment; clients must follow the actual response body instead of assuming extra fields.

**Request URL**

- `/oauth2/token`

**Request Method**

- `POST`
- `Content-Type: application/x-www-form-urlencoded`

## Token Exchange Sequence

```mermaid
%% 本代码严格遵循AI生成Mermaid代码的终极准则v4.1（Mermaid终极大师）
sequenceDiagram
    participant Client as ClientApp
    participant Service as IntegrationService
    participant OAuth as OAuthServer

    Client->>Service: Trigger token acquisition
    Service->>OAuth: POST /oauth2/token
    OAuth-->>Service: Return token response
    Service-->>Client: Store usable token data
```

---

## Request Parameters

| Parameter | Required | Applies To | Description |
| :--- | :--- | :--- | :--- |
| `grant_type` | Yes | All | `authorization_code` or `client_credentials` |
| `code` | Required in authorization-code mode | `authorization_code` | Authorization code returned by Growatt |
| `client_id` | Yes | All | Client ID issued to the third-party platform |
| `client_secret` | Yes | All | Client secret issued to the third-party platform |
| `redirect_uri` | Required in authorization-code mode | `authorization_code` | Redirect URI configured for the OAuth flow |

---

## Request Examples

### `authorization_code` mode

```json
{
    "grant_type": "authorization_code",
    "code": "<masked_authorization_code>",
    "client_id": "<example_client_id>",
    "client_secret": "<masked_client_secret>",
    "redirect_uri": "https://third-party.example.com/oauth/callback"
}
```

> The TTL values in the example are illustrative only. In production or test environments, always trust the returned `expires_in` / `refresh_expires_in` values.

### `client_credentials` mode

```json
{
    "grant_type": "client_credentials",
    "client_id": "<example_client_id>",
    "client_secret": "<masked_client_secret>"
}
```

---

## Response Parameters

| Parameter | Returned When | Description |
| :--- | :--- | :--- |
| `access_token` | All | Access token used to call protected APIs |
| `token_type` | All | Fixed value `Bearer` |
| `expires_in` | All | Access-token lifetime in seconds |
| `refresh_token` | Authorization-code response | Refresh token used to obtain a new access token |
| `refresh_expires_in` | Authorization-code response | Refresh-token lifetime in seconds |

> Do not assume that `client_credentials` always returns `refresh_token`. If a deployment adds extra fields, trust the real response from that environment.

---

## Response Examples

### `authorization_code` mode

```json
{
    "access_token": "<masked_access_token>",
    "refresh_token": "<masked_refresh_token>",
    "refresh_expires_in": 2592000,
    "token_type": "Bearer",
    "expires_in": 7200
}
```

### `client_credentials` mode

```json
{
    "access_token": "<masked_access_token>",
    "token_type": "Bearer",
    "expires_in": 604800
}
```

### Response Variability Note

The compact `client_credentials` example above reflects the minimum response shape. A deployment may append extra fields, but clients must not assume a default `refresh_token`.

---

## Related Documentation

- [Authentication Guide](./01_authentication.md)
- [OAuth2-refresh API](./03_api_refresh.md)
