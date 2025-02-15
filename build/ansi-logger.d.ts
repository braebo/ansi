/**
 * Options for the {@link log} function.
 */
export interface LogOptions {
    /**
     * Optional label to prepend to the log.
     */
    label?: string;
    /**
     * Alternative logger function, i.e. `console.warn/error`.
     * @default console.log
     */
    logger?: (...args: any[]) => void;
    /**
     * Prefix to prepend to the log.
     * @default d('︙ ')
     */
    prefix?: string;
    /**
     * Delimiter to use between rest args.
     * @default undefined
     */
    delimiter?: string;
    /**
     * Whether to print objects in a single line when passing multiple args.
     * @default true
     */
    inline?: boolean;
}
/**
 * `console.log` wrapper that handles multi-line strings and includes an optional label and prefix.
 */
export declare function log(args?: any[], opts?: LogOptions): void;
