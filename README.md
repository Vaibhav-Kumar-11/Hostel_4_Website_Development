# MADHOUSE — Hostel 4, IIT Bombay

The official website for **Hostel 4, IIT Bombay**, built for the Hostel 4 Website Development Competition.

> **1250+ Rooms. Thousands of Stories. One Madhouse.**

A fast, responsive, content-driven web portal for a hostel of over 1200 residents — mess menus that know what time it is, events that add themselves to your phone calendar, GC standings, facilities, and a one-tap route into the hostel's real maintenance ticket system.

---

## Table of contents

- [What it does](#what-it-does)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [Updating content](#updating-content)
- [Deployment](#deployment)
- [Design decisions](#design-decisions)
- [Accessibility & performance](#accessibility--performance)
- [Content integrity](#content-integrity)

---

## What it does

### The seven pages

| Page | What lives there |
|---|---|
| **Home** | Hero, Madhouse Live, the mess day, events + notices, hostel facts, GC preview, facilities, photo highlights, maintenance, location |
| **About** | Hostel identity, verified facts, full Council directory, legacy timeline, map |
| **GC** | Current General Championship standings, season history, position chart, results table |
| **Events** | Upcoming events, month calendar, past-event archive, full announcement feed |
| **Life** | All eight facilities with real photography, plus "A day in Madhouse" |
| **Resources** | Photo roll, room & equipment booking, LAN/Wi-Fi guides, important links, emergency contacts |
| **Maintenance** | Straight into the hostel's live CLR ticket system |

### Features worth calling out

**🔴 Madhouse Live** — the homepage answers "what is happening right now" from the actual system clock. It knows which meal is being served, how long is left in that window, what the next meal is and counts down to it to the second, what the next event is, and which notice is most urgent. Nothing about it is a static screenshot; change a timing in one data file and the whole homepage tells a different, correct story.

**⌘K command palette** — press `Cmd/Ctrl + K` (or `/`) anywhere to search every page, event, announcement and facility on the site. 1200 residents each want one different thing; this is the shortest path to any of them. Doubles as the search button in the mobile header.

**📅 One-tap calendar export** — every event generates a valid RFC 5545 `.ics` file in the browser and drops it into the resident's phone calendar. No server, no third-party calendar service, nothing leaves the device.

**🎫 Room & equipment booking** — a complete booking interface for the music room, dance room, common room, indoor sports room, sports gear, instruments and tech equipment. Slot picker, clash detection, validation and persistence. It is a **UI prototype and says so on screen** — see [Content integrity](#content-integrity).

**🖼 Photo roll** — masonry gallery with auto-derived category filters, a full-screen viewer with keyboard and swipe navigation, and lazy loading with reserved aspect ratios so filtering never makes the page jump.

**🌓 Light & dark themes** — a full second palette, not an inverted filter. Persisted per device and applied before first paint, so there is no white flash on a cold load.

**📱 Mobile-first navigation** — the mobile drawer leads with the five things residents actually open the site for: Mess, Events, Maintenance, Gallery, Emergency. Everything important is 1–2 taps away.

**🚨 Emergency contacts** — deliberately not a top-level tab. They appear on the homepage, in Resources and in the footer, and every card becomes a one-tap `tel:` link on mobile the moment a real number is supplied.

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **React 18 + TypeScript** | Typed content model; every data file is checked at build time |
| Build | **Vite 6** | Fast dev server, code-split production build |
| Styling | **Tailwind CSS 3.4** | Custom design tokens, no component library, no generic template look |
| Animation | **Framer Motion** | Scroll reveals, page transitions, lightbox and drawer motion |
| Routing | **React Router 6** (hash) | Deep links survive a refresh on the institute server — see [Deployment](#deployment) |
| Icons | **Lucide** | Consistent, tree-shaken |
| Fonts | **Fontsource** (Space Grotesk + Inter) | Self-hosted; no Google Fonts request, works behind the campus firewall and offline |

**Zero runtime third-party requests.** No CDN, no analytics, no tracker, no Google Fonts. The only external thing the site can load is the OpenStreetMap embed, and that only after the visitor clicks "Load the map".

---

## Quick start

Requires **Node.js 18+**.

```bash
git clone https://github.com/Vaibhav-Kumar-11/Hostel_4_Website_Development.git
```

```bash
cd Hostel_4_Website_Development && npm install
```

```bash
npm run dev
```

Open <http://localhost:5173>.

### All scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check, then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Type-check only |

---

## Project structure

```
.
├── public/
│   ├── images/hostel/        # Hostel photography (real photos only)
│   ├── favicon.svg
│   ├── manifest.webmanifest
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── layout/           # Navbar, Footer, Layout, CommandPalette
│   │   ├── ui/               # Section, Reveal, Stat, PageHeader, PlaceholderNote
│   │   ├── home/             # Hero, MadhouseLive, TodayAtMadhouse, …
│   │   ├── about/            # CouncilCard, LocationSection
│   │   ├── events/           # Cards, EventCalendar
│   │   ├── gc/               # StandingsCard
│   │   ├── life/             # AmenityCard
│   │   └── resources/        # Gallery, BookingModule, EmergencyContacts
│   ├── data/                 # ← ALL EDITABLE CONTENT LIVES HERE
│   ├── hooks/                # Theme, scroll, viewport, counters, hotkeys
│   ├── lib/                  # Mess clock, schedule, .ics builder, utils
│   ├── pages/                # One file per route
│   └── types/content.ts      # The content model
└── docs/
    ├── CONTENT_GUIDE.md      # How to update the site without touching components
    ├── DEPLOYMENT.md         # Institute server, Vercel, Netlify, GitHub Pages
    └── brief/                # The original competition brief
```

**No component contains hardcoded content.** Every fact on the site comes from `src/data/`. Swapping those files for a CMS or API later requires no changes to the UI layer.

---

## Updating content

Full walkthrough in **[docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md)**. The short version:

| To change… | Edit |
|---|---|
| Mess menu & timings | `src/data/mess.ts` |
| Events | `src/data/events.ts` |
| Announcements | `src/data/announcements.ts` |
| Council names & photos | `src/data/council.ts` |
| GC standings | `src/data/gc.ts` |
| Facilities | `src/data/amenities.ts` |
| Photo gallery & legacy timeline | `src/data/gallery.ts` |
| Emergency numbers, links, guides | `src/data/utilities.ts` |
| Brand, navigation, socials, map | `src/data/site.ts` |

Two things happen automatically and never need manual upkeep:

- **Events move themselves to the archive** the day after they happen.
- **Placeholder notices disappear on their own** once real data replaces the samples.

---

## Deployment

Full instructions in **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**.

```bash
npm run build
```

The build in `dist/` is fully static and **path-independent** — the same folder works at a domain root and at a sub-path, with no rebuild and no server configuration.

### Institute server (`gymkhana.iitb.ac.in/~hostel4/`)

Copy the contents of `dist/` into the hostel's `public_html` directory. Nothing else is required: no `.htaccess`, no rewrite rules, no Node runtime.

This works because of two deliberate choices:

1. **`base: './'`** in `vite.config.ts` — assets are referenced relatively, so the bundle does not care what path it is served from.
2. **Hash routing** — `/#/events` is resolved by the browser, never sent to Apache. A resident who refreshes on a deep link gets the page, not a 404. On an Apache user directory we cannot add rewrite rules, so history routing would break exactly there.

### Vercel / Netlify / GitHub Pages

Build command `npm run build`, output directory `dist`. No further configuration.

---

## Design decisions

**Identity before decoration.** The palette is pulled from the hostel's own night photography — the amber of the sodium lamps outside, the yellow of the common-room chairs, the orange of the reading-room dividers. Warm charcoal base, one accent colour used consistently, no gradient soup.

**Visual rhythm.** Sections alternate between full-bleed photography, dark cinematic bands, sunken panels and open editorial space, so a long homepage never reads as one stack of identical cards.

**Restraint in motion.** Scroll reveals, a parallax hero, counters that run once, and page transitions — all of which collapse to nothing under `prefers-reduced-motion`. Nothing animates that would make the site feel slow.

**No stock photography.** Every image is a real Hostel 4 photograph. Facilities without a photograph get a deliberate typographic card that says a photograph is pending, rather than borrowing a gym that is not this gym.

**No charting library.** Four series across three years does not justify shipping a plotting dependency. The GC chart is built from divs and inherits the theme for free.

---

## Accessibility & performance

- Semantic landmarks, one `h1` per page, correct heading order
- Skip-to-content link, visible focus rings, full keyboard operation (palette, lightbox, calendar, drawer)
- ARIA labels on every icon-only control; `aria-pressed` / `aria-expanded` on toggles
- `prefers-reduced-motion` honoured throughout
- Both themes meet WCAG AA contrast for body text
- Route-level code splitting — the homepage does not download the other six pages
- Lazy-loaded images with reserved aspect ratios (no layout shift)
- The map iframe loads only on request
- Theme applied before first paint

Production build: **~32 KB gzipped** of app JavaScript for the homepage, plus fonts.

---

## Content integrity

The competition brief is explicit that no factual information may be invented. This site takes that literally, and it is visible in the interface rather than buried in a comment:

- **No council member's name, photo, email or phone number has been made up.** The roles are real; each card shows a clean "awaiting details" state.
- **No GC result has been made up.** Every position is `null`, and the UI says "Awaiting result" instead of showing a fabricated rank.
- **No emergency phone number has been guessed.** Cards read "number pending" rather than offering a link that dials nowhere.
- **No hostel history has been written.** The legacy timeline ships empty, with a designed empty state inviting the Council and alumni to fill it.
- **No network settings have been guessed.** The LAN and Wi-Fi guides show the procedure, with bracketed placeholders for values only the network administrator can confirm.
- **The four hostel statistics are the only ones shown** — 1250+ rooms, largest hostel, individual balconies, one Madhouse — because they are the only ones the brief supplies.
- **Mess menus, events and announcements are clearly labelled sample data**, present so the Council can see what each priority level and layout looks like before supplying the real thing.
- **The booking module states on screen that it is a UI prototype** and that requests are stored on the device only. A resident who thinks they have reserved the music room and has not is worse off than one who knows the desk still has to confirm it.

Every one of these placeholders names the exact file to edit, and each disappears on its own once real data replaces it.

---

## Credits

Built for the Hostel 4 Website Development Competition.
Photography by Hostel 4 residents.

**Made for the Madhouse community.**
