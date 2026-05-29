# AU oauth2-openApi Full Test Report

This report records the live rerun completed on 2026-05-29 against the Australia test environment.
It follows the detailed structure and cleanup-oriented flow used by the latest platform test report, while recording only AU environment observations.

Sensitive credentials, tokens, auth codes, and password digests are masked as `***`.

## Relationship to Latest Baseline

- This report records only behavior observed in the AU test environment on 2026-05-29.
- The 2026-04-08 detailed platform report is used only as a formatting and flow reference.
- The request shape keeps the latest object-entry `bindDevice` form: `{"deviceSnList":[{"deviceSn":"..."}]}`.

## Run Metadata

| Item | Content |
| :--- | :--- |
| Backend Address | `https://opencloud-test-au.growatt.com/prod-api` |
| Frontend Login Address | `https://opencloud-test-au.growatt.com/#/login?client_id=<client_id>&state=<randomstr>` |
| Reference Structure | 2026-04-08 detailed platform report |
| Test Method | Live API integration test |
| Test Tool | Node.js `fetch` capture runner |
| Test Date | `2026-05-29` |
| Run Started | `2026-05-29 16:05:39 +08:00` |
| Run Ended | `2026-05-29 16:05:51 +08:00` |
| Time Zone | Asia/Shanghai (UTC+8) |
| Selected Test Device | `PGP0A12367` |
| Device Model | `MOD 10KTL3-XH` |

## Credentials Used

- `client_id=caa1ff3ae8217c541ec318193ee2a0d2`
- `client_secret=***`
- `username=0auth1`
- password digest sent to `/login`: `***`
- device `pinCode`: not provided

## Overall Verdict

| Area | Result | Notes |
| :--- | :--- | :--- |
| Authorization-code mode | PARTIAL PASS | `17/18` steps passed; `deviceDispatch` returned `PARAMETER_SETTING_FAILED` |
| Client-credentials mode | PARTIAL / PERMISSION-BLOCKED | Token and mode-boundary checks passed, but device bind/read failed with `DEVICE_SN_DOES_NOT_HAVE_PERMISSION` |
| Post-run cleanup | PASS | Final authorized-list rechecks returned empty arrays |

Human-classified result: `23 PASS`, `4 FAIL`, `2 WARN / rate-limited`.

## Test Results Summary

### Authorization Code Mode

| Step | Endpoint | Result | Observed Outcome |
| :--- | :--- | :--- | :--- |
| A1 | `GET /#/login` | PASS | Frontend login page reachable, HTTP `200` |
| A2 | `POST /login` | PASS | Login succeeded with `code=200` |
| A3 | `GET /auth` | PASS | Authorization code issued successfully |
| A4 | `POST /oauth2/token` | PASS | `expires_in=604495`, refresh token returned |
| A5 | `POST /oauth2/getDeviceList` | PASS | Returned candidate device `PGP0A12367`, `authFlag=false` |
| A6 | `POST /oauth2/unbindDevice` | PASS | Pre-clean succeeded with `code=0` |
| A7 | `POST /oauth2/getDeviceListAuthed` | PASS | Pre-clean recheck returned empty array |
| A8 | `POST /oauth2/bindDevice` | PASS | Object-entry payload returned `code=0`, `data=1` |
| A9 | `POST /oauth2/getDeviceListAuthed` | PASS | Authorized list contained `PGP0A12367`, `authFlag=true` |
| A10 | `POST /oauth2/getDeviceInfo` | PASS | Returned `model=MOD 10KTL3-XH`, battery information, `authFlag=true` |
| A11 | `POST /oauth2/getDeviceData` | PASS | Returned live telemetry with `soc=95`, `status=6` |
| A12 | `POST /oauth2/deviceDispatch` | FAIL | Returned `code=6`, `message=PARAMETER_SETTING_FAILED` |
| A13 | `POST /oauth2/readDeviceDispatch` | PASS | Returned current dispatch settings |
| A14 | `POST /oauth2/refresh` | PASS | Refreshed token set returned `expires_in=604800` |
| A15 | `POST /oauth2/getDeviceListAuthed` with old token | PASS | Returned `code=2`, `message=TOKEN_IS_INVALID` |
| A16 | `POST /oauth2/getDeviceListAuthed` with fresh token | PASS | Authorized list still contained `PGP0A12367` |
| A17 | `POST /oauth2/unbindDevice` with fresh token | PASS | Unbind succeeded with `code=0` |
| A18 | `POST /oauth2/getDeviceListAuthed` with fresh token | PASS | Final recheck returned empty array |

