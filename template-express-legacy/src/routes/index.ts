import {getRouter as getHelloRouter} from './hello.js';
import {Router} from 'express';

export function getRouter(): Router {
	const router = Router();

	router.use('/hello', getHelloRouter());

	return router;
}
