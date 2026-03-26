# 设备数据推送 API

**简要说明**

- 第三方平台需要自行提供可用的接收接口，并将 webhook URL 提供给 Growatt。
- 推送 payload 的主结构应与 [设备数据查询 API](./08_api_device_data.md) 的主规范字段保持一致。
- 如果某个环境仍推送历史兼容字段，应在接收端按兼容方式处理，而不是反向修改主模型。

## Webhook 处理时序

```mermaid
%% 本代码严格遵循AI生成Mermaid代码的终极准则v4.1（Mermaid终极大师）
sequenceDiagram
    participant Growatt as PushService
    participant Webhook as WebhookEndpoint
    participant Storage as EventStorage
    participant RuleEngine as RuleEngine

    Growatt->>Webhook: 推送 dfcData
    Webhook->>Webhook: 校验 payload
    alt Payload 合法
        Webhook->>Storage: 保存原始事件
        Webhook->>RuleEngine: 解析主规范字段
        Webhook-->>Growatt: 返回 200
    else Payload 非法
        Webhook-->>Growatt: 返回 4xx
    end
```

---

## 推送示例

```json
{
    "dataType": "dfcData",
    "data": {
        "meterPower": 0.00,
        "reactivePower": 174.90,
        "pac": 41.30,
        "ppv": 14.30,
        "batPower": 0.00,
        "payLoadPower": 14.50,
        "serialNum": "YRP0N4S00Q",
        "utcTime": "2026-03-13 07:48:25",
        "status": 6,
        "batteryList": [
            {
                "index": 1,
                "soc": 67,
                "soh": 100,
                "chargePower": 0.00,
                "dischargePower": 0.00,
                "ibat": -1.00,
                "vbat": 53.30,
                "status": 0
            }
        ]
    }
}
```

### 9290 与历史材料兼容说明

部分历史或当前环境 payload 可能仍包含 `activePower`、`reverActivePower` 或外层 `soc`，并且它们可能与 `meterPower` 同时出现。上述字段都应被视为兼容输入，主解析逻辑仍以 [设备数据查询 API](./08_api_device_data.md) 中定义的模型为准。

---

## 相关文档

- [设备数据查询 API](./08_api_device_data.md)
- [全局参数](./10_global_params.md)
