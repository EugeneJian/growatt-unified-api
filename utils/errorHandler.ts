/**
 * 错误处理工具
 * 根据《设计文档》和《实施计划》的错误处理要求
 */

import { ErrorResponse } from '@/types/proxy.types';
import { Logger } from './logger';

/**
 * 错误类型枚举
 */
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PROXY_ERROR = 'PROXY_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

/**
 * 自定义错误类
 */
export class ProxyError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly requestId?: string;

  constructor(
    message: string,
    type: ErrorType,
    statusCode: number = 500,
    requestId?: string
  ) {
    super(message);
    this.name = 'ProxyError';
    this.type = type;
    this.statusCode = statusCode;
    this.requestId = requestId;
  }
}

/**
 * 创建错误响应
 */
export function createErrorResponse(
  error: Error,
  requestId?: string
): ErrorResponse {
  const timestamp = new Date().toISOString();
  
  if (error instanceof ProxyError) {
    return {
      error: error.message,
      details: error.type,
      timestamp,
      requestId: error.requestId || requestId
    };
  }

  // 处理不同类型的错误
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return {
      error: 'Network request failed',
      details: 'Unable to connect to the target server',
      timestamp,
      requestId
    };
  }

  if (error.name === 'AbortError') {
    return {
      error: 'Request timeout',
      details: 'The request took too long to complete',
      timestamp,
      requestId
    };
  }

  // 默认错误响应
  return {
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    timestamp,
    requestId
  };
}

/**
 * 处理验证错误
 */
export function handleValidationError(
  message: string,
  requestId?: string
): ProxyError {
  return new ProxyError(
    message,
    ErrorType.VALIDATION_ERROR,
    400,
    requestId
  );
}

/**
 * 处理代理错误
 */
export function handleProxyError(
  message: string,
  originalError?: Error,
  requestId?: string
): ProxyError {
  const errorMessage = originalError 
    ? `${message}: ${originalError.message}`
    : message;
    
  return new ProxyError(
    errorMessage,
    ErrorType.PROXY_ERROR,
    502,
    requestId
  );
}

/**
 * 处理网络错误
 */
export function handleNetworkError(
  message: string,
  originalError?: Error,
  requestId?: string
): ProxyError {
  const errorMessage = originalError 
    ? `${message}: ${originalError.message}`
    : message;
    
  return new ProxyError(
    errorMessage,
    ErrorType.NETWORK_ERROR,
    503,
    requestId
  );
}

/**
 * 处理超时错误
 */
export function handleTimeoutError(
  message: string = 'Request timeout',
  requestId?: string
): ProxyError {
  return new ProxyError(
    message,
    ErrorType.TIMEOUT_ERROR,
    504,
    requestId
  );
}

/**
 * 处理认证错误
 */
export function handleAuthenticationError(
  message: string = 'Authentication failed',
  requestId?: string
): ProxyError {
  return new ProxyError(
    message,
    ErrorType.AUTHENTICATION_ERROR,
    401,
    requestId
  );
}

/**
 * 处理授权错误
 */
export function handleAuthorizationError(
  message: string = 'Access denied',
  requestId?: string
): ProxyError {
  return new ProxyError(
    message,
    ErrorType.AUTHORIZATION_ERROR,
    403,
    requestId
  );
}

/**
 * 处理速率限制错误
 */
export function handleRateLimitError(
  message: string = 'Rate limit exceeded',
  requestId?: string
): ProxyError {
  return new ProxyError(
    message,
    ErrorType.RATE_LIMIT_ERROR,
    429,
    requestId
  );
}

/**
 * 处理内部错误
 */
export function handleInternalError(
  message: string = 'Internal server error',
  originalError?: Error,
  requestId?: string
): ProxyError {
  const errorMessage = originalError 
    ? `${message}: ${originalError.message}`
    : message;
    
  return new ProxyError(
    errorMessage,
    ErrorType.INTERNAL_ERROR,
    500,
    requestId
  );
}

/**
 * 记录错误
 */
export function logError(
  logger: Logger,
  error: Error,
  context?: string
): void {
  const contextMessage = context ? `[${context}] ` : '';
  
  if (error instanceof ProxyError) {
    logger.error(`${contextMessage}${error.type}: ${error.message}`, {
      type: error.type,
      statusCode: error.statusCode,
      requestId: error.requestId
    });
  } else {
    logger.error(`${contextMessage}${error.name}: ${error.message}`, {
      stack: error.stack,
      name: error.name
    });
  }
}

/**
 * 错误恢复策略
 */
export function shouldRetry(error: Error): boolean {
  if (error instanceof ProxyError) {
    // 网络错误和超时错误可以重试
    return error.type === ErrorType.NETWORK_ERROR || 
           error.type === ErrorType.TIMEOUT_ERROR;
  }
  
  // 网络相关的原生错误可以重试
  return error.name === 'TypeError' && error.message.includes('fetch');
}

/**
 * 获取重试延迟时间（毫秒）
 */
export function getRetryDelay(attempt: number): number {
  // 指数退避：1s, 2s, 4s, 8s...
  return Math.min(1000 * Math.pow(2, attempt - 1), 10000);
}

