# ShineTools 能量管理设置 Handbook 导航

[返回文档总入口](./README.md)

> **这是一张阅读地图，不是一份长规格。选择你当前要解决的问题，每个后续页面只回答一个问题。**

## 一句话产品结论

ShineTools 的能量管理设置不应表现为一棵参数树，而应把用户从“能源目标”引导到“正确分组、完整配置、安全写入和结果验证”。

## 选择问题

```mermaid
flowchart LR
    A[理解用户与问题] --> B[建立参数分组]
    B --> C[设计配置顺序]
    C --> D[识别高频优先级]
    D --> E[安全写入与验证]
    B --> F[建立唯一设置事实]
    F --> C
```

| 你现在要回答的问题 | 阅读页面 | 这一页的输出 |
|---|---|---|
| 用户为什么觉得复杂，真正要完成什么？ | [01 用户与问题](./handbook/01-problem-and-users.md) | 用户、场景、JTBD 与产品边界 |
| 大量参数应该怎样分组？ | [02 参数分组](./handbook/02-parameter-grouping.md) | 六组目标架构与归属规则 |
| 用户应该按什么顺序配置？ | [03 配置流程](./handbook/03-configuration-flow.md) | 首次配置、调整与问题修正闭环 |
| 哪些设置高频，先做什么？ | [04 高频与优先级](./handbook/04-frequency-and-priority.md) | 四类频率、Tier A–D 与数据验证 |
| 怎样避免误操作并证明生效？ | [05 安全与验证](./handbook/05-safety-and-validation.md) | 风险分级、配置包、回读与后置验证 |
| 怎样避免多个页面重复定义？ | [06 设置事实模型](./handbook/06-setting-contract.md) | Setting Contract 与跨页面引用规则 |

## 按角色阅读

| 角色 | 最短阅读路径 |
|---|---|
| 产品经理 | 01 → 02 → 04 → 06 |
| 交互 / 视觉设计 | 01 → 02 → 03 → 05 |
| 前端 / 客户端 | 02 → 03 → 05 → 06 |
| 协议 / 固件 | 02 → 05 → 06 |
| 测试 / 支持 | 03 → 04 → 05 |

## 六页共同遵循的边界

- 只定义 ShineTools 中的**能量管理设置**产品域，不定义 ShineTools 全产品。
- Quick Site Setup 是配置流程，不是第二份设置事实。
- 画板和 M01–M05 是证据，不是用户频率数据。
- `holdNN` / `inputN` 是来源提示，不直接视为正式寄存器地址。
- 高频结论在埋点和用户研究完成前标记为产品假设。
- 写入成功不等于配置成功；必须回读并验证能源行为。

## 证据入口

需要核对参数和来源时再进入证据层：

- [Quick Site Setup 模块解析](./modules/01-quick-site-setup.md)
- [直连设置平台模块解析](./modules/02-direct-settings-platform.md)
- [旧 quick Setting 参考版](./modules/03-reference-quick-setting.md)
- [旧直连模式参考版](./modules/04-reference-direct-mode.md)
- [来源、视图和结构映射](./01-source-map.md)

证据层用于回答“来源写了什么”；Handbook 用于回答“产品应该怎样组织和取舍”。
