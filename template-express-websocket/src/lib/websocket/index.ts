import {type WebsocketRequestHandler} from 'express-ws';

export type ExpressWebSocket = Parameters<WebsocketRequestHandler>[0]; // get WebSocket type from express-ws

/**
 * internal Set of callbacks to remove closed socket automatically
 */
export const socketWatchList = new Set<(ws: ExpressWebSocket) => void>();

/**
 * register callback to remove closed socket
 * @example
 * const someWebsocketSet = new Set<WebSocket>();
 *
 * addSocketCloseWatchList((ws) => {
 *   someWebsocketSet.delete(ws);
 * });
 */
export function addSocketCloseWatchList(callback: (ws: ExpressWebSocket) => void): void {
	socketWatchList.add(callback);
}
