// Download a generated image URL and save it as a resized WebP.
// Usage: node scripts/fetch-image.js <url> <outPath> <width> <height>
const https = require("https");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const [, , url, outPath, wStr, hStr] = process.argv;
if (!url || !outPath) {
  console.error("Usage: node scripts/fetch-image.js <url> <outPath> <width> <height>");
  process.exit(1);
}
const width = parseInt(wStr || "1600", 10);
const height = parseInt(hStr || "900", 10);

function download(u) {
  return new Promise((resolve, reject) => {
    https
      .get(u, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return resolve(download(res.headers.location));
        }
        if (res.statusCode !== 200) return reject(new Error("HTTP " + res.statusCode));
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
}

(async () => {
  const buf = await download(url);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await sharp(buf)
    .resize(width, height, { fit: "cover", position: "attention" })
    .webp({ quality: 82 })
    .toFile(outPath);
  const kb = Math.round(fs.statSync(outPath).size / 1024);
  console.log(`wrote ${outPath} (${width}x${height}, ${kb} KB)`);
})().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
