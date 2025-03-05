/**
 * Options for the {@link log} function.
 */
export interface LogOptions {
    /**
     * Alternative logger function, i.e. `console.warn/error`.
     * @default console.log
     */
    logger?: (...args: any[]) => void;
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
    prefix?: string;
    /**
     * Delimiter to use between rest args.  Defaults to a space character.  Pass an empty string to disable.
     * @default ' '
     */
    delimiter?: string;
    /**
     * Whether to print objects in a single line when passing multiple args.
     * @default true
     */
    inline?: boolean;
}
/**
 * You should probably use {@link logger} instead.
 *
 * Used by {@link logger} to create `console.log` with various {@link LogOptions|options} and features.
 *
 * @TODO: This whole file should prolly be a class.
 */
export declare function log<T>(args?: T | T[], opts?: LogOptions): void;
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
export declare function logger(opts: LogOptions): (...args: any[]) => void;
/** @internal */
interface ClrOptions {
    /**
     * Whether to print objects in a single line.
     * @default true
     */
    inline?: boolean;
    indent?: number;
}
/** Colors a primitive based on its type. */
export declare function paint_primitive(v: any, opts?: ClrOptions): string;
/** Converts an object into a colorized string. */
export declare function paint_object(v: any, opts?: ClrOptions): string;
export {};
