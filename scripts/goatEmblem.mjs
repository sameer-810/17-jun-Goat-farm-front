/**
 * The Rashtrafarm brand mark, as SVG.
 *
 * Single source of truth for the emblem: `make-assets.mjs` builds the in-app
 * icons from it and `makePlayIcon.mjs` builds the Play Store icon from it, so
 * the store listing and the installed app can never drift apart.
 *
 * Designed in a 512x512 box, centred on roughly (256, 250).
 */

/** Icon palette. Forest + clay + cream — the shipped brand mark's colours. */
export const BRAND = {
  FOREST: "#2F6B3C",
  FOREST_DARK: "#1C4726",
  /** Deepest forest — the top of the store-asset background gradient. */
  FOREST_DEEP: "#12341F",
  INK: "#0A1E10",
  CREAM: "#F4EEE1",
  /** The design system's accent (`palette.amber[500]`). */
  CLAY: "#C2683B",
  /** A lighter clay for small type on dark green (`palette.amber[300]`). */
  CLAY_LIGHT: "#DB9170",
};

/**
 * @param {object} [o]
 * @param {string} [o.fill]   face, ears and beard
 * @param {string} [o.accent] horns and snout shading
 * @param {string} [o.eye]    eyes and nostrils
 * @param {number} [o.scale]  shrinks the mark toward the centre of the 512 box
 */
export function goatEmblem({
  fill = BRAND.CREAM,
  accent = BRAND.CLAY,
  eye = BRAND.INK,
  scale = 1,
} = {}) {
  return `
  <g transform="translate(256 256) scale(${scale}) translate(-256 -256)">
    <!-- horns -->
    <path fill="${accent}" d="M232 150 C200 120 168 96 118 84 C150 66 198 76 232 108 C246 120 248 138 242 158 Z"/>
    <path fill="${accent}" d="M280 150 C312 120 344 96 394 84 C362 66 314 76 280 108 C266 120 264 138 270 158 Z"/>
    <!-- ears -->
    <path fill="${fill}" d="M198 228 C150 214 110 226 88 258 C118 268 168 260 200 242 Z"/>
    <path fill="${fill}" d="M314 228 C362 214 402 226 424 258 C394 268 344 260 312 242 Z"/>
    <!-- face -->
    <path fill="${fill}" d="M256 146 C320 146 352 194 350 256 C348 314 312 360 256 376 C200 360 164 314 162 256 C160 194 192 146 256 146 Z"/>
    <!-- snout shading -->
    <path fill="${accent}" opacity="0.18" d="M256 300 C284 300 300 318 300 340 C300 360 280 374 256 376 C232 374 212 360 212 340 C212 318 228 300 256 300 Z"/>
    <!-- beard -->
    <path fill="${fill}" d="M256 368 C246 396 250 420 256 438 C262 420 266 396 256 368 Z"/>
    <!-- eyes -->
    <ellipse cx="214" cy="250" rx="11" ry="16" fill="${eye}"/>
    <ellipse cx="298" cy="250" rx="11" ry="16" fill="${eye}"/>
    <!-- nostrils -->
    <ellipse cx="242" cy="338" rx="5" ry="7" fill="${eye}" opacity="0.55"/>
    <ellipse cx="270" cy="338" rx="5" ry="7" fill="${eye}" opacity="0.55"/>
  </g>`;
}
