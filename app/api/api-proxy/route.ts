import { NextRequest, NextResponse } from 'next/server';
import { corsConfig, setCorsHeaders } from '@/config/cors.config';
import { validateApiProxyRequest, validateOrigin, validateRequestSize } from '@/utils/validator';
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
  const response = new NextResponse(null, { status: 204 });
  setCorsHeaders(response.headers);
  return response;
}

export async function GET(request: NextRequest) {
  return handleApiProxyRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return handleApiProxyRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return handleApiProxyRequest(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
  return handleApiProxyRequest(request, 'DELETE');
}

async function handleApiProxyRequest(request: NextRequest, method: string) {
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

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');
    const token = searchParams.get('token');

    // 验证目标URL
    if (!targetUrl) {
      const error = handleValidationError('Missing url parameter', requestId);
      logError(logger, error, 'URL validation');
      const errorResponse = NextResponse.json(createErrorResponse(error, requestId), { status: 400 });
      setCorsHeaders(errorResponse.headers);
      return errorResponse;
    }

    // 验证URL格式
    const urlValidation = validateApiProxyRequest({ url: targetUrl });
    if (!urlValidation.valid) {
      const error = handleValidationError(urlValidation.error || 'Invalid URL format', requestId);
      logError(logger, error, 'URL format validation');
      const errorResponse = NextResponse.json(createErrorResponse(error, requestId), { status: 400 });
      setCorsHeaders(errorResponse.headers);
      return errorResponse;
    }

    // 构建目标URL
    let finalTargetUrl = targetUrl;
    
    // 如果是相对路径，添加基础URL（这里可以根据需要配置不同的基础URL）
    if (!targetUrl.startsWith('http')) {
      // 可以根据不同的API类型配置不同的基础URL
      finalTargetUrl = `http://183.62.216.35:8081/v4${targetUrl}`;
    }

    // 构建请求头
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'AISP-API-Proxy/1.0'
    };

    // 添加token到请求头
    if (token) {
      headers['token'] = token;
    }

    // 获取请求体（对于POST/PUT请求）
    let requestBody: string | undefined;
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        const body = await request.text();
        if (body) {
          requestBody = body;
        }
      } catch (error) {
        // 忽略请求体解析错误，继续处理
      }
    }

    logProxyRequestStart(logger, finalTargetUrl, method);

    try {
      // 发起代理请求
      const response = await fetch(finalTargetUrl, {
        method: method,
        headers: headers,
        body: requestBody,
        signal: AbortSignal.timeout(30000) // 30秒超时
      });

      const responseTime = Date.now() - startTime;
      logProxyRequestComplete(logger, finalTargetUrl, response.status, responseTime);

      // 获取响应数据
      const responseData = await response.text();
      
      // 设置响应头
      const responseHeaders = new Headers();
      response.headers.forEach((value, key) => {
        // 避免设置Vercel自动处理的头部
        if (key.toLowerCase() !== 'content-encoding' && key.toLowerCase() !== 'transfer-encoding') {
          responseHeaders.set(key, value);
        }
      });

      // 创建响应
      const proxyResponse = new NextResponse(responseData, {
        status: response.status,
        headers: responseHeaders,
      });

      setCorsHeaders(proxyResponse.headers);
      return proxyResponse;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      logProxyRequestError(logger, finalTargetUrl, error as Error, responseTime);
      
      // 统一的错误处理
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
      
      logError(logger, proxyError, 'API Proxy request');
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
