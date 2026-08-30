# scripts

Local authoring tools. Nothing here ships to the website — these run on your own
machine and edit files in `src/data/`.

---

## `import-mess-menu.mjs`

Turns the mess council's weekly menu into the `weeklyMenu` array in
`src/data/mess.ts`, so nobody has to retype seven days of food by hand.

```bash
npm run mess:menu -- <file.pdf|file.tsv>            # preview only
npm run mess:menu -- <file.pdf|file.tsv> --write    # actually update mess.ts
```

or, equivalently:

```bash
node scripts/import-mess-menu.mjs <file.pdf|file.tsv> [--dry-run] [--write]
```

| Flag | Effect |
|---|---|
| *(none)* | Parse and print. Same as `--dry-run`. |
| `--dry-run` | Parse and print. Never touches `src/data/mess.ts`. |
| `--write` | Rewrite the `weeklyMenu` array. |
| `-h`, `--help` | Usage. |

Accepted inputs: `.pdf`, `.tsv`, `.txt`.

---

### What it prints

Every run prints the full 7 × 4 grid it is proposing, one day at a time, with
each meal marked either **`parsed`** (read out of your file) or **`kept`** (left
exactly as `src/data/mess.ts` already has it). Below that is a confidence
summary that names every slot it could not fill and why:

```
  Confidence
    Parsed from the file : 24 of 28 meal slots
    Kept as they were    : 4

    Not filled — src/data/mess.ts keeps its current values for these:
      Wednesday / Snacks       no text under the Snacks column on page 1
      Friday / Dinner          one entry was 84 characters long — probably a merged row
```

The script never guesses. A slot it is unsure about keeps its existing value and
appears in that list. If it cannot read anything at all, it prints nothing to
`mess.ts` and exits non-zero.

---

### About PDFs: this is best-effort, and you have to check it

**Read this before using `--write` on a PDF.**

A PDF has no idea it contains a table. It stores glyphs at coordinates, and the
script reconstructs rows and columns from those coordinates. That works well for
the ordinary case — a grid with a day column and four meal columns — and it can
also read menus written as `Monday` / `Breakfast: …` lines. But mess menus are
laid out by whoever had Word open that week, and some layouts simply cannot be
recovered from coordinates:

- a menu that is a **photograph or a scan** has no text at all — the script says
  so and stops;
- **merged or split cells**, or a stray column of dates, can shift text into the
  wrong meal;
- **two-line dish names** may arrive as two items, or two dishes may arrive as
  one;
- text in a **column that is not under its own heading** is dropped rather than
  filed under a neighbour.

So the workflow is always the same: run it without `--write`, read the preview
against the actual PDF, and only then re-run with `--write`. If the preview is
wrong in more than a couple of places, use the TSV route instead — it will be
faster than correcting the result by hand.

After `--write`, `git diff src/data/mess.ts` shows exactly what changed. Nothing
in that file except the `weeklyMenu` array is ever touched: the header comment,
`mealWindows`, `MESS_DATA_VERIFIED` and `weekdayNames` are left alone, and the
script refuses to write at all if the result would lose one of them.

---

### The TSV route (exact, no guessing)

When the PDF will not cooperate — or you would rather just be certain — retype
the menu as a tab-separated file. Nothing is inferred: what you type is what
lands in `mess.ts`.

**Five columns, separated by a real Tab character:**

```
Day <TAB> Breakfast <TAB> Lunch <TAB> Snacks <TAB> Dinner
```

- **Column 1** — the day. `Sunday` or `Sun`, any capitalisation.
- **Columns 2–5** — the four meals, in that order. Items separated by **commas**.
- One row per day. Days may be in any order; you do not need all seven.
- A **header row** is optional and is skipped if present.
- Lines starting with `#` are comments. Blank lines are ignored.
- An **empty cell**, or a lone `-`, means *keep whatever `mess.ts` already has*
  for that meal. It does not mean "no food".
- ALL-CAPS text is converted to Title Case, because that is how the site sets it.
  Mixed-case text is left exactly as you typed it.

**Example** — save as `menu.tsv`:

```
Day	Breakfast	Lunch	Snacks	Dinner
Sunday	Aloo Paratha, Curd, Pickle, Tea / Coffee	Chole, Jeera Rice, Roti, Salad	Samosa, Green Chutney, Tea	Paneer Butter Masala, Dal Fry, Rice, Roti
Monday	Idli, Sambar, Coconut Chutney, Milk	Rajma, Rice, Roti, Salad	Poha, Sev, Tea	Mix Veg, Dal Tadka, Rice, Roti
```

Then:

```bash
npm run mess:menu -- menu.tsv --write
```

> **Making the file:** most spreadsheet apps export this directly — in Excel or
> Google Sheets, *Save as / Download → Tab-separated values (.tsv)*. If you are
> typing it in a text editor, make sure your editor is inserting real Tabs and
> not spaces; the script will tell you if it finds none.

---

### Errors you might see

| Message | What to do |
|---|---|
| `No such file: …` | Check the path. Paths are relative to where you ran the command. |
| `… has no text layer — it is almost certainly a scan` | The PDF is an image. Use the TSV route. |
| `Could not open … as a PDF — …` | The file is corrupt, or not really a PDF. Ask for it again. |
| `no tabs found — columns must be separated by a Tab` | Your editor inserted spaces. Re-export from a spreadsheet. |
| `"…" is not a day name` | Column 1 of that line is not a weekday. Fix or delete the line. |
| `Nothing could be read from this file` | Nothing recognisable was found; `mess.ts` was left alone. |

---

### After a successful import

1. `git diff src/data/mess.ts` — read the change.
2. `npm run dev` — check the homepage meal cards and the week table.
3. `npm run build` — this is what would catch a broken file.
4. Once the menu **and** the meal timings are the real published ones, set
   `MESS_DATA_VERIFIED = true` in `src/data/mess.ts`.

The maintainer-facing version of these instructions, including how to publish the
PDF itself, lives in [`docs/CONTENT_GUIDE.md`](../docs/CONTENT_GUIDE.md).
