import {Hono} from 'hono';
import {getRouter as getHelloRouter} from './hello.js';

export function getRouter() {
	const hono = new Hono();
	hono.route('/hello', getHelloRouter());
	return hono;
}
