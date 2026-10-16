// Combine viewport screenshots for a size into one contact sheet. node sheet.mjs <shotsDir> <size> <out> [cols]
import sharp from "sharp";
import { readdirSync } from "node:fs";
const [, , dir, size, out, colsArg] = process.argv;
const files = readdirSync(dir).filter((f) => f.startsWith(size + "-") && !f.includes("-full")).sort();
const metas = await Promise.all(files.map((f) => sharp(`${dir}/${f}`).metadata()));
const W = metas[0].width, H = metas[0].height, cols = +(colsArg || files.length), rows = Math.ceil(files.length / cols), gap = 12;
const tiles = files.map((f, i) => ({ input: `${dir}/${f}`, left: (i % cols) * (W + gap), top: Math.floor(i / cols) * (H + gap) }));
await sharp({ create: { width: cols * (W + gap), height: rows * (H + gap), channels: 3, background: "#888" } }).composite(tiles).png().toFile(out);
console.log(files.map((f) => f.replace(size + "-", "")).join(" | "));
