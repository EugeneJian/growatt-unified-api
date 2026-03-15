# oauth2-openApi平台接口测试报告

## 测试环境

| 项目 | 内容 |
| :--- | :--- |
| 测试地址 | [https://api-test.growatt.com:9290](https://api-test.growatt.com:9290) |
| 测试方式 | API接口测试 |
| 认证方式 | OAuth2 |
| 测试工具 | curl |
| 测试时间 | 2026/3/13 |

---

## 一、授权码模式测试

| 接口名称 | Method | 请求地址 | Content-Type |
| :--- | :--- | :--- | :--- |
| 用户登录(growatt内置页面) | POST | /login | application/json |
| 获取授权码code(growatt内置页面) | GET | /auth | - |
| 获取token | POST | /oauth2/token | application/x-www-form-urlencoded |
| 获取可授权设备列表 | POST | /oauth2/getDeviceList | - |
| 授权设备 | POST | /oauth2/bindDevice | application/json |
| 获取已授权设备列表 | POST | /oauth2/getDeviceListAuthed | - |
| 获取设备信息 | POST | /oauth2/getDeviceInfo | application/json |
| 获取设备数据 | POST | /oauth2/getDeviceData | application/json |
| 设备参数设置 | POST | /oauth2/deviceDispatch | application/json |
| 设备参数读取 | POST | /oauth2/readDeviceDispatch | application/json |
| 解除设备授权 | POST | /oauth2/unbindDevice | application/json |
| Refresh Token | POST | /oauth2/refresh | - |

### 1. 用户登录

**请求**

```bash
curl --location --request POST 'https://api-test.growatt.com:9290/login' \
--header 'Content-Type: application/json' \
--data-raw '{
  "username": "Grter",
  "password": "511ed2f6d0841c0c71889f1bfa0504c0",
  "clientId": "testcodemode"
}'
```

```json
{
  "username": "Grter",
  "password": "511ed2f6d0841c0c71889f1bfa0504c0",
  "clientId": "testcodemode"
}
```

**返回**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "country": "Other",
    "clientId": "testcodemode",
    "clientCompany": "testcodemode",
    "id": "376852",
    "token": "zH9KoW5r4uddMC8wMpUO4MRX1pwaqSbT",
    "username": "Grter"
  }
}
```

### 2. 获取授权码 Code

**请求**

| 参数 | 示例 |
| :--- | :--- |
| client_id | testcodemode |
| response_type | code |
| redirect_uri | [https://api-test.growatt.com:9290/testToken/testToken1](https://api-test.growatt.com:9290/testToken/testToken1) |

```bash
curl --location --request GET 'https://api-test.growatt.com:9290/auth?response_type=code&client_id=testcodemode&redirect_uri=https://api-test.growatt.com:9290/testToken/testToken1' \
--header 'Authorization: Bearer zH9KoW5r4uddMC8wMpUO4MRX1pwaqSbT'
```

**返回**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "redirect_uri": "https://api-test.growatt.com:9290/testToken/testToken1",
    "state": "uAE1zy7b8w",
    "client_id": "testcodemode",
    "auth_code": "D7zR9xAKawlBeF03fFbimVNypaeAnlkTiozdrsxY7tGdLcvftR3OWMCfAMTd"
  }
}
```

### 3. 获取 Token

**请求**

```bash
curl --location --request POST 'https://api-test.growatt.com:9290/oauth2/token?grant_type=authorization_code&code=D7zR9xAKawlBeF03fFbimVNypaeAnlkTiozdrsxY7tGdLcvftR3OWMCfAMTd&client_id=testcodemode&client_secret=testsecretgrowatt1'
```

**返回**

```json
{
  "access_token": "XW1wfvb1UhAVb2SWjz8zCALtxDHxE8u5Wg2Y1PIzR6ooJs53YYv9Eq1SqD01",
  "refresh_token": "wNrFTtYsrIP49Ath6RUo1ptseiPIbOX7ow5dMxly9yIeGGmNk0sHQGnVsJ7y",
  "refresh_expires_in": 2572155,
  "token_type": "Bearer",
  "expires_in": 598156
}
```

### 4. 获取可授权设备列表

**请求**

```bash
curl --location --request POST 'https://api-test.growatt.com:9290/oauth2/getDeviceList' \
--header 'Authorization: Bearer XW1wfvb1UhAVb2SWjz8zCALtxDHxE8u5Wg2Y1PIzR6ooJs53YYv9Eq1SqD01'
```

**返回**

