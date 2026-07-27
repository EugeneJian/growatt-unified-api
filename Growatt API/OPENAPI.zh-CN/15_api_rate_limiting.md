# 附录 E 接口限流说明

## 限流模式说明

| 模式 | 含义 |
|---|---|
| `CLIENT_ONLY` | 按 clientId 限制，同一 client 对该接口的调用频率共享配额 |
| `CLIENT_AND_DEVICE` | 按 clientId + deviceSn 限制，同一 client 对同一设备独立计算频率 |

---

## 各接口限流配置

| 接口路径 | 方法名 | 限流窗口 | 限流模式 |
|---|---|---|---|
| `POST /oauth2/getDeviceInfo` | `getDeviceInfo` | 60s | `CLIENT_AND_DEVICE` |
| `POST /oauth2/getDeviceData` | `getDeviceData` | 60s | `CLIENT_AND_DEVICE` |
| `POST /oauth2/deviceDispatch` | `deviceDispatch` | 5s | `CLIENT_AND_DEVICE` |
| `POST /oauth2/readDeviceDispatch` | `readDeviceDispatch` | 5s | `CLIENT_AND_DEVICE` |
| `POST /oauth2/getDeviceList` | `getApiDeviceList` | 60s | `CLIENT_ONLY` |
| `POST /oauth2/getDeviceListAuthed` | `getApiDeviceListAuth` | 60s | `CLIENT_ONLY` |

---

## 触发限流后的响应示例

当触发接口限流时，API 返回：

```json
{
  "code": 429,
  "data": null,
  "message": "API-level rate limited for clientId=client***, retry after 43217ms"
}
```

- `clientId` 只展示前 6 位，其余用 `***` 脱敏
- `retry after Xms` 为距本次限流窗口结束的剩余毫秒数

---

## 相关文档

- [设备信息查询 API](./07_api_device_info.md)
- [设备数据查询 API](./08_api_device_data.md)
- [设备调度 API](./05_api_device_dispatch.md)
- [读取调度 API](./06_api_read_dispatch.md)
- [API 故障排查](./11_api_troubleshooting.md)
