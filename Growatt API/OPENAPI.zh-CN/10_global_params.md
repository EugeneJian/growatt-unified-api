# 全局参数说明

## 域名

### 生产环境

- `https://opencloud.growatt.com`
- `https://opencloud-au.growatt.com`

### 测试环境

- `https://opencloud-test.growatt.com`

---

## 请求约定

| 类别 | 接口 | 约定 |
| :--- | :--- | :--- |
| Token 接口 | `/oauth2/token`、`/oauth2/refresh` | `POST` + `application/x-www-form-urlencoded` |
| 设备授权接口 | `/oauth2/bindDevice`、`/oauth2/unbindDevice` | `POST` + `application/json` + `Authorization: Bearer <token>` |
| 设备查询接口 | `/oauth2/getDeviceInfo`、`/oauth2/getDeviceData` | `POST` + `application/json` + `Authorization: Bearer <token>` |
| 调度接口 | `/oauth2/deviceDispatch`、`/oauth2/readDeviceDispatch` | `POST` + `application/json` + `Authorization: Bearer <token>` |
| 无 Body 的授权查询 | `/oauth2/getDeviceList`、`/oauth2/getDeviceListAuthed` | `POST` + `Authorization: Bearer <token>` |

---

## 全局响应结构

```json
{
    "code": 0,
    "data": {},
    "message": "SUCCESSFUL_OPERATION"
}
```

### 响应字段

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| `code` | int | 业务状态码，0 为成功，非 0 为失败 |
| `data` | any | 业务数据，具体结构由接口决定 |
| `message` | string | 状态描述 |

---

## 常见响应码

| `code` | `message` | 说明 |
| :--- | :--- | :--- |
| `0` | `SUCCESSFUL_OPERATION` | 调用成功 |
| `2` | `TOKEN_IS_INVALID` | token 无效或已过期 |
| `5` | `DEVICE_OFFLINE` | 设备离线 |
| `6` | `PARAMETER_SETTING_FAILED` | 参数设置失败 |
| `7` | `WRONG_DEVICE_TYPE` | 设备类型不匹配 |
| `12` | `DEVICE_SN_DOES_NOT_HAVE_PERMISSION` | 当前 token 无该设备权限 |
| `15` | `PARAMETER_SETTING_DEVICE_NOT_RESPONDING` | 设备未回复下发命令 |
| `16` | `PARAMETER_SETTING_RESPONSE_TIMEOUT` | 参数设置响应超时 |
| `18` | `READ_PARAMETER_FAILED` | 参数读取失败 |
| `103` | `WRONG_GRANT_TYPE` | 当前 OAuth 模式不支持该接口 |

---

## 频控规则

- `/oauth2/deviceDispatch`：单设备每 5 秒最多调用 1 次。
- `/oauth2/readDeviceDispatch`：单设备每 5 秒最多调用 1 次。

---

## 设备参数说明

**简要说明**

- 下表列出常见 `setType` 参数及其含义。
- `value` 的实际结构取决于对应的 `setType`。