```json
{
  "code": 0,
  "data": [
    {
      "deviceSn": "ZSNGB52002",
      "deviceTypeName": "min",
      "model": "MIC 600TL-X2",
      "nominalPower": 6000,
      "datalogSn": "UXM0E4700R",
      "datalogDeviceTypeName": "ShineMaster4G-X",
      "dtc": 5200,
      "communicationVersion": "ZAAA-0027",
      "existBattery": false,
      "batterySn": null,
      "batteryModel": null,
      "batteryCapacity": null,
      "batteryNominalPower": null,
      "authFlag": false,
      "batteryList": []
    },
    {
      "deviceSn": "WUP0N35007",
      "deviceTypeName": "sph",
      "model": "SPH 6000TL-HUB",
      "nominalPower": 4600,
      "datalogSn": "XGD6CMM37U",
      "datalogDeviceTypeName": "ShineWiFi-X",
      "dtc": 3504,
      "communicationVersion": "ZCbd-0099",
      "existBattery": true,
      "batterySn": "kel0000022260025",
      "batteryModel": "BDCBAT",
      "batteryCapacity": 4500,
      "batteryNominalPower": 4600,
      "authFlag": false,
      "batteryList": [
        {
          "batterySn": "kel0000022260025",
          "batteryModel": "BDCBAT",
          "batteryCapacity": 4500,
          "batteryNominalPower": 4600
        }
      ]
    },
    {
      "deviceSn": "DYM2DCM00K",
      "deviceTypeName": "sph",
      "model": "SPH 6000TL BL-UP",
      "nominalPower": 3000,
      "datalogSn": "VWQ0F7J0A8",
      "datalogDeviceTypeName": "ShineWiLan-X2",
      "dtc": 3502,
      "communicationVersion": "ZCBc-0010",
      "existBattery": true,
      "batterySn": "DYM2DCM00K_battery",
      "batteryModel": "SPH 6000TL BL-UP",
      "batteryCapacity": 4500,
      "batteryNominalPower": 3000,
      "authFlag": false,
      "batteryList": [
        {
          "batterySn": "DYM2DCM00K_battery",
          "batteryModel": "BDCBAT",
          "batteryCapacity": 4500,
          "batteryNominalPower": 3000
        }
      ]
    },
    {
      "deviceSn": "DLP0DA7888",
      "deviceTypeName": "min",
      "model": "MID 30KTL3-XH",
      "nominalPower": 15000,
      "datalogSn": "JKN0EXA00A",
      "datalogDeviceTypeName": "ShineWiLan-X2",
      "dtc": 5400,
      "communicationVersion": "ZBDC-0017",
      "existBattery": true,
      "batterySn": "CXM00000224700EL",
      "batteryModel": "APX 98034-C2",
      "batteryCapacity": 5000,
      "batteryNominalPower": 2500,
      "authFlag": false,
      "batteryList": [
        {
          "batterySn": "CXM00000224700EL",
          "batteryModel": "BDCBAT",
          "batteryCapacity": 5000,
          "batteryNominalPower": 2500
        },
        {
          "batterySn": "UQM000002305000G",
          "batteryModel": "BDCBAT",
          "batteryCapacity": 5000,
          "batteryNominalPower": 2500
        }
      ]
    },
    {
      "deviceSn": "QDL0CG9004",
      "deviceTypeName": "min",
      "model": "MOD 10KTL3-XH",
      "nominalPower": 10000,
      "datalogSn": "JKN0EXA00A",
      "datalogDeviceTypeName": "ShineWiLan-X2",
      "dtc": 5400,
      "communicationVersion": "ZBDC-0017",
      "existBattery": true,
      "batterySn": "CXM00000224700GD",
      "batteryModel": "APX 98034-C2",
      "batteryCapacity": 5000,
      "batteryNominalPower": 2500,
      "authFlag": false,
      "batteryList": [
        {
          "batterySn": "CXM00000224700GD",
          "batteryModel": "BDCBAT",
          "batteryCapacity": 5000,
          "batteryNominalPower": 2500
        }
      ]
    },
    {
      "deviceSn": "WCK1234567",
      "deviceTypeName": "sph",
      "model": "SPH6000TL BL-UP",
      "nominalPower": 3000,
      "datalogSn": "XGD6CMM37U",
      "datalogDeviceTypeName": "ShineWiFi-X",
      "dtc": 3502,
      "communicationVersion": "ZCBC-0007",
      "existBattery": true,
      "batterySn": "WCK1234567_battery",
      "batteryModel": "SPH6000TL BL-UP",
      "batteryCapacity": 4500,
      "batteryNominalPower": 3680,
      "authFlag": false,
      "batteryList": [
        {
          "batterySn": "WCK1234567_battery",
          "batteryModel": "BDCBAT",
          "batteryCapacity": 4500,
          "batteryNominalPower": 3680
        }
      ]
    },
    {
      "deviceSn": "WZM1234567",
      "deviceTypeName": "sph",
      "model": "SPH 6000TL BL-UP",
      "nominalPower": 4600,
      "datalogSn": "XGD6CMM37U",
      "datalogDeviceTypeName": "ShineWiFi-X",
      "dtc": 3502,
      "communicationVersion": "ZCbc-0006",
      "existBattery": true,
      "batterySn": "GPF0219520290033",
      "batteryModel": "MAX 70KTL3 LV",
      "batteryCapacity": 4500,
      "batteryNominalPower": 3000,
      "authFlag": false,
      "batteryList": [
        {
          "batterySn": "GPF0219520290033",
          "batteryModel": "BDCBAT",
          "batteryCapacity": 4500,
          "batteryNominalPower": 3000
        }
      ]
    },
    {
      "deviceSn": "TPJ2023103",
      "deviceTypeName": "sph",
      "model": "SPH 10000TL3 BH-UP",
      "nominalPower": 10000,
      "datalogSn": "XGD6DC3A7B",
      "datalogDeviceTypeName": "ShineWiFi-X",
      "dtc": 3601,
      "communicationVersion": "ZDAA-0013",
      "existBattery": true,
      "batterySn": "TPJ2023103_battery",
      "batteryModel": "SPH 10000TL3 BH-UP",
      "batteryCapacity": 4500,
      "batteryNominalPower": 10000,
      "authFlag": false,
      "batteryList": [
        {
          "batterySn": "TPJ2023103_battery",
          "batteryModel": "BDCBAT",
          "batteryCapacity": 4500,
          "batteryNominalPower": 10000
        }
      ]
    },
    {
      "deviceSn": "ZSNGB52003",
      "deviceTypeName": "min",
      "model": "MIC 600TL-X2",
      "nominalPower": 6000,
      "datalogSn": "UXM0E4700R",
      "datalogDeviceTypeName": "ShineMaster4G-X",
      "dtc": 5200,
      "communicationVersion": "ZAAA-0027",
      "existBattery": false,
      "batterySn": null,
      "batteryModel": null,
      "batteryCapacity": null,
      "batteryNominalPower": null,
      "authFlag": false,
      "batteryList": []
    },
    {
      "deviceSn": "9876543210",
      "deviceTypeName": "sph",
      "model": "BDCBAT",
      "nominalPower": 6000,
      "datalogSn": "VWQ0F7J0A8",
      "datalogDeviceTypeName": "ShineWiLan-X2",
      "dtc": 3502,
      "communicationVersion": "ZCBC-0009",
      "existBattery": true,
      "batterySn": "9876543210_battery",
      "batteryModel": "BDCBAT",
      "batteryCapacity": 4500,
      "batteryNominalPower": 4000,
      "authFlag": false,
      "batteryList": [
        {
          "batterySn": "9876543210_battery",
          "batteryModel": "BDCBAT",
          "batteryCapacity": 4500,
          "batteryNominalPower": 4000
        }
      ]
    },
    {
      "deviceSn": "PZL0CHJ0E2",
      "deviceTypeName": "min",
      "model": "MOD 6000TL3-XH",
      "nominalPower": 6000,
      "datalogSn": "XGD6F350DB",
      "datalogDeviceTypeName": "ShineWiFi-X",
      "dtc": 5400,
      "communicationVersion": "ZBDB-0015",
      "existBattery": true,
      "batterySn": "0CXM90ZR14BT000R",
      "batteryModel": "APX 98034-C2",
      "batteryCapacity": 5000,
      "batteryNominalPower": 2500,
      "authFlag": false,
      "batteryList": [
        {
          "batterySn": "0CXM90ZR14BT000R",
          "batteryModel": "BDCBAT",
          "batteryCapacity": 5000,
          "batteryNominalPower": 2500
        }
      ]
    },
    {
      "deviceSn": "ZSNGB52004",
      "deviceTypeName": "min",
      "model": "MIC 600TL-X2",
      "nominalPower": 6000,
      "datalogSn": "UXM0E4700R",
      "datalogDeviceTypeName": "ShineMaster4G-X",
      "dtc": 5200,
      "communicationVersion": "ZAAA-0027",
      "existBattery": false,
      "batterySn": null,
      "batteryModel": null,
      "batteryCapacity": null,
      "batteryNominalPower": null,
      "authFlag": false,
      "batteryList": []
    },
    {
      "deviceSn": "EGM2H4L009",
      "deviceTypeName": "sph",
      "model": "SPH 3600TL BL-UP",
      "nominalPower": 4600,
      "datalogSn": "XGD6F350BD",
      "datalogDeviceTypeName": "ShineWiFi-X",
      "dtc": 3502,
      "communicationVersion": "ZCBC-0011",
      "existBattery": true,
      "batterySn": "MVK000002301007L",
      "batteryModel": "ARK 2.5L-A1-AU/2.56kWh/51.2V/50Ah",
      "batteryCapacity": 2250,
      "batteryNominalPower": 3000,
      "authFlag": false,
      "batteryList": [
        {
          "batterySn": "MVK000002301007L",
          "batteryModel": "BDCBAT",
          "batteryCapacity": 2250,
          "batteryNominalPower": 3000
        }
      ]
    },
    {
      "deviceSn": "YRP0N3E000",
      "deviceTypeName": "sph",
      "model": "SPH 5000TL-HUB",
      "nominalPower": 6000,
      "datalogSn": "VWQ0F7J0A8",
      "datalogDeviceTypeName": "ShineWiLan-X2",
      "dtc": 3504,
      "communicationVersion": "ZCBD-0004",
      "existBattery": true,
      "batterySn": "YRP0N3E000_battery",
      "batteryModel": "SPH 5000TL-HUB",
      "batteryCapacity": 4500,
      "batteryNominalPower": 6000,
      "authFlag": false,
      "batteryList": [
        {
          "batterySn": "YRP0N3E000_battery",
          "batteryModel": "BDCBAT",
          "batteryCapacity": 4500,
          "batteryNominalPower": 6000
        }
      ]
    },
    {
      "deviceSn": "EGR2024906",
      "deviceTypeName": "min",
      "model": "MOD 15KTL3-HU",
      "nominalPower": 15000,
      "datalogSn": "JKN0EXA00A",
      "datalogDeviceTypeName": "ShineWiLan-X2",
      "dtc": 5401,
      "communicationVersion": "ZBDC-0014",
      "existBattery": true,
      "batterySn": "0ACU40ED2Z9T000W",
      "batteryModel": "APX 5.0M3-B2",
      "batteryCapacity": 5000,
      "batteryNominalPower": 2000,
      "authFlag": false,
      "batteryList": [
        {
          "batterySn": "0ACU40ED2Z9T000W",
          "batteryModel": "BDCBAT",
          "batteryCapacity": 5000,
          "batteryNominalPower": 2000
        }
      ]
    },
    {
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
      "batteryList": [
        {
          "batterySn": "YRP0N4S00Q_battery",
          "batteryModel": "BDCBAT",
          "batteryCapacity": 9000,
          "batteryNominalPower": 6000
        }
      ]
    },
    {
      "deviceSn": "HGQ2NXV00D",
      "deviceTypeName": "min",
      "model": "BDCBAT",
      "nominalPower": 1000,
      "datalogSn": "QMN000HGQ2NXV00D",
      "datalogDeviceTypeName": "ShineWeFi",
      "dtc": 5203,
      "communicationVersion": "GJAA-0007",
      "existBattery": false,
      "batterySn": null,
      "batteryModel": null,
      "batteryCapacity": null,
      "batteryNominalPower": null,
      "authFlag": false,
      "batteryList": []
    },
    {
      "deviceSn": "HCQSKJMSJ1",
      "deviceTypeName": "sph",
      "model": "SPH 10000TL-HU (AU)",
      "nominalPower": 15000,
      "datalogSn": "ZGQ0E8511G",
      "datalogDeviceTypeName": "ShineWiLan-X2",
      "dtc": 21300,
      "communicationVersion": "ZCEA-0005",
      "existBattery": true,
      "batterySn": "HCQSKJMSJ1_battery",
      "batteryModel": "SPH 10000TL-HU (AU)",
      "batteryCapacity": 4500,
      "batteryNominalPower": 10000,
      "authFlag": false,
      "batteryList": [
        {
          "batterySn": "HCQSKJMSJ1_battery",
          "batteryModel": "BDCBAT",
          "batteryCapacity": 4500,
          "batteryNominalPower": 10000
        }
      ]
    },
    {
      "deviceSn": "QHU1234567",
      "deviceTypeName": "min",
      "model": "MIN 5000TL-XH2",
      "nominalPower": 6000,
      "datalogSn": "ZGQ0F6P208",
      "datalogDeviceTypeName": "ShineWiLan-X2",
      "dtc": 5100,
      "communicationVersion": "ZABA-0023",
      "existBattery": true,
      "batterySn": "0ACU10ED2XTT0008",
      "batteryModel": "APX 5.0M3-B2",
      "batteryCapacity": 5000,
      "batteryNominalPower": 2000,
      "authFlag": false,
      "batteryList": [
        {
          "batterySn": "0ACU10ED2XTT0008",
          "batteryModel": "BDCBAT",
          "batteryCapacity": 5000,
          "batteryNominalPower": 2000
        },
        {
          "batterySn": "0PLN00R890123123",
          "batteryModel": "BDCBAT",
          "batteryCapacity": 10000,
          "batteryNominalPower": 2000
        }
      ]
    },
    {
      "deviceSn": "ZSNGB52001",
      "deviceTypeName": "min",
      "model": "MIC 600TL-X2",
      "nominalPower": 6000,
      "datalogSn": "UXM0E4700R",
      "datalogDeviceTypeName": "ShineMaster4G-X",
      "dtc": 5200,
      "communicationVersion": "ZAAA-0027",
      "existBattery": false,
      "batterySn": null,
      "batteryModel": null,
      "batteryCapacity": null,
      "batteryNominalPower": null,
      "authFlag": false,
      "batteryList": []
    }
  ],
  "message": "SUCCESSFUL_OPERATION"
}
```

