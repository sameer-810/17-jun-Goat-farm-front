/**
 * Builds the Google Play feature graphic (1024x500) from real app captures in
 * `store-assets/raw-screens/`.
 *
 * Hard rules from Play's spec:
 *  - Exactly 1024x500, JPEG or 24-bit PNG, **no alpha channel**. Alpha is one
 *    of the two most common rejection causes, so the output is flattened
 *    before it is written.
 *  - Keep everything that matters inside the centre 860x480, with a 70-80px
 *    buffer from every edge — Play crops this image differently per surface.
 *  - If a promo video is ever attached, Play renders a 96x96 play button dead
 *    centre (x 464-560, y 202-298). That band is left empty, so adding a video
 *    later cannot cover the headline.
 *
 * Design rules from ASO research:
 *  - A clean app-UI crop with one benefit-led message beats a stock photo.
 *  - The graphic should match the screenshots and short description, not look
 *    like a disconnected ad banner — hence the same forest background, the same
 *    type, and a headline from the same family as screenshot 01.
 *  - Five to seven words maximum. This uses four.
 *  - No store badges, no "Download now", no price or ranking claims; those get
 *    listings rejected.
 *  - Don't repeat the app icon here: Play already shows it beside this image.
 *
 * Run: node scripts/makeFeatureGraphic.mjs [--guides]
 *   --guides writes a separate copy with the safe zone (green) and play-button
 *   dead zone (red) drawn on top, for checking placement.
 */
import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import sharp from "./loadSharp.mjs";
import { BRAND } from "./goatEmblem.mjs";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RAW = path.join(ROOT, "store-assets", "raw-screens");
const SHOW_GUIDES = process.argv.includes("--guides");
const OUT = path.join(
  ROOT,
  "store-assets",
  SHOW_GUIDES ? "feature-graphic-GUIDES.png" : "feature-graphic-1024x500.png",
);

const im = (n) =>
  "data:image/png;base64," +
  fs.readFileSync(path.join(RAW, n + ".png")).toString("base64");

/** The app's own faces, embedded — see makeStoreScreenshots.mjs. */
const font = (file, family, weight) => {
  const p = path.join(ROOT, "assets", "fonts", file);
  if (!fs.existsSync(p)) return "";
  const data = fs.readFileSync(p).toString("base64");
  return `@font-face{font-family:"${family}";font-weight:${weight};font-display:block;
    src:url(data:font/ttf;base64,${data}) format("truetype")}`;
};

const FONTS =
  font("SpaceGrotesk_700Bold.ttf", "Space Grotesk", 700) +
  font("Inter_400Regular.ttf", "Inter", 400) +
  font("Inter_600SemiBold.ttf", "Inter", 600);

const html = `<style>${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1024px;height:500px;overflow:hidden;position:relative;
  font-family:"Inter",-apple-system,"Segoe UI",Roboto,sans-serif;
  background:linear-gradient(165deg,${BRAND.FOREST_DEEP} 0%,#1C4726 54%,${BRAND.FOREST} 100%)}
.glow{position:absolute;right:-200px;top:-240px;width:860px;height:860px;border-radius:50%;
  background:radial-gradient(circle,rgba(194,104,59,.32) 0%,rgba(194,104,59,0) 68%)}
/* Text block sits entirely left of the play-button dead zone (x 464). */
.copy{position:absolute;left:82px;top:0;height:500px;width:378px;z-index:5;
  display:flex;flex-direction:column;justify-content:center}
.eyebrow{display:flex;align-items:center;gap:11px;margin-bottom:18px}
.eyebrow i{width:24px;height:2px;background:${BRAND.CLAY};display:block}
.eyebrow span{font-size:18px;font-weight:600;letter-spacing:4.2px;
  color:${BRAND.CLAY_LIGHT};text-transform:uppercase}
h1{font-family:"Space Grotesk","Segoe UI",sans-serif;font-size:56px;line-height:1.06;
  font-weight:700;letter-spacing:-1.6px;color:${BRAND.CREAM}}
.rule{width:52px;height:3px;background:${BRAND.CLAY};border-radius:2px;margin:20px 0 16px}
p{font-size:20px;line-height:1.35;color:rgba(244,238,225,.80)}
/* Two phones: the front one carries the message, the one behind hints at depth
   without adding a second message. Both bleed off the bottom edge. */
.ph{position:absolute;border-radius:34px;padding:7px;overflow:hidden;
  background:linear-gradient(150deg,#3A3A3C,#1C1C1E 45%,#48484A)}
.ph .s{width:100%;height:100%;border-radius:28px;overflow:hidden;background:#000}
.ph img{width:100%;display:block}
.front{right:210px;top:60px;width:238px;height:520px;z-index:3;
  box-shadow:0 34px 74px rgba(4,20,10,.58)}
.back{right:60px;top:104px;width:206px;height:450px;z-index:2;opacity:.96;
  box-shadow:0 26px 56px rgba(4,20,10,.48)}
.safe{position:absolute;left:82px;top:10px;width:860px;height:480px;outline:2px dashed rgba(0,255,180,.9);z-index:9}
.dead{position:absolute;left:464px;top:202px;width:96px;height:96px;z-index:9;
  outline:2px dashed rgba(255,70,70,1);background:rgba(255,70,70,.18)}
</style>
<div class="glow"></div>
<!-- Behind: a goat's own profile — the QR-tagged record that is the reason to
     use this over a notebook, so it earns the second slot over the task list. -->
<div class="ph back"><div class="s"><img src="${im("goatProfile")}"></div></div>
<div class="ph front"><div class="s"><img src="${im("dashboard")}"></div></div>
<div class="copy">
  <div class="eyebrow"><i></i><span>Rashtrafarm</span></div>
  <!-- Two lines, and each must fit the 382px between the left margin (82) and
       the play-button dead zone (464). At 56px Space Grotesk that is about ten
       characters a line — "Your whole farm," does not fit and silently wraps to
       three, which crowds the device. -->
  <h1>Run your<br>whole farm</h1>
  <div class="rule"></div>
  <p>Goats · Tasks · Health · Money</p>
</div>
${SHOW_GUIDES ? '<div class="safe"></div><div class="dead"></div>' : ""}`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1024, height: 500 },
  deviceScaleFactor: 1,
});
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(350);
const buf = await page.screenshot();
await browser.close();

// Flatten — Play rejects PNGs carrying an alpha channel.
await sharp(buf).flatten({ background: BRAND.FOREST_DEEP }).png().toFile(OUT);
const meta = await sharp(OUT).metadata();
const kb = (fs.statSync(OUT).size / 1024).toFixed(0);
console.log(
  `wrote ${path.relative(ROOT, OUT)} — ${meta.width}x${meta.height}, ` +
    `${meta.channels} channels (needs 3), ${kb}KB`,
);
