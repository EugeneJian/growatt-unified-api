/**
 * AI 代理服务使用示例
 * 展示如何使用代理服务调用 DeepSeek 和 OpenAI
 */

// ====== 基本使用 ======

const AI_PROXY_URL = 'https://aisp-cors-proxy.vercel.app/api/ai-proxy';

// DeepSeek 示例
async function chatWithDeepSeek(message: string, apiKey: string) {
  const targetUrl = 'https://api.deepseek.com/chat/completions';
  
  const response = await fetch(`${AI_PROXY_URL}?url=${encodeURIComponent(targetUrl)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'user', content: message }
      ],
      temperature: 0.6,
      max_tokens: 2000,
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error(`请求失败: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// OpenAI 示例
async function chatWithOpenAI(message: string, apiKey: string) {
  const targetUrl = 'https://api.openai.com/v1/chat/completions';
  
  const response = await fetch(`${AI_PROXY_URL}?url=${encodeURIComponent(targetUrl)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: message }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`请求失败: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ====== 封装的客户端类 ======

class AIProxyClient {
  private proxyUrl: string;
  private apiKey: string;
  private baseUrl: string;

  constructor(proxyUrl: string, apiKey: string, baseUrl: string) {
    this.proxyUrl = proxyUrl;
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * 发送聊天请求
   */
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

  /**
   * 获取可用模型列表
   */
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

// ====== 使用示例 ======

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function examples() {
  // 示例 1: 使用 DeepSeek
  const deepseekClient = new AIProxyClient(
    'https://aisp-cors-proxy.vercel.app/api/ai-proxy',
    'sk-your-deepseek-key',
    'https://api.deepseek.com'
  );

  const deepseekResponse = await deepseekClient.chat([
    { role: 'user', content: 'Hello, how are you?' }
  ]);

  console.log('DeepSeek:', deepseekResponse.choices[0].message.content);

  // 示例 2: 使用 OpenAI
  const openaiClient = new AIProxyClient(
    'https://aisp-cors-proxy.vercel.app/api/ai-proxy',
    'sk-your-openai-key',
    'https://api.openai.com/v1'
  );

  const openaiResponse = await openaiClient.chat([
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is the capital of France?' }
  ], {
    model: 'gpt-4'
  });

  console.log('OpenAI:', openaiResponse.choices[0].message.content);

  // 示例 3: 多轮对话
  const conversation = [
    { role: 'user', content: 'What is 2+2?' },
  ];

  let response = await deepseekClient.chat(conversation);
  console.log('AI:', response.choices[0].message.content);

  // 添加 AI 的回复到对话历史
  conversation.push({
    role: 'assistant',
    content: response.choices[0].message.content
  });

  // 继续对话
  conversation.push({
    role: 'user',
    content: 'And what is 3+3?'
  });

  response = await deepseekClient.chat(conversation);
  console.log('AI:', response.choices[0].message.content);
}

// ====== 错误处理示例 ======

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function errorHandlingExample() {
  const client = new AIProxyClient(
    'https://aisp-cors-proxy.vercel.app/api/ai-proxy',
    'sk-your-key',
    'https://api.deepseek.com'
  );

  try {
    const response = await client.chat([
      { role: 'user', content: 'Hello!' }
    ]);
    console.log(response.choices[0].message.content);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        console.error('认证失败: API Key 无效');
      } else if (error.message.includes('429')) {
        console.error('请求过于频繁，请稍后重试');
      } else if (error.message.includes('504')) {
        console.error('请求超时，请重试');
      } else {
        console.error('未知错误:', error.message);
      }
    }
  }
}

// ====== React Hook 示例 ======
// 注意：这是伪代码示例，仅用于说明如何在 React 中使用

/*
import { useState } from 'react';

function useAIChat(client: AIProxyClient) {
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    setLoading(true);
    setError(null);

    const newMessage = { role: 'user', content };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    try {
      const response = await client.chat(updatedMessages);
      const aiMessage = {
        role: 'assistant',
        content: response.choices[0].message.content
      };
      setMessages([...updatedMessages, aiMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMessages([]);
    setError(null);
  };

  return { messages, loading, error, sendMessage, reset };
}

// 在组件中使用
function ChatComponent() {
  const client = new AIProxyClient(
    'https://aisp-cors-proxy.vercel.app/api/ai-proxy',
    'sk-your-key',
    'https://api.deepseek.com'
  );

  const { messages, loading, error, sendMessage, reset } = useAIChat(client);

  return (
    <div>
      {messages.map((msg, idx) => (
        <div key={idx}>
          <strong>{msg.role}:</strong> {msg.content}
        </div>
      ))}
      {loading && <div>加载中...</div>}
      {error && <div>错误: {error}</div>}
      <button onClick={() => sendMessage('Hello!')}>发送</button>
      <button onClick={reset}>重置</button>
    </div>
  );
}
*/

export { chatWithDeepSeek, chatWithOpenAI, AIProxyClient };

