'use client';

import { useState } from 'react';

export default function TestPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const testCorsProxy = async () => {
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/cors-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: '',
          options: {
            method: 'PROPFIND',
            headers: {
              'Authorization': 'Basic dGVzdDp0ZXN0', // test:test in base64
              'Depth': '1'
            }
          }
        })
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
      const response = await fetch('/api/cors-proxy', {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'POST',
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

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>CORS 代理服务测试页面</h1>
      
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
          onClick={testCorsProxy}
          disabled={loading}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '测试中...' : '测试 POST 请求'}
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
          <li><strong>POST 测试</strong>：测试代理请求转发功能（会尝试访问坚果云 WebDAV 服务器）</li>
          <li>如果 POST 测试返回 401 错误，这是正常的，因为我们使用的是测试凭据</li>
          <li>重要的是检查响应头中是否包含正确的 CORS 头部</li>
        </ul>
      </div>
    </div>
  );
}
