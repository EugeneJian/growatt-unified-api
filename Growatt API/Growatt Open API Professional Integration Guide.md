**Growatt Open API Quick Guide (SSOT Aligned)**
**Version 1.1 (Aligned to OPENAPI V1.0, Release Date: March 4, 2026)**  
**Target Audience**: Solution Architects, Backend Developers, Integration Engineers  

---

### 1. Scope and SSOT Rule

This quick guide is an integration accelerator. The single source of truth (SSOT) is:
- `Growatt API/OPENAPI/*.md`

If this guide conflicts with endpoint-level docs, always follow OPENAPI docs first.

Core references:
- [Authentication Guide](./OPENAPI/01_authentication.md)
- [Get access_token API](./OPENAPI/02_api_access_token.md)
- [OAuth2-refresh API](./OPENAPI/03_api_refresh.md)
- [Device Authorization API](./OPENAPI/04_api_device_auth.md)
- [Device Dispatch API](./OPENAPI/05_api_device_dispatch.md)
- [Read Device Dispatch Parameters API](./OPENAPI/06_api_read_dispatch.md)
- [Device Information Query API](./OPENAPI/07_api_device_info.md)
- [Device Data Query API](./OPENAPI/08_api_device_data.md)
- [Device Data Push API](./OPENAPI/09_api_device_push.md)
- [Global Parameter Description](./OPENAPI/10_global_params.md)
- [Troubleshooting FAQ](./OPENAPI/11_api_troubleshooting.md)

---

### 2. Verified 9290 Test Flow

Verified on `https://api-test.growatt.com:9290` under `client_credentials` mode:

1. `POST /oauth2/token`
2. `POST /oauth2/bindDevice`
3. `POST /oauth2/getDeviceInfo`
4. `POST /oauth2/getDeviceData`

Notes:
- Test device labels may appear as `SPH:xxxx` / `SPM:xxxx`, but request bodies should pass the raw SN only.
- Verified working request combination for `bindDevice`:
  - `Authorization: Bearer {access_token}`
  - `Content-Type: application/json`
  - JSON body with raw SN and `pinCode`
- Verified working request combination for both `getDeviceInfo` and `getDeviceData` in this test environment:
  - `Authorization: Bearer {access_token}`
  - `Content-Type: application/json`
  - JSON body: `{"deviceSn":"RAW_DEVICE_SN"}`
- Correct: `RAW_DEVICE_SN`
- Incorrect: `SPH:RAW_DEVICE_SN`

#### Minimal verified examples

```json
// bindDevice
{
    "deviceSnList": [
        {
            "deviceSn": "RAW_DEVICE_SN",
            "pinCode": "TEST_PIN_CODE"
        }
    ]
}

// getDeviceInfo / getDeviceData
{
    "deviceSn": "RAW_DEVICE_SN"
}
```

---

### 3. End-to-End Integration Flow

#### 3.1 Concept Map

```mermaid
%% 本代码严格遵循AI生成Mermaid代码的终极准则v4.1（Mermaid终极大师）
flowchart TD
    A["Apply client credentials"] --> B{"Choose OAuth mode"}
    B --> C["Call oauth2 token API"]
    C --> D["Store access token and refresh token"]
    D --> E["Get authorizable device list"]
    E --> F["Bind devices"]
    F --> G["Call business APIs"]
    G --> H["Get device info"]
    G --> I["Get device data"]
    G --> J["Dispatch device command"]
    J --> K["Read dispatch value"]
    G --> L["Receive push webhook data"]
    G --> M{"Token expired"}
    M -->|"Yes"| N["Call oauth2 refresh API"]
    N --> G
    M -->|"No"| O["Continue"]
```

#### 3.2 Operational Sequence

```mermaid
%% 本代码严格遵循AI生成Mermaid代码的终极准则v4.1（Mermaid终极大师）
sequenceDiagram
    participant Platform as PlatformApp
    participant OAuth as OAuthAPI
    participant Device as DeviceAPI
    participant Push as WebhookAPI

    Platform->>OAuth: POST /oauth2/token
    OAuth-->>Platform: Return token pair
    Platform->>OAuth: Run getApiDeviceList and bindDevice
    OAuth-->>Platform: Return authorized set
    Platform->>Device: Call getDeviceInfo and getDeviceData
    Device-->>Platform: Return data
    Platform->>Device: Call deviceDispatch then read back
    Device-->>Platform: Return dispatch result
    Push-->>Platform: Push dfcData webhook payload
    Platform->>OAuth: POST /oauth2/refresh on expiry
```

---

### 4. Authentication and Token Lifecycle

**Token endpoint**: `POST /oauth2/token`  
Supported `grant_type`:
- `authorization_code`
- `client_credentials`

**Refresh endpoint**: `POST /oauth2/refresh`  
Required:
- `grant_type=refresh_token`
- `refresh_token`
- `client_id`
- `client_secret`

Token validity (from SSOT):
- `access_token`: 7200 seconds
- `refresh_token`: 2592000 seconds

```mermaid
%% 本代码严格遵循AI生成Mermaid代码的终极准则v4.1（Mermaid终极大师）
flowchart LR
    A["Use access token"] --> B{"Still valid"}
    B -->|"Yes"| C["Call API"]
    B -->|"No"| D["Call oauth2 refresh API"]
    D --> E{"Refresh success"}
    E -->|"Yes"| F["Rotate tokens and continue"]
    E -->|"No"| G["Re authorize user"]
```

