import { NextRequest, NextResponse } from 'next/server';
import { setCorsHeaders } from '@/config/cors.config';
import { createLogger, generateRequestId } from '@/utils/logger';
import { createErrorResponse, handleProxyError, logError } from '@/utils/errorHandler';
import { applyCorsHeaders, buildProxyResponseHeaders, buildSseHeaders } from '@/utils/headers';

/**
 * AI API 代理服务
 * 支持 DeepSeek、OpenAI 等 AI 服务的代理访问
 */

export async function OPTIONS(request: NextRequest) {
  console.log('🔄 处理AI代理CORS预检请求 (OPTIONS)');
  
  // 创建响应并设置所有必要的 CORS 头部
  const response = new NextResponse(null, { status: 204 });
  
  // 统一使用封装的 CORS 头设置
  applyCorsHeaders(response.headers);
  
  return response;
}

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const logger = createLogger(requestId);
  const startTime = Date.now();

  try {
    // 获取目标URL参数
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');
    
    if (!targetUrl) {
      logger.error('缺少url参数');
      const errorResponse = NextResponse.json({ 
        error: 'Missing url parameter',
        message: '请提供目标API URL',
        requestId
      }, { status: 400 });
      // 确保错误响应也有CORS头部
      applyCorsHeaders(errorResponse.headers);
      return errorResponse;
    }

    // 解码目标URL
    const decodedUrl = decodeURIComponent(targetUrl);
    logger.info(`AI代理请求开始`, { targetUrl: decodedUrl });

    // 获取请求头
    const requestHeaders: Record<string, string> = {};
    
    // 复制必要的请求头
    const headersToForward = ['authorization', 'content-type', 'accept'];
    headersToForward.forEach(header => {
      const value = request.headers.get(header);
      if (value) {
        requestHeaders[header] = value;
      }
    });

    // 如果没有User-Agent，添加默认的
    if (!requestHeaders['user-agent']) {
      requestHeaders['user-agent'] = 'AISP-AI-Proxy/1.0';
    }

    logger.info('转发请求头', { headers: requestHeaders });

    // 获取请求体
    let requestBody: string | undefined;
    try {
      const bodyText = await request.text();
      if (bodyText) {
        requestBody = bodyText;
        logger.info('请求体长度', { length: bodyText.length });
      }
    } catch (error) {
      logger.warn('无法读取请求体', { error });
    }

    // 发起代理请求
    const response = await fetch(decodedUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: requestBody,
      signal: AbortSignal.timeout(60000) // 60秒超时，AI请求可能较长
    });

    const responseTime = Date.now() - startTime;
    logger.info('AI代理请求完成', { 
      status: response.status, 
      responseTime 
    });

    // 检测并处理 SSE 流式响应
    const acceptHeader = request.headers.get('accept') || '';
    const respContentType = response.headers.get('content-type') || '';
    const streamParam = searchParams.get('stream');
    const isSSE = (
      respContentType.includes('text/event-stream') ||
      acceptHeader.includes('text/event-stream') ||
      streamParam === 'true'
    );

    if (isSSE && response.body) {
      const streamHeaders = buildSseHeaders(response.headers);
      logger.info('以SSE方式透传响应');
      return new NextResponse(response.body, {
        status: response.status,
        headers: streamHeaders,
      });
    }

    // 非流式：读取完整文本
    const responseData = await response.text();
    logger.info('响应数据长度', { length: responseData.length });

    // 设置响应头
    const responseHeaders = buildProxyResponseHeaders(response.headers);

    // 返回响应
    return new NextResponse(responseData, {
      status: response.status,
      headers: responseHeaders,
    });

  } catch (error) {
    const responseTime = Date.now() - startTime;
    logger.error('AI代理请求失败', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime 
    });

    let proxyError;
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        proxyError = handleProxyError('Request timeout - AI服务响应超时', error, requestId);
      } else if (error.message.includes('fetch')) {
        proxyError = handleProxyError('Network request failed - 无法连接到AI服务', error, requestId);
      } else {
        proxyError = handleProxyError('Proxy request failed - 代理请求失败', error, requestId);
      }
    } else {
      proxyError = handleProxyError('Unknown proxy error', undefined, requestId);
    }

    logError(logger, proxyError, 'AI Proxy request');
    const errorResponse = NextResponse.json(
      createErrorResponse(proxyError, requestId), 
      { status: proxyError.statusCode }
    );
    // 确保错误响应也有CORS头部
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
    return errorResponse;
  }
}

// 支持其他HTTP方法
export async function GET(request: NextRequest) {
  return handleGenericRequest(request, 'GET');
}

export async function PUT(request: NextRequest) {
  return handleGenericRequest(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
  return handleGenericRequest(request, 'DELETE');
}

async function handleGenericRequest(request: NextRequest, method: string) {
  const requestId = generateRequestId();
  const logger = createLogger(requestId);

  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');
    
    if (!targetUrl) {
      const errorResponse = NextResponse.json({ 
        error: 'Missing url parameter',
        message: '请提供目标API URL',
        requestId
      }, { status: 400 });
      // 确保错误响应也有CORS头部
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
      return errorResponse;
    }

    const decodedUrl = decodeURIComponent(targetUrl);
    logger.info(`AI代理请求: ${method}`, { targetUrl: decodedUrl });

    const requestHeaders: Record<string, string> = {};
    ['authorization', 'content-type', 'accept'].forEach(header => {
      const value = request.headers.get(header);
      if (value) {
        requestHeaders[header] = value;
      }
    });

    const response = await fetch(decodedUrl, {
      method: method,
      headers: requestHeaders,
      signal: AbortSignal.timeout(60000)
    });

    // 检测 SSE
    const acceptHeader = request.headers.get('accept') || '';
    const respContentType = response.headers.get('content-type') || '';
    const streamParam = searchParams.get('stream');
    const isSSE = (
      respContentType.includes('text/event-stream') ||
      acceptHeader.includes('text/event-stream') ||
      streamParam === 'true'
    );

    if (isSSE && response.body) {
      const streamHeaders = new Headers();
      streamHeaders.set('Content-Type', respContentType || 'text/event-stream; charset=utf-8');
      streamHeaders.set('Cache-Control', 'no-cache');
      streamHeaders.set('X-Accel-Buffering', 'no');
      // CORS 头
      streamHeaders.set('Access-Control-Allow-Origin', '*');
      streamHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      streamHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
      return new NextResponse(response.body, {
        status: response.status,
        headers: streamHeaders,
      });
    }

    const responseData = await response.text();
    const responseHeaders = new Headers();
    
    ['content-type', 'cache-control'].forEach(header => {
      const value = response.headers.get(header);
      if (value) {
        responseHeaders.set(header, value);
      }
    });

    // 添加CORS头部
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');

    return new NextResponse(responseData, {
      status: response.status,
      headers: responseHeaders,
    });

  } catch (error) {
    const proxyError = handleProxyError(
      'AI Proxy request failed',
      error instanceof Error ? error : undefined,
      requestId
    );
    
    logError(logger, proxyError, `AI Proxy ${method}`);
    const errorResponse = NextResponse.json(
      createErrorResponse(proxyError, requestId),
      { status: proxyError.statusCode }
    );
    // 确保错误响应也有CORS头部
    applyCorsHeaders(errorResponse.headers);
    return errorResponse;
  }
}

