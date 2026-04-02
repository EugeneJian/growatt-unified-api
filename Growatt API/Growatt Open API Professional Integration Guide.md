# Growatt Open API Professional Integration Guide

Baseline source: `docs/3 接口列表.md` (synced from the approved vendor document dated April 1, 2026)

This is an entry guide. Endpoint parameters, examples, and response codes remain governed by `Growatt API/OPENAPI/*.md`; this page no longer lets integration observations override the baseline.

## 1 Document Layering

- Baseline source of fact: `docs/3 接口列表.md`
- Chinese split publication docs: `Growatt API/OPENAPI.zh-CN/*.md`
- English split publication docs: `Growatt API/OPENAPI/*.md`
- ESS terminology glossary: [./OPENAPI/12_ess_terminology.md](./OPENAPI/12_ess_terminology.md)
- Integration observations: environment reports under `test/`

## 2 Baseline-Confirmed Integration Paths

### `authorization_code`

1. Call `POST /oauth2/token`
2. Call `POST /oauth2/getDeviceList`
3. Call `POST /oauth2/bindDevice`
4. Continue with device query, dispatch, and read-back APIs

### `client_credentials`

1. Call `POST /oauth2/token`
2. Call `POST /oauth2/bindDevice` directly
3. Call `POST /oauth2/getDeviceListAuthed`
4. Continue with device query, dispatch, and read-back APIs

## 3 API Matrix

| Capability | Endpoint | Baseline Key Input |
| :--- | :--- | :--- |
| Get token | `/oauth2/token` | `grant_type`, `client_id`, `client_secret`, `redirect_uri` |
| Refresh token | `/oauth2/refresh` | `refresh_token`, client credentials |
| Get candidate devices | `/oauth2/getDeviceList` | Bearer token, `authorization_code` only |
| Bind devices | `/oauth2/bindDevice` | `deviceSnList`; `pinCode` required in client mode |
| Get authorized devices | `/oauth2/getDeviceListAuthed` | Bearer token |
| Unbind devices | `/oauth2/unbindDevice` | `deviceSnList` |
| Device information | `/oauth2/getDeviceInfo` | `deviceSn` |
| Device telemetry | `/oauth2/getDeviceData` | `deviceSn` |
| Device dispatch | `/oauth2/deviceDispatch` | `deviceSn`, `setType`, `value`, `requestId` |
| Dispatch read-back | `/oauth2/readDeviceDispatch` | `deviceSn`, `setType`, `requestId` |

## 4 Baseline Items That Need Extra Attention

- Both vendor examples for `POST /oauth2/token` include `redirect_uri`.
- The parameter table for `POST /oauth2/readDeviceDispatch` requires `requestId`, while the vendor sample omits it.
- The parameter table for `POST /oauth2/deviceDispatch` labels `value` as `string`, while the same page publishes an object-valued example.
- The local header table for `POST /oauth2/getDeviceData` uses `token`, while the global section uses `Authorization: Bearer xxxxxxx`.

## 5 Integration Observations (Non-Normative)

The following findings come from environment reports under `test/` and are kept for implementation reference only:

- Multiple reports use JSON bodies for device-level APIs.
- Multiple reports recommend sending raw `deviceSn` values instead of `datalogSn` or display-prefixed labels.
- Some reports observe `WRONG_GRANT_TYPE` when `client_credentials` calls `getDeviceList`.
- Some reports observe object-shaped `readDeviceDispatch.data` values for certain `setType` values.

These findings must not override the endpoint-level baseline.

## 6 Integration Checklist

- [ ] Separated the baseline capability boundary between `authorization_code` and `client_credentials`
- [ ] Kept `redirect_uri` in both token request examples
- [ ] Treated `bindDevice.pinCode` as required in client mode
- [ ] Treated `readDeviceDispatch.requestId` as required
- [ ] Implemented the three `setType` entries published in `10_global_params.md`
- [ ] Aligned public ESS terminology to [./OPENAPI/12_ess_terminology.md](./OPENAPI/12_ess_terminology.md)
- [ ] Kept integration observations in the compatibility layer instead of promoting them into the normative layer
