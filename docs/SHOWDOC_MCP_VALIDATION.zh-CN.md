# ShowDoc MCP 建立文档功能验证记录

## 验证时间

- 2026-03-24

## 验证目标

确认你提供的 ShowDoc MCP 配置是否对应一个真实可用的 MCP 服务，并验证它是否具备“建立文档”的实际能力。

## 被验证的配置

```json
{
  "mcpServers": {
    "showdoc": {
      "type": "streamable-http",
      "url": "https://www.showdoc.com.cn/mcp.php",
      "headers": {
        "Authorization": "Bearer <your-showdoc-token>"
      }
    }
  }
}
```

## 已完成验证

### 1. 端点存在

- 访问 `https://www.showdoc.com.cn/mcp.php` 时，服务端不是返回 404，也不是普通网页。
- 该地址实际对应 ShowDoc 的 MCP 服务入口。

### 2. 传输方式符合 MCP Streamable HTTP

- 对该地址发起 `GET` 请求时，服务端返回：
  - HTTP 状态码：`200`
  - `Content-Type: text/event-stream;charset=UTF-8`
  - 响应体：`: connected`
- 这说明它符合 MCP Streamable HTTP 的 SSE 连接特征。

### 3. MCP 初始化握手成功

- 对该地址发送 `initialize` 请求后，服务端返回了标准 JSON-RPC 结果：

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "tools": {
        "listChanged": false
      },
      "resources": {
        "subscribe": false,
        "listChanged": false
      },
      "prompts": {
        "listChanged": false
      }
    },
    "serverInfo": {
      "name": "showdoc-mcp",
      "version": "1.0.0"
    }
  }
}
```

- 这一步可以确认：
  - 该地址确实是 MCP 服务
  - 服务名为 `showdoc-mcp`
  - 服务支持 `tools`
  - 同时声明了 `resources` 和 `prompts` 能力

### 4. 工具清单可正常获取

使用真实 token 调用 `tools/list` 后，成功拿到工具列表。与建立文档直接相关的工具包括：

- `list_items`
- `get_item`
- `create_item`
- `list_catalogs`
- `create_catalog`
- `list_pages`
- `get_page`
- `create_page`
- `update_page`
- `upsert_page`
- `batch_upsert_pages`
- `delete_page`

这说明 ShowDoc MCP 在能力层面已经完整支持“项目、目录、页面”的读写操作。

## 建立文档实测

### 1. 查询可访问项目

- 调用 `list_items` 成功。
- 当前 token 可访问 5 个项目。
- 返回的项目均为示例项目，说明该 token 对 ShowDoc 工作区已经具备有效访问权限。

### 2. 创建项目能力验证结果

- 调用 `create_item` 时，服务端返回失败。
- 失败原因是当前 ShowDoc 账号未完成邮箱绑定，因而不能创建公开项目。

结论：

- `create_item` 工具存在且服务端已正确处理请求。
- 但当前账号状态不满足“创建项目”的前置条件。

### 3. 创建页面能力验证结果

为了继续验证“建立文档”能力，改为在现有示例项目中创建测试页面。

调用 `create_page` 后返回成功，核心结果如下：

```json
{
  "page_id": 11559060626752612,
  "page_title": "Document Creation Validation 20260324-203755",
  "item_id": 2598850843338877,
  "cat_id": 6740375,
  "message": "页面创建成功"
}
```

这一步已经证明：

- ShowDoc MCP 可以在已有项目中直接创建 Markdown 文档
- 创建时可以指定页面标题、正文内容和目录名

### 4. 回读页面验证

随后调用 `get_page` 读取刚创建的页面，返回结果包含：

- 相同的 `page_id`
- 相同的 `page_title`
- `type: markdown`
- 正确的 `content`
- `content_hash`

回读内容如下：

```markdown
# Validation

Created at 20260324-203755
```

这说明：

- 文档不仅创建成功
- 而且内容已被正确写入 ShowDoc

### 5. 清理测试数据

为了不给示例项目留下临时测试页，随后调用 `delete_page` 进行了软删除。

返回结果：

```json
{
  "page_id": 11559060626752612,
  "message": "页面已删除"
}
```

## 最终结论

本次验证结果为：**ShowDoc MCP 的“建立文档”功能已验证通过。**

准确地说：

1. ShowDoc MCP 服务真实存在，且协议握手正常。
2. `tools/list` 可成功返回，说明 MCP 鉴权与工具发现正常。
3. `create_page` 已实测成功，可在已有项目中创建 Markdown 文档。
4. `get_page` 已实测成功，可读回刚创建的文档内容。
5. `delete_page` 已实测成功，说明测试数据可回收。

## 当前限制

当前唯一额外发现的限制是：

1. `create_item` 会受账号状态影响。
2. 当前账号因为“未绑定邮箱”而不能创建公开项目。
3. 这不会影响在已有项目中创建文档。

## 验收结论

本次“建立文档功能”验收状态：

- MCP 服务联通：通过
- 工具发现：通过
- 建立页面文档：通过
- 页面内容回读：通过
- 测试数据清理：通过
- 建立新项目：受账号邮箱绑定限制，当前未通过

## 建议

如果你后续要正式接入自动建文档流程，建议这样使用：

1. 若只需要把 AI 生成的文档写入现有项目，当前 token 已可直接使用。
2. 若还需要自动创建新项目，先在 ShowDoc 用户中心完成邮箱绑定与验证。
