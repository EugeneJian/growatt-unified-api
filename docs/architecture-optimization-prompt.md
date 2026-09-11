# Growatt OpenAPI 文档架构优化提示词

基于 Stripe API 文档的最佳实践，本提示词用于指导 Growatt OpenAPI 文档站的架构优化。

---

## 一、整体架构原则

### 1.1 用户旅程驱动的三层架构

```
第一层：用户识别与快速入门
    ↓
第二层：概念基础与核心能力
    ↓
第三层：API 详情与高级用例
```

**当前状态**：Growatt 文档采用线性编号（01-15），缺少角色导向和场景化入口

**优化方向**：
- 首页增加**角色识别**模块：集成商开发者 / 终端用户 / VPP 运营商
- 为不同角色提供**定制化导航路径**
- 改造为**场景驱动** + **资源索引**的混合架构

---

## 二、页面布局优化

### 2.1 三栏响应式布局（参考 Stripe）

```
┌─────────────┬──────────────────────────┬─────────────────┐
│  左侧导航   │   主内容区               │  右侧代码示例    │
│             │                          │                 │
│  - 快速入门 │  # 端点标题              │  ```bash        │
│  - 认证     │  端点描述                │  curl ...       │
│  - 设备授权 │                          │  ```            │
│  - 设备控制 │  ## 参数                 │                 │
│  - 数据读取 │  参数表格                │  ```json        │
│  - 推送订阅 │                          │  响应示例       │
│             │  ## 响应                 │  ```            │
└─────────────┴──────────────────────────┴─────────────────┘
```

**实现要点**：
- 左侧导航固定，支持折叠/展开
- 主内容区宽度适中（最大 65ch），保证可读性
- 右侧代码区**同步滚动**，响应式隐藏（移动端）

---

## 三、内容组织优化

### 3.1 从编号制改为场景化分类

**现状**：
```
01_authentication.md
02_api_access_token.md
03_api_refresh.md
...
```

**优化后**：
```
getting-started/
  ├─ quickstart.md               # 3 分钟快速开始
  ├─ authentication.md           # 认证概述
  └─ sandbox-environment.md      # 测试环境说明

authentication/
  ├─ overview.md                 # 认证流程总览
  ├─ access-token.md             # 获取访问令牌
  ├─ refresh-token.md            # 刷新令牌
  └─ api-keys.md                 # API Key 管理

device-control/
  ├─ authorization.md            # 设备授权
  ├─ dispatch-commands.md        # 下发指令
  ├─ read-dispatch-status.md     # 查询指令状态
  └─ supported-commands.md       # 支持的指令列表

device-data/
  ├─ get-device-info.md          # 获取设备信息
  ├─ get-realtime-data.md        # 获取实时数据
  └─ historical-data.md          # 历史数据查询

webhooks/
  └─ device-push.md              # 设备推送订阅

reference/
  ├─ global-params.md            # 全局参数
  ├─ error-codes.md              # 错误码
  ├─ rate-limiting.md            # 限流说明
  └─ ess-terminology.md          # 储能术语表

advanced/
  ├─ ess-semantic-model.md       # 语义模型
  └─ troubleshooting.md          # 故障排查
```

**核心改变**：
1. **去编号化**：使用语义化文件名
2. **分类聚合**：按业务场景（认证、控制、数据）而非 API 顺序
3. **渐进式深度**：getting-started → 核心功能 → reference → advanced

---

### 3.2 首页设计（参考 Stripe 角色识别）

```markdown
# Growatt OpenAPI 文档

## 🚀 刚开始使用？

### 集成商开发者
[5分钟快速开始](getting-started/quickstart.md) → 
从获取 API Key 到第一次设备控制

### VPP 运营商
[批量设备管理指南](use-cases/vpp-operators.md) → 
虚拟电厂场景的最佳实践

### 非开发者用户
[使用 ShineTools 管理设备](no-code/shinetools.md) → 
无需编程的设备管理方案

---

## 🔑 核心能力

| 认证 | 设备控制 | 数据读取 | 推送订阅 |
|------|---------|---------|---------|
| OAuth 2.0 流程 | 充放电指令 | 实时/历史数据 | WebHook 订阅 |
| [详细文档](authentication/) | [详细文档](device-control/) | [详细文档](device-data/) | [详细文档](webhooks/) |

---

## 📚 API 参考

- [全局参数](reference/global-params.md)
- [错误码表](reference/error-codes.md)
- [限流说明](reference/rate-limiting.md)
- [储能术语](reference/ess-terminology.md)

---

## ⚙️ 高级主题

