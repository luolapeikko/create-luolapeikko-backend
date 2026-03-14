import {json, urlencoded} from 'express';
import type {WebSocketExpress} from 'websocket-express';
import {HttpError} from './lib/HttpError.js';
import {errorMiddleWare} from './middlewares/errorMiddleware.js';
import {getRouter} from './routes/index.js';

export function setupExpress(app: WebSocketExpress): void {
	// express settings, disable automatic etag and x-powered-by
	app.set('etag', false);
	app.disable('x-powered-by');
	// body parsers
	app.use(urlencoded({extended: false}));
	app.use(json());
	// apply middlewares here
	// app.use(corsMiddleware); // if need cors (API is not same origin as frontend)
	// /api routes
	app.use('/api', getRouter());
	// error handling
	app.get(/(.*)/, (req, _res, next) => {
		// block JSON error output for unknown routes (isSilent = true)
		next(new HttpError(404, 'route_not_found', req.url, true));
	});
	app.use(errorMiddleWare);
}
