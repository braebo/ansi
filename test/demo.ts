import { ansiGradient, CLEAR as C, LogOptions } from '../src'
import { log, logger } from '../src'
import { r, d } from '../src'

const l = logger({ prefix: d('| ') })

// Create a gradient function.
const g = ansiGradient('#38b2db', '#5959b5', '#e84067')

// Wrap a string in the gradient.
const text = g('Simple gradient text.')

l(text)

// Or use color stops.
const fade = `
${g(0.5)}■■■■■■■■■■■■${C}
${g(0.0)}■■■■■■■■■■■■${C}
${g(0.9)}■■■■■■■■■■■■${C}`

l(fade)

function test_log() {
	const e = new Error('💥', { cause: d('¯\\_(ツ)_/¯') })
	log()
	log(r(e.name))

	log()
	log([e.message, { cause: e.cause }])

	const a = [1, 2, { a: 1, b: 2 }]
	log()
	log(a, { delimiter: d(', ') })
	log()
	log([a], { delimiter: d(', ') })
}

test_log()