### 5. 授权设备

**请求**

```bash
curl --location --request POST 'https://api-test.growatt.com:9290/oauth2/bindDevice' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer XW1wfvb1UhAVb2SWjz8zCALtxDHxE8u5Wg2Y1PIzR6ooJs53YYv9Eq1SqD01' \
--data-raw '{
  "deviceSnList": [
    {
      "deviceSn": "YRP0N4S00Q",
      "pinCode": "TESTPINCODE753951"
    }
  ]
}'
```

```json
{
  "deviceSnList": [
    {
      "deviceSn": "YRP0N4S00Q",
      "pinCode": "TESTPINCODE753951"
    }
  ]
}
```

**返回**

```json
{
  "code": 0,
  "data": 0,
  "message": "SUCCESSFUL_OPERATION"
}
```

### 6. 获取已授权设备列表

**请求**

```bash
curl --location --request POST 'https://api-test.growatt.com:9290/oauth2/getDeviceListAuthed' \
--header 'Authorization: Bearer XW1wfvb1UhAVb2SWjz8zCALtxDHxE8u5Wg2Y1PIzR6ooJs53YYv9Eq1SqD01'
```

**返回**

```json
{
  "code": 0,
  "data": [
    {
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
      "batteryList": [
        {
          "batterySn": "YRP0N4S00Q_battery",
          "batteryModel": "BDCBAT",
          "batteryCapacity": 9000,
          "batteryNominalPower": 6000
        }
      ]
    }
  ],
  "message": "SUCCESSFUL_OPERATION"
}
```

