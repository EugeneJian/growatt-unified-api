# ProtocolMapping JSON SSOT

本目录把协议维护收敛到 JSON SSOT。PDF / Markdown 是来源或审阅层，不作为长期维护主数据。

## 结构

| 路径 | 用途 |
|---|---|
| `机型DTC及固件命名规范V06_结构化Markdown.md` | 人工可审阅的来源文档 |
| `古瑞瓦特逆变器VPP通信协议V2.05_20260529（临时版本）.pdf` | VPP 协议 PDF 发布来源 / 升级校验输入 |
| `古瑞瓦特逆变器VPP通信协议V2.05_20260529_结构化Markdown.md` | 从 VPP PDF 抽取生成的人工审阅层，不是主数据 |
| `scripts/extract_protocol_ssot.py` | 从 Markdown 表格抽取 JSON SSOT |
| `scripts/extract_vpp_pdf.py` | 从 VPP PDF 表格抽取结构化数据；默认不回填 SSOT，可用于 PDF 升级校验 |
| `data/protocol_ssot.json` | 寄存器段、字段级寄存器、DTC、关联、重叠告警的唯一主数据 |
| `data/vpp_protocol_v2_05.json` | VPP V2.05 字段级寄存器结构化审阅数据 |
| `data/protocol_ssot.schema.json` | JSON 结构约束 |
| `register_map_visual.html` | 统一可视化入口：寄存器 Mapping + DTC 机型类型表 |
| `register_detail.html` | 单个功能块的详细寄存器表 |
| `register_index.html` | 兼容旧链接的跳转页 |
| `dtc_ssot_ui.js` | DTC code、代称、hover helper、分类分组的唯一前端表达层 |

## SSOT 原则

`data/protocol_ssot.json` 是唯一主数据。工程内页面、导航和详细表都从它读取；发布到 Open API 站点时，构建脚本会把页面需要的数据内联进 HTML，不对外发布原始 JSON SSOT 文件。

PDF 升级时不要直接覆盖 SSOT。正确流程是：

1. 从新版 PDF 抽取临时结构化结果。
2. 将临时结果和当前 JSON SSOT 做差异校验。
3. 人工评审差异：确认是 PDF 新增、PDF 排版抽取误差，还是 SSOT 需要修正。
4. 只有评审确认采纳后，才更新 JSON SSOT。

## 更新流程

1. 更新 `机型DTC及固件命名规范V06_结构化Markdown.md`。
2. 重新生成 JSON：

   ```bash
   python3 ProtocolMapping/scripts/extract_protocol_ssot.py
   ```

3. 如果 VPP PDF 有升级，先校验 PDF 与当前 JSON SSOT 的差异，不回写主数据：

   ```bash
   python3 ProtocolMapping/scripts/extract_vpp_pdf.py \
     --pdf ProtocolMapping/古瑞瓦特逆变器VPP通信协议V2.05_20260529（临时版本）.pdf \
     --validate-against-ssot \
     --validation-report /tmp/vpp_pdf_validation_report.json
   ```

   校验结果为 `OK` 时，说明 PDF 抽取结果与当前 SSOT 一致。若发现差异，先审阅 `/tmp/vpp_pdf_validation_report.json`。

4. 如果评审确认要采纳 PDF 差异，再显式回填 SSOT：

   ```bash
   python3 ProtocolMapping/scripts/extract_vpp_pdf.py \
     --pdf ProtocolMapping/古瑞瓦特逆变器VPP通信协议V2.05_20260529（临时版本）.pdf \
     --update-ssot
   ```

   当前 VPP V2.05 PDF 已抽取：

   | 功能码 | 地址段 | 结构化行 | 覆盖寄存器数 |
   |---|---:|---:|---:|
   | `0x03 Holding Register` | `30000~32099` | 117 | 1100 |
   | `0x04 Input Register` | `31000~31999` | 93 | 600 |

   说明：地址段是协议预留的公共范围；PDF 当前只展开其中有定义的字段或块。

5. 打开导航页验证：

   ```bash
   cd ProtocolMapping
   python3 -m http.server 8080
   ```

6. 访问 `http://127.0.0.1:8080/register_map_visual.html`。

## Open API 站点发布

Protocol SSOT 在线上随 Open API 文档站点发布，入口为：

```text
/growatt-openapi/protocol-mapping/register_map_visual.html
```

仓库根目录执行 `npm run build` 时，会自动将以下文件导出到 `out/growatt-openapi/protocol-mapping/`：

- `index.html`
- `register_map_visual.html`
- `register_detail.html`
- `register_index.html`

线上访问控制使用 Cloudflare Access，策略路径为 `/growatt-openapi/protocol-mapping*`。原始 `data/*.json` 只保留在工程目录，不进入发布产物；线上页面只提供 visual map 和详细寄存器视图。

Open API 站点还包含一个 Pages Function fail-closed 防线：请求必须带有 Cloudflare Access 注入的 `Cf-Access-Jwt-Assertion` header 才会放行。它不替代 Access policy，只用于防止线上域名漏配 Access 时直接公开 SSOT。

## 建模原则

字段语义不要只用地址判断，应使用以下联合主键：

```text
DTC + 功能码 + 地址 + Register Profile + 协议版本
```

当前 JSON 已包含：

- `register_profiles`: 公共寄存器地址段。
- `dtc_type_groups`: DTC 类型分类 SSOT；首页和寄存器详情页都按这里的分类显示。
- `dtc_codes`: DTC code 级 SSOT 表；一个 DTC 一条记录，属性包含产品分类、代称、机型全称、区域、生命周期、上传字段、固件示例和来源。
- `device_model_dtcs`: DTC 与机型、固件、上传字段的明细记录；同一个 DTC 可对应多条机型记录。
- `derived.register_profile_overlaps`: 地址重叠告警。
- `derived.register_profile_dtc_links`: 寄存器段和 DTC 的直接/推断关联。

界面展示 DTC 时显示 `dtc_codes[].code` + 第一代称。详细属性必须从 `dtc_codes` 的同一条记录渲染为 hover / focus helper，不在页面中重复铺开多列表格，避免 UI 与 SSOT 属性脱节。页面不得各自实现 DTC chip/card；统一复用 `dtc_ssot_ui.js`。

DTC 可视化按 `dtc_type_groups` 中的以下类型聚合：

| 类型 | 来源产品分类 |
|---|---|
| `PV_Inverter` | 户用光伏逆变器、工商业光伏逆变器 |
| `Hybrid_Inverter` | 户用预备储能逆变器、户用并离网储能一体机 |
| `PCS` | 商用储能逆变器 |
| `Off_Grid_Inverter` | 离网储能逆变器 |
| `Battery` | BDC 电池、高低压电池、纯电池 |
| `SYN` | SYN |
| `Water_Pump` | 水泵光伏逆变器 |

逐寄存器字段详情写入 `register_profiles[].registers`。Visual map 的每个功能块会进入对应 `register_detail.html#<register_profile_id>`。VPP V2.05 已从 PDF 抽取并回填；后续导入 SunSpec、事件日志等字段级清单时，应沿用同一结构，并保留 `protocol_version` 与适用 DTC/机型信息。
