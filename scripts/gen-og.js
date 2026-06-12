// Generate a default 1200x630 Open Graph share image: navy gradient + centred logo.
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const pub = path.join(__dirname, "..", "public");
const out = path.join(pub, "og-default.png");

const bg = Buffer.from(
  `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
     <defs>
       <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
         <stop offset="0" stop-color="#6729ff"/>
         <stop offset="0.6" stop-color="#4a1cb8"/>
         <stop offset="1" stop-color="#23105a"/>
       </linearGradient>
     </defs>
     <rect width="1200" height="630" fill="url(#g)"/>
     <rect x="0" y="624" width="1200" height="6" fill="#0ad652"/>
   </svg>`
);

(async () => {
  const logo = await sharp(path.join(pub, "logo.png")).resize(300, 300, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  await sharp(bg)
    .composite([{ input: logo, top: 165, left: 450 }])
    .png()
    .toFile(out);
  console.log("wrote", out, Math.round(fs.statSync(out).size / 1024) + " KB");
})();
