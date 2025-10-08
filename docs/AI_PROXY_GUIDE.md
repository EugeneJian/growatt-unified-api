# AI 代理服务使用指南

## 📋 概述

AI 代理服务为前端应用提供了访问 DeepSeek、OpenAI 等 AI 服务的 CORS 代理功能，解决了浏览器同源策略限制的问题。

## 🚀 快速开始

### 基本用法

```typescript
// 配置代理 URL
const AI_PROXY_URL = 'https://aisp-cors-proxy.vercel.app/api/ai-proxy';

// 发送 AI 请求
async function chatWithAI(messages: Array<{role: string, content: string}>) {
  const targetUrl = 'https://api.deepseek.com/chat/completions';
  
  const response = await fetch(`${AI_PROXY_URL}?url=${encodeURIComponent(targetUrl)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sk-your-api-key'
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: messages,
      temperature: 0.6,
      max_tokens: 2000,
      stream: false
    })
  });
  
  return await response.json();
}
```

### 流式（SSE）用法

支持将上游 `text/event-stream` 透传为流式响应，客户端可通过以下任一方式启用：

- 在请求头设置 `Accept: text/event-stream`
- 或在代理 URL 上添加查询参数 `stream=true`

以下是两种常见客户端读取方式：

```typescript
// 方式一：使用 Fetch + ReadableStream（推荐现代浏览器）
async function chatStreamWithFetch() {
  const targetUrl = 'https://api.openai.com/v1/chat/completions';
  const proxyUrl = 'https://aisp-cors-proxy.vercel.app/api/ai-proxy';
  const url = `${proxyUrl}?url=${encodeURIComponent(targetUrl)}&stream=true`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sk-your-openai-key',
      'Accept': 'text/event-stream'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      stream: true,
      messages: [{ role: 'user', content: 'Hello' }]
    })
  });

  const reader = (resp.body as ReadableStream<Uint8Array>).getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    // 形如: "data: {\"id\":..., \"choices\":[{\"delta\":{\"content\":\"...\"}}]}\n\n"
    console.log(chunk);
  }
}

// 方式二：使用 EventSource（仅 GET，可用于上游 GET 流）
function listenWithEventSource() {
  const targetUrl = 'https://example.com/sse-endpoint';
  const proxyUrl = 'https://aisp-cors-proxy.vercel.app/api/ai-proxy';
  const url = `${proxyUrl}?url=${encodeURIComponent(targetUrl)}&stream=true`;
  const es = new EventSource(url);
  es.onmessage = (ev) => {
    console.log('event:', ev.data);
  };
  es.onerror = (err) => {
    console.error('sse error:', err);
    es.close();
  };
}
```

## 🔧 支持的 AI 服务

### 1. DeepSeek

**API 端点**: `https://api.deepseek.com/chat/completions`

**示例**:

```typescript
const response = await fetch(
  'https://aisp-cors-proxy.vercel.app/api/ai-proxy?url=https%3A%2F%2Fapi.deepseek.com%2Fchat%2Fcompletions',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sk-your-deepseek-key'
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'user', content: 'Hello' }
      ],
      temperature: 0.6,
      max_tokens: 2000
    })
  }
);

const data = await response.json();
console.log(data.choices[0].message.content);
```

### 2. OpenAI

**API 端点**: `https://api.openai.com/v1/chat/completions`

**示例**:

```typescript
const response = await fetch(
  'https://aisp-cors-proxy.vercel.app/api/ai-proxy?url=https%3A%2F%2Fapi.openai.com%2Fv1%2Fchat%2Fcompletions',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sk-your-openai-key'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: 'Hello' }
      ]
    })
  }
);

const data = await response.json();
console.log(data.choices[0].message.content);
```

## 💡 完整的客户端封装

