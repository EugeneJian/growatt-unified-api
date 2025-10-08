/**
 * 日志工具
 * 根据《实施计划》的日志记录要求
 */

import { LogEntry, LogLevel } from '@/types/proxy.types';

/**
 * 生成请求 ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 格式化时间戳
 */
export function formatTimestamp(): string {
  return new Date().toISOString();
}

/**
 * 创建日志条目
 */
export function createLogEntry(
  level: LogLevel,
  message: string,
  requestId?: string,
  data?: Record<string, unknown> | string
): LogEntry {
  return {
    level,
    message,
    timestamp: formatTimestamp(),
    requestId,
    data
  };
}

/**
 * 日志记录器类
 */
export class Logger {
  private requestId?: string;

  constructor(requestId?: string) {
    this.requestId = requestId;
  }

  /**
   * 记录调试日志
   */
  debug(message: string, data?: Record<string, unknown> | string): void {
    this.log('debug', message, data);
  }

  /**
   * 记录信息日志
   */
  info(message: string, data?: Record<string, unknown> | string): void {
    this.log('info', message, data);
  }

  /**
   * 记录警告日志
   */
  warn(message: string, data?: Record<string, unknown> | string): void {
    this.log('warn', message, data);
  }

  /**
   * 记录错误日志
   */
  error(message: string, data?: Record<string, unknown> | string): void {
    this.log('error', message, data);
  }

  /**
   * 记录日志
   */
  private log(level: LogLevel, message: string, data?: Record<string, unknown> | string): void {
    const logEntry = createLogEntry(level, message, this.requestId, data);
    
    // 在开发环境中输出到控制台
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${logEntry.timestamp}] [${level.toUpperCase()}] ${message}`, data);
    }
    
    // 在生产环境中，可以发送到外部日志服务
    // 这里暂时只输出到控制台，Vercel 会自动收集这些日志
    if (level === 'error') {
      console.error(JSON.stringify(logEntry));
    } else {
      console.log(JSON.stringify(logEntry));
    }
  }
}

/**
 * 创建带请求 ID 的日志记录器
 */
export function createLogger(requestId?: string): Logger {
  return new Logger(requestId);
}

/**
 * 记录代理请求开始
 */
export function logProxyRequestStart(
  logger: Logger,
  targetUrl: string,
  method: string
): void {
  logger.info('Proxy request started', {
    targetUrl,
    method,
    timestamp: formatTimestamp()
  });
}

/**
 * 记录代理请求完成
 */
export function logProxyRequestComplete(
  logger: Logger,
  targetUrl: string,
  status: number,
  responseTime: number
): void {
  logger.info('Proxy request completed', {
    targetUrl,
    status,
    responseTime,
    timestamp: formatTimestamp()
  });
}

/**
 * 记录代理请求错误
 */
export function logProxyRequestError(
  logger: Logger,
  targetUrl: string,
  error: Error,
  responseTime?: number
): void {
  logger.error('Proxy request failed', {
    targetUrl,
    error: error.message,
    stack: error.stack,
    responseTime,
    timestamp: formatTimestamp()
  });
}
