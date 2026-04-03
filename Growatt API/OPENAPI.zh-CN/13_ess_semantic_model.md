# Growatt ESS 语义模型与调度规范

**版本**: v1.0  
**状态**: Public Standard  
**范围**: Growatt Unified OpenAPI / EMS 中与 VPP 相关的运行时遥测语义与调度校验  
**面向对象**: 集成方、方案架构师、校验团队与实施团队

---

# 1. 概述

本规范定义了面向 VPP 的公开运行时语义模型，将以下几个层面绑定在一起：

* **拓扑（能量流路径）**
* **遥测（公开运行时 payload 字段）**
* **语义解释（SPx）**
* **调度命令**
* **校验标准**

本附录中的遥测范围聚焦于当前已发布 payload 中与 VPP 相关的子集，来源如下：

* `08_api_device_data.md`
* `09_api_device_push.md`

`07_api_device_info.md` 中的静态能力元数据不属于本运行时遥测目录。

本次修订的规范化拓扑范围仅包含 `Hybrid` 与 `AC-Couple`。`PV Only` 与 `Battery Only` 仍保留为后续扩展。

---

# 2. 核心原则

## 2.1 分层

| 层 | 说明 |
| --- | --- |
| Topology | 物理能量路径 |
| Telemetry | 与 VPP 相关的公开运行时 payload 字段 |
| Semantic | 核心信号的解释规则 |
| Dispatch | 控制命令与约束 |
| Validation | Pass/Fail 判定逻辑 |

---

## 2.2 关键规则

> 图中的能量箭头表示“可能存在的功率路径”，而不是实时方向。  
> 实际方向由运行时遥测值结合 SPx 规则解释得出。

---

# 3. 可视化标准（Mermaid SSOT）

```mermaid
flowchart LR

    AssetA["物理资产"]
    AssetB["连接资产"]
    SemanticNode("SPx 语义规则")
    DispatchNode["调度命令"]

classDef asset fill:#ffffff,stroke:#333,stroke-width:1.5px;
classDef semantic fill:#e6f3ff,stroke:#1f78b4,stroke-width:2px,stroke-dasharray: 5 5;
classDef dispatch fill:#fff7e6,stroke:#d48806,stroke-width:2px,stroke-dasharray: 4 3;

    AssetA -->|"可能的能量路径"| AssetB
    AssetA -.->|"由其解释"| SemanticNode
    DispatchNode -.->|"作用目标"| AssetB

    class AssetA,AssetB asset;
    class SemanticNode semantic;
    class DispatchNode dispatch;
```

---

# 4. 拓扑 + 语义 + 调度模型

本次修订仅定义两个规范化的公开拓扑：`Hybrid` 与 `AC-Couple`。在其公开运行时 payload 覆盖范围单独定义之前，`PV Only` 与 `Battery Only` 暂不纳入规范模型。

## 4.1 `Hybrid` 拓扑

```mermaid
flowchart LR

    classDef asset fill:#ffffff,stroke:#333,stroke-width:1.5px;
    classDef semantic fill:#e6f3ff,stroke:#1f78b4,stroke-width:2px,stroke-dasharray: 5 5;
    classDef dispatch fill:#fff7e6,stroke:#d48806,stroke-width:2px,stroke-dasharray: 4 3;

    PV["PV"]
    Battery["电池"]
    Inverter["混合逆变器"]
    GridMeter["电网表"]
    Load["负载"]
    Grid["电网"]

    PV --> Inverter
    Battery <--> Inverter
    Inverter --> Load
    Inverter <--> GridMeter
    GridMeter <--> Grid

    SP1("SP1: batPower 符号")
    SP2("SP2: meterPower 符号")
    SP3("SP3: Hybrid ppv")
    SP4("SP4: payLoadPower / smartLoadPower")
    SP7("SP7: anti_backflow")

    Battery -.-> SP1
    GridMeter -.-> SP2
    PV -.-> SP3
    Load -.-> SP4
    GridMeter -.-> SP7

    D1["调度: 充电 / 放电"]
    D2["调度: Export Limit"]

    D1 -.-> Battery
    D2 -.-> GridMeter

    class PV,Battery,Inverter,GridMeter,Load,Grid asset;
    class SP1,SP2,SP3,SP4,SP7 semantic;
    class D1,D2 dispatch;
```

