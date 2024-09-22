export const templateList = [
	{
		name: 'Legacy Express template',
		key: 'express-legacy-starter',
		dir: 'template-express-legacy',
	},
	{
		name: 'Legacy Express websocket template',
		key: 'express-websocket-legacy-starter',
		dir: 'template-express-websocket-legacy',
	},
	{
		name: 'Hono template',
		key: 'hono-starter',
		dir: 'template-hono',
	},
	{
		name: 'Fastify template',
		key: 'fastify-starter',
		dir: 'template-fastify',
	},
] as const;

export type TemplateKey = (typeof templateList)[number]['key'];

export function isTemplateKey(key: string | undefined): key is TemplateKey {
	return templateList.some((template) => template.key === key);
}
