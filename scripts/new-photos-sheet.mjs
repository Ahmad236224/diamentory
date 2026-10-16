// Contact sheet of client-supplied photos (public/images/*.jpg, top level only).
import sharp from "sharp";
import { readdirSync } from "node:fs";
const dir = "public/images";
const files = readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
const W = 300, H = 400, cols = 6, rows = Math.ceil(files.length / cols);
const tiles = [];
for (const [i, f] of files.entries()) {
  const m = await sharp(`${dir}/${f}`).rotate().metadata();
  console.log(String(i + 1).padStart(2), f, `${m.autoOrient?.width ?? m.width}x${m.autoOrient?.height ?? m.height}`, (m.size ?? "") );
  const buf = await sharp(`${dir}/${f}`).rotate().resize(W, H, { fit: "contain", background: "#222" }).toBuffer();
  const label = Buffer.from(`<svg width="${W}" height="28"><rect width="100%" height="100%" fill="#000"/><text x="8" y="20" fill="#fff" font-size="18" font-family="Arial">${i + 1}</text></svg>`);
  tiles.push({ input: buf, left: (i % cols) * W, top: Math.floor(i / cols) * (H + 28) + 28 }, { input: label, left: (i % cols) * W, top: Math.floor(i / cols) * (H + 28) });
}
await sharp({ create: { width: cols * W, height: rows * (H + 28), channels: 3, background: "#111" } }).composite(tiles).jpeg({ quality: 82 }).toFile(process.argv[2]);
