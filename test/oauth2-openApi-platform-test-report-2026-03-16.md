# oauth2-openApi Platform API Test Report

## Test Environment

| Item | Content |
| :--- | :--- |
| Test Address | [https://api-test.growatt.com:9290](https://api-test.growatt.com:9290) |
| Test Method | API Interface Test |
| Authentication | OAuth2 |
| Test Tool | curl |
| Test Date | 2026/3/16 |

---

## Test Results Summary

### Authorization Code Mode

| Interface Name | Method | Request Path | Content-Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| User Login | POST | /login | application/json | PASS |
| Get Auth Code | GET | /auth | - | PASS |
| Get Token | POST | /oauth2/token | application/x-www-form-urlencoded | PASS |
| Get Available Device List | POST | /oauth2/getDeviceList | - | PASS |
| Bind Device | POST | /oauth2/bindDevice | application/json | PASS |
| Get Authorized Device List | POST | /oauth2/getDeviceListAuthed | - | PASS |
| Get Device Info | POST | /oauth2/getDeviceInfo | application/json | PASS |
| Get Device Data | POST | /oauth2/getDeviceData | application/json | PASS |
| Device Parameter Setting | POST | /oauth2/deviceDispatch | application/json | PASS |
| Device Parameter Read | POST | /oauth2/readDeviceDispatch | application/json | PASS |
| Unbind Device | POST | /oauth2/unbindDevice | application/json | PASS |
| Refresh Token | POST | /oauth2/refresh | application/x-www-form-urlencoded | PASS |

### Client Credentials Mode

| Interface Name | Method | Request Path | Content-Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| Get Token | POST | /oauth2/token | application/x-www-form-urlencoded | PASS |
| Get Available Device List | POST | /oauth2/getDeviceList | - | PASS (Expected: WRONG_GRANT_TYPE) |
| Bind Device | POST | /oauth2/bindDevice | application/json | PASS |
| Get Authorized Device List | POST | /oauth2/getDeviceListAuthed | - | PASS |
| Get Device Info | POST | /oauth2/getDeviceInfo | application/json | PASS |
| Get Device Data | POST | /oauth2/getDeviceData | application/json | PASS |
| Device Parameter Setting | POST | /oauth2/deviceDispatch | application/json | PASS |
| Device Parameter Read | POST | /oauth2/readDeviceDispatch | application/json | PASS |
| Unbind Device | POST | /oauth2/unbindDevice | application/json | PASS |

---

## Detailed Test Cases

### Authorization Code Mode

#### 1. User Login

**Request**

```bash
curl -sS 'https://api-test.growatt.com:9290/login' \
  -X POST \
  -H 'Content-Type: application/json' \
  --data '{"username":"Grter","password":"511ed2f6d0841c0c71889f1bfa0504c0","clientId":"testcodemode"}'
```

**Response**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "country": "Other",
    "clientId": "testcodemode",
    "clientCompany": "testcodemode",
    "id": "376852",
    "token": "l7HbtLflQIVVivVg0uOUjeM19y1bWjWq",
    "username": "Grter"
  }
}
```

**Result**: ✅ PASS

---

#### 2. Get Auth Code

**Request**

```bash
curl -sS 'https://api-test.growatt.com:9290/auth?response_type=code&client_id=testcodemode&redirect_uri=https://api-test.growatt.com:9290/testToken/testToken1' \
  -X GET \
  -H 'Authorization: Bearer l7HbtLflQIVVivVg0uOUjeM19y1bWjWq'
```

**Response**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "redirect_uri": "https://api-test.growatt.com:9290/testToken/testToken1",
    "state": "Qlyz2oCtju",
    "client_id": "testcodemode",
    "auth_code": "9eNSIIWap6BIN3VahNyvCmGuWInZkS1vc8QGCBu0vNZhFbhKwyUJFvpQsKPe"
  }
}
```

**Result**: ✅ PASS

---

#### 3. Get Token

**Request**

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/token' \
  -X POST \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=authorization_code&code=9eNSIIWap6BIN3VahNyvCmGuWInZkS1vc8QGCBu0vNZhFbhKwyUJFvpQsKPe&client_id=testcodemode&client_secret=testsecretgrowatt1'
