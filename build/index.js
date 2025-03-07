
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
const isFirefox = () => globalThis.navigator?.userAgent.indexOf("Firefox/") !== -1 && globalThis.navigator?.userAgent.indexOf("Seamonkey") === -1;
const isSafari = () => globalThis.navigator?.userAgent.indexOf("Safari") !== -1 && globalThis.navigator?.userAgent.indexOf("Chrome") === -1;
function ansiHex(hex_color) {
	return (...args) => {
		const str = args.join("");
		if (isFirefox() || isSafari()) return str;
		const rgb = hexToRgb(hex_color);
		if (!rgb) return str;
		return `\x1b[38;2;${rgb[0]};${rgb[1]};${rgb[2]}m${str}\x1b[0m`;
	};
}
function ansiStyle(style) {
	if (isFirefox() || isSafari()) return (...args) => args.join("");
	const code = ANSI_STYLE_CODES[style];
	const styleCode = `\x1b[${code}m`;
	const resetCode = code === 0 ? "" : code <= 2 ? "\x1B[22m" : `\x1b[2${code}m`;
	return (...args) => {
		const str = args.join("");
		if (str.length === 0) return styleCode;
		return `${styleCode}${str}${resetCode}`;
	};
}
function hexToRgb(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? [
		parseInt(result[1], 16),
		parseInt(result[2], 16),
		parseInt(result[3], 16)
	] : null;
}
const CLEAR = "\x1B[0m";

//#endregion
//#region src/ansi-logger.ts
function log(args = [], opts = {}) {
	opts.fn ??= console.log;
	opts.prefix ??= "";
	opts.delimiter ??= " ";
	if (!Array.isArray(args)) args = [args];
	if (args.length === 0) {
		opts.fn(opts.prefix);
		return;
	}
	if (typeof args[0] === "string" && args.length === 1) {
		const lines = args[0].split("\n");
		for (let i = 0; i < lines.length; i++) opts.fn(opts.prefix + lines[i]);
		return;
	}
	try {
		const a = [];
		for (let i = 0; i < args.length; i++) a.push(paint(args[i], opts));
		opts.fn(opts.prefix + a.join(opts.delimiter));
	} catch (e) {
		console.error(e);
		console.log(args);
	}
	return;
}
function logger(opts) {
	return (...args) => log(args, opts);
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
const clr = ansiStyle("reset");
function n(count$1 = 1) {
	for (let i = 0; i < count$1; i++) log();
}
function l(...args) {
	log(args);
}
function err(...args) {
	log(r(bd("ERROR ")), { fn: console.error });
	log(args, { fn: console.error });
}

//#endregion
//#region src/ansi-paint.ts
function paint(v, opts = {}) {
	const options = {
		prefix: "",
		printWidth: 60,
		indent: 1,
		...opts
	};
	return paint_primitive(v, options);
}
/**
* Colors a primitive based on its type.
*/
function paint_primitive(v, opts) {
	if (v === null) return d("null");
	if (v === undefined) return d("undefined");
	if (v === true || v === false) return y(v);
	switch (typeof v) {
		case "function":
			const s$1 = o(v.toString().replaceAll(/\n/g, ""));
			if (s$1.length < opts.printWidth) return s$1;
			return o("[Function]");
		case "number": return p(v);
		case "string": return opts.wrapString ? d(g(`'`)) + g(v) + d(g(`'`)) : v;
		case "boolean": return v ? g("true") : r("false");
		case "object": return paint_object(v, opts);
		default: return v;
	}
}
/**
* Converts an object into a colorized string.
*/
function paint_object(v, opts) {
	if (!v || typeof v !== "object") return paint_primitive(v, opts);
	let { inline, indent } = opts;
	opts.wrapString ??= true;
	const keys = Array.isArray(v) ? v : Object.keys(v);
	for (let i = 0; i < keys.length; i++) if (keys[i] === "__inline__") inline = v["__inline__"] ?? true;
	else if (keys[i] === "__multiline__") inline = v["__multiline__"] ?? false;
	if (typeof inline === "undefined") {
		if (count(v) <= opts.printWidth) inline = true;
	}
	if (Array.isArray(v)) {
		let s$2 = "";
		s$2 += "[";
		for (let i = 0; i < v.length; i++) {
			if (v[i] === "__inline__" || v[i] === "__multiline__") {
				if (i === v.length - 1) {
					const end = s$2.slice(-2);
					if (end === ", ") s$2 = s$2.slice(0, -2);
				}
				continue;
			}
			const nl$1 = inline ? "" : "\n" + opts.prefix + "  ".repeat(indent);
			s$2 += nl$1;
			s$2 += paint_primitive(v[i], {
				...opts,
				indent: indent + 1,
				inline
			});
			if (i < v.length - 1) s$2 += ", ";
		}
		s$2 += inline ? "" : "\n" + opts.prefix + "  ".repeat(indent - 1);
		s$2 += "]";
		return s$2;
	}
	if (typeof inline === "undefined") inline = count(v) <= opts.printWidth;
	const nl = inline ? "" : "\n";
	const indentStr = inline ? "" : "  ".repeat(indent);
	const prefix = inline ? "" : opts.prefix;
	const parentIndentStr = inline ? "" : "  ".repeat(indent - 1);
	let s$1 = "{ " + nl;
	const entries = Object.entries(v);
	for (let j = 0; j < entries.length; j++) {
		if (entries[j][0] === "__inline__") {
			if (j === entries.length - 1) {
				const end = s$1.slice(-2);
				if (end === ", ") s$1 = s$1.slice(0, -2);
			}
			continue;
		}
		s$1 += prefix;
		s$1 += indentStr + d(entries[j][0]);
		s$1 += ": ";
		s$1 += paint_primitive(entries[j][1], {
			...opts,
			indent: indent + 1,
			wrapString: true
		});
		if (j < entries.length - 1) {
			s$1 += ", ";
			s$1 += nl;
		}
	}
	s$1 += nl;
	if (inline) s$1 += " ";
	s$1 += prefix;
	s$1 += parentIndentStr + "}";
	return s$1;
}
/**
* Estimates the length of the stringified object / array.
*/
function count(v, n$1 = v.length) {
	if (!Array.isArray(v)) return count(Object.entries(v).flatMap(([k, v$1]) => [k, v$1]), n$1);
	for (let i = 0; i < v.length; i++) if (typeof v[i] === "object") if (Array.isArray(v[i])) n$1 += count(v[i], n$1);
	else n$1 += count(Object.values(v[i]), n$1);
	else n$1 += JSON.stringify(v[i])?.length ?? 0;
	return n$1;
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
	return (_) => {
		if (typeof _ === "string") return gradientText(_, interpolate);
		return interpolate(_);
		function interpolate(stop) {
			stop = Math.max(0, Math.min(1, stop));
			const segment = stop * (rgbColors.length - 1);
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
		}
	};
}
function gradientText(text, gradient) {
	let arr = [...text];
	for (let i = 0; i < arr.length; i++) arr[i] = gradient(i / (arr.length - 1)) + arr[i];
	return arr.join("") + `\x1b[0m`;
}

//#endregion
export { CLEAR, ansiGradient, ansiHex, ansiStyle, b, bd, c, clr, d, em, err, g, gr, hexToRgb, inv, l, log, logger, m, n, o, p, paint, r, s, ul, y };
//# sourceMappingURL=index.js.map