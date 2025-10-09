/**
 * AI 代理服务测试
 * 测试 DeepSeek、OpenAI 等 AI 服务的代理功能
 */

import { NextRequest } from 'next/server';
import { GET, POST, OPTIONS } from '@/app/api/ai-proxy/route';

// Mock fetch
global.fetch = jest.fn();

describe('AI Proxy API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('OPTIONS request', () => {
    it('should handle OPTIONS preflight request', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const request = new NextRequest('http://localhost:3000/api/ai-proxy', {
        method: 'OPTIONS',
        headers: {
          'origin': 'http://localhost:3000',
          'access-control-request-method': 'POST',
          'access-control-request-headers': 'content-type,authorization'
        }
      });

      const response = await OPTIONS();
      
      expect(response.status).toBe(204);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
    });
  });

  describe('POST request', () => {
    it('should handle valid AI proxy request', async () => {
      const mockResponse = new Response(JSON.stringify({
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: 1677652288,
        model: 'deepseek-chat',
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: 'Hello! How can I help you?',
          },
          finish_reason: 'stop'
        }]
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const request = new NextRequest(
        'http://localhost:3000/api/ai-proxy?url=https%3A%2F%2Fapi.deepseek.com%2Fchat%2Fcompletions',
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer sk-test123',
            'origin': 'http://localhost:3000'
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { role: 'user', content: 'Hello' }
            ]
          })
        }
      );

      const response = await POST(request);
      
      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      
      const responseBody = await response.json();
      expect(responseBody.object).toBe('chat.completion');
      expect(responseBody.choices[0].message.content).toBe('Hello! How can I help you?');
    });

    it('should handle missing url parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai-proxy', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'origin': 'http://localhost:3000'
        }
      });

      const response = await POST(request);
      
      expect(response.status).toBe(400);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      
      const responseBody = await response.json();
      expect(responseBody.error).toContain('Missing url parameter');
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const request = new NextRequest(
        'http://localhost:3000/api/ai-proxy?url=https%3A%2F%2Fapi.deepseek.com%2Fchat%2Fcompletions',
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer sk-test123',
            'origin': 'http://localhost:3000'
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [{ role: 'user', content: 'Hello' }]
          })
        }
      );

      const response = await POST(request);
      
      expect(response.status).toBe(502);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      
      const responseBody = await response.json();
      expect(responseBody.error).toContain('代理请求失败');
    });

    it('should handle timeout errors', async () => {
      const abortError = new Error('AbortError');
      abortError.name = 'AbortError';
      (global.fetch as jest.Mock).mockRejectedValue(abortError);

      const request = new NextRequest(
        'http://localhost:3000/api/ai-proxy?url=https%3A%2F%2Fapi.deepseek.com%2Fchat%2Fcompletions',
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer sk-test123',
            'origin': 'http://localhost:3000'
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [{ role: 'user', content: 'Hello' }]
          })
        }
      );

      const response = await POST(request);
      
      expect(response.status).toBe(502);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      
      const responseBody = await response.json();
      expect(responseBody.error).toContain('AI服务响应超时');
    });

    it('should forward authorization header', async () => {
      const mockResponse = new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const request = new NextRequest(
        'http://localhost:3000/api/ai-proxy?url=https%3A%2F%2Fapi.deepseek.com%2Fchat%2Fcompletions',
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer sk-acfe7123456',
            'origin': 'http://localhost:3000'
          },
          body: JSON.stringify({ test: 'data' })
        }
      );

      await POST(request);

      // 验证 fetch 被调用时包含 authorization 头部
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.deepseek.com/chat/completions',
        expect.objectContaining({
          headers: expect.objectContaining({
            'authorization': 'Bearer sk-acfe7123456'
          })
        })
      );
    });

    it('should handle OpenAI API request', async () => {
      const mockResponse = new Response(JSON.stringify({
        id: 'chatcmpl-openai-123',
        object: 'chat.completion',
        model: 'gpt-4',
        choices: [{
          message: {
            role: 'assistant',
            content: 'OpenAI response',
          }
        }]
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const request = new NextRequest(
        'http://localhost:3000/api/ai-proxy?url=https%3A%2F%2Fapi.openai.com%2Fv1%2Fchat%2Fcompletions',
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer sk-openai-token',
            'origin': 'http://localhost:3000'
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [{ role: 'user', content: 'Hello' }]
          })
        }
      );

      const response = await POST(request);
      
      expect(response.status).toBe(200);
      const responseBody = await response.json();
      expect(responseBody.choices[0].message.content).toBe('OpenAI response');
    });

    it('should stream via SSE when upstream returns event-stream', async () => {
      // 构造一个可读流模拟 SSE
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode('data: {"delta":"hello"}\n\n'));
          controller.close();
        }
      });

      const mockResponse = new Response(stream, {
        status: 200,
        headers: { 'Content-Type': 'text/event-stream; charset=utf-8' }
      });

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const request = new NextRequest(
        'http://localhost:3000/api/ai-proxy?url=https%3A%2F%2Fapi.deepseek.com%2Fchat%2Fcompletions',
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer sk-test123',
            'accept': 'text/event-stream',
            'origin': 'http://localhost:3000'
          },
          body: JSON.stringify({ model: 'deepseek-chat', stream: true, messages: [{ role: 'user', content: 'Hi' }] })
        }
      );

      const response = await POST(request);
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('text/event-stream');

      // 读取返回的 ReadableStream 以确认是流
      const reader = (response.body as ReadableStream).getReader();
      const { value, done } = await reader.read();
      expect(done).toBe(false);
      expect(new TextDecoder().decode(value)).toContain('data:');
      reader.releaseLock();
    });

    it('should stream when query param stream=true is provided', async () => {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode('data: ping\n\n'));
          controller.close();
        }
      });

      const mockResponse = new Response(stream, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' } // 非 event-stream，但强制通过 query 启用
      });

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const request = new NextRequest(
        'http://localhost:3000/api/ai-proxy?url=https%3A%2F%2Fapi.openai.com%2Fv1%2Fchat%2Fcompletions&stream=true',
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer sk-openai-token',
            'origin': 'http://localhost:3000'
          },
          body: JSON.stringify({ model: 'gpt-4', stream: true, messages: [{ role: 'user', content: 'Hello' }] })
        }
      );

      const response = await POST(request);
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('text/event-stream');
      const reader = (response.body as ReadableStream).getReader();
      const { value, done } = await reader.read();
      expect(done).toBe(false);
      expect(new TextDecoder().decode(value)).toContain('data: ping');
      reader.releaseLock();
    });
  });

  describe('GET request', () => {
    it('should handle GET request for models list', async () => {
      const mockResponse = new Response(JSON.stringify({
        data: [
          { id: 'deepseek-chat', object: 'model' },
          { id: 'deepseek-coder', object: 'model' }
        ]
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const request = new NextRequest(
        'http://localhost:3000/api/ai-proxy?url=https%3A%2F%2Fapi.deepseek.com%2Fmodels',
        {
          method: 'GET',
          headers: {
            'authorization': 'Bearer sk-test123',
            'origin': 'http://localhost:3000'
          }
        }
      );

      const response = await GET(request);
      
      expect(response.status).toBe(200);
      const responseBody = await response.json();
      expect(responseBody.data).toHaveLength(2);
    });
  });

  describe('URL handling', () => {
    it('should decode URL-encoded target URL', async () => {
      const mockResponse = new Response('{}', { status: 200 });
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const encodedUrl = encodeURIComponent('https://api.deepseek.com/chat/completions');
      const request = new NextRequest(
        `http://localhost:3000/api/ai-proxy?url=${encodedUrl}`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'origin': 'http://localhost:3000'
          },
          body: JSON.stringify({})
        }
      );

      await POST(request);

      // 验证解码后的URL被正确使用
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.deepseek.com/chat/completions',
        expect.any(Object)
      );
    });
  });
});

