# Content guide

**Who this is for:** whoever maintains the Madhouse website next — most likely the Web Representative on the Hostel 4 Council.

You do not need to know React to keep this site up to date. Every fact on the website comes from one of nine files in `src/data/`. Edit the file, save, and the change appears everywhere that fact is used.

---

## Before you start

```bash
npm install
```

```bash
npm run dev
```

Open <http://localhost:5173>. The page reloads as you save.

When you are done:

```bash
npm run build
```

If you made a typo in a data file, `npm run build` fails and tells you the file and line. It will not let you ship a broken page.

---

## The golden rule

**Never invent a fact.**

If you do not have the real value yet, leave the placeholder. The site has designed "awaiting details" states for exactly this, and they look intentional. A made-up phone number or GC position is worse than an honest blank.

---

## Where everything lives

| File | Controls |
|---|---|
| `src/data/site.ts` | Brand text, navigation, social links, institute links, map, photo paths |
| `src/data/mess.ts` | Meal timings and the weekly menu |
| `src/data/events.ts` | Every event, past and upcoming |
| `src/data/announcements.ts` | The notice board |
| `src/data/council.ts` | Wardens, secretaries, representatives |
| `src/data/gc.ts` | General Championship standings and history |
| `src/data/amenities.ts` | Facilities and bookable equipment |
| `src/data/gallery.ts` | Photo roll and the legacy timeline |
| `src/data/utilities.ts` | Emergency contacts, important links, setup guides, hostel facts |

---

## 1. Mess menu and timings

**File:** `src/data/mess.ts`

This one file drives the live "now serving" badge, the countdown, the day timeline and the week table on the homepage.

### Change a meal timing

```ts
export const mealWindows: MealWindow[] = [
  { key: 'breakfast', label: 'Breakfast', start: '07:30', end: '09:30', icon: '☕' },
  //                                        ^^^^^^^^^^^^^^^^^^^^^^^^^ 24-hour clock
]
```

The homepage recalculates everything from these times — you do not have to touch anything else.

### Change the menu

`weeklyMenu` is a list of seven days. **Index 0 is Sunday**, 1 is Monday, and so on to 6 for Saturday.

```ts
{
  // Monday
  breakfast: ['Idli', 'Sambar', 'Coconut Chutney', 'Banana', 'Milk'],
  lunch: ['Rajma', 'Rice', 'Roti', 'Aloo Bhujia', 'Salad'],
  snacks: ['Poha', 'Sev', 'Tea'],
  dinner: ['Mix Veg', 'Dal Tadka', 'Rice', 'Roti', 'Curd'],
},
```

Add or remove items freely — the cards resize themselves.

### Updating the mess menu from the weekly PDF

The mess council publishes a menu PDF every week. There are two separate things you can do with it, and doing one does not oblige you to do the other.

#### A. Publish the PDF itself

This gives residents a "This week's menu (PDF)" link to the original document.

1. Rename the file to exactly **`current-menu.pdf`**.
2. Put it in **`public/mess/`**, replacing last week's.
3. Open `src/components/home/MessMenuLink.tsx` and set:

```ts
export const MESS_PDF_AVAILABLE: boolean = true
```

That is the whole job. While the flag is `false` the link is not rendered at all — because the site is static, nothing can check at runtime whether the file is really there, so the link stays switched off rather than risking a dead download. Once it is `true`, dropping in a new `current-menu.pdf` each week is all that is needed; you never touch the flag again.

Keep the file under about 2 MB. If the council sends a photograph of a printed sheet, ask for the PDF — a phone photo renamed to `.pdf` is not a PDF.

#### B. Refresh the meal cards from the PDF

The homepage meal cards and the week table read `weeklyMenu`, not the PDF. To update them without retyping seven days of food:

```bash
npm run mess:menu -- path/to/menu.pdf
```

That **only prints**. It shows you the full seven-day grid it has read, marking each meal either `parsed` (taken from your file) or `kept` (left exactly as it is now), followed by a list of every slot it could not fill and the reason.

**Read that preview against the actual PDF before going further.** A PDF does not know it contains a table — it stores letters at coordinates, and the importer reconstructs the columns from those coordinates. That works well for an ordinary grid, but merged cells, an extra column of dates, or a two-line dish name can land text in the wrong meal. This is a real limit of reading PDFs, not a bug you can report away. The importer will refuse a cell it is unsure of and leave the old value in place, but it cannot catch a wrong answer that looks plausible. That is your job, and it takes about a minute.

When the preview is right:

```bash
npm run mess:menu -- path/to/menu.pdf --write
```