```typescript
class AIProxyClient {
  private proxyUrl: string;
  private apiKey: string;
  private baseUrl: string;

  constructor(proxyUrl: string, apiKey: string, baseUrl: string) {
    this.proxyUrl = proxyUrl;
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async chat(
    messages: Array<{role: string, content: string}>,
    options?: {
      model?: string;
      temperature?: number;
      max_tokens?: number;
      stream?: boolean;
    }
  ) {
    const targetUrl = `${this.baseUrl}/chat/completions`;
    const encodedUrl = encodeURIComponent(targetUrl);

    const response = await fetch(`${this.proxyUrl}?url=${encodedUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: options?.model || 'deepseek-chat',
        messages: messages,
        temperature: options?.temperature ?? 0.6,
        max_tokens: options?.max_tokens ?? 2000,
        stream: options?.stream ?? false
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`AI API Error: ${error.error || error.message}`);
    }

    return await response.json();
  }

  async listModels() {
    const targetUrl = `${this.baseUrl}/models`;
    const encodedUrl = encodeURIComponent(targetUrl);

    const response = await fetch(`${this.proxyUrl}?url=${encodedUrl}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to list models');
    }

    return await response.json();
  }
}

// 使用 DeepSeek
const deepseekClient = new AIProxyClient(
  'https://aisp-cors-proxy.vercel.app/api/ai-proxy',
  'sk-your-deepseek-key',
  'https://api.deepseek.com'
);

const response = await deepseekClient.chat([
  { role: 'user', content: 'Hello, AI!' }
]);

console.log(response.choices[0].message.content);

// 使用 OpenAI
const openaiClient = new AIProxyClient(
  'https://aisp-cors-proxy.vercel.app/api/ai-proxy',
  'sk-your-openai-key',
  'https://api.openai.com/v1'
);

const openaiResponse = await openaiClient.chat([
  { role: 'user', content: 'Hello, GPT!' }
], {
  model: 'gpt-4'
});
```

## 📝 请求格式

### URL 参数

| 参数 | 类型 | 必需 | 描述 |
|------|------|------|------|
| `url` | string | ✅ | 目标 AI API 的完整 URL（需要 URL 编码） |

### 请求头

| 头部 | 必需 | 描述 |
|------|------|------|
| `Content-Type` | ✅ | 通常为 `application/json` |
| `Authorization` | ✅ | AI 服务的 API Key，格式：`Bearer sk-xxx` |
| `Accept` | ❌ | 期望的响应格式 |

### 请求体

请求体的格式取决于目标 AI 服务的 API 规范。

**DeepSeek 聊天请求示例**:

```json
{
  "model": "deepseek-chat",
  "messages": [
    {
      "role": "user",
      "content": "Hello"
    }
  ],
  "temperature": 0.6,
  "max_tokens": 2000,
  "stream": false
}
```

**OpenAI 聊天请求示例**:

```json
{
  "model": "gpt-4",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
      "content": "Hello"
    }
  ]
}
```

## 🔐 认证

### 获取 API Key

**DeepSeek**:
1. 访问 [DeepSeek 官网](https://platform.deepseek.com/)
2. 注册/登录账号
3. 在控制台中创建 API Key
4. 使用格式：`Bearer sk-xxxxx`

**OpenAI**:
1. 访问 [OpenAI 平台](https://platform.openai.com/)
2. 注册/登录账号
3. 在 API Keys 页面创建新密钥
4. 使用格式：`Bearer sk-xxxxx`

### 安全建议

⚠️ **重要**：永远不要在前端代码中硬编码 API Key！

**推荐做法**：

```typescript
// ❌ 不推荐：直接在代码中
const apiKey = 'sk-your-real-key-here';

// ✅ 推荐：使用环境变量
const apiKey = import.meta.env.VITE_AI_API_KEY;

// ✅ 推荐：从后端获取
const apiKey = await fetchApiKeyFromBackend();
```

## ⚙️ 配置选项

### 超时时间

AI 代理服务的默认超时时间为 60 秒（考虑到 AI 响应时间较长）。

### 支持的 HTTP 方法

- `POST` - 发送聊天/补全请求
- `GET` - 获取模型列表等
- `PUT` - 更新资源
- `DELETE` - 删除资源
- `OPTIONS` - CORS 预检请求

## 📊 响应格式

### 成功响应

响应格式与目标 AI 服务的原始响应一致。

**DeepSeek 响应示例**:

```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "deepseek-chat",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 20,
    "total_tokens": 30
  }
}
```

### 错误响应

```json
{
  "error": "错误描述",
  "details": "PROXY_ERROR",
  "timestamp": "2025-10-07T17:00:17.000Z",
  "requestId": "req_1728318017_abc123"
}
```

## ⚠️ 错误处理

### 常见错误

| 状态码 | 错误类型 | 原因 | 解决方案 |
|--------|----------|------|----------|
| 400 | 参数错误 | 缺少 url 参数 | 检查请求 URL |
| 401 | 认证失败 | API Key 无效或过期 | 检查 API Key |
| 429 | 速率限制 | 请求过于频繁 | 降低请求频率 |
| 500 | 服务器错误 | AI 服务内部错误 | 稍后重试 |
| 502 | 代理错误 | 无法连接到 AI 服务 | 检查网络连接 |
| 504 | 超时 | AI 服务响应超时 | 重试或调整参数 |

### 错误处理示例

```typescript
async function safeAIRequest(messages: Array<any>) {
  try {
    const response = await fetch(aiProxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      if (response.status === 401) {
        throw new Error('API Key 无效，请检查认证信息');
      } else if (response.status === 429) {
        throw new Error('请求过于频繁，请稍后重试');
      } else if (response.status === 504) {
        throw new Error('请求超时，请重试');
      } else {
        throw new Error(`AI 请求失败: ${errorData.error}`);
      }
    }

    return await response.json();
  } catch (error) {
    console.error('AI 请求错误:', error);
    throw error;
  }
}
```

## 🧪 测试

### 使用 curl 测试

```bash
# DeepSeek 测试
curl -X POST "https://aisp-cors-proxy.vercel.app/api/ai-proxy?url=https%3A%2F%2Fapi.deepseek.com%2Fchat%2Fcompletions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-your-key" \
  -d '{
    "model": "deepseek-chat",
    "messages": [{"role": "user", "content": "Hello"}]
  }'

# OpenAI 测试
curl -X POST "https://aisp-cors-proxy.vercel.app/api/ai-proxy?url=https%3A%2F%2Fapi.openai.com%2Fv1%2Fchat%2Fcompletions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-your-key" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

## 💰 费用说明

- 本代理服务本身**免费**
- AI 服务（DeepSeek、OpenAI）会根据使用量收费
- 请在各自平台查看详细定价

## 📞 支持

如有问题，请通过以下方式联系：

- **GitHub Issues**: 提交问题报告
- **文档**: 查看完整文档

## 📄 许可证

MIT License

---

**最后更新**: 2025年10月7日  
**版本**: 1.0.0  
**状态**: ✅ 生产就绪

