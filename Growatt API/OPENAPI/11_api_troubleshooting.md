# Troubleshooting FAQ

Version: V1.0 | Release Date: March 12, 2026

This page summarizes the most common integration failures observed during verified testing on `https://api-test.growatt.com:9290`.

Use this page together with:
- [Device Authorization API](./04_api_device_auth.md)
- [Device Information Query API](./07_api_device_info.md)
- [Device Data Query API](./08_api_device_data.md)

---

## Verified 9290 Happy Path

The following sequence was verified under `client_credentials` mode:

1. `POST /oauth2/token`
2. `POST /oauth2/bindDevice`
3. `POST /oauth2/getDeviceInfo`
4. `POST /oauth2/getDeviceData`

If your integration does not follow this sequence, troubleshoot that first.

---

## FAQ

### 1. Why does `bindDevice` fail when the device label looks correct in the UI?

In the 9290 test environment, UI labels may include prefixes such as `SPH:` or `SPM:`, but the API request must use the raw SN only.

- Correct: `RAW_DEVICE_SN`
- Incorrect: `SPH:RAW_DEVICE_SN`

Verified working `bindDevice` request:

```json
{
    "deviceSnList": [
        {
            "deviceSn": "RAW_DEVICE_SN",
            "pinCode": "TEST_PIN_CODE"
        }
    ]
}
```

### 2. Why does `getDeviceInfo` return `DEVICE_SN_DOES_NOT_HAVE_PERMISSION`?

This means the device has not been authorized for the current third party yet.

Correct action:

1. Call `POST /oauth2/bindDevice`
2. Retry `POST /oauth2/getDeviceInfo`

### 3. Why does `getDeviceInfo` or `getDeviceData` return `parameter error`?

In the verified 9290 environment, this is commonly caused by one of the following:

- Passing a prefixed SN such as `SPH:RAW_DEVICE_SN`
- Using a non-working request body format

Verified working format for both query APIs in this environment:

- `Authorization: Bearer <access_token>`
- `Content-Type: application/json`
- JSON body:

```json
{
    "deviceSn": "RAW_DEVICE_SN"
}
```

### 4. Why does `getDeviceData` return `code=400` with `message=fail`?

This is commonly caused by a non-working auth/body combination in the 9290 environment.

Verified working combination:

- `Authorization: Bearer <access_token>`
- `Content-Type: application/json`
- JSON body with raw SN

### 5. Which auth header should I use for `getDeviceData`?

The endpoint-level SSOT documents the `token` header, but the 9290 test environment was successfully verified with:

- `Authorization: Bearer <access_token>`

When integrating against `https://api-test.growatt.com:9290`, prefer the verified working combination documented on this page.

### 6. What is the minimum verified request set for 9290?

#### `bindDevice`

```json
{
    "deviceSnList": [
        {
            "deviceSn": "RAW_DEVICE_SN",
            "pinCode": "TEST_PIN_CODE"
        }
    ]
}
```

#### `getDeviceInfo`

```json
{
    "deviceSn": "RAW_DEVICE_SN"
}
```

#### `getDeviceData`

```json
{
    "deviceSn": "RAW_DEVICE_SN"
}
```

---

## Error-to-Action Table

| Response / Error | Likely Cause | Correct Action |
| :--- | :--- | :--- |
| `TOKEN_IS_INVALID` | Token expired or invalid | Refresh or fetch a new token, then retry |
| `DEVICE_SN_DOES_NOT_HAVE_PERMISSION` | Device not bound yet | Call `bindDevice` first |
| `parameter error` | Prefixed SN or non-working body format | Use JSON body and raw SN only |
| `code=400, message=fail` | Non-working auth/body combination for telemetry | Use `Authorization: Bearer` + JSON body |

---

## Recommended Implementation Defaults for 9290

- Normalize device labels before request construction
  - Convert `SPH:RAW_DEVICE_SN` -> `RAW_DEVICE_SN`
- Use `Authorization: Bearer <access_token>` for all four validated calls in the 9290 test environment
- Use `application/json` request bodies for:
  - `bindDevice`
  - `getDeviceInfo`
  - `getDeviceData`
- Treat `bindDevice` as a hard prerequisite before querying info or telemetry

---

## Related Documentation

- [Device Authorization API](./04_api_device_auth.md)
- [Device Information Query API](./07_api_device_info.md)
- [Device Data Query API](./08_api_device_data.md)