```mermaid
%% 本代码严格遵循AI生成Mermaid代码的终极准则v4.1（Mermaid终极大师）
sequenceDiagram
    participant Service as ServiceAPI
    participant OAuth as OAuthAPI
    participant API as API

    Service->>API: Call API with access token
    API-->>Service: Return token state
    alt Token valid
        API-->>Service: Return response
    else Token invalid
        Service->>OAuth: POST /oauth2/refresh
        alt Refresh success
            OAuth-->>Service: Return new token pair
            Service->>API: Retry API call
            API-->>Service: Return response
        else Refresh failed
            OAuth-->>Service: Return refresh error
            Service-->>Service: Trigger re-authorization
        end
    end
```

Header convention:
- Most APIs require `Authorization: Bearer {access_token}`.
- For `/oauth2/getDeviceData`, follow SSOT doc header definition (`token`).
- In the validated `api-test.growatt.com:9290` environment, `getDeviceInfo` and `getDeviceData` were successfully verified using `Authorization: Bearer {access_token}` together with JSON body.

---

### 5. Device Authorization Lifecycle

Use these endpoints in order:
1. `POST /oauth2/getApiDeviceList` (candidate devices)
2. `POST /oauth2/bindDevice` (authorize devices)
3. `POST /oauth2/getApiDeviceListAuthed` (check authorized set)
4. `POST /oauth2/unbindDevice` (revoke)

Notes:
- In `client_credentials` mode, `bindDevice` may require `pinCode`.
- Only authorized devices can be operated by downstream APIs.
- In the validated `api-test.growatt.com:9290` environment, test device labels may include prefixes such as `SPH:` / `SPM:`, but API requests should pass the raw SN only.

---

### 6. Operational API Matrix (SSOT Endpoints)

| Capability | Endpoint | Method | Key Input |
| :--- | :--- | :--- | :--- |
| Get token | `/oauth2/token` | POST | `grant_type`, client credentials |
| Refresh token | `/oauth2/refresh` | POST | `refresh_token` |
| Device list (candidate) | `/oauth2/getApiDeviceList` | POST | Bearer token |
| Bind device | `/oauth2/bindDevice` | POST | `deviceSnList` |
| Authorized device list | `/oauth2/getApiDeviceListAuthed` | POST | Bearer token |
| Unbind device | `/oauth2/unbindDevice` | POST | `deviceSnList` |
| Device information | `/oauth2/getDeviceInfo` | POST | `deviceSn` |
| Device telemetry query | `/oauth2/getDeviceData` | POST | `deviceSn` |
| Device dispatch | `/oauth2/deviceDispatch` | POST | `deviceSn`, `setType`, `value`, `requestId` |
| Read dispatch parameter | `/oauth2/readDdeviceDispatch` | POST | `deviceSn`, `setType`, `requestId` |

Push integration:
- Growatt pushes high-frequency payloads to your webhook URL (see [09_api_device_push.md](./OPENAPI/09_api_device_push.md)).
- Payload shape is aligned with device data query fields (`dfcData`).

---

### 7. Dispatch and Read-Back Safety Loop

Dispatch rate limit (SSOT):
- Max **1 command per 5 seconds per device**.

Recommended control loop:

```mermaid
%% 本代码严格遵循AI生成Mermaid代码的终极准则v4.1（Mermaid终极大师）
stateDiagram-v2
    [*] --> Build
    state "Build Command" as Build
    state "Send Dispatch" as Send
    state "Success Code 0" as Success
    state "Timeout Code 16" as Timeout
    state "Offline Code 5" as Offline
    state "Inspect Code 7 or 12" as Inspect
    state "Read Back Verify" as Verify
    state "Complete Cycle" as Complete

    Build --> Send
    Send --> Success
    Send --> Timeout
    Send --> Offline
    Send --> Inspect
    Success --> Verify
    Verify --> Complete
    Timeout --> Send
    Offline --> Complete
    Inspect --> Complete
    Complete --> [*]
```

Key response codes to handle:
- `0`: success
- `2`: `TOKEN_IS_INVALID`
- `5`: `DEVICE_OFFLINE`
- `7`: `WRONG_DEVICE_TYPE`
- `12`: `DEVICE_SN_DOES_NOT_HAVE_PERMISSION`
- `16`: `PARAMETER_SETTING_RESPONSE_TIMEOUT`

---

### 8. Parameter Usage Quick Picks

Use `setType` values from SSOT [10_global_params.md](./OPENAPI/10_global_params.md). Commonly used examples:
- `enable_control`
- `power_on_off_command`
- `time_slot_charge_discharge`
- `active_power_derating_percentage`
- `reactive_power_mode`
- `remote_power_control_enable`
- `remote_charge_discharge_power`
- `ac_charge_enable`

Guidance:
- Validate parameter ranges before sending dispatch.
- Always perform read-back using `/oauth2/readDdeviceDispatch` for critical controls.

---

### 8. Integration Checklist

- [ ] Obtained `client_id` and `client_secret`
- [ ] Implemented `/oauth2/token` + `/oauth2/refresh`
- [ ] Implemented token storage and rotation
- [ ] Implemented device authorization lifecycle (`getApiDeviceList` / `bindDevice` / `getApiDeviceListAuthed` / `unbindDevice`)
- [ ] Implemented telemetry pull (`/oauth2/getDeviceData`)
- [ ] Implemented webhook receiver for push payloads
- [ ] Implemented dispatch + read-back loop (`/oauth2/deviceDispatch` + `/oauth2/readDdeviceDispatch`)
- [ ] Added handling for codes `2/5/7/12/16`
- [ ] Validated parameter values against `10_global_params.md`

---

**Change note**: This quick guide has been corrected to match OPENAPI SSOT endpoints and naming.

**Growatt Open API Team**  
March 2026
