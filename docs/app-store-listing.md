# Rashtrafarm — App Store listing

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
