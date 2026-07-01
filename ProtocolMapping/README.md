# ProtocolMapping

本目录维护 Growatt 协议映射与寄存器视图。核心原则是：SSOT、UI、原始来源文档分开存放，避免 PDF、抽取稿、页面展示和可维护主数据互相覆盖。

## Directory Contract

| 路径 | 类型 | 用途 |
|---|---|---|
| `ssot/protocol_ssot.json` | SSOT | 寄存器段、字段级寄存器、DTC、关联、重叠告警的唯一主数据 |
| `ssot/protocol_ssot.schema.json` | SSOT contract | JSON 结构约束 |
| `ui/index.html` | UI | 云·边·端导航入口：云 → Open API，边 → Unified RTU Protocol 预留，端 → Unified Device RTU 寄存器图 |
| `ui/register_map_visual.html` | UI | 统一可视化入口：寄存器 Mapping + DTC 机型类型表 |
| `ui/register_detail.html` | UI | 单个功能块的详细寄存器表 |
| `ui/register_index.html` | UI | 兼容旧链接的跳转页 |
| `ui/dtc_ssot_ui.js` | UI helper | DTC code、代称、hover helper、分类分组的唯一前端表达层 |
| `ui/protocol_locale_ui.js` | UI helper | 协议页面多语言 UI helper |
| `ui/locales/*.json` | UI source | 页面文案，不是协议主数据 |
| `ui/experiments/` | UI draft | 未发布的导航/页面草稿 |
| `sources/device-model-dtc/v06/` | raw / review source | 机型 DTC 与固件命名规范的结构化审阅稿 |
| `sources/protocols/vpp/v2.05/raw/` | raw source | VPP V2.05 PDF 发布来源 / 升级校验输入 |
| `sources/protocols/vpp/v2.05/extracted/` | generated review source | 从 VPP PDF 抽取生成的结构化 JSON / Markdown，不是主数据 |
| `sources/protocols/vpp/v2.05/overlays/` | reviewed overlay | 人工审阅后的翻译/修正覆盖层 |
| `tools/` | pipeline | 从来源文档抽取、校验、回填 SSOT 的脚本 |

## SSOT Rules

`ssot/protocol_ssot.json` 是唯一主数据。工程内页面、导航和详细表都从它读取；发布到 Open API 站点时，构建脚本会把页面需要的数据内联进 HTML，不对外发布原始 JSON SSOT 文件。

以下内容不是 SSOT：

- `sources/**/raw/*`：原始 PDF 或来源材料，只作为证据与升级输入。
- `sources/**/extracted/*`：机器抽取出来的审阅层，只能用于对比、评审、回填前校验。
- `ui/**`：页面展示层，不得单独复制协议字段语义。
- `ui/locales/*.json`：界面文案，不得承载协议事实。

字段语义不要只用地址判断，应使用以下联合主键：

```text
DTC + 功能码 + 地址 + Register Profile + 协议版本
```

## Update Flow

1. 更新来源审阅稿：

   ```bash
   ProtocolMapping/sources/device-model-dtc/v06/机型DTC及固件命名规范V06_结构化Markdown.md
   ```

2. 重新生成 JSON SSOT：

   ```bash
   python3 ProtocolMapping/tools/extract_protocol_ssot.py
   ```

3. 如果 VPP PDF 有升级，先校验 PDF 与当前 JSON SSOT 的差异，不直接回写主数据：

   ```bash
   python3 ProtocolMapping/tools/extract_vpp_pdf.py \
     --pdf ProtocolMapping/sources/protocols/vpp/v2.05/raw/古瑞瓦特逆变器VPP通信协议V2.05_20260529（临时版本）.pdf \
     --validate-against-ssot \
     --validation-report /tmp/vpp_pdf_validation_report.json
   ```

