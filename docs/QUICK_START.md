# AISP CORS 代理服务 - 快速开始

## 🚀 5分钟快速集成

### 1. 配置代理 URL

```typescript
const PROXY_URL = 'https://aisp-cors-proxy.vercel.app/api/cors-proxy';
```

### 2. 基本使用

```typescript
// 发送 WebDAV 请求
async function webdavRequest(path: string, method: string, headers: any = {}, body?: any) {
  const response = await fetch('https://aisp-cors-proxy.vercel.app/api/cors-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: path,
      options: { method, headers, body }
    })
  });
  return response;
}
```

### 3. 常用操作

```typescript
// 坚果云认证
const credentials = btoa('your-email@example.com:your-app-password');

// 列出文件
const files = await webdavRequest('', 'PROPFIND', {
  'Authorization': `Basic ${credentials}`,
  'Depth': '1'
});

// 上传文件
await webdavRequest('notes/test.txt', 'PUT', {
  'Authorization': `Basic ${credentials}`,
  'Content-Type': 'text/plain'
}, 'Hello, World!');

// 下载文件
const content = await webdavRequest('notes/test.txt', 'GET', {
  'Authorization': `Basic ${credentials}`
});
```

### 4. 完整客户端

```typescript
class AISPWebDAVClient {
  constructor(username: string, password: string) {
    this.credentials = btoa(`${username}:${password}`);
  }

  async request(path: string, options: any) {
    return fetch('https://aisp-cors-proxy.vercel.app/api/cors-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path,
        options: {
          ...options,
          headers: { 'Authorization': `Basic ${this.credentials}`, ...options.headers }
        }
      })
    });
  }

  async list(path = '') {
    return this.request(path, {
      method: 'PROPFIND',
      headers: { 'Depth': '1' }
    });
  }

  async upload(path: string, content: string) {
    return this.request(path, {
      method: 'PUT',
      headers: { 'Content-Type': 'text/plain' },
      body: content
    });
  }

  async download(path: string) {
    return this.request(path, { method: 'GET' });
  }

  async delete(path: string) {
    return this.request(path, { method: 'DELETE' });
  }
}

// 使用
const client = new AISPWebDAVClient('your-email@example.com', 'your-app-password');
```

## 🔗 重要链接

- **API 文档**: [完整文档](./API_DOCUMENTATION.md)
- **测试页面**: https://aisp-cors-proxy.vercel.app/test
- **服务状态**: https://aisp-cors-proxy.vercel.app

## ⚠️ 注意事项

1. 使用坚果云应用密码，不是登录密码
2. 路径不需要以 `/` 开头
3. 所有请求都会自动添加 CORS 头部
4. 支持所有标准 WebDAV 方法

## 🆘 常见问题

**Q: 401 认证失败？**  
A: 检查邮箱和应用密码是否正确

**Q: 404 文件不存在？**  
A: 检查文件路径是否正确

**Q: CORS 错误？**  
A: 确保使用代理服务，不要直接访问 WebDAV 服务器

