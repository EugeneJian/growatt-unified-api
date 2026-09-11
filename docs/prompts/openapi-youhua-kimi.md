# Role
你是一位资深 API 文档架构师和技术写作专家，擅长将开发者文档重构成 Stripe 级别的信息架构。

# Context
我正在优化 Growatt Open API 的公开开发者文档（https://vpp.myshine.online/growatt-openapi）。现有文档按业务流程组织，共 15 篇 Markdown：

## 现有文档结构
| 文件 | 内容 |
|------|------|
| 01_authentication.md | OAuth 2.0 授权码/客户端凭证模式 |
| 02_api_access_token.md | 获取 access_token |
| 03_api_refresh.md | 刷新 token |
| 04_api_device_auth.md | 设备授权/绑定/解绑 |
| 05_api_device_dispatch.md | 设备参数下发 |
| 06_api_read_dispatch.md | 读取下发参数 |
| 07_api_device_info.md | 查询设备信息 |
| 08_api_device_data.md | 查询设备遥测数据 |
| 09_api_device_push.md | Webhook 数据推送 |
| 10_global_params.md | 全局参数、setType 枚举、响应码 |
| 11_api_troubleshooting.md | 故障排查 FAQ |
| 12_ess_terminology.md | ESS 术语表 |
| 13_ess_semantic_model.md | 语义模型 |
| 14_appendix_d_openapi_support_scope.md | 产品兼容性 |
| 15_api_rate_limiting.md | 限流规则 |

## 现有文档的优点
- 有完整的 OAuth 集成流程图（mermaid）
- 有 Global Parameters 集中管理
- 有 Troubleshooting FAQ
- 有 ESS 术语表和语义模型
- 中英文双版本（OPENAPI / OPENAPI.zh-CN）

## 现有文档的不足
- 按业务流程而非 API 资源组织，查找特定字段困难
- 缺少统一的对象 Schema 定义（Device、Site、Token、DispatchSetting 等）
- 参数类型和约束描述不够精确（缺少 nullable、enum 值域、expandable 标记）
- 错误码分散在各接口中，没有统一错误参考
- 只有 JSON 示例，缺少多语言代码示例框架
- 缺少 API 版本演进和变更记录的标准呈现
- 请求/响应示例缺少完整的真实数据样本

# Reference: Stripe API 文档架构标准
参考 https://docs.stripe.com/api 的以下架构原则：

1. **资源导向的信息架构**：以业务对象为中心组织文档，而非业务流程
2. **标准页面结构**：对象定义 → Attributes（带类型/约束/示例）→ 操作列表 → Parameters → Returns → Response Example
3. **精确字段规范**：每个字段标注类型、nullable、required、expandable、枚举值域、业务示例
4. **全局概念独立**：Authentication、Errors、Pagination、Rate Limits、Versioning、Idempotency 独立成章
5. **统一错误参考**：HTTP 状态码表 + 错误类型分类 + Error object Schema
6. **完整代码示例**：curl 为基础，支持多语言切换，Response 为完整真实 JSON
7. **开发者体验**：版本标注、变更日志、反馈机制、可测试的示例

# Task
请为 Growatt Open API 设计一套优化后的文档架构方案，要求：

1. **顶层信息架构重组**：从"业务流程导向"改为"资源/对象导向 + 全局概念"的双层结构
   - 识别核心业务对象（如：Device、Site、Token、Dispatch Command、Telemetry Data、Webhook Event）
   - 每个对象应有独立的 Schema 定义页
   - 全局概念（认证、错误、限流、分页、版本）独立成章

2. **标准页面模板设计**：为每类页面设计统一模板
   - 对象 Schema 页模板
   - API 操作页模板（Request/Response/Error 标准结构）
   - 全局概念页模板

3. **字段描述规范**：定义 Growatt API 的字段标注体系
   - 类型系统（string/integer/enum/object/array/timestamp/boolean）
   - 约束标记（required/nullable/expandable/deprecated）
   - 枚举值呈现规范
   - 嵌套对象展开规范

4. **错误处理统一架构**：设计错误参考章节
   - HTTP 状态码总表
   - Growatt 业务错误码分类（设备类/权限类/参数类/系统类）
   - Error object 标准 Schema
   - 各接口错误码引用规范

5. **代码示例框架**：设计可扩展的示例体系
   - 请求示例：curl 为基础，预留多语言扩展位
   - 响应示例：完整真实 JSON，包含成功/失败场景
   - Webhook 示例：dfcData 推送的完整 payload

6. **迁移路径**：给出从现有 15 篇文档到新架构的映射关系和迁移步骤

7. **中英双语同步策略**：确保 OPENAPI/ 和 OPENAPI.zh-CN/ 结构一致

# Constraints
- 保持现有 mermaid 流程图优势，但减少到关键路径
- 保留 Global Parameters 集中管理的优点
- 保留 Troubleshooting FAQ 和 ESS 术语表
- 所有新文档命名必须符合 `NN_descriptive_name.md` 规范
- 必须同步维护两个 OPENAPI*/README.md 的版本和目录索引
- 公开文档不提 RTU/寄存器等内部实现细节；机型限制只用 SPA/SPH 口径描述
- 厂商基线文档（docs/3 接口列表*.md）是规范来源，不得覆盖

# Output Format
请输出一份完整的架构方案，包含：
1. 新文档目录结构（文件树 + 每个文件的职责说明）
2. 各类页面的 Markdown 模板（带示例内容）
3. 字段描述规范示例（以 Device 对象和 deviceDispatch 接口为例）
4. 错误参考章节完整示例
5. 现有文档 → 新架构的映射表
6. 分阶段迁移实施步骤
