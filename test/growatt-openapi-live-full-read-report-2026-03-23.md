# Growatt OpenAPI Live 完整读取报告

报告日期：2026-03-23  
验证环境：`https://api-test.growatt.com:9290`  
认证模式：`client_credentials`  
验证方式：live 只读复验  

> 本报告完全基于接口返回的**完整原始 JSON**生成，不使用 summary 摘要视图。
>
> 本次只执行以下只读接口：
> - `POST /oauth2/token`
> - `POST /oauth2/getDeviceListAuthed`
> - `POST /oauth2/getDeviceInfo`
> - `POST /oauth2/getDeviceData`

---

## 1. 验证时间

- UTC：`2026-03-23 07:56:35 UTC`
- Asia/Shanghai：`2026-03-23 15:56:35 +08:00`

---

## 2. 本次读取的数据个数总结

### 2.1 列表与对象数量

| 项目 | 数量 |
| :--- | ---: |
| `getDeviceListAuthed.data` 已授权设备数 | 1 |
| `getDeviceInfo.data.batteryList` 电池条数 | 1 |
| `getDeviceData.data.batteryList` 电池条数 | 1 |

### 2.2 字段数量

| 项目 | 字段数 |
| :--- | ---: |
| `getDeviceListAuthed.data[0]` 单个设备对象字段数 | 8 |
| `getDeviceInfo.data` 顶层字段数 | 15 |
| `getDeviceInfo.data.batteryList[0]` 电池对象字段数 | 4 |
| `getDeviceData.data` 顶层字段数 | 29 |
| `getDeviceData.data.batteryList[0]` 电池对象字段数 | 12 |

### 2.3 当前读取到的目标设备

| 字段 | 值 |
| :--- | :--- |
| `deviceSn` | `HCQSKJMSJ1` |
| `deviceTypeName` | `sph-s` |
| `model` | `SPH 10000TL-HU (AU)` |
| `nominalPower` | `15000` |

---

## 3. Token 完整读取结果

```json
{
  "token_type": "Bearer",
  "expires_in": 604800
}
```

结论：

- 本次 `client_credentials` token **未返回** `refresh_token`
- 当前 live 的 `expires_in = 604800`

---

## 4. 完整已授权设备列表

接口：`POST /oauth2/getDeviceListAuthed`

完整原始返回：

```json
{
  "code": 0,
  "data": [
    {
      "deviceSn": "HCQSKJMSJ1",
      "deviceTypeName": "sph-s",
      "model": "SPH 10000TL-HU (AU)",
      "nominalPower": 15000,
      "datalogSn": "ZGQ0E8511G",
      "dtc": 21300,
      "communicationVersion": "ZCEA-0006",
      "authFlag": true
    }
  ],
  "message": "SUCCESSFUL_OPERATION"
}
```

读取结论：

- 当前已授权设备总数：**1**
- 当前设备列表返回的是**完整 list**
- 不是 summary 裁剪结果

---

## 5. 完整设备信息对象

接口：`POST /oauth2/getDeviceInfo`

完整原始返回：

```json
{
  "code": 0,
  "data": {
    "deviceSn": "HCQSKJMSJ1",
    "deviceTypeName": "sph-s",
    "model": "SPH 10000TL-HU (AU)",
    "nominalPower": 15000,
    "datalogSn": "ZGQ0E8511G",
    "datalogDeviceTypeName": "ShineWiLan-X2",
    "dtc": 21300,
    "communicationVersion": "ZCEA-0006",
    "existBattery": true,
    "batterySn": "HCQSKJMSJ1_battery",
    "batteryModel": "BDCBAT",
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
  "message": "SUCCESSFUL_OPERATION"
}
```

读取结论：

- `getDeviceInfo.data` 顶层字段数：**15**
- `batteryList` 条数：**1**
- `batteryList[0]` 字段数：**4**
- 这也是**完整对象**，不是 summary

---

## 6. 完整遥测对象

