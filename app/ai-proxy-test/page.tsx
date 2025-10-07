'use client';

import { useState } from 'react';

export default function AIProxyTest() {
  const [targetUrl, setTargetUrl] = useState('https://api.deepseek.com/chat/completions');
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState('Hello, AI!');
  const [model, setModel] = useState('deepseek-chat');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTest = async () => {
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const proxyUrl = `/api/ai-proxy?url=${encodeURIComponent(targetUrl)}`;
      
      const res = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'user', content: message }
          ],
          temperature: 0.6,
          max_tokens: 2000,
          stream: false
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(JSON.stringify(data, null, 2));
      } else {
        setResponse(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  };

  const presetConfigs = [
    {
      name: 'DeepSeek',
      url: 'https://api.deepseek.com/chat/completions',
      model: 'deepseek-chat'
    },
    {
      name: 'OpenAI GPT-4',
      url: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-4'
    },
    {
      name: 'OpenAI GPT-3.5',
      url: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-3.5-turbo'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI 代理测试</h1>
        <p className="text-gray-600 mb-8">测试 DeepSeek、OpenAI 等 AI 服务的代理功能</p>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">快速配置</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {presetConfigs.map((config) => (
              <button
                key={config.name}
                onClick={() => {
                  setTargetUrl(config.url);
                  setModel(config.model);
                }}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                {config.name}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                目标 API URL
              </label>
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://api.deepseek.com/chat/completions"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="sk-your-api-key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                模型
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="deepseek-chat"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                消息内容
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入你的消息..."
              />
            </div>

            <button
              onClick={handleTest}
              disabled={loading || !apiKey || !targetUrl}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '发送中...' : '发送测试请求'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold mb-2">错误</h3>
            <pre className="text-sm text-red-600 overflow-auto">{error}</pre>
          </div>
        )}

        {response && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="text-green-800 font-semibold mb-2">响应</h3>
            <pre className="text-sm text-gray-700 overflow-auto">{response}</pre>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-semibold mb-2">💡 使用提示</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 请先在 DeepSeek 或 OpenAI 平台获取 API Key</li>
            <li>• API Key 格式：sk-xxxxx</li>
            <li>• 支持的模型：deepseek-chat、gpt-4、gpt-3.5-turbo 等</li>
            <li>• 请求超时时间为 60 秒</li>
            <li>• 查看 <a href="/AI_PROXY_GUIDE.md" className="underline">AI 代理使用指南</a> 了解更多</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

