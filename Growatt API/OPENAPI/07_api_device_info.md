# Device Information Query API

## Brief Description

- Get information for devices already authorized to the current token.
- The API returns only device results that the current token is allowed to access; unauthorized devices return `DEVICE_SN_DOES_NOT_HAVE_PERMISSION`.

## Request URL

- `/oauth2/getDeviceInfo`

## Request Method

- `POST`
- `Content-Type: application/json`
- `Authorization: Bearer <token>`

## HTTP Header Parameters

| Parameter | Required | Type | Description |
| :--- | :--- | :--- | :--- |
| `Authorization` | Yes | string | Access-token header |

## HTTP Body Parameters

| Parameter | Required | Type | Description |
| :--- | :--- | :--- | :--- |
| `deviceSn` | Yes | string | Unique device serial number (SN) |

## Response Parameters

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `code` | int | `0` means success; any other value means failure |
| `data` | obj | Response data |
| `message` | string | Response description |

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
        "deviceSn": "DEVICE_SN_1",
        "deviceTypeName": "min",
        "model": "BDCBAT",
        "nominalPower": 6000,
        "datalogSn": "DATALOG_SN_1",
        "datalogDeviceTypeName": "ShineWiFi-X",
        "dtc": 5100,
        "communicationVersion": "ZABA-0021",
        "existBattery": true,
        "batterySn": "BATTERY_SN_1",
        "batteryModel": "ARK 5.12-25.6XH-A1",
        "batteryCapacity": 5000,
        "batteryNominalPower": 2500,
        "authFlag": true,
        "batteryList": [
            {
                "batterySn": "BATTERY_SN_1",
                "batteryModel": "ARK 5.12-25.6XH-A1",
                "batteryCapacity": 5000,
                "batteryNominalPower": 2500
            }
        ]
    },
    "message": "SUCCESSFUL_OPERATION"
}
```

```json
{
    "code": 2,
    "message": "TOKEN_IS_INVALID"
}
```

## `data` Field Definitions

| Parameter | Description |
| :--- | :--- |
| `deviceSn` | Device serial number |
| `deviceTypeName` | Device type name |
| `model` | Device model |
| `nominalPower` | Nominal inverter power in W |
| `datalogSn` | Datalogger serial number |
| `datalogDeviceTypeName` | Datalogger type name |
| `dtc` | Numeric device-type code |
| `communicationVersion` | Communication version |
| `existBattery` | Whether the device has a battery |
| `batterySn` | Battery serial number |
| `batteryModel` | Battery model |
| `batteryCapacity` | Battery nominal capacity in Wh |
| `batteryNominalPower` | Battery nominal power in W |
| `authFlag` | Whether the device is already authorized |
| `batteryList` | Battery list |

## Related Documentation

- [Device Authorization API](./04_api_device_auth.md)
- [Device Data Query API](./08_api_device_data.md)
