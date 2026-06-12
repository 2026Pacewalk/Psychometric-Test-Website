// Generate WhatsApp/Facebook-friendly PNG OG images (1200x630) from each
// featured.webp in /public/blog/* and /public/locations/*.
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const pub = path.join(__dirname, "..", "public");

async function run(group) {
  const base = path.join(pub, group);
  if (!fs.existsSync(base)) return 0;
  let n = 0;
  for (const slug of fs.readdirSync(base)) {
    const src = path.join(base, slug, "featured.webp");
    if (!fs.existsSync(src)) continue;
    const out = path.join(base, slug, "og.png");
    await sharp(src).resize(1200, 630, { fit: "cover", position: "attention" }).png().toFile(out);
    n++;
  }
  return n;
}

(async () => {
  const a = await run("blog");
  const b = await run("locations");
  console.log(`wrote ${a} blog og.png + ${b} location og.png`);
})();