### Client Credentials Mode

| Step | Endpoint | Result | Observed Outcome |
| :--- | :--- | :--- | :--- |
| C1 | `POST /oauth2/token` | PASS | Returned access-token-only response, `expires_in=604800` |
| C2 | `POST /oauth2/getDeviceList` | PASS | Returned expected `code=103`, `message=WRONG_GRANT_TYPE` |
| C3 | `POST /oauth2/unbindDevice` | PASS | Pre-clean succeeded with `code=0` |
| C4 | `POST /oauth2/bindDevice` | FAIL | Returned `code=12`, `message=DEVICE_SN_DOES_NOT_HAVE_PERMISSION` |
| C5 | `POST /oauth2/getDeviceListAuthed` | PASS | Returned empty authorized list |
| C6 | `POST /oauth2/getDeviceInfo` | FAIL | Returned `code=12`, `message=DEVICE_SN_DOES_NOT_HAVE_PERMISSION` |
| C7 | `POST /oauth2/getDeviceData` | FAIL | Returned `code=12`, `message=DEVICE_SN_DOES_NOT_HAVE_PERMISSION` |
| C8 | `POST /oauth2/deviceDispatch` | WARN | Returned `code=105`, `message=TOO_MANY_REQUEST` |
| C9 | `POST /oauth2/readDeviceDispatch` | WARN | Returned `code=105`, `message=TOO_MANY_REQUEST` |
| C10 | `POST /oauth2/unbindDevice` | PASS | Cleanup call succeeded with `code=0` |
| C11 | `POST /oauth2/getDeviceListAuthed` | PASS | Final recheck returned empty array |

## Key Findings

1. The AU authorization-code flow worked end to end through frontend reachability, login, auth-code issuance, token exchange, device listing, bind, read, refresh, old-token invalidation, and cleanup.
2. The selected candidate device was `deviceSn=PGP0A12367`, with `datalogSn=JKN0DY60D4`, `deviceTypeName=min`, and model `MOD 10KTL3-XH`.
3. Authorization-code `bindDevice` succeeded with object-entry payload and no `pinCode`, returning `data: 1`.
4. `getDeviceInfo` returned a battery-bearing device with `batterySn=CXM00000231200QV`, `batteryModel=APX 98034-P2`, `batteryCapacity=5000`, and `batteryNominalPower=2500`.
5. `getDeviceData` returned a full live telemetry payload. The observed reading at `2026-05-29 08:05:42` included `soc=95`, `ppv=2030.1`, `batPower=-1222`, `payLoadPower=95.7`, `meterPower=-3156.4`, and `status=6`.
6. Authorization-code `deviceDispatch` did not pass for the tested command and returned `PARAMETER_SETTING_FAILED`; `readDeviceDispatch` still succeeded and returned current settings.
7. The refresh flow invalidated the old access token immediately.
8. Client-credentials token issuance succeeded and `getDeviceList` correctly rejected that grant type with `WRONG_GRANT_TYPE`.
9. Client-credentials device binding failed with `DEVICE_SN_DOES_NOT_HAVE_PERMISSION`. Because no device `pinCode` was supplied and the client token had no authorization for `PGP0A12367`, subsequent client-mode device info and telemetry reads also failed with permission errors.
10. Client-mode dispatch/read-dispatch calls returned `TOO_MANY_REQUEST`; these are recorded as rate-limited observations, not functional pass results.
11. Final cleanup succeeded. Both authorization-code and client-credentials final authorized-list checks returned empty arrays.

## Detailed Test Cases

### 1. Frontend Login Page

Request:

```text
GET https://opencloud-test-au.growatt.com/#/login?client_id=caa1ff3ae8217c541ec318193ee2a0d2&state=codexlatest20260529
```

Response:

```json
{
  "httpStatus": 200
}
```

Result: PASS

### 2. User Login `/login`

Request URL:

```text
POST https://opencloud-test-au.growatt.com/prod-api/login
```

Request body:

