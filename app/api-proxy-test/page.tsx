'use client';

import { useState } from 'react';

export default function ApiProxyTestPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('/api/test');
  const [token, setToken] = useState<string>('test-token');

  const testApiProxy = async (method: string) => {
    setLoading(true);
    setResult('');

    try {
      const params = new URLSearchParams({ url });
      if (token) {
        params.append('token', token);
      }

      const response = await fetch(`/api/api-proxy?${params.toString()}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: method !== 'GET' ? JSON.stringify({ test: 'data' }) : undefined
      });

      const responseText = await response.text();
      setResult(`Status: ${response.status}\nHeaders: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}\n\nResponse: ${responseText}`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testOptions = async () => {
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/api-proxy', {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'content-type'
        }
      });

      setResult(`Status: ${response.status}\nHeaders: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testSpecificApi = async () => {
    setLoading(true);
    setResult('');

    try {
      // 使用图片中提供的测试代码
      const testUrl = 'http://20.6.1.140:8081/v4/new-api/queryDeviceInfo';
      const testToken = 't9ws43729x4046b490981072dv1g4j42';
      
      const params = new URLSearchParams({ 
        url: testUrl,
        token: testToken
      });

      const response = await fetch(`/api/api-proxy?${params}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: 'deviceSn=DLP9E64001&deviceType=min'
      });

      const responseText = await response.text();
      setResult(`Status: ${response.status}\nHeaders: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}\n\nResponse: ${responseText}`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>API 代理服务测试页面</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>配置参数</h2>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>目标URL:</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            placeholder="/api/test 或 https://api.example.com/test"
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Token (可选):</label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            placeholder="认证token"
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>测试选项</h2>
        <button 
          onClick={testOptions}
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '测试中...' : '测试 OPTIONS 请求'}
        </button>
        
        <button 
          onClick={() => testApiProxy('GET')}
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '测试中...' : '测试 GET 请求'}
        </button>

        <button 
          onClick={() => testApiProxy('POST')}
          disabled={loading}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '测试中...' : '测试 POST 请求'}
        </button>

        <button 
          onClick={testSpecificApi}
          disabled={loading}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginLeft: '10px'
          }}
        >
          {loading ? '测试中...' : '测试特定API'}
        </button>
      </div>

      {result && (
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '5px',
          border: '1px solid #ddd',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          <h3>测试结果：</h3>
          {result}
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <h3>说明：</h3>
        <ul>
          <li><strong>OPTIONS 测试</strong>：测试 CORS 预检请求是否正常工作</li>
          <li><strong>GET 测试</strong>：测试 GET 请求代理功能</li>
          <li><strong>POST 测试</strong>：测试 POST 请求代理功能（包含请求体）</li>
          <li><strong>测试特定API</strong>：使用图片中提供的测试代码验证CORS修复</li>
          <li><strong>URL 格式</strong>：支持相对路径（如 /api/test）和绝对URL（如 https://api.example.com/test）</li>
          <li><strong>Token</strong>：如果提供token，会自动添加到请求头中</li>
          <li><strong>Content-Type</strong>：默认使用 application/x-www-form-urlencoded</li>
        </ul>
        
        <h3>示例URL：</h3>
        <ul>
          <li><code>/api/test</code> - 相对路径，会转换为 http://183.62.216.35:8081/v4/api/test</li>
          <li><code>https://api.example.com/test</code> - 绝对URL，直接使用</li>
          <li><code>/user/profile</code> - 用户信息接口</li>
        </ul>
      </div>
    </div>
  );
}
