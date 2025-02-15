import { hexToRgb } from './ansi-hex'

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
export function ansiGradient(...hexColors: `#${string}`[]): (position: number) => string {
	if (hexColors.length < 2) {
		throw new Error('Gradient requires at least 2 colors')
	}

	const rgbColors = hexColors.map((hex) => {
		const rgb = hexToRgb(hex)
		if (!rgb) throw new Error(`Invalid hex color: ${hex}`)
		return rgb
	})

	return (position: number): string => {
		// Clamp position to 0-1
		position = Math.max(0, Math.min(1, position))

		// Find the color stops we're between
		const segment = position * (rgbColors.length - 1)
		const index = Math.floor(segment)
		const fraction = segment - index

		// Handle edge cases
		if (index >= rgbColors.length - 1) {
			const [r, g, b] = rgbColors[rgbColors.length - 1]
			return `\x1b[38;2;${r};${g};${b}m`
		}

		// Interpolate between the two colors
		const start = rgbColors[index]
		const end = rgbColors[index + 1]

		const r = Math.round(start[0] + (end[0] - start[0]) * fraction)
		const g = Math.round(start[1] + (end[1] - start[1]) * fraction)
		const b = Math.round(start[2] + (end[2] - start[2]) * fraction)

		return `\x1b[38;2;${r};${g};${b}m`
	}
}

export function gradientText(text: string, gradient: (stop: number) => string): string {
	let arr = [...text]
	for (let i = 0; i < arr.length; i++) {
		arr[i] = gradient(i / (arr.length - 1 ) ) + arr[i]
	}
	return arr.join('')
}