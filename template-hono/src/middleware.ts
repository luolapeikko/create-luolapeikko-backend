import {getRouter} from './routes/index.js';
import {type Hono} from 'hono';

export function setupHono(hono: Hono) {
	hono.route('/api', getRouter());
}
