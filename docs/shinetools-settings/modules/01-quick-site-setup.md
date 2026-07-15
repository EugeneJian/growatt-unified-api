# 01 Quick Site Setup 模块解析

[返回总导航](../README.md) · [查看来源映射](../01-source-map.md) · [查看市场端 MOD XH 大纲](../sources/market-mod-xh-outline.md)

## Navigation

- [模块结论](#模块结论)
- [模块边界](#模块边界)
- [功能结构](#功能结构)
- [设置项解析](#设置项解析)
- [交互与依赖](#交互与依赖)
- [三视图差异](#三视图差异)
- [寄存器与标识提示](#寄存器与标识提示)
- [待确认问题](#待确认问题)
- [来源追踪](#来源追踪)

## 模块结论

`Quick Site Setup` 是面向首次建站或设备快速投运的聚合入口。它不是一个单一设置，而是把以下内容放到同一流程中：

1. 设备状态和国家 / 法规选择
2. EMS 工作模式
3. 防逆流 / 出口限制
4. 电池充放电边界
5. 离网与 AC-Couple 开关
6. 并机、表计和区域性测试等条件模块

**来源事实：** 三个新版画板都采用这一主结构。市场端 MIN-XH 与研发端大纲完全一致；市场端 MOD XH 额外提供寄存器或内部标识提示。

**分析：** 该模块适合组织为“基础信息 → EMS 策略 → 功率与 SOC 边界 → 条件功能”的分步向导。当前画板混合了页面结构、机型显示规则和寄存器线索，正式实现或对外文档应将三者拆开。

## 模块边界

### 本模块包含

- `Work Status`
- `Country&Regulation`
- `EMS`
- `Generator and Smart Load`
- `Meter/CT setting`
- `Parallel Setting`
- `Auto test (only for Italy)`

### 本模块不包含

- 直连模式下的完整系统参数
- `Grid Parameter Setting`
- `Safety Parameters`
- `Installation Diagnosis`
- `Device Information`
- `Register Setting`

这些内容属于 [M02 直连设置（Shinetools 平台）](./02-direct-settings-platform.md) 或后续参考模块。

## 功能结构

```text
Quick Site Setup
├─ Work Status
├─ Country & Regulation
├─ EMS
│  ├─ Work Mode
│  │  ├─ TOU Mode → Mode Settings → Time Period
│  │  ├─ Backup Mode → Mode Settings
│  │  └─ Peak Shaving Mode → Mode Settings
│  ├─ Export Limitation Setting
│  ├─ Battery Setting
│  ├─ Off-Grid Enable
│  └─ AC-Couple
├─ Generator and Smart Load
├─ Meter/CT setting
├─ Parallel Setting
└─ Auto test (only for Italy)
```

从阅读角度，可将该树归纳为四层：

| 层次 | 作用 | 主要内容 |
|---|---|---|
| 基础状态 | 确认设备和市场上下文 | Work Status、Country & Regulation |
| 运行策略 | 决定系统如何工作 | TOU、Backup、Peak Shaving |
| 能量边界 | 限制并网、电池和离网行为 | Export Limitation、Battery、Off-Grid、AC-Couple |
| 条件模块 | 按机型、区域或拓扑显示 | Generator、Meter/CT、Parallel、Italy Auto Test |

## 设置项解析

### 基础状态

| 设置项 | 来源事实 | 分析 | 状态 |
|---|---|---|---|
| Work Status | MOD XH 标注 `input0`；其他视图无标识 | 更像状态输入或状态展示，不足以判断是否允许编辑 | 待确认读写属性 |
| Country&Regulation | MOD XH 标注 `hold90` | 建站初始市场 / 并网法规上下文，可能影响后续可见参数和默认值 | 语义合理，映射待确认 |

### EMS / Work Mode

| 模式 | 子结构 | 分析 | 待补信息 |
|---|---|---|---|
| TOU Mode | `Mode Settings` → `Time Period1`、`Add Time Period` | 支持配置至少一个时段，并可继续增加时段 | 时段数量上限、冲突规则、跨日规则、默认值 |
| Backup Mode | `Mode Settings` | 备电模式有独立配置入口 | 具体设置项未在画板展开 |
| Peak Shaving Mode | `Mode Settings` | 削峰模式有独立配置入口 | 具体参数、单位和触发逻辑未展开 |

### EMS / Export Limitation Setting

| 设置项 | 来源层级 | 分析 | 状态 |
|---|---|---|---|
| Export Limitation enable | 下含 `Enable meter 1`、`Disable` | 画板表达了至少两个选择值；`Enable meter 1` 可能同时指定启用状态与表计来源 | 枚举值待确认 |
| Export Limitation Power Ratio | 与 enable 同级 | 防逆流 / 出口限制的目标比例 | 单位、范围、精度待确认 |
| Phase level | 与 enable 同级 | 可能表示按总相或分相执行限制 | 枚举和值语义待确认 |

### EMS / Battery Setting

| 设置项 | 预期用途分析 | MOD XH 提示 | 状态 |
|---|---|---|---|
| Max.Charge Power | 限制最大充电功率 | `hold3047` | 单位和范围待确认 |
| Charging Stop SOC | 达到目标 SOC 后停止充电 | `hold3048` | 默认值和范围待确认 |
| Max.Discharge Power | 限制最大放电功率 | `hold3036` | 单位和范围待确认 |
| Discharge Stop SOC | 放电停止阈值的聚合入口 | - | MIN-XH / 研发端仅到此层 |
| 并网放电停止 SOC | 并网场景的放电下限 | `hold3067` | 仅 MOD XH 视图展开 |
| 离网放电停止 SOC | 离网场景的放电下限 | `hold3037` | 仅 MOD XH 视图展开 |
| Battery Charging From Grid | 允许或禁止从电网给电池充电 | `hold3049`，来源标注“开关按钮” | 开关枚举待确认 |
| Max.Charge Power From Grid | 限制从电网充电的最大功率 | `hold3311` | 与上方开关的禁用关系待确认 |
| Charge Stop SOC from Grid | 从电网充电时的停止 SOC | `hold3312` | 与上方开关的禁用关系待确认 |

### EMS / 拓扑开关

| 设置项 | 来源事实 | 分析 | 状态 |
|---|---|---|---|
| Off-Grid Enable | MOD XH 标注 `hold3079` 和“开关按钮” | 控制离网能力或离网输出是否启用 | 适用机型、前置硬件待确认 |
| AC-Couple | MOD XH 标注 `hold612` 和“开关按钮” | 控制 AC-Couple 拓扑或对应功能入口 | 适用机型、拓扑检测方式待确认 |

### 条件模块

| 模块 | 来源事实 | 结构 / 行为 | 评审结论 |
|---|---|---|---|
| Generator and Smart Load | 标注 `XH/HU不显示` | 未展开子项 | 对 XH/HU 隐藏；其他机型范围待确认 |
| Meter/CT setting | 标注 `SPM/WIT/XH/HU,SPE 不显示` | 未展开子项 | 原文标点存在歧义，需确认完整隐藏机型集合 |
| Parallel Setting | 标注“开关按钮”“XH/HU 机型都不展示” | 下含并机数量和 COM Address；地址范围 `1–254` | XH/HU 隐藏；其他机型启用后的联动明确但寄存器语义待确认 |
| Auto test (only for Italy) | 按意大利机型和功率显示，`<=11kW` | 条件显示 | 地区、机型和功率三重条件需形成正式规则 |

## 交互与依赖

### 来源直接支持的关系

1. `TOU Mode` 进入 `Mode Settings`，其中包含时段和新增时段。
2. `Export Limitation enable` 下存在启用表计与禁用选项。
3. `Parallel Setting` 是开关入口，下挂并机数量和 COM Address。
4. `Auto test` 仅在意大利且满足机型 / 功率条件时显示。
5. `Generator and Smart Load`、`Parallel Setting` 对 XH/HU 隐藏。

### 需要产品确认的推断

1. 选择 `Country&Regulation` 后，可能决定电网规范、Auto Test 和部分安全参数的可见性。
2. 关闭 `Export Limitation` 后，Power Ratio 与 Phase level 应禁用或隐藏。
3. 关闭 `Battery Charging From Grid` 后，来自电网的最大充电功率和停止 SOC 应禁用。
4. 关闭 `Parallel Setting` 后，并机数量和 COM Address 应禁用。
5. Work Mode 可能是互斥选择，但画板没有给出多选 / 单选控件类型。

这些关系符合常见交互逻辑，但当前画板层级不足以将它们认定为实现事实。

## 三视图差异

| 对比项 | 市场端 MOD XH | 市场端 MIN-XH | 研发端 |
|---|---|---|---|
| 主体信息架构 | 与其他视图一致 | 与研发端逐行一致 | 与 MIN-XH 逐行一致 |
| `holdNN` / `inputN` | 有 | 无 | 无 |
| Discharge Stop SOC | 拆为并网 / 离网两个子项 | 仅聚合名称 | 仅聚合名称 |
| 设置单位、范围、默认值 | 未提供 | 未提供 | 未提供 |
| 可见性说明 | 有 | 有，内容与研发端一致 | 有，内容与 MIN-XH 一致 |

**分析结论：** MIN-XH 与研发端很可能共享同一整理底稿。MOD XH 更接近“带实现映射提示的市场视图”，但这仍需要来源负责人确认。

## 寄存器与标识提示

下表只记录画板原文，不将 `holdNN` 直接认定为某一协议版本的 Modbus 地址。

| 路径 | 来源提示 |
|---|---|
| Work Status | `input0` |
| Country&Regulation | `hold90` |
| TOU / Time Period1 | `hold3038–3039` |
| TOU / Add Time Period | `hold3040–3045` |
| Peak Shaving / Mode Settings | `hold3306` |
| Export Limitation enable | `hold122` |
| Export Limitation Power Ratio | `hold123` |
| Phase level | `hold329` |
| Max.Charge Power | `hold3047` |
| Charging Stop SOC | `hold3048` |
| Max.Discharge Power | `hold3036` |
| 并网放电停止 SOC | `hold3067` |
| 离网放电停止 SOC | `hold3037` |
| Battery Charging From Grid | `hold3049` |
| Max.Charge Power From Grid | `hold3311` |
| Charge Stop SOC from Grid | `hold3312` |
| Off-Grid Enable | `hold3079` |
| AC-Couple | `hold612` |
| Multiple machines in parallel | `hold306` |
| COM Address | `hold30`，界面范围 `1–254` |
| Auto test | `hold4371` |

要把这些提示写入 `ProtocolMapping`，至少还需确认：机型 / DTC、功能码、寄存器类型、协议版本、数据类型、单位、比例、读写属性和枚举。

## 建议的结构化字段

后续若建立设置项 SSOT，建议每个条目至少包含：

| 字段 | 用途 |
|---|---|
| `setting_key` | 稳定的设置项标识，不直接使用显示名称 |
| `label` | 当前产品显示名称 |
| `module_path` | 例如 `quick_site_setup.ems.battery` |
| `interaction_type` | status / select / switch / number / group |
| `visibility_rule` | 地区、机型、功率、拓扑条件 |
| `register_hint` | 原始 `holdNN` / `inputN` 提示 |
| `register_mapping` | 评审通过后的正式协议映射 |
| `unit`、`range`、`default` | 数值约束 |
| `evidence` | 来源画板、评审记录和协议版本 |
| `status` | draft / confirmed / deprecated |

## 待确认问题

| ID | 问题 | 需要的确认方 | 影响 |
|---|---|---|---|
| QSS-01 | `holdNN` 是否等于 Holding Register 地址？适用哪个功能码和协议版本？ | 协议 / 固件 | 决定能否进入协议 SSOT |
| QSS-02 | `input0` 是寄存器地址、页面字段编号还是状态入口？ | 固件 / 前端 | Work Status 数据绑定 |
| QSS-03 | Work Mode 是否三选一？各模式的完整设置项是什么？ | 产品 / 研发 | 页面流程和数据模型 |
| QSS-04 | TOU 最多支持多少时段，是否允许跨日或重叠？ | 产品 / 固件 | 时段校验规则 |
| QSS-05 | Export Limitation 的枚举、比例单位和 Phase level 值域是什么？ | 产品 / 协议 | 输入控件和下发参数 |
| QSS-06 | 电池功率与 SOC 的单位、范围、默认值和步进是多少？ | 产品 / 协议 | 参数校验和用户提示 |
| QSS-07 | `Meter/CT setting(SPM/WIT/XH/HU,SPE 不显示)` 的准确机型范围是什么？ | 产品 | 可见性规则 |
| QSS-08 | Italy Auto Test 的机型清单和 `<=11kW` 边界是否包含 11kW？ | 产品 / 合规 | 区域功能显示 |
| QSS-09 | MIN-XH 与研发端完全一致是已评审结果还是复制草稿？ | 文档负责人 | 来源可信度 |

## 来源追踪

- 市场端 MOD XH：[`sources/market-mod-xh-outline.md`](../sources/market-mod-xh-outline.md) → `新版（重点） / Quick Site Setup`
- 市场端 MIN-XH：[`sources/market-min-xh-outline.md`](../sources/market-min-xh-outline.md) → `新版（重点） / Quick Site Setup`
- 研发端：[`sources/rd-outline.md`](../sources/rd-outline.md) → `新版（重点） / Quick Site Setup`
- 原始飞书页面：<https://q02gj5lyidv.feishu.cn/wiki/KCFxw6GTyi66bckKSgocmV3TnVf>

## 本轮整理状态

- [x] 三视图同名子树已提取
- [x] MIN-XH 与研发端已做逐行一致性校验
- [x] MOD XH 特有寄存器提示已保留
- [x] 模块边界和设置项清单已建立
- [x] 推断与来源事实已分开
- [ ] 待确认问题尚未由产品 / 研发 / 协议负责人答复
