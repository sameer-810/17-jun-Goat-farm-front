/**
 * Captures real screens of the running app into `store-assets/raw-screens/`
 * (phone) and `store-assets/raw-screens-tablet/` (tablet).
 *
 * These are genuine captures — makeStoreScreenshots.mjs only frames them.
 *
 * Four things that are easy to get wrong and each produce a broken listing:
 *
 *  1. **The viewport must be a real device WIDTH scaled up by
 *     deviceScaleFactor.** 390x844 at 3x gives a 1170x2532 image of the PHONE
 *     layout. Setting the CSS viewport to 1170 renders a tablet-width layout at
 *     phone proportions instead.
 *  2. **It must be the exported web build, not `expo start --web`.** The dev
 *     server sets `__DEV__`, and src/config/env.ts then points the app at
 *     `EXPO_PUBLIC_API_URL_DEV` (an internal IP) rather than the live API. A
 *     production export talks to the deployed backend, which has the demo data.
 *  3. **CORS.** The deployed API only allows its own origins, so a build served
 *     from localhost is refused. The capture browser is launched with web
 *     security off — it is a throwaway profile that loads nothing but this app.
 *  4. **No empty states.** Empty screens measurably hurt conversion. Every shot
 *     below is a screen the seeded demo account has real data on
 *     (`npm run seed:demo` in the backend).
 *
 * Run:  node audit/serve.mjs                    # terminal 1, serves dist-web
 *       node scripts/captureStoreScreens.mjs    # terminal 2
 *
 * Re-export the web build first if the app changed:
 *       npx expo export -p web --output-dir dist-web
 */
import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.BASE || "http://localhost:5173";

// The demo owner account created by the backend's scripts/seedDemo.js. Owner
// sees every module, so one login covers the whole shot list.
const EMAIL = process.env.DEMO_EMAIL || "owner@goatfarm.app";
const PASSWORD = process.env.DEMO_PASSWORD || "Password123";

/**
 * CSS viewport x deviceScaleFactor = the pixel size Play receives.
 * Phone  390x844   @3x -> 1170x2532
 * Tablet 800x1280  @2x -> 1600x2560
 *
 * This app uses bottom tabs at every width — there is no desktop sidebar to
 * collapse — so the tablet capture is genuinely the tablet layout, which is
 * what Play requires (it rejects enlarged phone frames).
 */
const TARGETS = [
  { key: "phone", dir: "raw-screens", w: 390, h: 844, dsf: 3, mobile: true },
  {
    key: "tablet",
    dir: "raw-screens-tablet",
    w: 800,
    h: 1280,
    dsf: 2,
    mobile: false,
  },
];

/**
 * Navigation is by tapping, not by URL: NavigationContainer has no `linking`
 * config, so React Navigation never writes a path to the address bar and
 * `goto('/inventory')` would just reload the dashboard.
 *
 * Each shot reloads first — the session lives in localStorage, so a reload
 * lands back on the dashboard signed in. That is a cleaner reset between
 * screens than trying to walk the stack backwards.
 *
 * `taps` are the exact on-screen labels: the bottom tab bar ("Home", "Goats",
 * "Tasks", "Team", "Profile") and the dashboard's module tiles.
 */
const SHOTS = [
  { name: "dashboard", taps: [] },
  { name: "goats", taps: ["Goat Registry"] },
  // Goat cards print the goat's code next to its name; G-0001 is the first
  // goat the seed creates, so it is a stable way into a profile.
  { name: "goatProfile", taps: ["Goat Registry", "G-0001"] },
  // Tasks opens on "To approve", which holds only the two submitted jobs. The
  // "Active" tab is the fuller, more representative screen — a day's work
  // assigned out — and a listing screenshot must never be a near-empty list.
  { name: "tasks", taps: ["Daily Tasks", "Active"] },
  { name: "health", taps: ["Health & Vaccines"] },
  { name: "inventory", taps: ["Inventory"] },
  { name: "staff", taps: ["Staff"] },
  // Straight through to the client's own page. The Ad Pali client LIST holds a
  // single demo client and is mostly empty canvas; the profile behind it has
  // the goats, their packages, the monthly total and the invoices — which is
  // what "bill clients for their goats" actually means.
  { name: "billing", taps: ["Ad Pali Billing", "Chetan Client"] },
  { name: "finance", taps: ["Sales & Finance"] },
  { name: "reports", taps: ["Reports"] },
  { name: "team", taps: ["Team"] },
  { name: "profile", taps: ["Profile"] },
];

/**
 * Name one or more shots on the command line to re-capture only those — a full
 * run is two logins and ~24 screens, and reshooting one screen after changing
 * its route should not cost that.
 *
 *   node scripts/captureStoreScreens.mjs billing health
 */
const ONLY = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const TODO = ONLY.length ? SHOTS.filter((s) => ONLY.includes(s.name)) : SHOTS;
if (ONLY.length && TODO.length !== ONLY.length) {
  const known = SHOTS.map((s) => s.name).join(", ");
  throw new Error(
    `unknown shot in [${ONLY.join(", ")}]. Known shots: ${known}`,
  );
}

