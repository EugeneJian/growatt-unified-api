# Cloudflare Pages Deployment

该项目为 Next.js 静态导出模式（`output: "export"`），构建后产物目录为 `out`。

## Dashboard 部署

1. 在 Cloudflare Pages 创建项目并连接仓库
2. 配置：
   - Framework preset: `Next.js (Static HTML Export)`
   - Build command: `npm run build`
   - Build output directory: `out`
   - Node.js version: `20`
3. 首次部署完成后，访问：
   - `/growatt-openapi`

## CLI 部署

```bash
npm run build
npx wrangler pages deploy out --project-name <your-project-name>
```

`wrangler.toml` 已默认指定 `pages_build_output_dir = "out"`。

## Growatt Codes 单页 Basic Auth

仓库已包含 Cloudflare Pages Functions 与 `public/_routes.json`，仅对以下路径启用边缘鉴权：

- `/growatt-openapi/growatt-codes`
- `/growatt-openapi/growatt-codes/*`

在 Cloudflare Pages 项目设置中添加以下环境变量即可启用：

1. `GROWATT_CODES_BASIC_AUTH_PASSWORD`

建议配置方式：

1. 密码建议使用 Cloudflare 加密 secret，并保持变量名为 `GROWATT_CODES_BASIC_AUTH_PASSWORD`

行为说明：

1. 未携带正确凭证时返回 `401 Unauthorized`
2. 若未配置上述变量，受保护页面返回 `503`
3. 其他文档页不经过该 Basic Auth 逻辑
4. 浏览器的 Basic Auth 弹窗通常仍会显示用户名字段，但服务端只校验密码，用户名会被忽略

## GitHub Actions 自动部署（可选）

仓库已提供：

- `.github/workflows/cloudflare-pages-deploy.yml`

需要在仓库 Secrets/Variables 中配置：

1. `CLOUDFLARE_API_TOKEN`（Secret）
2. `CLOUDFLARE_ACCOUNT_ID`（Secret）
3. `CLOUDFLARE_PAGES_PROJECT`（Variable，可选，默认 `growatt-openapi-docs`）

## 发布检查

```bash
npm run docs:check
npm run build
```

通过后再触发 Cloudflare 发布。