在 `Hybrid` 拓扑中，`ppv` 仍是公开的核心 PV 源信号；`meterPower` 与 `anti_backflow` 则锚定在逆变器交流侧与公用电网之间的专用电网表边界。

## 4.2 `AC-Couple` 拓扑

```mermaid
flowchart LR

    classDef asset fill:#ffffff,stroke:#333,stroke-width:1.5px;
    classDef semantic fill:#e6f3ff,stroke:#1f78b4,stroke-width:2px,stroke-dasharray: 5 5;
    classDef dispatch fill:#fff7e6,stroke:#d48806,stroke-width:2px,stroke-dasharray: 4 3;

    PV["PV 阵列"]
    PVInverter["PV 逆变器"]
    GenerationMeter["发电表"]
    ACBus["交流母线"]
    ACInverter["AC-Couple 逆变器"]
    Battery["电池"]
    GridMeter["电网表"]
    Load["负载"]
    Grid["电网"]

    PV --> PVInverter
    PVInverter --> GenerationMeter
    GenerationMeter --> ACBus
    ACBus <--> ACInverter
    ACInverter <--> Battery
    ACBus --> Load
    ACBus <--> GridMeter
    GridMeter <--> Grid

    SP1("SP1: batPower 符号")
    SP2("SP2: meterPower 符号")
    SP4("SP4: payLoadPower / smartLoadPower")
    SP7("SP7: anti_backflow")
    SP8("SP8: genPower")

    Battery -.-> SP1
    GridMeter -.-> SP2
    Load -.-> SP4
    GridMeter -.-> SP7
    GenerationMeter -.-> SP8

    D1["调度: 充电 / 放电"]
    D2["调度: Export Limit"]

    D1 -.-> Battery
    D2 -.-> GridMeter

    class PV,PVInverter,GenerationMeter,ACBus,ACInverter,Battery,GridMeter,Load,Grid asset;
    class SP1,SP2,SP4,SP7,SP8 semantic;
    class D1,D2 dispatch;
```

在 `AC-Couple` 拓扑中，需要区分两个公开计量边界：

* `Grid Meter`（电网表）：绑定 `meterPower`、`etoUser*`、`etoGrid*` 与 `anti_backflow`
* `Generation Meter`（发电表）：绑定 `genPower`

如果 `AC-Couple` payload 中上报了 `ppv`，它仍然只是设备本地 PV 遥测的辅助信号，不能替代 `Generation Meter` 边界语义。

---

# 5. 语义系统（SPx）

## 5.1 定义

| SPx | 名称 | 字段 | 目标 | 拓扑 |
| --- | --- | --- | --- | --- |
| SP1 | 电池功率符号 | `batPower` | Battery | Hybrid, AC Couple |
| SP2 | 电网表交换符号 | `meterPower` | Grid Meter | Hybrid, AC Couple |
| SP3 | Hybrid PV 源功率 | `ppv` | PV Source | Hybrid core; AC Couple optional |
| SP4 | 负载功率 | `payLoadPower`, `smartLoadPower` | Load | Hybrid, AC Couple |
| SP5 | SOC | `batteryList[].soc` | Battery Pack | Hybrid, AC Couple |
| SP6 | SOH | `batteryList[].soh` | Battery Pack | Hybrid, AC Couple |
| SP7 | Export Limit | `anti_backflow` (control parameter) | Grid Meter | Hybrid, AC Couple |
| SP8 | 发电表功率 | `genPower` | Generation Meter | AC Couple only |

---

## 5.2 符号约定

### SP1 - 电池功率

| 值 | 含义 |
| --- | --- |
| >0 | 充电 |
| <0 | 放电 |