### 7. 获取设备信息

**请求**

```bash
curl --location --request POST 'https://api-test.growatt.com:9290/oauth2/getDeviceInfo' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer XW1wfvb1UhAVb2SWjz8zCALtxDHxE8u5Wg2Y1PIzR6ooJs53YYv9Eq1SqD01' \
--data-raw '{
  "deviceSn": "YRP0N4S00Q"
}'
```

```json
{
  "deviceSn": "YRP0N4S00Q"
}
```

**返回**

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
    "batteryList": [
      {
        "batterySn": "YRP0N4S00Q_battery",
        "batteryModel": "BDCBAT",
        "batteryCapacity": 9000,
        "batteryNominalPower": 6000
      }
    ]
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

### 8. 获取设备数据

**请求**

```bash
curl --location --request POST 'https://api-test.growatt.com:9290/oauth2/getDeviceData' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer XW1wfvb1UhAVb2SWjz8zCALtxDHxE8u5Wg2Y1PIzR6ooJs53YYv9Eq1SqD01' \
--data-raw '{
  "deviceSn": "YRP0N4S00Q"
}'
```

```json
{
  "deviceSn": "YRP0N4S00Q"
}
```

**返回**

```json
{
  "code": 0,
  "data": {
    "fac": 50.02,
    "backupPower": 0.0,
    "batPower": 1190.0,
    "pac": -1185.3,
    "etoUserToday": 3.2,
    "reverActivePower": 0.0,
    "utcTime": "2026-03-13 09:05:45",
    "etoUserTotal": 44.9,
    "pexPower": 15.4,
    "batteryList": [
      {
        "chargePower": 1190.0,
        "soc": 66,
        "echargeToday": 2.9,
        "vbat": 53.6,
        "index": 1,
        "echargeTotal": 80.7,
        "dischargePower": 0.0,
        "edischargeToday": 1.9,
        "ibat": 21.8,
        "soh": 100,
        "edischargeTotal": 57.6,
        "status": 0
      }
    ],
    "activePower": 1270.0,
    "protectCode": 0,
    "reactivePower": 254.4,
    "serialNum": "YRP0N4S00Q",
    "etoGridTotal": 270.7,
    "genPower": 0.0,
    "priority": 1,
    "vac3": 236.3,
    "etoGridToday": 1.5,
    "protectSubCode": 0,
    "vac2": 236.3,
    "vac1": 236.3,
    "payLoadPower": 95.4,
    "faultCode": 0,
    "faultSubCode": 0,
    "batteryStatus": 2,
    "ppv": 15.4,
    "smartLoadPower": 0.0,
    "status": 6
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

### 9. 设备参数设置

**请求**

```bash
curl --location --request POST 'https://api-test.growatt.com:9290/oauth2/deviceDispatch' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer XW1wfvb1UhAVb2SWjz8zCALtxDHxE8u5Wg2Y1PIzR6ooJs53YYv9Eq1SqD01' \
--data-raw '{
  "deviceSn": "YRP0N4S00Q",
  "value": {
    "type": "chargeCommand",
    "duration": 5,
    "percentage": 20
  },
  "requestId": "12345678901234567890123456789012",
  "setType": "duration_and_power_charge_discharge"
}'
```

```json
{
  "deviceSn": "YRP0N4S00Q",
  "value": {
    "type": "chargeCommand",
    "duration": 5,
    "percentage": 20
  },
  "requestId": "12345678901234567890123456789012",
  "setType": "duration_and_power_charge_discharge"
}
```

**返回**

```json
{
  "code": 0,
  "data": null,
  "message": "PARAMETER_SETTING_SUCCESSFUL"
}
```

### 10. 设备参数读取

**请求**

```bash
curl --location --request POST 'https://api-test.growatt.com:9290/oauth2/readDeviceDispatch' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer XW1wfvb1UhAVb2SWjz8zCALtxDHxE8u5Wg2Y1PIzR6ooJs53YYv9Eq1SqD01' \
--data-raw '{
  "deviceSn": "YRP0N4S00Q",
  "setType": "duration_and_power_charge_discharge"
}'
```

```json
{
  "deviceSn": "YRP0N4S00Q",
  "setType": "duration_and_power_charge_discharge"
}
```

**返回**

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

### 11. 解除设备授权

**请求**

```bash
curl --location --request POST 'https://api-test.growatt.com:9290/oauth2/unbindDevice' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer XW1wfvb1UhAVb2SWjz8zCALtxDHxE8u5Wg2Y1PIzR6ooJs53YYv9Eq1SqD01' \
--data-raw '{
  "deviceSnList": [
    "YRP0N4S00Q"
  ]
}'
```

```json
{
  "deviceSnList": [
    "YRP0N4S00Q"
  ]
}
```

**返回**

```json
{
  "code": 0,
  "data": null,
  "message": "SUCCESSFUL_OPERATION"
}
```

### 12. Refresh Token

**请求**

```bash
curl --location --request POST 'https://api-test.growatt.com:9290/oauth2/refresh?grant_type=refresh_token&refresh_token=wNrFTtYsrIP49Ath6RUo1ptseiPIbOX7ow5dMxly9yIeGGmNk0sHQGnVsJ7y&client_id=testcodemode&client_secret=testsecretgrowatt1'
```

**返回**

```json
{
  "access_token": "krP6qeOHTRcc2I5co0C5BNfCy9lFNRP4KH70ZeDVbikdU1DBCKrtoqFBwl2b",
  "refresh_token": "wNrFTtYsrIP49Ath6RUo1ptseiPIbOX7ow5dMxly9yIeGGmNk0sHQGnVsJ7y",
  "refresh_expires_in": 2591999,
  "token_type": "Bearer",
  "expires_in": 604800
}
```

---

## 二、Client模式测试

| 接口名称 | Method | 请求地址 | Content-Type |
| :--- | :--- | :--- | :--- |
| 获取token | POST | /oauth2/token | application/x-www-form-urlencoded |
| 获取可授权设备列表 | POST | /oauth2/getDeviceList | - |
| 授权设备 | POST | /oauth2/bindDevice | application/json |
| 获取已授权设备列表 | POST | /oauth2/getDeviceListAuthed | - |
| 获取设备信息 | POST | /oauth2/getDeviceInfo | application/json |
| 获取设备数据 | POST | /oauth2/getDeviceData | application/json |
| 设备参数设置 | POST | /oauth2/deviceDispatch | application/json |
| 设备参数读取 | POST | /oauth2/readDeviceDispatch | application/json |
| 解除设备授权 | POST | /oauth2/unbindDevice | application/json |

### 1. 获取 Token

**请求**

```bash
curl --location --request POST 'https://api-test.growatt.com:9290/oauth2/token?grant_type=client_credentials&client_id=testclientmode&client_secret=testsecretgrowatt1'
```

**返回**

```json
{
  "access_token": "3s91d7ErRkTczOHkQronnfT3oc9jckXefj6Kp0HMaMkCbiHUpIhGtrf9a90P",
  "token_type": "Bearer",
  "expires_in": 604800
}
```

### 2. 获取可授权设备列表

**请求**

```bash
curl --location --request POST 'https://api-test.growatt.com:9290/oauth2/getDeviceList' \
--header 'Authorization: Bearer 3s91d7ErRkTczOHkQronnfT3oc9jckXefj6Kp0HMaMkCbiHUpIhGtrf9a90P'
```

**返回**

```json
{
  "code": 103,
  "data": null,
  "message": "WRONG_GRANT_TYPE"
}
```

### 3. 授权设备

**请求**

```bash
curl --location --request POST 'https://api-test.growatt.com:9290/oauth2/bindDevice' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer 3s91d7ErRkTczOHkQronnfT3oc9jckXefj6Kp0HMaMkCbiHUpIhGtrf9a90P' \
--data-raw '{
  "deviceSnList": [
    {
      "deviceSn": "YRP0N4S00Q",
      "pinCode": "TESTPINCODE753951"
    }
  ]
}'
```

```json
{
  "deviceSnList": [
    {
      "deviceSn": "YRP0N4S00Q",
      "pinCode": "TESTPINCODE753951"
    }
  ]
}
```

**返回**

```json
{
  "code": 0,
  "data": 0,
  "message": "SUCCESSFUL_OPERATION"
}
```

### 4. 获取已授权设备列表

**请求**

```bash
curl --location --request POST 'https://api-test.growatt.com:9290/oauth2/getDeviceListAuthed' \
--header 'Authorization: Bearer 3s91d7ErRkTczOHkQronnfT3oc9jckXefj6Kp0HMaMkCbiHUpIhGtrf9a90P'
```

**返回**

```json
{
  "code": 0,
  "data": [
    {
      "deviceSn": "HCQSKJMSJ1",
      "deviceTypeName": "sph",
      "model": "SPH 10000TL-HU (AU)",
      "nominalPower": 15000,
      "datalogSn": "ZGQ0E8511G",
      "datalogDeviceTypeName": "ShineWiLan-X2",
      "dtc": 21300,
      "communicationVersion": "ZCEA-0005",
      "existBattery": true,
      "batterySn": "HCQSKJMSJ1_battery",
      "batteryModel": "SPH 10000TL-HU (AU)",
      "batteryCapacity": 4500,
      "batteryNominalPower": 10000,
      "authFlag": true,
      "batteryList": [
        {
          "batterySn": "HCQSKJMSJ1_battery",
          "batteryModel": "BDCBAT",
          "batteryCapacity": 4500,
          "batteryNominalPower": 10000
        }
      ]
    },
    {
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
      "batteryList": [
        {
          "batterySn": "YRP0N4S00Q_battery",
          "batteryModel": "BDCBAT",
          "batteryCapacity": 9000,
          "batteryNominalPower": 6000
        }
      ]
    }
  ],
  "message": "SUCCESSFUL_OPERATION"
}
```

### 5. 获取设备信息

**请求**

```bash
curl --location --request POST 'https://api-test.growatt.com:9290/oauth2/getDeviceInfo' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer 3s91d7ErRkTczOHkQronnfT3oc9jckXefj6Kp0HMaMkCbiHUpIhGtrf9a90P' \
--data-raw '{
  "deviceSn": "YRP0N4S00Q"
}'
```

```json
{
  "deviceSn": "YRP0N4S00Q"
}
```

**返回**

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
    "batteryList": [
      {
        "batterySn": "YRP0N4S00Q_battery",
        "batteryModel": "BDCBAT",
        "batteryCapacity": 9000,
        "batteryNominalPower": 6000
      }
    ]
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

### 6. 获取设备数据

**请求**

```bash
curl --location --request POST 'https://api-test.growatt.com:9290/oauth2/getDeviceData' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer 3s91d7ErRkTczOHkQronnfT3oc9jckXefj6Kp0HMaMkCbiHUpIhGtrf9a90P' \
--data-raw '{
  "deviceSn": "YRP0N4S00Q"
}'
```

```json
{
  "deviceSn": "YRP0N4S00Q"
}
```

**返回**

```json
{
  "code": 0,
  "data": {
    "fac": 49.96,
    "backupPower": 0.0,
    "batPower": 0.0,
    "pac": 41.7,
    "etoUserToday": 3.1,
    "reverActivePower": 0.0,
    "utcTime": "2026-03-13 09:03:55",
    "etoUserTotal": 44.8,
    "pexPower": 17.7,
    "batteryList": [
      {
        "chargePower": 0.0,
        "soc": 66,
        "echargeToday": 2.9,
        "vbat": 53.2,
        "index": 1,
        "echargeTotal": 80.7,
        "dischargePower": 0.0,
        "edischargeToday": 1.9,
        "ibat": -1.0,
        "soh": 100,
        "edischargeTotal": 57.6,
        "status": 0
      }
    ],
    "activePower": 0.0,
    "protectCode": 0,
    "reactivePower": 172.8,
    "serialNum": "YRP0N4S00Q",
    "etoGridTotal": 270.7,
    "genPower": 0.0,
    "priority": 0,
    "vac3": 236.2,
    "etoGridToday": 1.5,
    "protectSubCode": 0,
    "vac2": 236.2,
    "vac1": 236.2,
    "payLoadPower": 17.7,
    "faultCode": 0,
    "faultSubCode": 0,
    "batteryStatus": 0,
    "ppv": 17.7,
    "smartLoadPower": 0.0,
    "status": 6
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

### 7. 设备参数设置

**请求**

```bash
curl --location --request POST 'https://api-test.growatt.com:9290/oauth2/deviceDispatch' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer 3s91d7ErRkTczOHkQronnfT3oc9jckXefj6Kp0HMaMkCbiHUpIhGtrf9a90P' \
--data-raw '{
  "deviceSn": "YRP0N4S00Q",
  "value": {
    "type": "chargeCommand",
    "duration": 5,
    "percentage": 20
  },
  "requestId": "12345678901234567890123456789012",
  "setType": "duration_and_power_charge_discharge"
}'
```

```json
{
  "deviceSn": "YRP0N4S00Q",
  "value": {
    "type": "chargeCommand",
    "duration": 5,
    "percentage": 20
  },
  "requestId": "12345678901234567890123456789012",
  "setType": "duration_and_power_charge_discharge"
}
```

**返回**

```json
{
  "code": 0,
  "data": null,
  "message": "PARAMETER_SETTING_SUCCESSFUL"
}
```

### 8. 设备参数读取

**请求**

```bash
curl --location --request POST 'https://api-test.growatt.com:9290/oauth2/readDeviceDispatch' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer 3s91d7ErRkTczOHkQronnfT3oc9jckXefj6Kp0HMaMkCbiHUpIhGtrf9a90P' \
--data-raw '{
  "deviceSn": "YRP0N4S00Q",
  "setType": "duration_and_power_charge_discharge"
}'
```

```json
{
  "deviceSn": "YRP0N4S00Q",
  "setType": "duration_and_power_charge_discharge"
}
```

**返回**

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

### 9. 解除设备授权

**请求**

```bash
curl --location --request POST 'https://api-test.growatt.com:9290/oauth2/unbindDevice' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer 3s91d7ErRkTczOHkQronnfT3oc9jckXefj6Kp0HMaMkCbiHUpIhGtrf9a90P' \
--data-raw '{
  "deviceSnList": [
    "YRP0N4S00Q"
  ]
}'
```

```json
{
  "deviceSnList": [
    "YRP0N4S00Q"
  ]
}
```

**返回**

```json
{
  "code": 0,
  "data": null,
  "message": "SUCCESSFUL_OPERATION"
}
```

---

## 三、本次复跑结论

- 授权码模式本次复跑成功，`/login -> /auth -> /oauth2/token -> 设备接口 -> /oauth2/refresh` 全链路可用。
- Client 模式本次复跑成功，`/oauth2/token -> /oauth2/bindDevice -> /oauth2/getDeviceInfo -> /oauth2/getDeviceData -> /oauth2/deviceDispatch -> /oauth2/readDeviceDispatch -> /oauth2/unbindDevice` 全链路可用。
- 与原 PDF 最大差异点：本次 live 结果里，`client_credentials` 调 `POST /oauth2/getDeviceList` 返回 `{"code":103,"data":null,"message":"WRONG_GRANT_TYPE"}`，不再返回可授权设备列表。
- 设备 `YRP0N4S00Q` 的设备信息和设备数据本次均成功获取，且返回的是全量 JSON，不只是摘要字段。
