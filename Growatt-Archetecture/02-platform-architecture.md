# 平台总体架构

## 3. 平台总体架构说明

平台整体采用以下分层架构：

1. **Ecosystem / Customer Layer**
2. **API Layer**
3. **Cloud Platform Layer**
4. **Edge Connectivity Layer**
5. **Protocol Abstract Layer**
6. **Device Layer**

整体链路为：

```text
Third-party Platform / Customer → API → Cloud → Collector → Protocol → Device
```

该架构的对外价值在于：

- 对外屏蔽底层设备差异
- 通过统一 API 提供稳定接入边界
- 通过云边协同实现统一接入与统一管理
- 在标准化能力与 legacy 兼容之间保持平衡

------

## 4. 企业平台总体架构图（完整总图）

```mermaid
flowchart TB

    USER["Third-party Platform / Customer<br/>EMS / VPP / Partner"]

    subgraph API["API Layer"]
        LEGACY["Legacy API<br/>Token"]
        OPENAPI["OpenAPI<br/>OAuth 2.0"]
    end

    subgraph CLOUD["Cloud Platform Layer"]
        SERVER["Cloud Server"]
        SERVICE["Telemetry / Alarm / Device Service / Control"]
    end

    subgraph EDGE["Edge Connectivity Layer"]
        COLLECTOR["Collector / Gateway"]
        CH04["0x04 Fast Refresh<br/>~1 min"]
        CH03["0x03 Legacy Query<br/>~5 min"]
    end

    subgraph PROTO["Protocol Abstract Layer"]
        VPP["VPP Protocol 2.04<br/>Standardized"]
        RTU["RTU Protocol<br/>Non-standard / Legacy"]
    end

    subgraph DEVICE["Device Layer"]
        XH["XH Series<br/>Hybrid Inverter"]
        XHB["HV Battery<br/>via XH"]

        SPH["SPH Series<br/>Hybrid Inverter"]
        SPHB["LV Battery<br/>via SPH"]

        X["X Series<br/>PV Inverter"]

        SPF["SPF Series<br/>Off-line Inverter"]
        SPFB["LV Battery<br/>via SPF"]
    end

    USER --> LEGACY
    USER --> OPENAPI

    LEGACY --> SERVER
    OPENAPI --> SERVER
    SERVER --> SERVICE

    SERVICE --> CH04
    SERVICE --> CH03
    CH04 --> COLLECTOR
    CH03 --> COLLECTOR

    COLLECTOR --> VPP
    COLLECTOR --> RTU

    VPP --> XH
    VPP --> SPH
    VPP --> X

    RTU --> SPF

    XH --> XHB
    SPH --> SPHB
    SPF --> SPFB
```
