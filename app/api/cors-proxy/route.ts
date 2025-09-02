import { NextRequest, NextResponse } from 'next/server';
import { proxyConfig } from '@/config/proxy.config';
import { corsConfig, setCorsHeaders } from '@/config/cors.config';
import { validateProxyRequest, sanitizePath, validateOrigin, validateRequestSize } from '@/utils/validator';
import { createLogger, logProxyRequestStart, logProxyRequestComplete, logProxyRequestError } from '@/utils/logger';
import { 
  createErrorResponse, 
  handleValidationError, 
  handleProxyError, 
  handleNetworkError,
  logError 
} from '@/utils/errorHandler';
import { generateRequestId } from '@/utils/logger';

export async function OPTIONS() {
  // 处理 OPTIONS 预检请求
  // 这是《设计文档》中提到的预检请求处理
  const response = new NextResponse(null, { status: 204 });
  setCorsHeaders(response.headers);
  return response;
}

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const logger = createLogger(requestId);
  const startTime = Date.now();

  try {
    // 验证来源
    const origin = request.headers.get('origin');
    if (!validateOrigin(origin, corsConfig.allowOrigin === '*' ? ['*'] : [corsConfig.allowOrigin])) {
      const error = handleValidationError('Origin not allowed', requestId);
      logError(logger, error, 'Origin validation');
      const errorResponse = NextResponse.json(createErrorResponse(error, requestId), { status: 403 });
      setCorsHeaders(errorResponse.headers);
      return errorResponse;
    }

    // 验证请求大小
    const contentLength = request.headers.get('content-length');
    const sizeValidation = validateRequestSize(contentLength);
    if (!sizeValidation.valid) {
      const error = handleValidationError(sizeValidation.error || 'Invalid request size', requestId);
      logError(logger, error, 'Size validation');
      const errorResponse = NextResponse.json(createErrorResponse(error, requestId), { status: 413 });
      setCorsHeaders(errorResponse.headers);
      return errorResponse;
    }

    // 获取前端传递的参数
    // 前端会将目标路径和请求选项通过请求体发过来
    const body = await request.json();
    
    // 验证请求格式
    const validation = validateProxyRequest(body);
    if (!validation.valid) {
      const error = handleValidationError(validation.error || 'Invalid request format', requestId);
      logError(logger, error, 'Request validation');
      const errorResponse = NextResponse.json(createErrorResponse(error, requestId), { status: 400 });
      setCorsHeaders(errorResponse.headers);
      return errorResponse;
    }

    const { path, options } = body;
    
    // 清理和标准化路径
    const cleanPath = sanitizePath(path);
    
    // 构造并转发请求
    // 这是《架构设计》中的"请求转发模块"
    const targetUrl = `${proxyConfig.webdavBaseUrl}${cleanPath}`;
    
    logProxyRequestStart(logger, targetUrl, options.method || 'GET');
    
    try {
      // 使用 fetch API 将请求转发到 WebDAV 服务器
      const response = await fetch(targetUrl, {
        ...options, // 将前端的请求选项（方法、头部、内容等）透传过去
        headers: {
          ...options.headers,
          // 使用配置中的 User-Agent
          'User-Agent': proxyConfig.userAgent, 
        },
        // 设置超时
        signal: AbortSignal.timeout(proxyConfig.timeout),
      });

      const responseTime = Date.now() - startTime;
      logProxyRequestComplete(logger, targetUrl, response.status, responseTime);

      // 处理并返回响应
      // 这是《架构设计》中的"响应返回"流程
      
      // 将 WebDAV 服务器的响应头复制到我们的代理响应中
      // 特别注意 Etag 和 DAV 头，它们对 WebDAV 客户端很重要
      const responseHeaders = new Headers();
      response.headers.forEach((value, key) => {
        // 避免设置 Vercel 自动处理的头部
        if (key.toLowerCase() !== 'content-encoding' && key.toLowerCase() !== 'transfer-encoding') {
          responseHeaders.set(key, value);
        }
      });

      // 将 WebDAV 服务器的响应状态码和响应体返回给前端
      const responseBody = await response.arrayBuffer();
      const proxyResponse = new NextResponse(Buffer.from(responseBody), {
        status: response.status,
        headers: responseHeaders,
      });

      setCorsHeaders(proxyResponse.headers);
      return proxyResponse;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      logProxyRequestError(logger, targetUrl, error as Error, responseTime);
      
      // 统一的错误处理
      // 这是《设计文档》和《实施计划》都强调的错误处理
      let proxyError;
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          proxyError = handleNetworkError('Request timeout', error, requestId);
        } else if (error.message.includes('fetch')) {
          proxyError = handleNetworkError('Network request failed', error, requestId);
        } else {
          proxyError = handleProxyError('Proxy request failed', error, requestId);
        }
      } else {
        proxyError = handleProxyError('Unknown proxy error', undefined, requestId);
      }
      
      logError(logger, proxyError, 'Proxy request');
      const errorResponse = NextResponse.json(createErrorResponse(proxyError, requestId), { status: proxyError.statusCode });
      setCorsHeaders(errorResponse.headers);
      return errorResponse;
    }

  } catch (error) {
    // 处理请求解析错误
    logError(logger, error as Error, 'Request parsing');
    const proxyError = handleValidationError(
      'Invalid request format',
      requestId
    );
    const errorResponse = NextResponse.json(createErrorResponse(proxyError, requestId), { status: 400 });
    setCorsHeaders(errorResponse.headers);
    return errorResponse;
  }
}
