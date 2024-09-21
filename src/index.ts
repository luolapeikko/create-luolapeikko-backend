/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {isTemplateKey, TemplateKey, templateList} from './templates.js';
import colors from 'picocolors';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
import minimist from 'minimist';
import path from 'node:path';
import prompts from 'prompts';

const {greenBright, red, redBright, reset} = colors;

const argv = minimist<{
	template?: string;
	t?: string;
	help?: boolean;
	verbose?: boolean;
}>(process.argv.slice(2), {
	default: {help: false},
	alias: {h: 'help', t: 'template', v: 'verbose'},
	string: ['_'],
});
const cwd = process.cwd();

const helpMessage = `\
Usage: create-luolapeikko-backend [OPTION]... [DIRECTORY]

Create a new Backend project in TypeScript.
With no arguments, start the CLI in interactive mode.

Options:
  -t, --template NAME        use a specific template
  -v, --verbose              print additional logs

Available templates:`;

function formatTargetDir(targetDir: string | undefined) {
	return targetDir?.trim().replace(/\/+$/g, '');
}

function isEmpty(path: string) {
	const files = fs.readdirSync(path);
	return files.length === 0 || (files.length === 1 && files[0] === '.git');
}

function isValidPackageName(projectName: string) {
	return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(projectName);
}

function toValidPackageName(projectName: string) {
	return projectName
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/^[._]/, '')
		.replace(/[^a-z\d\-~]+/g, '-');
}

const defaultTargetDir = 'backend';

const renameFiles: Record<string, string | undefined> = {
	_gitignore: '.gitignore',
};

const copyIgnore = new Set(['dist', 'node_modules', 'package.json']);

function copy(src: string, dest: string): void {
	const stat = fs.statSync(src);
	if (stat.isDirectory()) {
		return copyDir(src, dest);
	} else {
		if (argv.verbose) {
			console.log(`${greenBright('COPY')} ${dest}`);
		}
		return fs.copyFileSync(src, dest);
	}
}

function copyDir(srcDir: string, destDir: string): void {
	fs.mkdirSync(destDir, {recursive: true});
	for (const file of fs.readdirSync(srcDir)) {
		const srcFile = path.resolve(srcDir, file);
		const destFile = path.resolve(destDir, file);
		copy(srcFile, destFile);
	}
}

function emptyDir(dir: string) {
	if (!fs.existsSync(dir)) {
		return;
	}
	for (const file of fs.readdirSync(dir)) {
		if (file === '.git') {
			continue;
		}
		console.log(`${redBright('REMOVE')} ${path.resolve(dir, file)}`);
		fs.rmSync(path.resolve(dir, file), {recursive: true, force: true});
	}
}

function getArgTemplate(): TemplateKey | undefined {
	const argTemplate = argv.template || argv.t;
	return isTemplateKey(argTemplate) ? argTemplate : undefined;
}

async function init() {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	const argTargetDir = formatTargetDir(argv._[0]);
	const argTemplate = getArgTemplate();
	const help = argv.help;
	if (help) {
		console.log(helpMessage);
		return;
	}
	let targetDir = argTargetDir || defaultTargetDir;
	const getProjectName = () => (targetDir === '.' ? path.basename(path.resolve()) : targetDir);

	let result: prompts.Answers<'projectName' | 'overwrite' | 'packageName' | 'framework'>;

	prompts.override({
		overwrite: argv.overwrite,
	});

	try {
		result = await prompts(
			[
				{
					type: argTargetDir ? null : 'text',
					name: 'projectName',
					message: 'Project name:',
					initial: defaultTargetDir,
					onState: (state) => {
						targetDir = formatTargetDir(state.value) || defaultTargetDir;
					},
				},
				{
					type: () => (!fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'select'),
					name: 'overwrite',
					message: () => (targetDir === '.' ? 'Current directory' : `Target directory "${targetDir}"`) + ` is not empty. Please choose how to proceed:`,
					initial: 0,
					choices: [
						{
							title: 'Remove existing files and continue',
							value: 'yes',
						},
						{
							title: 'Cancel operation',
							value: 'no',
						},
						{
							title: 'Ignore files and continue',
							value: 'ignore',
						},
					],
				},
				{
					type: (_, {overwrite}: {overwrite?: string}) => {
						if (overwrite === 'no') {
							throw new Error(`${red('✖')} Operation cancelled`);
						}
						return null;
					},
					name: 'overwriteChecker',
				},
				{
					type: () => (isValidPackageName(getProjectName()) ? null : 'text'),
					name: 'packageName',
					message: reset('Package name:'),
					initial: () => toValidPackageName(getProjectName()),
					validate: (dir) => isValidPackageName(dir) || 'Invalid package.json name',
				},
				{
					type: argTemplate ? null : 'select',
					name: 'framework',
					message: isTemplateKey(argTemplate) ? reset(`"${argTemplate}" isn't a valid template. Please choose from below: `) : reset('Select a framework:'),
					initial: 0,
					choices: templateList.map((template) => ({title: template.name, value: template.key})),
				},
			],
			{
				onCancel: () => {
					throw new Error(`${red('✖')} Operation cancelled`);
				},
			},
		);
	} catch (cancelled: any) {
		console.log(cancelled.message);
		return;
	}

	// user choice associated with prompts
	const {framework, overwrite, packageName} = result;
	const targetFramework = argTemplate || framework;

	const template = templateList.find((t) => t.key === targetFramework);
	if (!template) {
		throw new Error(`Template ${framework} not found`);
	}

	const templateDir = path.resolve(fileURLToPath(import.meta.url), '../..', template.dir);

	const write = (file: string, content?: string) => {
		const targetPath = path.join(root, renameFiles[file] ?? file);
		if (content) {
			if (argv.verbose) {
				console.log(`${greenBright('CREATE')} ${targetPath}`);
			}
			fs.writeFileSync(targetPath, content);
		} else {
			copy(path.join(templateDir, file), targetPath);
		}
	};
	const root = path.join(cwd, targetDir);

	if (overwrite === 'yes') {
		emptyDir(root);
	} else if (!fs.existsSync(root)) {
		fs.mkdirSync(root, {recursive: true});
	}

	console.log(`\nScaffolding project in ${root}...`);

	if (!fs.existsSync(root)) {
		fs.mkdirSync(root, {recursive: true});
	}
	const files = fs.readdirSync(templateDir);
	for (const file of files.filter((f) => !copyIgnore.has(f))) {
		write(file);
	}
	// create package.json
	const pkg = JSON.parse(fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'));
	pkg.name = packageName || getProjectName();
	write('package.json', JSON.stringify(pkg, null, 2) + '\n');

	return Promise.resolve();
}

init().catch((e: unknown) => {
	console.error('Fata', e);
});
