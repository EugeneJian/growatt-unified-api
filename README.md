# Growatt OpenAPI Docs Site

本项目已重构为纯文档站，不再包含任何 Vercel/代理 API 能力。

## 目标

1. 使用 `Growatt API/OPENAPI/*.md` 作为 API 文档主 SSOT。
2. 使用 `Growatt API/Growatt Open API Professional Integration Guide.md` 作为 Quick Guide 源。
3. 将 Markdown 在构建期渲染为可读 HTML 文档站。
4. 部署到 Cloudflare Pages（静态输出目录：`out`）。

## 路由

1. `/`：项目首页（文档入口）
2. `/growatt-openapi`：文档总览
3. `/growatt-openapi/quick-guide`：Professional Integration Quick Guide
4. `/growatt-openapi/{docSlug}`：API 详情页（静态生成）

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

## 文档维护约束

1. 仅编辑 `Growatt API/OPENAPI/*.md`
2. Quick Guide 编辑源为 `Growatt API/Growatt Open API Professional Integration Guide.md`
3. `Growatt API/Growatt Unified API.md` 仅作为参考，不作为主编辑源
4. 新文档命名必须符合 `NN_descriptive_name.md`（仅适用于 `OPENAPI` 目录）
5. 更新 API 文档时同步维护 `Growatt API/OPENAPI/README.md` 的版本和目录
