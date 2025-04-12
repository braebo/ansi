import { l, r, g, b, bd, ansiHex, ansiGradient, CLEAR, em } from '../../src/index.ts'

const gradient = ansiGradient('#38b2db', '#5959b5', '#e84067')
const svelte_orange = ansiHex('#e84067')

l(' ') // pnpm swallows empty l() calls
l(bd(em('<Bun>')))
l(g('green'), [CLEAR + bd('bold')], r('red'), bd(b('bold(blue)')))

l(gradient('painted') + ':', {
	nested: {
		foo: true,
		color: svelte_orange('svelte orange'),
		func: () => 'function',
		arr: [1, 2, 3],
		oops: null,
		num: 123,
		obj: {
			string: 'string',
			idk: undefined,
		},
	},
})

l(bd(em('</Bun>')))
