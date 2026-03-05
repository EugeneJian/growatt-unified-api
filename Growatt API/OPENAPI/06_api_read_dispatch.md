# Read Device Dispatch Parameters API

**Brief Description**
- Read relevant parameters of the device based on the device's SN. The interface will only return reading results for devices that the secret token has permission to access. Devices without permission will not be read, and no results will be returned.
- Current interface frequency limit: once every 5 seconds per device.

**Request URL**
- `/oauth2/readDdeviceDispatch`

**Request Method**
- `POST`
- The `ContentType` of the request must be `application/x-www-form-urlencoded;`

## Read-Back Verification Flow (Mermaid)

```mermaid
%% 本代码严格遵循AI生成Mermaid代码的终极准则v4.1（Mermaid终极大师）
flowchart TD
    A["Need current parameter value"] --> B["Build request with device sn set type and request id"]
    B --> C["Call readDdeviceDispatch API"]
    C --> D{"Response code"}
    D -->|"0"| E["Parse data array"]
    D -->|"5 or 16"| F["Retry with delay"]
    D -->|"7 or other"| G["Stop and inspect permission or device type"]
    E --> H["Compare with expected dispatch plan"]
    H --> I["Continue control loop"]
    F --> C
```

---

## HTTP Header Parameters

| Parameter Name | Required | Type | Description |
| :--- | :--- | :--- | :--- |
| `Authorization` | Yes | String | Bearer your_access_token |

---

## HTTP Body Parameters

| Parameter Name | Required | Type | Description |
| :--- | :--- | :--- | :--- |
| `deviceSn` | Yes | string | Device SN, example: xxxxxxx |
| `setType` | Yes | string | Setting parameter enum, example: `time_slot_charge_discharge` |
| `requestId` | Yes | string | Unique identifier for this request |

---

## Interface Return Parameters

| Parameter Name | Type | Description |
| :--- | :--- | :--- |
| `code` | int | Interface return status code. 0 - Success, Others - Failure |
| `data` | string | Returned data |
| `message` | string | Return description |

---

## Request Example

```json
{
    "deviceSn": "FDCJQ00003",
    "setType": "time_slot_charge_discharge"
}
```

---

## Return Examples

### Reading Successful

```json
{
    "code": 0,
    "data": [
        {
            "startTime": 60,
            "endTime": 420,
            "percentage": 80
        },
        {
            "startTime": 840,
            "endTime": 1020,
            "percentage": 80
        },
        {
            "startTime": 0,
            "endTime": 0,
            "percentage": 0
        }
    ],
    "message": "success"
}
```

### Device Offline

```json
{
    "code": 5,
    "data": null,
    "message": "DEVICE_OFFLINE"
}
```

### Parameter Setting Response Timeout

```json
{
    "code": 16,
    "data": null,
    "message": "PARAMETER_SETTING_RESPONSE_TIMEOUT"
}
```

### Wrong Device Type

```json
{
    "code": 7,
    "data": null,
    "message": "WRONG_DEVICE_TYPE"
}
```

---

## Related Documentation

- [Device Dispatch API](../05_api_device_dispatch.md)
- [Device Information Query API](../07_api_device_info.md)
- [Global Parameters](../10_global_params.md)
