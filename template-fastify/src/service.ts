import Fastify, {type FastifyInstance, type FastifyListenOptions} from 'fastify';
import {type AddressInfo} from 'node:net';
import {setupFastify} from './middleware.js';

let app: FastifyInstance | undefined;

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

export async function startFastify(listenOpts: FastifyListenOptions): Promise<{app: FastifyInstance; address: AddressInfo | string | null}> {
	app = Fastify({});
	await setupFastify(app);
	try {
		await app.listen(listenOpts);
		return {app, address: app.server.address()};
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
}

export async function stopFastify(): Promise<void> {
	await app?.close();
	app = undefined;
}

export async function startAll(): Promise<void> {
	const httpPort = process.env.PORT ? parseInt(process.env.PORT, 10) : undefined;
	if (httpPort && isNaN(httpPort)) {
		throw new Error(`Invalid port number ${process.env.PORT}`);
	}
	const {address} = await startFastify({port: httpPort});
	console.info(`fastify listening on ${printAddress(address)} [${process.env.NODE_ENV}]`);
}

export async function stopAll(): Promise<void> {
	await stopFastify();
	console.info('fastify stopped');
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
