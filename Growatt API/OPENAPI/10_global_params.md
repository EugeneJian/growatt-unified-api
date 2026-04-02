# Global Parameter Description

## Domains

### Production Environment

- `https://opencloud.growatt.com`
- `https://opencloud-au.growatt.com`

### Test Environment

- `https://opencloud-test.growatt.com`
- `https://opencloud-test-au.growatt.com`

## HTTP Header Description

- Calling the API requires `access_token`.

| Parameter | Description | Value |
| :--- | :--- | :--- |
| `Authorization` | Token marker | `Bearer xxxxxxx` |

## Response Code Description

```json
{
    "code": 0,
    "data": {},
    "message": "SUCCESSFUL_OPERATION"
}
```

```json
{
    "code": 12,
    "data": [
        "DEVICE_SN_1"
    ],
    "message": "DEVICE_SN_DOES_NOT_HAVE_PERMISSION"
}
```

```json
{
    "code": 2,
    "message": "TOKEN_IS_INVALID"
}
```

```json
{
    "code": 5,
    "data": null,
    "message": "DEVICE_OFFLINE"
}
```

```json
{
    "code": 18,
    "data": null,
    "message": "READ_DEVICE_PARAM_FAIL"
}
```

```json
{
    "code": 16,
    "data": null,
    "message": "PARAMETER_SETTING_RESPONSE_TIMEOUT"
}
```

```json
{
    "code": 15,
    "data": null,
    "message": "PARAMETER_SETTING_DEVICE_NOT_RESPONDING"
}
```

```json
{
    "code": 6,
    "data": null,
    "message": "PARAMETER_SETTING_FAILED"
}
```

```json
{
    "code": 105,
    "data": null,
    "message": "TOO_MANY_REQUEST"
}
```

## Device Parameter Description

- The table below keeps only the `setType` entries explicitly published by the current vendor baseline.

| Parameter | Description | Value Description |
| :--- | :--- | :--- |
| `time_slot_charge_discharge` | Time-slot charge and discharge. `percentage` range `[-100,100]`; `percentage > 0` means charge and `percentage < 0` means discharge; `startTime` / `endTime` are UTC times | `[{ "percentage": 100, "startTime": "00:00", "endTime": "23:59" }]` |
| `duration_and_power_charge_discharge` | Charge/discharge duration and power percentage. `percentage` range `[0,100]`; supports `selfConsumptionCommand`, `chargeOnlySelfConsumptionCommand`, `chargeCommand`, and `dischargeCommand` | `{ "duration": 10, "percentage": 20, "type": "dischargeCommand" }` |
| `anti_backflow` | Anti-backflow setting. `antiBackflowEnabled` is the enable switch; `percentage` range `[-100,100]`; positive values mean reverse-flow control and negative values mean forward-flow control | `{ "antiBackflowEnabled": 1, "percentage": 20 }` |

## Related Documentation

- [Device Dispatch API](./05_api_device_dispatch.md)
- [Read Device Dispatch Parameters API](./06_api_read_dispatch.md)