- [ESS 语义模型](advanced/ess-semantic-model.md)
- [故障排查指南](advanced/troubleshooting.md)
- [API 版本管理](advanced/versioning.md)
```

---

## 四、API 端点页面设计

### 4.1 标准端点文档模板（参考 Stripe）

```markdown
# [端点名称]

> ⚠️ **状态标识**：生产 / Beta / 即将弃用

[一句话描述端点用途]

**典型场景**：[业务场景说明]

---

## 快速示例

```bash
curl -X POST "https://openapi.growatt.com/v1/device/dispatch" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "device_sn": "ABC12345",
    "command": "active_power",
    "value": -5000
  }'
```

---

## 请求

### HTTP Method
```
POST /v1/device/dispatch
```

### Headers

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| Authorization | string | ✅ | Bearer token，[如何获取](../authentication/access-token.md) |
| Content-Type | string | ✅ | 必须为 `application/json` |

### Body Parameters

<table>
  <tr>
    <th>参数</th>
    <th>类型</th>
    <th>必填</th>
    <th>描述</th>
  </tr>
  <tr>
    <td><code>device_sn</code></td>
    <td>string</td>
    <td>✅</td>
    <td>
      设备序列号<br/>
      <em>示例：</em> <code>ABC12345678</code>
    </td>
  </tr>
  <tr>
    <td><code>command</code></td>
    <td>enum</td>
    <td>✅</td>
    <td>
      指令类型，支持：<br/>
      • <code>active_power</code> - 有功功率控制<br/>
      • <code>reactive_power</code> - 无功功率控制<br/>
      • <code>charge_discharge</code> - 充放电模式<br/>
      <a href="../reference/supported-commands.md">查看完整列表</a>
    </td>
  </tr>
  <tr>
    <td><code>value</code></td>
    <td>integer</td>
    <td>✅</td>
    <td>
      指令参数值<br/>
      <strong>约束：</strong><br/>
      • 有功功率：-50000 ~ 50000 W<br/>
      • 负值表示放电，正值表示充电<br/>
      <strong>设备限制：</strong> 实际范围取决于设备额定功率
    </td>
  </tr>
  <tr>
    <td><code>metadata</code></td>
    <td>object</td>
    <td>可选</td>
    <td>
      自定义元数据（最多 50 个键值对）<br/>
      <em>用途：</em> 追踪业务标识、订单号等
    </td>
  </tr>
  <tr>
    <td style="padding-left: 2em;">↳ <code>metadata.order_id</code></td>
    <td>string</td>
    <td>可选</td>
    <td>业务订单 ID</td>
  </tr>
  <tr>
    <td style="padding-left: 2em;">↳ <code>metadata.vpp_id</code></td>
    <td>string</td>
    <td>可选</td>
    <td>VPP 聚合商标识</td>
  </tr>
</table>

---

## 响应

### 成功响应 (200 OK)

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "dispatch_id": "disp_1MmlLrLkdIw...",
    "device_sn": "ABC12345",
    "command": "active_power",
    "value": -5000,
    "status": "pending",
    "created_at": "2026-08-04T10:30:00Z",
    "expires_at": "2026-08-04T10:35:00Z"
  }
}
```

**响应字段说明**：

| 字段 | 类型 | 描述 |
|------|------|------|
| `code` | integer | 业务状态码，0 表示成功 |
| `message` | string | 响应消息 |
| `data.dispatch_id` | string | 指令唯一标识，用于[查询指令状态](./read-dispatch-status.md) |
| `data.status` | enum | 指令状态：`pending`（等待下发）/ `sent`（已发送）/ `executed`（已执行）/ `failed`（失败） |
| `data.created_at` | ISO 8601 | 指令创建时间 |
| `data.expires_at` | ISO 8601 | 指令过期时间（未执行则自动取消） |

---

## 错误响应

### 常见错误

| HTTP 状态码 | code | message | 原因与解决 |
|------------|------|---------|----------|
| 401 | 1001 | Invalid token | Token 过期或无效，[重新获取](../authentication/access-token.md) |
| 403 | 2003 | Device not authorized | 设备未授权，需先调用[设备授权接口](./authorization.md) |
| 400 | 3001 | Invalid command value | `value` 超出设备范围，检查设备额定功率 |
| 429 | 9001 | Rate limit exceeded | 超出限流，参考[限流说明](../reference/rate-limiting.md) |

### 错误示例

```json
{
  "code": 2003,
  "message": "Device not authorized",
  "error_detail": {
    "device_sn": "ABC12345",
    "reason": "Device authorization expired",
    "suggested_action": "Call POST /v1/device/auth again"
  }
}
```

---

## 最佳实践

### ✅ 推荐做法
1. **异步查询状态**：下发指令后通过 `dispatch_id` [查询执行结果](./read-dispatch-status.md)
2. **订阅推送通知**：使用 [WebHook](../webhooks/device-push.md) 获取实时执行状态
3. **错误重试**：遇到 `503` 或 `429` 时采用指数退避策略

### ❌ 常见错误
1. **不检查设备在线状态**：离线设备指令会一直处于 `pending`，应先调用[设备信息接口](../device-data/get-device-info.md)检查
2. **频繁轮询状态**：建议使用 WebHook 而非轮询，避免触发限流
3. **忽略指令过期时间**：超过 `expires_at` 的指令自动失效

---

## 相关 API

- [查询指令状态](./read-dispatch-status.md)
- [获取设备信息](../device-data/get-device-info.md)
- [设备推送订阅](../webhooks/device-push.md)

---

## 变更历史

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| v1.2 | 2026-07-15 | 新增 `metadata` 参数支持 |
| v1.1 | 2026-05-20 | 支持批量指令下发 |
| v1.0 | 2026-01-10 | 初始版本 |
```

