# Global oauth2-openApi Platform Test Report

## Relationship to Official Docs

- The official docs define the general contract and recommended request shapes.
- This report records only behavior observed in the global test environment on 2026-04-08.
- This rerun followed the latest published docs and preserved the current object-entry `bindDevice` request shape.

## Test Environment

| Item | Content |
| :--- | :--- |
| Backend Address | `https://opencloud-test.growatt.com/prod-api` |
| Frontend Login Address | `https://opencloud-test.growatt.com/#/login?client_id=testcodemode&state=<randomstr>` |
| Test Method | Live API integration test |
| Authentication | OAuth2 authorization-code mode |
| Test Tool | PowerShell `Invoke-RestMethod` plus .NET `HttpClient` for the frontend login URL |
| Test Date | 2026-04-08 |
| Test Timestamp | `2026-04-08 15:16:04 +08:00` |
| Time Zone | Asia/Shanghai (UTC+8) |
| Primary Test Device | `WCK6584462` |

---

## Credentials Used

- `client_id=testcodemode`
- `client_secret=***`
- `username=0auth0`
- `password=G1234567890`
- password digest actually sent to `/prod-api/login`: `77700905e5c9c02216f6c6352dfbb698`

---

## Test Results Summary

| API / Step | Method | Path | Status |
| :--- | :--- | :--- | :--- |
| Frontend login page reachable | GET | `/#/login?...` | PASS |
| User login | POST | `/prod-api/login` | PASS |
| Get auth code | GET | `/prod-api/auth` | PASS |
| Get token | POST | `/oauth2/token` | PASS |
| Get candidate device list | POST | `/oauth2/getDeviceList` | PASS |
| Pre-clean authorization | POST | `/oauth2/unbindDevice` | PASS |
| Pre-clean recheck | POST | `/oauth2/getDeviceListAuthed` | PASS, empty array |
| Bind device per latest docs | POST | `/oauth2/bindDevice` | PASS |
| Get authorized device list | POST | `/oauth2/getDeviceListAuthed` | PASS |
| Get device info | POST | `/oauth2/getDeviceInfo` | PASS |
| Get device data | POST | `/oauth2/getDeviceData` | PASS |
| Refresh token | POST | `/oauth2/refresh` | PASS |
| Recheck with pre-refresh token | POST | `/oauth2/getDeviceListAuthed` | PASS, returned `TOKEN_IS_INVALID` |
| Recheck with fresh token | POST | `/oauth2/getDeviceListAuthed` | PASS |
| Unbind with fresh token | POST | `/oauth2/unbindDevice` | PASS |
| Final authorized-list recheck | POST | `/oauth2/getDeviceListAuthed` | PASS, empty array |

---

## Key Findings

1. The global authorization-code flow still worked through `GET /#/login?...`, `POST /prod-api/login`, and `GET /prod-api/auth`.
2. `/prod-api/oauth2/token` returned a fresh token pair with `expires_in=604738` and `refresh_expires_in=2591503`.
3. `getDeviceList` returned `deviceSn=WCK6584462` and `datalogSn=ZGQ0E820UH`, and this time `authFlag=false`, so the initial authorization state was already clean.
4. The latest docs request shape `{"deviceSnList":[{"deviceSn":"WCK6584462"}]}` still succeeded directly and returned `data: 1`.
5. `getDeviceInfo` returned a battery-bearing device with `batteryCapacity=14400`, `batteryNominalPower=4000`, and `batterySn=SK01234567890000`.
6. `getDeviceData` returned a complete live payload instead of the short excerpt used in older reports; the current telemetry showed `fac=49.98`, `status=6`, `priority=1`, and zeroed PV / battery power at the observation time.
7. `/prod-api/oauth2/refresh` returned `expires_in=604800` and `refresh_expires_in=2591999`.
8. After refresh, the old access token immediately returned `TOKEN_IS_INVALID`; all follow-up reads and cleanup used the fresh token.
9. Final cleanup succeeded and the last `getDeviceListAuthed` recheck returned an empty array.

