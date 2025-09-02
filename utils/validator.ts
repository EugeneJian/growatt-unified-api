/**
 * 请求验证工具
 * 根据《设计文档》的安全要求
 */

import { ProxyRequest, RequestOptions } from '@/types/proxy.types';

/**
 * 验证代理请求格式
 */
export function validateProxyRequest(body: any): { valid: boolean; error?: string } {
  try {
    // 检查请求体是否为对象
    if (!body || typeof body !== 'object') {
      return { valid: false, error: 'Request body must be a valid JSON object' };
    }

    // 检查必需的 path 字段（允许空字符串表示根目录）
    if (body.path === undefined || body.path === null || typeof body.path !== 'string') {
      return { valid: false, error: 'Missing or invalid "path" field' };
    }

    // 检查 path 字段格式（允许空字符串表示根目录）
    if (body.path.length > 1000) {
      return { valid: false, error: 'Path must be less than 1000 characters' };
    }

    // 检查 path 是否包含危险字符（路径遍历攻击）
    if (body.path.includes('..')) {
      return { valid: false, error: 'Path contains invalid characters' };
    }

    // 检查 options 字段
    if (!body.options || typeof body.options !== 'object') {
      return { valid: false, error: 'Missing or invalid "options" field' };
    }

    // 验证 options 内容
    const optionsValidation = validateRequestOptions(body.options);
    if (!optionsValidation.valid) {
      return optionsValidation;
    }

    return { valid: true };
  } catch (error) {
    return { 
      valid: false, 
      error: `Request validation error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

/**
 * 验证请求选项
 */
export function validateRequestOptions(options: RequestOptions): { valid: boolean; error?: string } {
  try {
    // 检查方法字段
    if (options.method && typeof options.method !== 'string') {
      return { valid: false, error: 'Method must be a string' };
    }

    // 验证 HTTP 方法
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PROPFIND', 'MKCOL', 'MOVE', 'COPY'];
    if (options.method && !validMethods.includes(options.method.toUpperCase())) {
      return { valid: false, error: `Invalid HTTP method: ${options.method}` };
    }

    // 检查头部字段
    if (options.headers && typeof options.headers !== 'object') {
      return { valid: false, error: 'Headers must be an object' };
    }

    // 验证头部内容
    if (options.headers) {
      for (const [key, value] of Object.entries(options.headers)) {
        if (typeof key !== 'string' || typeof value !== 'string') {
          return { valid: false, error: 'Header keys and values must be strings' };
        }
        
        // 检查头部长度
        if (key.length > 100 || value.length > 1000) {
          return { valid: false, error: 'Header key or value too long' };
        }
      }
    }

    // 检查请求体
    if (options.body !== undefined) {
      if (typeof options.body !== 'string' && !(options.body instanceof ArrayBuffer) && !(options.body instanceof FormData)) {
        return { valid: false, error: 'Body must be a string, ArrayBuffer, or FormData' };
      }
      
      // 检查请求体大小（字符串形式）
      if (typeof options.body === 'string' && options.body.length > 10 * 1024 * 1024) { // 10MB
        return { valid: false, error: 'Request body too large' };
      }
    }

    return { valid: true };
  } catch (error) {
    return { 
      valid: false, 
      error: `Options validation error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

/**
 * 验证来源
 */
export function validateOrigin(origin: string | null, allowedOrigins: string[]): boolean {
  if (!origin) {
    return allowedOrigins.includes('*');
  }

  return allowedOrigins.includes('*') || allowedOrigins.includes(origin);
}

/**
 * 验证请求大小
 */
export function validateRequestSize(contentLength: string | null): { valid: boolean; error?: string } {
  if (!contentLength) {
    return { valid: true };
  }

  const size = parseInt(contentLength);
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (isNaN(size) || size < 0) {
    return { valid: false, error: 'Invalid content length' };
  }

  if (size > maxSize) {
    return { valid: false, error: 'Request too large' };
  }

  return { valid: true };
}

/**
 * 清理和标准化路径
 */
export function sanitizePath(path: string): string {
  // 移除多余的斜杠
  let cleanPath = path.replace(/\/+/g, '/');
  
  // 确保不以斜杠开头（除了根路径）
  if (cleanPath !== '/' && cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1);
  }
  
  // 移除末尾的斜杠（除了根路径）
  if (cleanPath !== '/' && cleanPath.endsWith('/')) {
    cleanPath = cleanPath.substring(0, cleanPath.length - 1);
  }
  
  return cleanPath;
}
