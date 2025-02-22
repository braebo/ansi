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

// Wrap a string in the gradient.
console.log(g('Simple gradient text.'))
```

<img src="./assets/4.png" alt="Gradient" height="150" width="auto" />

Pass a number to get a color stop:

```ts
const fade = `
${g(0.5)}■■■■■■■■■■■■
${g(0.0)}■■■■■■■■■■■■
${g(0.9)}■■■■■■■■■■■■
${CLEAR}`

console.log(fade)
```

<img src="./assets/6.png" alt="Gradient" height="175" width="auto" />

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

<br>

### Advanced

Custom logging functions with support for labels, prefixes, and better object formatting can be created with `log`:

```typescript
import { log, r, bd } from '@braebo/ansi'
export const err = (...args: unknown[]) => log(args, { label: r(bd('ERROR')) })
```

Which is how the mini `err` method uses it:

```typescript
import { err } from '@braebo/ansi'
err('Something went wrong!')
```

<br>

### Browser Compatibility

The package automatically detects unsupported browsers (Safari, Firefox) and falls back to plain text output. Full color support is available in Chrome/Chromium-based browsers and Node.js environments.

<br>

### Why

NIH syndrome / copy-paste fatigue.

<br>

## License

MIT © [braebo](https://github.com/braebo)
