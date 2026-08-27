/**
 * Generates branded app assets (goat-head emblem on the earthy farm theme).
 * Run from goat-front: node scripts/make-assets.mjs
 *
 * The emblem itself lives in scripts/goatEmblem.mjs so the Play Store icon
 * (scripts/makePlayIcon.mjs) draws the same mark from the same source.
 */
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import sharp from "./loadSharp.mjs";
import { goatEmblem, BRAND } from "./goatEmblem.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(__dirname, "../assets");
fs.mkdirSync(assetsDir, { recursive: true });

const { FOREST, FOREST_DARK, CREAM, CLAY } = BRAND;

function roundedBgIcon() {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${FOREST}"/>
        <stop offset="1" stop-color="${FOREST_DARK}"/>
      </linearGradient>
    </defs>
    <rect width="1024" height="1024" rx="224" fill="url(#g)"/>
    <circle cx="512" cy="512" r="372" fill="#ffffff" opacity="0.05"/>
    <g transform="translate(512 520) scale(1.32) translate(-256 -256)">
      ${goatEmblem({})}
    </g>
  </svg>`;
}

function adaptiveForeground() {
  // Android adds the green background (app.json adaptiveIcon.backgroundColor);
  // keep the goat within the safe centre on a transparent canvas.
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    <g transform="translate(512 512) scale(1.05) translate(-256 -256)">
      ${goatEmblem({})}
    </g>
  </svg>`;
}

function splash() {
  // Splash background is dark green (app.json); cream goat + wordmark, transparent.
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    <g transform="translate(512 430) scale(1.15) translate(-256 -256)">
      ${goatEmblem({})}
    </g>
    <text x="512" y="800" text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
      font-size="84" font-weight="700" fill="${CREAM}" letter-spacing="2">Goat Farm</text>
    <text x="512" y="872" text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
      font-size="40" font-weight="500" fill="${CLAY}" letter-spacing="6">MANAGER</text>
  </svg>`;
}

function favicon() {
  // Same 512 coordinate space as the emblem; sharp resizes down to 256.
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <rect width="512" height="512" rx="112" fill="${FOREST_DARK}"/>
    <g transform="translate(256 268) scale(0.92) translate(-256 -256)">
      ${goatEmblem({})}
    </g>
  </svg>`;
}

async function render(svg, file, size) {
  const out = path.join(assetsDir, file);
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(out);
  console.log("wrote", file, `${size}x${size}`);
}

await render(roundedBgIcon(), "icon.png", 1024);
await render(adaptiveForeground(), "adaptive-icon.png", 1024);
await render(splash(), "splash-icon.png", 1024);
await render(favicon(), "favicon.png", 256);
console.log("done");
