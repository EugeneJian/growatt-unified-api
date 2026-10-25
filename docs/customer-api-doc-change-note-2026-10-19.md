# Growatt Open API 文档变更说明

发布日期：2026-10-19

## 1. 设备信息

`POST /oauth2/getDeviceInfo` 返回数据新增 `coupleType` 字段，位于 `backupCutOffSOC` 与 `batteryList` 之间。

| 字段 | 类型 | 说明 | 示例 |
| :--- | :--- | :--- | :--- |
| `data.coupleType` | string \| null | 设备耦合类型：`DC_COUPLE`（直流耦合）、`AC_COUPLE`（交流耦合）或 `null` | `"DC_COUPLE"` |

响应片段：

```json
{
    "backupCutOffSOC": 10,
    "coupleType": "DC_COUPLE",
    "batteryList": []
}
```

## 2. 集成影响

本次为响应字段新增，请求参数保持不变。读取 `coupleType` 时，应兼容上述两种字符串取值和 `null`。

完整返回示例见[设备信息查询 API](../Growatt%20API/OPENAPI.zh-CN/07_api_device_info.md)。
