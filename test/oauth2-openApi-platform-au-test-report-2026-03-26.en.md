# AU oauth2-openApi Platform Test Report

## Relationship to Official Docs

- The official docs define the general contract.
- This report records only behavior observed in AU test environment on 2026-03-26.
- This report documents environment-specific behavior and does not replace the official docs.

## Test Environment

| Item | Content |
| :--- | :--- |
| Test Address | `https://opencloud-test-au.growatt.com/prod-api` |
| Frontend Login Address | `https://opencloud-test-au.growatt.com/#/login?client_id=testcodemode&state=<randomstr>` |
| Test Method | Live API interface test |
| Authentication | OAuth2 authorization-code mode + client-credentials mode |
| Test Tool | `curl` |
| Test Date | 2026-03-26 |
| Time Zone | Asia/Shanghai (UTC+8) |
| Test Device | `WUP0N3500C` |

---

## Credentials Used

### Authorization Code Mode

- `client_id=testcodemode`
- `client_secret=***`
- `username=0auth0`
- `password=G1234567890`
- Frontend behavior confirmed: the password is MD5-hashed before `POST /login`

### Client Credentials Mode

- `client_id=testclientmode`
- `client_secret=***`
- `pinCode=GROWATT147258369`

---

## Test Results Summary

### Authorization Code Mode

| API | Method | Path | Status |
| :--- | :--- | :--- | :--- |
| User Login | POST | `/login` | PASS |
| Get Auth Code | GET | `/auth` | PASS |
| Get Token | POST | `/oauth2/token` | PASS |
| Get Available Device List | POST | `/oauth2/getDeviceList` | PASS |
| Bind Device | POST | `/oauth2/bindDevice` | PASS |
| Get Authorized Device List | POST | `/oauth2/getDeviceListAuthed` | PASS |
| Get Device Info | POST | `/oauth2/getDeviceInfo` | PASS |
| Get Device Data | POST | `/oauth2/getDeviceData` | PASS |
| Refresh Token | POST | `/oauth2/refresh` | PASS |
| Unbind Device | POST | `/oauth2/unbindDevice` | PASS |

### Client Credentials Mode

| API | Method | Path | Status |
| :--- | :--- | :--- | :--- |
| Get Token | POST | `/oauth2/token` | PASS |
| Get Token with `redirect_uri` | POST | `/oauth2/token` | PASS |
| Get Available Device List | POST | `/oauth2/getDeviceList` | PASS with expected `WRONG_GRANT_TYPE` |
| Bind Device | POST | `/oauth2/bindDevice` | PASS |
| Get Authorized Device List | POST | `/oauth2/getDeviceListAuthed` | PASS |
| Get Device Info | POST | `/oauth2/getDeviceInfo` | PASS |
| Get Device Data | POST | `/oauth2/getDeviceData` | PASS |
| Unbind Device | POST | `/oauth2/unbindDevice` | PASS |

---

## Key Findings

1. The Australia frontend still MD5-hashes the password before calling `POST /login`.
2. In authorization-code mode, `POST /oauth2/getDeviceList` returned one candidate device: `WUP0N3500C`.
3. In authorization-code mode, binding `WUP0N3500C` as a plain string array returned `SYSTEM_ERROR`; binding succeeded when retried with object form plus `pinCode`.
4. In client-credentials mode, `POST /oauth2/getDeviceList` returned the documented `WRONG_GRANT_TYPE` (`code=103`).
5. In client-credentials mode, a token issued before `bindDevice` could not immediately read the device after bind; a freshly issued token after bind worked.
6. In both modes, cleanup was verified by calling `unbindDevice` and rechecking that the authorized-device list returned to empty.

---

## Detailed Test Cases

### 1. Authorization Code Mode

#### 1. User Login

Actual request body accepted by the AU frontend flow:

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
    "redirectUri": "https://opencloud-test-au.growatt.com/prod-api/testToken/testToken1",
    "country": "Australia",
    "clientId": "testcodemode",
    "clientCompany": "testcodemode",
    "id": "2919237",
    "state": null,
    "token": "***",
    "username": "0auth0"
  }
}
```

Result: PASS

#### 2. Get Auth Code

Request:

```text
GET /auth?response_type=code&client_id=testcodemode&redirect_uri=https://opencloud-test-au.growatt.com/prod-api/testToken/testToken1&scope=scope&state=codextest123
Authorization: Bearer ***
```

Response:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "redirect_uri": "https://opencloud-test-au.growatt.com/prod-api/testToken/testToken1",
    "state": "codextest123",
    "client_id": "testcodemode",
    "auth_code": "***"
  }
}
```

Result: PASS

#### 3. Get Token

Response:

```json
{
  "access_token": "***",
  "refresh_token": "***",
  "refresh_expires_in": 2563291,
  "token_type": "Bearer",
  "expires_in": 576091
}
```

Result: PASS

#### 4. Get Available Device List

Response:

```json
{
  "code": 0,
  "data": [
    {
      "deviceSn": "WUP0N3500C",
      "deviceTypeName": "sph",
      "model": "SPH 6000TL-HUB",
      "nominalPower": 6000,
      "datalogSn": "JKN0DY60DP",
      "dtc": 3504,
      "communicationVersion": "ZCBD-0004",
      "authFlag": false
    }
  ],
  "message": "SUCCESSFUL_OPERATION"
}
```

Result: PASS

#### 5. Bind Device

Observed behavior:

- Request body `{"deviceSnList":["WUP0N3500C"]}` returned:

```json
{
  "code": 1,
  "data": null,
  "message": "SYSTEM_ERROR"
}
```

- Retrying with object form plus `pinCode` succeeded:

```json
{
  "code": 0,
  "data": 1,
  "message": "SUCCESSFUL_OPERATION"
}
```

Conclusion: final result is PASS, but in the current AU environment this device must be bound with object-array format plus `pinCode` even in authorization-code mode.

#### 6. Get Authorized Device List

Response:

```json
{
  "code": 0,
  "data": [
    {
      "deviceSn": "WUP0N3500C",
      "deviceTypeName": "sph",
      "model": "SPH 6000TL-HUB",
      "nominalPower": 6000,
      "datalogSn": "JKN0DY60DP",
      "dtc": 3504,
      "communicationVersion": "ZCBD-0004",
      "authFlag": true
    }
  ],
  "message": "SUCCESSFUL_OPERATION"
}
```

Result: PASS

#### 7. Get Device Info

Response excerpt:

```json
{
  "code": 0,
  "data": {
    "deviceSn": "WUP0N3500C",
    "deviceTypeName": "sph",
    "model": "SPH 6000TL-HUB",
    "nominalPower": 6000,
    "datalogSn": "JKN0DY60DP",
    "datalogDeviceTypeName": "ShineWiLan-X2",
    "existBattery": true,
    "batteryCapacity": 9000,
    "authFlag": true
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

Result: PASS

#### 8. Get Device Data

Response excerpt:

```json
{
  "code": 0,
  "data": {
    "utcTime": "2026-03-26 11:16:36",
    "ppv": 790.0,
    "payLoadPower": 324.3,
    "batPower": -1800.0,
    "status": 5,
    "batteryList": [
      {
        "soc": 56
      }
    ]
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

Result: PASS

#### 9. Refresh Token

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

#### 10. Unbind Device

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

### 2. Client Credentials Mode

#### 1. Get Token

Response:

```json
{
  "access_token": "***",
  "token_type": "Bearer",
  "expires_in": 604800
}
```

Result: PASS

#### 2. Get Available Device List

Response:

```json
{
  "code": 103,
  "data": null,
  "message": "WRONG_GRANT_TYPE"
}
```

Result: PASS, expected behavior

#### 3. Bind Device

Request body:

```json
{
  "deviceSnList": [
    {
      "deviceSn": "WUP0N3500C",
      "pinCode": "GROWATT147258369"
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

#### 4. Get Authorized Device List

Response:

```json
{
  "code": 0,
  "data": [
    {
      "deviceSn": "WUP0N3500C",
      "deviceTypeName": "sph",
      "model": "SPH 6000TL-HUB",
      "nominalPower": 6000,
      "datalogSn": "JKN0DY60DP",
      "dtc": 3504,
      "communicationVersion": "ZCBD-0004",
      "authFlag": true
    }
  ],
  "message": "SUCCESSFUL_OPERATION"
}
```

Result: PASS

#### 5. Get Device Info / Get Device Data

With the token issued before bind, immediate reads after a successful bind returned:

```json
{
  "code": 12,
  "data": null,
  "message": "DEVICE_SN_DOES_NOT_HAVE_PERMISSION"
}
```

After fetching a fresh client token, both read APIs succeeded.

`getDeviceInfo` response excerpt:

```json
{
  "code": 0,
  "data": {
    "deviceSn": "WUP0N3500C",
    "model": "SPH 6000TL-HUB",
    "batteryCapacity": 9000,
    "authFlag": true
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

`getDeviceData` response excerpt:

```json
{
  "code": 0,
  "data": {
    "utcTime": "2026-03-26 11:19:16",
    "ppv": 790.0,
    "payLoadPower": 324.4,
    "batPower": -1800.0,
    "status": 5,
    "batteryList": [
      {
        "soc": 55
      }
    ]
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

Conclusion: final result is PASS, but the current AU environment requires a fresh token after bind before device read APIs gain permission.

#### 6. Unbind Device

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

1. The Australia test environment is reachable, and both OAuth2 modes can be completed end to end.
2. The test device `WUP0N3500C` can be read successfully in both modes.
3. The current AU environment has two integration nuances that should be documented:
   - In authorization-code mode, this device currently requires `pinCode` during bind.
   - In client-credentials mode, a fresh token is required after `bindDevice`; the pre-bind token cannot immediately read the device.
4. After testing, cleanup was verified in both modes: the device was unbound and the authorized-device list returned to empty.
