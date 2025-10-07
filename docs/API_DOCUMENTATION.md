# AISP CORS 代理服务 API 文档

## 📋 概述

本文档描述了 AISP 应用如何使用 CORS 代理服务来实现 WebDAV 同步功能。该服务解决了 GitHub Pages 托管的前端应用无法直接访问 WebDAV 服务器的 CORS 限制问题。

## 🌐 服务信息

- **服务名称**: AISP CORS 代理服务
- **部署平台**: Vercel
- **生产环境 URL**: `https://aisp-cors-proxy.vercel.app`
- **API 基础路径**: `/api/cors-proxy`
- **协议**: HTTPS
- **支持的方法**: POST, OPTIONS

## 🔧 快速开始

### 1. 配置代理 URL

在您的 AISP 前端应用中，设置环境变量：

```typescript
// 生产环境配置
const CORS_PROXY_URL = 'https://aisp-cors-proxy.vercel.app/api/cors-proxy';

// 开发环境可以使用本地代理或直接使用生产代理
const PROXY_URL = process.env.NODE_ENV === 'production' 
  ? CORS_PROXY_URL 
  : 'http://localhost:3000/api/cors-proxy'; // 本地开发
```

### 2. 基本使用示例

```typescript
// 发送 WebDAV 请求到代理服务
async function makeWebDAVRequest(path: string, options: RequestInit) {
  const response = await fetch('https://aisp-cors-proxy.vercel.app/api/cors-proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      path: path,
      options: options
    })
  });
  
  return response;
}
```

## 📡 API 端点

### POST /api/cors-proxy

代理 WebDAV 请求到目标服务器。

#### 请求格式

```http
POST /api/cors-proxy
Content-Type: application/json
Origin: https://your-frontend-domain.com

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

#### 请求参数

| 参数 | 类型 | 必需 | 描述 |
|------|------|------|------|
| `path` | string | ✅ | WebDAV 服务器上的目标路径 |
| `options` | object | ✅ | 原始请求选项 |
| `options.method` | string | ✅ | HTTP 方法 (GET, POST, PUT, DELETE, PROPFIND, 等) |
| `options.headers` | object | ❌ | 请求头部 |
| `options.body` | string/ArrayBuffer/FormData | ❌ | 请求体 |

#### 响应格式

**成功响应**:
```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PROPFIND, MKCOL, MOVE, COPY
Access-Control-Allow-Headers: Authorization, Content-Type, Depth, If-None-Match, Etag
Access-Control-Expose-Headers: Etag, DAV
Access-Control-Max-Age: 86400

[WebDAV 服务器响应体]
```

**错误响应**:
```json
{
  "error": "错误描述",
  "details": "详细错误信息",
  "timestamp": "2025-09-02T14:04:34.615Z",
  "requestId": "req_1756821874611_44wzqmbde"
}
```

### OPTIONS /api/cors-proxy

处理 CORS 预检请求。

#### 请求格式

```http
OPTIONS /api/cors-proxy
Origin: https://your-frontend-domain.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: content-type
```

#### 响应格式

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PROPFIND, MKCOL, MOVE, COPY
Access-Control-Allow-Headers: Authorization, Content-Type, Depth, If-None-Match, Etag
Access-Control-Expose-Headers: Etag, DAV
Access-Control-Max-Age: 86400
```

## 🔐 认证

### Basic Authentication

使用 Base64 编码的用户名和密码：

```typescript
// 坚果云认证示例
const username = 'your-email@example.com';
const password = 'your-app-password';
const credentials = btoa(`${username}:${password}`);

const response = await fetch(proxyUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    path: 'notes/',
    options: {
      method: 'PROPFIND',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Depth': '1'
      }
    }
  })
});
```

### 获取坚果云应用密码

1. 登录坚果云网页版
2. 进入"账户信息" → "安全选项"
3. 点击"添加应用"
4. 生成应用密码
5. 使用邮箱和应用密码进行认证

