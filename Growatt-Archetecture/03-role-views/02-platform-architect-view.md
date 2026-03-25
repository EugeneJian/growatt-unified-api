# 平台架构师视图

> 内部资料

## 5.2 平台架构师视图

### 适用对象

- 平台架构师
- 系统架构师
- 技术负责人

### 关注重点

- 分层设计
- 云边职责
- 协议抽象层定位
- 后续可扩展性

### 平台架构师视图图示

```mermaid
flowchart TB

    subgraph L1["Ecosystem Layer"]
        USER["EMS / VPP / Partner"]
    end

    subgraph L2["API Layer"]
        API["Legacy API / OpenAPI"]
    end

    subgraph L3["Cloud Platform Layer"]
        CLOUD["Cloud Server<br/>Telemetry / Alarm / Control / Device Service"]
    end

    subgraph L4["Edge Connectivity Layer"]
        EDGE["Collector / Gateway<br/>0x04 / 0x03"]
    end

    subgraph L5["Protocol Abstract Layer"]
        PROTO["VPP 2.04 / RTU"]
    end

    subgraph L6["Device Layer"]
        DEV["XH / SPH / X / SPF"]
    end

    USER --> API --> CLOUD --> EDGE --> PROTO --> DEV
```

### 架构师解读

这是一个分层清晰的企业平台架构。
其中 **Protocol Abstract Layer** 是边缘接入与设备协议之间的关键解耦层。
未来新增设备型号或协议版本时，应优先在协议抽象层做扩展，而非侵入云端服务和 API 层。