---

### SP2 - 电网表交换功率

| 值 | 含义 |
| --- | --- |
| >0 | 电网取电 |
| <0 | 向电网送电 |

`meterPower` 在站点交流侧与公用电网之间的电网表边界上解释。

---

### SP3 / SP4 / SP8

| 字段 | 规则 |
| --- | --- |
| `ppv` | `>= 0`；在 `Hybrid` 中是核心 PV 源信号，在 `AC-Couple` 中若上报则为可选辅助遥测 |
| `payLoadPower` | `>= 0` |
| `smartLoadPower` | 上报时应满足 `>= 0` |
| `genPower` | 上报时应满足 `>= 0`；表示 `AC-Couple` 的发电表功率，不带取电/送电方向语义 |

本附录中的 `genPower` 仅作为观测遥测使用，不定义公开调度目标，也不承担送电方向符号语义。

---

### SP5 / SP6

| 字段 | 规则 |
| --- | --- |
| `batteryList[].soc` | `[0,100]` |
| `batteryList[].soh` | `[0,100]` |

---

### SP7

`anti_backflow` 仍是锚定在 `Grid Meter` 边界上的调度/控制语义，不作为本附录中的运行时遥测字段处理。

---

# 6. 运行时遥测模型

## 6.1 核心语义信号映射

| 公开信号 | 字段 | 规则 | 单位 | Payload | 拓扑 |
| --- | --- | --- | --- | --- | --- |
| 电池功率 | `batPower` | >0 充电，<0 放电 | `W` | Query, Push | Hybrid, AC Couple |
| 电网表交换功率 | `meterPower` | 在电网表边界，>0 取电，<0 送电 | `W` | Query, Push | Hybrid, AC Couple |
| Hybrid PV 源功率 | `ppv` | >= 0；在 `Hybrid` 中为核心信号，在 `AC-Couple` 中若上报则为辅助信号 | `W` | Query, Push | Hybrid core; AC Couple optional |
| 发电表功率 | `genPower` | 在发电表边界上报时应满足 >= 0 | `W` | Query, Push | AC Couple |
| 负载功率 | `payLoadPower` | 站点计算负载 | `W` | Query, Push | Hybrid, AC Couple |
| Smart Load 负载功率 | `smartLoadPower` | 存在时表示辅助负载通道 | `W` | Query, Push | Hybrid, AC Couple |
| 电池 SOC | `batteryList[].soc` | 单 pack SOC | `%` | Query, Push | Hybrid, AC Couple |
| 电池 SOH | `batteryList[].soh` | 单 pack SOH | `%` | Query, Push | Hybrid, AC Couple |
| Export Limit | `anti_backflow` | 仅控制用的电网表送电约束 | Control parameter | Dispatch | Hybrid, AC Couple |

---

## 6.2 遥测块关系

