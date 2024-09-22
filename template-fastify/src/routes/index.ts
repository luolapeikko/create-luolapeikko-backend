import {type FastifyInstance} from 'fastify';
import {helloRoute} from './hello.js';

export function getRoutes(fastify: FastifyInstance): Promise<void> {
	// fastify.get('/api/hello', helloHandler); // or
	fastify.route(helloRoute);
	return Promise.resolve();
}
