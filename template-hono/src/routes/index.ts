import {getRouter as getHelloRouter} from './hello.js';
import {Hono} from 'hono';

export function getRouter() {
	const hono = new Hono();
	hono.route('/hello', getHelloRouter());
	return hono;
}
