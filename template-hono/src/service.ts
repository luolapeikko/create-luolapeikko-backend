import {type BlankEnv, type BlankSchema} from 'hono/types';
import {serve, type ServerType} from '@hono/node-server';
import {type AddressInfo} from 'node:net';
import {Hono} from 'hono';
import {setupHono} from './middleware.js';

export type HonoEnv = BlankEnv;
export type HonoSchema = BlankSchema;

let server: ServerType | undefined;

function printAddress(address: AddressInfo | string | null): string {
	if (address === null) {
		return 'null';
	}
	if (typeof address === 'string') {
		return address;
	}
	if (address.family === 'IPv6') {
		return `[${address.address}]:${address.port}`;
	}
	return `${address.address}:${address.port}`;
}

export function startHono(port: number | undefined): Promise<{app: Hono; address: AddressInfo}> {
	const app = new Hono();
	setupHono(app);
	return new Promise((resolve, reject) => {
		try {
			server = serve(
				{
					fetch: app.fetch,
					port,
				},
				(address) => {
					resolve({app, address});
				},
			);
		} catch (error) {
			reject(error);
		}
	});
}

export function stopHono(): Promise<void> {
	return new Promise((resolve, reject) => {
		if (server) {
			server.close((error) => {
				if (error) {
					reject(error);
				} else {
					server = undefined;
					resolve();
				}
			});
		} else {
			resolve();
		}
	});
}

export async function startAll(): Promise<void> {
	const httpPort = process.env.PORT ? parseInt(process.env.PORT, 10) : undefined;
	if (httpPort && isNaN(httpPort)) {
		throw new Error(`Invalid port number ${process.env.PORT}`);
	}
	const {address} = await startHono(httpPort);
	console.info(`hono listening on ${printAddress(address)} [${process.env.NODE_ENV}]`);
}

export async function stopAll(): Promise<void> {
	await stopHono();
	console.info('hono stopped');
}

process.on('SIGINT', async function () {
	await stopAll();
	process.exit();
});

if (process.env.NODE_ENV !== 'test') {
	startAll().catch((error: unknown) => {
		console.error('error starting server', error);
		process.exit(1);
	});
}
