import express from 'express';
import {type Server} from 'http';
import {setupExpress} from './middleware.js';

const app = express();

let server: undefined | Server;
export function startExpress(port: string | number): Promise<express.Express> {
	setupExpress(app);
	return new Promise((resolve, reject) => {
		try {
			server = app.listen(port, () => {
				resolve(app);
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
	await startExpress(httpPort);
	console.info(`express listening on port ${httpPort} [${process.env.NODE_ENV}]`);
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