Only the `weeklyMenu` array is rewritten. Your timings, the comments and `MESS_DATA_VERIFIED` are untouched. Check the result with `git diff src/data/mess.ts`, then `npm run dev`.

#### If the PDF will not parse

Some menus cannot be read this way at all — a scan or a photograph has no text in it, and some layouts are simply too far from a grid. The importer says so plainly instead of guessing.

In that case, type the menu into a spreadsheet with five columns — day, breakfast, lunch, snacks, dinner, items separated by commas — export it as **Tab-separated values (`.tsv`)**, and feed that in instead:

```bash
npm run mess:menu -- menu.tsv --write
```

Nothing is inferred on this route: what you type is what appears on the site. Leave a cell empty to keep whatever that meal already has. Full format notes are in **[`scripts/README.md`](../scripts/README.md)**.

Editing `weeklyMenu` by hand, as described just above, remains perfectly fine for a one-dish correction.

### Turn off the "sample menu" notice

Once the menu and timings are real:

```ts
export const MESS_DATA_VERIFIED = true
```

The placeholder notes on the homepage disappear.

---

## 2. Events

**File:** `src/data/events.ts`

### Add an event

Copy any existing entry and change the values:

```ts
{
  id: 'e-010',                          // must be unique
  title: 'Wing Football Finals',
  date: '2026-10-12',                   // YYYY-MM-DD
  startTime: '17:00',                   // 24-hour, optional
  endTime: '19:00',                     // optional
  venue: 'Hostel 4 Ground',
  category: 'Sports',                   // Tech | Sports | Cult | SUS | Hostel | Festivals | Social
  description: 'One paragraph. Keep it short.',
  registrationUrl: 'https://forms.gle/…', // optional — adds a Register button
  poster: 'images/events/finals.jpg',     // optional — put the file in public/images/events/
  state: 'verified',
},
```

**You never have to move an event to the archive.** Anything dated in the past drops out of "Upcoming" and appears under "Past events" on its own, the day after it happens.

---

## 3. Announcements

**File:** `src/data/announcements.ts`

```ts
{
  id: 'a-006',
  title: 'Water supply interrupted on Wednesday',
  date: '2026-09-02',                   // the day it was issued
  priority: 'important',                // 'urgent' | 'important' | 'general'
  body: 'One or two sentences.',
  pinned: true,                         // optional — keeps it at the top of the feed
  expiresOn: '2026-09-04',              // optional — retires it automatically
  link: { label: 'Details', href: 'https://…' },  // optional
  state: 'verified',
},
```

| Priority | Colour | Where it shows |
|---|---|---|
| `urgent` | red | Homepage ticker, Madhouse Live, top of the feed |
| `important` | amber | Homepage ticker and feed |
| `general` | blue | Feed only |

`expiresOn` is the useful one — set it and the notice retires itself instead of sitting stale on the homepage for a month.

---

## 4. Council members

**File:** `src/data/council.ts`

Each card starts empty on purpose. To fill one in:

```ts
{
  id: 'c-gsec',
  role: 'General Secretary',
  group: 'Council',                     // 'Administration' or 'Council'
  name: 'Full Name',                    // ← was null
  affiliation: 'Third Year • Mechanical Engineering',
  bio: 'One or two sentences.',
  email: 'name@iitb.ac.in',             // adds an Email button
  phone: '+91XXXXXXXXXX',               // adds a Call button
  photo: 'images/council/gsec.jpg',     // put the file in public/images/council/
  state: 'verified',                    // ← flips the card out of placeholder styling
},
```

Leave any field as `null` to hide it. Setting `name` alone is enough to take the card out of its "awaiting details" state.

**Portrait photos:** square, at least 400×400px, ideally under 200 KB.

---

## 5. GC standings

**File:** `src/data/gc.ts`

Every position starts as `null`, which renders "Awaiting result" rather than a fake rank. When a result is declared:

```ts
{ year: 2026, category: 'Sports', position: 1, state: 'verified' },
```

`position` is the finishing rank out of `GC_TEAMS` (currently 18 — update that constant if the number of contesting hostels changes). Filling in a number updates the homepage cards, the GC page cards, the chart and the history table at once.

### Add a new season

```ts
export const gcResults: GCResult[] = [
  { year: 2027, category: 'Tech',   position: null, state: 'placeholder' },
  { year: 2027, category: 'Sports', position: null, state: 'placeholder' },
  { year: 2027, category: 'Cult',   position: null, state: 'placeholder' },
  { year: 2027, category: 'SUS',    position: null, state: 'placeholder' },
  ...gcResults,
]
```

The year selector picks up new years automatically.

---

## 6. Facilities

**File:** `src/data/amenities.ts`

