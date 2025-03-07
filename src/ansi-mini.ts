import { ansiHex, ansiStyle } from './ansi-hex'
import { log } from './ansi-logger'

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
export const r: (...args: any[]) => string = ansiHex('#ff5347')
/** Wraps args in ansi green. */
export const g: (...args: any[]) => string = ansiHex('#57ab57')
/** Wraps args in ansi blue. */
export const b: (...args: any[]) => string = ansiHex('#4c4ce0')
/** Wraps args in ansi yellow. */
export const y: (...args: any[]) => string = ansiHex('#e2e270')
/** Wraps args in ansi magenta. */
export const m: (...args: any[]) => string = ansiHex('#d426d4')
/** Wraps args in ansi cyan. */
export const c: (...args: any[]) => string = ansiHex('#2fdede')
/** Wraps args in ansi orange. */
export const o: (...args: any[]) => string = ansiHex('#ff7f50')
/** Wraps args in ansi purple. */
export const p: (...args: any[]) => string = ansiHex('#9542e7')
/** Wraps args in ansi gray. */
export const gr: (...args: any[]) => string = ansiHex('#808080')

/** Wraps args in ansi dim. */
export const d: (...args: any[]) => string = ansiStyle('dim')
/** Wraps args in ansi bold. */
export const bd: (...args: any[]) => string = ansiStyle('bold')
/** Wraps args in ansi italic. */
export const em: (...args: any[]) => string = ansiStyle('italic')
/** Wraps args in ansi underline. */
export const ul: (...args: any[]) => string = ansiStyle('underline')
/** Wraps args in ansi inverse. */
export const inv: (...args: any[]) => string = ansiStyle('inverse')
/** Wraps args in ansi strikethrough. */
export const s: (...args: any[]) => string = ansiStyle('strikethrough')

/** Reset code to clear all ANSI styles. */
export const clr: (...args: any[]) => string = ansiStyle('reset')

/** Logs a new line `count` times. */
export function n(count = 1): void {
	for (let i = 0; i < count; i++) {
		log()
	}
}

/** `console.log` shorthand. */
export function l(...args: any[]): void {
	log(args)
}

/** `console.error` with prefix and ERROR label */
export function err(...args: any[]): void {
	log(r(bd('ERROR ')), { logger: console.error })
	log(args, { logger: console.error })
}