| 参数名 | 参数说明 | 参数值说明 |
| :--- | :--- | :--- |
| `enable_control` | 控制权限 | 0：关闭<br>1：开启<br>默认：关闭 |
| `power_on_off_command` | 开关机指令 | 0：关机<br>1：开机<br>默认：开机<br>不存储<br>使用该协议控制逆变器时需要先开启此寄存器 |
| `system_time_setting` | 系统时间设置 | 示例：2024-10-10 13:14:14 |
| `syn_enable` | SYN 使能 | 离网箱使能<br>0：关闭<br>1：开启<br>默认：0 |
| `active_power_derating_percentage` | 有功降额百分比 | 降额范围：[0, 100]<br>默认值：100 |
| `active_power_percentage` | 有功功率百分比 | 降额范围：[0, 100]<br>默认值：100<br>有功功率百分比与有功降额百分比中较小者作为实际值<br>不存储 |
| `eps_enable` | EPS 离网使能 | 0：关闭<br>1：开启<br>默认：0 |
| `eps_frequency` | EPS 离网频率 | 0：50Hz<br>1：60Hz<br>默认：0 |
| `eps_voltage` | EPS 离网电压 | 0：230V<br>1：208V<br>2：240V<br>3：220V<br>4：127V<br>5：277V<br>6：254V<br>默认：0 |
| `reactive_power_percentage` | 无功功率百分比 | 降额范围：[0, 60]<br>默认值：60 |
| `reactive_power_mode` | 无功功率模式 | 0：PF=1<br>1：PF 值设置<br>2：默认 PF 曲线（预留）<br>3：用户自定义 PF 曲线（预留）<br>4：滞后无功（+）<br>5：超前无功（-）<br>默认值：0 |
| `power_factor` | 功率因数 | [0, 20000]<br>实际功率因数 = (10000 - 设定值) * 0.0001<br>默认值：10000 |
| `anti_backfeed_enable` | 防逆流使能 | 0：关闭<br>1：单机防逆流开启<br>默认值：0 |
| `anti_backfeed_power_percentage` | 防逆流功率百分比 | [-100, 100]<br>默认值：0<br>正值表示正向电流控制，负值表示反向电流控制 |
| `anti_backfeed_limit_invalid_value` | 防逆流限值无效值 | [0, 100]<br>默认值：0<br>仅支持反向电流控制，且 >=0 |
| `anti_backfeed_invalid_duration` | 防逆流失效时长 / EMS 通讯故障时长 | [1, 300]<br>默认值：30 |
| `ems_comm_failure_enable` | EMS 通讯故障功能使能 | 0：关闭<br>1：开启<br>默认值：0 |
| `over_backfeed_enable` | 过逆流使能 | 0：关闭<br>1：开启<br>默认值：0 |
| `anti_backfeed_power_change_rate` | 防逆流馈电功率变化速率 | [1, 20000]<br>默认值：27 |
| `single_phase_anti_backfeed_enable` | 单相防逆流控制使能 | 0：关闭<br>1：开启<br>默认值：0 |
| `anti_backfeed_protection_mode` | 防逆流保护模式 | 0：默认模式<br>1：软硬件联合控制模式<br>2：软件控制模式<br>3：硬件控制模式<br>默认值：0 |
| `charge_cutoff_soc` | 充电截止 SOC | [70, 100]<br>默认值：100 |
| `grid_discharge_cutoff_soc` | 并网放电截止 SOC | [10, 30]<br>默认值：10 |
| `load_priority_discharge_cutoff_soc` | 负载优先放电截止 SOC | [10, 20]<br>默认值：10 |
| `remote_power_control_enable` | 远程功率控制使能 | 0：关闭<br>1：开启<br>默认：0<br>不存储 |
| `remote_power_control_charge_duration` | 远程功率控制充电持续时长 | 0：不限时<br>1~1440min：按照设定时间控制功率持续时长<br>默认：0<br>不存储 |
| `remote_charge_discharge_power` | 远程充放电功率 | [-100, 100]<br>正值：充电<br>负值：放电<br>默认：0<br>不存储 |
| `ac_charge_enable` | AC 充电使能 | 0：关闭<br>1：开启<br>默认：0 |
| `time_slot_charge_discharge` | 分时充放电 | JSON 数组，时间范围 0-1440 |
| `off_grid_discharge_cutoff_soc` | 离网放电截止 SOC | [10, 30]<br>默认值：10 |
| `battery_charge_cutoff_voltage` | 电池充电截止电压 | 用于铅酸电池<br>[0, 15000] |
| `battery_discharge_cutoff_voltage` | 电池放电截止电压 | 用于铅酸电池<br>[0, 15000] |
| `battery_max_charge_current` | 电池最大充电电流 | 用于铅酸电池<br>[0, 2000]<br>默认值：1500 |
| `battery_max_discharge_current` | 电池最大放电电流 | 用于铅酸电池<br>[0, 2000]<br>默认值：1500 |

---

## 相关文档

- [身份认证说明](./01_authentication.md)
- [设备下发 API](./05_api_device_dispatch.md)
- [读取设备下发参数 API](./06_api_read_dispatch.md)
