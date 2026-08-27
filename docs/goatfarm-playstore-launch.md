# Fatima Goat Farm — Play Store Launch Guide & Progress

Everything needed to take **Fatima Goat Farm** from code to Google Play, plus
what's left. Living document — update as you go.

- **App name:** Fatima Goat Farm
- **Package (permanent, can never change):** `com.goatfarm.app`
- **Version:** 1.0.0 (Android `versionCode` auto-increments each build)
- **Status (Aug 2026):** assets + policy pages + reviewer account ready. Next:
  deploy the privacy site, run one build, start closed testing.

---

## 0. Key accounts, URLs & credentials

| Thing                   | Value                                                              |
| ----------------------- | ------------------------------------------------------------------ |
| Company/developer name  | FiveM Infotech                                                     |
| Public contact email    | `5fivempvt@gmail.com`                                              |
| Expo owner / account    | `5fivempvt`                                                        |
| Expo projectId          | `10273b40-9618-4e17-ad2a-0c24a0d39f37`                             |
| GitHub repo (frontend)  | `github.com/sameerrajaa9987-ui/17-jun-Goat-farm-front`             |
| Backend (API)           | Render: `https://one7-jun-goat-farm-back-frnr.onrender.com`        |
| Database                | MongoDB Atlas — `cluster0.q20nb4w.mongodb.net/goat-farm`           |
| Privacy policy          | `https://fatima-goat-farm.vercel.app/privacy-policy.html` _(§1)_   |
| Delete-account page     | `https://fatima-goat-farm.vercel.app/delete-account.html` _(§1)_   |
| **Play reviewer login** | `demo.reviewer@goatfarm.app` / `GoatFarmDemo2026!` — owner role    |
| Upload keystore         | Managed by EAS — run `eas credentials` to download. **BACK IT UP** |

> ⚠️ **Critical:** back up the upload keystore. Lose it and you can never
> update this app again — you would have to publish a new listing under a new
> package name and lose every install and review. Copy it to a password
> manager. The Play _app-signing_ key is held by Google; the _upload_ key is
> yours alone.

### Demo logins for the other roles

All use the password `Password123`. Handy for testing role-based access; the
reviewer account above is the only one that goes in Play Console.

| Email                  | Sees                           |
| ---------------------- | ------------------------------ |
| `owner@goatfarm.app`   | Everything, including settings |
| `manager@goatfarm.app` | The whole farm, day to day     |
| `worker@goatfarm.app`  | Assigned tasks and goats only  |
| `vet@goatfarm.app`     | Goat health only               |
| `client@goatfarm.app`  | Own goats and own bills only   |

All six accounts are created by the backend's `scripts/seedDemo.js`. Running it
with no flags tops up the accounts without touching farm data; `--force`
rebuilds the farm data with fresh dates.

---

## 1. One-time setup (do these once, in this order)

### 1a. Deploy the privacy + delete-account pages

Google requires a **public privacy policy URL**, and — because the app has
logins — a **public account-deletion URL**. Both pages are written and live in
`public/`. Expo's web export copies `public/` straight into `dist/`, so
deploying the web app publishes both (verified).