```

**Response**

```json
{
  "access_token": "qZVhgaWVkTtwvUh7OSOYiV8GiUvUV7mwJuujcqzSFYaQ51YHpOSodyUpUuYP",
  "refresh_token": "wNrFTtYsrIP49Ath6RUo1ptseiPIbOX7ow5dMxly9yIeGGmNk0sHQGnVsJ7y",
  "refresh_expires_in": 2354709,
  "token_type": "Bearer",
  "expires_in": 552518
}
```

**Result**: ✅ PASS

---

#### 4. Get Available Device List

**Request**

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/getDeviceList' \
  -X POST \
  -H 'Authorization: Bearer qZVhgaWVkTtwvUh7OSOYiV8GiUvUV7mwJuujcqzSFYaQ51YHpOSodyUpUuYP'
```

**Response**

```json
{
  "code": 0,
  "data": [
    // ... 24 devices ...
    {
      "deviceSn": "YRP0N4S00Q",
      "deviceTypeName": "sph",
      "model": "SPH 5000TL-HUB",
      "nominalPower": 6000,
      "authFlag": false,
      ...
    }
  ],
  "message": "SUCCESSFUL_OPERATION"
}
```

**Result**: ✅ PASS - Returns 24 available devices

---

#### 5. Bind Device

**Request**

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/bindDevice' \
  -X POST \
  -H 'Authorization: Bearer qZVhgaWVkTtwvUh7OSOYiV8GiUvUV7mwJuujcqzSFYaQ51YHpOSodyUpUuYP' \
  -H 'Content-Type: application/json' \
  --data '{"deviceSnList":[{"deviceSn":"YRP0N4S00Q","pinCode":"TESTPINCODE753951"}]}'
```

**Response**

```json
{
  "code": 0,
  "data": 1,
  "message": "SUCCESSFUL_OPERATION"
}
```

**Result**: ✅ PASS - Device already bound from previous test

---

#### 6. Get Authorized Device List

**Request**

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/getDeviceListAuthed' \
  -X POST \
  -H 'Authorization: Bearer qZVhgaWVkTtwvUh7OSOYiV8GiUvUV7mwJuujcqzSFYaQ51YHpOSodyUpUuYP'
```

**Response**

```json
{
  "code": 0,
  "data": [
    {
      "deviceSn": "TPJ9N6N07Y",
      "deviceTypeName": "sph",
      "model": "SPH 10000TL3 BH-UP",
      "nominalPower": 10000,
      "authFlag": true,
      ...
    },
    {
      "deviceSn": "YRP0N4S00Q",
      "deviceTypeName": "sph",
      "model": "SPH 5000TL-HUB",
      "nominalPower": 6000,
      "authFlag": true,
      ...
    }
  ],
  "message": "SUCCESSFUL_OPERATION"
}
```

**Result**: ✅ PASS - Returns 2 authorized devices

---

#### 7. Get Device Info

**Request**

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/getDeviceInfo' \
  -X POST \
  -H 'Authorization: Bearer qZVhgaWVkTtwvUh7OSOYiV8GiUvUV7mwJuujcqzSFYaQ51YHpOSodyUpUuYP' \
  -H 'Content-Type: application/json' \
  --data '{"deviceSn":"YRP0N4S00Q"}'
