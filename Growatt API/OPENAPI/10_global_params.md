# Global Parameter Description

## Domains

### Production Environment

- `https://opencloud.growatt.com`
- `https://opencloud-au.growatt.com`

### Test Environment

- `https://opencloud-test.growatt.com`

---

## Request Conventions

| Category | Endpoints | Convention |
| :--- | :--- | :--- |
| Token APIs | `/oauth2/token`, `/oauth2/refresh` | `POST` + `application/x-www-form-urlencoded` |
| Device-authorization APIs | `/oauth2/bindDevice`, `/oauth2/unbindDevice` | `POST` + `application/json` + `Authorization: Bearer <token>` |
| Device-query APIs | `/oauth2/getDeviceInfo`, `/oauth2/getDeviceData` | `POST` + `application/json` + `Authorization: Bearer <token>` |
| Dispatch APIs | `/oauth2/deviceDispatch`, `/oauth2/readDeviceDispatch` | `POST` + `application/json` + `Authorization: Bearer <token>` |
| Authorization lookup without request body | `/oauth2/getDeviceList`, `/oauth2/getDeviceListAuthed` | `POST` + `Authorization: Bearer <token>` |

---

## Shared Response Structure

```json
{
    "code": 0,
    "data": {},
    "message": "SUCCESSFUL_OPERATION"
}
```

### Shared Response Fields

| Field | Type | Description |
| :--- | :--- | :--- |
| `code` | int | Business status code. `0` means success and non-zero means failure |
| `data` | any | Business payload. The concrete shape depends on the endpoint |
| `message` | string | Status message |

---

## Common Response Codes

| `code` | `message` | Description |
| :--- | :--- | :--- |
| `0` | `SUCCESSFUL_OPERATION` | Request succeeded |
| `2` | `TOKEN_IS_INVALID` | Token is invalid or expired |
| `5` | `DEVICE_OFFLINE` | Device is offline |
| `6` | `PARAMETER_SETTING_FAILED` | Parameter setting failed |
| `7` | `WRONG_DEVICE_TYPE` | Device type is not supported for the requested operation |
| `12` | `DEVICE_SN_DOES_NOT_HAVE_PERMISSION` | The current token does not have permission on the device |
| `15` | `PARAMETER_SETTING_DEVICE_NOT_RESPONDING` | Device did not respond to the dispatch command |
| `16` | `PARAMETER_SETTING_RESPONSE_TIMEOUT` | Parameter-setting response timed out |
| `18` | `READ_PARAMETER_FAILED` | Parameter read failed |
| `103` | `WRONG_GRANT_TYPE` | The OAuth grant type does not support the requested endpoint |

---

## Rate Limits

- `/oauth2/deviceDispatch`: at most one request every 5 seconds per device.
- `/oauth2/readDeviceDispatch`: at most one request every 5 seconds per device.

---

## Device Parameter Catalog

**Brief Description**

- The table below lists common `setType` values and their meanings.
- The actual `value` structure depends on the selected `setType`.

