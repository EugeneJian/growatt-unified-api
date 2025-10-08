import { setCorsHeaders } from '@/config/cors.config';

/**
 * 将标准 CORS 头设置到给定 Headers 对象
 */
export function applyCorsHeaders(headers: Headers): void {
  setCorsHeaders(headers);
}

/**
 * 构建用于 SSE（Server-Sent Events）的响应头，并附带 CORS
 * 可选择从上游响应复制特定头（例如 x-request-id）
 */
export function buildSseHeaders(upstreamHeaders?: Headers): Headers {
  const headers = new Headers();
  headers.set('Content-Type', 'text/event-stream; charset=utf-8');
  headers.set('Cache-Control', 'no-cache');
  headers.set('X-Accel-Buffering', 'no');
  headers.set('Connection', 'keep-alive');

  if (upstreamHeaders) {
    const xRequestId = upstreamHeaders.get('x-request-id');
    if (xRequestId) headers.set('x-request-id', xRequestId);
  }

  applyCorsHeaders(headers);
  return headers;
}

/**
 * 基于上游响应复制重要头（content-type、cache-control、x-request-id），并追加 CORS
 */
export function buildProxyResponseHeaders(upstreamHeaders: Headers): Headers {
  const headers = new Headers();
  ['content-type', 'cache-control', 'x-request-id'].forEach(key => {
    const value = upstreamHeaders.get(key);
    if (value) headers.set(key, value);
  });
  applyCorsHeaders(headers);
  return headers;
}


