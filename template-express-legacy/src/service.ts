import {type AddressInfo} from 'node:net';
import express from 'express';
import {type Server} from 'http';
import {setupExpress} from './middleware.js';

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

let server: undefined | Server;
export function startExpress(port: string | number): Promise<{app: express.Express; address: AddressInfo | string | null}> {
	const app = express();
	setupExpress(app);
	return new Promise((resolve, reject) => {
		try {
			server = app.listen(port, () => {
				resolve({app, address: server?.address() || null});
			});
		} catch (error) {
			reject(error);
		}
	});
}

export function stopExpress(): Promise<void> {
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
	const httpPort = process.env.PORT || 3000;
	const {address} = await startExpress(httpPort);
	console.info(`express listening on ${printAddress(address)} [${process.env.NODE_ENV}]`);
}

export async function stopAll(): Promise<void> {
	await stopExpress();
	console.info('express stopped');
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
