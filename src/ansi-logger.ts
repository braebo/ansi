import { r, g, d, o, p, y } from './ansi-mini'

/**
 * Options for the {@link log} function.
 */
export interface LogOptions {
	/**
	 * Alternative logger function, i.e. `console.warn/error`.
	 * @default console.log
	 */
	logger?: (...args: any[]) => void

	/**
	 * Optional prefix to prepend to the log.
	 * @example
	 * ```ts
	 * const l = (...args) => log(args, { prefix: d('┤ ') })
	 *
	 * l()                // ┤
	 * l('Hello, world!') // ┤ Hello, world!
	 * l()                // ┤
	 * ```
	 */
	prefix?: string

	/**
	 * Delimiter to use between rest args.  Defaults to a space character.  Pass an empty string to disable.
	 * @default ' '
	 */
	delimiter?: string

	/**
	 * Whether to print objects in a single line when passing multiple args.
	 * @default true
	 */
	inline?: boolean
}

/**
 * You should probably use {@link logger} instead.
 *
 * Used by {@link logger} to create `console.log` with various {@link LogOptions|options} and features.
 */
export function log<T>(args = [] as T | T[], opts: LogOptions = {}): void {
	opts.logger ??= console.log
	opts.prefix ??= ''
	opts.delimiter ??= ' '

	if (!Array.isArray(args)) {
		args = [args]
	}

	if (args.length === 0) {
		opts.logger(opts.prefix)

		return
	}

	if (typeof args[0] === 'string' && args.length === 1) {
		const lines = args[0].split('\n')
		for (let i = 0; i < lines.length; i++) {
			opts.logger(opts.prefix + lines[i])
		}

		return
	}

	try {
		const a = [] as string[]

		function paint(v: any, arr: string[]) {
			if (typeof v !== 'object') {
				arr.push(paint_primitive(v, opts))
				return
			} else {
				if (!v) {
					arr.push(d(v))
					return
				}

				arr.push(paint_object(v as Record<any, unknown>, opts))
			}
		}

		for (let i = 0; i < args.length; i++) {
			paint(args[i], a)
		}

		opts.logger(opts.prefix + a.join(opts.delimiter))
	} catch (e) {
		console.error(e)
		console.log(args)
	}

	return
}

/**
 * Creates a logger function with the given {@link LogOptions|options}.
 *
 * - {@link LogOptions.logger|`logger`} - Alternative logger function, i.e. `console.warn/error`.
 * - {@link LogOptions.prefix|`prefix`} - Optional prefix to prepend to the log.
 * - {@link LogOptions.delimiter|`delimiter`} - Delimiter to use between rest args.  Defaults to a space character.  Pass an empty string to disable.
 * - {@link LogOptions.inline|`inline`} - Whether to print objects in a single line.
 *
 * @example
 * ```ts
 * const l = logger({ prefix: d('| ') })
 *
 * l()                // |
 * l('Hello, world!') // | Hello, world!
 * l()                // |
 * ```
 */
export function logger(opts?: LogOptions): (...args: any[]) => void {
	return (...args: any[]) => log(args, opts)
}

/** @internal */
interface ClrOptions {
	/**
	 * Whether to print objects in a single line.
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
	 * @default 60
	 */
	overflow?: number
	/**
	 * Keeps track of the current indent level.
	 * @internal
	 */
	indent?: number
	/**
	 * Whether to wrap strings in quotes.
	 * @internal
	 */
	wrapString?: boolean
}

/**
 * Colors a primitive based on its type.
 */
export function paint_primitive(v: any, opts: ClrOptions = {}): string {
	if (v === null) return d('null')
	if (v === undefined) return d('undefined')
	if (v === true || v === false) return y(v)

	switch (typeof v) {
		case 'function':
			const s = d(o(v.toString().replaceAll(/\n/g, '')))
			if (s.length < 75) return s
			return d(o('[Function]'))
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
export function paint_object(v: any, opts: ClrOptions = {}): string {
	if (!v || typeof v !== 'object') return paint_primitive(v, opts)
	let { inline, indent = 1 } = opts
	opts.prefix ??= ''
	opts.wrapString ??= true
	opts.overflow ??= 60

	// Handle overrides.
	const keys = Array.isArray(v) ? v : Object.keys(v)
	for (let i = 0; i < keys.length; i++) {
		if (keys[i] === '__inline__') {
			inline = v['__inline__'] ?? true
		} else if (keys[i] === '__expanded__') {
			inline = v['__expanded__'] ?? false
		}
	}

	// Handle default behavior based on size.
	if (typeof inline === 'undefined') {
		if (count(v) <= opts.overflow) {
			inline = true
		}
	}

	if (Array.isArray(v)) {
		// Array printing.

		let s = ''
		s += '['
		for (let i = 0; i < v.length; i++) {
			if (v[i] === '__inline__' || v[i] === '__expanded__') {
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
		inline = count(v) <= opts.overflow
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
			s += ', ' + nl
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
			// n += count(v[i], n)
			if (Array.isArray(v[i])) {
				n += count(v[i], n)
			} else {
				n += count(Object.values(v[i]), n)
			}
		} else {
			n += JSON.stringify(v[i]).length
		}
	}
	return n
}
