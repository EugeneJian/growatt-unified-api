# 02 直连设置（Shinetools 平台）模块解析

[返回总导航](../README.md) · [上一模块：Quick Site Setup](./01-quick-site-setup.md) · [查看来源映射](../01-source-map.md)

## Navigation

- [模块结论](#模块结论)
- [模块边界](#模块边界)
- [现有功能结构](#现有功能结构)
- [Network Configuration and General Setting](#network-configuration-and-general-setting)
- [Quick Setting New](#quick-setting-new)
- [EMS](#ems)
- [Grid Parameter Setting](#grid-parameter-setting)
- [Device Information](#device-information)
- [Advanced Setting](#advanced-setting)
- [其他一级入口](#其他一级入口)
- [交互与依赖](#交互与依赖)
- [三视图差异](#三视图差异)
- [寄存器与标识提示](#寄存器与标识提示)
- [命名和信息架构问题](#命名和信息架构问题)
- [建议的目标导航](#建议的目标导航)
- [待确认问题](#待确认问题)
- [来源追踪](#来源追踪)

## 模块结论

`直连设置（Shinetools 平台）` 不是一个单一设置页面，而是面向调试、投运、合规配置和故障处理的综合工作区。三个新版画板都包含以下八个一级入口：

1. `Network Configuration and General Setting`
2. `Quick Setting(New)`
3. `EMS`
4. `Grid Parameter Setting`
5. `Generator and smart load`
6. `Installation Diagnosis`
7. `Device Information`
8. `Advanced Setting`

**来源事实：** 市场端 MOD XH、市场端 MIN-XH、研发端分别包含 293、277、249 行 M02 大纲。`Grid Parameter Setting` 占 120–135 行，是最大的子模块。

**分析结论：** 当前画板更接近产品重构评审稿，而不是可以直接实现的最终规格。画板大量使用“删除”“重复”“研发确认”“只保留一个”等批注；正式落地前必须先形成保留 / 合并 / 删除决策表。

## 模块边界

### 本模块包含

- 通用参数、拓扑模式、离网设置、干接点和设备开关
- 快速设置入口及其与 M01 的重复关系
- EMS 的完整设置入口
- 电网参数、功率因数和安规保护
- 设备信息、诊断、AFCI、PV 输入模式和高级工具

### 本模块不直接定义

- 任何寄存器的正式功能码、数据类型、单位、比例和适用协议版本
- 被批注为“删除”的节点是否已在产品中下线
- 机型、DTC、地区和权限的完整可见性矩阵
- 高风险写操作的授权、审计和回滚实现

## 现有功能结构

| 一级入口 | MOD XH 行数 | MIN-XH 行数 | 研发端行数 | 当前性质 |
|---|---:|---:|---:|---|
| Network Configuration and General Setting | 42 | 42 | 42 | 通用参数与拓扑设置 |
| Quick Setting(New) | 36 | 36 | 10 | 快速入口，三视图定义不一致 |
| EMS | 32 | 32 | 32 | 能量管理详细设置 |
| Grid Parameter Setting | 135 | 121 | 120 | 合规参数与重复项清理中心 |
| Generator and smart load | 1 | 1 | 1 | XH/HU 隐藏的占位入口 |
| Installation Diagnosis | 1 | 1 | 1 | 未展开的诊断入口 |
| Device Information | 12 | 10 | 9 | 遥测、参数与版本信息 |
| Advanced Setting | 33 | 33 | 33 | AFCI、诊断、基础参数和寄存器工具 |

```text
直连设置（Shinetools 平台）
├─ General Setting
├─ Quick Setting(New)
├─ EMS
├─ Grid Parameter Setting
├─ Generator and smart load
├─ Installation Diagnosis
├─ Device Information
└─ Advanced Setting
```

## Network Configuration and General Setting

来源标题同时包含 `Network Configuration` 和 `General Setting`，并批注“讨论是否简化为 General Setting”。实际子树中 `Network Configuration` 没有展开内容，大部分设置属于通用设备参数。

### 设置结构

| 分组 | 设置项 | 来源事实 | 分析 |
|---|---|---|---|
| Network Configuration | 未展开 | 只有分组名 | 当前不能形成可实现页面 |
| Active Power | Active Power %、Memory Enable | 必须先设置记忆开关，再设置有功功率，记忆才生效 | 存在明确的操作顺序依赖 |
| Off-Grid Setting | SYN Box Enable、Off-Grid Enable、Frequency、Voltage | SYN Box 仅 XH 有，HU 没有；频率为 50/60Hz；电压列出 208/220/230/240V | 应按机型和离网硬件能力动态显示 |
| Retrofit / Parallel | Default、System Retrofit、Multiple machines in parallel | 来源建议将 `Work Mode` 改名为 `Retrofit/Parallel` | 这是安装拓扑模式，不应与 EMS Work Mode 混名 |
| COM Address | `1–254` | 来源给出地址范围 | 需要补充冲突检测和默认值 |
| Reset | Doesn't recover、recover | 建议只保留 recover，并增加恢复出厂设置二次确认 | 属于高影响操作，应明确后果和回滚边界 |
| Dry Contact Control | enable、status、mode、ON/OFF 条件 | 模式包括 Power、Time、Time Power | 结构尚缺完整的单位、范围和 OFF 条件映射 |
| Device basics | Inverter Time、Language、Power OFF/ON | Power OFF/ON 标记为开关 | 应区分普通参数与影响运行状态的操作 |

### 关键分析

1. **标题应简化。** 既然 Network Configuration 没有子项，当前内容更符合 `General Setting`。
2. **Work Mode 存在术语冲突。** 此处的模式是改造 / 并机拓扑；EMS 下的 Work Mode 是 TOU / Backup / Peak Shaving。
3. **Dry Contact 映射可疑。** MOD XH 同时把 `Dry contact enable` 和 `Dry Contact Mode` 标为 `hold662`，需确认是同一复合寄存器还是标注错误。
4. **Reset 需要安全设计。** 画板已经提出二次确认，但仍需明确是否清除通信、安规、EMS 和历史数据。

## Quick Setting New

`Quick Setting(New)` 与 [M01 Quick Site Setup](./01-quick-site-setup.md) 高度重叠，但三个视图对它的定位不一致。

| 视图 | Quick Setting(New) 内容 | 结论 |
|---|---|---|
| 市场端 MOD XH | 36 行，包含完整 EMS 子树 | 与 M01 及本页独立 EMS 重复 |
| 市场端 MIN-XH | 与 MOD XH 逐行一致 | 与 M01 及本页独立 EMS 重复 |
| 研发端 | 10 行，只保留 Work Status、Country、条件模块等概要 | 更像快速入口或导航摘要 |

市场端还补充了离网差异：XH 建议将离网盒使能和离网使能组合为 `Off-Grid Setting`；HU 只有离网使能。该表达与 M01 仅保留离网使能略有不同。

**建议：** `Quick Setting(New)` 不再复制完整 EMS 数据结构，而是复用 M01 的设置项定义，只保留快速流程编排和页面说明。否则同一设置会在 M01、Quick Setting(New) 和独立 EMS 三处维护。

## EMS

独立 `EMS` 子树与 M01 的主体结构一致，但比 M01 多出以下设置：

- `Default Power % after Export Limitation Failure`
- `Export Limitation Failure Time`
- `Power Sensor`：Disable / Electric Meter / CT

它还保留 `Off-grid Enable`，但市场端批注“建议删除，通用设置里面已经有完整的离网设置”。

### 模块关系

| 内容 | M01 Quick Site Setup | M02 Quick Setting(New) | M02 独立 EMS | 建议的唯一归属 |
|---|---|---|---|---|
| Work Mode | 有 | 市场端有，研发端无 | 有 | EMS 设置模型；M01 只编排 |
| Export Limitation | 有基础项 | 市场端复制 | 有完整失败策略 | EMS |
| Power Sensor | 无 | 无 | 有 | EMS |
| Battery Setting | 有 | 市场端复制 | 有 | EMS 设置模型；M01 只编排 |
| Off-Grid | 有 | 有机型差异说明 | 有但建议删除 | General / Off-Grid Setting |

**分析：** 独立 EMS 应作为设置项事实的唯一归属；Quick Site Setup 和 Quick Setting(New) 只定义进入顺序、默认展示和完成条件。

## Grid Parameter Setting

这是 M02 最大且最需要清理的部分。它把当前安规入口、旧保护页面、新 VPP 安规入口和重复曲线功能放在同一层。

### 当前分组和处理意图

| 分组 | 来源批注意图 | 建议分类 |
|---|---|---|
| Country Regulation | 无删除批注 | 保留，作为合规配置上下文 |
| PF Setting | 无删除批注 | 保留，归入功率因数 / 无功设置 |
| 安规参数(新) | “最新版 VPP 协议机型” | 候选的新机型统一入口，但当前未展开 |
| AC Voltage Protection | 删除 | 合并到 Safety Parameters |
| AC Frequency Protection | 删除 | 合并到 Safety Parameters |
| Synchronization Range | 删除 | 合并到并网限制 / Safety Parameters |
| Normal Gradient | 与 Load Drop Rate 重复，删除 | 保留 Safety Parameters 中的规范命名 |
| Frequency/Watt | 与 Overfrequency Derating 重复，删除 | 保留 Safety Parameters 中的规范命名 |
| Voltage/Var | 与 Q(U) Mode 重复，删除 | 统一名称和参数模型后保留一处 |
| Safety Parameters | “相同设置项只保留一个” | 作为旧协议机型的候选统一入口 |
| Wide Operating Voltage Range | 无删除批注 | 保留，但补充枚举 0/1/2 含义 |
| Enale N Linec | 开关按钮 | 名称纠正后评审保留 |
| RRCR Enable | 与 DRMS 的地区表达待统一 | 按国家法规动态显示 RRCR 或 DRMS |
| PU Enable | 删除 | 删除候选 |
| Voltage Detection between N to PE | 无说明 | 待确认用途、机型和数据类型 |
| P(U)Enable | 重复，删除 | 合并到 Safety Parameters / P(U)Function |
| Inverter Protection | 删除，重复项只保留一个 | 将 P(U) / Q(v) 合并到统一安规模型 |

### PF Setting

来源包含以下路径：

- Set PF as 1
- Inductive Reactive Power %
- Capacitive Reactive Power %
- Inductive PF / Capacitive PF
- PF Curve In / Out Vac
- 四组 Custom PF Curve 点，每组包含 PF Limit 与 Load Percentage

**分析：** 当前分支混合“固定功率因数”“固定无功百分比”和“自定义 PF 曲线”三种互斥或条件模式。正式页面应先选控制模式，再显示对应参数，避免把所有字段同时铺开。

### Safety Parameters

MOD XH 对 Safety Parameters 展开最完整，包含：

- Grid Connection Restriction
- Load Drop Rate、10 Minutes Protection
- 三阶段欠压 / 过压 / 欠频 / 过频
- P(U)Function、Q(U)Mode
- Voltage Ride Through
- Overfrequency Derating、Underfrequency Increasing
- ROCOF、DCI
- Active Power Control、Reactive power mode

MIN-XH 与研发端保留相同分组名，但没有展开阶段保护的具体子项和寄存器提示。

### 清理结论

1. `安规参数(新)` 与 `Safety Parameters` 可能分别服务新版 VPP 机型和旧协议机型，不能在缺少适用范围时强行合并。
2. 标有删除的旧页面应先映射到统一 Safety 字段，再下线 UI；不能只删除入口而丢失设备能力。
3. P(U)、Q(U)、Q(v)、Voltage/Var 的命名与曲线模型需要统一术语表。
4. RRCR / DRMS 应由 Country Regulation 决定显示名称和适用规则，而不是两个独立的全局开关。

## Device Information

### 公共结构

- PV Voltage/Current
- String Volt/Current
- AC Volt/Current/Power/Freq
- Off-grid Parameter
- Battery Parameter
- Internal Parameter
- About Inverter
- Version Upgrade

### 视图差异

| 内容 | MOD XH | MIN-XH | 研发端 | 结论 |
|---|---|---|---|---|
| PV Voltage/Current | `input3–17` | 无标识 | 无标识 | 映射待确认 |
| AC 信息 | `input37–48` | 无标识 | 无标识 | 映射待确认 |
| String 参数 | 标注 XH/HU 没有，应删除 | 标注 XH/HU 没有组串参数，应删除 | 无删除批注 | 需要以机型能力为准动态显示 |
| 离网盒参数 | XH 原本有但当前遗漏；HU 不需要；展开 `hold3020` 和 `input3279–3324` | 记录“原本就有”但未展开 | 未单列 | XH/HU 不能共用静态页面清单 |

**分析：** Device Information 应由设备能力描述驱动，而不是仅靠页面版本区分。`Version Upgrade` 是操作入口，不属于纯信息展示，建议单列为设备维护。

## Advanced Setting

### 功能分组

| 分组 | 内容 | 分析 |
|---|---|---|
| AFCI | Enable、Self-Test、Reset、三组阈值、FFT 累计次数、Curve Scan | 混合开关、测试、复位和工程阈值，应按权限分层 |
| PV Input Mode | Independent MPPT、DC Source、Parallel MPPT | 拓扑模式选择，需防止与实际接线不一致 |
| Smart Diagnosis | I-V Curve Scan、异常波形、实时波形、One-Click Diagnosis | 诊断任务与记录查看应分开 |
| Anti-islanding Protection | 开关 | 属于安全 / 合规能力，权限和地区约束待确认 |
| Basic Parameters | Baud Rate、Clear History、Model Setting、PV Voltage、Modbus Version | 来源已提出多项删除或重归类建议 |
| Register Setting | Command Type、Register Address、Length/Data | 专家级原始寄存器操作入口 |

### Basic Parameters 清理

- `PV Voltage`：来源明确标注删除。
- `Modbus Version`：市场端建议删除。
- `Baud Rate Selection`：存在争议。设备升级后若 485 波特率未恢复，可用它修复；市场端同时认为 XH 页面可删除。
- `Clear History`、`Model Setting`：需要确认操作后果、权限和机型范围。

### Register Setting 风险

**分析：** 原始命令类型、寄存器地址和数据输入允许绕过正常设置项约束。若保留，至少需要：

1. 专家权限和设备范围限制
2. 地址白名单或危险地址黑名单
3. 数据长度、类型和范围校验
4. 操作前确认、操作日志和结果回读
5. 与正式设置项页面分离

画板没有提供这些安全约束，因此当前只能将其视为待设计的工程工具。

## 其他一级入口

| 入口 | 来源事实 | 当前结论 |
|---|---|---|
| Generator and smart load | `XH/HU不显示`，没有子项 | 对 XH/HU 隐藏；其他机型内容待补 |
| Installation Diagnosis | 市场端 MOD XH 标注 `hold52007`，没有子项 | 只有入口和映射提示，无法形成诊断规格 |

## 交互与依赖

### 来源直接支持

1. Active Power 的 Memory Enable 必须先开启，记忆设置才生效。
2. SYN Box Enable 仅 XH 有，HU 没有。
3. Off-grid Frequency 为 50/60Hz，Voltage 列出 208/220/230/240V。
4. Reset 建议只保留 recover，并提供二次确认。
5. Country Regulation 与 RRCR / DRMS 的显示存在地区关系。
6. Generator、Smart Load 对 XH/HU 隐藏。

### 分析建议

1. `Country Regulation` 应先于 Grid Parameter 子项加载，用于决定地区安规和 RRCR / DRMS 表达。
2. `Retrofit/Parallel` 模式应决定 SYN Box、并机数量和 COM Address 的可见性。
3. Dry Contact Mode 应决定 Power、Time 和 Time Power 参数组。
4. Quick Setting、EMS 与 General Setting 应引用同一设置项模型，避免复制。
5. Register Setting 不应进入普通用户导航。

## 三视图差异

| 对比项 | 市场端 MOD XH | 市场端 MIN-XH | 研发端 |
|---|---|---|---|
| M02 大纲行数 | 293 | 277 | 249 |
| 一级模块 | 8 个 | 8 个 | 8 个 |
| `holdNN` / `inputN` | 69 个唯一提示 | 基本不带提示 | 基本不带提示 |
| Quick Setting(New) | 含完整 EMS | 含完整 EMS | 不含 EMS，仅 10 行摘要 |
| Grid Parameter | 安规阶段和寄存器展开最完整 | 多数分组存在但子项扁平 | P(U) 被放在 Inverter Protection 下，缺少“安规参数(新)”占位 |
| Device Information | 含离网盒子项和输入范围 | 有删除批注但未展开映射 | 只有通用信息树 |
| Advanced Setting | 映射最完整 | 与 MOD 同结构、无映射 | 同结构，删除理由更简略 |

## 寄存器与标识提示

MOD XH 的 M02 子树共出现 76 次、69 个唯一 `holdNN` / `inputN` 提示。它们仍是来源线索，不是已确认协议映射。

### General Setting

| 设置 | 提示 |
|---|---|
| Active Power % / Memory Enable | `hold3` / `hold2` |
| SYN Box / Off-Grid Enable | `hold3020` / `hold3079` |
| Off-grid Voltage / Frequency | `hold3080` / `hold3081` |
| Retrofit / Parallel | `hold30118` |
| COM Address / Reset | `hold30` / `hold33` |
| Dry Contact Enable / Mode / Status | `hold662` / `hold662` / `input3119` |
| Dry Contact power / delay / duration | `hold3017` / `hold664` / `hold665` |
| Inverter Time / Language / Power | `hold45–50` / `hold15` / `hold0` |

### Grid Parameter

| 设置组 | 提示 |
|---|---|
| Country / PF Mode | `hold90` / `hold2001` |
| Reactive Power / Memory / PF | `hold4` / `hold2` / `hold5` |
| PF Curve In/Out | `hold628–631` |
| Grid connection points | `hold64–65` |
| Three-stage voltage/frequency | `hold52–63` |
| Load Drop / 10 Minutes | `hold633` / `hold634` |
| P(U) / Voltage Ride Through | `hold641` / `hold636–637` |
| Over/Under frequency | `hold638` / `hold334` |
| ROCOF / DCI | `hold642` / `hold632` |
| Active / Reactive / Q(U) | `hold3` / `hold89` / `hold159` |
| Wide Voltage / N Line / RRCR | `hold236` / `hold232` / `hold640` |

### Device and Advanced

| 设置组 | 提示 |
|---|---|
| PV / AC information | `input3–17` / `input37–48` |
| Off-grid box | `hold3020`、`input3279–3324` |
| Installation Diagnosis | `hold52007` |
| AFCI | `hold541–548` |
| PV Input Mode | `hold399` |
| Smart Diagnosis | `hold250`、`hold259`、`hold260`、`hold265–266` |
| Anti-islanding | `hold230` |
| Clear History / Model Setting | `hold32` / `hold118–121` |

## 命名和信息架构问题

### 同名冲突

- `Work Mode` 同时表示 EMS 运行策略和 Retrofit / Parallel 安装拓扑。
- `Off-Grid` 同时出现在 General Setting、Quick Setting 和 EMS。
- P(U)、Q(U)、Q(v)、Voltage/Var 存在重叠表达。

### 来源拼写问题

- `Off-Grid Paramater Setting`
- `Off-Grid Frequncy`
- `Capactive Reactive Power`
- `Enale N Linec`
- `Smart I-V Curve Sc`
- `Mointoring`

这些名称不应直接成为稳定 `setting_key`。显示名称修正与协议键名应分开评审。

## 建议的目标导航

下面是基于当前来源的分析建议，不是已确认产品规格：

```text
Direct Settings
├─ General
│  ├─ Active Power
│  ├─ Installation Topology
│  ├─ Off-Grid / SYN Box
│  ├─ Communication
│  ├─ Dry Contact
│  └─ Device Operations
├─ Quick Setup
│  └─ 引用 M01 流程，不复制设置定义
├─ EMS
│  ├─ Work Mode
│  ├─ Export Limitation
│  ├─ Power Sensor
│  └─ Battery
├─ Grid & Compliance
│  ├─ Country Regulation
│  ├─ PF / Reactive Power
│  ├─ Safety Parameters by protocol/model
│  └─ Regional Signals (RRCR / DRMS)
├─ Diagnostics
├─ Device Information
├─ Advanced
└─ Expert Tools
   └─ Register Setting
```

该导航的核心是：设置项定义只有一份，Quick Setup 只编排流程；合规参数按协议和机型选择；专家工具与普通设置隔离。

## 待确认问题

| ID | 问题 | 需要的确认方 | 影响 |
|---|---|---|---|
| DSP-01 | `Network Configuration` 是否有遗漏子项，还是应从标题删除？ | 产品 | 一级导航命名 |
| DSP-02 | Retrofit / Parallel 的 `hold30118` 和三个枚举值是否准确？ | 协议 / 固件 | 安装拓扑模型 |
| DSP-03 | Reset 的 recover 会清除哪些参数？是否可回滚？ | 固件 / 产品 | 高风险操作设计 |
| DSP-04 | Dry Contact Enable 与 Mode 都标 `hold662` 是否正确？ | 协议 / 固件 | 数据映射 |
| DSP-05 | Quick Setting(New) 应采用市场端完整 EMS，还是研发端摘要结构？ | 产品 | 重复数据和导航 |
| DSP-06 | 独立 EMS 中的 Off-grid 是否正式删除并归入 General Setting？ | 产品 | 设置项唯一归属 |
| DSP-07 | `安规参数(新)` 的完整字段、VPP 版本和适用机型是什么？ | 协议 / 产品 | 新旧安规入口分流 |
| DSP-08 | 标注“删除”的保护页面是否已完成字段迁移和产品下线？ | 产品 / 研发 | 防止能力丢失 |
| DSP-09 | P(U)、Q(U)、Q(v)、Voltage/Var 的标准名称和唯一数据模型是什么？ | 协议 / 产品 | 术语和曲线配置 |
| DSP-10 | RRCR 与 DRMS 的地区、法规和互斥规则是什么？ | 合规 / 产品 | 条件显示 |
| DSP-11 | Grid Protection 各参数的单位、范围、默认值和阶段关系是什么？ | 协议 | 输入校验 |
| DSP-12 | XH/HU 是否都没有 String 参数？离网盒参数对 XH/HU 的准确差异是什么？ | 设备 / 固件 | Device Information 能力矩阵 |
| DSP-13 | Baud Rate Selection 删除后，升级异常的 485 波特率如何恢复？ | 研发 / 运维 | 维护路径 |
| DSP-14 | Register Setting 的权限、地址限制、审计和回读策略是什么？ | 安全 / 研发 | 高风险专家工具 |
| DSP-15 | Installation Diagnosis 对应的 `hold52007` 是开关、命令还是状态？ | 协议 / 固件 | 诊断入口定义 |

## 来源追踪

- 市场端 MOD XH：[`sources/market-mod-xh-outline.md`](../sources/market-mod-xh-outline.md) → `新版（重点） / 直连设置（shinetools)平台`
- 市场端 MIN-XH：[`sources/market-min-xh-outline.md`](../sources/market-min-xh-outline.md) → `新版（重点） / 直连设置（shinetools)平台`
- 研发端：[`sources/rd-outline.md`](../sources/rd-outline.md) → `新版（重点） / 直连设置（shinetools)平台`
- 原始飞书页面：<https://q02gj5lyidv.feishu.cn/wiki/KCFxw6GTyi66bckKSgocmV3TnVf>

## 本轮整理状态

- [x] 三视图 M02 子树已完整提取
- [x] 八个一级模块已逐项比较
- [x] Grid Parameter 的保留 / 合并 / 删除意图已分离
- [x] 69 个唯一寄存器与输入提示已按模块归档
- [x] 来源事实、分析建议和待确认问题已分开
- [ ] 删除项、协议映射和目标导航尚未由产品 / 研发 / 协议负责人确认