4. 如果评审确认要采纳 PDF 差异，再显式回填 SSOT：

   ```bash
   python3 ProtocolMapping/tools/extract_vpp_pdf.py \
     --pdf ProtocolMapping/sources/protocols/vpp/v2.05/raw/古瑞瓦特逆变器VPP通信协议V2.05_20260529（临时版本）.pdf \
     --update-ssot
   ```

5. 本地验证 UI：

   ```bash
   python3 -m http.server 8080 --directory ProtocolMapping
   ```

   访问：

   ```text
   http://127.0.0.1:8080/ui/index.html
   http://127.0.0.1:8080/ui/register_map_visual.html
   ```

## Future Protocol Layout

新增协议时沿用同一结构：

```text
ProtocolMapping/sources/protocols/<protocol>/<version>/
  raw/
  extracted/
  overlays/
```

示例：

```text
ProtocolMapping/sources/protocols/sunspec/v1.0/raw/
ProtocolMapping/sources/protocols/event-log/v1.0/extracted/
```

只有经过人工评审并写入 `ssot/protocol_ssot.json` 的内容，才是可被 UI、Open API 文档站点、AI 工具或协议适配代码引用的事实。

## Current VPP Import

当前 VPP V2.05 PDF 已抽取并回填到 SSOT：

| 功能码 | 地址段 | 结构化行 | 覆盖寄存器数 |
|---|---:|---:|---:|
| `0x03 Holding Register` | `30000~32099` | 117 | 1100 |
| `0x04 Input Register` | `31000~31999` | 93 | 600 |

说明：地址段是协议预留的公共范围；PDF 当前只展开其中有定义的字段或块。

## Open API Site Publish

Protocol Mapping 在线上随 Open API 文档站点发布，入口为：

```text
/growatt-openapi/protocol-mapping/index.html
/growatt-openapi/protocol-mapping/register_map_visual.html
```

仓库根目录执行 `npm run build` 时，会自动将以下 UI 文件导出到 `out/growatt-openapi/protocol-mapping/`：

- `index.html`
- `register_map_visual.html`
- `register_detail.html`
- `register_index.html`
- `protocol_locale_ui.js`
- `dtc_ssot_ui.js`

线上访问控制使用 Cloudflare Access，策略路径为 `/growatt-openapi/protocol-mapping*`。原始 `ssot/*.json`、`sources/**`、`tools/**` 只保留在工程目录，不进入发布产物；线上页面只提供导航、visual map 和详细寄存器视图。

Open API 站点还包含一个 Pages Function fail-closed 防线：请求必须带有 Cloudflare Access 注入的 `Cf-Access-Jwt-Assertion` header 才会放行。它不替代 Access policy，只用于防止线上域名漏配 Access 时直接公开协议页面。

## Modeling Notes

当前 JSON 已包含：

- `register_profiles`: 公共寄存器地址段与字段级寄存器。
- `dtc_type_groups`: DTC 类型分类 SSOT；首页和寄存器详情页都按这里的分类显示。
- `dtc_codes`: DTC code 级 SSOT 表；一个 DTC 一条记录。
- `device_model_dtcs`: DTC 与机型、固件、上传字段的明细记录。
- `derived.register_profile_overlaps`: 地址重叠告警。
- `derived.register_profile_dtc_links`: 寄存器段和 DTC 的直接/推断关联。

界面展示 DTC 时显示 `dtc_codes[].code` + 第一代称。详细属性必须从 `dtc_codes` 的同一条记录渲染为 hover / focus helper，不在页面中重复铺开多列表格，避免 UI 与 SSOT 属性脱节。页面不得各自实现 DTC chip/card；统一复用 `ui/dtc_ssot_ui.js`。

逐寄存器字段详情写入 `register_profiles[].registers`。Visual map 的每个功能块会进入对应 `register_detail.html#<register_profile_id>`。后续导入 SunSpec、事件日志等字段级清单时，应沿用同一结构，并保留 `protocol_version` 与适用 DTC/机型信息。
