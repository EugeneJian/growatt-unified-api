# Get access_token API

**Brief Description**
- OAuth2, token
- In Authorization Code mode, the Client backend uses the authorization code to exchange for an `access_token`.
- In Client Credentials mode, the Client backend uses `client_id` and `client_secret` to exchange for an `access_token`.

**Request URL**
- `/oauth2/token`

**Request Method**
- `POST`
- In the request header, `ContentType` must be `application/x-www-form-urlencoded;`

---

## Request Parameter Description

| Parameter Name | Parameter Description | Required | Parameter Value Description |
| :--- | :--- | :--- | :--- |
| `grant_type` | Authorization Type | Yes | `authorization_code` or `client_credentials` |
| `code` | Authorization Code | No | Temporary authorization code issued by the authorization server (Required only in `authorization_code` mode) |
| `client_id` | Client ID | Yes | `client_id` applied for by the third-party platform |
| `client_secret` | Client Secret | Yes | `client_secret` applied for by the third-party platform |
| `redirect_uri` | Redirect URI | Yes | Callback URL to redirect to after successful authorization |

---

## Request Example

### authorization_code mode

```json
{
    "grant_type": "authorization_code",
    "code": "by1c6oH8lLpllkczRFxuKnMWTEQPO8GmpqkcnDhOcRjLFF4BU5hBvt6whdmd",
    "client_id": "client123",
    "client_secret": "secret123",
    "redirect_uri": "http://localhost:9290/hello"
}
```

### client_credentials mode

```json
{
    "grant_type": "client_credentials",
    "client_id": "client123",
    "client_secret": "secret123",
    "redirect_uri": "http://localhost:9290/hello"
}
```

---

## Return Parameter Description

| Parameter Name | Parameter Description | Parameter Value Description |
| :--- | :--- | :--- |
| `access_token` | Access Token | Token used to access protected resources |
| `refresh_token` | Refresh Token | Token used to refresh the `access_token` |
| `refresh_expires_in` | Refresh Token Validity Period | Unit: seconds |
| `token_type` | Token Type | Fixed as `Bearer` |
| `expires_in` | Access Token Validity Period | Unit: seconds |

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

- [Authentication Guide](../01_authentication.md)
- [OAuth2-refresh API](../03_api_refresh.md)
