# Device Information Query API

**Brief Description**
- Get the information of authorized devices on the Growatt platform.

## Test Environment Compatibility Note

> Verified on `https://api-test.growatt.com:9290`.
>
> - Device labels in UI may appear as `SPH:xxxx` / `SPM:xxxx`, but the request body should use the raw SN only.
> - Verified working request format in this test environment:
>   - `Authorization: Bearer <access_token>`
>   - `Content-Type: application/json`
>   - JSON body: `{"deviceSn":"RAW_DEVICE_SN"}`
> - Correct: `RAW_DEVICE_SN`
> - Incorrect: `SPH:RAW_DEVICE_SN`

**Request URL**
- `/oauth2/getDeviceInfo`

**Request Method**
- `POST`
- `Content-Type`: `application/x-www-form-urlencoded`
- The request header must carry a valid `access_token`.
- Placed in the `Authorization` parameter of the request header, and must include the prefix `Bearer `.

## Device Info Query Flow (Concept)

```mermaid
%% 本代码严格遵循AI生成Mermaid代码的终极准则v4.1（Mermaid终极大师）
flowchart TD
    A["User selects device"] --> B["Attach bearer access token"]
    B --> C["Call getDeviceInfo API"]
    C --> D{"Response code"}
    D -->|"0"| E["Render model battery and datalog fields"]
    D -->|"2"| F["Refresh token and retry"]
    D -->|"12"| G["Check device authorization list"]
    E --> H["Use info for monitoring and dispatch eligibility"]
```

## Device Info Query Flow (Sequence)

```mermaid
%% 本代码严格遵循AI生成Mermaid代码的终极准则v4.1（Mermaid终极大师）
sequenceDiagram
    participant User as EndUser
    participant Service as ServiceAPI
    participant API as OAuthAPI

    User->>Service: Select target device
    Service->>API: POST getDeviceInfo
    API-->>Service: Return code and device info
    alt Code 0
        Service-->>User: Show device info
    else Code 2
        Service-->>Service: Refresh and retry
    else Code 12
        Service-->>User: Request authorization update
    end
```

---

## HTTP Header Parameters

| Parameter Name | Required | Type | Description |
| :--- | :--- | :--- | :--- |
| `Authorization` | Yes | String | Secret token |

---

## HTTP Body Parameters

| Parameter Name | Required | Type | Description |
| :--- | :--- | :--- | :--- |
| `deviceSn` | Yes | String | Device unique serial number (SN) |

## Verified 9290 Request Example

```json
{
    "deviceSn": "RAW_DEVICE_SN"
}
```

---

## Interface Return Parameters

| Parameter Name | Type | Description |
| :--- | :--- | :--- |
| `code` | int | Interface return status code. 0 - Success, Others - Failure |
| `data` | obj | Returned data |
| `message` | string | Return description |

---

## Return Example

```json
// Success, code=0
{
    "code": 0,
    "data": {
        "deviceSn": "USQ1234567",
        "deviceTypeName": "min",
        "model": "BDCBAT",
        "nominalPower": 6000,
        "datalogSn": "XGD6E3P029",
        "datalogDeviceTypeName": "ShineWiFi-X",
        "dtc": 5100,
        "communicationVersion": "ZABA-0021",
        "existBattery": true,
        "batterySn": "0YXH123456789632",
        "batteryModel": "ARK 5.12-25.6XH-A1",
        "batteryCapacity": 5000,
        "batteryNominalPower": 2500,
        "authFlag": true,
        "batteryList": [
            {
                "batterySn": "0YXH123456789632",
                "batteryModel": "ARK 5.12-25.6XH-A1",
                "batteryCapacity": 5000,
                "batteryNominalPower": 2500
            }
        ]
    },
    "message": "SUCCESSFUL_OPERATION"
}

// Failure, code non-zero
{
    "code": 2,
    "message": "TOKEN_IS_INVALID"
}
```

### Common Failures and Correct Action

| Response / Error | Meaning | Correct Action |
| :--- | :--- | :--- |
| `TOKEN_IS_INVALID` | The token is expired or invalid | Refresh or re-fetch the token, then retry |
| `DEVICE_SN_DOES_NOT_HAVE_PERMISSION` | The device has not been bound for the current third party yet | Call `bindDevice` first, then retry `getDeviceInfo` |
| `parameter error` | Commonly caused by using form-encoded body or passing a prefixed SN in this test environment | Switch to JSON body and pass the raw SN without `SPH:` / `SPM:` |

*(Note: The `data` parameter description table is identical to section 3.3.1).*

---

## Related Documentation

- [Device Authorization API](../04_api_device_auth.md)
- [Device Data Query API](../08_api_device_data.md)
