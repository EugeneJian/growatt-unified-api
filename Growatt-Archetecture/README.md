# Growatt-Archetecture

本目录作为 `Growatt-Archetecture` ShowDoc 项目的仓库侧同步源。

当前内容已从 `《企业平台总体架构与角色视图（完整正式版）》.md` 拆分为多文件结构，便于：

- 多页面同步到 ShowDoc
- 子目录映射为 ShowDoc 目录
- 后续按章节独立维护
- 保持 Mermaid 图和术语口径稳定
- 按固定顺序同步到 ShowDoc

## 同步规则

- 同步执行说明以 `sync-instructions.md` 为准。
- 同步顺序与页面标题以 `_meta.json` 为准。
- `README.md` 可作为目录索引页同步。
- Markdown 文件映射为 ShowDoc 页面。
- 子目录与 `_meta.json` 中的 `catalog` 字段共同决定 ShowDoc 目录层级。
- 当前 ShowDoc MCP 实际落地时，目录采用叶子目录名回退到项目根目录的策略。

## 本地一键同步

PowerShell:

```powershell
$env:SHOWDOC_TOKEN = "your-token"
.\scripts\sync-growatt-archetecture.ps1
```

Dry run:

```powershell
$env:SHOWDOC_TOKEN = "your-token"
.\scripts\sync-growatt-archetecture.ps1 -DryRun
```

NPM:

```powershell
$env:SHOWDOC_TOKEN = "your-token"
npm run showdoc:sync:growatt-archetecture
```

## 文档索引

### 总览

1. [01-document-purpose-and-core-conclusions.md](01-document-purpose-and-core-conclusions.md)
2. [02-platform-architecture.md](02-platform-architecture.md)

### 角色视图

1. [03-role-views/01-management-view.md](03-role-views/01-management-view.md)
2. [03-role-views/02-platform-architect-view.md](03-role-views/02-platform-architect-view.md)
3. [03-role-views/03-api-partner-view.md](03-role-views/03-api-partner-view.md)
4. [03-role-views/04-cloud-edge-view.md](03-role-views/04-cloud-edge-view.md)
5. [03-role-views/05-protocol-device-view.md](03-role-views/05-protocol-device-view.md)
6. [03-role-views/06-device-modeling-view.md](03-role-views/06-device-modeling-view.md)

### 统一口径与结论

1. [04-unified-architecture-statement.md](04-unified-architecture-statement.md)
2. [05-conclusion-and-next-steps.md](05-conclusion-and-next-steps.md)

## 维护约定

1. 目录内每个 Markdown 文件可映射为一个 ShowDoc 页面。
2. 子目录可映射为 ShowDoc 目录层级。
3. 文件名保持稳定，避免频繁重命名导致页面映射混乱。
4. 涉及内部资料时，在文档正文显式标注内部用途。
5. Mermaid 图、标题层级、术语口径尽量保持稳定，便于 ShowDoc 持续更新。
6. 需要调整同步顺序、显示标题或目标目录时，优先修改 `_meta.json`。
7. 需要调整执行流程或失败处理策略时，优先修改 `sync-instructions.md`。
8. 当前若通过 ShowDoc MCP 执行实际同步，页面通常会落到根级目录 `平台架构`、`总览`、`角色视图`、`统一口径与结论`。

## 说明

- 当前未删除原始单文件，便于对照校验。
- 后续可继续将新增章节直接放入本目录并参与多文件同步。
