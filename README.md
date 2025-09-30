# AISP CORS 代理服务

这是一个为 GitHub Pages 托管的 AISP 应用提供 WebDAV 同步功能的 CORS 代理服务。


## 🚀 项目概述

**问题**：GitHub Pages 托管的静态网站无法直接访问 WebDAV 服务器，因为浏览器的同源策略限制。

**解决方案**：通过部署在 Vercel 上的 CORS 代理服务，将前端的 WebDAV 请求转发到目标服务器，并添加必要的 CORS 头部。

## 🏗️ 架构设计

```
前端应用 (GitHub Pages) → CORS 代理服务 (Vercel) → WebDAV 服务器 (坚果云)
```

### 数据流程
1. 前端发送 WebDAV 请求到代理服务
2. 代理服务验证请求并转发到 WebDAV 服务器
3. 代理服务接收响应并添加 CORS 头部
4. 前端接收带有 CORS 头部的响应

## 📁 项目结构

```
aisp-cors-proxy/
├── app/
│   ├── api/
│   │   ├── cors-proxy/
│   │   │   └── route.ts          # WebDAV 代理 API
│   │   └── api-proxy/
│   │       └── route.ts          # 通用 API 代理
│   ├── test/
│   │   └── page.tsx              # WebDAV 测试页面
│   └── api-proxy-test/
│       └── page.tsx              # API 代理测试页面
├── config/
│   ├── proxy.config.ts           # 代理配置
│   └── cors.config.ts            # CORS 配置
├── utils/
│   ├── logger.ts                 # 日志工具
│   ├── validator.ts              # 请求验证
│   └── errorHandler.ts           # 错误处理
├── types/
│   └── proxy.types.ts            # 类型定义
├── __tests__/
│   ├── cors-proxy.test.ts        # WebDAV API 测试
│   ├── api-proxy.test.ts         # API 代理测试
│   └── utils.test.ts             # 工具函数测试
├── vercel.json                   # Vercel 配置
└── package.json
```

## 🔧 技术栈

- **运行时**: Node.js 18+
- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **部署**: Vercel
- **测试**: Jest

## 🚀 快速开始

### 本地开发

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd aisp-cors-proxy
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   ```bash
   cp env.example .env.local
   # 编辑 .env.local 文件，配置你的环境变量
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问测试页面**
   - WebDAV 测试: `http://localhost:3000/test`
   - API 代理测试: `http://localhost:3000/api-proxy-test`

### 部署到 Vercel

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   ```bash
   vercel --prod
   ```

## 📖 API 使用说明

### WebDAV 代理端点

- **URL**: `https://aisp-cors-proxy.vercel.app/api/cors-proxy`
- **方法**: `POST`, `OPTIONS`
- **用途**: WebDAV 文件同步功能

### API 代理端点

- **URL**: `https://aisp-cors-proxy.vercel.app/api/api-proxy`
- **方法**: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- **用途**: 通用 API 代理功能

### API 代理使用示例

```typescript
// 基本使用
async function apiRequest(url: string, token?: string) {
  const params = new URLSearchParams({ url });
  if (token) params.append('token', token);
  
  const response = await fetch(`https://aisp-cors-proxy.vercel.app/api/api-proxy?${params}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  
  return response.json();
}

// 使用示例
const data = await apiRequest('/api/user/profile', 'your-token');
```

### 📚 详细文档

- **[完整 API 文档](./API_DOCUMENTATION.md)** - 详细的 API 使用说明
- **[快速开始指南](./QUICK_START.md)** - 5分钟快速集成

### 请求格式

```typescript
POST /api/cors-proxy
Content-Type: application/json

{
  "path": "目标路径",
  "options": {
    "method": "HTTP方法",
    "headers": {
      "Authorization": "Basic base64编码的凭据",
      "其他头部": "值"
    },
    "body": "请求体（可选）"
  }
}
```

### 响应格式

成功响应会返回 WebDAV 服务器的原始响应，并添加 CORS 头部：

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PROPFIND, MKCOL, MOVE, COPY
Access-Control-Allow-Headers: Authorization, Content-Type, Depth, If-None-Match, Etag
Access-Control-Expose-Headers: Etag, DAV
Access-Control-Max-Age: 86400

[WebDAV 服务器响应体]
```

### 错误响应

```json
{
  "error": "错误描述",
  "details": "详细错误信息",
  "timestamp": "2025-09-02T13:59:08.000Z",
  "requestId": "req_1756821548259_abc123"
}
```

## 🧪 测试

### 运行测试

```bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监视模式运行测试
npm run test:watch
```

### 测试覆盖

- ✅ WebDAV API 路由测试
- ✅ API 代理路由测试
- ✅ 请求验证测试
- ✅ 错误处理测试
- ✅ 工具函数测试
- ✅ CORS 头部测试

## ⚙️ 配置选项

### 环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `WEBDAV_BASE_URL` | WebDAV 服务器基础 URL | `https://dav.jianguoyun.com/dav/` |
| `CORS_ALLOW_ORIGIN` | 允许的来源 | `*` |
| `REQUEST_TIMEOUT` | 请求超时时间（毫秒） | `30000` |
| `USER_AGENT` | 用户代理字符串 | `AISP-CORS-Proxy/1.0` |

### Vercel 配置

项目包含 `vercel.json` 配置文件，用于：
- 设置函数超时时间
- 配置 CORS 头部
- 设置环境变量

## 🔒 安全考虑

1. **请求验证**: 验证请求格式和来源
2. **路径清理**: 防止路径遍历攻击
3. **大小限制**: 限制请求体大小
4. **错误处理**: 不暴露敏感信息
5. **日志记录**: 记录所有请求和错误

## 📊 监控和日志

- **Vercel Analytics**: 性能监控
- **Vercel Functions Logs**: 错误日志
- **自定义日志**: 结构化日志记录

## 🚨 故障排除

### 常见问题

1. **CORS 错误**
   - 检查 `Access-Control-Allow-Origin` 头部
   - 确认预检请求（OPTIONS）正常工作

2. **超时错误**
   - 检查 `REQUEST_TIMEOUT` 配置
   - 确认 WebDAV 服务器响应时间

3. **认证失败**
   - 验证 Authorization 头部格式
   - 确认 WebDAV 服务器凭据正确

### 调试方法

1. **查看测试页面**: 访问 `/test` 页面进行功能测试
2. **检查日志**: 查看 Vercel 函数日志
3. **使用 curl**: 直接测试 API 端点

## 🔄 更新和维护

### 版本更新

1. 修改代码
2. 运行测试确保功能正常
3. 重新部署到 Vercel

### 监控指标

- 响应时间
- 成功率
- 错误率
- 请求量

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题，请通过以下方式联系：
- 提交 GitHub Issue
- 发送邮件到项目维护者

---

**部署状态**: ✅ 已部署到 Vercel  
**测试状态**: ✅ 所有测试通过  
**文档状态**: ✅ 文档完整