/**
 * AISP WebDAV CORS 代理服务类型定义
 * 用于 AISP 前端应用集成
 */

/**
 * 代理请求配置
 */
export interface ProxyRequest {
  /** WebDAV 路径 */
  path: string;
  /** 原始请求选项 */
  options: RequestOptions;
}

/**
 * 请求选项
 */
export interface RequestOptions {
  /** HTTP 方法 */
  method: string;
  /** 请求头 */
  headers?: Record<string, string>;
  /** 请求体 */
  body?: string | ArrayBuffer | FormData;
}

/**
 * 代理响应
 */
export interface ProxyResponse {
  /** 响应状态码 */
  status: number;
  /** 响应头 */
  headers: Headers;
  /** 响应体 */
  body: any;
  /** 是否成功 */
  ok: boolean;
}

/**
 * 错误响应
 */
export interface ErrorResponse {
  /** 错误类型 */
  error: string;
  /** 错误详情 */
  details?: string;
  /** 时间戳 */
  timestamp: string;
  /** 请求 ID */
  requestId?: string;
}

/**
 * WebDAV 客户端配置
 */
export interface WebDAVClientConfig {
  /** 代理服务 URL */
  proxyUrl: string;
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 请求超时时间（毫秒） */
  timeout?: number;
}

/**
 * WebDAV 文件信息
 */
export interface WebDAVFileInfo {
  /** 文件路径 */
  path: string;
  /** 文件大小 */
  size?: number;
  /** 最后修改时间 */
  lastModified?: string;
  /** 是否为目录 */
  isDirectory?: boolean;
  /** ETag */
  etag?: string;
}

/**
 * WebDAV 客户端接口
 */
export interface IWebDAVClient {
  /** 列出目录内容 */
  listDirectory(path?: string): Promise<WebDAVFileInfo[]>;
  
  /** 上传文件 */
  uploadFile(path: string, content: string, contentType?: string): Promise<ProxyResponse>;
  
  /** 下载文件 */
  downloadFile(path: string): Promise<string>;
  
  /** 删除文件 */
  deleteFile(path: string): Promise<ProxyResponse>;
  
  /** 创建目录 */
  createDirectory(path: string): Promise<ProxyResponse>;
  
  /** 移动文件 */
  moveFile(sourcePath: string, destinationPath: string): Promise<ProxyResponse>;
  
  /** 复制文件 */
  copyFile(sourcePath: string, destinationPath: string): Promise<ProxyResponse>;
  
  /** 检查文件是否存在 */
  exists(path: string): Promise<boolean>;
  
  /** 获取文件信息 */
  getFileInfo(path: string): Promise<WebDAVFileInfo>;
}

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

/**
 * 错误类型
 */
export enum WebDAVErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PROXY_ERROR = 'PROXY_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

/**
 * WebDAV 错误类
 */
export class WebDAVError extends Error {
  public readonly type: WebDAVErrorType;
  public readonly statusCode: number;
  public readonly requestId?: string;

  constructor(
    message: string,
    type: WebDAVErrorType,
    statusCode: number = 500,
    requestId?: string
  ) {
    super(message);
    this.name = 'WebDAVError';
    this.type = type;
    this.statusCode = statusCode;
    this.requestId = requestId;
  }
}

/**
 * 重试配置
 */
export interface RetryConfig {
  /** 最大重试次数 */
  maxRetries: number;
  /** 重试延迟（毫秒） */
  retryDelay: number;
  /** 是否应该重试 */
  shouldRetry: (error: Error) => boolean;
}

/**
 * 缓存配置
 */
export interface CacheConfig {
  /** 是否启用缓存 */
  enabled: boolean;
  /** 缓存过期时间（毫秒） */
  ttl: number;
  /** 最大缓存大小 */
  maxSize: number;
}

/**
 * 日志级别
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

/**
 * 日志配置
 */
export interface LogConfig {
  /** 日志级别 */
  level: LogLevel;
  /** 是否启用日志 */
  enabled: boolean;
  /** 日志前缀 */
  prefix?: string;
}

/**
 * 客户端统计信息
 */
export interface ClientStats {
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
 * 事件类型
 */
export enum WebDAVEventType {
  REQUEST_START = 'request_start',
  REQUEST_SUCCESS = 'request_success',
  REQUEST_ERROR = 'request_error',
  REQUEST_RETRY = 'request_retry',
  CACHE_HIT = 'cache_hit',
  CACHE_MISS = 'cache_miss'
}

/**
 * 事件数据
 */
export interface WebDAVEvent {
  /** 事件类型 */
  type: WebDAVEventType;
  /** 事件数据 */
  data: any;
  /** 时间戳 */
  timestamp: string;
  /** 请求 ID */
  requestId?: string;
}

/**
 * 事件监听器
 */
export type WebDAVEventListener = (event: WebDAVEvent) => void;

/**
 * 扩展的 WebDAV 客户端接口
 */
export interface IExtendedWebDAVClient extends IWebDAVClient {
  /** 配置 */
  config: WebDAVClientConfig;
  
  /** 统计信息 */
  stats: ClientStats;
  
  /** 重试配置 */
  retryConfig: RetryConfig;
  
  /** 缓存配置 */
  cacheConfig: CacheConfig;
  
  /** 日志配置 */
  logConfig: LogConfig;
  
  /** 添加事件监听器 */
  addEventListener(type: WebDAVEventType, listener: WebDAVEventListener): void;
  
  /** 移除事件监听器 */
  removeEventListener(type: WebDAVEventType, listener: WebDAVEventListener): void;
  
  /** 清除缓存 */
  clearCache(): void;
  
  /** 重置统计信息 */
  resetStats(): void;
  
  /** 健康检查 */
  healthCheck(): Promise<boolean>;
}

// 全局类型声明
declare global {
  interface Window {
    AISPWebDAVClient: typeof AISPWebDAVClient;
  }
}

// 导出所有类型
export * from './proxy.types';