```json
{
  "username": "0auth1",
  "password": "***",
  "clientId": "caa1ff3ae8217c541ec318193ee2a0d2"
}
```

Response:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "redirectUri": "https://opencloud-test-au.growatt.com/prod-api/testToken/testToken1",
    "country": "Australia",
    "clientId": "caa1ff3ae8217c541ec318193ee2a0d2",
    "clientCompany": "AGL",
    "id": "2922757",
    "state": null,
    "token": "***",
    "username": "0auth1"
  }
}
```

Result: PASS

### 3. Get Auth Code `/auth`

Request:

```text
GET https://opencloud-test-au.growatt.com/prod-api/auth?response_type=code&client_id=caa1ff3ae8217c541ec318193ee2a0d2&redirect_uri=https%3A%2F%2Fopencloud-test-au.growatt.com%2Fprod-api%2FtestToken%2FtestToken1&scope=scope&state=codexlatest20260529
Authorization: Bearer ***
```

Response:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "redirect_uri": "https://opencloud-test-au.growatt.com/prod-api/testToken/testToken1",
    "state": "codexlatest20260529",
    "client_id": "caa1ff3ae8217c541ec318193ee2a0d2",
    "auth_code": "***"
  }
}
```

Result: PASS

### 4. Get Authorization-Code Token `/oauth2/token`

Request URL:

```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/token
```

Request body:

```json
{
  "grant_type": "authorization_code",
  "code": "***",
  "client_id": "caa1ff3ae8217c541ec318193ee2a0d2",
  "client_secret": "***",
  "redirect_uri": "https://opencloud-test-au.growatt.com/prod-api/testToken/testToken1"
}
```

Response:

```json
{
  "access_token": "***",
  "refresh_token": "***",
  "refresh_expires_in": 2485196,
  "token_type": "Bearer",
  "expires_in": 604495
}
```

Result: PASS

### 5. Get Candidate Device List `/oauth2/getDeviceList`

Request:

```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/getDeviceList
Authorization: Bearer ***
```

Response:

```json
{
  "code": 0,
  "data": [
    {
      "deviceSn": "PGP0A12367",
      "deviceTypeName": "min",
      "model": "MOD 10KTL3-XH",
      "nominalPower": 6000,
      "datalogSn": "JKN0DY60D4",
      "dtc": 5400,
      "communicationVersion": "ZBDC-0017",
      "authFlag": false
    }
  ],
  "message": "SUCCESSFUL_OPERATION"
}
```

Result: PASS

### 6. Pre-clean Authorization `/oauth2/unbindDevice`

Request:

```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/unbindDevice
Authorization: Bearer ***
Content-Type: application/json
```

Request body:

```json
{
  "deviceSnList": [
    "PGP0A12367"
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

### 7. Pre-clean Recheck `/oauth2/getDeviceListAuthed`

Response:

```json
{
  "code": 0,
  "data": [],
  "message": "SUCCESSFUL_OPERATION"
}
```

Result: PASS

### 8. Bind Device `/oauth2/bindDevice`

Request:

```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/bindDevice
Authorization: Bearer ***
Content-Type: application/json
```

Request body:

```json
{
  "deviceSnList": [
    {
      "deviceSn": "PGP0A12367"
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

### 9. Get Authorized Device List `/oauth2/getDeviceListAuthed`

Response:

```json
{
  "code": 0,
  "data": [
    {
      "deviceSn": "PGP0A12367",
      "deviceTypeName": "min",
      "model": "MOD 10KTL3-XH",
      "nominalPower": 6000,
      "datalogSn": "JKN0DY60D4",
      "dtc": 5400,
      "communicationVersion": "ZBDC-0017",
      "authFlag": true
    }
  ],
  "message": "SUCCESSFUL_OPERATION"
}
```

Result: PASS

### 10. Get Device Info `/oauth2/getDeviceInfo`

Request body:

```json
{
  "deviceSn": "PGP0A12367"
}
```

Response:

```json
{
  "code": 0,
  "data": {
    "deviceSn": "PGP0A12367",
    "deviceTypeName": "min",
    "model": "MOD 10KTL3-XH",
    "nominalPower": 6000,
    "datalogSn": "JKN0DY60D4",
    "datalogDeviceTypeName": "ShineWiLan-X2",
    "dtc": 5400,
    "communicationVersion": "ZBDC-0017",
    "unifiedAPIver": "v2.02",
    "deviceVersion": null,
    "datalogVersion": "7.6.2.5",
    "existBattery": true,
    "batterySn": "CXM00000231200QV",
    "batteryModel": "APX 98034-P2",
    "batteryCapacity": 5000,
    "batteryNominalPower": 2500,
    "authFlag": true,
    "batteryList": [
      {
        "batterySn": "CXM00000231200QV",
        "batteryModel": "APX 98034-P2",
        "batteryCapacity": 5000,
        "batteryNominalPower": 2500
      }
    ]
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

Result: PASS

### 11. Get Device Data `/oauth2/getDeviceData`

Request body:

```json
{
  "deviceSn": "PGP0A12367"
}
```

Response:

```json
{
  "code": 0,
  "data": {
    "soc": 95,
    "fac": 50.03,
    "backupPower": 0,
    "batPower": -1222,
    "deviceSn": "PGP0A12367",
    "pac": 2982.3,
    "etoUserToday": 1.4,
    "utcTime": "2026-05-29 08:05:42",
    "etoUserTotal": 336.5,
    "pexPower": 0,
    "epvTotal": 0,
    "batteryList": [
      {
        "chargePower": 0,
        "soc": 95,
        "echargeToday": 5.6,
        "vbat": 380.4,
        "index": 1,
        "echargeTotal": 1055.9,
        "dischargePower": 1222,
        "edischargeToday": 4.7,
        "ibat": -3.2,
        "soh": 100,
        "edischargeTotal": 1042.4,
        "status": 0
      }
    ],
    "protectCode": 0,
    "reactivePower": 505.7,
    "etoGridTotal": 1614.9,
    "genPower": 0,
    "priority": 2,
    "vac3": 223.72,
    "etoGridToday": 13.6,
    "protectSubCode": 0,
    "vac2": 223.78,
    "vac1": 225.22,
    "payLoadPower": 95.7,
    "faultCode": 0,
    "faultSubCode": 0,
    "batteryStatus": 3,
    "ppv": 2030.1,
    "meterPower": -3156.4,
    "status": 6
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

Result: PASS

### 12. Device Parameter Setting `/oauth2/deviceDispatch`

Request body:

```json
{
  "deviceSn": "PGP0A12367",
  "value": {
    "type": "chargeCommand",
    "duration": 5,
    "percentage": 20
  },
  "requestId": "12345678901234567890123456789012",
  "setType": "duration_and_power_charge_discharge"
}
```

Response:

```json
{
  "code": 6,
  "data": null,
  "message": "PARAMETER_SETTING_FAILED"
}
```

Result: FAIL

### 13. Device Parameter Read `/oauth2/readDeviceDispatch`

Request body:

```json
{
  "deviceSn": "PGP0A12367",
  "setType": "duration_and_power_charge_discharge"
}
```

Response:

```json
{
  "code": 0,
  "data": {
    "duration": 0,
    "percentage": 30,
    "acChargingEnabled": 1,
    "remotePowerControlEnable": 0
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

Result: PASS

### 14. Refresh Token `/oauth2/refresh`

Request body:

```json
{
  "grant_type": "refresh_token",
  "refresh_token": "***",
  "client_id": "caa1ff3ae8217c541ec318193ee2a0d2",
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

### 15. Old Token Recheck `/oauth2/getDeviceListAuthed`

Response:

```json
{
  "code": 2,
  "message": "TOKEN_IS_INVALID"
}
```

Result: PASS

### 16. Fresh Token Recheck `/oauth2/getDeviceListAuthed`

Response:

```json
{
  "code": 0,
  "data": [
    {
      "deviceSn": "PGP0A12367",
      "deviceTypeName": "min",
      "model": "MOD 10KTL3-XH",
      "nominalPower": 6000,
      "datalogSn": "JKN0DY60D4",
      "dtc": 5400,
      "communicationVersion": "ZBDC-0017",
      "authFlag": true
    }
  ],
  "message": "SUCCESSFUL_OPERATION"
}
```

Result: PASS

### 17. Authorization-Code Cleanup

Unbind response:

```json
{
  "code": 0,
  "data": null,
  "message": "SUCCESSFUL_OPERATION"
}
```

Final authorized-list response:

```json
{
  "code": 0,
  "data": [],
  "message": "SUCCESSFUL_OPERATION"
}
```

Result: PASS

### 18. Client-Credentials Token `/oauth2/token`

Request body:

```json
{
  "grant_type": "client_credentials",
  "client_id": "caa1ff3ae8217c541ec318193ee2a0d2",
  "client_secret": "***"
}
```

Response:

```json
{
  "access_token": "***",
  "token_type": "Bearer",
  "expires_in": 604800
}
```

Result: PASS

### 19. Client-Credentials `getDeviceList`

Response:

```json
{
  "code": 103,
  "data": null,
  "message": "WRONG_GRANT_TYPE"
}
```

Result: PASS

### 20. Client-Credentials Pre-clean `/oauth2/unbindDevice`

Response:

```json
{
  "code": 0,
  "data": null,
  "message": "SUCCESSFUL_OPERATION"
}
```

Result: PASS

### 21. Client-Credentials Bind Device `/oauth2/bindDevice`

Request body:

```json
{
  "deviceSnList": [
    {
      "deviceSn": "PGP0A12367"
    }
  ]
}
```

Response:

```json
{
  "code": 12,
  "data": [
    "PGP0A12367"
  ],
  "message": "DEVICE_SN_DOES_NOT_HAVE_PERMISSION"
}
```

Result: FAIL

### 22. Client-Credentials Authorized List `/oauth2/getDeviceListAuthed`

Response:

```json
{
  "code": 0,
  "data": [],
  "message": "SUCCESSFUL_OPERATION"
}
```

Result: PASS

### 23. Client-Credentials Device Info `/oauth2/getDeviceInfo`

Response:

```json
{
  "code": 12,
  "data": null,
  "message": "DEVICE_SN_DOES_NOT_HAVE_PERMISSION"
}
```

Result: FAIL

### 24. Client-Credentials Device Data `/oauth2/getDeviceData`

Response:

```json
{
  "code": 12,
  "data": "PGP0A12367",
  "message": "DEVICE_SN_DOES_NOT_HAVE_PERMISSION"
}
```

Result: FAIL

### 25. Client-Credentials Device Parameter Setting `/oauth2/deviceDispatch`

Response:

```json
{
  "code": 105,
  "data": null,
  "message": "TOO_MANY_REQUEST"
}
```

Result: WARN

### 26. Client-Credentials Device Parameter Read `/oauth2/readDeviceDispatch`

Response:

```json
{
  "code": 105,
  "data": null,
  "message": "TOO_MANY_REQUEST"
}
```

Result: WARN

### 27. Client-Credentials Cleanup

Unbind response:

```json
{
  "code": 0,
  "data": null,
  "message": "SUCCESSFUL_OPERATION"
}
```

Final authorized-list response:

```json
{
  "code": 0,
  "data": [],
  "message": "SUCCESSFUL_OPERATION"
}
```

Result: PASS

## Cleanup Notes

- Authorization-code cleanup succeeded:
  - `POST /oauth2/unbindDevice` with the fresh token returned `code=0`.
  - The final authorization-code `getDeviceListAuthed` recheck returned `data=[]`.
- Client-credentials cleanup also returned `code=0`.
- The final client-credentials `getDeviceListAuthed` recheck returned `data=[]`.
- No residual authorized-device binding was observed at the end of the run.

## Final Conclusion

This 2026-05-29 rerun records the latest observed behavior for the AU test platform using the supplied credentials.

The AU authorization-code workflow is largely healthy: login, authorization, token exchange, device discovery, binding, authorization-list checks, device info, telemetry, refresh, old-token invalidation, and cleanup all passed. The only authorization-code failure was the tested `deviceDispatch` command, which returned `PARAMETER_SETTING_FAILED` while `readDeviceDispatch` remained readable.

The AU client-credentials workflow is partially available: token issuance and the expected `getDeviceList` grant-type rejection both passed, but the tested client token could not bind or read `PGP0A12367` and returned `DEVICE_SN_DOES_NOT_HAVE_PERMISSION`. A follow-up full client-credentials rerun should provide the device `pinCode` or use a client/device pair with explicit permission for `PGP0A12367`.
