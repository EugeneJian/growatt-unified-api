# Device Data Query API

## Brief Description

- Query high-frequency runtime data for a device by device serial number.
- The API returns only device results that the current token is allowed to access; unauthorized devices return `DEVICE_SN_DOES_NOT_HAVE_PERMISSION`.

## Request URL

- `/oauth2/getDeviceData`

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

| Parameter | Vendor-table Type | Description |
| :--- | :--- | :--- |
| `code` | int | `0` means success; any other value means failure |
| `data` | string | The vendor table says `string`, while the success sample is an object |
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
        "fac": 50.03,
        "backupPower": 0.20,
        "batPower": 0.00,
        "pac": 41.30,
        "etoUserToday": 3.10,
        "meterPower": 0.00,
        "utcTime": "2026-03-13 07:48:25",
        "etoUserTotal": 44.80,
        "pexPower": 14.30,
        "batteryList": [
            {
                "chargePower": 0.00,
                "soc": 67,
                "echargeToday": 2.90,
                "vbat": 53.30,
                "index": 1,
                "echargeTotal": 80.70,
                "dischargePower": 0.00,
                "edischargeToday": 1.90,
                "ibat": -1.00,
                "soh": 100,
                "edischargeTotal": 57.60,
                "status": 0
            }
        ],
        "protectCode": 0,
        "reactivePower": 174.90,
        "deviceSn": "DEVICE_SN_1",
        "etoGridTotal": 270.70,
        "genPower": 0.00,
        "priority": 0,
        "vac3": 236.90,
        "etoGridToday": 1.50,
        "protectSubCode": 0,
        "vac2": 236.90,
        "vac1": 236.90,
        "payLoadPower": 14.50,
        "faultCode": 0,
        "faultSubCode": 0,
        "batteryStatus": 0,
        "ppv": 14.30,
        "smartLoadPower": 0.00,
        "status": 6
    },
    "message": "SUCCESSFUL_OPERATION"
}
```

## Response Field Definitions

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `code` | int | API status code; `0` means success |
| `data` | object | Main data object |
| `data.deviceSn` | string | Device serial number |
| `data.meterPower` | double | Meter power. Positive means grid import, negative means feed-in, unit: W |
| `data.reactivePower` | double | Reactive power (positive: capacitive, negative: inductive) |
| `data.fac` | double | Grid frequency |
| `data.etoUserToday` | double | Imported energy today in kWh |
| `data.etoUserTotal` | double | Total imported energy in kWh |
| `data.etoGridToday` | double | Exported energy today in kWh |
| `data.etoGridTotal` | double | Total exported energy in kWh |
| `data.faultCode` | int | Fault main code |
| `data.faultSubCode` | int | Fault sub-code |
| `data.protectCode` | int | Protection main code |
| `data.protectSubCode` | int | Protection sub-code |
| `data.pac` | double | AC output power in W |
| `data.ppv` | double | Local PV power in W |
| `data.payLoadPower` | double | Total load power in W |
| `data.batteryStatus` | int | Overall battery status |
| `data.batPower` | double | Total battery charge/discharge power in W |
| `data.priority` | int | Operating priority |
| `data.status` | int | Runtime status code |
| `data.utcTime` | string | UTC timestamp in `yyyy-MM-dd HH:mm:ss` format |
| `data.vac1` | double | Line voltage 1 in V |
| `data.vac2` | double | Line voltage 2 in V |
| `data.vac3` | double | Line voltage 3 in V |
| `data.epvTotal` | double | Total PV generation |
| `data.batteryList` | array | Battery data list |
| `data.batteryList[].index` | int | Battery index (starts from 1) |
| `data.batteryList[].soc` | int | Battery state of charge in percent |
| `data.batteryList[].chargePower` | double | Battery charge power in W |
| `data.batteryList[].dischargePower` | double | Battery discharge power in W |
| `data.batteryList[].ibat` | double | Battery current on the low-voltage side in A |
| `data.batteryList[].vbat` | double | Battery voltage on the low-voltage side in V |
| `data.batteryList[].soh` | int | Battery state of health `[0,100]` |
| `data.batteryList[].echargeToday` | double | Battery charge energy today in kWh |
| `data.batteryList[].echargeTotal` | double | Total battery charge energy in kWh |
| `data.batteryList[].edischargeToday` | double | Battery discharge energy today in kWh |
| `data.batteryList[].edischargeTotal` | double | Total battery discharge energy in kWh |

## Status Definitions

### Runtime Status (`status`)

- `0`: Standby
- `1`: Self-check
- `3`: Fault
- `4`: Upgrade
- `5`: PV online & battery offline & on-grid
- `6`: PV offline (or online) & battery online & on-grid
- `7`: PV online & battery online & off-grid
- `8`: PV offline & battery online & off-grid
- `9`: Bypass mode

### Overall Battery Status (`batteryStatus`)

- `0`: Battery standby
- `1`: Battery disconnected
- `2`: Battery charging
- `3`: Battery discharging
- `4`: Fault
- `5`: Upgrade

### Operating Priority (`priority`)

- `0`: Load priority
- `1`: Battery priority
- `2`: Grid priority

## Baseline Note

- The local header table in the vendor source uses `token`, while section `4 Global Parameters` standardizes `Authorization: Bearer xxxxxxx`. This page follows the global section.
- The vendor response table labels the top-level `data` field as `string`, while the success sample is clearly an object.

## Related Documentation

- [Device Information Query API](./07_api_device_info.md)
- [Device Data Push API](./09_api_device_push.md)
