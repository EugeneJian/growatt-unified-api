# OAuth2-refresh API

## Brief Description

Use this endpoint to replace an access token by presenting a previously issued `refresh_token`. Do not call it when the token response did not include a refresh token.

## Request

- URL: `/oauth2/refresh`
- Method: `POST`
- Content type: `application/x-www-form-urlencoded`

## Refresh Lifecycle

```mermaid
flowchart TD
    A["Protected API call"] --> B{"Access token valid?"}
    B -->|"Yes"| C["Continue API calls"]
    B -->|"No"| D{"Refresh token available?"}
    D -->|"Yes"| E["POST /oauth2/refresh"]
    E --> F{"Refresh successful?"}
    F -->|"Yes"| G["Atomically replace stored token pair"]
    G --> C
    F -->|"No"| H["Restart the applicable authorization flow"]
    D -->|"No"| H
```

```mermaid
sequenceDiagram
    participant Backend as CustomerBackend
    participant OAuth as GrowattOAuthAPI
    participant Store as SecureTokenStore
    participant API as GrowattDeviceAPI

    Backend->>Store: Read refresh token
    Backend->>OAuth: POST /oauth2/refresh
    OAuth-->>Backend: Return new token response
    Backend->>Store: Replace old token data
    Backend->>API: Call with new access token
    API-->>Backend: Return API response
```

## Request Parameters

| Parameter | Required | Description |
| :--- | :--- | :--- |
| `grant_type` | Yes | Must be `refresh_token` |
| `refresh_token` | Yes | Refresh token from the previous token response |
| `client_id` | Yes | Client ID issued to your platform |
| `client_secret` | Yes | Client secret issued to your platform |

## Request Example

```bash
curl --request POST '<api-base-url>/oauth2/refresh' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'grant_type=refresh_token' \
  --data-urlencode 'refresh_token=<masked_refresh_token>' \
  --data-urlencode 'client_id=<example_client_id>' \
  --data-urlencode 'client_secret=<masked_client_secret>'
```

## Response Parameters

| Parameter | Description |
| :--- | :--- |
| `access_token` | Newly issued access token |
| `refresh_token` | Newly issued refresh token; replace the previous refresh token |
| `refresh_expires_in` | New refresh-token lifetime in seconds |
| `token_type` | Token type; `Bearer` |
| `expires_in` | New access-token lifetime in seconds |

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

## Customer Implementation Guidance

- Send form-encoded parameters even though the example is displayed as JSON for readability.
- Replace both stored tokens immediately after a successful refresh; do not continue using the previous token values.
- Update token storage atomically so concurrent requests cannot overwrite the new token pair with stale data.
- Read both lifetime values from the response and refresh early enough to account for clock skew and in-flight requests.
- If refresh fails, restart the authorization flow appropriate to your grant type.

## Related Documentation

- [Get access_token API](./02_api_access_token.md)
- [Device Authorization API](./04_api_device_auth.md)
