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
   - `/growatt-openapi/protocol-mapping/index.html`

## CLI 部署

```bash
npm run build
npx wrangler pages deploy out --project-name <your-project-name>
```

`wrangler.toml` 已默认指定 `pages_build_output_dir = "out"`。

## Protocol SSOT 发布与 Cloudflare Access

`ProtocolMapping/` 是协议 SSOT 的源码目录。`ProtocolMapping/ssot/protocol_ssot.json` 是唯一主数据；`ProtocolMapping/ui/` 是发布页面；`ProtocolMapping/sources/` 是 PDF、抽取稿和审阅覆盖层；`ProtocolMapping/tools/` 是生成脚本。线上只发布经过筛选的静态页面和无数据 UI helper，构建脚本会将页面运行所需数据内联到 HTML，不发布原始 SSOT JSON 或来源文件。

- `/growatt-openapi/protocol-mapping/`

`npm run build` 会在 `next build` 后自动执行：

```bash
npm run protocol:export
```

发布内容：

- `index.html`
- `register_map_visual.html`
- `register_detail.html`
- `register_index.html`
- `protocol_locale_ui.js`
- `dtc_ssot_ui.js`

不发布原始 PDF、抽取脚本、结构化 Markdown 审阅稿，也不发布 `ssot/*.json` 或 `sources/**`。

### Access 策略

在 Cloudflare Zero Trust Dashboard 中配置：

1. 启用登录方式：`One-time PIN`
2. 新建 `Self-hosted` Access Application：
   - Name: `Growatt Protocol SSOT`
   - Domain: 当前 Open API 文档生产域名
   - Path: `/growatt-openapi/protocol-mapping*`
3. 新建 Allow policy：
   - Policy name: `Protocol SSOT Readers`
   - Include: `Emails ending in @growatt.com`
   - Include: 外部评审邮箱白名单，初始可为空
   - Session duration: `12 hours`

保护路径必须覆盖整个 Protocol Mapping 目录。特别确认以下地址未登录时会进入 Access OTP 登录页：

- `/growatt-openapi/protocol-mapping/index.html`
- `/growatt-openapi/protocol-mapping/register_map_visual.html`

原始 JSON SSOT 不作为线上公开资源发布。若直接访问 `/growatt-openapi/protocol-mapping/ssot/protocol_ssot.json`，未登录时可能先被 Access 拦截；通过 Access 后也应是 `404`，而不是返回 JSON 内容。

Cloudflare Access 只能按域名与 path 授权，不能按 `#fc03...` 这类浏览器 hash 授权。

仓库同时包含一个 Pages Function fail-closed 防线：`/growatt-openapi/protocol-mapping*` 请求必须带有 Cloudflare Access 注入的 `Cf-Access-Jwt-Assertion` header 才会放行。它不替代 Access policy，只防止生产域名漏配 Access 时直接暴露协议页面。只有受控环境需要绕过时，才设置 `PROTOCOL_MAPPING_ALLOW_UNPROTECTED=true`。

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
