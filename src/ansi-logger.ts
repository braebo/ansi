import { r, g, d, o, p, y } from './ansi-mini'

/**
 * Options for the {@link log} function.
 */
export interface LogOptions {
	/**
	 * Optional label to prepend to the log.
	 */
	label?: string
	/**
	 * Alternative logger function, i.e. `console.warn/error`.
	 * @default console.log
	 */
	logger?: (...args: any[]) => void
	/**
	 * Prefix to prepend to the log.
	 * @default d('︙ ')
	 */
	prefix?: string

	/**
	 * Delimiter to use between rest args.
	 * @default undefined
	 */
	delimiter?: string

	/**
	 * Whether to print objects in a single line when passing multiple args.
	 * @default true
	 */
	inline?: boolean
}

/**
 * `console.log` wrapper that handles multi-line strings and includes an optional label and prefix.
 */
export function log(args = [] as any[], opts: LogOptions = {}): void {
	// prettier-ignore
	const {
		label = '',
		logger = console.log,
		prefix = d('︙ '),
		delimiter = '',
		inline = true,
	} = opts

	if (args.length === 0) {
		label && logger(prefix + label)
		logger(prefix)

		return
	}

	if (typeof args[0] === 'string' && args.length === 1) {
		const lines = args[0].split('\n')
		for (let i = 0; i < lines.length; i++) {
			if (i === 0 && label) logger(prefix + label)
			logger(prefix + lines[i])
		}

		return
	}

	if (label) logger(prefix + label)
	try {
		const a = []

		for (let i = 0; i < args.length; i++) {
			switch (typeof args[i]) {
				case 'object': {
					if (!args[i]) {
						a.push(d(args[i]))
						break
					}
					const s = paint_object(args[i], { inline })
					if (inline) a.push(s)
					else a.push(s.replaceAll('\n', '\n' + prefix))
					break
				}
				case 'number': {
					a.push(p(args[i]))
					break
				}
				default: {
					a.push(args[i])
					break
				}
			}
		}

		logger(prefix + a.join(delimiter))
	} catch (e) {
		console.error(e)
		console.log(args)
	}

	return
}

interface ClrOptions {
	/**
	 * Whether to print objects in a single line.
	 * @default true
	 */
	inline?: boolean
	/** @internal */
	indent?: number
}

/** Colors a primitive based on its type. */
function paint_primitive(v: any, opts: ClrOptions = {}): string {
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
function paint_object(v: Record<any, unknown>, opts: ClrOptions = {}): string {
	const { inline, indent = 1 } = opts
	const nl = inline ? '' : '\n'
	const indentStr = inline ? '' : '  '.repeat(indent)
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
	s += '}'
	return s
}
