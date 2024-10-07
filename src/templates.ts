export const templateList = [
	{
		name: 'Express template',
		key: 'express-starter',
		dir: 'template-express',
	},
	{
		name: 'Express websocket template',
		key: 'express-websocket-starter',
		dir: 'template-express-websocket',
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
	{
		name: 'Encore template',
		key: 'encore-starter',
		dir: 'template-encore',
		startScript: 'start',
	},
] as const;

export type Template = (typeof templateList)[number];

export type TemplateKey = Template['key'];

export function isTemplateKey(key: string | undefined): key is TemplateKey {
	return templateList.some((template) => template.key === key);
}
