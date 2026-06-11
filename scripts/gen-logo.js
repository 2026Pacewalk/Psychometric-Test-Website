const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const pub = path.join(root, "public");

// Source = the real brand logo placed at the project root.
const src = path.join(root, "logo.png");
if (!fs.existsSync(src)) {
  console.error("Source logo missing:", src);
  process.exit(1);
}

const targets = [
  { file: "logo.png", size: 512 },
  { file: "icon-512.png", size: 512 },
  { file: "icon-192.png", size: 192 },
  { file: "apple-touch-icon.png", size: 180 },
  { file: "favicon-32.png", size: 32 },
];

(async () => {
  for (const t of targets) {
    await sharp(src)
      .resize(t.size, t.size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(pub, t.file));
    console.log("wrote", t.file, t.size + "px");
  }
})();
