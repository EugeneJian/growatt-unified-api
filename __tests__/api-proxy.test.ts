/**
 * API 代理服务测试
 */

import { NextRequest } from 'next/server';
import { GET, POST, OPTIONS } from '@/app/api/api-proxy/route';

// Mock fetch
global.fetch = jest.fn();

describe('API Proxy API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('OPTIONS request', () => {
    it('should handle OPTIONS preflight request', async () => {
      const request = new NextRequest('http://localhost:3000/api/api-proxy', {
        method: 'OPTIONS',
        headers: {
          'origin': 'http://localhost:3000',
          'access-control-request-method': 'GET',
          'access-control-request-headers': 'content-type'
        }
      });

      const response = await OPTIONS(request);
      
      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
    });
  });

  describe('GET request', () => {
    it('should handle valid API proxy request', async () => {
      const mockResponse = new Response('{"status": "success"}', {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/api-proxy?url=/test&token=test-token', {
        method: 'GET',
        headers: {
          'origin': 'http://localhost:3000'
        }
      });

      const response = await GET(request);
      
      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      
      const responseBody = await response.text();
      expect(responseBody).toBe('{"status": "success"}');
    });

    it('should handle missing url parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/api-proxy', {
        method: 'GET',
        headers: {
          'origin': 'http://localhost:3000'
        }
      });

      const response = await GET(request);
      
      expect(response.status).toBe(400);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      
      const responseBody = await response.json();
      expect(responseBody.error).toContain('Missing url parameter');
    });

    it('should handle invalid url format', async () => {
      const request = new NextRequest('http://localhost:3000/api/api-proxy?url=../etc/passwd', {
        method: 'GET',
        headers: {
          'origin': 'http://localhost:3000'
        }
      });

      const response = await GET(request);
      
      expect(response.status).toBe(500);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      
      const responseBody = await response.json();
      expect(responseBody.error).toContain('Proxy error');
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const request = new NextRequest('http://localhost:3000/api/api-proxy?url=/test', {
        method: 'GET',
        headers: {
          'origin': 'http://localhost:3000'
        }
      });

      const response = await GET(request);
      
      expect(response.status).toBe(500);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      
      const responseBody = await response.json();
      expect(responseBody.error).toContain('Proxy error');
    });

    it('should handle timeout errors', async () => {
      const abortError = new Error('AbortError');
      abortError.name = 'AbortError';
      (global.fetch as jest.Mock).mockRejectedValue(abortError);

      const request = new NextRequest('http://localhost:3000/api/api-proxy?url=/test', {
        method: 'GET',
        headers: {
          'origin': 'http://localhost:3000'
        }
      });

      const response = await GET(request);
      
      expect(response.status).toBe(500);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      
      const responseBody = await response.json();
      expect(responseBody.error).toContain('Proxy error');
    });
  });

  describe('POST request', () => {
    it('should handle POST request with body', async () => {
      const mockResponse = new Response('{"result": "created"}', {
        status: 201,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/api-proxy?url=/create', {
        method: 'POST',
        headers: {
          'origin': 'http://localhost:3000',
          'content-type': 'application/json'
        },
        body: JSON.stringify({ name: 'test' })
      });

      const response = await POST(request);
      
      expect(response.status).toBe(201);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      
      const responseBody = await response.text();
      expect(responseBody).toBe('{"result": "created"}');
    });

    it('should handle POST request without body', async () => {
      const mockResponse = new Response('{"result": "success"}', {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/api-proxy?url=/action', {
        method: 'POST',
        headers: {
          'origin': 'http://localhost:3000'
        }
      });

      const response = await POST(request);
      
      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      
      const responseBody = await response.text();
      expect(responseBody).toBe('{"result": "success"}');
    });
  });

  describe('URL handling', () => {
    it('should handle relative URLs', async () => {
      const mockResponse = new Response('{"status": "success"}', { status: 200 });
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/api-proxy?url=/api/test', {
        method: 'GET',
        headers: {
          'origin': 'http://localhost:3000'
        }
      });

      const response = await GET(request);
      
      expect(response.status).toBe(200);
      
      // 验证 fetch 被调用时使用原始URL（不再自动添加基础URL）
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/test',
        expect.any(Object)
      );
    });

    it('should handle absolute URLs', async () => {
      const mockResponse = new Response('{"status": "success"}', { status: 200 });
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/api-proxy?url=https://api.example.com/test', {
        method: 'GET',
        headers: {
          'origin': 'http://localhost:3000'
        }
      });

      const response = await GET(request);
      
      expect(response.status).toBe(200);
      
      // 验证 fetch 被调用时使用原始URL
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.any(Object)
      );
    });
  });

  describe('Token handling', () => {
    it('should add token to headers when provided', async () => {
      const mockResponse = new Response('{"status": "success"}', { status: 200 });
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/api-proxy?url=/test&token=my-token', {
        method: 'GET',
        headers: {
          'origin': 'http://localhost:3000'
        }
      });

      const response = await GET(request);
      
      expect(response.status).toBe(200);
      
      // 验证 fetch 被调用时包含token头部
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'token': 'my-token'
          })
        })
      );
    });

    it('should work without token', async () => {
      const mockResponse = new Response('{"status": "success"}', { status: 200 });
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/api-proxy?url=/test', {
        method: 'GET',
        headers: {
          'origin': 'http://localhost:3000'
        }
      });

      const response = await GET(request);
      
      expect(response.status).toBe(200);
      
      // 验证 fetch 被调用时不包含token头部
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.not.objectContaining({
            'token': expect.anything()
          })
        })
      );
    });
  });
});
