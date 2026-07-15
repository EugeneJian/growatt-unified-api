# 04 直连模式参考版解析

[返回总导航](../README.md) · [现行继任模块：M02](./02-direct-settings-platform.md) · [上一参考模块：M03](./03-reference-quick-setting.md)

## Navigation

- [模块结论](#模块结论)
- [同名根节点辨识](#同名根节点辨识)
- [来源一致性](#来源一致性)
- [旧版功能结构](#旧版功能结构)
- [Quick Setting](#quick-setting)
- [System Setting](#system-setting)
- [Basic Parameters](#basic-parameters)
- [Grid Code 与 Safety Parameters](#grid-code-与-safety-parameters)
- [EMS](#ems)
- [诊断、信息与专家工具](#诊断信息与专家工具)
- [向 M02 的迁移矩阵](#向-m02-的迁移矩阵)
- [内容连续性分析](#内容连续性分析)
- [三视图差异](#三视图差异)
- [寄存器与标识提示](#寄存器与标识提示)
- [归档与下线建议](#归档与下线建议)
- [待确认问题](#待确认问题)
- [来源追踪](#来源追踪)

## 模块结论

画板上部的完整 `直连模式` 是新版 [M02 直连设置（Shinetools 平台）](./02-direct-settings-platform.md) 的共同旧版母树。它包含 238 个脑图节点、11 个一级分组，覆盖通用设置、并网安规、EMS、诊断、设备信息和原始寄存器工具。

| 属性 | 结论 |
|---|---|
| 生命周期 | 历史参考 / deprecated 候选 |
| 当前用途 | 校验 M02 重构是否遗漏旧功能 |
| 不建议用途 | 不应直接作为现行页面导航或设置项 SSOT |
| 现行继任者 | [M02 直连设置（Shinetools 平台）](./02-direct-settings-platform.md) |
| 来源稳定性 | 三个画板逐行完全一致 |

**分析结论：** M02 并不是从零新增的一套功能，而是对 M04 的拆分、重命名、机型过滤和重复项清理。旧版功能不能因为页面被重构就直接视为废弃；每个“删除”项都需要证明已迁移、替代或明确停止支持。

## 同名根节点辨识

每份生成大纲中都出现两个 `直连模式` 根节点：

| 出现顺序 | 子树节点数 | 第一个子节点 | 本专题归属 |
|---|---:|---|---|
| 第一个 | 1 | 无 | 视觉标签，留给 M05 归类 |
| 第二个 | 238 | Quick Setting | 本文分析的完整 M04 功能树 |

本文只分析第二个根节点。把第一个空节点并入功能树会造成虚假的重复模块。

## 来源一致性

| 视图 | 完整子树节点数 | 一级分组 | 与其他视图关系 |
|---|---:|---:|---|
| 市场端 MOD XH | 238 | 11 | 节点文字和顺序完全一致 |
| 市场端 MIN-XH | 238 | 11 | 节点文字和顺序完全一致 |
| 研发端 | 238 | 11 | 节点文字和顺序完全一致 |

M04 没有机型差异批注，也没有 `holdNN` / `inputN` 映射。它更像三个画板共享的旧版产品信息架构快照。

## 旧版功能结构

| 一级分组 | 行数 | 主要职责 |
|---|---:|---|
| Quick Setting | 28 | 常用基础项、AFCI、出口限制 |
| System Setting | 62 | 设备开关、拓扑、离网、干接点、保护 |
| Basic Parameters | 12 | 通信、历史、复位、型号与版本 |
| Grid Code | 78 | PF、保护阈值、并网范围与曲线 |
| EMS | 18 | Work Mode 与 Battery Setting |
| Installation Diagnosis | 1 | 未展开的诊断入口 |
| Advanced Set | 4 | 原始寄存器命令输入 |
| Safety Parameters | 19 | 并网保护和功率控制分组 |
| Auto test (only for Italy) | 1 | 意大利自动测试入口 |
| Device Information | 9 | 遥测、参数、版本信息 |
| Smart Diagnosis | 6 | I-V、波形与一键诊断 |

```text
直连模式（旧版）
├─ Quick Setting
├─ System Setting
├─ Basic Parameters
├─ Grid Code
├─ EMS
├─ Installation Diagnosis
├─ Advanced Set
├─ Safety Parameters
├─ Auto test (only for Italy)
├─ Device Information
└─ Smart Diagnosis
```

旧版按“常用、系统、基础、高级”等页面概念分组，同一业务领域会分散在多个入口。例如 AFCI 在 Quick Setting，Anti-islanding 在 System Setting，Safety Parameters 又单独存在。

## Quick Setting

旧版 Quick Setting 不是建站向导，而是一组跨领域常用参数：

| 内容 | 旧版位置 | M02 目标位置 |
|---|---|---|
| Country Regulation | Quick Setting | Quick Setting(New) / Grid Parameter |
| Inverter Time、Language、COM Address | Quick Setting | General Setting |
| Power Sensor | Quick Setting | EMS |
| AFCI | Quick Setting | Advanced Setting |
| Export Limitation | Quick Setting | EMS |
| Dry Contact Mode | Quick Setting | General / Dry Contact Control |

**分析：** M02 的拆分方向合理：常用程度不应成为设置项的事实归属。Quick Setup 可以引用常用项，但时间、AFCI、EMS 和干接点必须各自拥有唯一数据模型。

## System Setting

### 旧版内容

- Inverter Power OFF/ON
- Active Power 与 Memory Enable
- PV Input Mode
- Dry Contact Control
- Voltage Detection between N to PE
- Wide Operating Voltage Range
- SYN Box、Off-grid、AC-Couple
- Off-grid Frequency、Voltage
- Work Mode：Default / System Retrofit / Multiple machines in parallel
- N Line、RRCR、PU Enable
- Inverter Protection：Anti-islanding、P(U)、Q(v)

### 新版拆分

| 旧版内容 | M02 去向 | 说明 |
|---|---|---|
| Inverter Power、Active Power | General Setting | 保留，并增加寄存器提示和操作说明 |
| PV Input Mode | Advanced Setting | 作为输入拓扑模式 |
| Dry Contact | General Setting | 保留并展开状态、模式和触发条件 |
| SYN Box / Off-grid | General / Off-Grid Setting | 增加 XH/HU 差异 |
| Work Mode | Retrofit / Parallel | 为避免与 EMS Work Mode 冲突而建议改名 |
| Wide Voltage、N Line、RRCR | Grid Parameter Setting | 归入电网与地区合规 |
| Anti-islanding | Advanced Setting | 从 Inverter Protection 中拆出 |
| P(U)、Q(v) | Grid Parameter / Safety | 进入重复项清理流程 |
| PU Enable | 删除候选 | M02 明确批注删除 |

旧版 System Setting 是 M02 重构最明显的分组：一个 62 行模块被拆到 General、Grid、Advanced 和 EMS 四个领域。

## Basic Parameters

| 旧版设置 | M02 状态 | 分析 |
|---|---|---|
| Baud Rate Selection | 移入 Advanced / Basic Parameters，是否删除有争议 | 仍可能承担升级后 485 恢复用途 |
| Clear History | 移入 Advanced / Basic Parameters | 需要权限、确认和后果说明 |
| Reset | 移入 General Setting | 建议只保留 recover，并增加二次确认 |
| PV Voltage | 标记删除 | 需要确认是否被 Device Information 替代 |
| Modbus Version | 建议删除 | 需要确认是否仍用于维护诊断 |
| Model Setting | 移入 Advanced / Basic Parameters | 高影响操作，适用范围待确认 |

**分析：** Basic Parameters 不应作为“杂项收纳箱”。通信恢复、设备维护、信息展示和高影响写操作需要分层。

## Grid Code 与 Safety Parameters

### 旧版 Grid Code

旧版 Grid Code 包含：

- PF Setting 与四点 Custom PF Curve
- AC Voltage Protection
- AC Frequency Protection
- Synchronization Range
- Normal Gradient
- Frequency/Watt
- Voltage/Var

### 旧版 Safety Parameters

旧版 Safety Parameters 包含：

- Grid Connection Restriction
- Load Drop Rate、10 Minutes Protection
- 三阶段 Voltage & Frequency
- P(U)Function、Q(U)Mode
- Voltage Ride Through
- Overfrequency Derating、Underfrequency Increasing
- ROCOF、DCI
- Export Limitation function
- Active / Reactive Power Control

### 重复关系

| Grid Code 旧分组 | Safety 中的候选等价项 | M02 批注意图 |
|---|---|---|
| AC Voltage / Frequency Protection | 三阶段 Voltage & Frequency | 删除旧保护页面，只保留统一设置 |
| Synchronization Range | Grid Connection Restriction | 删除旧入口，补齐 Vpv start 等字段 |
| Normal Gradient | Load Drop Rate | 删除重复项 |
| Frequency/Watt | Overfrequency Derating | 删除重复项 |
| Voltage/Var | Q(U) Mode / Q(v) | 统一名称和曲线模型 |
| Export Limitation function | EMS Export Limitation | 从 Safety 移出，归 EMS |

**结论：** M04 已经暴露出 Grid Code 与 Safety Parameters 的双重建模；M02 新增“删除 / 重复 / 只保留一个”批注，说明重构方向已形成，但字段级迁移尚未被当前画板证明。

## EMS

旧版 EMS 只包含：

- Work Mode：TOU / Backup / Peak Shaving
- Battery Setting：充放电功率、SOC、从电网充电

M02 在此基础上吸收了旧 Quick Setting 的 Export Limitation 和 Power Sensor，并保留 AC-Couple。M02 市场端还建议把 Off-grid 从 EMS 移入 General / Off-Grid Setting。

**分析：** EMS 是旧版中迁移最平稳的领域。主要变化不是删除，而是把散落在 Quick/System 下的能量管理参数合并进来。

## 诊断、信息与专家工具

### Installation Diagnosis

旧版只有入口名，没有子项。M02 仍未展开，只在 MOD XH 来源增加 `hold52007` 提示，因此尚不能形成诊断功能规格。

### Advanced Set

旧版只有三个自由输入：Command Type、Register Address、Length/Data。M02 将其移动到 `Advanced Setting / Register Setting`。

该功能本质是原始寄存器工具，不属于普通“高级设置”。其权限、地址范围、数据校验、确认、审计和回读仍未定义。

### Device Information

旧版包含 PV、String、AC、Off-grid、Battery、Internal、About Inverter 和 Version Upgrade。M02 保留主体结构，并新增 XH/HU 的 String 参数与离网盒差异批注。

### Smart Diagnosis

旧版是独立一级入口，包含 I-V 曲线、异常波形、实时波形和一键诊断。M02 将其移入 Advanced Setting，内容本身保留。

### Auto Test

旧版是独立一级入口；M02 将它放入 Quick Setting(New)，并补充“意大利、机型、功率不超过 11kW”的条件说明。

## 向 M02 的迁移矩阵

| M04 旧分组 | M02 目标模块 | 迁移类型 | 当前判断 |
|---|---|---|---|
| Quick Setting | General、EMS、Advanced、Quick Setting(New) | 拆分 | 内容基本保留，事实归属改变 |
| System Setting | General、Grid、Advanced、EMS | 拆分 | 拓扑和合规参数重新归类 |
| Basic Parameters | General、Advanced | 拆分 + 删除候选 | Reset 与维护参数分开 |
| Grid Code | Grid Parameter Setting | 重命名 + 清理 | 多个旧页面标为删除或重复 |
| EMS | EMS | 保留 + 扩展 | 吸收 Export Limitation、Power Sensor |
| Installation Diagnosis | Installation Diagnosis | 保留占位 | 仍缺功能结构 |
| Advanced Set | Advanced / Register Setting | 重命名 + 下沉 | 仍缺安全约束 |
| Safety Parameters | Grid Parameter / Safety Parameters | 保留 + 合并 | 作为统一安规入口候选 |
| Auto test | Quick Setting(New) | 移动 | 增加地区、机型和功率条件 |
| Device Information | Device Information | 保留 + 机型过滤 | 增加 XH/HU 差异 |
| Smart Diagnosis | Advanced Setting | 移动 | 诊断内容基本保留 |

## 内容连续性分析

对 M04 与 MOD XH 的 M02 文本做以下规范化处理：移除层级缩进、`holdNN` / `inputN`、斜杠后的批注并合并重复名称。结果如下：

| 指标 | 数量 |
|---|---:|
| M04 唯一标签 | 221 |
| M02 唯一标签 | 240 |
| 可直接匹配的共同标签 | 205 |
| 仅在 M04 出现 | 16 |
| 仅在 M02 出现 | 35 |

约 93% 的 M04 唯一标签能在 M02 中找到直接同名项。该比对只能证明文字连续性，不能证明寄存器、枚举、读写属性或行为完全等价。

### 仅旧版名称的主要类型

- 结构重命名：`Grid Code` → `Grid Parameter Setting`、`Advanced Set` → `Advanced Setting`
- 新版删除批注：AC Voltage/Frequency Protection、Synchronization Range、Voltage/Var、PU Enable
- 迁移名称：`Export Limitation function` → EMS Export Limitation
- 待删除字段：PV Voltage
- 文案修正：`Feed in/production powe`

### 新版新增信息的主要类型

- Network Configuration、General Setting 和 Quick Setting(New) 新导航
- Work Status、Generator / Smart Load、Meter/CT、Parallel Setting
- `安规参数(新)` 最新 VPP 机型占位
- XH 离网盒参数与并网 / 离网 SOC 细分
- 大量寄存器提示、删除原因和研发确认批注

## 三视图差异

三个画板的完整 M04 没有差异：

- 都是 238 个脑图节点
- 都有 11 个一级分组
- 节点文字和顺序逐行一致
- 都没有寄存器提示
- 都没有 XH/HU 的机型差异说明

因此 M04 只需要保留一份共享历史解释，不应按三个视图分别维护。

## 寄存器与标识提示

M04 没有任何 `holdNN` / `inputN` 提示。M02 的 MOD XH 来源为相同或迁移后的设置增加了 69 个唯一提示，但不能按名称自动回填到 M04。

正式映射仍需同时确认：

- 设置项稳定键
- 机型 / DTC
- 功能码和寄存器类型
- 地址与协议版本
- 数据类型、单位、比例、范围和枚举
- 读写权限与操作风险

## 归档与下线建议

1. 保留 M04 生成大纲和本文，作为历史迁移证据。
2. 在产品和文档 Navigation 中只发布 M01 / M02，不发布 M04 作为活动入口。
3. 为 11 个旧分组建立字段级迁移清单，不能只依赖页面名称映射。
4. 对 M02 标注删除的每个旧节点记录：替代字段、适用机型、确认人和下线版本。
5. 所有迁移完成后，由产品负责人将 M04 正式标记为 deprecated。

## 待确认问题

| ID | 问题 | 需要的确认方 | 影响 |
|---|---|---|---|
| RDM-01 | 238 节点的 M04 是否对应已发布的旧版产品，还是未上线设计稿？ | 产品 / 文档负责人 | 历史基线可信度 |
| RDM-02 | Quick Setting 拆到 General、EMS、Advanced 的归属是否已经正式确认？ | 产品 | 设置项唯一归属 |
| RDM-03 | System Setting 中的四路拆分是否已在实现中完成？ | 前端 / 产品 | 导航和页面迁移 |
| RDM-04 | 所有标注“删除”的 Grid Code 页面是否已有字段级替代？ | 产品 / 协议 | 防止安规能力丢失 |
| RDM-05 | `Safety Parameters` 是旧协议统一入口还是全部机型的统一入口？ | 协议 / 产品 | 新旧协议分流 |
| RDM-06 | `Export Limitation function` 是否已完整迁移到 EMS？ | 产品 / 协议 | 旧字段下线 |
| RDM-07 | Auto Test 从一级入口移动到 Quick Setting(New) 是否适用于所有目标机型？ | 合规 / 产品 | 条件导航 |
| RDM-08 | 原始 Register Setting 是否继续保留，安全约束由谁负责？ | 安全 / 研发 | 高风险工程工具 |
| RDM-09 | Device Information 中 String、离网盒和 Version Upgrade 的机型归属是否已确认？ | 设备 / 产品 | 能力驱动页面 |
| RDM-10 | M04 是否可以正式标记为 deprecated 并从活动导航移除？ | 产品 | 生命周期管理 |

## 来源追踪

- 市场端 MOD XH：[`sources/market-mod-xh-outline.md`](../sources/market-mod-xh-outline.md) → 第二个 `其他画板内容（参考） / 直连模式`
- 市场端 MIN-XH：[`sources/market-min-xh-outline.md`](../sources/market-min-xh-outline.md) → 第二个 `其他画板内容（参考） / 直连模式`
- 研发端：[`sources/rd-outline.md`](../sources/rd-outline.md) → 第二个 `其他画板内容（参考） / 直连模式`
- 现行继任模块：[M02 直连设置（Shinetools 平台）](./02-direct-settings-platform.md)
- 原始飞书页面：<https://q02gj5lyidv.feishu.cn/wiki/KCFxw6GTyi66bckKSgocmV3TnVf>

## 本轮整理状态

- [x] 两个同名根节点已正确区分
- [x] 三份 238 节点完整子树已做节点文字和顺序一致性校验
- [x] 11 个旧版一级分组已建立迁移矩阵
- [x] M04 / M02 的规范化标签连续性已量化
- [x] 10 个待确认问题已登记
- [ ] M04 的正式 deprecated 状态尚未由产品负责人确认
