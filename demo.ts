import { ansiGradient, b, bd, c, CLEAR, clr, em, g, n, paint } from './src'
import { l, r, d } from './src'
import { logger } from './src'

if (import.meta.main) {
	const title = logger({ prefix: d('\n\n# ') })
	const t = (str: string) => {
		title(bd(str), '\n')
	}
	// const l = logger({ prefix: d('| ') })

	function gradients() {
		// Create a gradient function.
		const gradient = ansiGradient('#38b2db', '#5959b5', '#e84067')

		// Wrap a string in the gradient.
		t('gradient string')
		const text = gradient('Simple gradient text.')
		l(text)

		// Or use color stops.
		const fade = `
${gradient(0.5)}■■■■■■■■■■■■
${gradient(0.0)}■■■■■■■■■■■■
${gradient(0.9)}■■■■■■■■■■■■
${CLEAR}`

		t('gradient stops')
		l(fade)
	}

	function minis() {
		t('minis')

		// Colors
		l(r('red'))
		l(g('green'))
		l(b('blue'))

		// Styles
		l(d('dimmed'))
		l(bd('bold'))
		l(em('italic'))

		n(2)
		l(r(), 'red', g(), 'green', b(), 'blue')
		l(g(), 'hello ', b(), 'world' + clr() + '!')
	}

	function loglog() {
		t('logger()')
		/**
		 * The `logger` function can be used to create your own custom logging functions that
		 * colorize input dynamically.
		 */
		const err = logger({
			prefix: r('| '),
			fn: (...args: any[]) => {
				console.log(r('>'), r(bd('ERROR')))
				console.log(...args)
			},
		})
		err('Something went wrong:', { code: 420, cause: '¯\\_(ツ)_/¯', ok: false })

		t('LogOptions')

		/**
		 * The `logger` function accepts the following options:
		 */

		t('printWidth')
		/**
		 * By default, the behavior is similar to traditional `console.log`.  Object and arrays
		 * will be expanded to multiline output based on the value of the `printWidth` option
		 * (default `60`). Arrays that contain an object will also be expanded.
		 *
		 * @note Internally, `printWidth` is calculated somewhat roughly, so this option is
		 * generally a ballpark estimate.
		 */
		let l = logger()
		l({ foo: true, bar: [1, 'two', { three: () => 3 }] })

		t('inline')
		/**
		 * Forces inputs into either inline or multiline output.
		 */
		l = logger({ inline: true })
		l({ foo: true, bar: [1, 'two', { three: () => 3 }] })

		t('inline overrides')
		/**
		 * Overrides the expansion behavior of a single object without affecting their parent's
		 * behavior. The key won't be printed in the output if detected.
		 */
		l = logger()
		// prettier-ignore
		l({
			one: 1,
			two: 2,
			three: 3,
			nested: { __inline__: true, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7 },
		})

		t('inline overrides 2')
		/**
		 * '__inline__' and '__multiline__' are special array elements that can provide more
		 * granular control over the expansion behavior of arrays.  Their expansion behavior
		 * will not spread to nested arrays/objects.
		 */
		l = logger()
		l([true, 1, 'two', () => 3, '__multiline__'])

		t('printWidth')
		/**
		 * Used to control the width at which automatic line wrapping occurs (in the absence of an
		 * explicit `inline` setting / override).
		 */
		l = logger({ printWidth: 60 })
		l(true, 1, 'two', () => 3)

		t('delimiter')
		/**
		 * The `delimiter` option can be used to change the delimiter between items.
		 */
		l = logger({ delimiter: c(' · ') })
		l(true, 1, 'two', () => 3)

		t('fn')
		/**
		 * The `fn` option can be used to change the function used to log messages.
		 */
		l = logger({ fn: console.warn })
		l('E-gad!')

		t('prefix')
		/**
		 * A prefix to prepend to each line (works with multiline output).
		 */
		l = logger({ prefix: c('⌇ '), delimiter: '' })
		l('# ', bd('Header'))
		l()
		l(d('<p>'), em('Hello, world!'), d('</p>'))

		t('paint()')
		/**
		 * The `paint` function used by `logger` can be used directly to colorize arbitrary input.
		 */
		console.log(
			paint(
				{
					num: 123,
					bool: true,
					str: 'foo',
					fn: () => 'bar',
				},
				{ inline: false },
			),
		)
	}

	/** Testing large object behavior. */
	function debug() {
		n(1)
		l([[1, '2'], true, { foo: 'bar' }])
		n(1)
		l([
			[1, '2'],
			true,
			{ one: 1, two: 2, three: 3, nested: { one: { two: 3 } } },
			{
				__inline__: true,
				one: 1,
				two: 'two',
				three: [3, 3, 3],
				four: 4,
				nested: { one: 1, two: 2, three: 3 },
			},
		])
	}

	gradients()

	minis()

	loglog()

	// testing()
}