## 📝 使用示例

### 1. 列出目录内容

```typescript
async function listDirectory(path: string = '') {
  const response = await fetch('https://aisp-cors-proxy.vercel.app/api/cors-proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      path: path,
      options: {
        method: 'PROPFIND',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Depth': '1',
          'Content-Type': 'application/xml'
        },
        body: `<?xml version="1.0" encoding="utf-8"?>
<D:propfind xmlns:D="DAV:">
  <D:allprop/>
</D:propfind>`
      }
    })
  });
  
  return await response.text();
}
```

### 2. 上传文件

```typescript
async function uploadFile(filePath: string, content: string) {
  const response = await fetch('https://aisp-cors-proxy.vercel.app/api/cors-proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      path: filePath,
      options: {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'text/plain'
        },
        body: content
      }
    })
  });
  
  return response;
}
```

### 3. 下载文件

```typescript
async function downloadFile(filePath: string) {
  const response = await fetch('https://aisp-cors-proxy.vercel.app/api/cors-proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      path: filePath,
      options: {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      }
    })
  });
  
  return await response.text();
}
```

### 4. 删除文件

```typescript
async function deleteFile(filePath: string) {
  const response = await fetch('https://aisp-cors-proxy.vercel.app/api/cors-proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      path: filePath,
      options: {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      }
    })
  });
  
  return response;
}
```

### 5. 创建目录

```typescript
async function createDirectory(dirPath: string) {
  const response = await fetch('https://aisp-cors-proxy.vercel.app/api/cors-proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      path: dirPath,
      options: {
        method: 'MKCOL',
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      }
    })
  });
  
  return response;
}
```

## 🔄 完整的 WebDAV 客户端实现

```typescript
class WebDAVClient {
  private proxyUrl: string;
  private credentials: string;

  constructor(proxyUrl: string, username: string, password: string) {
    this.proxyUrl = proxyUrl;
    this.credentials = btoa(`${username}:${password}`);
  }

  private async makeRequest(path: string, options: RequestInit) {
    const response = await fetch(this.proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: path,
        options: {
          ...options,
          headers: {
            'Authorization': `Basic ${this.credentials}`,
            ...options.headers
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  }

  async listDirectory(path: string = '') {
    const response = await this.makeRequest(path, {
      method: 'PROPFIND',
      headers: {
        'Depth': '1',
        'Content-Type': 'application/xml'
      },
      body: `<?xml version="1.0" encoding="utf-8"?>
<D:propfind xmlns:D="DAV:">
  <D:allprop/>
</D:propfind>`
    });
    
    return await response.text();
  }

  async uploadFile(filePath: string, content: string, contentType: string = 'text/plain') {
    return await this.makeRequest(filePath, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType
      },
      body: content
    });
  }

  async downloadFile(filePath: string) {
    const response = await this.makeRequest(filePath, {
      method: 'GET'
    });
    
    return await response.text();
  }

  async deleteFile(filePath: string) {
    return await this.makeRequest(filePath, {
      method: 'DELETE'
    });
  }

  async createDirectory(dirPath: string) {
    return await this.makeRequest(dirPath, {
      method: 'MKCOL'
    });
  }

  async moveFile(sourcePath: string, destinationPath: string) {
    return await this.makeRequest(sourcePath, {
      method: 'MOVE',
      headers: {
        'Destination': destinationPath
      }
    });
  }

  async copyFile(sourcePath: string, destinationPath: string) {
    return await this.makeRequest(sourcePath, {
      method: 'COPY',
      headers: {
        'Destination': destinationPath
      }
    });
  }
}

// 使用示例
const client = new WebDAVClient(
  'https://aisp-cors-proxy.vercel.app/api/cors-proxy',
  'your-email@example.com',
  'your-app-password'
);

// 列出根目录
const files = await client.listDirectory();

// 上传文件
await client.uploadFile('notes/test.txt', 'Hello, World!');

// 下载文件
const content = await client.downloadFile('notes/test.txt');
```

