# Device Data Push API

## Brief Description

- The third-party platform must implement its own receiving endpoint and provide that URL to Growatt.
- Devices under the third-party platform push high-frequency data to that URL.
- This page defines the push payload directly from the vendor baseline as its own payload definition.

## Push Example

```json
{
    "data": {
        "deviceSn": "DEVICE_SN_1",
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
    "dataType": "dfcData"
}
```

## Parameter Definitions

| Parameter | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `dataType` | string | Fixed value: `dfcData` | `"dfcData"` |
| `data` | object | Main data object | `{...}` |
| `data.deviceSn` | string | Device serial number | `"DEVICE_SN_1"` |
| `data.meterPower` | double | Grid meter power. Positive means grid import and negative means grid export, unit: W | `0.00` |
| `data.reactivePower` | double | Reactive power (positive: capacitive, negative: inductive) | `174.90` |
| `data.fac` | double | Grid frequency | `50.03` |
| `data.etoUserToday` | double | Grid import energy today in kWh | `3.10` |
| `data.etoUserTotal` | double | Total grid import energy in kWh | `44.80` |
| `data.etoGridToday` | double | Grid export energy today in kWh | `1.50` |
| `data.etoGridTotal` | double | Total grid export energy in kWh | `270.70` |
| `data.faultCode` | int | Fault main code | `0` |
| `data.faultSubCode` | int | Fault sub-code | `0` |
| `data.protectCode` | int | Protection main code | `0` |
| `data.protectSubCode` | int | Protection sub-code | `0` |
| `data.pac` | double | AC output power in W | `41.30` |
| `data.ppv` | double | PV power in W | `14.30` |
| `data.payLoadPower` | double | Total load power (calculated) in W | `14.50` |
| `data.batteryStatus` | int | Overall battery status | `0` |
| `data.batPower` | double | Battery power. Positive = charging, negative = discharging, `0` = idle, unit: W | `0.00` |
| `data.priority` | int | Operating priority | `0` |
| `data.status` | int | Runtime status code | `6` |
| `data.utcTime` | string | UTC timestamp in `yyyy-MM-dd HH:mm:ss` format | `"2026-03-13 07:48:25"` |
| `data.vac1` | double | Line voltage 1 in V | `236.90` |
| `data.vac2` | double | Line voltage 2 in V | `236.90` |
| `data.vac3` | double | Line voltage 3 in V | `236.90` |
| `data.epvTotal` | double | Total PV generation | — |
| `data.batteryList` | array | Battery data list | `[{...}]` |
| `data.batteryList[].index` | int | Battery index (starts from 1) | `1` |
| `data.batteryList[].soc` | int | Battery state of charge (SOC) in percent | `67` |
| `data.batteryList[].chargePower` | double | Battery charging power in W | `0.00` |
| `data.batteryList[].dischargePower` | double | Battery discharging power in W | `0.00` |
| `data.batteryList[].ibat` | double | Battery current on the low-voltage side in A | `-1.00` |
| `data.batteryList[].vbat` | double | Battery voltage on the low-voltage side in V | `53.30` |
| `data.batteryList[].soh` | int | Battery state of health (SOH) `[0,100]` | `100` |
| `data.batteryList[].echargeToday` | double | Charged energy today in kWh | `2.90` |
| `data.batteryList[].echargeTotal` | double | Total charged energy in kWh | `80.70` |
| `data.batteryList[].edischargeToday` | double | Discharged energy today in kWh | `1.90` |
| `data.batteryList[].edischargeTotal` | double | Total discharged energy in kWh | `57.60` |

## Status Definitions

### Runtime Status (`status`)

- `0`: Standby
- `1`: Self-check
- `3`: Fault
- `4`: Upgrade
- `5`: PV online & battery offline & grid-connected
- `6`: PV offline (or online) & battery online & grid-connected
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

## Related Documentation

- [Device Data Query API](./08_api_device_data.md)
- [Global Parameters](./10_global_params.md)
- [ESS Terminology Glossary](./12_ess_terminology.md)
