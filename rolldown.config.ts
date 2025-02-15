import isolated_declarations from 'unplugin-isolated-decl/rolldown'
import { defineConfig } from 'rolldown'

export default defineConfig({
	input: 'src/index.ts',
	output: {
		file: 'build/index.js',
		sourcemap: true,
	},
	plugins: [isolated_declarations()],
})
