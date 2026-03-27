# Global oauth2-openApi Platform Test Report

## Relationship to Official Docs

- The official docs define the general contract and recommended request shapes.
- This report records only behavior observed in the global test environment on 2026-03-27.
- This rerun follows the latest official docs: the main `bindDevice` flow uses only object-entry payloads and no longer treats the legacy string-array payload as the primary path.

## Test Environment

| Item | Content |
| :--- | :--- |
| Backend Address | `https://opencloud-test.growatt.com/prod-api` |
| Frontend Login Address | `https://opencloud-test.growatt.com/#/login?client_id=testcodemode&state=<randomstr>` |
| Test Method | Live API integration test |
| Authentication | OAuth2 authorization-code mode |
| Test Tool | PowerShell `Invoke-WebRequest` / `Invoke-RestMethod` |
| Test Date | 2026-03-27 |
| Time Zone | Asia/Shanghai (UTC+8) |
| Primary Test Device | `WCK6584462` |

---

## Credentials Used

- `client_id=testcodemode`
- `client_secret=***`
- `username=0auth0`
- `password=G1234567890`
- User-provided clue: `S/N=ZG00E820UH`

---

## Test Results Summary

| API / Step | Method | Path | Status |
| :--- | :--- | :--- | :--- |
| Frontend login page reachable | GET | `/#/login?...` | PASS |
| User login | POST | `/prod-api/login` | PASS |
| Get auth code | GET | `/prod-api/auth` | PASS |
| Get token | POST | `/oauth2/token` | PASS |
| Get candidate device list | POST | `/oauth2/getDeviceList` | PASS |
| Pre-clean stale authorization | POST | `/oauth2/unbindDevice` | PASS |
| Bind device per latest docs | POST | `/oauth2/bindDevice` | PASS |
| Get authorized device list | POST | `/oauth2/getDeviceListAuthed` | PASS |
| Get device info | POST | `/oauth2/getDeviceInfo` | PASS |
| Get device data | POST | `/oauth2/getDeviceData` | PASS |
| Refresh token | POST | `/oauth2/refresh` | PASS |
| Recheck with pre-refresh token | POST | `/oauth2/getDeviceListAuthed` | Expected environment error `TOKEN_IS_INVALID` |
| Recheck with fresh token | POST | `/oauth2/getDeviceListAuthed` | PASS |
| Unbind with fresh token | POST | `/oauth2/unbindDevice` | PASS |
| Final authorized-list recheck | POST | `/oauth2/getDeviceListAuthed` | PASS, empty array |

---

## Key Findings

1. On 2026-03-27, the actual working login and authorization-code endpoints in the global environment were `POST /prod-api/login` and `GET /prod-api/auth`, not root-path `/login` and `/auth`.
2. The global frontend flow still accepts the MD5-hashed password. The password digest sent in this rerun was `77700905e5c9c02216f6c6352dfbb698`.
3. `getDeviceList` returned the real bind target as `deviceSn=WCK6584462`, with `datalogSn=ZGQ0E820UH`. The user-provided `ZG00E820UH` is closer to the datalogger identifier than to the device SN used by device-level APIs.
4. The latest official-doc payload shape worked directly in the global environment: `{"deviceSnList":[{"deviceSn":"WCK6584462"}]}` succeeded and did not require `pinCode` for this device.
5. This rerun detected a stale authorization left behind by the previous interrupted cleanup, so it first executed a pre-clean `unbindDevice` and confirmed that the authorized-device list was empty before rebinding.
6. This rerun also confirmed a new global-environment behavior: after `/oauth2/refresh`, the pre-refresh access token immediately returns `TOKEN_IS_INVALID`; all subsequent reads and cleanup must switch to the fresh token.
7. Cleanup succeeded with the fresh token, and the final delayed recheck confirmed that the authorized-device list returned to empty.

---

## Detailed Test Cases

### 1. Frontend Login Page

- Accessing `https://opencloud-test.growatt.com/#/login?client_id=testcodemode&state=codexglobal20260327165812` returned HTTP `200`.
- This step was used only to confirm that the global frontend entry point was reachable.

### 2. User Login `/prod-api/login`

Request body:

```json
{
  "username": "0auth0",
  "password": "77700905e5c9c02216f6c6352dfbb698",
  "clientId": "testcodemode"
}
```

Response excerpt:

```json
{
  "code": 200,
  "data": {
    "redirectUri": "https://opencloud-test.growatt.com/prod-api/testToken/testToken1",
    "country": "Singapore",
    "clientId": "testcodemode",
    "token": "***",
    "username": "0auth0"
  }
}
```

Result: PASS

### 3. Get Auth Code `/prod-api/auth`

Request:

```text
GET /prod-api/auth?response_type=code&client_id=testcodemode&redirect_uri=https://opencloud-test.growatt.com/prod-api/testToken/testToken1&scope=scope&state=codexglobal20260327165812
Authorization: Bearer ***
```

Response excerpt:

```json
{
  "code": 200,
  "data": {
    "redirect_uri": "https://opencloud-test.growatt.com/prod-api/testToken/testToken1",
    "state": "codexglobal20260327165812",
    "client_id": "testcodemode",
    "auth_code": "***"
  }
}
```

Result: PASS

### 4. Get Token `/oauth2/token`

Response excerpt:

```json
{
  "access_token": "***",
  "refresh_token": "***",
  "token_type": "Bearer",
  "expires_in": 604733,
  "refresh_expires_in": 2585309
}
```

Result: PASS

