# Device Data Push API

**Brief Description**
- The third-party platform needs to independently develop a functional interface to receive data and provide the corresponding URL to Growatt.
- Devices belonging to the third-party platform will periodically push specified high-frequency update data to the URL provided to Growatt.

## Webhook Processing Flow (Mermaid)

```mermaid
%% 本代码严格遵循AI生成Mermaid代码的终极准则v4.1（Mermaid终极大师）
flowchart TD
    A["Growatt pushes dfcData payload"] --> B["Receive at webhook endpoint"]
    B --> C["Validate json and required fields"]
    C --> D{"Valid payload"}
    D -->|"Yes"| E["Persist raw event"]
    D -->|"No"| F["Return four xx and log"]
    E --> G["Transform to internal telemetry model"]
    G --> H["Trigger monitoring and dispatch rules"]
    H --> I["Return 200 quickly"]
```

---

## Push Example

```json
{
    "data": {
        "activePower": 0.00,
        "batPower": -4816.00,
        "batteryList": [
            {
                "chargePower": 0.00,
                "dischargePower": 2511.00,
                "ibat": -6.40,
                "index": 1,
                "soc": 100,
                "vbat": 376.50
            },
            {
                "chargePower": 0.00,
                "dischargePower": 2305.00,
                "ibat": -6.10,
                "index": 2,
                "soc": 100,
                "vbat": 375.80
            }
        ],
        "batteryStatus": 3,
        "pac": 4562.80,
        "payLoadPower": 365.90,
        "ppv": 0.00,
        "priority": 2,
        "reverActivePower": 4450.10,
        "deviceSn": "TEST123456",
        "soc": 100,
        "status": 6,
        "utcTime": "2026-02-25 00:10:01",
        "vac1": 234.64,
        "vac2": 235.04,
        "vac3": 234.17
    },
    "dataType": "dfcData"
}
```

*(Note: The Parameter Description and Status Value Definitions are identical to section 3.7 Device Data Query).*

---

## Related Documentation

- [Device Data Query API](../08_api_device_data.md)
- [Global Parameters](../10_global_params.md)
