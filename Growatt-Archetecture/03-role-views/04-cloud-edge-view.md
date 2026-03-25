# 云边通信视图

## 5.4 云边通信视图

### 适用对象

- 系统集成方
- 技术沟通对象
- 平台与设备连接方案相关团队

### 关注重点

- 云端与采集器之间的链路类型
- 快速刷新与 legacy 查询的区分

### 云边通信视图图示

```mermaid
flowchart LR

    SERVER["Cloud Server"]
    COLLECTOR["Collector / Gateway"]

    SERVER <-->|0x04 Fast Refresh<br/>~1 min| COLLECTOR
    SERVER <-.->|0x03 Legacy Query<br/>~5 min| COLLECTOR
```

### 云边通信解读

当前北向通信链路分为两类：

- `0x04`：高频快速刷新链路
- `0x03`：legacy 查询链路

两条链路并存，可在满足较高实时性需求的同时，兼顾历史兼容性。
