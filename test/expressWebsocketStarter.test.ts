/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import './common.js';
import {describe, expect, it} from 'vitest';
import {startAll, stopAll} from 'express-websocket-starter';

process.env.PORT = '9898';

describe('express-websocket-starter', () => {
	it('should start web service', async () => {
		await expect(startAll()).resolves.toBe(undefined);
	});
	it('should get hello world json', async () => {
		const res = await fetch('http://localhost:9898/api/hello');
		expect(res.status).toBe(200);
		await expect(res.json()).resolves.toEqual({message: 'Hello World'});
	});
	it('should stop web service', async () => {
		await expect(stopAll()).resolves.toBe(undefined);
	});
});
