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
4. `/growatt-openapi/growatt-codes`：Growatt Codes appendix（可选 Cloudflare 边缘 Basic Auth）
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

## Growatt Codes 单页密码保护

仓库已为 `/growatt-openapi/growatt-codes` 和其子路径准备好 Cloudflare Pages Function Basic Auth。

在 Cloudflare Pages 项目中配置以下环境变量后即可生效：

1. `GROWATT_CODES_BASIC_AUTH_PASSWORD`

建议：

1. `GROWATT_CODES_BASIC_AUTH_PASSWORD` 建议作为加密 secret 保存

说明：

1. 该保护只在 Cloudflare 边缘层生效，不影响其他文档页
2. `npm run dev` 仍然是本地 Next.js 开发模式，不会模拟 Pages Function 鉴权
3. 由于使用的是 HTTP Basic Auth，浏览器弹窗里通常仍会显示用户名输入框，但服务端只校验密码，用户名会被忽略

## 文档维护约束

1. 英文主 SSOT 仅编辑 `Growatt API/OPENAPI/*.md`
2. 中文对齐版编辑源为 `Growatt API/OPENAPI.zh-CN/*.md`
3. Quick Guide 编辑源分别为 `Growatt API/Growatt Open API Professional Integration Guide.md` 和 `Growatt API/Growatt Open API Professional Integration Guide.zh-CN.md`
4. `Growatt API/Growatt Unified API.md` 仅作为参考，不作为主编辑源
5. 新文档命名必须符合 `NN_descriptive_name.md`（适用于 `OPENAPI` 与 `OPENAPI.zh-CN`）
6. 更新 API 文档时同步维护 `Growatt API/OPENAPI/README.md` 与 `Growatt API/OPENAPI.zh-CN/README.md` 的版本和目录
