import type {RequestHandler} from 'express';
import {Router, type WSRequestHandler} from 'websocket-express';

const getHello: RequestHandler<never, {message: string}> = (_req, res, next) => {
	try {
		res.json({message: 'Hello World'});
	} catch (error) {
		next(error);
	}
};

const websocketMessage: WSRequestHandler = async (_req, res, _next) => {
	const ws = await res.accept();
	ws.on('message', (_msg) => {
		// const payload = JSON.parse(msg.toString());
	});
	ws.on('close', () => {
		// do cleanup if necessary
	});
	ws.send(JSON.stringify({message: 'WebSocket connection established'}));
};

export function getRouter(): Router {
	const router = new Router();

	router.get('/', getHello);
	router.ws('/', websocketMessage);

	return router;
}
