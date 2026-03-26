# Troubleshooting FAQ

Version: V1.0 | Release Date: March 12, 2026

This page summarizes common integration failures and the corrective actions that align with the endpoint-level documents. If anything here conflicts with an endpoint-level document, follow the endpoint-level specification first.

Recommended companion reading:

- [Device Authorization API](./04_api_device_auth.md)
- [Device Information Query API](./07_api_device_info.md)
- [Device Data Query API](./08_api_device_data.md)

---

## Verified Client-Credentials Success Path

Under `client_credentials`, the following sequence has been verified:

1. `POST /oauth2/token`
2. `POST /oauth2/bindDevice`
3. `POST /oauth2/getDeviceInfo`
4. `POST /oauth2/getDeviceData`
5. `POST /oauth2/deviceDispatch`
6. `POST /oauth2/readDeviceDispatch`
7. `POST /oauth2/unbindDevice`

---

## FAQ

### 1. Why does `getDeviceList` fail under `client_credentials`?

Calling `POST /oauth2/getDeviceList` with a `client_credentials` token is outside the supported mode boundary and may return:

```json
{
    "code": 103,
    "data": null,
    "message": "WRONG_GRANT_TYPE"
}
```

Correct action:

- Do not treat `getDeviceList` as the candidate-device discovery entry point for `client_credentials`.
- Start directly from `bindDevice` with a known raw SN.

### 2. Why does `bindDevice` fail even though the device label looks correct in the UI?

Device labels shown in the UI may include `SPH:` or `SPM:` prefixes, but API requests must use the raw SN only.

- Correct: `RAW_DEVICE_SN`
- Incorrect: `SPH:RAW_DEVICE_SN`

### 3. Why do `getDeviceInfo` or `getDeviceData` return `parameter error`?

This usually happens because:

- The SN still includes a display prefix
- The request body is not JSON

Verified working combination:

- `Authorization: Bearer <access_token>`
- `Content-Type: application/json`
- Request body contains only the raw SN

### 4. Which endpoints use JSON bodies?

The following interfaces have been verified with JSON bodies:

- `bindDevice`
- `getDeviceInfo`
- `getDeviceData`
- `deviceDispatch`
- `readDeviceDispatch`
- `unbindDevice`

### 5. Why does `readDeviceDispatch` sometimes return an object and sometimes an array?

This depends on `setType`:

- `time_slot_charge_discharge` commonly returns an array
- `duration_and_power_charge_discharge` may return an object

Clients should therefore parse `data` according to `setType` instead of treating one example shape as universal.

---

## Error-to-Action Mapping

| Response / Error | Common Cause | Correct Action |
| :--- | :--- | :--- |
| `TOKEN_IS_INVALID` | Token is expired or invalid | Refresh the token or obtain a new one |
| `DEVICE_SN_DOES_NOT_HAVE_PERMISSION` | Device is not bound or the current token has no permission | Run `bindDevice` first or verify authorization |
| `WRONG_GRANT_TYPE` | OAuth mode does not support the endpoint | Switch to the correct mode or use the `bindDevice` flow |
| `parameter error` | Prefixed SN or wrong body format | Use JSON and pass the raw SN only |
| `code=400, message=fail` | Wrong auth-header/body combination | Use `Authorization: Bearer` with a JSON body |

---

## Related Documentation

- [Device Authorization API](./04_api_device_auth.md)
- [Device Information Query API](./07_api_device_info.md)
- [Device Data Query API](./08_api_device_data.md)
