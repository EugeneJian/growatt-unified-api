# AU oauth2-openApi Full Test Report

This report records the complete request and response payloads for the rerun. Sensitive credential values are masked as `***`; API response bodies are otherwise preserved in full.

## Run Metadata

| Item | Content |
| :--- | :--- |
| Backend Address | `https://opencloud-test-au.growatt.com/prod-api` |
| Frontend Login Address | `https://opencloud-test-au.growatt.com/#/login?client_id=testcodemode&state=<randomstr>` |
| Test Method | Live API integration test |
| Test Tool | Node.js `fetch` |
| Test Date | 2026-04-23 |
| Run Started | `2026-04-23 16:36:33 +08:00` |
| Run Ended | `2026-04-23 16:36:47 +08:00` |
| Time Zone | Asia/Shanghai (UTC+8) |
| Test Device | `WUP0N3500C` |

## SOC Fields Observed

```json
{
  "authorizationCodeMode": {
    "dataSoc": 39,
    "batteryListSoc": [
      39
    ]
  },
  "clientCredentialsMode": {
    "dataSoc": 39,
    "batteryListSoc": [
      39
    ]
  }
}
```

## Authorization Code Mode Full Transcript

### A1. Frontend login page reachable

Request:
```text
GET https://opencloud-test-au.growatt.com/#/login?client_id=testcodemode&state=codexaufull20260423164000
```
Request headers:
```json
{}
```
Response:
```json
{
  "httpStatus": 200,
  "contentLength": 445
}
```
Result: PASS

### A2. User login

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/login
```
Request headers:
```json
{
  "Content-Type": "application/json"
}
```
Request body:
```json
{
  "username": "0auth0",
  "password": "***",
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

### A3. Get auth code

Request:
```text
GET https://opencloud-test-au.growatt.com/prod-api/auth?response_type=code&client_id=testcodemode&redirect_uri=https%3A%2F%2Fopencloud-test-au.growatt.com%2Fprod-api%2FtestToken%2FtestToken1&scope=scope&state=codexaufull20260423164000
```
Request headers:
```json
{
  "Authorization": "Bearer ***"
}
```
Response:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "redirect_uri": "https://opencloud-test-au.growatt.com/prod-api/testToken/testToken1",
    "state": "codexaufull20260423164000",
    "client_id": "testcodemode",
    "auth_code": "***"
  }
}
```
Result: PASS

### A4. Get token

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/token
```
Request headers:
```json
{
  "Content-Type": "application/x-www-form-urlencoded"
}
```
Request body:
```json
{
  "grant_type": "authorization_code",
  "code": "***",
  "client_id": "testcodemode",
  "client_secret": "***",
  "redirect_uri": "https://opencloud-test-au.growatt.com/prod-api/testToken/testToken1"
}
```
Response:
```json
{
  "access_token": "***",
  "refresh_token": "***",
  "refresh_expires_in": 2591674,
  "token_type": "Bearer",
  "expires_in": 604479
}
```
Result: PASS

### A5. Get candidate device list

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/getDeviceList
```
Request headers:
```json
{
  "Authorization": "Bearer ***",
  "Content-Type": "application/json"
}
```
Request body:
```json
{}
```
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

### A6. Pre-clean authorization

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/unbindDevice
```
Request headers:
```json
{
  "Authorization": "Bearer ***",
  "Content-Type": "application/json"
}
```
Request body:
```json
{
  "deviceSnList": [
    "WUP0N3500C"
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

### A7. Pre-clean recheck

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/getDeviceListAuthed
```
Request headers:
```json
{
  "Authorization": "Bearer ***",
  "Content-Type": "application/json"
}
```
Request body:
```json
{}
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

### A8. Bind device with object plus pinCode

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/bindDevice
```
Request headers:
```json
{
  "Authorization": "Bearer ***",
  "Content-Type": "application/json"
}
```
Request body:
```json
{
  "deviceSnList": [
    {
      "deviceSn": "WUP0N3500C",
      "pinCode": "***"
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

### A9. Get authorized device list

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/getDeviceListAuthed
```
Request headers:
```json
{
  "Authorization": "Bearer ***",
  "Content-Type": "application/json"
}
```
Request body:
```json
{}
```
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