## ⚠️ 错误处理

### 常见错误码

| 状态码 | 错误类型 | 描述 | 解决方案 |
|--------|----------|------|----------|
| 400 | VALIDATION_ERROR | 请求格式错误 | 检查请求体格式 |
| 401 | AUTHENTICATION_ERROR | 认证失败 | 检查用户名和密码 |
| 403 | AUTHORIZATION_ERROR | 权限不足 | 检查文件权限 |
| 404 | NOT_FOUND | 文件不存在 | 检查文件路径 |
| 500 | INTERNAL_ERROR | 服务器内部错误 | 稍后重试 |
| 502 | PROXY_ERROR | 代理错误 | 检查目标服务器状态 |
| 503 | NETWORK_ERROR | 网络错误 | 检查网络连接 |
| 504 | TIMEOUT_ERROR | 请求超时 | 增加超时时间 |

### 错误处理示例

```typescript
async function safeWebDAVRequest(path: string, options: RequestInit) {
  try {
    const response = await fetch('https://aisp-cors-proxy.vercel.app/api/cors-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: path,
        options: options
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error} - ${errorData.details}`);
    }

    return response;
  } catch (error) {
    console.error('WebDAV request failed:', error);
    
    // 根据错误类型进行不同处理
    if (error.message.includes('401')) {
      // 认证错误，可能需要重新登录
      throw new Error('认证失败，请检查用户名和密码');
    } else if (error.message.includes('404')) {
      // 文件不存在
      throw new Error('文件不存在');
    } else if (error.message.includes('503')) {
      // 网络错误，可以重试
      throw new Error('网络错误，请稍后重试');
    } else {
      // 其他错误
      throw new Error('操作失败，请稍后重试');
    }
  }
}
```

## 🔧 配置选项

### 环境变量

在您的 AISP 应用中设置以下环境变量：

```bash
# 生产环境
VITE_CORS_PROXY_URL=https://aisp-cors-proxy.vercel.app/api/cors-proxy

# 开发环境（可选）
VITE_CORS_PROXY_URL_DEV=http://localhost:3000/api/cors-proxy
```

### 超时配置

```typescript
// 设置请求超时
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

try {
  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      path: path,
      options: options
    }),
    signal: controller.signal
  });
  
  clearTimeout(timeoutId);
  return response;
} catch (error) {
  clearTimeout(timeoutId);
  if (error.name === 'AbortError') {
    throw new Error('请求超时');
  }
  throw error;
}
```

## 📊 性能优化

### 1. 请求缓存

```typescript
const cache = new Map();

async function cachedWebDAVRequest(path: string, options: RequestInit) {
  const cacheKey = `${path}-${JSON.stringify(options)}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const response = await makeWebDAVRequest(path, options);
  cache.set(cacheKey, response);
  
  // 5分钟后清除缓存
  setTimeout(() => cache.delete(cacheKey), 5 * 60 * 1000);
  
  return response;
}
```

### 2. 批量请求

```typescript
async function batchWebDAVRequests(requests: Array<{path: string, options: RequestInit}>) {
  const promises = requests.map(({path, options}) => 
    makeWebDAVRequest(path, options)
  );
  
  return await Promise.all(promises);
}
```

## 🧪 测试

### 测试页面

访问 `https://aisp-cors-proxy.vercel.app/test` 进行功能测试。

### 本地测试

```bash
# 启动本地开发服务器
npm run dev

# 访问测试页面
http://localhost:3000/test
```

## 📞 支持

如有问题，请通过以下方式联系：

- **GitHub Issues**: 提交问题报告
- **文档**: 查看完整文档
- **测试页面**: 使用在线测试工具

## 📄 许可证

MIT License

---

**最后更新**: 2025年9月2日  
**版本**: 1.0.0  
**状态**: ✅ 生产就绪

