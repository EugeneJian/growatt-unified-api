# Growatt OpenAPI Docs Site

本项目已重构为纯文档站，不再包含任何 Vercel/代理 API 能力。

## 目标

1. 使用 `Growatt API/OPENAPI/*.md` 作为 API 文档主 SSOT。
2. 使用 `Growatt API/OPENAPI.zh-CN/*.md` 作为中文对齐版文档源。
3. 使用 `Growatt API/Growatt Open API Professional Integration Guide.md` 作为 Quick Guide 英文源，并使用 `Growatt API/Growatt Open API Professional Integration Guide.zh-CN.md` 作为中文对齐版源。
4. 将 Markdown 在构建期渲染为可读 HTML 文档站，并支持中英文切换。
5. 部署到 Cloudflare Pages（静态输出目录：`out`）。

## 路由

1. `/`：项目首页（文档入口）
2. `/growatt-openapi`：文档总览
3. `/growatt-openapi/quick-guide`：Professional Integration Quick Guide
4. `/growatt-openapi/growatt-codes`：Growatt Codes appendix（公开访问）
5. `/growatt-openapi/{docSlug}`：API 详情页（静态生成）

## 本地开发

```bash
npm install
npm run dev
```

访问 `http://localhost:3000/growatt-openapi`。

## 质量检查

```bash
npm run docs:check
npm run build
```

`docs:check` 包含：

1. 文档命名与链接校验（`docs:lint:growatt`）
2. 文档渲染相关单元测试（`docs:test:growatt`）

## Cloudflare Pages 部署

### 方式一：Cloudflare Dashboard

1. 连接 Git 仓库
2. Build command: `npm run build`
3. Build output directory: `out`
4. Node version: 20

### 方式二：Wrangler CLI

```bash
npm run build
npx wrangler pages deploy out --project-name <your-project-name>
```

## 访问模型

文档入口只使用两种访问级别：

1. `public`：OpenAPI contract、Quick Guide 和 Growatt Codes 等公开文档
2. `Zero Trust`：Protocol Mapping、ShineTools 等内部资料，由 Cloudflare Access 保护

不再使用共享密码或 HTTP Basic Auth。

## 文档维护约束

1. 英文主 SSOT 仅编辑 `Growatt API/OPENAPI/*.md`
2. 中文对齐版编辑源为 `Growatt API/OPENAPI.zh-CN/*.md`
3. Quick Guide 编辑源分别为 `Growatt API/Growatt Open API Professional Integration Guide.md` 和 `Growatt API/Growatt Open API Professional Integration Guide.zh-CN.md`
4. `Growatt API/Growatt Unified API.md` 仅作为参考，不作为主编辑源
5. 新文档命名必须符合 `NN_descriptive_name.md`（适用于 `OPENAPI` 与 `OPENAPI.zh-CN`）
6. 更新 API 文档时同步维护 `Growatt API/OPENAPI/README.md` 与 `Growatt API/OPENAPI.zh-CN/README.md` 的版本和目录

## 专题分析文档

- [ShineTools 能量管理设置 Product Handbook](./docs/shinetools-settings/README.md)
- 部署入口：`/shinetools/`（由 Cloudflare Zero Trust 保护）
