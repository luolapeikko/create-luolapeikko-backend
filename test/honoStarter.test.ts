/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {describe, expect, it} from 'vitest';
import {startAll, stopAll} from 'hono-starter';
import {sleep} from './common.js';

process.env.PORT = '9898';

describe('hono-starter', () => {
	it('should start hono-starter', async function () {
		await expect(startAll()).resolves.toBe(undefined);
		await sleep(500);
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
