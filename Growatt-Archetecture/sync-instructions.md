# Growatt-Archetecture Sync Instructions

> 内部资料

本文件提供给同步器或执行同步的 Agent 使用。目标是将 `Growatt-Archetecture/` 目录下的多文件 Markdown，按固定顺序同步到 ShowDoc 项目 `Growatt-Archetecture`。

## 目标

- ShowDoc 项目：`Growatt-Archetecture`
- 仓库同步根：`Growatt-Archetecture/`
- 顶层目录：`内部资料/平台架构`
- 顺序与页面映射真源：`Growatt-Archetecture/_meta.json`

## 同步前置条件

执行同步前，必须满足以下条件：

1. 本地 MCP 中已配置名为 `showdoc` 的服务。
2. `showdoc` MCP 可正常鉴权。
3. `Growatt-Archetecture/_meta.json` 存在且可读取。
4. `_meta.json` 中列出的 Markdown 文件都存在。
5. 不将 Bearer token 写入仓库文件、日志摘要或提交信息。

## 必须先读的文件

同步器执行时按如下顺序读取：

1. `Growatt-Archetecture/sync-instructions.md`
2. `Growatt-Archetecture/_meta.json`
3. `Growatt-Archetecture/README.md`
4. `_meta.json` 中 `order` 数组列出的每个 Markdown 文件

## 项目处理规则

### 1. 先检查项目是否已存在

- 使用 `list_items`
- 查找项目名 `Growatt-Archetecture`
- 若存在同名项目，直接复用
- 若不存在，再尝试创建项目

### 2. 创建项目

- 使用 `create_item`
- 项目名称固定为 `Growatt-Archetecture`
- 若创建失败，必须停止并报告错误原因
- 不得把内容写入其他无关项目

### 3. 已知限制

- 若 `create_item` 因 ShowDoc 账号限制失败，例如邮箱未绑定，必须停止项目创建流程
- 只有在项目已存在时，才可继续页面同步

## 目录与页面处理规则

### 1. 同步顺序

- 严格按 `Growatt-Archetecture/_meta.json` 的 `order` 顺序执行
- 不要按文件系统遍历顺序替代 `_meta.json`

### 2. 页面标题

- 页面标题以 `_meta.json` 的 `title` 为准
- 不要直接使用文件名替代标题，除非 `_meta.json` 未提供标题

### 3. 目标目录

- 目标目录以 `_meta.json` 的 `catalog` 为准
- 若目录不存在，先创建目录，再写入页面
- 顶层目录默认为 `内部资料/平台架构`

### 4. 特殊文件规则

- `README.md` 允许作为索引页同步
- `_meta.json` 与 `sync-instructions.md` 只作为同步元数据和执行说明，不同步为 ShowDoc 页面
- 非 Markdown 文件默认跳过

## 页面写入规则

优先使用以下写入策略：

1. `upsert_page`
2. `batch_upsert_pages`
3. `create_page` + `update_page`

页面内容要求：

1. 保留原始 Markdown 标题层级
2. 保留 Mermaid 图
3. 保留架构术语，例如 `Legacy API`、`OpenAPI`、`0x04`、`0x03`、`VPP Protocol 2.04`、`RTU Protocol`
4. 保留“内部资料”定位
5. 不擅自重写中文内容

## 执行步骤

### Step 1. 读取清单

- 读取 `sync-instructions.md`
- 读取 `_meta.json`
- 校验 `order` 中每个 `path`、`title`、`catalog` 字段

### Step 2. 校验源文件

- 检查 `_meta.json` 中每个 Markdown 文件是否存在
- 若缺文件，停止并报告缺失项

### Step 3. 定位或创建 ShowDoc 项目

- 调用 `list_items`
- 如不存在目标项目，调用 `create_item`
- 若创建失败，停止并报告

### Step 4. 为每个条目准备目录

对 `_meta.json.order` 中每一项：

1. 解析 `catalog`
2. 检查目标目录是否存在
3. 若不存在则调用 `create_catalog`

### Step 5. 逐页同步

对 `_meta.json.order` 中每一项：

1. 读取 `path` 指向的 Markdown 文件
2. 使用 `title` 作为页面标题
3. 使用 `catalog` 作为目标目录
4. 调用 `upsert_page`
5. 记录该页是 created、updated、unchanged 还是 failed

### Step 6. 输出结果摘要

结果摘要至少包含：

1. 目标项目名
2. 实际同步的页面数量
3. 创建了哪些目录
4. 创建或更新了哪些页面
5. 是否存在跳过项或失败项
6. 若失败，给出明确错误原因

## 失败处理规则

遇到以下情况必须停止或显式报告：

- `showdoc` MCP 不可用
- 鉴权失败
- `create_item` 失败
- `_meta.json` 缺失或格式无效
- `_meta.json` 中引用的 Markdown 文件缺失
- 页面写入失败

禁止行为：

- 静默忽略 `_meta.json`
- 静默写入错误项目
- 静默更改页面标题或目录映射
- 在用户摘要中输出完整 token

## 推荐结果格式

同步完成或中止后，按以下结构汇报：

1. target project
2. manifest source
3. catalogs created or reused
4. pages created, updated, skipped, failed
5. overall status: full sync / partial sync / blocked
6. blocker details if any
