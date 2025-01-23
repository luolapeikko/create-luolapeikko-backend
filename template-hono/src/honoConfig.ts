import {type Hono} from 'hono';
import {getRouter} from './routes/index.js';

export function setupHono(hono: Hono) {
	hono.route('/api', getRouter());
}
