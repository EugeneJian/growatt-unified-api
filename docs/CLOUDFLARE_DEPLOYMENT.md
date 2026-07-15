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
   - `/protocol-mapping/index.html`
   - `/growatt-openapi/protocol-mapping/index.html`

## CLI 部署

```bash
npm run build
npx wrangler pages deploy out --project-name <your-project-name>
```

`wrangler.toml` 已默认指定 `pages_build_output_dir = "out"`。

## Growatt Protocol Mapping 发布与 Cloudflare Access

`ProtocolMapping/` 是协议 SSOT 的源码目录。`ProtocolMapping/ssot/protocol_ssot.json` 是唯一主数据；`ProtocolMapping/ui/` 是发布页面；`ProtocolMapping/sources/` 是 PDF、抽取稿和审阅覆盖层；`ProtocolMapping/tools/` 是生成脚本。线上只发布经过筛选的静态页面和无数据 UI helper，构建脚本会将页面运行所需数据内联到 HTML，不发布原始 SSOT JSON 或来源文件。

- Canonical VPP path: `/protocol-mapping/`
- Compatibility path: `/growatt-openapi/protocol-mapping/`
- Custom VPP domain: `https://vpp.myshine.online/protocol-mapping/`
- OPENAPI contract: `https://vpp.myshine.online/growatt-openapi`

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
2. 新建或更新 `Self-hosted` Access Application：
   - Name: `Growatt Protocol Mapping (growatt-protocol-mapping)`
   - Public hostname target 1: `vpp.myshine.online` + `/protocol-mapping*`
   - Public hostname target 2: `vpp.myshine.online` + `/growatt-openapi/protocol-mapping*`
   - Public hostname target 3: `growatt-openapi-docs.pages.dev` + `/growatt-openapi/protocol-mapping*`
3. 新建或更新 Allow policy：
   - Policy name: `Protocol SSOT Readers`
   - Include: `Emails ending in @growatt.com`
   - Include: 外部评审邮箱白名单，初始可为空
   - Session duration: `30 days`
     - 若后续安全策略要求更短，可降为 `7 days`；不要低于 `7 days`，避免评审人员频繁重复 OTP 登录。

`growatt-openapi` 只表示 Cloud API contract，必须保持公开。Growatt Protocol Mapping 的正式入口使用 `/protocol-mapping/`；`/growatt-openapi/protocol-mapping/` 仅作为兼容入口保留并受同等 Access 保护。

保护路径必须覆盖整个 Protocol Mapping 目录。特别确认以下地址未登录时会进入 Access OTP 登录页：

- `https://vpp.myshine.online/protocol-mapping/index.html`
- `https://vpp.myshine.online/protocol-mapping/register_map_visual.html`
- `https://vpp.myshine.online/protocol-mapping/documentation.html`
- `https://vpp.myshine.online/growatt-openapi/protocol-mapping/index.html`

同时确认 OPENAPI contract 仍然公开访问：

- `https://vpp.myshine.online/growatt-openapi`
- `https://growatt-openapi-docs.pages.dev/growatt-openapi`

原始 JSON SSOT 不作为线上公开资源发布。若直接访问 `/protocol-mapping/ssot/protocol_ssot.json` 或 `/growatt-openapi/protocol-mapping/ssot/protocol_ssot.json`，未登录时可能先被 Access 拦截；通过 Access 后也应是 `404`，而不是返回 JSON 内容。

Cloudflare Access 只能按域名与 path 授权，不能按 `#fc03...` 这类浏览器 hash 授权。

仓库同时包含一个 Pages Function fail-closed 防线：`/protocol-mapping*` 和 `/growatt-openapi/protocol-mapping*` 请求必须带有 Cloudflare Access 注入的 `Cf-Access-Jwt-Assertion` header 才会放行。它不替代 Access policy，只防止生产域名漏配 Access 时直接暴露协议页面。只有受控环境需要绕过时，才设置 `PROTOCOL_MAPPING_ALLOW_UNPROTECTED=true`。

## ShineTools 能量管理设置产品文档与 Cloudflare Access

ShineTools 能量管理设置 Product Handbook 与来源证据使用独立内部入口，不并入公开 Open API contract：

- Canonical path: `/shinetools/`
- Custom domain: `https://vpp.myshine.online/shinetools/`
- Pages domain: `https://growatt-openapi-docs.pages.dev/shinetools/`
- Access Application: `ShineTools Settings Docs (shinetools-settings-docs)`

在 Cloudflare Zero Trust 中为两个 hostname 的 `/shinetools*` 建立独立 `Self-hosted` Access Application。建议策略名为 `ShineTools Settings Readers`，内部读者使用 `@growatt.com` 邮箱域，外部评审使用带负责人和到期时间的 Access Group；默认会话时长为 `7 days`。

`public/_routes.json` 和 `functions/shinetools*` 提供第二层 fail-closed 防线。缺少 `Cf-Access-Jwt-Assertion` 时返回 `403`；已认证响应统一设置 `Cache-Control: private, no-store` 和 `X-Robots-Tag: noindex, nofollow, noarchive`。生产环境禁止设置 `SHINETOOLS_ALLOW_UNPROTECTED=true`。

完整发布清单、权限治理和验证矩阵见：

- [`docs/shinetools-settings/03-deployment-and-access.md`](./shinetools-settings/03-deployment-and-access.md)

## 访问模型

部署只保留两种访问级别：

1. `public`：`/growatt-openapi*` 下的 OpenAPI contract、Quick Guide 和 Growatt Codes；其中 Protocol Mapping 兼容路径除外
2. `Zero Trust`：`/protocol-mapping*`、`/growatt-openapi/protocol-mapping*` 和 `/shinetools*`，由 Cloudflare Access 与对应的 Pages Function fail-closed 防线保护

`/growatt-openapi/growatt-codes*` 是公开路径，不应加入 `public/_routes.json`，也不需要密码、共享 secret 或 HTTP Basic Auth。若 Cloudflare Pages 项目仍保存 `GROWATT_CODES_BASIC_AUTH_PASSWORD`，可在发布新版本后删除该遗留变量。

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
