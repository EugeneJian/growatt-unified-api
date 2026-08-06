# Device Operation Mode API

## Brief Description

- Query the current battery operation mode for a device by device serial number.
- The API returns only device results that the current token is allowed to access; unauthorized devices return `DEVICE_SN_DOES_NOT_HAVE_PERMISSION`.
- This API is designed for VPP aggregators to monitor battery scheduling states for demand response and energy optimization scenarios.
- Maximum request rate: `1 request / min / device`.

## Request URL

- `/oauth2/getDeviceOperationMode`

## Request Method

- `POST`
- `Content-Type: application/json`
- `Authorization: Bearer <token>`

## Supported Device Models

- All energy storage inverter series:
  - SPA Series
  - SPH Series (including SPH TL-HUB)
  - MOD Series (including MOD TL3-XH)

## HTTP Header Parameters

| Parameter | Required | Type | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `Authorization` | Yes | string | Access-token header | `Bearer ACCESS_TOKEN` |

## HTTP Body Parameters

| Parameter | Required | Type | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `deviceSn` | Yes | string | Unique device serial number (SN) | `"DEVICE_SN_1"` |

## Response Parameters

| Parameter | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `code` | int | `0` means success; any other value means failure | `0` |
| `data` | object | Operation mode data object; returned on success | `{...}` |
| `message` | string | Response description | `"SUCCESSFUL_OPERATION"` |

### Data Object Fields

| Field | Type | Description | Possible Values |
| :--- | :--- | :--- | :--- |
| `operationMode` | string | Current battery operation mode | See Operation Mode Values below |

## Operation Mode Values

| Value | Business Meaning | Typical Use Cases |
| :--- | :--- | :--- |
| `SELF_RELIANCE` | Self-consumption mode: prioritize using solar energy or battery to meet household demand, reduce grid dependency | Self-consumption optimization, minimizing grid imports |
| `TIME_OF_USE` | Time-of-use optimization: battery, solar, and grid usage follows user-defined time-of-use pricing plans | Cost optimization based on time-varying electricity rates |
| `IMPORT_FOCUS` | Charge priority mode: prioritize charging the battery using surplus solar or grid power (if configured) | Low-rate charging, pre-event battery preparation |
| `EXPORT_FOCUS` | Discharge priority mode: prioritize discharging battery to household loads, with surplus energy potentially exported to grid | VPP dispatch, demand response, peak shaving |
| `IDLE` | Idle mode: prevent battery charge or discharge, maintain current state of charge (SoC) | Battery preservation, SoC locking, strategy transition protection |

> **Note**: Whether the battery can export to the grid depends on local regulations and grid interconnection agreements.

## Request Example

```json
{
    "deviceSn": "DEVICE_SN_1"
}
```

## Response Example

```json
{
    "code": 0,
    "data": {
        "operationMode": "TIME_OF_USE"
    },
    "message": "SUCCESSFUL_OPERATION"
}
```

## Response Cases

| Scenario | `code` | `message` |
| :--- | :--- | :--- |
| Successful query | `0` | `SUCCESSFUL_OPERATION` |
| Invalid or missing token | `2` | `TOKEN_EXPIRED_OR_INVALID` |
| Device not authorized | `12` | `DEVICE_SN_DOES_NOT_HAVE_PERMISSION` |
| Device offline | `5` | `DEVICE_OFFLINE` |
| Too many requests | `105` | `TOO_MANY_REQUEST` |

## Customer Implementation Guidance

1. **Polling Frequency**: Respect the `1 request / min / device` rate limit to avoid `TOO_MANY_REQUEST` errors.
2. **Authorization**: Ensure the device is authorized via the [Device Authorization API](./04_api_device_auth.md) before querying.
3. **Mode Interpretation**: Use the `operationMode` value to understand the current battery scheduling state and adjust VPP scheduling logic accordingly.
4. **Offline Handling**: If the device returns `DEVICE_OFFLINE`, implement exponential backoff retry logic.

## Related Documentation

- [Device Data Query API](./08_api_device_data.md) - Query real-time device telemetry data
- [Device Dispatch API](./05_api_device_dispatch.md) - Send control commands to devices
- [Device Authorization API](./04_api_device_auth.md) - Authorize devices for API access
- [ESS Terminology Glossary](./12_ess_terminology.md) - Energy storage system terminology
