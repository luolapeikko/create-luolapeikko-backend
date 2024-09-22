import {type FastifyInstance} from 'fastify';
import {getRoutes} from './routes/index.js';

export function setupFastify(fastify: FastifyInstance): Promise<void> {
	fastify.register(getRoutes);
	return Promise.resolve();
}
