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
 *
 * @TODO: This whole file should prolly be a class.
 */
export function log<T>(args = [] as T | T[], opts: LogOptions = {}): void {
	// prettier-ignore
	const {
		logger = console.log,
		prefix = '',
		delimiter = ' ',
		inline = false,
	} = opts

	if (!Array.isArray(args)) {
		args = [args]
	}

	if (args.length === 0) {
		logger(prefix)

		return
	}

	if (typeof args[0] === 'string' && args.length === 1) {
		const lines = args[0].split('\n')
		for (let i = 0; i < lines.length; i++) {
			logger(prefix + lines[i])
		}

		return
	}

	try {
		const a = [] as string[]

		function paint(v: any, arr: string[]) {
			switch (typeof v) {
				case 'object': {
					if (!v) {
						arr.push(d(v))
						break
					}
					if (Array.isArray(v)) {
						const aa = []
						aa.push('[')
						for (let i = 0; i < v.length; i++) {
							paint(v[i], aa)
							if (i < v.length - 1) aa.push(',')
						}
						aa.push(']')
						arr.push(aa.join(''))
						break
					}
					const s = paint_object(v as Record<any, unknown>, {
						inline: inline,
					})
					arr.push(s)
					break
				}
				case 'number': {
					arr.push(p(v))
					break
				}
				default: {
					arr.push(v)
					break
				}
			}
		}

		for (let i = 0; i < args.length; i++) {
			paint(args[i], a)
		}

		logger(prefix + a.join(delimiter))
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
 *
 * @TODO: new Logger()
 */
export function logger(opts: LogOptions): (...args: any[]) => void {
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
}

/** Colors a primitive based on its type. */
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
			return d(g('"')) + g(v) + d(g('"'))
		case 'boolean':
			return v ? g('true') : r('false')
		case 'object':
			return paint_object(v, opts)
		default:
			return v
	}
}

/** Converts an object into a colorized string. */
export function paint_object(v: any, opts: ClrOptions = {}): string {
	if (!v || typeof v !== 'object') return paint_primitive(v, opts)
	let { inline, indent = 1 } = opts

	if ('__inline__' in v) {
		inline = v.__inline__
		delete v.__inline__
	}

	const nl = inline ? '' : '\n'
	const indentStr = inline ? '' : '  '.repeat(indent)
	const parentIndentStr = inline ? '' : '  '.repeat(indent - 1)
	let s = '{ ' + nl
	const entries = Object.entries(v)
	for (let j = 0; j < entries.length; j++) {
		s += indentStr + d(entries[j][0])
		s += ': '
		s += paint_primitive(entries[j][1], { inline, indent: indent + 1 })
		if (j < entries.length - 1) {
			s += ', ' + nl
		}
	}
	s += nl
	if (inline) s += ' '
	s += parentIndentStr + '}'
	return s
}
