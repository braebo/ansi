# @braebo/ansi

ANSI code helpers for node.js and chrome.

<br>

-   Hex -> True Color
-   TypeScript / ESM
-   Handles gradients
-   Colorizes objects
-   Dependency free
-   Lightweight <sup>(1.3kb minified brotli)</sup>
-   Tree shakable

<br>

## Install

```zsh
# npm
pnpm i -D @braebo/ansi

# jsr
pnpm dlx jsr add @braebo/ansi
```

<br>

## Usage

### Hex

Create colors from hex values:

```typescript
import { ansiHex } from '@braebo/ansi'

const coral = ansiHex('#FF7F50')
console.log(coral('This text will be coral colored'))
```

<br>

### Style

Create styles from the `ansiStyle` function:

```typescript
import { ansiStyle } from '@braebo/ansi'

const bold = ansiStyle('bold')
console.log(bold('This text will be bold'))
```

<br>

### Gradient

Interpolate gradients with any number of colors:

```ts
import { ansiGradient } from '@braebo/ansi'

// Create a gradient function.
const g = ansiGradient('#38b2db', '#5959b5', '#e84067')
```

Now that we have a gradient function, we can pass it a string:

```ts
console.log(g('Simple gradient text.'))
```

<img src="./assets/gradient-string.png" alt="Gradient string" height="150" width="auto" />

Or pass it a number to get a color stop:

```ts
const fade = `
${g(0.5)}■■■■■■■■■■■■
${g(0.0)}■■■■■■■■■■■■
${g(0.9)}■■■■■■■■■■■■
${CLEAR}`

console.log(fade)
```

<img src="./assets/gradient-stops.png" alt="Gradient color stops" height="200" width="auto" />

### Mini Methods

Colored logging can quickly become unweildy, so I like to use the mini methods for common colors and styles:

```typescript
import { l } from '@braebo/ansi' // console.log

import { r, g, b } from '@braebo/ansi' // Colors
import { d, bd, em } from '@braebo/ansi' // Styles

// Colors
l(r('red'))
l(g('green'))
l(b('blue'))

// Styles
l(d('dimmed'))
l(bd('bold'))
l(em('italic'))
```

<img src="./assets/minis.png" alt="Mini" height="250" width="auto" />

If no arguments are provided, the mini methods will return the ANSI code:

```ts
console.log(r() + 'red', y() + 'yellow', g() + 'green')
```

<img src="./assets/minis2.png" alt="Mini no args" height="175" width="auto" />

> [!NOTE]
> When no string is provided to a mini method, it won't be wrapped in a corresponding reset code.
> Use the clear method (`clr()`) to reset the styles yourself.

<br>

### `logger`

The `logger` function used by the mini methods is somewhat involved, so I decided to expose / document it.  It can be used to create your own custom logging functions that colorize input dynamically.

```ts
const err = logger({
	prefix: r('| '),
	printWidth: 20,
	fn: (...args: any[]) => {
		console.log(r('>'), r(bd('ERROR')))
		console.log(...args)
	},
})

err('Something went wrong:', { ok: false, cause: '¯\\_(ツ)_/¯' })
```

<img src="./assets/logger-custom.png" alt="Logger custom screenshot" height="200" width="auto" />

<br>

### `LogOptions`

The `logger` function accepts the following options:

<br>

#### `printWidth`

Controls the expansion of objects and arrays into multiline output.

> @default `60`

```ts
const l = logger({ printWidth: 50 })
l({ foo: true, bar: [1, 'two', { three: () => 3 }] })
```

<img src="./assets/logger-printwidth.png" alt="Logger printWidth screenshot" height="200" width="auto" />

> [!NOTE]
> Internally, `printWidth` is calculated somewhat roughly, so this option is generally a ballpark estimate.

<br>

#### `inline`

Forces inputs into either inline or multiline output.

> @default `undefined`

```ts
const l = logger({ inline: true })
l({ foo: true, bar: [1, 'two', { three: () => 3 }] })
```

<img src="./assets/logger-inline.png" alt="Logger inline screenshot" height="150" width="auto" />

Add `__inline__` to an object for a granular overrides.

```ts
l({
	one: 1,
	two: 2,
	nested: { __inline__: true, one: 1, two: 2, three: 3 },
})
```

<img src="./assets/logger-overrides-obj.png" alt="Logger object overrides screenshot" height="200" width="auto" />

For array overrides, use the strings `__inline__` and `__multiline__` to force inline or multiline output.

```ts
l([true, 1, 'two', () => 3, '__multiline__'])
```

<img src="./assets/logger-overrides-array.png" alt="Logger array overrides screenshot" height="250" width="auto" />

<br>

#### `delimiter`

The delimiter used between rest args.

> @default `' '`

```ts
const l = logger({ delimiter: c(' · ') })
l(true, 1, 'two', () => 3)
```

<img src="./assets/logger-delimiter.png" alt="Logger delimiter screenshot" height="150" width="auto" />

<br>

#### `prefix`

A prefix to prepend to each line (works with multiline output).

> @default `''`

```ts
const l = logger({ prefix: c('⌇ '), delimiter: '' })
l('# ', bd('Header'))
l()
l(d('<p>'), em('Hello, world!'), d('</p>'))
```

<img src="./assets/logger-prefix.png" alt="Logger prefix screenshot" height="190" width="auto" />

<br>

#### `fn`

A custom logger function.

> @default `console.log`

```ts
const l = logger({ fn: console.warn })
l('E-gad!')
```

<img src="./assets/logger-warn.png" alt="Logger warn screenshot" height="42" width="auto" />

<br>

### `paint()`

The `paint` function used by `logger` can be used directly to colorize arbitrary input:

```ts
console.log(
	paint(
		{
			num: 123,
			bool: true,
			str: 'foo',
			fn: () => 'bar',
		},
		{ inline: false }
	)
)
```

<img src="./assets/paint.png" alt="Paint screenshot" height="200" width="auto" />

### Why

NIH syndrome / copy-paste fatigue.

<br>

### License

MIT © [braebo](https://github.com/braebo)