### A10. Get device info

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/getDeviceInfo
```
Request headers:
```json
{
  "Authorization": "Bearer ***",
  "Content-Type": "application/json"
}
```
Request body:
```json
{
  "deviceSn": "WUP0N3500C"
}
```
Response:
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
    "dtc": 3504,
    "communicationVersion": "ZCBD-0004",
    "unifiedAPIver": null,
    "deviceVersion": null,
    "datalogVersion": "7.6.1.9",
    "existBattery": true,
    "batterySn": "WUP0N3500C_battery",
    "batteryModel": "BDCBAT",
    "batteryCapacity": 9000,
    "batteryNominalPower": 6000,
    "authFlag": true,
    "batteryList": [
      {
        "batterySn": "WUP0N3500C_battery",
        "batteryModel": "BDCBAT",
        "batteryCapacity": 9000,
        "batteryNominalPower": 6000
      }
    ]
  },
  "message": "SUCCESSFUL_OPERATION"
}
```
Result: PASS

### A11. Get device data

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/getDeviceData
```
Request headers:
```json
{
  "Authorization": "Bearer ***",
  "Content-Type": "application/json"
}
```
Request body:
```json
{
  "deviceSn": "WUP0N3500C"
}
```
Response:
```json
{
  "code": 0,
  "data": {
    "soc": 39,
    "fac": 49.98,
    "backupPower": 0.1,
    "batPower": 0,
    "deviceSn": "WUP0N3500C",
    "pac": -1.2,
    "etoUserToday": 0.1,
    "utcTime": "2026-03-30 07:18:02",
    "etoUserTotal": 506.7,
    "pexPower": 0,
    "epvTotal": 0,
    "batteryList": [
      {
        "chargePower": 0,
        "soc": 39,
        "echargeToday": 0,
        "vbat": 52.5,
        "index": 1,
        "echargeTotal": 914.6,
        "dischargePower": 0,
        "edischargeToday": 0.8,
        "ibat": -0.7,
        "soh": 100,
        "edischargeTotal": 794.2,
        "status": 0
      }
    ],
    "protectCode": 0,
    "reactivePower": 0,
    "etoGridTotal": 675.5,
    "genPower": 0,
    "priority": 0,
    "vac3": 235.3,
    "etoGridToday": 0.5,
    "protectSubCode": 0,
    "vac2": 235.3,
    "vac1": 235.3,
    "payLoadPower": 0,
    "faultCode": 0,
    "faultSubCode": 0,
    "batteryStatus": 1,
    "ppv": 0,
    "meterPower": 0,
    "status": 9
  },
  "message": "SUCCESSFUL_OPERATION"
}
```
Result: PASS

### A12. Refresh token

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/refresh
```
Request headers:
```json
{
  "Content-Type": "application/x-www-form-urlencoded"
}
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

### A13. Recheck authorized list with old token

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/getDeviceListAuthed
```
Request headers:
```json
{
  "Authorization": "Bearer ***",
  "Content-Type": "application/json"
}
```
Request body:
```json
{}
```
Response:
```json
{
  "code": 2,
  "message": "TOKEN_IS_INVALID"
}
```
Result: PASS

