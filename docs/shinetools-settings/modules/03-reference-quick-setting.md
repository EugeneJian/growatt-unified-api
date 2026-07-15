# 03 quick Setting 参考版解析

[返回总导航](../README.md) · [现行快速流程：M01](./01-quick-site-setup.md) · [现行详细设置：M02](./02-direct-settings-platform.md)

## Navigation

- [模块结论](#模块结论)
- [来源一致性](#来源一致性)
- [模块边界](#模块边界)
- [参考版功能结构](#参考版功能结构)
- [设置项解析](#设置项解析)
- [向新版迁移的变化](#向新版迁移的变化)
- [设置项归属建议](#设置项归属建议)
- [迁移风险](#迁移风险)
- [三视图差异](#三视图差异)
- [寄存器与标识提示](#寄存器与标识提示)
- [待确认问题](#待确认问题)
- [来源追踪](#来源追踪)

## 模块结论

画板上部的 `quick Setting` 是新版 `Quick Site Setup` 之前的参考结构。它保留了快速建站、EMS、出口限制和电池配置的早期组织方式，但缺少新版的机型条件模块和实现映射。

| 属性 | 结论 |
|---|---|
| 生命周期 | 历史参考 / 待正式归档 |
| 当前用途 | 检查新版迁移是否遗漏旧设置 |
| 不建议用途 | 不应直接作为新页面或设置项 SSOT |
| 流程继任者 | [M01 Quick Site Setup](./01-quick-site-setup.md) |
| 详细设置继任者 | [M02 EMS / General Setting](./02-direct-settings-platform.md#ems) |

**来源事实：** M03 位于“其他画板内容（参考）”区域，而新版重点区域已经提供 M01 和 M02。

**分析结论：** M03 的价值主要是迁移审计。它不应与 M01、M02 并行维护，否则 Export Limitation、Work Mode、Battery Setting、Off-Grid 和 AC-Couple 会出现第三份定义。

## 来源一致性

| 视图 | 大纲行数 | 与其他视图关系 |
|---|---:|---|
| 市场端 MOD XH | 32 | 与 MIN-XH、研发端逐行完全一致 |
| 市场端 MIN-XH | 32 | 与 MOD XH、研发端逐行完全一致 |
| 研发端 | 32 | 与两个市场端视图逐行完全一致 |

三个画板没有机型、角色或寄存器层面的 M03 差异。该结构很可能是复制到三个画板中的共享旧版基线；是否已经评审通过仍需来源负责人确认。

## 模块边界

### 本模块包含

- Country Regulation、Work Status
- Export Limitation Setting
- EMS Work Mode
- Battery Setting
- Off-Grid Enable、AC-Couple

### 本模块不包含

- Generator and Smart Load
- Meter/CT setting
- Parallel Setting
- Italy Auto Test
- Power Sensor
- 任何 `holdNN` / `inputN` 映射
- 任何单位、范围、默认值或机型显示规则

## 参考版功能结构

```text
quick Setting
├─ 一键建站quick Setting
├─ Country Regulation
├─ Work Status
├─ Export Limitation Setting
│  ├─ Export Limitation enable
│  │  ├─ Disable
│  │  └─ Enable meter 1
│  ├─ Export Limitation Power Ratio
│  ├─ Default Power % after Export Limitation Failure
│  ├─ Export Limitation Failure Time
│  └─ Phase level
├─ EMS
│  ├─ Work Mode
│  │  ├─ TOU Mode
│  │  ├─ Backup Mode
│  │  └─ Peak Shaving Mode
│  └─ Battery Setting
├─ Off-Grid Enable
└─ AC-Couple
```

### 结构特征

1. Export Limitation 与 EMS 并列，而不是 EMS 的子模块。
2. Off-Grid Enable、AC-Couple 也位于根层。
3. EMS 只包含 Work Mode 和 Battery Setting。
4. `一键建站quick Setting` 作为无子项节点出现，更像画板说明或旧页面标题，不像可配置字段。

## 设置项解析

### 基础上下文

| 设置项 | 来源事实 | 分析 |
|---|---|---|
| 一键建站quick Setting | 无子项、无控件说明 | 旧页面标签或说明节点，不应转成设置项 |
| Country Regulation | 无映射和枚举 | 建站市场 / 电网法规上下文 |
| Work Status | 无映射和读写说明 | 更像状态展示；是否可编辑未知 |

### Export Limitation Setting

| 设置项 | 来源结构 | 迁移观察 |
|---|---|---|
| Export Limitation enable | Disable / Enable meter 1 | M01 保留相同枚举；M02 另增 Power Sensor |
| Export Limitation Power Ratio | 与 enable 同级 | M01、M02 均保留 |
| Default Power % after Export Limitation Failure | 旧版直接提供 | M01 快速流程未列出，M02 详细 EMS 保留 |
| Export Limitation Failure Time | 旧版直接提供 | M01 快速流程未列出，M02 详细 EMS 保留 |
| Phase level | 与 enable 同级 | M01、M02 均保留 |

失败后的默认功率与失败时间没有从产品模型中完全消失，而是从快速流程迁入 M02 详细 EMS。它们不应被误判为废弃字段。

### EMS / Work Mode

| 模式 | 子结构 | 新版状态 |
|---|---|---|
| TOU Mode | Mode Settings → Time Period1 / Add Time Period | M01、M02 保留 |
| Backup Mode | Mode Settings | M01、M02 保留，但具体参数仍未展开 |
| Peak Shaving Mode | Mode Settings | M01、M02 保留，但具体参数仍未展开 |

### EMS / Battery Setting

| 设置项 | 新版状态 |
|---|---|
| Max.Charge Power | 保留 |
| Charging Stop SOC | 保留 |
| Max.Discharge Power | 保留 |
| Discharge Stop SOC | 保留；M01 的 MOD XH 视图额外拆分并网 / 离网 SOC |
| Battery Charging From Grid | 保留，仍标为开关 |
| Max.Charge Power From Grid | 保留 |
| Charge Stop SOC from Grid | 保留 |

### 拓扑开关

| 设置项 | 参考版位置 | 新版位置变化 |
|---|---|---|
| Off-Grid Enable | quick Setting 根层 | M01 移入 EMS；M02 建议归入 General / Off-Grid Setting |
| AC-Couple | quick Setting 根层 | M01、M02 移入 EMS |

## 向新版迁移的变化

| 参考版内容 | M01 Quick Site Setup | M02 详细设置 | 迁移判断 |
|---|---|---|---|
| 一键建站quick Setting | 由模块标题替代 | `Quick Setting(New)` 作为导航入口 | 旧说明节点可归档 |
| Country / Work Status | 保留，顺序调整为 Work → Country | Quick Setting(New) 保留 | 公共上下文 |
| Export Limitation | 移入 EMS | 作为 EMS 子模块 | 结构归一化 |
| Failure Default Power / Time | 快速流程省略 | 详细 EMS 保留 | 从快速流程迁出，不是删除 |
| Work Mode | EMS 下保留 | EMS 下保留 | 应建立唯一设置模型 |
| Battery Setting | EMS 下保留 | EMS 下保留 | 应建立唯一设置模型 |
| Discharge Stop SOC | 聚合名称 | 聚合名称 | MOD XH 的 M01 视图新增并网 / 离网细分 |
| Off-Grid Enable | 移入 EMS | EMS 中仍有，但市场端建议移到 General | 唯一归属尚未定稿 |
| AC-Couple | 移入 EMS | EMS 下保留 | 结构稳定 |
| Generator / Meter / Parallel / Auto Test | 新增 | Quick Setting(New) 中保留摘要 | 新版补充机型与区域条件模块 |
| Power Sensor | 无 | 独立 EMS 新增 Disable / Meter / CT | 新版补充传感器来源模型 |

## 设置项归属建议

下面是基于 M01–M03 的分析建议，不是已确认产品规格。

| 内容 | 建议事实归属 | 快速流程中的表达 |
|---|---|---|
| Work Status、Country Regulation | 建站上下文模型 | M01 直接展示 |
| Work Mode | M02 EMS | M01 选择模式并跳转 / 展开必要参数 |
| Export Limitation | M02 EMS | M01 只展示基础启用、比例和相级别 |
| Failure Default Power / Time | M02 EMS 高级项 | M01 默认隐藏 |
| Power Sensor | M02 EMS | M01 按需要自动选择或提供简化选择 |
| Battery Setting | M02 EMS | M01 展示投运必需项 |
| Off-Grid / SYN Box | M02 General / Off-Grid Setting | M01 仅按机型展示必要开关 |
| AC-Couple | M02 EMS 或 Topology 模型 | M01 展示必要开关 |

M03 只保留为迁移对照，不再拥有任何独立设置项定义。

## 迁移风险

| 风险 | 证据 | 建议控制 |
|---|---|---|
| 失败策略被误删 | M01 不显示 Failure Default Power / Time，但 M02 仍保留 | 在设置项模型中标记为详细 EMS 字段 |
| 表计选择重复 | Enable meter 1 与 M02 Power Sensor 同时存在 | 统一为传感器来源枚举，并明确 enable 的职责 |
| Off-Grid 多处维护 | M01、M02 EMS、M02 General 都出现 | 指定唯一事实归属，其他页面只引用 |
| SOC 模型不一致 | 只有 M01 MOD XH 拆分并网 / 离网 | 建立机型能力与字段回退规则 |
| 历史页面继续被使用 | M03 三视图完全复制，容易被误认为仍有效 | 在 Navigation 中明确标为参考版，并建立继任关系 |

## 三视图差异

三个视图没有内容差异：

- 根节点名称一致
- 32 行大纲逐行一致
- 子节点顺序一致
- 均不含寄存器提示
- 均不含机型特有批注

因此 M03 不需要按 MOD XH、MIN-XH、研发端分别维护。

## 寄存器与标识提示

M03 没有任何 `holdNN` 或 `inputN` 提示。

如需映射，应从 M01 MOD XH 和 M02 MOD XH 的来源提示出发，并补齐功能码、寄存器类型、协议版本、机型 / DTC、数据类型、比例、单位、读写属性和枚举。不能因为 M03 名称相同就自动继承某个地址。

## 待确认问题

| ID | 问题 | 需要的确认方 | 影响 |
|---|---|---|---|
| RQS-01 | `一键建站quick Setting` 是页面标题、说明还是曾经的真实入口？ | 产品 / 文档负责人 | 归档方式 |
| RQS-02 | Failure Default Power / Time 从快速流程移除是否为正式产品决策？ | 产品 | 防止功能遗漏 |
| RQS-03 | `Enable meter 1` 与 M02 `Power Sensor` 的关系是什么？ | 产品 / 协议 | 防逆流数据模型 |
| RQS-04 | Off-Grid 的唯一事实归属是 EMS 还是 General Setting？ | 产品 | 消除重复配置 |
| RQS-05 | 并网 / 离网 Discharge Stop SOC 细分适用于哪些机型和协议？ | 设备 / 协议 | 字段能力矩阵 |
| RQS-06 | 三个画板完全一致代表已确认共享基线，还是复制的旧草稿？ | 文档负责人 | 来源可信度 |
| RQS-07 | M03 是否可以正式标记为 deprecated，并从产品导航移除？ | 产品 | 生命周期管理 |

## 来源追踪

- 市场端 MOD XH：[`sources/market-mod-xh-outline.md`](../sources/market-mod-xh-outline.md) → `其他画板内容（参考） / quick Setting`
- 市场端 MIN-XH：[`sources/market-min-xh-outline.md`](../sources/market-min-xh-outline.md) → `其他画板内容（参考） / quick Setting`
- 研发端：[`sources/rd-outline.md`](../sources/rd-outline.md) → `其他画板内容（参考） / quick Setting`
- 继任流程：[M01 Quick Site Setup](./01-quick-site-setup.md)
- 继任详细设置：[M02 直连设置](./02-direct-settings-platform.md)
- 原始飞书页面：<https://q02gj5lyidv.feishu.cn/wiki/KCFxw6GTyi66bckKSgocmV3TnVf>

## 本轮整理状态

- [x] 三视图 M03 子树已完整提取
- [x] 32 行来源已做逐行一致性校验
- [x] M03 与 M01 / M02 的迁移关系已建立
- [x] 遗漏风险和唯一事实归属已分析
- [x] 7 个待确认问题已登记
- [ ] M03 的正式 deprecated 状态尚未由产品负责人确认
