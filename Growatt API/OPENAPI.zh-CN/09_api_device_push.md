# 设备数据推送 API

## 简要描述

- 第三方平台需自行开发接收数据的功能接口，并向 Growatt 提供对应 URL。
- 归属于第三方平台下的设备会按固定数据类型向该 URL 推送高频数据。
- 本页直接按厂商基线的推送章节单独定义 payload。

## 推送示例

```json
{
    "data": {
        "deviceSn": "DEVICE_SN_1",
        "fac": 50.03,
        "backupPower": 0.20,
        "batPower": 0.00,
        "pac": 41.30,
        "etoUserToday": 3.10,
        "meterPower": 0.00,
        "utcTime": "2026-03-13 07:48:25",
        "etoUserTotal": 44.80,
        "pexPower": 14.30,
        "batteryList": [
            {
                "chargePower": 0.00,
                "soc": 67,
                "echargeToday": 2.90,
                "vbat": 53.30,
                "index": 1,
                "echargeTotal": 80.70,
                "dischargePower": 0.00,
                "edischargeToday": 1.90,
                "ibat": -1.00,
                "soh": 100,
                "edischargeTotal": 57.60,
                "status": 0
            }
        ],
        "protectCode": 0,
        "reactivePower": 174.90,
        "etoGridTotal": 270.70,
        "genPower": 0.00,
        "priority": 0,
        "vac3": 236.90,
        "etoGridToday": 1.50,
        "protectSubCode": 0,
        "vac2": 236.90,
        "vac1": 236.90,
        "payLoadPower": 14.50,
        "faultCode": 0,
        "faultSubCode": 0,
        "batteryStatus": 0,
        "ppv": 14.30,
        "smartLoadPower": 0.00,
        "status": 6
    },
    "dataType": "dfcData"
}
```

## 参数说明

| 参数名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `dataType` | string | 固定值：`dfcData` |
| `data` | object | 主数据对象 |
| `data.deviceSn` | string | 设备序列号 |
| `data.meterPower` | double | 电表功率（正值取电，负值馈电），单位 W |
| `data.reactivePower` | double | 无功功率（正值：容性，负值：感性） |
| `data.fac` | double | 电网频率 |
| `data.etoUserToday` | double | 今日取电电量，单位 kWh |
| `data.etoUserTotal` | double | 总取电电量，单位 kWh |
| `data.etoGridToday` | double | 今日馈电电量，单位 kWh |
| `data.etoGridTotal` | double | 总馈电电量，单位 kWh |
| `data.faultCode` | int | 故障主码 |
| `data.faultSubCode` | int | 故障子码 |
| `data.protectCode` | int | 保护主码 |
| `data.protectSubCode` | int | 保护子码 |
| `data.pac` | double | 交流输出功率，单位 W |
| `data.ppv` | double | 设备本身的 PV 功率，单位 W |
| `data.payLoadPower` | double | 总负载功率（计算值），单位 W |
| `data.batteryStatus` | int | 电池总体状态 |
| `data.batPower` | double | 电池总充/放电功率（正值充电，负值放电，0 为空闲），单位 W |
| `data.priority` | int | 工作优先级 |
| `data.status` | int | 设备运行状态码 |
| `data.utcTime` | string | UTC 时间戳，格式 `yyyy-MM-dd HH:mm:ss` |
| `data.vac1` | double | 线电压 1，单位 V |
| `data.vac2` | double | 线电压 2，单位 V |
| `data.vac3` | double | 线电压 3，单位 V |
| `data.epvTotal` | double | PV 总发电能量 |
| `data.batteryList` | array | 电池信息列表 |
| `data.batteryList[].index` | int | 电池索引（从 1 开始） |
| `data.batteryList[].soc` | int | 电池荷电状态（百分比） |
| `data.batteryList[].chargePower` | double | 电池充电功率，单位 W |
| `data.batteryList[].dischargePower` | double | 电池放电功率，单位 W |
| `data.batteryList[].ibat` | double | 电池电流（低压侧），单位 A |
| `data.batteryList[].vbat` | double | 电池电压（低压侧），单位 V |
| `data.batteryList[].soh` | int | 电池健康状态 `[0,100]` |
| `data.batteryList[].echargeToday` | double | 电池今日充电量，单位 kWh |
| `data.batteryList[].echargeTotal` | double | 电池总充电量，单位 kWh |
| `data.batteryList[].edischargeToday` | double | 电池今日放电量，单位 kWh |
| `data.batteryList[].edischargeTotal` | double | 电池总放电量，单位 kWh |

## 状态值定义

### 设备运行状态（`status`）

- `0`: 待机
- `1`: 自检
- `3`: 故障
- `4`: 升级
- `5`: 光伏在线 & 电池离线 & 并网
- `6`: 光伏离线（或在线） & 电池在线 & 并网
- `7`: 光伏在线 & 电池在线 & 离网
- `8`: 光伏离线 & 电池在线 & 离网
- `9`: 旁路模式

### 电池总体状态（`batteryStatus`）

- `0`: 电池待机
- `1`: 电池断开
- `2`: 电池充电
- `3`: 电池放电
- `4`: 故障
- `5`: 升级

### 工作优先级（`priority`）

- `0`: 负载优先
- `1`: 电池优先
- `2`: 电网优先

## 相关文档

- [设备数据查询 API](./08_api_device_data.md)
- [全局参数说明](./10_global_params.md)
