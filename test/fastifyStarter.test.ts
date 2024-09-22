/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import './common.js';
import {describe, expect, it} from 'vitest';
import {startAll, stopAll} from 'fastify-starter';

process.env.PORT = '9898';

describe('hono-starter', () => {
	it('should start hono-starter', async () => {
		await expect(startAll()).resolves.toBe(undefined);
	});
	it('should get hello world json', async () => {
		const res = await fetch('http://127.0.0.1:9898/api/hello');
		expect(res.status).toBe(200);
		await expect(res.json()).resolves.toEqual({message: 'Hello World'});
	});
	it('should stop hono-starter', async () => {
		await expect(stopAll()).resolves.toBe(undefined);
	});
});
