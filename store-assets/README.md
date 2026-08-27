# Store assets

Everything Google Play asks for in the **Main store listing** slot, generated
from real captures of the running app.

The listing copy, policy answers, build pipeline and submission order live in
[`../docs/goatfarm-playstore-launch.md`](../docs/goatfarm-playstore-launch.md).

| File / folder                  | Play Console slot | Size      | Count |
| ------------------------------ | ----------------- | --------- | ----- |
| `screenshots/`                 | Phone screenshots | 1080x1920 | 8     |
| `screenshots-tablet7/`         | 7-inch tablet     | 1200x1920 | 8     |
| `screenshots-tablet10/`        | 10-inch tablet    | 1600x2560 | 8     |
| `feature-graphic-1024x500.png` | Feature graphic   | 1024x500  | 1     |
| `play-icon-512.png`            | App icon          | 512x512   | 1     |

`raw-screens/` and `raw-screens-tablet/` hold the plain device captures the
composers draw from. They are not uploaded.

**Uploading:** Play Console → Grow → Store presence → Main store listing. There
are separate upload slots for phone, 7-inch tablet and 10-inch tablet. Upload
each set in order 01-08.

## Screenshots

| #   | Screen         | Headline                     | Why it's here                                               |
| --- | -------------- | ---------------------------- | ----------------------------------------------------------- |
| 01  | Dashboard      | Your whole farm, one screen  | Most recognisable screen; also the one shown in search      |
| 02  | Goat registry  | Every goat on one list       | The core object of the app                                  |
| 03  | Goat profile   | One tag, the whole history   | The differentiator — QR tag, weight curve, digital passport |
| 04  | Tasks          | Assign the work, see it done | The daily loop, and the reason a farm buys software         |
| 05  | Health         | Never miss a vaccination     | The mistake that costs a farm an animal                     |
| 06  | Inventory      | Feed and medicine, counted   | Core utility: low stock flagged before it bites             |
| 07  | Finance        | Every rupee in and out       | The owner's question, answered                              |
| 08  | Client profile | Bill clients for their goats | Breadth close — nothing else in this bracket bills clients  |

Shot 08 frames the **client's own profile**, not the Ad Pali client list. The
list holds one demo client above a screen of empty canvas; the profile behind it
carries the goats, their packages, the monthly total and the invoices — which is
what the headline actually claims.

Captured but unused, available in `raw-screens/` to swap in: `staff`, `reports`,
`team`, `profile`.

Two of those are deliberately **not** used:

- **`reports`** puts `NET (ALL TIME) ₹-45,600` in display type on a clay hero.
  It is only the demo ledger showing more expense than income, but a listing
  should not lead with a loss. The same screen's three stat tiles also truncate
  their values (`₹16…`, `₹19…`) — a real layout bug worth fixing regardless.
- **`profile`** and **`team`** are settings-shaped screens; they sell nothing.

All three sets are built to Play's rules: 320-3840px per side, longest side no
more than twice the shortest, 24-bit PNG with **no alpha channel** (PNGs with
transparency are rejected — the composer flattens every output), under 8MB.

The tablet sets are **not enlarged phone frames** — Play explicitly warns
against that. They are captures of the app at a real 800x1280 tablet viewport.

### The rules these are built to

From published ASO research (AppFollow, Screenhance, TheAppLaunchpad, 2026):

| Rule                                         | How it's applied                          |
| -------------------------------------------- | ----------------------------------------- |
| ~90% of users never scroll past screenshot 3 | Broadest-appeal screens are 01-03         |
| Screenshot 1 appears in search results       | Dashboard — the most recognisable screen  |
| Headline must be legible at ~200px wide      | 88px type on a 1080px canvas              |
| Headline in the top third                    | Sits at y~180-330 of 1920                 |
| Captions <= 6 words, one message each        | Longest is 6 words                        |
| No empty states — show realistic data        | Backend re-seeded so every screen is full |
| Consistent background/type/palette           | Identical treatment across all eight      |
| Portrait 9:16, 1080px+, at least 4 shots     | 1080x1920, eight shots                    |

**Verify before uploading:** shrink a screenshot to 200px wide. If the headline
isn't instantly readable, the type is too small or the copy too long.

**Keep headlines honest.** Every one of the eight describes only what its screen
actually shows. Listings that overpromise draw refunds and one-star reviews.

## Feature graphic

`feature-graphic-1024x500.png` — built by `scripts/makeFeatureGraphic.mjs`. Run
with `--guides` for a copy with the safe zone and play-button dead zone drawn
on, for checking placement.

- **No alpha.** Play rejects PNGs with transparency in this slot; it is one of
  the two most common rejection causes. The script flattens before writing.
- **Nothing in the play-button dead zone.** If a promo video is attached later,
  Play draws a 96x96 button dead centre (x 464-560, y 202-298). All text sits
  left of x=464, so adding a video can never cover the headline.
- Uses the **same background, type and headline family as the screenshots**,
  because a feature graphic that looks like a separate ad banner makes the
  listing read as three different products.
- Two real app screens, not stock photography: the dashboard in front, a goat's
  own profile behind — the QR-tagged record is the reason to use this over a
  notebook, so it earns the second slot.