```mermaid
flowchart LR

    classDef block fill:#ffffff,stroke:#333,stroke-width:1.5px;
    classDef semantic fill:#e6f3ff,stroke:#1f78b4,stroke-width:2px,stroke-dasharray: 5 5;
    classDef dispatch fill:#fff7e6,stroke:#d48806,stroke-width:2px,stroke-dasharray: 4 3;

    Meta["身份与时间<br/>deviceSn, utcTime, dataType"]
    GridMeterBlock["电网表边界<br/>meterPower, etoUser*, etoGrid*"]
    GenerationMeterBlock["发电表边界<br/>genPower"]
    Electrical["电气质量<br/>reactivePower, fac, vac1-3"]
    PVBlock["PV 源 / 发电<br/>ppv, epvTotal"]
    SiteBlock["站点 / 输出功率<br/>pac, payLoadPower, smartLoadPower"]
    BatteryAgg["电池聚合<br/>batPower, batteryStatus"]
    BatteryPack["电池包明细<br/>batteryList[] metrics"]
    Runtime["运行模式<br/>status, priority"]
    Fault["故障 / 保护<br/>fault*, protect*"]

    SP1("SP1: batPower 符号")
    SP2("SP2: meterPower 符号")
    SP3("SP3: Hybrid ppv")
    SP4("SP4: payLoadPower / smartLoadPower")
    SP5("SP5: batteryList[].soc")
    SP6("SP6: batteryList[].soh")
    SP8("SP8: genPower")
    Dispatch["调度 / 控制<br/>deviceDispatch, anti_backflow"]

    Meta --> GridMeterBlock
    Meta --> GenerationMeterBlock
    Meta --> Electrical
    Meta --> PVBlock
    Meta --> SiteBlock
    Meta --> BatteryAgg
    Meta --> BatteryPack
    Meta --> Runtime
    Meta --> Fault

    GridMeterBlock -.-> SP2
    GenerationMeterBlock -.-> SP8
    PVBlock -.-> SP3
    SiteBlock -.-> SP4
    BatteryAgg -.-> SP1
    BatteryPack -.-> SP5
    BatteryPack -.-> SP6
    Dispatch -.-> BatteryAgg
    Dispatch -.-> GridMeterBlock

    class Meta,GridMeterBlock,GenerationMeterBlock,Electrical,PVBlock,SiteBlock,BatteryAgg,BatteryPack,Runtime,Fault block;
    class SP1,SP2,SP3,SP4,SP5,SP6,SP8 semantic;
    class Dispatch dispatch;
```

`Generation Meter Boundary` 仅适用于 `AC-Couple`。`PV Source / Generation` 在 `Hybrid` 中仍是核心语义块，在 `AC-Couple` 中则是 `ppv` 上报时才启用的可选辅助块。

---

## 6.3 单位归一化

| 类别 | 字段 | 单位 |
| --- | --- | --- |
| 功率 | `meterPower`, `genPower`, `batPower`, `ppv`, `pac`, `payLoadPower`, `smartLoadPower`, `batteryList[].chargePower`, `batteryList[].dischargePower` | `W` |
| 电量 | `etoUserToday`, `etoUserTotal`, `etoGridToday`, `etoGridTotal`, `epvTotal`, `batteryList[].echargeToday`, `batteryList[].echargeTotal`, `batteryList[].edischargeToday`, `batteryList[].edischargeTotal` | `kWh` |
| 电压 | `vac1`, `vac2`, `vac3`, `batteryList[].vbat` | `V` |
| 频率 | `fac` | `Hz` |
| 百分比 | `batteryList[].soc`, `batteryList[].soh` | `%` |
| 电流 | `batteryList[].ibat` | `A` |
| 代码 / 枚举 | `status`, `priority`, `batteryStatus`, `batteryList[].status`, `faultCode`, `faultSubCode`, `protectCode`, `protectSubCode`, `dataType` | Code / enum |

`reactivePower` 继续保持 vendor payload 的现有形式与公开符号说明；本附录不重新定义其单位。

---

## 6.4 遥测块目录

### 身份与时间

| 字段 | Payload | 说明 |
| --- | --- | --- |
| `deviceSn` | Query, Push | 设备序列号 |
| `utcTime` | Query, Push | UTC 时间戳，格式为 `yyyy-MM-dd HH:mm:ss` |
| `dataType` | Push | 推送包络类型，公开固定值为 `dfcData` |

### 电网表边界

| 字段 | Payload | 说明 |
| --- | --- | --- |
| `meterPower` | Query, Push | 电网表边界上的电网表功率。正值表示电网取电，负值表示向电网送电 |
| `etoUserToday` | Query, Push | 当日电网表边界取电电量 |
| `etoUserTotal` | Query, Push | 累计电网表边界取电电量 |
| `etoGridToday` | Query, Push | 当日电网表边界送电电量 |
| `etoGridTotal` | Query, Push | 累计电网表边界送电电量 |

### 发电表边界

| 字段 | Payload | 说明 |
| --- | --- | --- |
| `genPower` | Query, Push | `AC-Couple` 拓扑下的发电表功率。应视为非负的发电边界功率量值，而不是电网取电/送电符号字段 |

