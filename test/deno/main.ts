import { ansiHex } from '@braebo/ansi'

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
	const coral = ansiHex('#FF7F50')
	console.log(coral('This text will be coral colored'))
}

//

export function add(a: number, b: number): number {
	return a + b
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
	console.log('Add 2 + 3 =', add(2, 3))
}
