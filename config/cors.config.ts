/**
 * CORS 配置管理
 * 根据《设计文档》的 CORS 头部处理要求
 */

export interface CorsConfig {
  allowOrigin: string;
  allowMethods: string[];
  allowHeaders: string[];
  exposeHeaders: string[];
  maxAge: number;
  credentials: boolean;
}

export const corsConfig: CorsConfig = {
  // 允许的来源
  allowOrigin: process.env.CORS_ALLOW_ORIGIN || '*',
  
  // 允许的 HTTP 方法
  allowMethods: process.env.CORS_ALLOW_METHODS 
    ? process.env.CORS_ALLOW_METHODS.split(',')
    : ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PROPFIND', 'MKCOL', 'MOVE', 'COPY'],
  
  // 允许的请求头
  allowHeaders: process.env.CORS_ALLOW_HEADERS
    ? process.env.CORS_ALLOW_HEADERS.split(',')
    : ['Authorization', 'Content-Type', 'Depth', 'If-None-Match', 'Etag'],
  
  // 暴露给前端的响应头
  exposeHeaders: process.env.CORS_EXPOSE_HEADERS
    ? process.env.CORS_EXPOSE_HEADERS.split(',')
    : ['Etag', 'DAV'],
  
  // 预检请求缓存时间（秒）
  maxAge: parseInt(process.env.CORS_MAX_AGE || '86400'), // 24小时
  
  // 是否允许携带凭据
  credentials: process.env.CORS_CREDENTIALS === 'true'
};

/**
 * 设置 CORS 头部到响应对象
 */
export function setCorsHeaders(headers: Headers): void {
  headers.set('Access-Control-Allow-Origin', corsConfig.allowOrigin);
  headers.set('Access-Control-Allow-Methods', corsConfig.allowMethods.join(', '));
  headers.set('Access-Control-Allow-Headers', corsConfig.allowHeaders.join(', '));
  headers.set('Access-Control-Expose-Headers', corsConfig.exposeHeaders.join(', '));
  headers.set('Access-Control-Max-Age', corsConfig.maxAge.toString());
  
  if (corsConfig.credentials) {
    headers.set('Access-Control-Allow-Credentials', 'true');
  }
}

/**
 * 验证 CORS 配置
 */
export function validateCorsConfig(): boolean {
  try {
    // 验证最大缓存时间
    if (corsConfig.maxAge < 0 || corsConfig.maxAge > 86400) {
      console.error('Invalid CORS_MAX_AGE: must be between 0 and 86400 seconds');
      return false;
    }
    
    // 验证方法列表
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PROPFIND', 'MKCOL', 'MOVE', 'COPY'];
    const invalidMethods = corsConfig.allowMethods.filter(method => !validMethods.includes(method));
    if (invalidMethods.length > 0) {
      console.error('Invalid CORS methods:', invalidMethods);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('CORS configuration validation error:', error);
    return false;
  }
}
