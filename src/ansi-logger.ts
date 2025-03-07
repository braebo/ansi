import { paint } from './ansi-paint'

/**
 * Options for the {@link log} function.
 */
export interface LogOptions {
	/**
	 * Alternative logger function, i.e. `console.warn/error`.
	 * @default console.log
	 */
	fn?: (...args: any[]) => void

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

	/**
	 * Automatically expands inline objects/arrays that exceed this width.
	 * @default 60
	 */
	printWidth?: number
}

/**
 * You should probably use {@link logger} instead.
 *
 * Used by {@link logger} to create `console.log` with various {@link LogOptions|options} and features.
 */
export function log<T>(args = [] as T | T[], opts: LogOptions = {}): void {
	opts.fn ??= console.log
	opts.prefix ??= ''
	opts.delimiter ??= ' '

	if (!Array.isArray(args)) {
		args = [args]
	}

	if (args.length === 0) {
		opts.fn(opts.prefix)

		return
	}

	if (typeof args[0] === 'string' && args.length === 1) {
		const lines = args[0].split('\n')
		for (let i = 0; i < lines.length; i++) {
			opts.fn(opts.prefix + lines[i])
		}

		return
	}

	try {
		const a = [] as string[]

		for (let i = 0; i < args.length; i++) {
			a.push(paint(args[i], opts))
		}

		opts.fn(opts.prefix + a.join(opts.delimiter))
	} catch (e) {
		console.error(e)
		console.log(args)
	}

	return
}

/**
 * Creates a logger function with the given {@link LogOptions|options}.
 *
 * - {@link LogOptions.fn|`logger`} - Alternative logger function, i.e. `console.warn/error`.
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
