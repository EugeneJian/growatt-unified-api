# Global Parameters

## Domains

### Production Environment

- `https://opencloud.growatt.com`
- `https://opencloud-au.growatt.com`

### Test Environment

- `https://opencloud-test.growatt.com`
- `https://opencloud-test-au.growatt.com`

## Environment and Parameter Decision Flow (Concept)

```mermaid
flowchart TD
    A["Start API call"] --> B{"Environment"}
    B -->|"Production"| C["Use production domain"]
    B -->|"Test"| D["Use test domain"]
    C --> E["Attach bearer token"]
    D --> E
    E --> F{"Permission result"}
    F -->|"TOKEN_IS_INVALID"| G["Refresh token"]
    F -->|"DEVICE_SN_DOES_NOT_HAVE_PERMISSION"| H["Bind device first"]
    F -->|"OK"| I["Select set type from parameter table"]
    I --> J["Call dispatch or read APIs"]
```

## Environment and Permission Handling (Sequence)

```mermaid
sequenceDiagram
    participant Client as IntegrationService
    participant API as OAuthAPI
    participant Auth as AuthLogic

    Client->>API: Call API on chosen domain
    API-->>Client: Return permission code
    alt Code TOKEN_IS_INVALID
        Client->>Auth: Refresh and retry
        Auth-->>Client: Return new token
    else Code DEVICE_SN_DOES_NOT_HAVE_PERMISSION
        Client->>Auth: Run bind flow
        Auth-->>Client: Return bind result
    else Permission ok
        Client-->>Client: Continue dispatch or read
    end
```

## HTTP Header

- Calling the API requires `access_token`.

| Parameter | Description | Value |
| :--- | :--- | :--- |
| `Authorization` | Token marker | `Bearer xxxxxxx` |

## Response Codes

### Response Format Example

```json
{
    "code": 0,
    "data": "<endpoint-dependent>",
    "message": "RESPONSE_MESSAGE"
}
```

| Scenario | `code` | `data` | `message` |
| :--- | :--- | :--- | :--- |
| Successful operation | `0` | Endpoint-dependent: object, array, number, `null`, or empty array depending on endpoint | `"SUCCESSFUL_OPERATION"` |
| Device SN does not have permission | `12` | `["DEVICE_SN_1"]` | `"DEVICE_SN_DOES_NOT_HAVE_PERMISSION"` |
| Token is invalid | `2` | Not returned | `"TOKEN_IS_INVALID"` |
| Device offline | `5` | `null` | `"DEVICE_OFFLINE"` |
| Read device parameter failed | `18` | `null` | `"READ_DEVICE_PARAM_FAIL"` |
| Wrong grant type | `103` | Not returned | `"WRONG_GRANT_TYPE"` |
| Parameter-setting response timeout | `16` | `null` | `"PARAMETER_SETTING_RESPONSE_TIMEOUT"` |
| Parameter-setting device not responding | `15` | `null` | `"PARAMETER_SETTING_DEVICE_NOT_RESPONDING"` |
| Parameter-setting failed | `6` | `null` | `"PARAMETER_SETTING_FAILED"` |
| Too many requests | `105` | `null` | `"TOO_MANY_REQUEST"` |

## Device Parameters

- The table below keeps only the seven public `setType` entries documented for this page.

| Parameter | Description | Value Description |
| :--- | :--- | :--- |
| `time_slot_charge_discharge` | Time-slot charging/discharging. `percentage` range `[-100,100]`; `percentage > 0` means charging and `percentage < 0` means discharging; `startTime` / `endTime` are UTC times; up to 16 time slots may be configured | `[{ "percentage": 100, "startTime": "00:00", "endTime": "23:59" }]` |
| `duration_and_power_charge_discharge` | Charging/discharging duration and power percentage. `percentage` range `[0,100]`; supports `selfConsumptionCommand`, `chargeOnlySelfConsumptionCommand`, `chargeCommand`, and `dischargeCommand` | `{ "duration": 10, "percentage": 20, "type": "dischargeCommand" }` |
| `export_limit` | Export Limit. `exportLimitEnabled` is the enable switch; `percentage` range `[-100,100]`; positive values mean export limiting and negative values mean forward-flow control | `{ "exportLimitEnabled": 1, "percentage": 20 }` |
| `enable_control` | Whether VPP control is enabled | `1` = enable, `0` = disable |
| `active_power_derating_percentage` | Active power derating percentage | Scalar number in `[0,100]`, for example `50` |
| `active_power_percentage` | Active power percentage | Scalar number in `[0,100]`, for example `60` |
| `remote_charge_discharge_power` | Remote charge/discharge power | Scalar number in `[-100,100]`; positive means charging and negative means discharging |

## Read-Back Examples by `setType`

| `setType` | Request example | `readDeviceDispatch.data` example | Shape |
| :--- | :--- | :--- | :--- |
| `time_slot_charge_discharge` | `{ "deviceSn": "TEST123456", "requestId": "12345678901234567890123456789012", "setType": "time_slot_charge_discharge" }` | `[{ "startTime": "16:00", "endTime": "18:00", "percentage": 80 }]` | Array |
| `duration_and_power_charge_discharge` | `{ "deviceSn": "TEST123456", "requestId": "12345678901234567890123456789012", "setType": "duration_and_power_charge_discharge" }` | `{ "remotePowerControlEnable": 1, "duration": 10, "percentage": 80, "acChargingEnabled": 1 }` | Object |
| `export_limit` | `{ "deviceSn": "TEST123456", "requestId": "12345678901234567890123456789012", "setType": "export_limit" }` | `{ "exportLimitEnabled": 1, "percentage": 20 }` | Object |
| `enable_control` | `{ "deviceSn": "TEST123456", "requestId": "12345678901234567890123456789012", "setType": "enable_control" }` | `1` | Scalar number |
| `active_power_derating_percentage` | `{ "deviceSn": "TEST123456", "requestId": "12345678901234567890123456789012", "setType": "active_power_derating_percentage" }` | `50` | Scalar number |
| `active_power_percentage` | `{ "deviceSn": "TEST123456", "requestId": "12345678901234567890123456789012", "setType": "active_power_percentage" }` | `60` | Scalar number |
| `remote_charge_discharge_power` | `{ "deviceSn": "TEST123456", "requestId": "12345678901234567890123456789012", "setType": "remote_charge_discharge_power" }` | `-30` | Scalar number |

## Related Documentation

- [Device Dispatch API](./05_api_device_dispatch.md)
- [Read Device Dispatch Parameters API](./06_api_read_dispatch.md)
- [ESS Terminology Glossary](./12_ess_terminology.md)
