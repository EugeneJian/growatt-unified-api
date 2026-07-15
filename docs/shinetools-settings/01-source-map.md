# 来源、视图和结构映射

[返回总导航](./README.md)

## 来源文档

- 飞书知识库标题：`Shinetools XH/HU 设置项`
- 飞书知识库链接：<https://q02gj5lyidv.feishu.cn/wiki/KCFxw6GTyi66bckKSgocmV3TnVf>
- 文档结构：Docx 正文内嵌三个飞书画板
- 正文标题：市场端梳理 / MOD XH、市场端梳理 / MIN-XH、研发端

## 本地来源清单

| 视图 | 生成大纲 | 原始思维导图节点 | 根节点 | 非脑图对象 | 新版重点根节点 |
|---|---|---:|---:|---:|---:|
| 市场端 MOD XH | [market-mod-xh-outline.md](./sources/market-mod-xh-outline.md) | 603 | 6 | 1 | 2 |
| 市场端 MIN-XH | [market-min-xh-outline.md](./sources/market-min-xh-outline.md) | 585 | 6 | 1 | 2 |
| 研发端 | [rd-outline.md](./sources/rd-outline.md) | 557 | 6 | 1 | 2 |

生成大纲已按画板节点的 `parent_id` 恢复层级；“新版，只看这个”标记下方的两个根节点放入“新版（重点）”，其余根节点保留在“其他画板内容（参考）”。该标记本身是独立 `text_shape`，没有进入功能树。

## 新版重点区域

三个画板的新版重点区域都包含两个主模块：

1. `Quick Site Setup`
2. `直连设置（shinetools)平台`

这两个模块应作为第一阶段的正式阅读入口。画板上方的 `quick Setting` 和 `直连模式` 暂按参考版处理，待新版结构整理完成后再回头做差异归档。

## 已确认的视图关系

### Quick Site Setup

- 市场端 MIN-XH 与研发端的 `Quick Site Setup` 子树逐行完全一致，均为 36 行大纲。
- 市场端 MOD XH 保持相同的主体信息架构，但增加了 `holdNN` / `input0` 提示。
- 市场端 MOD XH 将 `Discharge Stop SOC` 进一步拆为并网和离网两个子项；另外两个视图只保留聚合名称。

### 直连设置（Shinetools 平台）

- 三个视图都包含 8 个一级入口，但 M02 大纲规模不同：MOD XH 293 行、MIN-XH 277 行、研发端 249 行。
- MOD XH 提供 69 个唯一 `holdNN` / `inputN` 提示，并展开更多安规阶段和离网盒映射。
- 市场端 MOD XH 与 MIN-XH 的 `Quick Setting(New)` 都复制完整 EMS 子树；研发端只保留 10 行快速摘要。
- `Grid Parameter Setting` 同时包含保留项、新安规占位、旧页面和大量“删除 / 重复 / 研发确认”批注，属于重构评审稿。
- 研发端把 P(U) 放在 `Inverter Protection` 下；市场端将它单独列出并标记为重复删除。

### quick Setting 参考版

- 三个画板的参考版 `quick Setting` 均为 32 行，逐行内容和顺序完全一致。
- 该参考版没有 `holdNN` / `inputN` 提示，也没有机型特有批注。
- 新版 M01 将 Export Limitation、Off-Grid 和 AC-Couple 归入 EMS，并增加 Generator、Meter/CT、Parallel 和 Italy Auto Test。
- 参考版的 Failure Default Power / Time 没有出现在 M01 快速流程，但仍保留在 M02 详细 EMS，因此属于迁移而非明确删除。
- 参考版应作为迁移审计基线，不再与 M01 / M02 并行承担设置项定义。

### 直连模式参考版

- 每个画板中都有两个 `直连模式` 根节点：第一个只有 1 个节点、没有子项；第二个是 238 个节点的完整功能树。
- 三个画板的第二个 `直连模式` 都包含 11 个一级分组，内容和顺序逐行完全一致。
- 完整参考树没有 `holdNN` / `inputN` 提示，也没有机型差异批注。
- 一次移除批注和映射提示的规范化文本比对显示：M04 的 221 个唯一标签中，205 个可在 M02 找到直接同名项。
- M02 的主要变化是拆分旧 Quick/System、合并 Grid Code 与 Safety、移动 Smart Diagnosis / Auto Test，并增加机型条件和删除决策。
- 第一个空白 `直连模式` 根节点属于视觉标签或旧版残留，留给 M05 统一归类。

### 标题、批注与旧版残留

- 三个画板均包含同 ID 的 `MOD - XH` 空标题根节点、空白 `直连模式` 根节点和 `新版，只看这个` 文字标记。
- MIN-XH 和研发端仍出现 `MOD - XH`，说明该标题不能作为对应视图的可靠机型标识。
- `新版，只看这个` 位于旧版四个根节点和新版两个功能根节点之间，是当前区分活动分析与历史参考的直接版面证据。
- 三个来源大纲中共有 224 行命中“删除、确认、建议、重复、不显示、没有、漏、讨论、改成、开关按钮、二次确认、只保留”等批注关键词，形成 74 种不同文本形态。
- 批注必须从显示名中拆出；“删除”只代表 `deprecated_candidate`，不能自动视为已批准下线。
- 详细归类见 [M05 标题、批注与旧版残留](./modules/05-layout-annotations-and-legacy-artifacts.md)。
- 全部根对象的闭合检查见 [全量覆盖审计](./02-coverage-audit.md)。

### 后续需要验证

- 三个画板是否代表机型差异、角色差异，还是不同整理阶段。
- `holdNN` 是否为直接寄存器地址、页面内部映射编号或特定机型寄存器偏移。
- 市场端与研发端的内容一致是否表示已评审通过，还是仅复制了同一草稿。
- M02 中标有“删除”的节点是否已经完成字段迁移和实际下线。
- `安规参数(新)` 与 `Safety Parameters` 分别适用于哪些协议版本和机型。
- 参考版 `quick Setting` 是否可以正式标记为 deprecated。
- 参考版完整 `直连模式` 的字段级迁移是否已经完成，以及是否可以正式 deprecated。

## 来源使用原则

1. 画板中的显式文字是当前分析的直接证据。
2. 生成大纲用于阅读和对比，不保留颜色、坐标、边框和折叠状态。
3. 页面语义、寄存器含义、读写属性、单位和范围如果没有其他证据，不从名称直接推定为事实。
4. 与 `ProtocolMapping/ssot/protocol_ssot.json` 建立映射前，必须补齐机型、功能码、寄存器类型和协议版本。
