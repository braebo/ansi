/**
 * Creates a gradient function that interpolates between multiple hex colors.
 * @returns A function that generates ANSI color codes for any point along the gradient (0-1).
 *
 * @example
 * ```ts
 * const sunset = gradient('#00e1ff', '#e67e22', '#f1c40f')
 *
 * console.log(sunset(0), 'blue')
 * console.log(sunset(0.5), 'orange')
 * console.log(sunset(1), 'yellow')
 * ```
 */
export declare function ansiGradient(...hexColors: `#${string}`[]): (position: number) => string;