| Parameter Name | Parameter Description | Parameter Value Description |
| :--- | :--- | :--- |
| `enable_control` | Control permission | 0: Disable<br>1: Enable<br>Default: Disable |
| `power_on_off_command` | Power on/off command | 0: Power off<br>1: Power on<br>Default: Power on<br>Not stored<br>This register must be enabled before remote on/off control |
| `system_time_setting` | System time setting | Example: 2024-10-10 13:14:14 |
| `syn_enable` | SYN enable | Off-grid box enable<br>0: Disable<br>1: Enable<br>Default: 0 |
| `active_power_derating_percentage` | Active power derating percentage | Range: [0, 100]<br>Default: 100 |
| `active_power_percentage` | Active power percentage | Range: [0, 100]<br>Default: 100<br>The smaller value between active power percentage and active power derating percentage is used as the effective value<br>Not stored |
| `eps_enable` | EPS off-grid enable | 0: Disable<br>1: Enable<br>Default: 0 |
| `eps_frequency` | EPS off-grid frequency | 0: 50Hz<br>1: 60Hz<br>Default: 0 |
| `eps_voltage` | EPS off-grid voltage | 0: 230V<br>1: 208V<br>2: 240V<br>3: 220V<br>4: 127V<br>5: 277V<br>6: 254V<br>Default: 0 |
| `reactive_power_percentage` | Reactive power percentage | Range: [0, 60]<br>Default: 60 |
| `reactive_power_mode` | Reactive power mode | 0: PF=1<br>1: PF value setting<br>2: Default PF curve (reserved)<br>3: User-defined PF curve (reserved)<br>4: Lagging reactive (+)<br>5: Leading reactive (-)<br>Default: 0 |
| `power_factor` | Power factor | [0, 20000]<br>Actual PF = (10000 - setting) * 0.0001<br>Default: 10000 |
| `anti_backfeed_enable` | Anti-backfeed enable | 0: Disable<br>1: Single-unit anti-backfeed enable<br>Default: 0 |
| `anti_backfeed_power_percentage` | Anti-backfeed power percentage | [-100, 100]<br>Default: 0<br>Positive means forward-current control, negative means reverse-current control |
| `anti_backfeed_limit_invalid_value` | Anti-backfeed limit invalid value | [0, 100]<br>Default: 0<br>Only supports reverse-current control and must be >= 0 |
| `anti_backfeed_invalid_duration` | Anti-backfeed invalid duration / EMS communication failure duration | [1, 300]<br>Default: 30 |
| `ems_comm_failure_enable` | EMS communication failure enable | 0: Disable<br>1: Enable<br>Default: 0 |
| `over_backfeed_enable` | Over-backfeed enable | 0: Disable<br>1: Enable<br>Default: 0 |
| `anti_backfeed_power_change_rate` | Anti-backfeed feed-in power change rate | [1, 20000]<br>Default: 27 |
| `single_phase_anti_backfeed_enable` | Single-phase anti-backfeed enable | 0: Disable<br>1: Enable<br>Default: 0 |
| `anti_backfeed_protection_mode` | Anti-backfeed protection mode | 0: Default mode<br>1: Combined hardware/software mode<br>2: Software mode<br>3: Hardware mode<br>Default: 0 |
| `charge_cutoff_soc` | Charge cutoff SOC | [70, 100]<br>Default: 100 |
| `grid_discharge_cutoff_soc` | Grid discharge cutoff SOC | [10, 30]<br>Default: 10 |
| `load_priority_discharge_cutoff_soc` | Load-priority discharge cutoff SOC | [10, 20]<br>Default: 10 |
| `remote_power_control_enable` | Remote power control enable | 0: Disable<br>1: Enable<br>Default: 0<br>Not stored |
| `remote_power_control_charge_duration` | Remote power control charge duration | 0: Unlimited<br>1~1440 min: control duration by setting<br>Default: 0<br>Not stored |
| `remote_charge_discharge_power` | Remote charge/discharge power | [-100, 100]<br>Positive: charge<br>Negative: discharge<br>Default: 0<br>Not stored |
| `ac_charge_enable` | AC charge enable | 0: Disable<br>1: Enable<br>Default: 0 |
| `time_slot_charge_discharge` | Time-slot charge/discharge | JSON array, time range 0-1440 |
| `off_grid_discharge_cutoff_soc` | Off-grid discharge cutoff SOC | [10, 30]<br>Default: 10 |
| `battery_charge_cutoff_voltage` | Battery charge cutoff voltage | Used for lead-acid batteries<br>[0, 15000] |
| `battery_discharge_cutoff_voltage` | Battery discharge cutoff voltage | Used for lead-acid batteries<br>[0, 15000] |
| `battery_max_charge_current` | Battery max charge current | Used for lead-acid batteries<br>[0, 2000]<br>Default: 1500 |
| `battery_max_discharge_current` | Battery max discharge current | Used for lead-acid batteries<br>[0, 2000]<br>Default: 1500 |

---

## Related Documentation

- [Authentication Guide](./01_authentication.md)
- [Device Dispatch API](./05_api_device_dispatch.md)
- [Read Device Dispatch Parameters API](./06_api_read_dispatch.md)
