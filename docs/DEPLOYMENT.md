# 部署指南

## 📦 部署到 Vercel

### 方法 1: 通过 Vercel CLI

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署到生产环境
vercel --prod
```

### 方法 2: 通过 GitHub 集成

1. 将代码推送到 GitHub
2. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
3. 点击 "Import Project"
4. 选择你的 GitHub 仓库
5. Vercel 会自动检测 Next.js 项目并配置
6. 点击 "Deploy"

### 环境变量配置

在 Vercel 项目设置中添加以下环境变量（可选）：

```
WEBDAV_BASE_URL=https://dav.jianguoyun.com/dav/
CORS_ALLOW_ORIGIN=*
REQUEST_TIMEOUT=30000
USER_AGENT=AISP-CORS-Proxy/1.0
```

## 🔧 部署后验证

### 1. 测试 CORS 代理

```bash
curl -X POST "https://your-domain.vercel.app/api/cors-proxy" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "",
    "options": {
      "method": "PROPFIND",
      "headers": {
        "Authorization": "Basic your-base64-credentials",
        "Depth": "0"
      }
    }
  }'
```

### 2. 测试 API 代理

```bash
curl "https://your-domain.vercel.app/api/api-proxy?url=https%3A%2F%2Fapi.github.com%2Fusers%2Fgithub"
```

### 3. 测试 AI 代理

```bash
curl -X POST "https://your-domain.vercel.app/api/ai-proxy?url=https%3A%2F%2Fapi.deepseek.com%2Fchat%2Fcompletions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-your-api-key" \
  -d '{
    "model": "deepseek-chat",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 4. 访问测试页面

- WebDAV 测试: `https://your-domain.vercel.app/test`
- API 代理测试: `https://your-domain.vercel.app/api-proxy-test`
- AI 代理测试: `https://your-domain.vercel.app/ai-proxy-test`

## 📊 监控和日志

### 查看部署日志

```bash
vercel logs your-deployment-url
```

### 在 Vercel Dashboard 查看

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 查看 "Deployments" 和 "Analytics" 标签

## 🔒 安全建议

1. **限制 CORS 来源**（生产环境）
   ```
   CORS_ALLOW_ORIGIN=https://your-frontend-domain.com
   ```

2. **启用速率限制**
   ```
   RATE_LIMIT_MAX=100
   RATE_LIMIT_WINDOW_MS=900000
   ```

3. **使用环境变量保护敏感信息**
   - 不要在代码中硬编码 API Key
   - 使用 Vercel 的环境变量功能

## 🚀 性能优化

### 1. 启用 Edge Runtime（可选）

在需要的路由文件中添加：

```typescript
export const runtime = 'edge';
```

### 2. 配置缓存策略

在 `vercel.json` 中添加缓存头：

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=60, stale-while-revalidate"
        }
      ]
    }
  ]
}
```

## 🔄 持续集成/部署

### GitHub Actions 示例

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📝 更新部署

### 更新代码

```bash
# 1. 更新代码
git add .
git commit -m "Update AI proxy service"
git push

# 2. Vercel 会自动部署（如果配置了 GitHub 集成）
# 或手动部署
vercel --prod
```

### 回滚部署

```bash
# 查看部署历史
vercel ls

# 回滚到特定部署
vercel rollback your-deployment-url
```

## 🆘 故障排除

### 部署失败

1. 检查构建日志
2. 确保 `package.json` 中的依赖正确
3. 验证 Node.js 版本兼容性

### API 响应错误

1. 检查 Vercel 函数日志
2. 验证环境变量配置
3. 测试本地开发环境

### 超时问题

1. 检查 `vercel.json` 中的 `maxDuration` 配置
2. 优化代码性能
3. 考虑使用 Edge Runtime

## 📞 获取帮助

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 文档](https://nextjs.org/docs)
- [项目 GitHub Issues](https://github.com/your-repo/issues)

---

**最后更新**: 2025年10月7日

