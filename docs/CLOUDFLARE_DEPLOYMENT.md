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