---

## Detailed Test Cases

### 1. Frontend Login Page

Request:

```text
GET https://opencloud-test.growatt.com/#/login?client_id=testcodemode&state=codexglobal20260408151542
```

Response:

```json
{
  "httpStatus": 200
}
```

Result: PASS

### 2. User Login `/prod-api/login`

Request URL:

```text
POST https://opencloud-test.growatt.com/prod-api/login
```

Request body:

```json
{
  "username": "0auth0",
  "password": "77700905e5c9c02216f6c6352dfbb698",
  "clientId": "testcodemode"
}
```

Response:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "redirectUri": "https://opencloud-test.growatt.com/prod-api/testToken/testToken1",
    "country": "Singapore",
    "clientId": "testcodemode",
    "clientCompany": "testcodemode",
    "id": "3814483",
    "state": null,
    "token": "***",
    "username": "0auth0"
  }
}
```

Result: PASS

### 3. Get Auth Code `/prod-api/auth`

Request:

```text
GET https://opencloud-test.growatt.com/prod-api/auth?response_type=code&client_id=testcodemode&redirect_uri=https%3A%2F%2Fopencloud-test.growatt.com%2Fprod-api%2FtestToken%2FtestToken1&scope=scope&state=codexglobal20260408151542
Authorization: Bearer ***
```

Response:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "redirect_uri": "https://opencloud-test.growatt.com/prod-api/testToken/testToken1",
    "state": "codexglobal20260408151542",
    "client_id": "testcodemode",
    "auth_code": "***"
  }
}
```

Result: PASS

### 4. Get Token `/oauth2/token`

Request URL:

```text
POST https://opencloud-test.growatt.com/prod-api/oauth2/token
```

Request body:

```json
{
  "grant_type": "authorization_code",
  "code": "***",
  "client_id": "testcodemode",
  "client_secret": "***",
  "redirect_uri": "https://opencloud-test.growatt.com/prod-api/testToken/testToken1"
}
```

Response:

```json
{
  "access_token": "***",
  "refresh_token": "***",
  "refresh_expires_in": 2591503,
  "token_type": "Bearer",
  "expires_in": 604738
}
```

Result: PASS

### 5. Get Candidate Device List `/oauth2/getDeviceList`

Request:

```text
POST https://opencloud-test.growatt.com/prod-api/oauth2/getDeviceList
Authorization: Bearer ***
```

