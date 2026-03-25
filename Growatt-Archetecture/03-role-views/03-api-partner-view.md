# API / 第三方接入视图

## 适用场景

- 第三方平台接入前的能力沟通
- API 边界与职责说明
- 生态合作伙伴的对接准备
- 接口集成方案评估

## 适合谁看

- 第三方平台
- EMS 平台
- VPP 平台
- 生态合作伙伴
- 接口集成人员

## 关注重点

- 接口边界
- 接入方式
- 底层复杂度是否被平台吸收

## 视图图示

```mermaid
flowchart TB

    PARTNER["EMS / VPP / Partner"]

    subgraph API["Northbound API"]
        LEGACY["Legacy API<br/>Token"]
        OPENAPI["OpenAPI<br/>OAuth 2.0"]
    end

    PLATFORM["Cloud Platform"]

    INTERNAL["Internal Device Connectivity<br/>Collector + Protocol Abstraction"]

    DEVICE["Managed Device Fleet<br/>XH / SPH / X / SPF"]

    PARTNER --> LEGACY
    PARTNER --> OPENAPI
    LEGACY --> PLATFORM
    OPENAPI --> PLATFORM
    PLATFORM --> INTERNAL
    INTERNAL --> DEVICE
```

## 视图解读

对于第三方平台而言，主要关注 **Legacy API** 与 **OpenAPI** 即可。
设备协议差异、采集器实现细节、VPP/RTU 兼容性均由平台内部吸收。
平台对外提供的是统一接入边界，而非设备协议细节。
