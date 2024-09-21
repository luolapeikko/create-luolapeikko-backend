import express from 'express';
import expressWebsocket, {Application} from 'express-ws';
import {type Server} from 'http';
import {setupExpress} from './middleware.js';
import {socketWatchList} from './lib/websocket/index.js';
import {type AddressInfo} from 'node:net';

const expressWs = expressWebsocket(express());
const app = expressWs.app;

/** trigger ws close event to all registered callbacks */
expressWs.getWss().on('connection', (ws) => {
	ws.on('close', () => {
		socketWatchList.forEach((wl) => wl(ws));
	});
});

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
export function startExpress(port: string | number): Promise<{app: Application; address: AddressInfo | string | null}> {
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
			// close all ws connections before closing server
			expressWs.getWss().clients.forEach((ws) => ws.close());
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
