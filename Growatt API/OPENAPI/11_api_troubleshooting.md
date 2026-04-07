# Troubleshooting FAQ

This page is split into two layers:

- Published API notes: user-facing rules captured in the endpoint docs.
- Integration observations: findings from environment reports under `test/`, kept as implementation references only.

## Published API Notes

### 1. Can `client_credentials` call `getDeviceList` directly?

No.

- `POST /oauth2/getDeviceList` is supported only in `authorization_code` mode.

### 2. When is `pinCode` required in `bindDevice`?

The published parameter table states:

- `deviceSnList[].pinCode`: required in client mode.

### 3. Is `requestId` required in `readDeviceDispatch`?

Yes in the parameter table. The original vendor request sample omits it, but the published split docs continue to treat it as required because the table marks it as required.

### 4. Should `getDeviceData` use `token` or `Authorization` as the header name?

The current published materials contain an internal wording mismatch:

- The local header table in section `3.7` uses `token`
- Section `4 Global Parameters` standardizes `Authorization: Bearer xxxxxxx`

The published split docs follow the global section.

### 5. What are the per-device request limits for telemetry and dispatch?

- Telemetry polling via `getDeviceData`: `1 request / min / device`
- Dispatch and dispatch read-back via `deviceDispatch` / `readDeviceDispatch`: `1 request / 5 sec / device` (`12 RPM`)
- If the per-device limit is exceeded, the API may return `TOO_MANY_REQUEST` with `code` `105`.

## Integration Observations

The following observations come from environment reports under `test/` and are kept for implementation reference only:

- Multiple environment reports use JSON bodies for `bindDevice`, `getDeviceInfo`, `getDeviceData`, `deviceDispatch`, `readDeviceDispatch`, and `unbindDevice`.
- Multiple reports recommend using the raw `deviceSn` for device-level APIs and avoiding `datalogSn` or display-prefixed values.
- Some reports observe `WRONG_GRANT_TYPE` when `client_credentials` calls `getDeviceList`.
- Some reports observe object-shaped `readDeviceDispatch.data` payloads for particular `setType` values.

## Related Documentation

- [Device Authorization API](./04_api_device_auth.md)
- [Read Device Dispatch Parameters API](./06_api_read_dispatch.md)
- [Device Data Query API](./08_api_device_data.md)
- [ESS Terminology Glossary](./12_ess_terminology.md)
