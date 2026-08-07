# Appendix E API Rate Limiting

## Rate Limiting Modes

| Mode | Description |
|---|---|
| `CLIENT_ONLY` | Rate limit by clientId; all calls from the same client share the quota for this endpoint |
| `CLIENT_AND_DEVICE` | Rate limit by clientId + deviceSn; each device has an independent quota per client for this endpoint |

---

## Rate Limiting Configuration by Endpoint

| Endpoint Path | Method Name | Rate Limit Window | Rate Limiting Mode |
|---|---|---|---|
| `POST /oauth2/getDeviceInfo` | `getDeviceInfo` | 60s | `CLIENT_AND_DEVICE` |
| `POST /oauth2/getDeviceData` | `getDeviceData` | 10s | `CLIENT_AND_DEVICE` |
| `POST /oauth2/getDeviceOperationMode` | `getDeviceOperationMode` | 60s | `CLIENT_AND_DEVICE` |
| `POST /oauth2/deviceDispatch` | `deviceDispatch` | 5s | `CLIENT_AND_DEVICE` |
| `POST /oauth2/readDeviceDispatch` | `readDeviceDispatch` | 5s | `CLIENT_AND_DEVICE` |
| `POST /oauth2/getDeviceList` | `getApiDeviceList` | 60s | `CLIENT_ONLY` |
| `POST /oauth2/getDeviceListAuthed` | `getApiDeviceListAuth` | 60s | `CLIENT_ONLY` |

---

## Rate Limit Response Example

When a rate limit is exceeded, the API returns:

```json
{
  "code": 429,
  "data": null,
  "message": "API-level rate limited for clientId=client***, retry after 43217ms"
}
```

- `clientId` shows only the first 6 characters, with the rest masked as `***`
- `retry after Xms` indicates the remaining milliseconds until the current rate limit window ends

---

## Related Documentation

- [Device Information Query API](./07_api_device_info.md)
- [Device Data Query API](./08_api_device_data.md)
- [Device Operation Mode API](./12_api_operation_mode.md)
- [Device Dispatch API](./05_api_device_dispatch.md)
- [Read Dispatch API](./06_api_read_dispatch.md)
- [API Troubleshooting](./11_api_troubleshooting.md)