---

## 五、交互设计优化

### 5.1 多语言代码示例（参考 Stripe 右侧面板）

**实现方案**：
```jsx
// 组件设计
<CodeExamples
  tabs={['cURL', 'JavaScript', 'Python', 'Java']}
  examples={{
    curl: `curl -X POST ...`,
    javascript: `const response = await fetch(...);`,
    python: `import requests\nresponse = requests.post(...)`,
    java: `HttpClient client = ...`
  }}
  showCopyButton={true}
  highlightPlaceholders={['YOUR_ACCESS_TOKEN', 'ABC12345']}
/>
```

**特性**：
- 自动高亮需要替换的占位符
- 一键复制代码
- 记住用户的语言偏好（localStorage）

---

### 5.2 交互式 API Explorer

**灵感来源**：Stripe 的 "Log in to see docs with your test key"

**Growatt 实现**：
```markdown
## 🧪 试试看

<ApiPlayground
  endpoint="POST /v1/device/dispatch"
  auth="Bearer YOUR_TOKEN"
  defaultParams={{
    device_sn: "YOUR_DEVICE_SN",
    command: "active_power",
    value: -5000
  }}
  sandbox={true}
/>
```

**功能**：
- 用户输入自己的测试 Token 和设备 SN
- 直接在文档中发起真实 API 请求
- 显示实时响应结果
- **沙箱模式**：不实际执行设备指令（仅模拟）

---

### 5.3 参数表格增强

**对比现状与优化**：

| 现状 | 优化后（Stripe 风格） |
|------|---------------------|
| 纯文本描述 | 结构化表格 + 类型标注 |
| 必填性不明确 | ✅ / 可选 标识 |
| 缺少约束说明 | 嵌入最大/最小值、格式要求 |
| 嵌套参数难表达 | 使用缩进 + 点号语法（`metadata.order_id`） |
| 无示例值 | 每行附带真实示例 |

**实现示例**：
```markdown
| 参数 | 类型 | 必填 | 约束 | 示例 |
|------|------|------|------|------|
| `device_sn` | string | ✅ | 长度 10-20 | `ABC12345678` |
| `value` | integer | ✅ | -50000 ~ 50000 | `-5000` |
| ↳ `metadata.vpp_id` | string | 可选 | 最大 64 字符 | `vpp_cn_001` |
```

---

## 六、导航体验优化

### 6.1 面包屑导航（Stripe 特色）

```jsx
<Breadcrumb>
  <Link href="/growatt-openapi">API 文档</Link>
  <Separator>/</Separator>
  <Link href="/growatt-openapi/device-control">设备控制</Link>
  <Separator>/</Separator>
  <Current>下发指令</Current>
</Breadcrumb>
```

---

### 6.2 智能搜索

**参考 Stripe 的实现**：
- 支持搜索端点、参数名、错误码
- 高亮匹配结果
- 键盘快捷键：`Ctrl+K` / `Cmd+K`

**实现工具**：
- 使用 Algolia DocSearch（免费开源文档计划）
- 或自建基于 `flexsearch` 的客户端搜索

---

### 6.3 右侧锚点目录（Table of Contents）

**Stripe 设计**：右侧显示当前页面的标题结构

**Growatt 实现**：
```jsx
<TableOfContents>
  <AnchorLink href="#request">请求</AnchorLink>
  <AnchorLink href="#response">响应</AnchorLink>
  <AnchorLink href="#errors">错误响应</AnchorLink>
  <AnchorLink href="#best-practices">最佳实践</AnchorLink>
</TableOfContents>
```

**特性**：
- 滚动时高亮当前章节
- 移动端隐藏

