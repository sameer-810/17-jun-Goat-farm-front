# Rashtrafarm — App Store listing

Part 1 is the text to paste. Part 2 is every other field App Store Connect asks for.

Everything App Store Connect asks for, ready to paste. Lengths are checked
against Apple's limits. Written 16 Sep 2026 for version 1.0.

The Play description said "Take payment online"; that button was removed (it
could only fail), so this text says payments are recorded instead. The live
Play listing still carries the old line.

## App Information

| Field | Value | Length |
| --- | --- | --- |
| Name | Rashtrafarm: Goat Farm Manager | 30/30 |
| Subtitle | Goats, health, tasks & bills | 28/30 |
| Primary category | Business | |
| Secondary category | Productivity | |
| Bundle ID | com.rashtrafarm.app | |
| SKU | rashtrafarm-ios | |

## Version page

**Promotional text** (139/170)

```
Scan a goat's QR tag to open its full record, assign the day's work, keep vaccinations on schedule and bill clients for the goats you rear.
```

**Keywords** (74/100)

```
goat,farm,livestock,breeding,vaccination,herd,dairy,pashu,kisan,ear tag,QR
```

| Field | Value |
| --- | --- |
| Support URL | https://rashtrafarm.vercel.app/privacy-policy.html |
| Privacy Policy URL | https://rashtrafarm.vercel.app/privacy-policy.html |
| Copyright | 2026 FiveM Infotech Private Limited |

**Description** (2688/4000)

```
Rashtrafarm runs your whole goat farm from your phone: the herd, the daily work, health and vaccinations, feed and medicine stock, staff, sales, money, and the monthly bills for clients whose goats you rear.

Built for working farms. English and हिन्दी.

EVERY GOAT ON RECORD
• Each goat gets its own page: number, QR ear tag, photo, breed, colour, age, weight history and health.
• Scan a goat's QR tag to open its record in the field, with no searching and no notebook.
• Record weights as you weigh, and watch the growth curve build.
• Download a Digital Passport PDF for any goat, with photo, ID, QR, weight history and health, and share it on WhatsApp.

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
• Add your team, mark daily attendance, and pay monthly salaries. Every payment posts to Finance on its own.

CLIENT GOATS AND MONTHLY BILLS
• For clients whose goats you rear for a fixed monthly fee.
• Set your packages, assign a goat and a package to a client, and generate the month's bills in one go.
• Record payments received by cash, UPI or bank transfer.
• Send a payment reminder straight to WhatsApp.
• Clients sign in and see only their own goats and their own bills.

SALES AND MONEY
• Sell a goat, enter the price and the buyer, and see the profit.
• Income and expenses in one ledger: goat sales, client payments and salaries post themselves.

REPORTS
• Profit with a six-month chart, herd counts, and work done.
• Export goats, sales or transactions to a sheet you can open in Excel.

FIVE ROLES, EACH SEEING ONLY WHAT THEY NEED
• Owner: everything, including settings.
• Manager: the whole farm, day to day.
• Worker: their own jobs, and the goats.
• Vet: goat health, treatments and vaccinations.
• Client: their own goats and their own bills.

IN YOUR LANGUAGE
English and हिन्दी, switchable any time from Profile.

An account is required to use the app. If your farm already uses Rashtrafarm, ask your owner or manager for a login. You can delete your account at any time from Profile.
```

## Screenshots

iPhone 6.5-inch only (the app is iPhone-only). Upload in this order from
`store-assets/app-store/iphone-6.5/`, 1284x2778, no alpha:

1. `01-dashboard.png`
2. `02-goats.png`
3. `03-goatProfile.png`
4. `04-tasks.png`
5. `05-health.png`
6. `06-inventory.png`
7. `07-finance.png`
8. `08-billing.png`

Regenerate: run the backend seed locally, `npx expo start --web --port 8086`,
then `node scripts/captureStoreScreens.mjs --targets=ios65` and
`node scripts/makeStoreScreenshots.mjs --only=ios65`.

## App Review notes

Sign-in required: use the Owner demo login from the App access block in
`docs/rashtrafarm-playstore-launch.md` (never commit it here).

```
Rashtrafarm is a management app for goat farms in India: goat records with QR ear tags, health and vaccination history, worker tasks, staff, inventory, sales and client billing.

The demo Owner account sees every module. Logins for the manager, worker, vet and client roles are below.

Account deletion: Profile tab > Delete account. Please try it on a new account created with Register, so the shared demo data stays intact.

Payments: the farm's clients pay the farm directly, by cash, UPI or bank transfer, for real-world goat-rearing services, and the farm records the payment in the app. Nothing is bought or sold inside the app.

The camera is used only to scan goat QR tags and to photograph goats, tasks and documents.
```

---

# Part 2 — Every field in App Store Connect

Work top to bottom. Anything not listed here is left at its default.
`<…>` marks the only values I cannot supply.