/**
 * The app sets `fontFamily` to bare file names — "Inter_400Regular",
 * "SpaceGrotesk_700Bold" — which the expo-font config plugin embeds at build
 * time on Android and iOS. Nothing embeds them for web, so those families are
 * undefined in the browser and every screen renders in the default serif.
 *
 * That would put type in the listing that the shipped Android app never uses.
 * Declaring the same families from `assets/fonts` makes the capture match the
 * app on a real device, which is the only thing the screenshots may show.
 */
const FONT_CSS = [
  "Inter_400Regular",
  "Inter_500Medium",
  "Inter_600SemiBold",
  "Inter_700Bold",
  "SpaceGrotesk_500Medium",
  "SpaceGrotesk_600SemiBold",
  "SpaceGrotesk_700Bold",
]
  .map((name) => {
    const p = path.join(ROOT, "assets", "fonts", `${name}.ttf`);
    if (!fs.existsSync(p)) {
      console.warn(
        `  ! missing font ${name}.ttf — screens will use a fallback`,
      );
      return "";
    }
    const data = fs.readFileSync(p).toString("base64");
    return `@font-face{font-family:"${name}";font-display:block;
      src:url(data:font/ttf;base64,${data}) format("truetype")}`;
  })
  .join("\n");

/** Re-injected after every load — a reload drops the previous style tag. */
async function injectFonts(page) {
  await page.addStyleTag({ content: FONT_CSS }).catch(() => {});
  await page.evaluate(() => document.fonts.ready).catch(() => {});
}

/** True once the dashboard has actually rendered (not just the bundle). */
async function onDashboard(page) {
  const t = await page.locator("body").innerText();
  return /Your modules/i.test(t);
}

async function login(page) {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  // The RN bundle is 4.6MB and boots fonts + i18n before rendering anything.
  await page.waitForSelector("text=/Skip|Sign in|Email/i", { timeout: 180000 });
  await injectFonts(page);
  await page.waitForTimeout(2500);

  // Onboarding runs ahead of the login form on a fresh profile.
  const skip = page.getByText("Skip", { exact: true }).first();
  if (await skip.count()) {
    await skip.click().catch(() => {});
    await page.waitForTimeout(2500);
  }

  await page.waitForSelector("input", { timeout: 60000 });
  await page.locator("input").nth(0).fill(EMAIL);
  await page.locator("input").nth(1).fill(PASSWORD);
  // The button, not Enter: React Native Web's TextInput does not submit a form
  // on Enter, so pressing it here sends no request at all and the run fails
  // several minutes later with an unexplained "never rendered".
  await page.getByText("Sign in", { exact: true }).first().click();

  // Render's free tier cold-starts; the first request can take ~60s.
  for (let i = 0; i < 40 && !(await onDashboard(page)); i++) {
    await page.waitForTimeout(3000);
  }
  if (!(await onDashboard(page))) {
    throw new Error(
      `login failed — the dashboard never rendered. Check ${EMAIL} exists ` +
        `(backend: npm run seed:demo) and that the API is reachable.`,
    );
  }
}

/** Reloads to the dashboard, then taps its way to the screen for this shot. */
async function goTo(page, shot) {
  await page.reload({ waitUntil: "domcontentloaded" });
  await injectFonts(page);
  for (let i = 0; i < 40 && !(await onDashboard(page)); i++) {
    await page.waitForTimeout(2000);
  }
  for (const label of shot.taps) {
    const el = page.getByText(label, { exact: true }).first();
    await el.waitFor({ state: "visible", timeout: 30000 });
    await el.click();
    await page.waitForTimeout(4500);
  }
  // Data arrives after the screen mounts; give the lists time to fill so no
  // spinner or skeleton is caught in the shot.
  await page.waitForTimeout(3500);
  // Drop focus so no cursor or focus ring lands in the capture.
  await page.keyboard.press("Escape");
}

// Web security off: the deployed API's CORS allowlist does not include
// localhost, and this profile only ever loads the local build of this app.
const browser = await chromium.launch({
  args: [
    "--disable-web-security",
    "--disable-features=IsolateOrigins,site-per-process",
  ],
});

for (const t of TARGETS) {
  const outDir = path.join(ROOT, "store-assets", t.dir);
  fs.mkdirSync(outDir, { recursive: true });

  const ctx = await browser.newContext({
    viewport: { width: t.w, height: t.h },
    deviceScaleFactor: t.dsf,
    isMobile: t.mobile,
    hasTouch: t.mobile,
  });
  ctx.setDefaultNavigationTimeout(180000);
  ctx.setDefaultTimeout(30000);

  const page = await ctx.newPage();
  await login(page);
  console.log(`${t.key}: signed in`);

  for (const s of TODO) {
    try {
      await goTo(page, s);
      await page.screenshot({ path: path.join(outDir, `${s.name}.png`) });
      console.log(`${t.key}: ${s.name}`);
    } catch (err) {
      // One unreachable screen should not cost the whole run.
      console.warn(
        `${t.key}: SKIPPED ${s.name} — ${err.message.split("\n")[0]}`,
      );
    }
  }
  await ctx.close();
}

await browser.close();
console.log(
  "\nraw captures written. Now run: node scripts/makeStoreScreenshots.mjs",
);