### A14. Recheck authorized list with fresh token

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/getDeviceListAuthed
```
Request headers:
```json
{
  "Authorization": "Bearer ***",
  "Content-Type": "application/json"
}
```
Request body:
```json
{}
```
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

### A15. Unbind with fresh token

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/unbindDevice
```
Request headers:
```json
{
  "Authorization": "Bearer ***",
  "Content-Type": "application/json"
}
```
Request body:
```json
{
  "deviceSnList": [
    "WUP0N3500C"
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

### A16. Final authorized-list recheck

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/getDeviceListAuthed
```
Request headers:
```json
{
  "Authorization": "Bearer ***",
  "Content-Type": "application/json"
}
```
Request body:
```json
{}
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

## Client Credentials Mode Full Transcript

### C1. Get client token without redirect_uri

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/token
```
Request headers:
```json
{
  "Content-Type": "application/x-www-form-urlencoded"
}
```
Request body:
```json
{
  "grant_type": "client_credentials",
  "client_id": "testclientmode",
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

### C2. Get client token with redirect_uri

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/token
```
Request headers:
```json
{
  "Content-Type": "application/x-www-form-urlencoded"
}
```
Request body:
```json
{
  "grant_type": "client_credentials",
  "client_id": "testclientmode",
  "client_secret": "***",
  "redirect_uri": "https://opencloud-test-au.growatt.com/prod-api/testToken/testToken1"
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

### C3. Get candidate device list expected WRONG_GRANT_TYPE

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/getDeviceList
```
Request headers:
```json
{
  "Authorization": "Bearer ***",
  "Content-Type": "application/json"
}
```
Request body:
```json
{}
```
Response:
```json
{
  "code": 103,
  "data": null,
  "message": "WRONG_GRANT_TYPE"
}
```
Result: PASS

