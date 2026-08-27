/**
 * Composes the Play Store screenshots from the real captures in
 * `store-assets/raw-screens/` and `store-assets/raw-screens-tablet/`.
 *
 * Design targets come from published ASO research, not taste:
 *  - The headline must be readable at ~200px wide (the search-results
 *    thumbnail), because most users decide there and never open the listing.
 *    That sets the headline at ~88px on a 1080px canvas.
 *  - Headline in the top third — that is where the eye lands first.
 *  - Captions <= 6 words, one message per screenshot.
 *  - The phone is NEVER scaled horizontally. Cropping the UI's left/right
 *    edges makes a real screenshot look like a broken one; framing is done by
 *    sliding the screen vertically instead (`offset`).
 *  - Realistic data, never empty states (see captureStoreScreens.mjs).
 *  - Identical background, type and palette across all of them, for recall.
 *
 * Run: node scripts/makeStoreScreenshots.mjs
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

/**
 * One target per Play Console screenshot slot. Play accepts 320-3840px per
 * side with the longest side no more than twice the shortest, JPEG or 24-bit
 * PNG (no alpha), max 8MB.
 *
 * The tablet sets are composed from the app's real tablet capture, not from an
 * enlarged phone frame — Play explicitly warns against those.
 */
const TARGETS = {
  phone: { w: 1080, h: 1920, raw: "raw-screens", out: "screenshots", scale: 1 },
  tab7: {
    w: 1200,
    h: 1920,
    raw: "raw-screens-tablet",
    out: "screenshots-tablet7",
    scale: 1,
  },
  tab10: {
    w: 1600,
    h: 2560,
    raw: "raw-screens-tablet",
    out: "screenshots-tablet10",
    scale: 1.333,
  },
};

/**
 * Order matters — Play shows the first 3-4 in the listing row and the first one
 * appears in search results, so the broadest-appeal screens lead. Eight is the
 * Play maximum per device type.
 *
 * `offset` slides the screen vertically inside the phone (0 = top, 1 = bottom)
 * to frame that screen's hero element.
 *
 * Headlines say only what the screen actually shows. A listing that
 * overpromises earns refunds and one-star reviews.
 */
const SHOTS = [
  {
    src: "dashboard",
    title: "Your whole farm,\none screen",
    sub: "Herd, tasks and money at a glance",
    offset: 0,
  },
  {
    src: "goats",
    title: "Every goat\non one list",
    sub: "Breed, age, weight and health",
    offset: 0,
  },
  // The differentiator: each goat carries a QR ear tag, so its whole history
  // is one scan away. That earns the third slot.
  {
    src: "goatProfile",
    title: "One tag,\nthe whole history",
    sub: "Scan a goat, see everything about it",
    offset: 0,
  },
  {
    src: "tasks",
    title: "Assign the work,\nsee it done",
    sub: "Workers submit proof, you approve",
    offset: 0,
  },
  {
    src: "health",
    title: "Never miss\na vaccination",
    sub: "Treatments and due dates on record",
    offset: 0,
  },
  {
    src: "inventory",
    title: "Feed and medicine,\ncounted",
    sub: "Low stock flagged before it runs out",
    offset: 0,
  },
  {
    src: "finance",
    title: "Every rupee\nin and out",
    sub: "Sales, feed, salaries and profit",
    offset: 0,
  },
  // Breadth close — the feature nobody else in this bracket has.
  {
    src: "billing",
    title: "Bill clients\nfor their goats",
    sub: "Ad Pali packages, invoiced monthly",
    offset: 0,
  },
];

const b64 = (f) =>
  "data:image/png;base64," + fs.readFileSync(f).toString("base64");

/**
 * The app's own two faces, embedded from `assets/fonts` so the listing is set
 * in the same type as the product: Space Grotesk for display, Inter for body.
 * Without this the composer silently falls back to Segoe UI and the
 * screenshots stop looking like the app.
 */
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

/**
 * Deep forest green (#12341F -> #2F6B3C) with the clay accent (#C2683B).
 *
 * These are the app icon's own colours, so the icon Play draws beside the
 * screenshots belongs to the same picture. Dark on purpose: the app's UI is
 * warm cream and near-white, and on a pale background the device would float
 * with nothing to separate it. Green also says "farm" before a word is read,
 * which is most of the work a search-results thumbnail has to do.
 */