## A. My Apps → + → New App

| Field | Answer |
| --- | --- |
| Platforms | iOS only |
| Name | Rashtrafarm: Goat Farm Manager |
| Primary Language | English (India) |
| Bundle ID | com.rashtrafarm.app (appears after the first build) |
| SKU | rashtrafarm-ios |
| User Access | Full Access |

## B. App Information

| Field | Answer |
| --- | --- |
| Subtitle | Goats, health, tasks & bills |
| Privacy Policy URL | https://rashtrafarm.vercel.app/privacy-policy.html |
| Category — Primary | Business |
| Category — Secondary | Productivity |
| Content Rights | Does not contain, show, or access third-party content |
| Age Rating | see C |
| License Agreement | Apple's standard EULA (do not upload a custom one) |
| Additional Languages | none. The app is English and Hindi, but a second listing language means translating every field; add it later if you want Hindi search traffic |

## C. Age Rating questionnaire

Answer **None** to every category except where noted. Nothing in this app depicts any of it.

| Question | Answer |
| --- | --- |
| Cartoon or Fantasy Violence / Realistic Violence / Prolonged Violence | None |
| Sexual Content or Nudity | None |
| Profanity or Crude Humor | None |
| Alcohol, Tobacco, or Drug Use or References | None |
| Mature or Suggestive Themes | None |
| Horror or Fear Themes | None |
| Medical or Treatment Information | **None** — the health records are veterinary, about goats |
| Gambling | None |
| Contests | None |
| Unrestricted Web Access | No |
| Made for Kids | No |
| In-app controls for parental settings | Not applicable |

## D. Pricing and Availability

| Field | Answer |
| --- | --- |
| Price | Free (₹0) |
| Availability | **India only.** Bills are in ₹ and you have not prepared EU obligations |
| Pre-Orders | Off |
| Distribution on alternative marketplaces (EU) | Off |
| Custom Product Pages | None |
| Available on Apple Vision Pro | Off — never tested there |
| Educational discount | Not applicable to a free app |

## E. App Privacy

**Data collection:** Yes.
For every type below: **Linked to the user = Yes**, **Used for tracking = No**, purpose **App Functionality** (add *Account Management* where the field says so). Nothing is used for advertising or analytics — the app contains no ad, analytics or crash SDK.

| Category → Type | Purpose | Why it is collected |
| --- | --- | --- |
| Contact Info → Name | App Functionality, Account Management | Sign-up and staff/client profiles |
| Contact Info → Email Address | App Functionality, Account Management | The login |
| Contact Info → Phone Number | App Functionality | Staff and client contact, WhatsApp reminders |
| Identifiers → User ID | App Functionality, Account Management | The account itself |
| Purchases → Purchase History | App Functionality | Client bills and recorded payments |
| User Content → Photos or Videos | App Functionality | Goat photos, task proof, document scans |
| User Content → Other User Content | App Functionality | Goat, health, task, staff and finance records |

**Tracking:** answer **No** to "Do you or your third-party partners use data for tracking?"
**Privacy Choices URL:** leave empty.

## F. Version 1.0 page

| Field | Answer |
| --- | --- |
| Screenshots — iPhone 6.5-inch | the 8 files in `store-assets/app-store/iphone-6.5/`, in filename order |
| Screenshots — iPad | none; the app is iPhone-only |
| App Preview (video) | none |
| Promotional Text | see Part 1 |
| Description | see Part 1 |
| Keywords | see Part 1 |
| Support URL | https://rashtrafarm.vercel.app/privacy-policy.html |
| Marketing URL | leave empty |
| Version | 1.0 |
| Copyright | 2026 FiveM Infotech Private Limited |
| Build | pick the TestFlight build once it finishes processing |
| Version Release | **Manually release this version** |
| Phased Release for Automatic Updates | leave on; it only affects later updates |
| Routing App Coverage File | none |
| Game Center | off |
| In-App Purchases | none |

### App Review Information

| Field | Answer |
| --- | --- |
| Sign-in required | **Yes** |
| User name | the Owner demo email from the Play guide's App access block |
| Password | that account's password — type it here only, never in git |
| Contact First Name / Last Name | `<your first name>` / `<your last name>` |
| Contact Phone Number | `<your mobile, with +91>` |
| Contact Email | 5fivempvt@gmail.com |
| Attachment | none |
| Notes | the block in Part 1, plus the other role logins |

## G. Account-level, once per Apple account

| Item | Answer |
| --- | --- |
| Free Apps Agreement | must be Active under Business → Agreements, or the app cannot be released |
| Paid Apps Agreement | not needed |
| EU Digital Services Act trader status | already submitted for this account with AshShifa |
| Export compliance | answered by `ITSAppUsesNonExemptEncryption: false` in `app.json`; if a question still appears, answer *None of the algorithms mentioned above* |
| Advertising Identifier (IDFA) | **No** — the app has no ad SDK |