1. Go to [vercel.com/new](https://vercel.com/new) → **Import Git Repository** →
   pick `17-jun-Goat-farm-front`.
2. Set **Project Name** to exactly `fatima-goat-farm` — that is what makes the
   URLs in §0 correct. (Any other name works; just update §0 to match.)
3. Leave every build setting alone. `vercel.json` already sets the build
   command, the output directory, the SPA rewrite, and the production API URLs.
4. **Deploy.** Then open both URLs in a browser and confirm they load:
   - `https://fatima-goat-farm.vercel.app/privacy-policy.html`
   - `https://fatima-goat-farm.vercel.app/delete-account.html`

You now also have a working web version of the app at the root URL, free.

### 1b. Let the web app talk to the API

The backend only accepts browser requests from origins on its allowlist, so the
new Vercel domain has to be added or the web app will fail to sign in (the
Android app is unaffected — CORS is a browser rule).

On **Render → your backend service → Environment**, append the Vercel domain to
`CORS_ORIGIN` (comma-separated, no trailing slash), then redeploy:

```
CORS_ORIGIN=<whatever is already there>,https://fatima-goat-farm.vercel.app
```

### 1c. Add the Expo token to GitHub

GitHub repo → **Settings → Secrets and variables → Actions → New repository
secret**:

- **Name:** `EXPO_TOKEN`
- **Value:** an access token from expo.dev → **Settings → Access tokens**

That is all the build workflow needs.

### 1d. Create the Play developer account

[play.google.com/console](https://play.google.com/console) — US$25, once,
forever. Choose the account type carefully:

- **Organisation** — needs a D-U-N-S number, takes longer to verify, **but is
  exempt from the 12-tester rule** in §6.
- **Personal** — faster, but must run 14 days of closed testing with 12+
  testers before it can publish publicly.

---

## 2. Build pipeline (free, no EAS credits)

The `.aab` is built on **GitHub Actions** with `eas build --local` on a free
Ubuntu runner, so it never touches Expo's paid build quota.

- Workflow: `.github/workflows/build-android.yml` (manual trigger).
- OTA updates: `.github/workflows/ota-update.yml` — pushes JS-only changes to
  installed apps without a new Play release.

### How to build

1. Commit and push your changes.
2. GitHub → **Actions → "Build Android (.aab / .apk)" → Run workflow**.
3. Choose the profile:
   - **production** → `.aab` for the Play Store
   - **preview** → `.apk` you can sideload onto a phone to test
4. Wait ~25–40 min. The result is published to the repo's **Releases** page as
   a pre-release — download `app-release.aab` from there.

Release assets are used instead of Actions artifacts on purpose: they don't
count against the 500 MB artifact quota, so builds keep working when it fills.

### Before your first production build

`app.json` was corrected for submission — rebuild so the `.aab` matches what
you declare in §5:

- Permissions are now only `INTERNET` and `CAMERA`.
- `RECORD_AUDIO`, `ACCESS_COARSE_LOCATION` and `ACCESS_FINE_LOCATION` are in
  `blockedPermissions`, so they are stripped from the final manifest even
  though libraries request them. Nothing in `src/` uses location or the
  microphone — `expo-camera` was pulling in `RECORD_AUDIO` on its own, which is
  also now switched off at source with `recordAudioAndroidPermission: false`.

Fewer permissions means a shorter permission list on your store page, a simpler
Data safety form, and no "why do you need the microphone?" question from
review.

---

## 3. Store listing

Play Console → **Grow → Store presence → Main store listing**.

### App name — max 30 characters

| Option                           | Chars | Why                                                                            |
| -------------------------------- | ----- | ------------------------------------------------------------------------------ |
| `Fatima Goat Farm: Herd Manager` | 30    | **Recommended.** "Goat", "Farm" and "Herd Manager" are what people search for. |
| `Fatima Goat Farm`               | 16    | Matches `app.json` exactly. Cleaner, but gives up the search terms.            |

The name under the launcher icon stays `Fatima Goat Farm` either way — that
comes from `app.json`, not this field.

### Short description — max 80 characters

```
Run your goat farm — herd, tasks, health, feed, sales and client bills.
```

71 characters. This line sits directly under the title in search results, so it
does more work than any part of the long description.

### Full description — max 4000 characters

```
Fatima Goat Farm runs your whole goat farm from your phone — the herd, the daily work, health and vaccinations, feed and medicine stock, staff, sales, money, and the monthly bills for clients whose goats you rear.

Built for working farms. English and हिन्दी.

EVERY GOAT ON RECORD
• Each goat gets its own page: number, QR ear tag, photo, breed, colour, age, weight history and health.
• Scan a goat's QR tag to open its record in the field — no searching, no notebook.
• Record weights as you weigh, and watch the growth curve build.
• Download a Digital Passport PDF for any goat — photo, ID, QR, weight history and health — and share it on WhatsApp.

DAILY WORK, ASSIGNED AND CHECKED
• Create feeding, watering, cleaning, weighing and medicine tasks and assign them to a worker.
• Workers see their jobs, do the work, attach a photo and submit.
• You approve it, or send it back to be done again.

HEALTH AND VACCINATIONS
• Record treatments, vaccinations and dewormings against the goat they belong to.
• Schedule the next vaccine or deworming and get reminded when it falls due.
• One screen shows every sick goat and everything overdue.

FEED AND MEDICINE STOCK
• Track feed, medicine, supplements and equipment.
• Set a low-stock level per item and get flagged before you run out.
• Record stock in when you buy and stock out when you use.

STAFF, ATTENDANCE AND SALARIES
• Add your team, mark daily attendance, and pay monthly salaries — every payment posts to Finance on its own.

CLIENT GOATS AND MONTHLY BILLS
• For clients whose goats you rear for a fixed monthly fee.
• Set your packages, assign a goat and a package to a client, and generate the month's bills in one go.
• Take payment online, or record a cash payment.
• Send a payment reminder straight to WhatsApp.
• Clients sign in and see only their own goats and their own bills.

SALES AND MONEY
• Sell a goat, enter the price and the buyer, and see the profit.
• Income and expenses in one ledger — goat sales, client payments and salaries post themselves.

REPORTS
• Profit with a six-month chart, herd counts, and work done.
• Export goats, sales or transactions to a sheet you can open in Excel.

FIVE ROLES, EACH SEEING ONLY WHAT THEY NEED
• Owner — everything, including settings.
• Manager — the whole farm, day to day.
• Worker — their own jobs, and the goats.
• Vet — goat health, treatments and vaccinations.
• Client — their own goats and their own bills.

IN YOUR LANGUAGE
English and हिन्दी, switchable any time from Profile.

An account is required to use the app. If your farm already uses Fatima Goat Farm, ask your owner or manager for a login.
```

Written to Play's rules: no "best" / "#1" / ranking claims, no mention of Google
or other apps, no price or promotional copy, and every feature listed is one the
app actually ships (cross-checked against `USER_GUIDE.md`).

### App category

**Business.** (Productivity is the alternative; Business fits a farm-operations
tool better.)

### Graphics — all in `store-assets/`

| Play Console slot          | File                           | Size      | Count |
| -------------------------- | ------------------------------ | --------- | ----- |
| App icon                   | `play-icon-512.png`            | 512×512   | 1     |
| Feature graphic            | `feature-graphic-1024x500.png` | 1024×500  | 1     |
| Phone screenshots          | `screenshots/01..08`           | 1080×1920 | 8     |
| 7-inch tablet screenshots  | `screenshots-tablet7/01..08`   | 1200×1920 | 8     |
| 10-inch tablet screenshots | `screenshots-tablet10/01..08`  | 1600×2560 | 8     |

Upload each set in filename order — 01 first. Play shows the first image in
search results and most people never scroll past the third.

Every file is verified against Play's limits: correct dimensions, no alpha
channel, aspect ratio within 2:1, under 8 MB. `store-assets/README.md` explains
how they were made and how to regenerate them.

Skip the promo video for now — a weak video is worse than none, and the feature
graphic already leaves Play's play-button dead zone clear so one can be added
later without covering the headline.

---

## 4. Play Console — App content declarations

Play Console → **Policy → App content**.

| Declaration                  | Answer                                                                |
| ---------------------------- | --------------------------------------------------------------------- |
| **Privacy policy**           | `https://fatima-goat-farm.vercel.app/privacy-policy.html`             |
| **App access**               | Restricted → give the reviewer login (see below)                      |
| **Ads**                      | No ads                                                                |
| **Content rating**           | Category "Utility, Productivity, Communication or Other" → §6         |
| **Target audience**          | **18 and over only** — avoids Families policy and its stricter review |
| **News app**                 | No                                                                    |
| **COVID-19 contact tracing** | No                                                                    |
| **Data safety**              | See §5                                                                |
| **Government apps**          | No                                                                    |
| **Financial features**       | "My app doesn't provide any financial features"                       |
| **Health apps**              | No — the health records are veterinary, about goats, not people       |
| **Foreground service**       | None used                                                             |

### App access — paste this in

```
All functionality requires a signed-in account. Accounts are created by the
farm owner; there is no public sign-up for a farm.

Demo account (Owner role — sees every module):
  Email:    demo.reviewer@goatfarm.app
  Password: GoatFarmDemo2026!

Other roles, password Password123, to check role-based access:
  manager@goatfarm.app   full farm, no settings
  worker@goatfarm.app    assigned tasks and goats only
  vet@goatfarm.app       goat health only
  client@goatfarm.app    own goats and own bills only

Note: the backend is hosted on a service that sleeps when idle. The first
sign-in after a quiet period can take up to 60 seconds while the server wakes.
```

---

## 5. Data safety

Play Console → **Policy → App content → Data safety**. This must match the
`.aab` you actually upload — it is checked, and a mismatch gets apps suspended
after launch rather than rejected before it.

- **Does your app collect or share user data?** Yes
- **Is data encrypted in transit?** Yes (HTTPS)
- **Can users request data deletion?** Yes →
  `https://fatima-goat-farm.vercel.app/delete-account.html`
- **Is data collection required?** Required — the app cannot work without an
  account.

All types below are **collected, not shared**, and **linked to the user**:

| Data type                      | Required? | Purpose                                                    |
| ------------------------------ | --------- | ---------------------------------------------------------- |
| Name                           | Required  | Account management                                         |
| Email address                  | Required  | Account management                                         |
| Phone number                   | Required  | Account management                                         |
| Address                        | Optional  | App functionality (client address)                         |
| Personal info → **Other info** | Optional  | App functionality — **KYC identity number** (see below)    |
| Photos                         | Optional  | App functionality (goat photos, task proof, documents)     |
| Purchase history               | Optional  | App functionality (invoices and payments)                  |
| Other financial info           | Optional  | App functionality (farm income, expenses, salaries)        |
| App activity → Other actions   | Required  | App functionality (tasks, health records, stock movements) |

**The KYC field is the one people miss.** A client profile can store an
identity document type and number (e.g. Aadhaar). A government identity number
is personal data and must be declared; Play has no dedicated bucket for it, so
declare it under **Personal info → Other info** and describe it as "identity
document number used to verify livestock ownership".

**Payments:** Razorpay collects card and UPI details on its own screen; they
never reach this app's servers. So do **not** tick "Payment info" — but confirm
that against your own Razorpay integration before you submit.

**Do not declare:** location, microphone, contacts, calendar, SMS, health and
fitness. None are used, and after the §2 permission fix the manifest agrees.

---

## 6. Content rating

Play Console → **Policy → App content → Content rating**. Category: **Utility,
Productivity, Communication or Other**. Every question is **No**:

- Violence, sexuality, profanity, controlled substances, horror — No
- Gambling or simulated gambling — No
- Shares the user's location with other users — No
- Lets users purchase digital goods — No (payments are for a real-world
  service; see §7)
- User-generated content shared with other users — **No**, with a caveat:
  workers attach task photos and staff upload documents, but those are visible
  only inside the same farm, never to a public audience. Answer No unless your
  region's wording asks about _any_ upload at all.

Expected result: **Everyone / 3+**.

---

## 7. Payments — why Play Billing does not apply

The in-app payment collects a **monthly fee for rearing a physical goat** — a
real-world service delivered off the device. Google Play Billing is required
only for _digital_ goods and services consumed in the app. Physical goods and
real-world services must **not** use Play Billing and are free to use Razorpay.

If review asks, the answer is: _"Payments in this app are for the physical
rearing and care of livestock owned by the user, delivered at a physical farm.
No digital content is sold."_

---

## 8. Closed testing (personal accounts only)

A **personal** Play developer account created after 13 Nov 2023 must run a
closed test before it can publish publicly. Organisation accounts skip this
entirely.

- **12+ testers opted in, for 14 continuous days**, then you can apply for
  production access.

How it runs:

1. Play Console → **Testing → Closed testing → Create track**.
2. Upload the `.aab` from §2, fill the release notes, roll out.
3. Add an email list of **at least 12 people** (real Gmail addresses — friends,
   family, farm staff all count).
4. Once Google approves the build: **Manage track → Testers → Copy link**. It
   looks like `https://play.google.com/apps/testing/com.goatfarm.app`.
5. Send that link to your testers. Each taps **Become a tester**, then installs
   from Play. They must _install_, not just join.
6. Keep 12+ of them installed for **14 days** — the clock only runs while the
   count holds.
7. **Dashboard → Production → Apply for production** → final review → live.

Budget roughly 3 weeks from first upload to public launch on a personal
account: a few days for review, then the 14-day clock, then the production
review.

---

## 9. What's left

1. ☐ Deploy the privacy site to Vercel (§1a) and open both URLs to confirm
2. ☐ Add the Vercel domain to `CORS_ORIGIN` on Render (§1b)
3. ☐ Add `EXPO_TOKEN` to GitHub secrets (§1c)
4. ☐ Create the Play developer account (§1d)
5. ☐ Run a **production** build and download the `.aab` (§2)
6. ☐ Back up the upload keystore (`eas credentials`) somewhere safe (§0)
7. ☐ Fill the store listing — copy, graphics, category (§3)
8. ☐ Complete App content declarations (§4) and Data safety (§5)
9. ☐ Submit the content rating questionnaire (§6)
10. ☐ Start closed testing if on a personal account (§8)
11. ☐ Shrink screenshot 01 to 200px wide — is the headline still readable?
    (It is, as shipped — recheck if you change the copy.)

### Worth doing, not required

- **Keep the backend awake.** Render's free tier sleeps, and a reviewer hitting
  a 60-second cold start may mark the app as broken. A paid instance, or a
  cron ping every 10 minutes during the review window, removes the risk.
- **An in-app "Delete account" button.** The emailed request documented on the
  deletion page satisfies Play's requirement, but an in-app path under
  **Profile** is what Google recommends and takes little work.
- **The app icon.** It is valid as shipped, but it is an illustrated goat on a
  near-white background, so it has no silhouette against Play's white listing
  page and its fine linework dissolves at launcher size. Putting the same
  artwork on the forest-green field the rest of the store assets use would fix
  both. See `store-assets/README.md`.
- **Reports screen bug.** Its three stat tiles truncate their values (`₹16…`,
  `₹19…`). Not a store issue — that screen is deliberately left out of the
  screenshots — but worth fixing.

---

## 10. Day-to-day cheatsheet

| I want to…                      | Do this                                                                          |
| ------------------------------- | -------------------------------------------------------------------------------- |
| Save code to GitHub             | `git add -A` → `git commit -m "msg"` → `git push`                                |
| Build a new `.aab` for Play     | GitHub → Actions → Build Android → Run workflow → **production**                 |
| Build a test `.apk` for a phone | Same workflow → **preview**                                                      |
| Ship a JS-only fix instantly    | GitHub → Actions → **ota-update** (no Play review needed)                        |
| Ship a native change            | Build a new `.aab` → upload to the track → Send for review                       |
| Refresh the demo/reviewer data  | backend: `node scripts/seedDemo.js --force` (dates reset to today)               |
| Add a login without wiping data | backend: `node scripts/seedDemo.js` (accounts only)                              |
| Re-make store graphics          | `node scripts/captureStoreScreens.mjs` → `node scripts/makeStoreScreenshots.mjs` |
| Update the privacy pages        | edit `public/*.html` → push → Vercel redeploys automatically                     |
