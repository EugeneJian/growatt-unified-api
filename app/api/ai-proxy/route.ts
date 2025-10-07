import { NextRequest, NextResponse } from 'next/server';
import { setCorsHeaders } from '@/config/cors.config';
import { createLogger, generateRequestId } from '@/utils/logger';
import { createErrorResponse, handleProxyError, logError } from '@/utils/errorHandler';

/**
 * AI API 代理服务
 * 支持 DeepSeek、OpenAI 等 AI 服务的代理访问
 */

export async function OPTIONS() {
  console.log('🔄 处理AI代理CORS预检请求 (OPTIONS)');
  
  const response = new NextResponse(null, { status: 204 });
  setCorsHeaders(response.headers);
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
      setCorsHeaders(errorResponse.headers);
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

    // 获取响应数据
    const responseData = await response.text();
    logger.info('响应数据长度', { length: responseData.length });

    // 设置响应头
    const responseHeaders = new Headers();
    
    // 复制原始响应的重要头部
    ['content-type', 'cache-control', 'x-request-id'].forEach(header => {
      const value = response.headers.get(header);
      if (value) {
        responseHeaders.set(header, value);
      }
    });

    // 添加CORS头部
    setCorsHeaders(responseHeaders);

    // 返回响应
    const proxyResponse = new NextResponse(responseData, {
      status: response.status,
      headers: responseHeaders,
    });

    return proxyResponse;

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
    setCorsHeaders(errorResponse.headers);
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
      setCorsHeaders(errorResponse.headers);
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

    const responseData = await response.text();
    const responseHeaders = new Headers();
    
    ['content-type', 'cache-control'].forEach(header => {
      const value = response.headers.get(header);
      if (value) {
        responseHeaders.set(header, value);
      }
    });

    setCorsHeaders(responseHeaders);

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
    setCorsHeaders(errorResponse.headers);
    return errorResponse;
  }
}