### 电气质量

| 字段 | Payload | 说明 |
| --- | --- | --- |
| `reactivePower` | Query, Push | 保留当前文档中关于容性/感性符号说明的无功功率值 |
| `fac` | Query, Push | 电网频率 |
| `vac1` | Query, Push | 线电压 1 |
| `vac2` | Query, Push | 线电压 2 |
| `vac3` | Query, Push | 线电压 3 |

### PV 源 / 发电

| 字段 | Payload | 说明 |
| --- | --- | --- |
| `ppv` | Query, Push | 设备本地 PV 源功率。在 `Hybrid` 中为核心信号；在 `AC-Couple` 中若上报则为辅助信号 |
| `epvTotal` | Query, Push | PV 累计发电量 |

### 站点 / 输出功率

| 字段 | Payload | 说明 |
| --- | --- | --- |
| `pac` | Query, Push | 交流输出功率 |
| `payLoadPower` | Query, Push | 计算得到的总负载功率 |
| `smartLoadPower` | Query, Push | 设备上报独立 smart-load 通道时的 Smart Load 负载功率 |

### 电池聚合

| 字段 | Payload | 说明 |
| --- | --- | --- |
| `batPower` | Query, Push | 聚合电池充放电功率。正值表示充电，负值表示放电 |
| `batteryStatus` | Query, Push | 电池总体状态码 |

### 电池包明细

| 字段 | Payload | 说明 |
| --- | --- | --- |
| `batteryList[].index` | Query, Push | 电池包索引，从 1 开始 |
| `batteryList[].soc` | Query, Push | 单 pack 电池 SOC |
| `batteryList[].chargePower` | Query, Push | 单 pack 充电功率 |
| `batteryList[].dischargePower` | Query, Push | 单 pack 放电功率 |
| `batteryList[].ibat` | Query, Push | 低压侧电池电流 |
| `batteryList[].vbat` | Query, Push | 低压侧电池电压 |
| `batteryList[].soh` | Query, Push | 单 pack 电池 SOH |
| `batteryList[].status` | Query, Push | 上报时的单 pack 状态码 |
| `batteryList[].echargeToday` | Query, Push | 当日充电电量 |
| `batteryList[].echargeTotal` | Query, Push | 累计充电电量 |
| `batteryList[].edischargeToday` | Query, Push | 当日放电电量 |
| `batteryList[].edischargeTotal` | Query, Push | 累计放电电量 |

### 运行模式

| 字段 | Payload | 说明 |
| --- | --- | --- |
| `status` | Query, Push | 设备运行状态码 |
| `priority` | Query, Push | 运行优先级代码 |

### 故障 / 保护

| 字段 | Payload | 说明 |
| --- | --- | --- |
| `faultCode` | Query, Push | 故障主码 |
| `faultSubCode` | Query, Push | 故障子码 |
| `protectCode` | Query, Push | 保护主码 |
| `protectSubCode` | Query, Push | 保护子码 |

---

# 7. 调度模型

## 7.1 类型

| 调度 | 目标 |
| --- | --- |
| Charge | Battery |
| Discharge | Battery |
| Export Limit | Grid Meter |
| Mode | Inverter |

---

## 7.2 映射

| 调度 | 观测运行时字段 | 控制字段 |
| --- | --- | --- |
| Charge | `batPower`, `batteryList[].soc` | `time_slot_charge_discharge`, `duration_and_power_charge_discharge` |
| Discharge | `batPower`, `batteryList[].soc` | `time_slot_charge_discharge`, `duration_and_power_charge_discharge` |
| Export Limit | `meterPower`, `etoGridToday`, `etoGridTotal` | `anti_backflow` |
| Mode | `status`, `priority`, power blocks | 具体实现相关的 setType |

在本次修订中，`genPower` 仅用于 `AC-Couple` 校验观测，不映射到公开调度/控制字段。

---

# 8. 遥测适用性矩阵

