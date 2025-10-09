
好的，完全没问题。从 Vercel 迁移到 Cloudflare Workers 来做 API 代理是一个非常棒的选择，尤其是在考虑中国大陆访问稳定性和速度方面，Cloudflare 通常表现更优。

我将为你提供一个非常详细、小白级别的分步指南。我们会一步一步地完成整个过程，包括创建 Cloudflare Worker、迁移现有代码、在本地测试，以及最后设置 GitHub Actions 实现和 Vercel 一样的自动部署。

---

### **迁移总览**

我们的目标是替换掉 Vercel 的部分，整个架构会从：

*   **旧架构**: `前端 (GitHub Pages)` -> `API 代理 (Vercel)` -> `真实 API`
*   **新架构**: `前端 (GitHub Pages)` -> `API 代理 (Cloudflare Worker)` -> `真实 API`

这个过程主要分为以下几个大步骤：

1.  **准备工作**: 创建 Cloudflare 账号并安装必要的工具。
2.  **创建和配置 Cloudflare Worker 项目**: 在你的代码仓库中建立一个新的 Worker 项目。
3.  **迁移 Vercel API 代码**: 将 Vercel Serverless Function 的逻辑代码修改为 Cloudflare Worker 兼容的格式。
4.  **本地测试**: 在部署前，确保你的 Worker 在本地能正常工作。
5.  **设置 GitHub Actions 自动部署**: 这是核心步骤，让代码推送到 GitHub 后能自动部署到 Cloudflare。
6.  **最终更新和验证**: 更新你的前端代码，使用新的 Cloudflare API 地址。

---

### **第一步：准备工作**

