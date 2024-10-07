import {type RequestHandler, Router} from 'express';

const getHello: RequestHandler<never, {message: string}> = (req, res, next) => {
	try {
		res.json({message: 'Hello World'});
	} catch (error) {
		next(error);
	}
};

export function getRouter(): Router {
	const router = Router();

	router.get('/', getHello);

	return router;
}
