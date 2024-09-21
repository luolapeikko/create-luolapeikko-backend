import {type RequestHandler} from 'express';

const corsOriginList = new Set(['http://localhost:8080']); // Add your origins (browser base URL's) here

// Basic CORS setup
export const corsMiddleware: RequestHandler = (req, res, next): void => {
	const method = req.method && req.method.toUpperCase();
	const {origin} = req.headers;
	if (origin && corsOriginList.has(origin)) {
		res.set('Access-Control-Allow-Origin', origin);
		res.set('Access-Control-Allow-Credentials', 'true');
		res.set('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
		res.set('Access-Control-Allow-Headers', 'Origin, Authorization, Content-Type');
		res.set('Vary', 'Origin');
	}
	if (method === 'OPTIONS') {
		res.setHeader('Content-Length', '0');
		res.status(204).end();
	} else {
		next();
	}
};