1.  **注册 Cloudflare 账号**: 如果你还没有，请访问 [Cloudflare 官网](https://dash.cloudflare.com/sign-up) 注册一个免费账号。
2.  **安装 Node.js 和 npm**: Cloudflare Workers 的开发工具依赖于 Node.js 环境。请确保你的电脑上已安装 Node.js (建议 LTS 版本)。安装后，`npm` 包管理器也会被一同安装。
    *   你可以在终端（Terminal 或 PowerShell）中输入 `node -v` 和 `npm -v` 来检查是否已安装。
3.  **安装 Wrangler CLI**: Wrangler 是 Cloudflare 官方的命令行工具，用于开发和部署 Workers。在终端中运行以下命令进行全局安装：
    ```bash
    npm install -g wrangler
    ```
4.  **登录 Wrangler**: 安装后，运行以下命令，它会打开一个浏览器窗口让你登录并授权 Wrangler 访问你的 Cloudflare 账号：
    ```bash
    wrangler login
    ```

### **第二步：创建和配置 Cloudflare Worker 项目**

我们将在你现有的 GitHub 项目中创建一个新的目录来存放 Worker 代码。

1.  **进入你的项目目录**:
    ```bash
    cd /path/to/your/github-project
    ```

2.  **使用 Wrangler 创建 Worker**: 运行以下命令。它会引导你创建一个新的 Worker 项目。
    ```bash
    wrangler init my-worker
    ```
    *   `my-worker` 是存放 Worker 代码的文件夹名，你可以自定义。
    *   在创建过程中，它会询问一些问题：
        *   `"Would you like to use git to manage this Worker?"` -> 输入 `n` (因为我们已经在父目录使用 git 了)。
        *   `"Would you like to deploy your Worker?"` -> 输入 `n` (我们稍后会手动部署和设置自动部署)。
        *   它会创建一个 "Hello World" 模板，我们稍后会修改它。

3.  **理解项目结构**:
    创建完成后，你的 `my-worker` 文件夹里会有如下结构：
    ```
    my-worker/
    ├── src/
    │   └── index.js   # 这是你的 Worker 逻辑核心文件
    ├── .wrangler/
    ├── .gitignore
    ├── package.json
    └── wrangler.toml  # 这是 Worker 的配置文件
    ```

4.  **配置 `wrangler.toml`**:
    打开 `my-worker/wrangler.toml` 文件，这是最重要的配置文件。它看起来像这样：
    ```toml
    name = "my-worker" # 你的 Worker 的名字，会成为 URL 的一部分
    main = "src/index.js"
    compatibility_date = "2023-10-30"
    ```
    *   `name`: 这个名字很重要，部署后你的 Worker 默认 URL 会是 `https://my-worker.你的子域名.workers.dev`。请确保这个名字在你的 Cloudflare 账号中是唯一的。你可以修改成更有意义的名字，比如 `my-api-proxy`。

### **第三步：迁移 Vercel API 代码**

这是最关键的一步。Vercel Serverless Functions 和 Cloudflare Workers 的代码结构和 API 有所不同。

**Vercel (Node.js 运行时) 的代码通常是这样的：**

它使用类似 Express.js 的 `req` (request) 和 `res` (response) 对象。

```javascript
// 假设这是你的 Vercel API 文件: /api/proxy.js

export default async function handler(req, res) {
  // 目标 API 地址
  const targetApiUrl = 'https://api.example.com/data';

  try {
    const apiResponse = await fetch(targetApiUrl, {
      method: req.method, // 使用原始请求的方法
      headers: {
        'Content-Type': 'application/json',
        // 转发其他必要的头信息
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : null,
    });

    if (!apiResponse.ok) {
      // 如果目标 API 返回错误，则将错误信息透传回去
      const errorData = await apiResponse.text();
      res.status(apiResponse.status).send(errorData);
      return;
    }

    const data = await apiResponse.json();

    // 成功，返回从目标 API 获取的数据
    res.status(200).json(data);

  } catch (error) {
    // 处理网络或其他错误
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
```

**现在，我们把它迁移到 Cloudflare Worker 的格式：**

Cloudflare Worker 使用标准的 Web API，如 `Request` 和 `Response` 对象。

打开 `my-worker/src/index.js` 文件，将其内容替换为以下代码，并根据你的 Vercel 代码进行修改：

```javascript
// 这是你的 Cloudflare Worker 文件: my-worker/src/index.js

export default {
  async fetch(request, env, ctx) {
    // 1. 创建一个 URL 对象，方便处理 URL
    const url = new URL(request.url);

    // 2. 定义你的真实 API 地址
    // 你可以根据请求路径动态设置目标地址
    // 例如，如果你的 Worker URL 是 /api/users，你想请求 https://api.example.com/users
    const targetApiHost = 'https://api.example.com'; // 替换为你的真实 API 地址
    const targetApiUrl = targetApiHost + url.pathname + url.search;

    // 3. 创建一个新的请求头对象，可以修改或添加头信息
    const newHeaders = new Headers(request.headers);
    newHeaders.set('Host', new URL(targetApiHost).host); // 修改 Host 头，指向目标服务器
    // 如果需要，可以在这里添加认证信息，例如：
    // newHeaders.set('Authorization', 'Bearer YOUR_API_KEY');

    // 4. 创建对目标 API 的请求
    // 注意：request.body, request.method 等属性可以直接使用
    const apiRequest = new Request(targetApiUrl, {
      method: request.method,
      headers: newHeaders,
      body: request.body,
      redirect: 'follow', // 遵循重定向
    });

    try {
      // 5. 发送请求到目标 API
      const apiResponse = await fetch(apiRequest);

      // 6. 处理 CORS (跨域资源共享) - 非常重要！
      // 因为你的前端 (GitHub Pages) 和 Worker (Cloudflare) 是不同域的
      const responseHeaders = new Headers(apiResponse.headers);
      responseHeaders.set('Access-Control-Allow-Origin', '*'); // 或者指定你的 GitHub Pages 域名，更安全
      responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      // 对于 OPTIONS 预检请求，直接返回成功
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: responseHeaders,
        });
      }

      // 7. 将目标 API 的响应返回给前端
      return new Response(apiResponse.body, {
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        headers: responseHeaders,
      });

    } catch (error) {
      // 处理网络错误等
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};
```

**代码迁移要点对比**:

| 功能 | Vercel (Node.js) | Cloudflare Worker (Web API) |
| :--- | :--- | :--- |
| **函数入口** | `export default function(req, res)` | `export default { async fetch(request, env, ctx) }` |
| **获取请求方法** | `req.method` | `request.method` |
| **获取请求体** | `req.body` (需要 Vercel 配置解析) | `request.json()` 或 `request.text()` (异步) |
| **获取查询参数** | `req.query` | `new URL(request.url).searchParams.get('key')` |
| **发送 JSON 响应** | `res.status(200).json({ a: 1 })` | `new Response(JSON.stringify({ a: 1 }), { headers: { 'Content-Type': 'application/json' } })` |
| **设置响应头** | `res.setHeader('key', 'value')` | `const headers = new Headers(); headers.set('key', 'value'); new Response(..., { headers })` |
| **处理跨域(CORS)**| 通常在 `vercel.json` 或代码中设置 | 必须在代码中手动为 `Response` 对象添加 `Access-Control-Allow-*` 头 |

### **第四步：本地测试**

在部署到线上之前，先在本地运行和测试可以大大提高效率。

1.  **进入 Worker 目录**:
    ```bash
    cd my-worker
    ```
2.  **启动本地开发服务器**:
    ```bash
    wrangler dev
    ```
    终端会输出一个本地地址，通常是 `http://localhost:8787`。

3.  **测试 API**:
    现在，你可以使用 `curl`、Postman 或直接在浏览器中（如果是 GET 请求）访问 `http://localhost:8787` 来测试你的代理。
    例如，如果你的代码是代理 `https://api.example.com/users`，你可以访问 `http://localhost:8787/users`，它应该会返回 `api.example.com` 的数据。

### **第五步：设置 GitHub Actions 自动部署**

这是实现 "push-to-deploy" 的关键。

1.  **获取 Cloudflare Account ID 和 API Token**:
    *   **Account ID**:
        *   登录 Cloudflare Dashboard。
        *   在主页右侧的菜单中，点击 "Workers & Pages"。
        *   在右侧边栏，你会看到你的 **Account ID**。复制它。
    *   **API Token**:
        *   在 Cloudflare Dashboard，点击右上角你的头像，选择 "My Profile"。
        *   转到左侧的 "API Tokens" 标签页。
        *   点击 "Create Token"。
        *   选择 "Edit Cloudflare Workers" 这个模板，点击 "Use template"。
        *   你可以保持默认设置，它拥有部署 Worker 所需的全部权限。继续到 "Summary"。
        *   点击 "Create Token"。
        *   **重要**: Cloudflare 会显示一个 Token。**这是你唯一一次能看到它的机会**，请立即复制并妥善保管。

2.  **在 GitHub 仓库中设置 Secrets**:
    *   进入你的 GitHub 项目页面。
    *   点击 "Settings" -> "Secrets and variables" -> "Actions"。
    *   点击 "New repository secret"。
    *   创建两个 Secret：
        *   **Name**: `CLOUDFLARE_ACCOUNT_ID`
          **Secret**: 粘贴你刚才复制的 Account ID。
        *   **Name**: `CLOUDFLARE_API_TOKEN`
          **Secret**: 粘贴你刚才创建的 API Token。
    *   **为什么要用 Secrets?** 这样可以避免将敏感信息直接写在代码或配置文件里，更加安全。

3.  **创建 GitHub Actions Workflow 文件**:
    *   在你的项目根目录下，创建 `.github/workflows` 文件夹（如果不存在的话）。
    *   在该文件夹下，创建一个 YAML 文件，例如 `deploy-worker.yml`。
    *   将以下内容粘贴到 `deploy-worker.yml` 文件中：

    ```yaml
    name: Deploy Cloudflare Worker

    on:
      push:
        branches:
          - main # 或者你的主分支名，比如 master
        paths:
          - 'my-worker/**' # 只有当 my-worker 目录下的文件发生变化时才触发

    jobs:
      deploy:
        runs-on: ubuntu-latest
        name: Deploy Worker
        steps:
          - name: Checkout
            uses: actions/checkout@v3

          - name: Setup Node.js
            uses: actions/setup-node@v3
            with:
              node-version: '18' # 使用一个较新的 Node.js 版本

          - name: Install Dependencies
            run: npm install
            working-directory: ./my-worker # 指定在 my-worker 目录下运行

          - name: Publish
            uses: cloudflare/wrangler-action@v3
            with:
              apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
              accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
              workingDirectory: 'my-worker' # 告诉 action Worker 的根目录在哪里
    ```

**这个 Workflow 文件的解释**:
*   `name`: Workflow 的名字。
*   `on`: 触发条件。这里设置为当 `main` 分支下的 `my-worker/` 目录有文件推送时触发。这样可以避免你修改前端代码时也去部署 Worker。
*   `jobs`: 定义一个名为 `deploy` 的任务。
*   `steps`:
    *   `Checkout`: 拉取你的 GitHub 代码。
    *   `Setup Node.js`: 安装 Node.js 环境。
    *   `Install Dependencies`: 进入 `my-worker` 目录，执行 `npm install` 安装依赖（如果你的 `package.json` 里有依赖的话）。
    *   `Publish`: 这是核心步骤，使用 Cloudflare 官方的 `wrangler-action`。它会读取你的 GitHub Secrets (`apiToken` 和 `accountId`)，并根据 `wrangler.toml` 的配置，将 `my-worker` 目录下的代码部署到 Cloudflare。

### **第六步：最终更新和验证**

1.  **提交代码**:
    将你创建的所有新文件 (`my-worker/` 目录和 `.github/workflows/deploy-worker.yml`) 添加到 git，然后提交并推送到 GitHub。
    ```bash
    git add .
    git commit -m "feat: Add Cloudflare Worker for API proxy and CI"
    git push origin main
    ```

2.  **检查 GitHub Actions**:
    推送到 GitHub 后，进入项目的 "Actions" 标签页。你会看到一个名为 "Deploy Cloudflare Worker" 的任务正在运行。等待它完成（变成绿色对勾）。

3.  **获取你的 Worker URL**:
    部署成功后，你的 Worker 就可以通过 `https://<wrangler.toml中的name>.<你的子域名>.workers.dev` 访问了。你可以在 Cloudflare Dashboard -> "Workers & Pages" 中找到并确认这个 URL。

4.  **更新前端代码**:
    在你 GitHub Pages 的前端代码中，找到所有调用 Vercel API 地址的地方，将它们全部替换成你新的 Cloudflare Worker URL。

5.  **验证**:
    访问你的 GitHub Pages 网站，进行操作，检查浏览器的开发者工具（网络面板），确认 API 请求是否成功发送到了你的 Cloudflare Worker 地址，并且得到了正确的响应。

---

### **总结与常见问题**

恭喜你！你已经成功地将 API 代理从 Vercel 迁移到了 Cloudflare Workers，并配置了自动化部署。

**优势**:
*   **稳定性**: Cloudflare 在全球（尤其中国大陆）的节点更多，网络质量通常更好。
*   **性能**: Workers 运行在边缘节点，延迟更低。
*   **成本**: Cloudflare 的免费额度非常慷慨（每天 10 万次请求），对于大多数项目来说完全够用。

**常见问题 (FAQ)**:
*   **Q: 我的 API 需要传递 Secret Key，怎么办？**
    *   **A**: 不要把 Key 写在代码里！在 Cloudflare Dashboard -> "Workers & Pages" -> 你的 Worker -> "Settings" -> "Variables" 中添加环境变量 (Environment Variables)。在代码中通过 `env.YOUR_VARIABLE_NAME` 来访问。
*   **Q: 前端报错 CORS 错误怎么办？**
    *   **A**: 确保你的 Worker 代码中正确设置了 `Access-Control-Allow-Origin` 等响应头。最简单的调试方法是先设置为 `*`，确认能通了之后，再为了安全，把它改成你的 GitHub Pages 域名 (例如 `https://your-username.github.io`)。
*   **Q: 如何查看 Worker 的日志来排错？**
    *   **A**: 在 `my-worker` 目录下运行 `wrangler tail` 命令，它会实时显示你线上 Worker 的 `console.log` 输出和错误信息，非常便于调试。

希望这份详尽的指南能帮助你顺利完成迁移！如果在任何步骤遇到问题，随时可以追问。