### C4. Pre-clean authorization

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/unbindDevice
```
Request headers:
```json
{
  "Authorization": "Bearer ***",
  "Content-Type": "application/json"
}
```
Request body:
```json
{
  "deviceSnList": [
    "WUP0N3500C"
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

### C5. Bind device

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/bindDevice
```
Request headers:
```json
{
  "Authorization": "Bearer ***",
  "Content-Type": "application/json"
}
```
Request body:
```json
{
  "deviceSnList": [
    {
      "deviceSn": "WUP0N3500C",
      "pinCode": "***"
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

### C6. Get authorized device list with pre-bind token

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/getDeviceListAuthed
```
Request headers:
```json
{
  "Authorization": "Bearer ***",
  "Content-Type": "application/json"
}
```
Request body:
```json
{}
```
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

### C7. Get device info with pre-bind token

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/getDeviceInfo
```
Request headers:
```json
{
  "Authorization": "Bearer ***",
  "Content-Type": "application/json"
}
```
Request body:
```json
{
  "deviceSn": "WUP0N3500C"
}
```
Response:
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
    "dtc": 3504,
    "communicationVersion": "ZCBD-0004",
    "unifiedAPIver": null,
    "deviceVersion": null,
    "datalogVersion": "7.6.1.9",
    "existBattery": true,
    "batterySn": "WUP0N3500C_battery",
    "batteryModel": "BDCBAT",
    "batteryCapacity": 9000,
    "batteryNominalPower": 6000,
    "authFlag": true,
    "batteryList": [
      {
        "batterySn": "WUP0N3500C_battery",
        "batteryModel": "BDCBAT",
        "batteryCapacity": 9000,
        "batteryNominalPower": 6000
      }
    ]
  },
  "message": "SUCCESSFUL_OPERATION"
}
```
Result: PASS

### C8. Get device data with pre-bind token

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/getDeviceData
```
Request headers:
```json
{
  "Authorization": "Bearer ***",
  "Content-Type": "application/json"
}
```
Request body:
```json
{
  "deviceSn": "WUP0N3500C"
}
```
Response:
```json
{
  "code": 0,
  "data": {
    "soc": 39,
    "fac": 49.98,
    "backupPower": 0.1,
    "batPower": 0,
    "deviceSn": "WUP0N3500C",
    "pac": -1.2,
    "etoUserToday": 0.1,
    "utcTime": "2026-03-30 07:18:02",
    "etoUserTotal": 506.7,
    "pexPower": 0,
    "epvTotal": 0,
    "batteryList": [
      {
        "chargePower": 0,
        "soc": 39,
        "echargeToday": 0,
        "vbat": 52.5,
        "index": 1,
        "echargeTotal": 914.6,
        "dischargePower": 0,
        "edischargeToday": 0.8,
        "ibat": -0.7,
        "soh": 100,
        "edischargeTotal": 794.2,
        "status": 0
      }
    ],
    "protectCode": 0,
    "reactivePower": 0,
    "etoGridTotal": 675.5,
    "genPower": 0,
    "priority": 0,
    "vac3": 235.3,
    "etoGridToday": 0.5,
    "protectSubCode": 0,
    "vac2": 235.3,
    "vac1": 235.3,
    "payLoadPower": 0,
    "faultCode": 0,
    "faultSubCode": 0,
    "batteryStatus": 1,
    "ppv": 0,
    "meterPower": 0,
    "status": 9
  },
  "message": "SUCCESSFUL_OPERATION"
}
```
Result: PASS

### C9. Reissue client token after bind

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/token
```
Request headers:
```json
{
  "Content-Type": "application/x-www-form-urlencoded"
}
```
Request body:
```json
{
  "grant_type": "client_credentials",
  "client_id": "testclientmode",
  "client_secret": "***",
  "redirect_uri": "https://opencloud-test-au.growatt.com/prod-api/testToken/testToken1"
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

### C10. Get authorized device list with fresh token

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/getDeviceListAuthed
```
Request headers:
```json
{
  "Authorization": "Bearer ***",
  "Content-Type": "application/json"
}
```
Request body:
```json
{}
```
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

### C11. Get device info with fresh token

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/getDeviceInfo
```
Request headers:
```json
{
  "Authorization": "Bearer ***",
  "Content-Type": "application/json"
}
```
Request body:
```json
{
  "deviceSn": "WUP0N3500C"
}
```
Response:
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
    "dtc": 3504,
    "communicationVersion": "ZCBD-0004",
    "unifiedAPIver": null,
    "deviceVersion": null,
    "datalogVersion": "7.6.1.9",
    "existBattery": true,
    "batterySn": "WUP0N3500C_battery",
    "batteryModel": "BDCBAT",
    "batteryCapacity": 9000,
    "batteryNominalPower": 6000,
    "authFlag": true,
    "batteryList": [
      {
        "batterySn": "WUP0N3500C_battery",
        "batteryModel": "BDCBAT",
        "batteryCapacity": 9000,
        "batteryNominalPower": 6000
      }
    ]
  },
  "message": "SUCCESSFUL_OPERATION"
}
```
Result: PASS

### C12. Get device data with fresh token

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/getDeviceData
```
Request headers:
```json
{
  "Authorization": "Bearer ***",
  "Content-Type": "application/json"
}
```
Request body:
```json
{
  "deviceSn": "WUP0N3500C"
}
```
Response:
```json
{
  "code": 0,
  "data": {
    "soc": 39,
    "fac": 49.98,
    "backupPower": 0.1,
    "batPower": 0,
    "deviceSn": "WUP0N3500C",
    "pac": -1.2,
    "etoUserToday": 0.1,
    "utcTime": "2026-03-30 07:18:02",
    "etoUserTotal": 506.7,
    "pexPower": 0,
    "epvTotal": 0,
    "batteryList": [
      {
        "chargePower": 0,
        "soc": 39,
        "echargeToday": 0,
        "vbat": 52.5,
        "index": 1,
        "echargeTotal": 914.6,
        "dischargePower": 0,
        "edischargeToday": 0.8,
        "ibat": -0.7,
        "soh": 100,
        "edischargeTotal": 794.2,
        "status": 0
      }
    ],
    "protectCode": 0,
    "reactivePower": 0,
    "etoGridTotal": 675.5,
    "genPower": 0,
    "priority": 0,
    "vac3": 235.3,
    "etoGridToday": 0.5,
    "protectSubCode": 0,
    "vac2": 235.3,
    "vac1": 235.3,
    "payLoadPower": 0,
    "faultCode": 0,
    "faultSubCode": 0,
    "batteryStatus": 1,
    "ppv": 0,
    "meterPower": 0,
    "status": 9
  },
  "message": "SUCCESSFUL_OPERATION"
}
```
Result: PASS

### C13. Unbind device

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/unbindDevice
```
Request headers:
```json
{
  "Authorization": "Bearer ***",
  "Content-Type": "application/json"
}
```
Request body:
```json
{
  "deviceSnList": [
    "WUP0N3500C"
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

### C14. Final authorized-list recheck

Request:
```text
POST https://opencloud-test-au.growatt.com/prod-api/oauth2/getDeviceListAuthed
```
Request headers:
```json
{
  "Authorization": "Bearer ***",
  "Content-Type": "application/json"
}
```
Request body:
```json
{}
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
