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
	opts.inline ??= false

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
				if (Array.isArray(v)) {
					const aa = []
					aa.push('[')
					for (let i = 0; i < v.length; i++) {
						paint(v[i], aa)
						if (i < v.length - 1) aa.push(', ')
					}
					aa.push(']')
					arr.push(aa.join(''))
					return
				}
				const s = paint_object(v as Record<any, unknown>, opts)
				arr.push(s)
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
	indent?: number
	prefix?: string
}

/**
 * Colors a primitive based on its type.
 */
export function paint_primitive(v: any, opts: ClrOptions & { wrapString?: boolean } = {}): string {
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
			return opts.wrapString ? d(g('"')) + g(v) + d(g('"')) : v
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

	if ('__inline__' in v) {
		inline = v.__inline__
		delete v.__inline__
	}

	opts.prefix ??= ''

	const nl = inline ? '' : '\n'
	const indentStr = inline ? '' : '  '.repeat(indent)
	const parentIndentStr = inline ? '' : '  '.repeat(indent - 1)
	let s = '{ ' + nl
	const entries = Object.entries(v)
	for (let j = 0; j < entries.length; j++) {
		s += opts.prefix
		s += indentStr + d(entries[j][0])
		s += ': '
		s += paint_primitive(entries[j][1], { inline, indent: indent + 1, wrapString: true })
		if (j < entries.length - 1) {
			s += ', ' + nl
		}
	}
	s += nl
	if (inline) s += ' '
	s += opts.prefix
	s += parentIndentStr + '}'
	return s
}
