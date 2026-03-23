# Growatt Open API Professional Integration Guide (SSOT Aligned)

Version: 1.2 | Alignment Baseline: OPENAPI V1.0 | Date: March 23, 2026

This guide is an entry document for solution architects, backend engineers, and integration teams. The endpoint-level SSOT is `Growatt API/OPENAPI/*.md`. If this guide conflicts with an endpoint document, follow the endpoint document.

---

## 1 SSOT and Document Layering

Primary specification:

- [Authentication Guide](./OPENAPI/01_authentication.md)
- [Get access_token API](./OPENAPI/02_api_access_token.md)
- [OAuth2-refresh API](./OPENAPI/03_api_refresh.md)
- [Device Authorization API](./OPENAPI/04_api_device_auth.md)
- [Device Dispatch API](./OPENAPI/05_api_device_dispatch.md)
- [Read Device Dispatch Parameters API](./OPENAPI/06_api_read_dispatch.md)
- [Device Information Query API](./OPENAPI/07_api_device_info.md)
- [Device Data Query API](./OPENAPI/08_api_device_data.md)
- [Device Data Push API](./OPENAPI/09_api_device_push.md)
- [Global Parameter Description](./OPENAPI/10_global_params.md)

Compatibility facts:

- [9290 Troubleshooting FAQ](./OPENAPI/11_api_troubleshooting.md)
- Integration reports under `test/`

---

## 2 OAuth Mode Boundary

### `authorization_code`

- Intended for end-user login and consent inside the third-party platform.
- `POST /oauth2/token` returns a `refresh_token`.
- `POST /oauth2/getDeviceList` is supported only in this mode.

### `client_credentials`

- Intended for direct platform-to-platform integrations.
- A `refresh_token` must not be assumed; rely on the actual response.
- Device onboarding typically starts from `POST /oauth2/bindDevice`.
- `POST /oauth2/getDeviceList` is not the standard discovery interface for this mode.

---

## 3 Recommended Integration Path

```mermaid
%% 本代码严格遵循AI生成Mermaid代码的终极准则v4.1（Mermaid终极大师）
flowchart TD
    A["Obtain client_id / client_secret"] --> B{"Choose OAuth mode"}
    B -->|"authorization_code"| C["User logs into Growatt and exchanges a token pair"]
    B -->|"client_credentials"| D["Obtain access token directly"]
    C --> E["getDeviceList -> bindDevice"]
    D --> F["bindDevice"]
    E --> G["getDeviceInfo / getDeviceData"]
    F --> G
    G --> H["deviceDispatch -> readDeviceDispatch"]
    G --> I["Receive dfcData push"]
```

---

## 4 API Matrix

| Capability | Endpoint | Key Input |
| :--- | :--- | :--- |
| Get token | `/oauth2/token` | `grant_type`, client credentials |
| Refresh token | `/oauth2/refresh` | `refresh_token` |
| Candidate device list | `/oauth2/getDeviceList` | Bearer token, `authorization_code` only |
| Bind device | `/oauth2/bindDevice` | `deviceSnList` |
| Authorized device list | `/oauth2/getDeviceListAuthed` | Bearer token |
| Unbind device | `/oauth2/unbindDevice` | `deviceSnList` |
| Device information | `/oauth2/getDeviceInfo` | `deviceSn` |
| Device telemetry | `/oauth2/getDeviceData` | `deviceSn` |
| Device dispatch | `/oauth2/deviceDispatch` | `deviceSn`, `setType`, `value`, `requestId` |
| Dispatch read-back | `/oauth2/readDeviceDispatch` | `deviceSn`, `setType` |

---

## 5 Dispatch and Telemetry Conventions

- The normative `deviceDispatch` request body is JSON and `requestId` is required.
- The normative `readDeviceDispatch` interface requires only `deviceSn` and `setType`; `data` may be either an object or an array depending on `setType`.
- The primary telemetry model is centered on `meterPower`, `reactivePower`, `serialNum`, and `batteryList[].soh`.
- Historical materials that use `activePower`, `reverActivePower`, or top-level `soc` should be handled as compatibility fields only.

---

## 6 9290 Test-Environment Notes

The following have been verified on `https://api-test.growatt.com:9290`:

- `/oauth2/getDeviceList` returns `WRONG_GRANT_TYPE` under `client_credentials`
- `bindDevice`, `getDeviceInfo`, `getDeviceData`, `deviceDispatch`, `readDeviceDispatch`, and `unbindDevice` use JSON bodies
- SN values must be raw and must not include `SPH:` / `SPM:` prefixes
- `getDeviceData` and push payloads may still expose historical compatibility fields

These are environment facts and do not override the primary specification.

---

## 7 Integration Checklist

- [ ] Separated `authorization_code` and `client_credentials` capability boundaries
- [ ] Implemented `/oauth2/token`
- [ ] Implemented `/oauth2/refresh` when `refresh_token` exists
- [ ] Switched to the new endpoint names: `getDeviceList` / `getDeviceListAuthed` / `readDeviceDispatch`
- [ ] Made `requestId` mandatory in `deviceDispatch`
- [ ] Parse `readDeviceDispatch.data` according to `setType`
- [ ] Consume telemetry using the primary field model
- [ ] Keep 9290 differences isolated to the compatibility layer
