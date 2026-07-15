# 03 用户应该按什么顺序完成能管配置？

[上一页：参数分组](./02-parameter-grouping.md) · [Handbook 导航](../product-handbook.md) · [下一页：高频与优先级](./04-frequency-and-priority.md)

> **这一页只回答一个问题：怎样把多组参数组织成一次完整配置，而不是逐页保存？**

## 一句话答案

先确认设备上下文和测量，再选择能源目标，配置策略与边界，最后以 Configuration Package 统一审阅、写入、回读和验证。

## 首次配置主流程

```mermaid
flowchart LR
    A[识别设备] --> B[确认法规与拓扑]
    B --> C[验证 Meter / CT]
    C --> D[选择能源目标]
    D --> E[配置模式必需项]
    E --> F[配置出口与电池边界]
    F --> G[审阅变更包]
    G --> H[安全写入]
    H --> I[回读并验证]
```

| 阶段 | 用户做什么 | 产品完成条件 |
|---|---|---|
| 识别 | 连接设备 | 机型、固件、协议和能力可信 |
| 上下文 | 确认法规与拓扑 | 不适用参数已过滤 |
| 测量 | 确认 Meter / CT | 在线、方向和数据有效 |
| 目标 | 选择 TOU / Backup / Peak Shaving | 目标和模式明确 |
| 必需项 | 填写当前模式参数 | 无缺失、冲突或越界 |
| 边界 | 配置出口和电池限制 | 配置包可以执行 |
| 执行 | 审阅整体变化 | 按依赖写入并处理部分失败 |
| 验证 | 观察状态和功率行为 | 回读一致且目标验证通过 |

## 为什么不能逐页保存

同一个目标可能同时修改 Work Mode、Meter / CT、TOU、Export Limitation 和 Battery。如果逐页立即写入：

- 中间状态可能不完整或冲突。
- 用户看不到整体影响。
- 一项失败后不知道哪些值已经生效。
- 无法生成统一回滚方案。

因此需要一个 Configuration Package。

## Configuration Package

```text
Configuration Package
├─ Goal
├─ Device and site context
├─ Current values
├─ Proposed changes
├─ Dependencies and conflicts
├─ Execution order
├─ Risk and side effects
├─ Rollback values
└─ Verification plan
```

### 变更摘要示例

| 设置 | 当前 | 计划 | 原因 |
|---|---:|---:|---|
| Work Mode | Backup | TOU | 切换峰谷策略 |
| Charge From Grid | Off | On | 允许低谷补能 |
| Max Grid Charge Power | — | 5 kW | 受站点容量约束 |
| Charge Stop SOC | 80% | 90% | 满足高峰放电目标 |

## 三条配置路径

### A. 首次配置

完整执行主流程，生成到场基线和配置报告。

### B. 调整现有策略

1. 读取设备当前实际值。
2. 用户选择新的目标或要改变的结果。
3. 只显示相关差异和受影响参数。
4. 写入后说明立即生效、延迟生效或需要重启的部分。
5. 在对应观察窗口验证行为。

### C. 修正行为不符合预期

1. 从症状进入，例如“电池不放电”。
2. 读取模式、SOC、功率边界、时段、测量和拓扑。
3. 只展示会阻止目标行为的参数与状态。
4. 生成最小修正集。
5. 仍无法解释时，带上下文转入 ShineTools 诊断能力。

## 依赖顺序示例

| 触发条件 | 必须联动 |
|---|---|
| 选择 TOU | 至少一个有效时段，检查重叠与跨日 |
| 启用 Export Limitation | Measurement、Target、Phase level |
| 启用 Charge From Grid | Max Power、Stop SOC |
| 启用 Parallel | 数量、COM Address 和地址冲突检查 |
| 启用 Off-Grid | Voltage、Frequency、离网 SOC |
| 切换 Work Mode | 说明哪些参数停止生效或继续保留 |

## 本页形成的产品决策

- Quick Site Setup 负责流程编排，不拥有设置事实。
- 跨组变更以 Configuration Package 提交。
- 页面保存成功不是任务完成。
- 任何配置都需要设备回读和目标验证。
- 配置中断或部分失败必须显示已生效范围和恢复步骤。

## 下一步

流程确定后，下一页只解决：[哪些设置高频，产品应该优先什么？](./04-frequency-and-priority.md)

## 证据

- [Quick Site Setup 交互与依赖](../modules/01-quick-site-setup.md#交互与依赖)
- [直连设置 EMS](../modules/02-direct-settings-platform.md#ems)