- The app icon is deliberately not repeated; Play already shows it alongside.

**Rules worth not breaking:** no store badges, no "Download now" or other
call-to-action copy, no price or ranking claims, nothing important within
70-80px of any edge.

## App icon

`play-icon-512.png` is `assets/icon.png` — the icon the app actually ships —
resized to 512x512 and flattened so no alpha channel survives. The store icon
and the installed icon must be the same image, and this is the only way to
guarantee that.

**Do not rebuild it from `scripts/make-assets.mjs`.** That script draws a
different mark: a flat goat-head emblem (`scripts/goatEmblem.mjs`). It has not
been run since the illustrated icon replaced it, and running it now would
overwrite the shipped `assets/*.png` with the old emblem. Verified: the shipped
`icon.png` is a 3-channel 1024x1024 illustration and the shipped `favicon.png`
is 48x48, while the script emits 4-channel 1024x1024 and a 256x256 favicon.
`make-assets.mjs` is legacy — treat it as such.

### Worth reconsidering before launch

The current icon is an illustrated goat on a near-white background. It is
**valid** — 512x512, square, no alpha, 181KB — but it is working against itself
in three ways:

1. **No silhouette.** Play renders the listing on white. A near-white icon has
   no edge, so it reads as a goat floating in the search row rather than as an
   app. Every icon around it will have a solid colour block.
2. **It dissolves at 48dp.** The fine linework, fur shading and thin outlines
   turn to grey mush at launcher size. Icons are recognised by shape and colour
   at a glance, not by detail.
3. **It shares no colour with the listing.** The screenshots and feature graphic
   are forest green and clay; the icon is white and brown.

The cheapest fix that keeps the artwork is to sit the same illustration on a
solid forest-green field (`#2F6B3C` → `#1C4726`, the palette the rest of these
assets use) and thicken the outline. That is a design decision, so this script
does not make it — it ships exactly what the app ships.

## Design notes

- Background is **deep forest green** (`#12341F` → `#2F6B3C`) with the design
  system's **clay** accent (`#C2683B`) and cream type (`#F4EEE1`). These are the
  app icon's own colours, so the icon Play draws beside the screenshots belongs
  to the same picture.
- Dark on purpose. The app's UI is warm cream and near-white; on a pale
  background the device would float with nothing to separate it. Green also
  says "farm" before a word is read, which is most of the work a search-results
  thumbnail has to do.
- Type is the app's own: **Space Grotesk** for headlines, **Inter** for
  captions, embedded from `assets/fonts` into the composer.
- The device is a **real phone body** (dark bezel, side buttons), not a bare
  rounded rectangle. An unframed export is the mark of a listing nobody has
  revisited, and the bezel gives the cream UI a hard edge against the green.
- Device occupies ~73% of the canvas width and bleeds off the bottom edge — it
  reads as depth rather than a floating rectangle.
- Headlines are two lines max. Three crowds the device.

## Regenerating

The device screens are real captures, not mockups.

```bash
# 0. Refresh the demo data so no screen is empty (backend project)
cd ../../17-jun-Goat-farm-back && node scripts/seedDemo.js --force

# 1. Export the web build and serve it
cd ../17-jun-Goat-farm-front
npx expo export -p web --output-dir dist-web
node ../audit/serve.mjs                # terminal 1, serves on :5173

# 2. Capture, then compose
node scripts/captureStoreScreens.mjs   # refreshes raw-screens*/
node scripts/captureStoreScreens.mjs billing health   # ...or just these two
node scripts/makeStoreScreenshots.mjs  # composes all three screenshot sets
node scripts/makeFeatureGraphic.mjs    # feature graphic
node scripts/makePlayIcon.mjs          # 512x512 icon
```

`sharp` is not a dependency of this app — `scripts/loadSharp.mjs` borrows it
from a sibling project, and tells you to `npm i -D sharp` if it can't find one.

Five traps when refreshing the raw captures, each of which produced a broken
run at least once:

1. **Use the exported build, not `expo start --web`.** The dev server sets
   `__DEV__`, and `src/config/env.ts` then points the app at
   `EXPO_PUBLIC_API_URL_DEV` — an internal IP, not the live API.
2. **The phone viewport must be a real phone WIDTH scaled up** — 390x844 at
   `deviceScaleFactor: 3` gives a 1170x2532 image of the _phone_ layout.
   Setting the CSS viewport to 1170 renders a tablet-width layout instead.
3. **CORS.** The deployed API's allowlist has no localhost entry, so the
   capture browser is launched with web security off. Without it every request
   fails and the run dies at login with no explanation.
4. **Click "Sign in"; don't press Enter.** React Native Web's `TextInput` does
   not submit a form on Enter — pressing it sends no request at all.
5. **Inject the fonts.** The app sets `fontFamily` to bare names like
   `SpaceGrotesk_700Bold`, which `expo-font` embeds on Android and iOS only.
   Nothing embeds them for web, so without the injected `@font-face` rules every
   screen renders in the browser's default **serif** — type the shipped app
   never uses.

Edit the `SHOTS` array in `makeStoreScreenshots.mjs` to change headlines, order,
or which screens are used, and the `SHOTS` array in `captureStoreScreens.mjs` to
change which screens get captured at all.
