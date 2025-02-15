
//#region src/ansi-hex.ts
const ANSI_STYLE_CODES = {
	reset: 0,
	bold: 1,
	dim: 2,
	italic: 3,
	underline: 4,
	inverse: 7,
	hidden: 8,
	strikethrough: 9
};
function ansiHex(hex_color) {
	return (...args) => {
		const str = args.join("");
		if (globalThis.navigator?.userAgent.match(/firefox|safari/i)) return str;
		const rgb = hexToRgb(hex_color);
		if (!rgb) return str;
		return `\x1b[38;2;${rgb[0]};${rgb[1]};${rgb[2]}m${str}\x1b[0m`;
	};
}
function ansiStyle(style) {
	if (globalThis.navigator?.userAgent.match(/firefox|safari/i)) return (...args) => args.join("");
	const code = ANSI_STYLE_CODES[style];
	const styleCode = `\x1b[${code}m`;
	const resetCode = code === 0 ? "" : code <= 2 ? "\x1B[22m" : `\x1b[2${code}m`;
	return (...args) => `${styleCode}${args.join("")}${resetCode}`;
}
function hexToRgb(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? [
		parseInt(result[1], 16),
		parseInt(result[2], 16),
		parseInt(result[3], 16)
	] : null;
}

//#endregion
//#region src/ansi-mini.ts
const r = ansiHex("#ff5347");
const g = ansiHex("#57ab57");
const b = ansiHex("#4c4ce0");
const y = ansiHex("#e2e270");
const m = ansiHex("#d426d4");
const c = ansiHex("#2fdede");
const o = ansiHex("#ff7f50");
const p = ansiHex("#9542e7");
const gr = ansiHex("#808080");
const d = ansiStyle("dim");
const bd = ansiStyle("bold");
const em = ansiStyle("italic");
const ul = ansiStyle("underline");
const inv = ansiStyle("inverse");
const s = ansiStyle("strikethrough");
function n(count = 1) {
	for (let i = 0; i < count; i++) log();
}
function l(...args) {
	log(args);
}
function err(...args) {
	log(args, {
		label: r(bd("ERROR ")),
		logger: console.error
	});
}

//#endregion
//#region src/ansi-logger.ts
function log(args = [], opts = {}) {
	const { label = "", logger = console.log, prefix = d("︙ "), delimiter = "", inline = true } = opts;
	if (args.length === 0) {
		label && logger(prefix + label);
		logger(prefix);
		return;
	}
	if (typeof args[0] === "string" && args.length === 1) {
		const lines = args[0].split("\n");
		for (let i = 0; i < lines.length; i++) {
			if (i === 0 && label) logger(prefix + label);
			logger(prefix + lines[i]);
		}
		return;
	}
	if (label) logger(prefix + label);
	try {
		const a = [];
		for (let i = 0; i < args.length; i++) switch (typeof args[i]) {
			case "object": {
				if (!args[i]) {
					a.push(d(args[i]));
					break;
				}
				const s$1 = paint_object(args[i], { inline });
				if (inline) a.push(s$1);
				else a.push(s$1.replaceAll("\n", "\n" + prefix));
				break;
			}
			case "number": {
				a.push(p(args[i]));
				break;
			}
			default: {
				a.push(args[i]);
				break;
			}
		}
		logger(prefix + a.join(delimiter));
	} catch (e) {
		console.error(e);
		console.log(args);
	}
	return;
}
/** Colors a primitive based on its type. */
function paint_primitive(v, opts = {}) {
	if (v === null) return d("null");
	if (v === undefined) return d("undefined");
	if (v === true || v === false) return y(v);
	switch (typeof v) {
		case "function":
			const s$1 = d(o(v.toString().replaceAll(/\n/g, "")));
			if (s$1.length < 75) return s$1;
			return d(o("[Function]"));
		case "number": return p(v);
		case "string": return d(g("\"")) + g(v) + d(g("\""));
		case "boolean": return v ? g("true") : r("false");
		case "object": return paint_object(v, opts);
		default: return v;
	}
}
/** Converts an object into a colorized string. */
function paint_object(v, opts = {}) {
	const { inline, indent = 1 } = opts;
	const nl = inline ? "" : "\n";
	const indentStr = inline ? "" : "  ".repeat(indent);
	let s$1 = "{ " + nl;
	const entries = Object.entries(v);
	for (let j = 0; j < entries.length; j++) {
		s$1 += indentStr + d(entries[j][0]);
		s$1 += ": ";
		s$1 += paint_primitive(entries[j][1], {
			inline,
			indent: indent + 1
		});
		if (j < entries.length - 1) s$1 += ", " + nl;
	}
	s$1 += nl;
	if (inline) s$1 += " ";
	s$1 += "}";
	return s$1;
}

//#endregion
//#region src/ansi-gradient.ts
function ansiGradient(...hexColors) {
	if (hexColors.length < 2) throw new Error("Gradient requires at least 2 colors");
	const rgbColors = hexColors.map((hex) => {
		const rgb = hexToRgb(hex);
		if (!rgb) throw new Error(`Invalid hex color: ${hex}`);
		return rgb;
	});
	return (position) => {
		position = Math.max(0, Math.min(1, position));
		const segment = position * (rgbColors.length - 1);
		const index = Math.floor(segment);
		const fraction = segment - index;
		if (index >= rgbColors.length - 1) {
			const [r$2, g$2, b$2] = rgbColors[rgbColors.length - 1];
			return `\x1b[38;2;${r$2};${g$2};${b$2}m`;
		}
		const start = rgbColors[index];
		const end = rgbColors[index + 1];
		const r$1 = Math.round(start[0] + (end[0] - start[0]) * fraction);
		const g$1 = Math.round(start[1] + (end[1] - start[1]) * fraction);
		const b$1 = Math.round(start[2] + (end[2] - start[2]) * fraction);
		return `\x1b[38;2;${r$1};${g$1};${b$1}m`;
	};
}

//#endregion
export { ansiGradient, ansiHex, ansiStyle, b, bd, c, d, em, err, g, gr, hexToRgb, inv, l, log, m, n, o, p, r, s, ul, y };
//# sourceMappingURL=index.js.map