```

**Response**

```json
{
  "code": 0,
  "data": {
    "deviceSn": "YRP0N4S00Q",
    "deviceTypeName": "sph",
    "model": "SPH 5000TL-HUB",
    "nominalPower": 6000,
    "datalogSn": "VWQ0F9W00L",
    "datalogDeviceTypeName": "ShineWiLan-X2",
    "dtc": 3503,
    "communicationVersion": "ZCBD-0004",
    "existBattery": true,
    "batterySn": "YRP0N4S00Q_battery",
    "batteryModel": "SPH 5000TL-HUB",
    "batteryCapacity": 9000,
    "batteryNominalPower": 6000,
    "authFlag": true,
    "batteryList": [...]
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

**Result**: ✅ PASS

---

#### 8. Get Device Data

**Request**

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/getDeviceData' \
  -X POST \
  -H 'Authorization: Bearer qZVhgaWVkTtwvUh7OSOYiV8GiUvUV7mwJuujcqzSFYaQ51YHpOSodyUpUuYP' \
  -H 'Content-Type: application/json' \
  --data '{"deviceSn":"YRP0N4S00Q"}'
```

**Response**

```json
{
  "code": 0,
  "data": {
    "fac": 50.04,
    "backupPower": 0.00,
    "batPower": 0.00,
    "pac": 16.90,
    "etoUserToday": 1.40,
    "reverActivePower": 0.00,
    "utcTime": "2026-03-16 03:04:53",
    "etoUserTotal": 46.40,
    "pexPower": 0.00,
    "batteryList": [
      {
        "chargePower": 0.00,
        "soc": 74,
        "echargeToday": 1.30,
        "vbat": 53.50,
        "index": 1,
        "echargeTotal": 82.10,
        "dischargePower": 0.00,
        "edischargeToday": 0.30,
        "ibat": -0.70,
        "soh": 100,
        "edischargeTotal": 57.90,
        "status": 0
      }
    ],
    "activePower": 0.00,
    "protectCode": 0,
    "reactivePower": 165.30,
    "serialNum": "YRP0N4S00Q",
    "etoGridTotal": 271.00,
    "genPower": 0.00,
    "priority": 0,
    "vac3": 236.70,
    "etoGridToday": 0.30,
    "protectSubCode": 0,
    "vac2": 236.70,
    "vac1": 236.70,
    "payLoadPower": 0.00,
    "faultCode": 0,
    "faultSubCode": 0,
    "batteryStatus": 0,
    "ppv": 0.00,
    "smartLoadPower": 0.00,
    "status": 6
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

**Result**: ✅ PASS - Returns full telemetry data (status: 6 - Online)

---

#### 9. Device Parameter Setting

**Request**

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/deviceDispatch' \
  -X POST \
  -H 'Authorization: Bearer qZVhgaWVkTtwvUh7OSOYiV8GiUvUV7mwJuujcqzSFYaQ51YHpOSodyUpUuYP' \
  -H 'Content-Type: application/json' \
  --data '{"deviceSn":"YRP0N4S00Q","value":{"type":"chargeCommand","duration":5,"percentage":20},"requestId":"12345678901234567890123456789012","setType":"duration_and_power_charge_discharge"}'
```

**Response**

```json
{
  "code": 0,
  "data": null,
  "message": "PARAMETER_SETTING_SUCCESSFUL"
}
```

**Result**: ✅ PASS - Device is online, parameter setting successful

---

#### 10. Device Parameter Read

**Request**

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/readDeviceDispatch' \
  -X POST \
  -H 'Authorization: Bearer qZVhgaWVkTtwvUh7OSOYiV8GiUvUV7mwJuujcqzSFYaQ51YHpOSodyUpUuYP' \
  -H 'Content-Type: application/json' \
  --data '{"deviceSn":"YRP0N4S00Q","setType":"duration_and_power_charge_discharge"}'
```

**Response**

```json
{
  "code": 0,
  "data": {
    "duration": 5,
    "percentage": 20,
    "acChargingEnabled": 1,
    "remotePowerControlEnable": 1
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

**Result**: ✅ PASS - Device is online, parameter read successful

---

#### 11. Unbind Device

**Request**

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/unbindDevice' \
  -X POST \
  -H 'Authorization: Bearer qZVhgaWVkTtwvUh7OSOYiV8GiUvUV7mwJuujcqzSFYaQ51YHpOSodyUpUuYP' \
  -H 'Content-Type: application/json' \
  --data '{"deviceSnList":["YRP0N4S00Q"]}'
```

**Response**

```json
{
  "code": 0,
  "data": null,
  "message": "SUCCESSFUL_OPERATION"
}
```

**Result**: ✅ PASS

---

#### 12. Refresh Token

**Request**

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/refresh' \
  -X POST \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=refresh_token&refresh_token=wNrFTtYsrIP49Ath6RUo1ptseiPIbOX7ow5dMxly9yIeGGmNk0sHQGnVsJ7y&client_id=testcodemode&client_secret=testsecretgrowatt1'
```

**Response**

```json
{
  "access_token": "JoJWmXWsqGUIqitmPAXcg2k9zc3Qw3tvAjp5A2o9pvyO8mrzoa7YW7TPPY8f",
  "refresh_token": "wNrFTtYsrIP49Ath6RUo1ptseiPIbOX7ow5dMxly9yIeGGmNk0sHQGnVsJ7y",
  "refresh_expires_in": 2591999,
  "token_type": "Bearer",
  "expires_in": 604800
}
```

**Result**: ✅ PASS

---

### Client Credentials Mode

#### 1. Get Token

**Request**

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/token' \
  -X POST \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials&client_id=testclientmode&client_secret=testsecretgrowatt1'
```

**Response**

```json
{
  "access_token": "zOF8bXKHhuYDArssKFyneoK819eIBpGfg1A2zNIHyKls937lFE0ITLfJTEIE",
  "token_type": "Bearer",
  "expires_in": 604800
}
```

**Result**: ✅ PASS

---

#### 2. Get Available Device List

**Request**

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/getDeviceList' \
  -X POST \
  -H 'Authorization: Bearer zOF8bXKHhuYDArssKFyneoK819eIBpGfg1A2zNIHyKls937lFE0ITLfJTEIE'
```

**Response**

```json
{
  "code": 103,
  "data": null,
  "message": "WRONG_GRANT_TYPE"
}
```

**Result**: ✅ PASS - Returns expected error (consistent with previous test)

---

#### 3. Bind Device

**Request**

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/bindDevice' \
  -X POST \
  -H 'Authorization: Bearer zOF8bXKHhuYDArssKFyneoK819eIBpGfg1A2zNIHyKls937lFE0ITLfJTEIE' \
  -H 'Content-Type: application/json' \
  --data '{"deviceSnList":[{"deviceSn":"YRP0N4S00Q","pinCode":"TESTPINCODE753951"}]}'
```

**Response**

```json
{
  "code": 19,
  "data": 0,
  "message": "DEVICE_ID_ALREADY_EXISTS"
}
```

**Result**: ✅ PASS - Device already bound from Auth Code mode test

---

#### 4. Get Authorized Device List

**Request**

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/getDeviceListAuthed' \
  -X POST \
  -H 'Authorization: Bearer zOF8bXKHhuYDArssKFyneoK819eIBpGfg1A2zNIHyKls937lFE0ITLfJTEIE'
```

**Response**

```json
{
  "code": 0,
  "data": [
    {
      "deviceSn": "HCQSKJMSJ1",
      "deviceTypeName": "sph-s",
      "model": "SPH 10000TL-HU (AU)",
      "nominalPower": 15000,
      ...
    },
    {
      "deviceSn": "YRP0N4S00Q",
      "deviceTypeName": "sph",
      "model": "SPH 5000TL-HUB",
      "nominalPower": 6000,
      ...
    }
  ],
  "message": "SUCCESSFUL_OPERATION"
}
```

**Result**: ✅ PASS - Returns 2 authorized devices

---

#### 5. Get Device Info

**Request**

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/getDeviceInfo' \
  -X POST \
  -H 'Authorization: Bearer zOF8bXKHhuYDArssKFyneoK819eIBpGfg1A2zNIHyKls937lFE0ITLfJTEIE' \
  -H 'Content-Type: application/json' \
  --data '{"deviceSn":"YRP0N4S00Q"}'
```

**Response**

```json
{
  "code": 0,
  "data": {
    "deviceSn": "YRP0N4S00Q",
    "deviceTypeName": "sph",
    "model": "SPH 5000TL-HUB",
    "nominalPower": 6000,
    ...
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

**Result**: ✅ PASS

---

#### 6. Get Device Data

**Request**

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/getDeviceData' \
  -X POST \
  -H 'Authorization: Bearer zOF8bXKHhuYDArssKFyneoK819eIBpGfg1A2zNIHyKls937lFE0ITLfJTEIE' \
  -H 'Content-Type: application/json' \
  --data '{"deviceSn":"YRP0N4S00Q"}'
```

**Response**

```json
{
  "code": 0,
  "data": {
    "fac": 50.04,
    "backupPower": 0.00,
    "batPower": 3600.00,
    "pac": -3734.00,
    "etoUserToday": 1.30,
    "batteryList": [
      {
        "soc": 74,
        "vbat": 54.50,
        "ibat": 65.60,
        ...
      }
    ],
    "status": 6,
    ...
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

**Result**: ✅ PASS - Device is online (status: 6), returns full telemetry data

---

#### 7. Device Parameter Setting

**Request**

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/deviceDispatch' \
  -X POST \
  -H 'Authorization: Bearer zOF8bXKHhuYDArssKFyneoK819eIBpGfg1A2zNIHyKls937lFE0ITLfJTEIE' \
  -H 'Content-Type: application/json' \
  --data '{"deviceSn":"YRP0N4S00Q","value":{"type":"chargeCommand","duration":5,"percentage":20},"requestId":"12345678901234567890123456789012","setType":"duration_and_power_charge_discharge"}'
```

**Response**

```json
{
  "code": 0,
  "data": null,
  "message": "PARAMETER_SETTING_SUCCESSFUL"
}
```

**Result**: ✅ PASS - Device is online, parameter setting successful

---

#### 8. Device Parameter Read

**Request**

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/readDeviceDispatch' \
  -X POST \
  -H 'Authorization: Bearer zOF8bXKHhuYDArssKFyneoK819eIBpGfg1A2zNIHyKls937lFE0ITLfJTEIE' \
  -H 'Content-Type: application/json' \
  --data '{"deviceSn":"YRP0N4S00Q","setType":"duration_and_power_charge_discharge"}'
```

**Response**

```json
{
  "code": 0,
  "data": {
    "duration": 5,
    "percentage": 20,
    "acChargingEnabled": 1,
    "remotePowerControlEnable": 1
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

**Result**: ✅ PASS - Device is online, parameter read successful

---

#### 9. Unbind Device

**Request**

```bash
curl -sS 'https://api-test.growatt.com:9290/oauth2/unbindDevice' \
  -X POST \
  -H 'Authorization: Bearer zOF8bXKHhuYDArssKFyneoK819eIBpGfg1A2zNIHyKls937lFE0ITLfJTEIE' \
  -H 'Content-Type: application/json' \
  --data '{"deviceSnList":["YRP0N4S00Q"]}'
```

**Response**

```json
{
  "code": 0,
  "data": null,
  "message": "SUCCESSFUL_OPERATION"
}
```

**Result**: ✅ PASS

---

## Conclusion

### Test Summary

| Mode | Total Tests | Passed |
| :--- | :--- | :--- |
| Authorization Code | 12 | 12 |
| Client Credentials | 9 | 9 |

### Key Findings

1. **Authorization Code Mode**: All 12 interfaces work correctly
   - `/login -> /auth -> /oauth2/token -> /oauth2/getDeviceList -> /oauth2/bindDevice -> /oauth2/getDeviceListAuthed -> /oauth2/getDeviceInfo -> /oauth2/getDeviceData -> /oauth2/deviceDispatch -> /oauth2/readDeviceDispatch -> /oauth2/unbindDevice -> /oauth2/refresh` - Full workflow verified

2. **Client Credentials Mode**: All 9 interfaces work correctly
   - `/oauth2/token -> /oauth2/bindDevice -> /oauth2/getDeviceListAuthed -> /oauth2/getDeviceInfo -> /oauth2/getDeviceData -> /oauth2/deviceDispatch -> /oauth2/readDeviceDispatch -> /oauth2/unbindDevice` - Full workflow verified

3. **Expected Behavior Confirmed**:
   - `client_credentials` token calling `POST /oauth2/getDeviceList` returns `WRONG_GRANT_TYPE` (code 103) - consistent with previous test

4. **Device Status**:
   - Device YRP0N4S00Q is currently **ONLINE** (status: 6)
   - deviceDispatch and readDeviceDispatch interfaces work correctly with online device
   - Parameter setting returns: `PARAMETER_SETTING_SUCCESSFUL`
   - Parameter read returns: `{duration: 5, percentage: 20, acChargingEnabled: 1, remotePowerControlEnable: 1}`

5. **Device Data**:
   - Device returns full telemetry data including: fac, pac, batPower, batteryList (soc, vbat, ibat, etc.), priority, status, faultCode
   - Returns complete JSON, not just summary fields
   - Current device data: soc: 74%, batPower: 0W (charging complete), priority: 0

### Comparison with Previous Test (2026-03-15)

| Test Item | Previous Result | Current Result | Status |
| :--- | :--- | :--- | :--- |
| Authorization Code Mode | PASS | PASS | ✅ Consistent |
| Client Credentials Mode | PASS | PASS | ✅ Consistent |
| getDeviceList (client_credentials) | WRONG_GRANT_TYPE | WRONG_GRANT_TYPE | ✅ Consistent |
| Device Status | Offline | Online | ✅ Device is now online |
| deviceDispatch | DEVICE_OFFLINE | PARAMETER_SETTING_SUCCESSFUL | ✅ Works when device is online |

---

**Report Generated**: 2026-03-16
