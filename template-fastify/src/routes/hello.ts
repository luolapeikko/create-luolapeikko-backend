import {type RouteHandlerMethod, type RouteOptions} from 'fastify';

export const helloHandler: RouteHandlerMethod = (_req, reply) => {
	reply.send({message: 'Hello World'});
};

export const helloRoute: RouteOptions = {
	method: 'GET',
	url: '/api/hello',
	handler: helloHandler,
};