---

## 七、信息架构对比总结

| 维度 | Growatt 现状 | Stripe 标准 | 优化建议 |
|------|-------------|-------------|---------|
| **组织方式** | 编号线性（01-15） | 场景化分类 | 改为场景目录结构 |
| **首页设计** | 简单列表 | 角色识别 + 快速入门 | 增加角色导航 |
| **端点文档** | 自由格式 | 7 部分标准模板 | 统一为模板化结构 |
| **参数文档** | 描述性文本 | 表格 + 类型 + 约束 | 结构化表格 |
| **代码示例** | 单一 curl | 多语言切换 | 增加 JS/Python/Java |
| **错误处理** | 分散在各处 | 每个端点专门章节 | 标准化错误表格 |
| **导航** | 左侧菜单 | 面包屑 + 锚点目录 + 搜索 | 三重导航体系 |
| **交互性** | 静态文档 | API Playground | 增加沙箱测试功能 |
| **关联链接** | 少量手动链接 | 密集上下文链接 | 增加跨文档引用 |

---

## 八、实施路线图

### Phase 1：结构重组（优先级：高）
1. 将现有 `01-15.md` 重命名为语义化文件名
2. 创建 `getting-started/`、`authentication/`、`device-control/`、`reference/` 等目录
3. 更新 `README.md` 索引为场景化导航

### Phase 2：模板标准化（优先级：高）
1. 制定端点文档标准模板
2. 重构 2-3 个核心端点文档作为示范
3. 批量应用模板到所有端点

### Phase 3：交互增强（优先级：中）
1. 实现多语言代码示例切换
2. 增加一键复制功能
3. 添加面包屑和锚点目录

### Phase 4：高级功能（优先级：低）
1. 集成 API Playground（沙箱模式）
2. 实现智能搜索（Algolia DocSearch）
3. 添加用户反馈组件（"这篇文档有帮助吗？"）

---

## 九、技术实现建议

### 9.1 Next.js 组件设计

```typescript
// components/ApiEndpoint.tsx
interface ApiEndpointProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  parameters: Parameter[];
  responses: Response[];
  examples: CodeExample[];
}

// 自动生成标准格式的端点文档
export function ApiEndpoint(props: ApiEndpointProps) {
  return (
    <div className="api-endpoint">
      <EndpointHeader method={props.method} path={props.path} />
      <Description>{props.description}</Description>
      <ParametersTable parameters={props.parameters} />
      <ResponseSection responses={props.responses} />
      <CodeExamples examples={props.examples} />
    </div>
  );
}
```

### 9.2 Markdown 扩展语法

为了保持文档源的可读性，可以设计自定义 Markdown 语法：

```markdown
:::api-endpoint
method: POST
path: /v1/device/dispatch
auth: required
:::

:::parameter
name: device_sn
type: string
required: true
description: 设备序列号
example: ABC12345
:::
```

通过 remark/rehype 插件转换为 React 组件。

---

## 十、质量保证

### 10.1 文档 Lint 规则（扩展现有 `docs:check`）

```javascript
// 新增检查项
const lintRules = [
  'endpoint-must-have-examples',      // 每个端点必须有代码示例
  'parameter-must-have-type',         // 参数必须标注类型
  'no-broken-internal-links',         // 禁止内部链接失效
  'consistent-terminology',           // 术语一致性检查
  'error-codes-documented',           // 错误码必须在错误表中有对应说明
];
```

### 10.2 可访问性（Accessibility）

- 表格使用语义化 HTML（`<table>`、`<th>`、`<td>`）
- 代码示例提供 `aria-label`
- 颜色对比度符合 WCAG AA 标准
- 键盘导航支持（Tab、Shift+Tab、Enter）

---

## 十一、参考资源

1. **Stripe API Docs**：https://docs.stripe.com/api
2. **Twilio Docs**：https://www.twilio.com/docs（另一个优秀范例）
3. **OpenAPI Specification**：https://spec.openapis.org/oas/latest.html
4. **Microsoft REST API Guidelines**：https://github.com/microsoft/api-guidelines

---

## 总结

本提示词提供了从 **信息架构**、**页面布局**、**内容模板**、**交互设计** 到 **技术实现** 的完整优化方案。核心思想是：

1. **用户旅程优先**：从角色识别到场景化导航
2. **结构化表达**：参数、响应、错误的标准化模板
3. **渐进式披露**：快速示例 → 完整文档 → 高级主题
4. **可执行性**：多语言代码示例、API Playground
5. **持续优化**：文档 Lint、用户反馈机制

**下一步行动**：从 Phase 1（结构重组）开始，逐步迭代实施。
