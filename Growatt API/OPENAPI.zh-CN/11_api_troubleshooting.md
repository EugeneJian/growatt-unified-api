# 常见问题与排查 FAQ

版本：V1.0 | 发布日期：2026 年 3 月 12 日

本页汇总了在 `https://api-test.growatt.com:9290` 测试环境中已经实测到的常见联调问题与处理方法。

建议与以下文档配套阅读：
- [设备授权 API](./04_api_device_auth.md)
- [设备信息查询 API](./07_api_device_info.md)
- [设备数据查询 API](./08_api_device_data.md)

---

## 9290 已验证成功路径

已在 `client_credentials` 模式下验证通过的顺序如下：

1. `POST /oauth2/token`
2. `POST /oauth2/bindDevice`
3. `POST /oauth2/getDeviceInfo`
4. `POST /oauth2/getDeviceData`

如果你的联调没有按这个顺序执行，建议先校正流程。

---

## FAQ

### 1. 为什么页面上的设备标识看起来没问题，但 `bindDevice` 还是失败？

在 9290 测试环境中，页面或截图里的设备标签可能带有 `SPH:` 或 `SPM:` 前缀，但实际接口请求必须传纯 SN。

- 正确：`RAW_DEVICE_SN`
- 错误：`SPH:RAW_DEVICE_SN`

已验证通过的 `bindDevice` 请求体：

```json
{
    "deviceSnList": [
        {
            "deviceSn": "RAW_DEVICE_SN",
            "pinCode": "TEST_PIN_CODE"
        }
    ]
}
```

### 2. 为什么 `getDeviceInfo` 返回 `DEVICE_SN_DOES_NOT_HAVE_PERMISSION`？

这表示当前第三方还没有获得该设备的操作权限，通常说明设备尚未完成绑定。

正确动作：

1. 先调用 `POST /oauth2/bindDevice`
2. 再重试 `POST /oauth2/getDeviceInfo`

### 3. 为什么 `getDeviceInfo` 或 `getDeviceData` 返回 `parameter error`？

在 9290 测试环境中，这通常由以下原因导致：

- 传了带前缀的 SN，例如 `SPH:RAW_DEVICE_SN`
- 请求体格式不匹配

该环境下已验证通过的查询请求格式：

- `Authorization: Bearer <access_token>`
- `Content-Type: application/json`
- JSON body：

```json
{
    "deviceSn": "RAW_DEVICE_SN"
}
```

### 4. 为什么 `getDeviceData` 会返回 `code=400` 且 `message=fail`？

这通常表示 9290 环境下使用了不正确的鉴权头与请求体组合。

已验证通过的组合：

- `Authorization: Bearer <access_token>`
- `Content-Type: application/json`
- JSON body 中传纯 SN

### 5. `getDeviceData` 到底应该用哪个鉴权头？

端点级 SSOT 文档中写的是 `token`，但在 9290 测试环境中，实测成功的是：

- `Authorization: Bearer <access_token>`

如果你的目标环境是 `https://api-test.growatt.com:9290`，优先使用本页已验证通过的组合。

### 6. 9290 最小可用请求体是什么？

#### `bindDevice`

```json
{
    "deviceSnList": [
        {
            "deviceSn": "RAW_DEVICE_SN",
            "pinCode": "TEST_PIN_CODE"
        }
    ]
}
```

#### `getDeviceInfo`

```json
{
    "deviceSn": "RAW_DEVICE_SN"
}
```

#### `getDeviceData`

```json
{
    "deviceSn": "RAW_DEVICE_SN"
}
```

---

## 错误到动作对照表

| 返回 / 错误 | 常见原因 | 正确动作 |
| :--- | :--- | :--- |
| `TOKEN_IS_INVALID` | token 已过期或无效 | 刷新 token 或重新获取 token 后重试 |
| `DEVICE_SN_DOES_NOT_HAVE_PERMISSION` | 设备尚未绑定 | 先调用 `bindDevice` |
| `parameter error` | 传了带前缀 SN 或 body 格式不匹配 | 改为 JSON body，并仅传纯 SN |
| `code=400, message=fail` | 遥测查询使用了错误的鉴权头 / body 组合 | 改为 `Authorization: Bearer` + JSON body |

---

## 9290 环境推荐默认实现

- 在构造请求前先对设备标识做标准化
  - 例如将 `SPH:RAW_DEVICE_SN` 转成 `RAW_DEVICE_SN`
- 在 9290 测试环境里，以下 4 个调用统一使用 `Authorization: Bearer <access_token>`
- 以下接口统一使用 `application/json` 请求体：
  - `bindDevice`
  - `getDeviceInfo`
  - `getDeviceData`
- 将 `bindDevice` 视为查询设备信息和设备数据前的硬前置条件

---

## 相关文档

- [设备授权 API](./04_api_device_auth.md)
- [设备信息查询 API](./07_api_device_info.md)
- [设备数据查询 API](./08_api_device_data.md)
