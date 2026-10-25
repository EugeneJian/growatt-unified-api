# Growatt Open API Documentation Change Notice

Release date: 2026-10-19

## 1. Device Information

`POST /oauth2/getDeviceInfo` adds the `coupleType` response field between `backupCutOffSOC` and `batteryList`.

| Field | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `data.coupleType` | string \| null | Device coupling type: `DC_COUPLE` (DC coupling), `AC_COUPLE` (AC coupling), or `null` | `"DC_COUPLE"` |

Response excerpt:

```json
{
    "backupCutOffSOC": 10,
    "coupleType": "DC_COUPLE",
    "batteryList": []
}
```

## 2. Integration Impact

This is an additive response field. Request parameters remain unchanged. Clients that read `coupleType` should accept both documented string values and `null`.

See the [Device Information Query API](../Growatt%20API/OPENAPI/07_api_device_info.md) for the full response example.
