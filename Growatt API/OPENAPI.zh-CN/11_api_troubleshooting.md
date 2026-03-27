# 常见问题与排查 FAQ

版本：V1.0 | 发布日期：2026 年 3 月 12 日

本页汇总常见集成失败场景与符合端点级文档的修正动作。若本页与端点级主规范冲突，以对应端点文档为准。

建议配套阅读：

- [设备授权 API](./04_api_device_auth.md)
- [设备信息查询 API](./07_api_device_info.md)
- [设备数据查询 API](./08_api_device_data.md)

---

## 已验证的 Client-Credentials 成功路径

在 `client_credentials` 模式下，以下顺序已验证通过：

1. `POST /oauth2/token`
2. `POST /oauth2/bindDevice`
3. `POST /oauth2/getDeviceInfo`
4. `POST /oauth2/getDeviceData`
5. `POST /oauth2/deviceDispatch`
6. `POST /oauth2/readDeviceDispatch`
7. `POST /oauth2/unbindDevice`

---

## FAQ

### 1. 为什么 `client_credentials` 调 `getDeviceList` 失败？

使用 `client_credentials` 调用 `POST /oauth2/getDeviceList` 超出了支持边界，可能返回：

```json
{
    "code": 103,
    "data": null,
    "message": "WRONG_GRANT_TYPE"
}
```

正确动作：

- 不要把 `getDeviceList` 当作 `client_credentials` 模式下的候选设备发现入口。
- 直接使用已知纯 SN 调用 `bindDevice`。

### 2. 为什么设备标识看起来没问题，但 `bindDevice` 还是失败？

常见原因包括：

- 页面展示值仍带 `SPH:` / `SPM:` 等前缀
- 把 `datalogSn` 当成了 `deviceSn`
- 当前环境要求对象数组，而不是字符串数组

正确动作：

- 正确的绑定目标：`getDeviceList` 返回的 `deviceSn`
- 错误的绑定目标：`datalogSn`，或 `SPH:RAW_DEVICE_SN` 这类带展示前缀的值
- 如果字符串数组绑定返回 `SYSTEM_ERROR`，可改为：

```json
{
    "deviceSnList": [
        {
            "deviceSn": "RAW_DEVICE_SN"
        }
    ]
}
```

- 如果环境或目标设备要求 PIN，再在对象项中补 `pinCode`

### 3. 为什么 `getDeviceInfo` 或 `getDeviceData` 返回 `parameter error`？

这通常由以下原因导致：

- 传了带前缀的 SN
- 请求体不是 JSON

已验证通过的请求组合：

- `Authorization: Bearer <access_token>`
- `Content-Type: application/json`
- Body 只传纯 SN

### 4. 哪些接口统一使用 JSON body？

已验证通过的接口包括：

- `bindDevice`
- `getDeviceInfo`
- `getDeviceData`
- `deviceDispatch`
- `readDeviceDispatch`
- `unbindDevice`

### 5. `readDeviceDispatch` 的返回为什么有时是对象，有时是数组？

这与 `setType` 有关：

- `time_slot_charge_discharge` 常见为数组
- `duration_and_power_charge_discharge` 可能返回对象结构

因此客户端应按 `setType` 解析 `data`，不要把某一个示例当成唯一固定结构。

---

## 错误到动作对照表

| 返回 / 错误 | 常见原因 | 正确动作 |
| :--- | :--- | :--- |
| `TOKEN_IS_INVALID` | token 已过期或无效 | 刷新 token 或重新获取 token |
| `DEVICE_SN_DOES_NOT_HAVE_PERMISSION` | 设备尚未绑定或当前 token 无权限 | 先执行 `bindDevice` 或核对授权关系 |
| `bindDevice` 返回 `SYSTEM_ERROR` | 当前环境 / 设备要求的请求形态不匹配，或误用了 `datalogSn` | 改为传包含 `deviceSn` 的对象项；如环境要求，再补 `pinCode` |
| `WRONG_GRANT_TYPE` | OAuth 模式与接口不匹配 | 切换到正确模式，或改走 `bindDevice` 流程 |
| `parameter error` | SN 带前缀或 body 格式错误 | 改为 JSON body，并仅传纯 SN |
| `code=400, message=fail` | 常见于鉴权头与请求体组合错误 | 改为 `Authorization: Bearer` + JSON body |

---

## 相关文档

- [设备授权 API](./04_api_device_auth.md)
- [设备信息查询 API](./07_api_device_info.md)
- [设备数据查询 API](./08_api_device_data.md)
