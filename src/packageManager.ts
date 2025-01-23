import {type SpawnSyncReturns} from 'node:child_process';
import {sync} from 'cross-spawn';
const packageManagers = ['npm', 'yarn', 'pnpm', 'bun'];

type PackageManager = (typeof packageManagers)[number];

export function isPackageManager(value: unknown): value is PackageManager {
	return typeof value === 'string' && packageManagers.includes(value);
}

export function runPackagerCommand(manager: PackageManager, commands: string[]): SpawnSyncReturns<Buffer> {
	return sync(manager, commands, {
		stdio: 'inherit',
	});
}

export function handleWorkspace(manager: PackageManager, commands: string[], workspace: string | undefined) {
	if (!workspace) {
		return commands;
	}
	switch (manager) {
		case 'npm':
			commands.push('--workspace', workspace);
			break;
		case 'yarn':
			commands.push('--workspaces', workspace);
			break;
		case 'pnpm':
			commands.push('--filter', workspace);
			break;
		case 'bun':
			commands.push('--workspace', workspace);
			break;
	}
	return commands;
}
