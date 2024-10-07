import {api} from 'encore.dev/api';

interface Response {
	message: string;
}

export const get = api({expose: true, method: 'GET', path: '/api/hello'}, (): Response => {
	return {message: 'Hello World'};
});
