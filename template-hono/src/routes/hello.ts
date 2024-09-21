import {type Handler, Hono} from 'hono';

const helloHandler: Handler = (c) => {
	return c.json({message: 'Hello World'});
};

export function getRouter() {
	const hono = new Hono();
	hono.get('/', helloHandler);
	return hono;
}
