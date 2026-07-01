import {defineConfig} from 'tsdown';

export default defineConfig({
	entry: 'src/index.ts',
	deps: {
		onlyBundle: ['minimist', 'picocolors', 'kleur', 'prompts', 'sisteransi', 'isexe', 'which', 'path-key', 'cross-spawn', 'shebang-regex', 'shebang-command'],
	},
  minify: true,
  dts: false,
});
