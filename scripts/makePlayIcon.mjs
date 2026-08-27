/**
 * Builds `store-assets/play-icon-512.png` — the icon Play shows beside the
 * listing and in search results.
 *
 * It is derived from `assets/icon.png`, the icon the app actually ships, and
 * nothing else. That sounds obvious; it is worth stating because
 * `scripts/make-assets.mjs` draws a *different* mark (the flat goat-head emblem
 * in `goatEmblem.mjs`) and has clearly not been run since the real illustrated
 * icon replaced it. Generating the store icon from that script would have put
 * an icon on the listing that no user ever sees on their phone.
 *
 * What this script guarantees, since Play rejects on all three:
 *  - exactly 512x512,
 *  - **no alpha channel** — flattened, whatever the source carries,
 *  - under 1MB.
 *
 * It also refuses to guess: if the source is not square, or carries
 * transparency, it says so, because both change how Play's own icon mask crops
 * the result.
 *
 * Run: node scripts/makePlayIcon.mjs
 */
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import sharp from "./loadSharp.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "assets", "icon.png");
const OUT = path.join(ROOT, "store-assets", "play-icon-512.png");

if (!fs.existsSync(SRC)) {
  throw new Error(
    `missing ${path.relative(ROOT, SRC)} — nothing to build from`,
  );
}

const src = await sharp(SRC).metadata();

if (src.width !== src.height) {
  console.warn(
    `  ! assets/icon.png is ${src.width}x${src.height}, not square. Play wants a ` +
      `full-bleed square; the resize below will letterbox it.`,
  );
}
if (src.hasAlpha) {
  console.warn(
    `  ! assets/icon.png carries an alpha channel. It is flattened onto white ` +
      `here — check the result, because Play applies its own rounded mask and ` +
      `an already-rounded source gets clipped twice.`,
  );
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });

await sharp(SRC)
  .resize(512, 512, { fit: "contain", background: "#FFFFFF" })
  // Strip alpha: it is one of the two most common icon rejection causes, and
  // Play draws the icon on its own background anyway.
  .flatten({ background: "#FFFFFF" })
  .png()
  .toFile(OUT);

const meta = await sharp(OUT).metadata();
const kb = (fs.statSync(OUT).size / 1024).toFixed(0);
console.log(
  `wrote store-assets/play-icon-512.png from assets/icon.png — ` +
    `${meta.width}x${meta.height}, ${meta.channels} channels (3 = no alpha), ` +
    `${kb}KB (Play limit 1MB)`,
);
