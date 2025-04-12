import isolated_declarations from 'unplugin-isolated-decl/rolldown'
import { defineConfig } from 'rolldown'

export default defineConfig([
	{
		input: 'src/index.ts',
		output: {
			format: 'esm',
			file: 'build/index.js',
			sourcemap: true,
		},
		// todo: remove once native .d.ts gen is added to rolldown
		plugins: [
			isolated_declarations({
				sourceMap: true,
			}),
		],
	},
])
