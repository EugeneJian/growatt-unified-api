# `bindDevice` 联调差异对照表（AU vs 全球）

## 目的

本表用于快速对照澳洲测试环境与全球测试环境在 `bindDevice` 上的实际行为差异，方便后续联调直接查阅。

说明：

- 本表只整理实测结果，不替代正式 API 文档。
- 正式规范以 `Growatt API/OPENAPI/*.md` 与 `Growatt API/OPENAPI.zh-CN/*.md` 为准。
- 原始来源报告：
  - [oauth2-openApi-platform-au-test-report-2026-03-26.md](C:/Users/Administrator/Desktop/Github/growatt-unified-api/test/oauth2-openApi-platform-au-test-report-2026-03-26.md)
  - [oauth2-openApi-platform-global-test-report-2026-03-27.md](C:/Users/Administrator/Desktop/Github/growatt-unified-api/test/oauth2-openApi-platform-global-test-report-2026-03-27.md)

---

## 总结结论

1. AU 与全球环境在 `authorization_code` 下都不接受字符串数组绑定，这一点一致。
2. 差异在于对象数组的最小可用形态：
   - AU：对象数组需要带 `pinCode`
   - 全球：对象数组不带 `pinCode` 也能成功
3. AU 的 `client_credentials` 已测通，但全球的 `client_credentials` 本轮未测。
4. AU 的 `client_credentials` 在绑定成功后，还需要重新获取 fresh token 才能立刻读设备；全球授权码模式下未观察到这一步额外要求。
5. 绑定目标必须使用 `deviceSn`，不要误用 `datalogSn`。

---

## 差异矩阵

| 环境 | 日期 | OAuth 模式 | 实测设备 / 线索 | 可见候选设备 | 字符串数组绑定 | 对象数组不带 `pinCode` | 对象数组带 `pinCode` | 当前结论 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| AU | 2026-03-26 | `authorization_code` | `WUP0N3500C` | `WUP0N3500C` | 失败，`SYSTEM_ERROR` | 未单独验证 | 成功 | 该环境下授权码模式需要对象数组 + `pinCode` |
| AU | 2026-03-26 | `client_credentials` | `WUP0N3500C` | `getDeviceList` 不支持 | 不适用 | 不适用 | 成功 | 该环境下 client 模式使用对象数组 + `pinCode` |
| 全球 | 2026-03-27 | `authorization_code` | 用户提供 `ZG00E820UH`，实测映射到 `deviceSn=WCK6584462`，`datalogSn=ZGQ0E820UH` | `WCK6584462` | 失败，`SYSTEM_ERROR` | 成功 | 未验证，因为已成功 | 该环境下授权码模式需要对象数组，但本次不要求 `pinCode` |
| 全球 | 2026-03-27 | `client_credentials` | 未测 | 未测 | 未测 | 未测 | 未测 | 暂无结论 |

---

## 关键细节

### 1. AU 环境

#### `authorization_code`

- `getDeviceList` 返回候选设备 `WUP0N3500C`
- 绑定请求 `{"deviceSnList":["WUP0N3500C"]}` 返回：

```json
{
  "code": 1,
  "data": null,
  "message": "SYSTEM_ERROR"
}
```

- 改为对象数组并带 `pinCode` 后成功：

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

#### `client_credentials`

- `getDeviceList` 返回 `WRONG_GRANT_TYPE`
- 绑定使用对象数组 + `pinCode` 成功
- 绑定成功后，旧 token 立刻读设备返回 `DEVICE_SN_DOES_NOT_HAVE_PERMISSION`
- 重新获取 fresh token 后，`getDeviceInfo` / `getDeviceData` 成功

### 2. 全球环境

#### `authorization_code`

- 用户提供线索为 `ZG00E820UH`
- 实测 `getDeviceList` 返回：
  - `deviceSn=WCK6584462`
  - `datalogSn=ZGQ0E820UH`
- 这说明联调时应使用 `deviceSn=WCK6584462`，不要把 `datalogSn` 当成绑定目标
- 绑定请求 `{"deviceSnList":["WCK6584462"]}` 返回：

```json
{
  "code": 1,
  "data": null,
  "message": "SYSTEM_ERROR"
}
```

- 改为对象数组且不带 `pinCode` 后成功：

```json
{
  "deviceSnList": [
    {
      "deviceSn": "WCK6584462"
    }
  ]
}
```

- 绑定成功后，`getDeviceListAuthed`、`getDeviceInfo`、`getDeviceData`、`refresh`、`unbindDevice` 均成功

---

## 推荐联调顺序

### AU 环境

1. `authorization_code` 下先获取 `deviceSn`
2. 直接使用对象数组 + `pinCode` 调 `bindDevice`
3. `client_credentials` 下绑定后重新获取 fresh token，再读设备接口

### 全球环境

1. `authorization_code` 下先确认 `getDeviceList` 里的真实 `deviceSn`
2. 如字符串数组返回 `SYSTEM_ERROR`，立刻改为对象数组 `{"deviceSnList":[{"deviceSn":"..."}]}`
3. 不要用 `datalogSn` 替代 `deviceSn`

---

## 后续待补项

- 全球环境 `client_credentials` 模式尚未补测
- AU 环境下“对象数组但不带 `pinCode`”是否也会失败，本轮未单独补做对照实验
- 全球环境下“对象数组且带 `pinCode`”虽然大概率可兼容，但本轮没有必要性验证
