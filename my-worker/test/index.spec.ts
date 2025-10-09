import { env, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Proxy worker', () => {
	it('health check responds with OK and CORS', async () => {
		const request = new IncomingRequest('http://example.com/');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(response.status).toBe(200);
		expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
		expect(await response.text()).toBe('OK');
	});

	it('OPTIONS on /api/api-proxy sets CORS', async () => {
		const request = new IncomingRequest('http://example.com/api/api-proxy', { method: 'OPTIONS' });
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(response.status).toBe(204);
		expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
	});

	it('GET /api/api-proxy without url returns 400', async () => {
		const request = new IncomingRequest('http://example.com/api/api-proxy');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(response.status).toBe(400);
		const json = await response.json();
		expect(json.error).toBe('Missing url parameter');
	});

	it('POST /api/cors-proxy invalid body returns 400', async () => {
		const request = new IncomingRequest('http://example.com/api/cors-proxy', { method: 'POST', body: 'not-json' });
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(response.status).toBe(400);
	});
});
