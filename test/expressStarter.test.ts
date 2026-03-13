import './common.js';
import {startAll, stopAll} from 'express-starter';
import {describe, expect, it} from 'vitest';

process.env.PORT = '9898';

describe('express-starter', () => {
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
