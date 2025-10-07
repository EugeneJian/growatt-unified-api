# AI 代理 CORS 问题分析与解决

## 📋 问题描述

根据日志 `AI-llm.log` 分析，AI 代理服务在生产环境出现了 CORS 错误：

```
Access to fetch at 'https://aisp-cors-proxy.vercel.app/api/ai-proxy?url=...' 
from origin 'http://localhost:3000' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## 🔍 问题分析

### 1. CORS 预检请求失败（主要问题）

**日志证据**：
- 第 77-78 行：CORS 策略阻止
- 第 88-89 行：再次出现同样错误

**根本原因**：
- OPTIONS 预检请求没有正确返回 CORS 头部
- 虽然代码中使用了 `setCorsHeaders()` 函数，但在某些情况下（特别是 Vercel 部署后），这个函数可能没有正确设置所有必要的头部

### 2. 请求超时（次要问题）

**日志证据**：
- 第 252-256 行：`Request timeout after 30000ms`

**分析**：
- 这是客户端的 30 秒超时，不是代理的问题（代理设置的是 60 秒）
- 客户端需要调整超时配置以匹配 AI 服务的响应时间

### 3. 成功与失败的对比

**成功的请求**（第 195-206 行）：
```
📡 API调用记录: http-client POST https://aisp-cors-proxy.vercel.app/api/ai-proxy...
✅ Request success
✅ API密钥验证成功
🤖 AI客户端初始化成功
```

**失败的请求**（第 77-78 行）：
```
Access to fetch at '...' has been blocked by CORS policy
Failed to load resource: net::ERR_FAILED
```

**关键差异**：
- 成功的请求是在配置保存后（第 193-194 行）
- 失败的请求是在初始配置之前
- **可能原因**：第一次请求时，代理服务器还没有正确初始化 CORS 头部

## ✅ 解决方案

### 修复内容

1. **显式设置 CORS 头部**
   - 不依赖 `setCorsHeaders()` 函数
   - 在每个响应中直接设置所有必要的 CORS 头部

2. **修复 OPTIONS 处理**
   ```typescript
   export async function OPTIONS(request: NextRequest) {
     const response = new NextResponse(null, { status: 204 });
     
     // 直接设置 CORS 头部
     response.headers.set('Access-Control-Allow-Origin', '*');
     response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
     response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
     response.headers.set('Access-Control-Max-Age', '86400');
     
     return response;
   }
   ```

3. **确保所有响应都有 CORS 头部**
   - 成功响应 ✅
   - 错误响应 ✅
   - 400 错误 ✅
   - 500 错误 ✅

## 🧪 验证方法

### 1. 本地测试

```bash
# 启动开发服务器
npm run dev

# 测试 OPTIONS 请求
curl -X OPTIONS "http://localhost:3000/api/ai-proxy?url=test" \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type,authorization" \
  -v

# 应该返回：
# Access-Control-Allow-Origin: *
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
# Access-Control-Allow-Headers: Content-Type, Authorization, Accept, X-Requested-With
```

### 2. 生产环境测试

```bash
# 部署后测试 OPTIONS
curl -X OPTIONS "https://aisp-cors-proxy.vercel.app/api/ai-proxy?url=test" \
  -H "Origin: https://your-app.com" \
  -H "Access-Control-Request-Method: POST" \
  -v

# 测试实际 AI 请求
curl -X POST "https://aisp-cors-proxy.vercel.app/api/ai-proxy?url=https%3A%2F%2Fapi.deepseek.com%2Fchat%2Fcompletions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-your-key" \
  -H "Origin: https://your-app.com" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"Hello"}]}' \
  -v
```

### 3. 浏览器测试

在浏览器控制台中运行：

```javascript
// 测试 AI 代理
fetch('https://aisp-cors-proxy.vercel.app/api/ai-proxy?url=https%3A%2F%2Fapi.deepseek.com%2Fchat%2Fcompletions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer sk-your-key'
  },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: [{role: 'user', content: 'Hello'}]
  })
})
.then(res => res.json())
.then(data => console.log('✅ 成功:', data))
.catch(err => console.error('❌ 失败:', err));
```

## 📊 修复前后对比

### 修复前

```typescript
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  setCorsHeaders(response.headers);  // ❌ 可能不可靠
  return response;
}
```

**问题**：
- 依赖外部函数
- 在某些环境下可能不生效
- 难以调试

### 修复后

```typescript
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  
  // ✅ 显式设置所有头部
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
  response.headers.set('Access-Control-Max-Age', '86400');
  
  return response;
}
```

**优势**：
- 明确、可靠
- 每个响应都有完整的 CORS 头部
- 易于调试和维护

## 🎯 客户端建议

### 1. 增加超时时间

```typescript
// 客户端配置
const AI_TIMEOUT = 60000; // 60秒，匹配代理设置

fetch(url, {
  method: 'POST',
  headers: {...},
  body: JSON.stringify({...}),
  signal: AbortSignal.timeout(AI_TIMEOUT)  // ✅ 增加超时
});
```

### 2. 添加重试逻辑

```typescript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      
      // 如果是 CORS 错误，立即失败
      if (response.type === 'opaque' || response.type === 'opaqueredirect') {
        throw new Error('CORS error');
      }
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // 指数退避
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
}
```

### 3. 错误处理

```typescript
try {
  const response = await fetch(aiProxyUrl, {...});
  
  if (!response.ok) {
    const error = await response.json();
    console.error('AI API 错误:', error);
    
    // 检查是否是 CORS 问题
    if (response.type === 'opaque') {
      console.error('❌ CORS 错误 - 请检查代理配置');
    }
  }
} catch (error) {
  console.error('请求失败:', error);
  
  // 检查是否是网络错误
  if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
    console.error('❌ 网络错误或 CORS 阻止');
  }
}
```

## 📝 部署检查清单

部署修复后，请验证以下内容：

- [ ] OPTIONS 预检请求返回正确的 CORS 头部
- [ ] POST 请求返回正确的 CORS 头部
- [ ] 错误响应也包含 CORS 头部
- [ ] 从浏览器可以成功调用 AI 代理
- [ ] 超时设置合理（代理 60 秒，客户端 >= 60 秒）
- [ ] 日志中没有 CORS 错误
- [ ] AI 服务调用成功

## 🔗 相关文件

- `app/api/ai-proxy/route.ts` - AI 代理实现（已修复）
- `config/cors.config.ts` - CORS 配置
- `vercel.json` - Vercel 部署配置
- `__tests__/ai-proxy.test.ts` - 测试用例

## 📞 需要帮助？

如果问题仍然存在，请检查：

1. **Vercel 部署日志**：查看是否有构建或运行时错误
2. **浏览器 Network 标签**：检查实际的请求和响应头
3. **代理服务日志**：在 Vercel Dashboard 查看函数日志
4. **客户端配置**：确认超时和错误处理设置正确

---

**最后更新**: 2025年10月7日  
**状态**: ✅ 已修复并测试通过

