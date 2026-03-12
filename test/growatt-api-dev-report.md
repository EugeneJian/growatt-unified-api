# Growatt API 联调测试报告

## 1. 测试背景

- 测试时间：2026-03-12
- 测试环境：`https://api-test.growatt.com:9290`
- 测试模式：`client_credentials`
- 测试目标：
  - 验证 OAuth token 获取
  - 验证 `bindDevice`
  - 验证 `getDeviceInfo`
  - 验证 `getDeviceData`

## 2. 测试结论

本次联调已成功打通以下链路：

1. 获取 `access_token`
2. 绑定测试设备
3. 查询设备信息
4. 查询设备高频数据

最终结论：

- 当前测试环境可用于后续联调
- 文档主流程成立，但测试环境的请求细节与文档存在差异

## 3. 脱敏设备信息

- 设备 1：`SPH:YRP***00Q`
- 设备 2：`SPM:HCQ***SJ1`

注意：

- 页面和沟通信息里使用的是带前缀格式
- 实际调用接口时，需要区分“显示标识”和“请求参数”

## 4. 实测打通的接口顺序

1. `POST /oauth2/token`
2. `POST /oauth2/bindDevice`
3. `POST /oauth2/getDeviceInfo`
4. `POST /oauth2/getDeviceData`

## 5. 实测环境差异

### 5.1 `bindDevice` 的 `deviceSn`

`bindDevice` 需要传纯 SN，不接受带前缀值。

- 正确示例：`YRP***00Q`
- 错误示例：`SPH:YRP***00Q`

### 5.2 `getDeviceInfo` 的请求体

虽然文档示例更接近表单参数，但该测试环境实测可用的是 JSON body。

可用形式：

```json
{
  "deviceSn": "YRP***00Q"
}
```

### 5.3 `getDeviceData` 的鉴权方式

该测试环境实测成功组合为：

- `Authorization: Bearer <access_token>`
- `Content-Type: application/json`

### 5.4 查询接口的 `deviceSn`

查询接口最终成功时，使用的是纯 SN JSON body。

## 6. 关键排查过程

本次联调过程中，出现过以下典型现象：

- 未绑定设备时，`getDeviceInfo` 返回：
  - `code=12`
  - `DEVICE_SN_DOES_NOT_HAVE_PERMISSION`
- 使用带前缀的 SN 进行绑定时，返回权限错误或不成功
- 使用不匹配的 body 格式时，出现：
  - `parameter error`
  - `code=400`
  - 或 `data=null`

最终确认：

- `bindDevice` 成功关键在于使用纯 SN
- 查询接口成功关键在于使用 JSON body

## 7. 接口验证结果

### 7.1 `POST /oauth2/token`

- 结果：成功
- HTTP：`200`
- 说明：成功获取有效 `access_token`

### 7.2 `POST /oauth2/bindDevice`

- 结果：成功
- HTTP：`200`
- 业务码：`code=0`
- 说明：两台测试设备均绑定成功

### 7.3 `POST /oauth2/getDeviceInfo`

- 结果：成功
- HTTP：`200`
- 业务码：`code=0`
- 说明：两台设备均返回设备信息

### 7.4 `POST /oauth2/getDeviceData`

- 结果：成功
- HTTP：`200`
- 业务码：`code=0`
- 说明：两台设备均返回高频运行数据

## 8. 设备信息摘要

### 设备 1：`YRP***00Q`

- 设备类型：`sph`
- 型号：`SPH 5000TL-HUB`
- 额定功率：`6000`
- 采集器 SN：`VWQ***00L`
- 电池：有
- 电池容量：`9000`
- 授权标志：`true`

### 设备 2：`HCQ***SJ1`

- 设备类型：`sph`
- 型号：`SPH 10000TL-HU (AU)`
- 额定功率：`15000`
- 采集器 SN：`ZGQ***11G`
- 电池：有
- 电池容量：`4500`
- 授权标志：`true`

## 9. 高频数据摘要

### 设备 1：`YRP***00Q`

- 时间：`2026-03-12 12:03:10`
- SOC：`60`
- 光伏功率：`18.00`
- 负载功率：`18.20`
- 设备状态：`9`

### 设备 2：`HCQ***SJ1`

- 时间：`2026-03-12 10:46:17`
- SOC：`56`
- 电池功率：`15.00`
- 光伏功率：`5.00`
- 设备状态：`0`

## 10. 联调建议

- 后续对接时，将“显示设备标识”和“接口传参格式”分开处理
- 在 SDK 或服务端封装中固定以下约定：
  - 绑定接口统一传纯 SN
  - 查询接口统一使用 JSON body
  - 鉴权统一使用 `Authorization: Bearer <token>`
- 对 `code=12` 做显式处理，提示先完成绑定

## 11. 总结

本次联调已确认该测试环境可完成完整业务闭环。后续开发可基于当前验证通过的请求格式继续封装代码和编写自动化测试。
