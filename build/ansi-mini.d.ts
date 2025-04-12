/**
* @fileoverview ANSI Mini
* Irresponsibly short ANSI code wrappers for the terminal / supported browsers (Chrome).
* It's mostly a palette of ANSI True Color wrappers using `{@link ansiHex}` and `{@link ansiStyle}`.
*
* @example
* ```ts
* import { l, r, dim, bd, em } from '@braebo/ansi/mini'
*/
/** Wraps args in ansi red. */
export declare const r: (...args: any[]) => string;
/** Wraps args in ansi green. */
export declare const g: (...args: any[]) => string;
/** Wraps args in ansi blue. */
export declare const b: (...args: any[]) => string;
/** Wraps args in ansi yellow. */
export declare const y: (...args: any[]) => string;
/** Wraps args in ansi magenta. */
export declare const m: (...args: any[]) => string;
/** Wraps args in ansi cyan. */
export declare const c: (...args: any[]) => string;
/** Wraps args in ansi orange. */
export declare const o: (...args: any[]) => string;
/** Wraps args in ansi purple. */
export declare const p: (...args: any[]) => string;
/** Wraps args in ansi gray. */
export declare const gr: (...args: any[]) => string;
/** Wraps args in ansi dim. */
export declare const d: (...args: any[]) => string;
/** Wraps args in ansi bold. */
export declare const bd: (...args: any[]) => string;
/** Wraps args in ansi italic. */
export declare const em: (...args: any[]) => string;
/** Wraps args in ansi underline. */
export declare const ul: (...args: any[]) => string;
/** Wraps args in ansi inverse. */
export declare const inv: (...args: any[]) => string;
/** Wraps args in ansi strikethrough. */
export declare const s: (...args: any[]) => string;
/** Reset code to clear all ANSI styles. */
export declare const clr: (...args: any[]) => string;
/** Logs a new line `count` times. */
export declare function n(count?: number): void;
/** `console.log` shorthand. */
export declare function l(...args: any[]): void;
/** `console.error` with prefix and ERROR label */
export declare function err(...args: any[]): void;
