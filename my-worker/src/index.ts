/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

/**
 * Cloudflare Worker - API & CORS Proxy
 * - 路由：
 *   - /api/api-proxy    通用 API 代理（url & token query 参数）
 *   - /api/cors-proxy   WebDAV CORS 代理（POST JSON: { path, options }）
 * - 特性：
 *   - 统一 CORS 处理（含预检 OPTIONS）
 *   - 超时控制（默认 30s，可通过 env.REQUEST_TIMEOUT 调整）
 *   - 头部透传并剔除不适配的头（content-encoding/transfer-encoding）
 *   - 稳健错误处理与轻量日志
 */

type WorkerEnv = {
	WEBDAV_BASE_URL?: string;
	CORS_ALLOW_ORIGIN?: string;
	REQUEST_TIMEOUT?: string; // ms
	USER_AGENT?: string;
};

type ProxyConfig = {
	webdavBaseUrl: string;
	allowOrigin: string;
	timeoutMs: number;
	userAgent: string;
};

function getConfig(env: WorkerEnv): ProxyConfig {
	const timeoutMs = Number.parseInt(env.REQUEST_TIMEOUT || '30000');
	return {
		webdavBaseUrl: env.WEBDAV_BASE_URL || 'https://dav.jianguoyun.com/dav/',
		allowOrigin: env.CORS_ALLOW_ORIGIN || '*',
		timeoutMs: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 30000,
		userAgent: env.USER_AGENT || 'AISP-CORS-Proxy/1.0',
	};
}