## 8.1 拓扑覆盖

| 块 | Hybrid | AC Couple |
| --- | --- | --- |
| 身份与时间 | Core | Core |
| 电网表边界 | Core | Core |
| 发电表边界 | N/A | Core |
| 电气质量 | Core | Core |
| PV 源 / 发电 | Core | Optional |
| 站点 / 输出功率 | Core | Core |
| 电池聚合 | Core | Core |
| 电池包明细 | Core | Core |
| 运行模式 | Core | Core |
| 故障 / 保护 | Core | Core |

---

## 8.2 说明

* `smartLoadPower` 为可选字段，仅在公开 payload 上报独立 smart-load 通道时出现。
* `ppv` 在 `Hybrid` 中仍是核心 PV 源语义信号。
* 在 `AC-Couple` 中，`genPower` 是首要的公开发电表边界信号，而 `ppv` 在出现时仍然只是辅助信号。
* `PV Only` 与 `Battery Only` 不在本次规范范围内，保留为未来扩展。

---

# 9. 调度校验框架

## 9.1 校验层

| 层 | 检查点 |
| --- | --- |
| Command | accepted |
| Telemetry | changed |
| Semantic | sign / boundary 正确 |
| Behavior | 在观测窗口内保持一致 |

---

# 10. 校验规则

## 10.1 充电

**期望**

* `batPower` > 0
* `batteryList[].soc` 在观测窗口内单调不减

**Pass**

```text
batPower remains positive and batteryList[].soc does not trend downward
```

---

## 10.2 放电

**期望**

* `batPower` < 0
* `batteryList[].soc` 在观测窗口内单调不增

---

## 10.3 Export Limit

**期望**

* `meterPower` 在送电方向上保持在已配置的导出边界以内
* 在 Export Limit 生效时，`meterPower` 在电网表边界上不应比配置的导出限制更负

---

# 11. 验收标准

## 11.1 通用

| 项目 | 要求 |
| --- | --- |
| Ack | < 5s |
| First response | <= 1 cycle |
| Stable window | 2-5 cycles |

---

## 11.2 容差

| 指标 | 值 |
| --- | --- |
| 功率容差 | +/-3% |
| 稳定时间 | 30-120s |

---

## 11.3 结果

| 结果 | 条件 |
| --- | --- |
| Pass | 所有必需层均满足 |
| Fail | 存在不匹配 |
| Pending | 数据不足 |

---

# 12. 失败码

| 代码 | 含义 |
| --- | --- |
| V001 | No ack |
| V002 | No telemetry |
| V003 | Wrong sign |
| V004 | Unstable |
| V005 | Limit not enforced |
| V006 | Insufficient window |
| V007 | Conflicting conditions |

---

# 13. 校验流程

```mermaid
flowchart TD

    A["调度"]
    B["Ack"]
    C["遥测块"]
    D["SPx 解释"]
    E["校验"]

    A --> B --> C --> D --> E
```

---

# 14. 调度校验逻辑

```mermaid
flowchart TD

    Start["调度"]
    Telemetry["遥测窗口"]
    Check1{"batPower 符号是否正确?"}
    Check2{"meterPower 在 Export Limit 下是否满足边界?"}
    Check3{"batteryList[].soc 趋势是否正确?"}
    Pass["PASS"]
    Fail["FAIL"]

    Start --> Telemetry
    Telemetry --> Check1
    Check1 -->|Yes| Check2
    Check1 -->|No| Fail
    Check2 -->|Yes| Check3
    Check2 -->|No| Fail
    Check3 -->|Yes| Pass
    Check3 -->|No| Fail
```

---

# 15. 执行摘要

本规范将 `Hybrid` 与 `AC-Couple` 两类储能拓扑的运行时拓扑、语义、调度与遥测统一到一个公开模型中。  
核心语义信号仅覆盖决定方向与控制逻辑的字段，其余公开遥测则按计量边界或功能块进行编目，从而让每个数据区域的含义都明确可追踪。
