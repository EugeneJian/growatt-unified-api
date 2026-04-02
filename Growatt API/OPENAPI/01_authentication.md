# Growatt Open API - Authentication Guide

This page summarizes the supported authentication modes and capability boundaries for Growatt Open API. If later environment testing behaves differently, treat that behavior as an observation rather than as a replacement for the endpoint descriptions documented here.

## Supported Grant Types

| `grant_type` | Meaning | Capability boundary |
| :--- | :--- | :--- |
| `authorization_code` | End-user authorization code exchanged for `access_token` | Supports `POST /oauth2/getDeviceList` |
| `client_credentials` | Platform obtains `access_token` with `client_id` / `client_secret` | `POST /oauth2/bindDevice` requires `pinCode` in client mode |

## Token Rules

- Both grant types use `POST /oauth2/token` to obtain `access_token`.
- Both token request examples include `redirect_uri`.
- `POST /oauth2/refresh` requires a `refresh_token`; this documentation does not further split refresh behavior by grant type.
- The token field table lists `access_token`, `refresh_token`, `refresh_expires_in`, `token_type`, and `expires_in` as one shared response model.

## Capability Matrix

| Capability | `authorization_code` | `client_credentials` |
| :--- | :--- | :--- |
| Get access token | Supported | Supported |
| Refresh access token | Provided by `POST /oauth2/refresh` | Same endpoint behavior is published for both modes |
| Get candidate devices `getDeviceList` | Supported | Not supported |
| Bind devices `bindDevice` | Supported | Supported, and `pinCode` is required in client mode |
| Get authorized devices `getDeviceListAuthed` | Supported | Supported |

## Implementation Pointers

- For endpoint parameters and examples, continue with [Get access_token API](./02_api_access_token.md) and [Device Authorization API](./04_api_device_auth.md).
- For environment-specific findings, use the explicitly labeled observation section in [Troubleshooting FAQ](./11_api_troubleshooting.md).