const css = (T) => `${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
body{width:${T.w}px;height:${T.h}px;overflow:hidden;position:relative;
  font-family:"Inter",-apple-system,"Segoe UI",Roboto,sans-serif;
  background:linear-gradient(168deg,${BRAND.FOREST_DEEP} 0%,#1C4726 52%,${BRAND.FOREST} 100%)}
/* Warm clay light top-right, deep shade bottom-left — stops the gradient
   reading as flat and gives the device something to sit against. */
.glow{position:absolute;top:-430px;right:-340px;width:1240px;height:1240px;border-radius:50%;
  background:radial-gradient(circle,rgba(194,104,59,.30) 0%,rgba(194,104,59,0) 66%)}
.glow2{position:absolute;bottom:-540px;left:-360px;width:1040px;height:1040px;border-radius:50%;
  background:radial-gradient(circle,rgba(8,26,14,.60) 0%,rgba(8,26,14,0) 70%)}
.wrap{position:relative;height:100%;display:flex;flex-direction:column;align-items:center;
  padding:${86 * T.scale}px ${60 * T.scale}px 0}
.eyebrow{display:flex;align-items:center;gap:${13 * T.scale}px;margin-bottom:${24 * T.scale}px}
.eyebrow i{width:${26 * T.scale}px;height:2px;background:${BRAND.CLAY};display:block;opacity:.9}
.eyebrow span{font-family:"Inter";font-size:${20 * T.scale}px;font-weight:600;
  letter-spacing:${4.6 * T.scale}px;color:${BRAND.CLAY_LIGHT};text-transform:uppercase}
/* 88px is the floor for staying legible at the 200px search thumbnail. Space
   Grotesk with negative tracking is the app's own display face. */
h1{font-family:"Space Grotesk","Segoe UI",sans-serif;font-size:${88 * T.scale}px;line-height:1.06;
  font-weight:700;letter-spacing:${-2.4 * T.scale}px;color:${BRAND.CREAM};
  text-align:center;white-space:pre-line}
p{margin-top:${22 * T.scale}px;font-size:${35 * T.scale}px;line-height:1.4;font-weight:400;
  color:rgba(244,238,225,.76);text-align:center}
/* A real phone body, not a bare rounded rectangle. An unframed export is the
   mark of a listing nobody has revisited, and the dark bezel gives the app's
   cream UI a hard edge against the green. Bleeds off the bottom: depth, not a
   floating rectangle. */
.device{margin-top:${52 * T.scale}px;width:${T.dw}px;height:${T.dh}px;border-radius:${T.radius}px;
  padding:${13 * T.scale}px;position:relative;
  background:linear-gradient(150deg,#3A3A3C,#1C1C1E 45%,#48484A);
  box-shadow:0 55px 120px rgba(4,20,10,.62),0 8px 24px rgba(0,0,0,.38)}
.screen{width:100%;height:100%;border-radius:${T.radius - 12}px;overflow:hidden;background:#000}
.screen img{width:100%;display:block;margin-top:var(--y)}
.btn{position:absolute;right:${-4 * T.scale}px;width:${5 * T.scale}px;background:#2C2C2E;border-radius:3px}
.b1{top:${300 * T.scale}px;height:${60 * T.scale}px}
.b2{top:${400 * T.scale}px;height:${110 * T.scale}px}
.b3{top:${530 * T.scale}px;height:${110 * T.scale}px}
`;

const stage = (s, T) => {
  // Screen height inside the bezel vs the source image's natural height at that
  // width — the difference is how far the screen can slide.
  const screenW = T.dw - 2 * 13 * T.scale;
  const natural = screenW * (T.srcH / T.srcW);
  const y = Math.round(-(natural - (T.dh - 2 * 13 * T.scale)) * s.offset);
  return `<div class="device">
    <div class="screen"><img style="--y:${y}px" src="${b64(path.join(T.rawDir, s.src + ".png"))}"></div>
    <i class="btn b1"></i><i class="btn b2"></i><i class="btn b3"></i>
  </div>`;
};

const html = (s, T) => `<style>${css(T)}</style>
<div class="glow"></div><div class="glow2"></div>
<div class="wrap">
  <div class="eyebrow"><i></i><span>Fatima Goat Farm</span><i></i></div>
  <h1>${s.title}</h1>
  <p>${s.sub}</p>
  ${stage(s, T)}
</div>`;

const browser = await chromium.launch();

for (const [key, t] of Object.entries(TARGETS)) {
  const rawDir = path.join(ROOT, "store-assets", t.raw);
  const outDir = path.join(ROOT, "store-assets", t.out);
  if (!fs.existsSync(rawDir)) {
    console.log(`skip ${key} — no ${t.raw}/`);
    continue;
  }
  fs.mkdirSync(outDir, { recursive: true });

  // Source captures differ per target (phone 1170x2532, tablet 1600x2560), so
  // the device body is sized from the real aspect ratio rather than hard-coded.
  const probeSrc = SHOTS.map((s) => path.join(rawDir, s.src + ".png")).find(
    (f) => fs.existsSync(f),
  );
  if (!probeSrc) {
    console.log(`skip ${key} — ${t.raw}/ has none of the listed screens`);
    continue;
  }
  const probe = await sharp(probeSrc).metadata();
  const T = {
    ...t,
    rawDir,
    srcW: probe.width,
    srcH: probe.height,
    radius: Math.round(70 * t.scale),
  };
  T.dw = Math.round(t.w * 0.73);
  const pad = 13 * t.scale;
  const screenW = T.dw - 2 * pad;
  const naturalH = screenW * (T.srcH / T.srcW);
  // Phone captures are taller than the frame, so the screen crops and the body
  // bleeds off the bottom edge. Tablet captures are shorter — cap the body at
  // the image's own height so no black gap shows inside the bezel.
  T.dh = Math.round(Math.min(t.h * 0.822, naturalH + 2 * pad));

  const page = await browser.newPage({
    viewport: { width: t.w, height: t.h },
    deviceScaleFactor: 1,
  });
  let i = 1;
  for (const s of SHOTS) {
    const f = path.join(rawDir, s.src + ".png");
    if (!fs.existsSync(f)) {
      console.log("skip (no source)", key, s.src);
      continue;
    }
    await page.setContent(html(s, T), { waitUntil: "load" });
    // Give the embedded fonts a moment; a shot taken mid-swap is set in the
    // fallback face and looks like a different listing.
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(350);
    const buf = await page.screenshot();
    const out = path.join(
      outDir,
      String(i).padStart(2, "0") + "-" + s.src + ".png",
    );
    // Flatten: Play rejects screenshots carrying an alpha channel, and a
    // Playwright PNG keeps one even when nothing is transparent.
    await sharp(buf)
      .flatten({ background: BRAND.FOREST_DEEP })
      .png()
      .toFile(out);
    i++;
  }
  await page.close();
  console.log(
    `${key}: ${i - 1} written to store-assets/${t.out}/ (${t.w}x${t.h})`,
  );
}
await browser.close();
