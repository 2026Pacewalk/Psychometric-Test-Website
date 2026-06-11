const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const pub = path.join(__dirname, "..", "public");
const svg = fs.readFileSync(path.join(pub, "logo.svg"));

const targets = [
  { file: "logo.png", size: 512 },
  { file: "icon-512.png", size: 512 },
  { file: "icon-192.png", size: 192 },
  { file: "apple-touch-icon.png", size: 180 },
  { file: "favicon-32.png", size: 32 },
];

(async () => {
  for (const t of targets) {
    await sharp(svg, { density: 384 })
      .resize(t.size, t.size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(pub, t.file));
    console.log("wrote", t.file, t.size + "px");
  }
})();