Response:

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
      "authFlag": false
    }
  ],
  "message": "SUCCESSFUL_OPERATION"
}
```

Result: PASS

### 6a. Pre-clean Authorization `/oauth2/unbindDevice`

Request:

```text
POST https://opencloud-test.growatt.com/prod-api/oauth2/unbindDevice
Authorization: Bearer ***
```

Request body:

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

Result: PASS

### 6b. Pre-clean Recheck `/oauth2/getDeviceListAuthed`

Request:

```text
POST https://opencloud-test.growatt.com/prod-api/oauth2/getDeviceListAuthed
Authorization: Bearer ***
```

Response:

```json
{
  "code": 0,
  "data": [],
  "message": "SUCCESSFUL_OPERATION"
}
```

Result: PASS

### 7. Bind Device `/oauth2/bindDevice`

Request:

```text
POST https://opencloud-test.growatt.com/prod-api/oauth2/bindDevice
Authorization: Bearer ***
```

Request body:

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

Result: PASS

### 8. Get Authorized Device List `/oauth2/getDeviceListAuthed`

Request:

```text
POST https://opencloud-test.growatt.com/prod-api/oauth2/getDeviceListAuthed
Authorization: Bearer ***
```

Response:

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

Request:

```text
POST https://opencloud-test.growatt.com/prod-api/oauth2/getDeviceInfo
Authorization: Bearer ***
```

Request body:

```json
{
  "deviceSn": "WCK6584462"
}
```

Response:

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
    "dtc": 3502,
    "communicationVersion": "ZCBC-0009",
    "existBattery": true,
    "batterySn": "SK01234567890000",
    "batteryModel": null,
    "batteryCapacity": 14400,
    "batteryNominalPower": 4000,
    "authFlag": true,
    "batteryList": [
      {
        "batterySn": "SK01234567890000",
        "batteryModel": null,
        "batteryCapacity": 14400,
        "batteryNominalPower": 4000
      }
    ]
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

Result: PASS

### 10. Get Device Data `/oauth2/getDeviceData`

Request:

```text
POST https://opencloud-test.growatt.com/prod-api/oauth2/getDeviceData
Authorization: Bearer ***
```

Request body:

```json
{
  "deviceSn": "WCK6584462"
}
```

Response:

```json
{
  "code": 0,
  "data": {
    "fac": 49.98,
    "backupPower": 0.0,
    "batPower": 0.0,
    "deviceSn": "WCK6584462",
    "pac": 0.4,
    "etoUserToday": 0.0,
    "utcTime": "2026-04-08 07:15:53",
    "etoUserTotal": 0.0,
    "pexPower": 0.0,
    "epvTotal": 0.0,
    "batteryList": [],
    "protectCode": 0,
    "reactivePower": 81.6,
    "etoGridTotal": 0.0,
    "genPower": 0.0,
    "priority": 1,
    "vac3": 230.7,
    "etoGridToday": 0.0,
    "protectSubCode": 0,
    "vac2": 230.7,
    "vac1": 230.7,
    "payLoadPower": 0.0,
    "faultCode": 0,
    "faultSubCode": 0,
    "batteryStatus": 3,
    "ppv": 0.0,
    "meterPower": 0.0,
    "smartLoadPower": 0.0,
    "status": 6
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

Result: PASS

### 11. Refresh Token `/oauth2/refresh`

Request URL:

```text
POST https://opencloud-test.growatt.com/prod-api/oauth2/refresh
```

Request body:

```json
{
  "grant_type": "refresh_token",
  "refresh_token": "***",
  "client_id": "testcodemode",
  "client_secret": "***"
}
```

Response:

```json
{
  "access_token": "***",
  "refresh_token": "***",
  "refresh_expires_in": 2591999,
  "token_type": "Bearer",
  "expires_in": 604800
}
```

Result: PASS

### 12. Recheck with Pre-refresh Token `/oauth2/getDeviceListAuthed`

Request:

```text
POST https://opencloud-test.growatt.com/prod-api/oauth2/getDeviceListAuthed
Authorization: Bearer ***
```

Response:

```json
{
  "code": 2,
  "message": "TOKEN_IS_INVALID"
}
```

Result: PASS

### 13. Recheck with Fresh Token `/oauth2/getDeviceListAuthed`

Request:

```text
POST https://opencloud-test.growatt.com/prod-api/oauth2/getDeviceListAuthed
Authorization: Bearer ***
```

Response:

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

### 14a. Unbind with Fresh Token `/oauth2/unbindDevice`

Request:

```text
POST https://opencloud-test.growatt.com/prod-api/oauth2/unbindDevice
Authorization: Bearer ***
```

Request body:

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

Result: PASS

### 14b. Final Authorized-list Recheck `/oauth2/getDeviceListAuthed`

Request:

```text
POST https://opencloud-test.growatt.com/prod-api/oauth2/getDeviceListAuthed
Authorization: Bearer ***
```

Response:

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

This 2026-04-08 rerun against the global test environment completed successfully with full request / response capture and confirmed the following:

- The current global authorization-code path still works through `/#/login`, `/prod-api/login`, and `/prod-api/auth`.
- The actual bind target remains `deviceSn=WCK6584462`, with `datalogSn=ZGQ0E820UH`.
- The account started from a clean authorization state in this rerun (`authFlag=false` in `getDeviceList`).
- `bindDevice` still succeeds with the object-entry payload and returns `data: 1`.
- `refresh` still invalidates the old access token immediately.
- Final cleanup succeeded and the authorized-device list returned to empty.
