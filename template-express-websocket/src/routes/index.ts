import {Router} from 'express';
import {getRouter as getHelloRouter} from './hello.js';

export function getRouter(): Router {
	const router = Router();

	router.use('/hello', getHelloRouter());

	return router;
}