### 5. Get Candidate Device List `/oauth2/getDeviceList`

Response excerpt:

```json
{
  "code": 0,
  "data": [
    {
      "deviceSn": "WCK6584462",
      "deviceTypeName": "sph",
      "model": "SPH 6000TL BL-UP",
      "nominalPower": 6000,
      "datalogSn": "ZGQ0E820UH",
      "dtc": 3502,
      "communicationVersion": "ZCBC-0009",
      "authFlag": true
    }
  ],
  "message": "SUCCESSFUL_OPERATION"
}
```

Conclusion:

- The current account could see one candidate device in the global environment.
- The actual bind target for device-level APIs was `deviceSn=WCK6584462`.
- `authFlag=true` indicated that a stale authorization relation was still present before the rerun started, so a cleanup step was required.

### 6. Pre-clean Stale Authorization

Because the previous run used the old token after refresh, the device authorization relation was still present. This rerun first cleaned up the stale state with:

```json
{
  "deviceSnList": [
    "WCK6584462"
  ]
}
```

Response:

```json
{
  "code": 0,
  "data": null,
  "message": "SUCCESSFUL_OPERATION"
}
```

Delayed recheck of `getDeviceListAuthed` after about 5 seconds:

```json
{
  "code": 0,
  "data": [],
  "message": "SUCCESSFUL_OPERATION"
}
```

Result: PASS. The main flow then restarted from a clean state.

### 7. Bind Device `/oauth2/bindDevice`

This rerun used only the latest official-doc request shape:

```json
{
  "deviceSnList": [
    {
      "deviceSn": "WCK6584462"
    }
  ]
}
```

Response:

```json
{
  "code": 0,
  "data": 1,
  "message": "SUCCESSFUL_OPERATION"
}
```

Conclusion:

- The object-entry payload succeeded directly in the global environment.
- No `pinCode` was required for this device in this rerun.

### 8. Get Authorized Device List `/oauth2/getDeviceListAuthed`

Response excerpt:

```json
{
  "code": 0,
  "data": [
    {
      "deviceSn": "WCK6584462",
      "deviceTypeName": "sph",
      "model": "SPH 6000TL BL-UP",
      "nominalPower": 6000,
      "datalogSn": "ZGQ0E820UH",
      "dtc": 3502,
      "communicationVersion": "ZCBC-0009",
      "authFlag": true
    }
  ],
  "message": "SUCCESSFUL_OPERATION"
}
```

Result: PASS

### 9. Get Device Info `/oauth2/getDeviceInfo`

Response excerpt:

```json
{
  "code": 0,
  "data": {
    "deviceSn": "WCK6584462",
    "deviceTypeName": "sph",
    "model": "SPH 6000TL BL-UP",
    "nominalPower": 6000,
    "datalogSn": "ZGQ0E820UH",
    "datalogDeviceTypeName": "ShineWiLan-X2",
    "existBattery": true,
    "batteryCapacity": 14400,
    "batteryNominalPower": 4000,
    "authFlag": true
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

Result: PASS

### 10. Get Device Data `/oauth2/getDeviceData`

Response excerpt:

```json
{
  "code": 0,
  "data": {
    "utcTime": "2026-03-27 08:58:18",
    "ppv": 0.0,
    "payLoadPower": 0.0,
    "batPower": 0.0,
    "status": 6
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

Result: PASS

### 11. Refresh Token `/oauth2/refresh`

Response excerpt:

```json
{
  "access_token": "***",
  "refresh_token": "***",
  "token_type": "Bearer",
  "expires_in": 604800,
  "refresh_expires_in": 2592000
}
```

Result: PASS

### 12. Old Token vs Fresh Token After Refresh

After refresh, reusing the pre-refresh access token on `getDeviceListAuthed` returned:

```json
{
  "code": 2,
  "message": "TOKEN_IS_INVALID"
}
```

Switching to the fresh token restored normal access:

```json
{
  "code": 0,
  "data": [
    {
      "deviceSn": "WCK6584462",
      "authFlag": true
    }
  ],
  "message": "SUCCESSFUL_OPERATION"
}
```

Conclusion:

- In the global environment, `refresh` immediately invalidated the old access token.
- All post-refresh reads and cleanup had to use the fresh token.

### 13. Unbind Device with Fresh Token `/oauth2/unbindDevice`

Request body:

```json
{
  "deviceSnList": [
    "WCK6584462"
  ]
}
```

Immediate response:

```json
{
  "code": 0,
  "data": null,
  "message": "SUCCESSFUL_OPERATION"
}
```

Delayed recheck of `getDeviceListAuthed` after about 5 seconds:

```json
{
  "code": 0,
  "data": [],
  "message": "SUCCESSFUL_OPERATION"
}
```

Result: PASS

---

## Final Conclusion

This rerun against the global test environment completed successfully based on the latest official docs and confirmed the following stable conclusions:

- The current global environment flow should use `POST /prod-api/login` and `GET /prod-api/auth`.
- `bindDevice` succeeds with the object-entry payload `{"deviceSnList":[{"deviceSn":"WCK6584462"}]}`.
- `pinCode` was not required for this device in the global environment.
- `deviceSn` is the actual bind target; the user-provided `ZG00E820UH` is closer to the datalogger identifier.
- After `/oauth2/refresh`, the old access token immediately becomes `TOKEN_IS_INVALID`, so all subsequent operations must switch to the fresh token.
- Cleanup completed successfully with the fresh token, and the final authorized-device list returned to empty.
