/**
 * CORS 代理服务测试
 * 根据《实施计划》的测试要求
 */

import { NextRequest } from 'next/server';
import { POST, OPTIONS } from '@/app/api/cors-proxy/route';

// Mock fetch
global.fetch = jest.fn();

describe('CORS Proxy API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('OPTIONS request', () => {
    it('should handle OPTIONS preflight request', async () => {
      const request = new NextRequest('http://localhost:3000/api/cors-proxy', {
        method: 'OPTIONS',
        headers: {
          'origin': 'http://localhost:3000',
          'access-control-request-method': 'POST',
          'access-control-request-headers': 'content-type'
        }
      });

      const response = await OPTIONS(request);
      
      expect(response.status).toBe(204);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
    });
  });

  describe('POST request', () => {
    it('should handle valid proxy request', async () => {
      const mockResponse = new Response('test response', {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Etag': 'test-etag'
        }
      });

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/cors-proxy', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'origin': 'http://localhost:3000'
        },
        body: JSON.stringify({
          path: 'test-file.txt',
          options: {
            method: 'GET',
            headers: {
              'Authorization': 'Basic dGVzdDp0ZXN0'
            }
          }
        })
      });

      const response = await POST(request);
      
      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Etag')).toBe('test-etag');
      
      const responseBody = await response.text();
      expect(responseBody).toBe('test response');
    });

    it('should handle invalid request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/cors-proxy', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'origin': 'http://localhost:3000'
        },
        body: JSON.stringify({
          // Missing required 'path' field
          options: {
            method: 'GET'
          }
        })
      });

      const response = await POST(request);
      
      expect(response.status).toBe(400);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      
      const responseBody = await response.json();
      expect(responseBody.error).toContain('Missing or invalid "path"');
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const request = new NextRequest('http://localhost:3000/api/cors-proxy', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'origin': 'http://localhost:3000'
        },
        body: JSON.stringify({
          path: 'test-file.txt',
          options: {
            method: 'GET'
          }
        })
      });

      const response = await POST(request);
      
      expect(response.status).toBe(502);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      
      const responseBody = await response.json();
      expect(responseBody.error).toContain('Proxy request failed');
    });

    it('should handle timeout errors', async () => {
      const abortError = new Error('AbortError');
      abortError.name = 'AbortError';
      (global.fetch as jest.Mock).mockRejectedValue(abortError);

      const request = new NextRequest('http://localhost:3000/api/cors-proxy', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'origin': 'http://localhost:3000'
        },
        body: JSON.stringify({
          path: 'test-file.txt',
          options: {
            method: 'GET'
          }
        })
      });

      const response = await POST(request);
      
      expect(response.status).toBe(503);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      
      const responseBody = await response.json();
      expect(responseBody.error).toContain('Request timeout');
    });

    it('should sanitize path correctly', async () => {
      const mockResponse = new Response('test response', { status: 200 });
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/cors-proxy', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'origin': 'http://localhost:3000'
        },
        body: JSON.stringify({
          path: '//test//file.txt//',
          options: {
            method: 'GET'
          }
        })
      });

      const response = await POST(request);
      
      expect(response.status).toBe(200);
      
      // 验证 fetch 被调用时路径被正确清理
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('test/file.txt'),
        expect.any(Object)
      );
    });
  });
});
