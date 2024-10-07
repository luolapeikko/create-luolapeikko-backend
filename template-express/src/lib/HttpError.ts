export class HttpError extends Error {
	public readonly code: number;
	public readonly description: string | undefined;
	public readonly isSilent: boolean;
	constructor(code: number, message: string, description?: string, isSilent = false) {
		super(message);
		this.name = 'HttpError';
		this.code = code;
		this.description = description;
		this.isSilent = isSilent;
		Error.captureStackTrace(this, this.constructor);
	}
}
