# Troubleshooting FAQ

## 1. Can `client_credentials` call `getDeviceList`?

No. `POST /oauth2/getDeviceList` is available only in `authorization_code` mode. A call made with an unsupported grant type may return `code=103` and `message="WRONG_GRANT_TYPE"`.

For `client_credentials`, bind devices directly with `POST /oauth2/bindDevice`, including the required PIN code for each device.

## 2. When is `pinCode` required for `bindDevice`?

`deviceSnList[].pinCode` is required in client-credentials mode. In authorization-code mode, bind the devices selected through the end-user authorization flow.

## 3. Is `requestId` required for `readDeviceDispatch`?

Yes. Include a unique `requestId` in every `deviceDispatch` and `readDeviceDispatch` request. A 32-character value built from a timestamp plus random data is recommended.

## 4. Which authorization header should protected endpoints use?

Use:

```http
Authorization: Bearer <access_token>
```

Do not send the access token in a custom `token` header or URL query string.

## 5. What are the per-device request limits?

- `getDeviceData`: `1 request / min / device`
- `deviceDispatch` and `readDeviceDispatch`: `1 request / 5 sec / device` (`12 RPM`)

If the limit is exceeded, the API may return `code` `105` with `TOO_MANY_REQUEST`. Rate-limit by device SN and apply backoff before retrying.

## 6. Should device-level APIs use `deviceSn` or `datalogSn`?

Use `deviceSn`. `datalogSn` identifies the datalogger and is not a substitute for the device serial number in device-level request bodies.

## 7. How should a `bindDevice` success response be evaluated?

Use `code=0` as the success condition. Keep the parser tolerant of endpoint-dependent `data` values instead of requiring a single fixed success payload.

## 8. Can token TTL values be copied from the examples?

No. Always read `expires_in` and, when returned, `refresh_expires_in` from the current response. Schedule renewal using those values with a safety margin for clock skew and in-flight requests.

## 9. What should happen after a token refresh?

Replace the stored access token and refresh token immediately and atomically. All subsequent protected requests must use the newly returned access token.

## 10. Why does `readDeviceDispatch.data` have different shapes?

The shape depends on `setType`:

- Array: `time_slot_charge_discharge`
- Object: `duration_and_power_charge_discharge`, `export_limit`
- Number: `enable_control`, `active_power_derating_percentage`, `active_power_percentage`, `remote_charge_discharge_power`

Select the parser from the requested `setType`; do not assume that `data` is always a string.

## 11. How should dispatch timeouts be retried?

When dispatch returns a timeout or no-response code, first call `readDeviceDispatch` after respecting the per-device rate limit. Retry the original dispatch only if the read-back confirms that the requested setting was not applied.

## Related Documentation

- [Authentication Guide](./01_authentication.md)
- [Device Authorization API](./04_api_device_auth.md)
- [Device Dispatch API](./05_api_device_dispatch.md)
- [Read Device Dispatch Parameters API](./06_api_read_dispatch.md)
- [Global Parameters](./10_global_params.md)
- [ESS Terminology Glossary](./12_ess_terminology.md)