```ts
{
  id: 'music-room',
  name: 'Music Room',
  tagline: 'Amps on, door closed, nobody complains',
  description: 'Two or three sentences.',
  photo: 'images/hostel/music-room.jpg',   // put the file in public/images/hostel/
  location: 'Ground floor, C wing',        // was null
  timings: '9:00 AM – 11:00 PM',           // was null
  bookable: true,                          // adds it to the booking module
  state: 'verified',
},
```

**Facility photos:** landscape, at least 1200px wide, ideally under 300 KB.

### Bookable equipment

The same file has `bookableEquipment` — sports gear, instruments, tech. Add or remove items freely; the booking form groups them by `category` on its own.

---

## 7. Photo gallery

**File:** `src/data/gallery.ts`

1. Put the image in `public/images/gallery/`
2. Add an entry:

```ts
{
  id: 'p-006',
  src: 'images/gallery/gc-football-2026.jpg',
  caption: 'The GC football semi-final, minutes before the equaliser',
  category: 'GC',              // GC | Tech | Sports | Cult | SUS | Events | Festivals | Hostel Life | Legacy
  ratio: 3 / 2,                // width ÷ height — keeps the grid from jumping
  year: 2026,                  // optional
  state: 'verified',
},
```

The category filter chips build themselves from whatever categories you actually use, with live counts. You do not maintain a separate filter list.

**Gallery photos:** at least 1200px on the long edge, under 400 KB each. Compress before committing — the whole gallery loads on the Resources page.

---

## 8. Legacy timeline

**File:** `src/data/gallery.ts`, the `legacy` array at the bottom.

It ships **empty on purpose** — no hostel history has been invented. The page shows a designed empty state until you add entries:

```ts
export const legacy: LegacyEntry[] = [
  {
    id: 'l-001',
    year: '2019',
    title: 'GC Sports champions',
    description: 'What happened, in two or three sentences.',
    photo: 'images/gallery/gc-2019.jpg',   // optional
    state: 'verified',
  },
]
```

This is the best page to crowdsource from alumni.

---

## 9. Emergency contacts, links and guides

**File:** `src/data/utilities.ts`

### Emergency numbers

Every number is `null` until confirmed. Fill one in:

```ts
{ id: 'em-security', label: 'Campus Security', phone: '+912225767000', detail: 'IIT Bombay Security Control Room', critical: true, state: 'verified' },
```

The card immediately becomes a one-tap `tel:` link on mobile — on the homepage, in Resources and in the footer. `critical: true` gives it red styling and puts it in the short list shown on the homepage and the Maintenance page.

### LAN and Wi-Fi settings

The guides list the right steps with bracketed placeholders for the values only the network administrator can confirm:

```ts
{ label: 'Default gateway', value: '[ To be confirmed ]' },
```

Replace the bracketed text with the real setting and set `state: 'verified'`.

### Hostel facts

`hostelFacts` drives the animated counters. **Do not add a statistic without a source.** The four present are the only ones the hostel has published.

---

## 10. Brand, navigation and social links

**File:** `src/data/site.ts`

### Social media

```ts
export const socials = [
  { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/…' },  // was null
]
```

While `href` is `null` the icon renders greyed out and unclickable, rather than linking somewhere wrong.

### Maintenance link

`CLR_TICKET_URL` is the hostel's live ticket system. Every "Report issue" button on the site points at it. If the hostel moves to a different system, change this one constant.

### Navigation

`navigation` is the seven top-level tabs. Adding an eighth means also adding a route in `src/App.tsx` — that is the one change that needs a developer.

---

## Adding photos: checklist

1. Compress first — [Squoosh](https://squoosh.app) is quick, aim for under 300 KB.
2. Name the file in lower case with hyphens: `gc-football-final-2026.jpg`.
3. Put it in the right folder:
   - `public/images/hostel/` — facilities and the building
   - `public/images/gallery/` — the photo roll
   - `public/images/council/` — council portraits
   - `public/images/events/` — event posters
4. Reference it **without a leading slash**: `images/gallery/file.jpg`.

That last point matters — the leading slash would break the site when it is served from `gymkhana.iitb.ac.in/~hostel4/`.

---

## Publishing your changes

```bash
npm run build
```

Then follow **[DEPLOYMENT.md](DEPLOYMENT.md)**.

If the build fails, read the error — it names the file and line. The most common causes are a missing comma, a missing quote, or a `category` spelled differently from the allowed list.

---

## Getting help

The data files are heavily commented; each one explains its own fields at the top. If something is still unclear, the type definitions in `src/types/content.ts` are the single source of truth for what every field accepts.
