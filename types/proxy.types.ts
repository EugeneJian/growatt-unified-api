/**
 * CORS 代理服务类型定义
 * 根据《设计文档》和《实施计划》的类型要求
 */

/**
 * 代理请求体结构
 */
export interface ProxyRequest {
  /** WebDAV 路径 */
  path: string;
  /** 原始请求选项 */
  options: RequestOptions;
}

/**
 * 请求选项接口
 */
export interface RequestOptions {
  /** HTTP 方法 */
  method?: string;
  /** 请求头 */
  headers?: Record<string, string>;
  /** 请求体 */
  body?: string | ArrayBuffer | FormData;
  /** 其他 fetch 选项 */
  [key: string]: any;
}

/**
 * 代理响应结构
 */
export interface ProxyResponse {
  /** 响应状态码 */
  status: number;
  /** 响应头 */
  headers: Record<string, string>;
  /** 响应体 */
  body: ArrayBuffer | string;
  /** 是否成功 */
  success: boolean;
  /** 错误信息（如果有） */
  error?: string;
}

/**
 * 错误响应结构
 */
export interface ErrorResponse {
  /** 错误类型 */
  error: string;
  /** 错误详情 */
  details?: string;
  /** 时间戳 */
  timestamp: string;
  /** 请求 ID（用于追踪） */
  requestId?: string;
}

/**
 * 日志级别
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * 日志条目结构
 */
export interface LogEntry {
  /** 日志级别 */
  level: LogLevel;
  /** 日志消息 */
  message: string;
  /** 时间戳 */
  timestamp: string;
  /** 请求 ID */
  requestId?: string;
  /** 额外数据 */
  data?: any;
}

/**
 * 速率限制信息
 */
export interface RateLimitInfo {
  /** 当前请求数 */
  current: number;
  /** 最大请求数 */
  limit: number;
  /** 重置时间 */
  resetTime: number;
  /** 是否超出限制 */
  exceeded: boolean;
}

/**
 * 代理统计信息
 */
export interface ProxyStats {
  /** 总请求数 */
  totalRequests: number;
  /** 成功请求数 */
  successfulRequests: number;
  /** 失败请求数 */
  failedRequests: number;
  /** 平均响应时间 */
  averageResponseTime: number;
  /** 最后更新时间 */
  lastUpdated: string;
}

/**
 * WebDAV 操作类型
 */
export type WebDAVMethod = 
  | 'GET' 
  | 'PUT' 
  | 'DELETE' 
  | 'PROPFIND' 
  | 'PROPPATCH' 
  | 'MKCOL' 
  | 'MOVE' 
  | 'COPY' 
  | 'LOCK' 
  | 'UNLOCK';

/**
 * 环境配置
 */
export interface EnvironmentConfig {
  /** 是否为开发环境 */
  isDevelopment: boolean;
  /** 是否为生产环境 */
  isProduction: boolean;
  /** 代理模式 */
  proxyMode: 'vite' | 'cors';
  /** CORS 代理 URL */
  corsProxyUrl?: string;
  /** 请求超时时间 */
  timeout: number;
  /** 重试次数 */
  retryCount: number;
}