function generateRequestId(): string {
	return `req_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function buildCorsHeaders(config: ProxyConfig): HeadersInit {
	return {
		'Access-Control-Allow-Origin': config.allowOrigin,
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PROPFIND, MKCOL, MOVE, COPY',
		'Access-Control-Allow-Headers': 'Authorization, Content-Type, token, Accept, X-Requested-With, Depth, If-None-Match, Etag',
		'Access-Control-Expose-Headers': 'Etag, DAV',
		'Access-Control-Max-Age': '86400',
	};
}

function applyCors(headers: Headers, config: ProxyConfig): void {
	const cors = buildCorsHeaders(config);
	for (const [k, v] of Object.entries(cors)) headers.set(k, v);
}

function sanitizePath(path: string): string {
	if (path.startsWith('http://') || path.startsWith('https://')) return path;
	let clean = path.replace(/\/+?/g, '/');
	if (clean !== '/' && clean.startsWith('/')) clean = clean.slice(1);
	if (clean !== '/' && clean.endsWith('/')) clean = clean.slice(0, -1);
	return clean;
}

function pickForwardHeaders(from: Headers): Headers {
	const out = new Headers();
	from.forEach((value, key) => {
		const k = key.toLowerCase();
		if (k === 'content-encoding' || k === 'transfer-encoding') return;
		out.set(key, value);
	});
	return out;
}

function jsonError(status: number, message: string, requestId: string, config: ProxyConfig): Response {
	const body = JSON.stringify({ error: message, timestamp: new Date().toISOString(), requestId });
	const res = new Response(body, { status, headers: { 'Content-Type': 'application/json' } });
	applyCors(res.headers, config);
	return res;
}

async function handleOptions(config: ProxyConfig): Promise<Response> {
	const res = new Response(null, { status: 204 });
	applyCors(res.headers, config);
	return res;
}

async function handleApiProxy(request: Request, config: ProxyConfig, requestId: string): Promise<Response> {
	const url = new URL(request.url);
	if (request.method === 'OPTIONS') return handleOptions(config);

	const targetParam = url.searchParams.get('url');
	const token = url.searchParams.get('token');
	if (!targetParam) {
		return jsonError(400, 'Missing url parameter', requestId, config);
	}

	const targetUrl = decodeURIComponent(targetParam);
	const method = request.method.toUpperCase();

	let body: BodyInit | null = null;
	if (method !== 'GET' && method !== 'DELETE') {
		try {
			body = await request.text();
		} catch {
			body = null;
		}
	}

	const forwardHeaders = new Headers();
	forwardHeaders.set('Content-Type', 'application/x-www-form-urlencoded');
	forwardHeaders.set('Accept', 'application/json');
	forwardHeaders.set('User-Agent', config.userAgent);
	if (token) forwardHeaders.set('token', token);

	const controller = AbortSignal.timeout(config.timeoutMs);
	let upstream: Response;
	try {
		upstream = await fetch(targetUrl, { method, headers: forwardHeaders, body, signal: controller });
	} catch (err) {
		console.error(`[${requestId}] api-proxy fetch error`, err);
		return jsonError(502, 'Proxy error', requestId, config);
	}

	const responseHeaders = pickForwardHeaders(upstream.headers);
	applyCors(responseHeaders, config);
	const text = await upstream.text();
	return new Response(text, { status: upstream.status, headers: responseHeaders });
}

async function handleCorsProxy(request: Request, config: ProxyConfig, requestId: string): Promise<Response> {
	if (request.method === 'OPTIONS') return handleOptions(config);
	if (request.method !== 'POST') return jsonError(405, 'Method Not Allowed', requestId, config);

	let payload: any;
	try {
		payload = await request.json();
	} catch {
		return jsonError(400, 'Invalid request format', requestId, config);
	}

	if (!payload || typeof payload !== 'object') return jsonError(400, 'Invalid request format', requestId, config);
	const rawPath = payload.path;
	const options = payload.options || {};
	if (typeof rawPath !== 'string') return jsonError(400, 'Missing or invalid "path" field', requestId, config);
	if (typeof options !== 'object') return jsonError(400, 'Missing or invalid "options" field', requestId, config);

	const cleanPath = sanitizePath(rawPath);
	const isAbsolute = cleanPath.startsWith('http://') || cleanPath.startsWith('https://');
	const targetUrl = isAbsolute ? cleanPath : (cleanPath ? `${config.webdavBaseUrl}${cleanPath}` : config.webdavBaseUrl);

	const method = typeof options.method === 'string' ? options.method.toUpperCase() : 'GET';
	const outHeaders = new Headers(options.headers || {});
	outHeaders.set('User-Agent', config.userAgent);

	let body: BodyInit | undefined;
	if (options.body !== undefined) {
		if (typeof options.body === 'string') {
			body = options.body;
		} else if (options.body && typeof options.body === 'object' && 'type' in options.body) {
			// 若前端通过 FormData 等传入，保持原样（在 JSON 场景一般不会到这里）
			body = options.body as any;
		}
	}

	const controller = AbortSignal.timeout(config.timeoutMs);
	let upstream: Response;
	try {
		upstream = await fetch(targetUrl, { method, headers: outHeaders, body, signal: controller });
	} catch (err) {
		console.error(`[${requestId}] cors-proxy fetch error`, err);
		return jsonError(503, 'Network request failed', requestId, config);
	}

	const responseHeaders = pickForwardHeaders(upstream.headers);
	applyCors(responseHeaders, config);
	const buf = await upstream.arrayBuffer();
	return new Response(buf.byteLength ? buf : null, { status: upstream.status, headers: responseHeaders });
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const requestId = generateRequestId();
		const config = getConfig(env as WorkerEnv);
		const { pathname } = new URL(request.url);

		try {
			if (pathname.startsWith('/api/api-proxy')) {
				return await handleApiProxy(request, config, requestId);
			}
			if (pathname.startsWith('/api/cors-proxy')) {
				return await handleCorsProxy(request, config, requestId);
			}
			// 其他路径：健康检查或提示
			const res = new Response('OK', { status: 200 });
			applyCors(res.headers, config);
			return res;
		} catch (err) {
			console.error(`[${requestId}] unhandled error`, err);
			return jsonError(500, 'Internal server error', requestId, config);
		}
	},
} satisfies ExportedHandler<Env>;
