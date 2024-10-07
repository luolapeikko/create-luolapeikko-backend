import {type ErrorRequestHandler} from 'express';
import {HttpError} from '../lib/HttpError.js';

export const errorMiddleWare: ErrorRequestHandler = (err, _req, res, next) => {
	/* istanbul ignore next */
	if (res.headersSent) {
		return next(err);
	}
	let code = 500;
	let isSilent = false;
	let errorName = 'Error';
	let message = 'Internal Server Error';
	if (err instanceof Error) {
		errorName = err.name;
		message = err.message;
		if (err instanceof HttpError) {
			code = err.code;
			isSilent = err.isSilent;
		}
	}
	if (isSilent) {
		res.status(code).end();
	} else {
		res.status(code).json({error: errorName, message});
	}
};
