# Get access_token API

## Brief Description

- Use `POST /oauth2/token` to obtain the `access_token` required to call Growatt Open API.
- The vendor baseline explicitly supports two `grant_type` values: `authorization_code` and `client_credentials`.
- The April 1, 2026 baseline publishes one shared response field table and one shared response example for both modes; it does not split token fields by mode.

## Request URL

- `/oauth2/token`

## Request Method

- `POST`
- `Content-Type: application/x-www-form-urlencoded`

## Request Parameters

| Parameter | Required | Description |
| :--- | :--- | :--- |
| `grant_type` | Yes | `authorization_code` or `client_credentials` |
| `code` | Required in authorization-code mode | Temporary authorization code issued by the authorization server |
| `client_id` | Yes | The `client_id` issued to the third-party platform |
| `client_secret` | Yes | The `client_secret` issued to the third-party platform |
| `redirect_uri` | Yes | Redirect URL used after authorization |

## Request Examples

### `authorization_code` Mode

```json
{
    "grant_type": "authorization_code",
    "code": "<masked_authorization_code>",
    "client_id": "<example_client_id>",
    "client_secret": "<masked_client_secret>",
    "redirect_uri": "https://third-party.example.com/oauth/callback"
}
```

### `client_credentials` Mode

```json
{
    "grant_type": "client_credentials",
    "client_id": "<example_client_id>",
    "client_secret": "<masked_client_secret>",
    "redirect_uri": "https://third-party.example.com/oauth/callback"
}
```

## Response Parameters

| Parameter | Description |
| :--- | :--- |
| `access_token` | Access token used to call protected resources |
| `refresh_token` | Refresh token used to refresh `access_token` |
| `refresh_expires_in` | Refresh-token TTL in seconds |
| `token_type` | Fixed as `Bearer` |
| `expires_in` | Access-token TTL in seconds |

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

## Baseline Note

- The vendor baseline does not publish a separate “minimum response” model for `client_credentials`.
- This page therefore no longer promotes claims such as “`client_credentials` normally omits `refresh_token`” into the normative layer.

## Related Documentation

- [Authentication Guide](./01_authentication.md)
- [OAuth2-refresh API](./03_api_refresh.md)