接口：`POST /oauth2/getDeviceData`

完整原始返回：

```json
{
  "code": 0,
  "data": {
    "fac": 50.0,
    "backupPower": 0.0,
    "batPower": 799.0,
    "pac": -876.0,
    "etoUserToday": 0.1,
    "utcTime": "2026-03-23 07:56:34",
    "etoUserTotal": 11.4,
    "pexPower": 856.0,
    "batteryList": [
      {
        "chargePower": 799.0,
        "soc": 32,
        "echargeToday": 3.2,
        "vbat": 53.1,
        "index": 1,
        "echargeTotal": 67.8,
        "dischargePower": 0.0,
        "edischargeToday": 1.2,
        "ibat": 13.3,
        "soh": 100,
        "edischargeTotal": 78.9,
        "status": 0
      }
    ],
    "activePower": 0.0,
    "protectCode": 0,
    "reactivePower": 0.0,
    "serialNum": "HCQSKJMSJ1",
    "etoGridTotal": 123.8,
    "genPower": 0.0,
    "priority": 1,
    "vac3": 234.6,
    "etoGridToday": 1.2,
    "protectSubCode": 0,
    "vac2": 234.6,
    "vac1": 234.6,
    "payLoadPower": 0.0,
    "faultCode": 0,
    "faultSubCode": 0,
    "batteryStatus": 2,
    "ppv": 0.0,
    "meterPower": -210.0,
    "smartLoadPower": 0.0,
    "status": 6
  },
  "message": "SUCCESSFUL_OPERATION"
}
```

读取结论：

- `getDeviceData.data` 顶层字段数：**29**
- `batteryList` 条数：**1**
- `batteryList[0]` 字段数：**12**
- 当前接口直接返回的是**完整遥测对象**
- 不是 summary 裁剪结果

---

## 7. 关键字段并存情况

本次 live 遥测中，以下字段已被实际确认：

| 字段 | 是否存在 | 当前值 |
| :--- | :--- | :--- |
| `meterPower` | 是 | `-210.0` |
| `activePower` | 是 | `0.0` |
| `reactivePower` | 是 | `0.0` |
| `serialNum` | 是 | `HCQSKJMSJ1` |
| `batteryList[0].soh` | 是 | `100` |
| `reverActivePower` | 否 | 本次未返回 |

结论：

1. 当前 live 下，`meterPower` 与 `activePower` **可同时存在**
2. `reactivePower`、`serialNum`、`batteryList[].soh` 也同时存在
3. `reverActivePower` 不是每次都会出现
4. 因此兼容字段关系应理解为：
   - 可能并存
   - 可能缺省
   - 不应被建模成单向替代关系

---

## 8. 如何读取完整数据

结论：

### 8.1 读取完整 list

- 完整已授权设备列表：`POST /oauth2/getDeviceListAuthed`
- 完整候选设备列表：`POST /oauth2/getDeviceList`
  - 仅 `authorization_code` 模式支持

### 8.2 读取完整对象

- 完整设备信息：`POST /oauth2/getDeviceInfo`
- 完整遥测对象：`POST /oauth2/getDeviceData`

### 8.3 为什么之前看起来像 summary

不是 API 只返回 summary，而是：

- 辅助脚本或报告常常把完整 JSON 做了摘要展示
- 当前 API 本身已经证明会直接返回完整对象

---

## 9. 最终结论

本次基于完整原始 JSON 的 live 复验确认：

1. 当前已授权设备完整 list 数量为 **1**
2. 当前设备信息完整对象字段数为 **15**
3. 当前遥测完整对象顶层字段数为 **29**
4. 当前电池对象字段数为 **12**
5. 当前 live 遥测中，`meterPower`、`activePower`、`reactivePower`、`serialNum`、`batteryList[].soh` 已被实际确认可同时成立

因此，后续文档、解析器和测试都应以“**完整对象 + 兼容字段可能并存**”作为基准，而不是以 summary 视图作为依据。
