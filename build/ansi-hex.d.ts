export type AnsiStyle = keyof typeof ANSI_STYLE_CODES;
export declare const ANSI_STYLE_CODES: {
    readonly reset: 0;
    readonly bold: 1;
    readonly dim: 2;
    readonly italic: 3;
    readonly underline: 4;
    readonly inverse: 7;
    readonly hidden: 8;
    readonly strikethrough: 9;
};
/**
 * Creates an ANSI True Color _(24-bit RGB)_ formatter function from a hex color, falling back to
 * uncolored text in unsupported browsers _(Safari, Firefox)_.
 *
 * @example
 * ```ts
 * const red = ansiHex('#ff0000')
 * console.log(red('This text will be red'))
 * ```
 */
export declare function ansiHex(hex_color: `#${string}`): (...args: any[]) => string;
/**
 * Creates an {@link AnsiStyle|ANSI style} formatter function from a style name, falling back to
 * uncolored text in unsupported browsers (Safari, Firefox).
 *
 * @example
 * ```ts
 * const bold = ansiStyle('bold')
 * console.log(bold('This text will be bold'))
 * ```
 */
export declare function ansiStyle(style: AnsiStyle): (...args: any[]) => string;
/**
 * Converts a hex color string into an `[r, g, b]` tuple in range `[0,255]`.
 */
export declare function hexToRgb(hex: string): [number, number, number] | null;
