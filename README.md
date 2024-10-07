# create-luolapeikko-backend

Base NodeJS backend install cli

## Templates

- "express-starter"
- "express-websocket-starter"
- "hono-starter"
- "fastify-starter"
- "encore-starter"

## Usage

```bash
npm create luolapeikko-backend@latest backend -- --template express-websocket-starter

pnpm create luolapeikko-backend backend --template express-websocket-starter
```

## Options

- `-t`, `--template` - Template to use
- `-v`, `--verbose` - Verbose output
- `-h`, `--help` - Display help
- `-p`, `--package-manager` - Package manager to use [npm, pnpm, yarn, bun]
- `-w`, `--workspace` - Workspace to use

## Future changes

- New service class based templates for Express. (more controllable design for bigger projects)
