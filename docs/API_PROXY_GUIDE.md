# API 代理使用指南

## 🚀 快速开始

### 1. 基本使用

```typescript
// 简单的GET请求
async function getData(url: string, token?: string) {
  const params = new URLSearchParams({ url });
  if (token) params.append('token', token);
  
  const response = await fetch(`https://aisp-cors-proxy.vercel.app/api/api-proxy?${params}`);
  return response.json();
}

// 使用示例
const userData = await getData('/api/user/profile', 'your-token');
```

### 2. POST请求

```typescript
async function postData(url: string, data: any, token?: string) {
  const params = new URLSearchParams({ url });
  if (token) params.append('token', token);
  
  const response = await fetch(`https://aisp-cors-proxy.vercel.app/api/api-proxy?${params}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  return response.json();
}

// 使用示例
const result = await postData('/api/users', { name: 'John', email: 'john@example.com' }, 'your-token');
```

### 3. 完整的API客户端

```typescript
class ApiClient {
  private baseUrl: string;
  private token?: string;

  constructor(baseUrl: string, token?: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  private async request(url: string, options: RequestInit = {}) {
    const params = new URLSearchParams({ url });
    if (this.token) params.append('token', this.token);
    
    const response = await fetch(`${this.baseUrl}/api/api-proxy?${params}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async get(url: string) {
    return this.request(url, { method: 'GET' });
  }

  async post(url: string, data: any) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put(url: string, data: any) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async delete(url: string) {
    return this.request(url, { method: 'DELETE' });
  }
}

// 使用示例
const client = new ApiClient('https://aisp-cors-proxy.vercel.app', 'your-token');

// 获取用户信息
const user = await client.get('/api/user/profile');

// 创建新用户
const newUser = await client.post('/api/users', {
  name: 'Jane Doe',
  email: 'jane@example.com'
});

// 更新用户
const updatedUser = await client.put('/api/users/123', {
  name: 'Jane Smith'
});

// 删除用户
await client.delete('/api/users/123');
```

## 🔧 配置选项

### URL格式

- **相对路径**: `/api/test` → `http://183.62.216.35:8081/v4/api/test`
- **绝对URL**: `https://api.example.com/test` → `https://api.example.com/test`

### 支持的HTTP方法

- `GET` - 获取数据
- `POST` - 创建数据
- `PUT` - 更新数据
- `DELETE` - 删除数据
- `OPTIONS` - CORS预检请求

### 请求头

代理会自动添加以下请求头：
- `Content-Type: application/json`
- `Accept: application/json`
- `User-Agent: AISP-API-Proxy/1.0`
- `token: your-token` (如果提供)

## 🧪 测试

访问测试页面进行功能测试：
- **本地测试**: `http://localhost:3000/api-proxy-test`
- **在线测试**: `https://aisp-cors-proxy.vercel.app/api-proxy-test`

## ⚠️ 注意事项

1. **URL长度限制**: 最大2000字符
2. **请求体大小**: 最大10MB
3. **超时时间**: 30秒
4. **Token格式**: 必须是字符串类型
5. **CORS支持**: 自动处理跨域请求

## 🔒 安全特性

- 路径遍历攻击防护
- 请求大小限制
- 来源验证
- 输入验证和清理
- 错误信息不暴露敏感信息

## 📊 错误处理

```typescript
try {
  const data = await getData('/api/test', 'token');
  console.log(data);
} catch (error) {
  if (error.message.includes('400')) {
    console.error('请求参数错误');
  } else if (error.message.includes('401')) {
    console.error('认证失败');
  } else if (error.message.includes('500')) {
    console.error('服务器错误');
  } else {
    console.error('网络错误');
  }
}
```

## 🚀 部署

项目已部署到Vercel，可以直接使用：
- **API端点**: `https://aisp-cors-proxy.vercel.app/api/api-proxy`
- **测试页面**: `https://aisp-cors-proxy.vercel.app/api-proxy-test`

## 📞 支持

如有问题，请通过以下方式联系：
- 提交GitHub Issue
- 查看完整文档
- 使用在线测试工具
