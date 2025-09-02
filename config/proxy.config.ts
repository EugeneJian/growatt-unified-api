/**
 * CORS 代理服务配置
 * 根据《实施计划》文档的配置管理要求
 */

export interface ProxyConfig {
  webdavBaseUrl: string;
  allowedOrigins: string[];
  rateLimit: {
    windowMs: number;
    max: number;
  };
  timeout: number;
  userAgent: string;
}

export const proxyConfig: ProxyConfig = {
  // WebDAV 服务器基础 URL
  webdavBaseUrl: process.env.WEBDAV_BASE_URL || 'https://dav.jianguoyun.com/dav/',
  
  // 允许的来源，生产环境需要限制
  allowedOrigins: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['*'],
  
  // 速率限制配置
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15分钟
    max: parseInt(process.env.RATE_LIMIT_MAX || '100') // 限制每个IP 15分钟内最多100个请求
  },
  
  // 请求超时时间
  timeout: parseInt(process.env.REQUEST_TIMEOUT || '30000'), // 30秒
  
  // 用户代理字符串
  userAgent: process.env.USER_AGENT || 'AISP-CORS-Proxy/1.0'
};

/**
 * 验证配置是否有效
 */
export function validateConfig(): boolean {
  try {
    // 验证 WebDAV 基础 URL
    if (!proxyConfig.webdavBaseUrl || !proxyConfig.webdavBaseUrl.startsWith('https://')) {
      console.error('Invalid WEBDAV_BASE_URL: must be a valid HTTPS URL');
      return false;
    }
    
    // 验证超时时间
    if (proxyConfig.timeout < 1000 || proxyConfig.timeout > 60000) {
      console.error('Invalid REQUEST_TIMEOUT: must be between 1000ms and 60000ms');
      return false;
    }
    
    // 验证速率限制
    if (proxyConfig.rateLimit.max < 1 || proxyConfig.rateLimit.windowMs < 60000) {
      console.error('Invalid rate limit configuration');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Configuration validation error:', error);
    return false;
  }
}
