import { r, g, d, o, p, y, gr, em } from './ansi-mini'

interface PaintOptions {
	/**
	 * Whether to print objects in a single line.
	 *
	 * @default true
	 */
	inline?: boolean
	/**
	 * Prepends a prefix to each line.
	 * @default ''
	 */
	prefix?: string
	/**
	 * Characters in an inline array/object before auto-expanding.
	 * @default 50
	 */
	printWidth?: number
}

export function paint(v: any, opts: PaintOptions = {}): string {
	const options: ClrOptions = {
		prefix: '',
		printWidth: 60,
		// printWidth: 50,
		indent: 1,
		// wrapString: false,
		...opts,
	}

	return paint_primitive(v, options)
}

/** @internal */
interface ClrOptions extends PaintOptions {
	prefix: string
	printWidth: number
	/**
	 * Keeps track of the current indent level.
	 * @internal
	 */
	indent: number
	/**
	 * Whether to wrap strings in quotes.
	 * @internal
	 */
	wrapString?: boolean
}

/**
 * Colors a primitive based on its type.
 */
function paint_primitive(v: any, opts: ClrOptions): string {
	if (v === null) return em(gr('null'))
	if (v === undefined) return em(gr('undefined'))
	if (v === true || v === false) return y(v)

	switch (typeof v) {
		case 'function':
			const s = o(v.toString().replaceAll(/\n/g, ''))
			if (s.length < opts.printWidth) return s
			return o('[Function]')
		case 'number':
			return p(v)
		case 'string':
			return opts.wrapString ? d(g(`'`)) + g(v) + d(g(`'`)) : v
		case 'boolean':
			return v ? g('true') : r('false')
		case 'object':
			return paint_object(v, opts)
		default:
			return v
	}
}

/**
 * Converts an object into a colorized string.
 */
function paint_object(v: any, opts: ClrOptions): string {
	if (!v || typeof v !== 'object') return paint_primitive(v, opts)
	let { inline, indent } = opts
	opts.wrapString ??= true

	// Handle overrides.
	const keys = Array.isArray(v) ? v : Object.keys(v)
	for (let i = 0; i < keys.length; i++) {
		if (keys[i] === '__inline__') {
			inline = v['__inline__'] ?? true
		} else if (keys[i] === '__multiline__') {
			inline = v['__multiline__'] ?? false
		}
	}

	// Handle default behavior based on size.
	if (typeof inline === 'undefined') {
		if (count(v) <= opts.printWidth) {
			inline = true
		}
	}

	if (Array.isArray(v)) {
		// Array printing.

		let s = ''
		s += '['
		for (let i = 0; i < v.length; i++) {
			if (v[i] === '__inline__' || v[i] === '__multiline__') {
				// Remove trailing comma.
				if (i === v.length - 1) {
					const end = s.slice(-2)
					if (end === ', ') {
						s = s.slice(0, -2)
					}
				}
				continue
			}

			const nl = inline ? '' : '\n' + opts.prefix + '  '.repeat(indent)
			s += nl

			s += paint_primitive(v[i], { ...opts, indent: indent + 1, inline })
			if (i < v.length - 1) s += ', '
		}
		s += inline ? '' : '\n' + opts.prefix + '  '.repeat(indent - 1)
		s += ']'
		return s
	}

	// Fallthrough object default inline behavior.
	if (typeof inline === 'undefined') {
		inline = count(v) <= opts.printWidth
	}

	// Object printing.

	const nl = inline ? '' : '\n'
	const indentStr = inline ? '' : '  '.repeat(indent)
	const prefix = inline ? '' : opts.prefix
	const parentIndentStr = inline ? '' : '  '.repeat(indent - 1)

	let s = '{ ' + nl
	const entries = Object.entries(v)
	for (let j = 0; j < entries.length; j++) {
		if (entries[j][0] === '__inline__') {
			// Remove trailing comma.
			if (j === entries.length - 1) {
				const end = s.slice(-2)
				if (end === ', ') {
					s = s.slice(0, -2)
				}
			}
			continue
		}
		s += prefix
		s += indentStr + d(entries[j][0])
		s += ': '
		s += paint_primitive(entries[j][1], { ...opts, indent: indent + 1, wrapString: true })

		// No trailing comma.
		if (j < entries.length - 1) {
			s += ', '
			s += nl
		}
	}
	s += nl
	if (inline) s += ' '
	s += prefix
	s += parentIndentStr + '}'
	return s
}

/**
 * Estimates the length of the stringified object / array.
 */
function count(v: any, n = v.length) {
	if (!Array.isArray(v)) {
		return count(
			Object.entries(v).flatMap(([k, v]) => [k, v]),
			n,
		)
	}

	// Handles arrays (with nested arrays and objects).
	for (let i = 0; i < v.length; i++) {
		if (typeof v[i] === 'object') {
			if (v[i] === null) {
				n += 4
			} else if (Array.isArray(v[i])) {
				n += count(v[i], n)
			} else {
				n += count(Object.values(v[i]), n)
			}
		} else {
			n += JSON.stringify(v[i])?.length ?? 0
		}
	}
	return n
}
