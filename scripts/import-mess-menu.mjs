#!/usr/bin/env node
/**
 * ── MESS MENU IMPORTER ──────────────────────────────────────────────────────
 *
 * Turns the mess council's weekly menu into the `weeklyMenu` array in
 * src/data/mess.ts, so nobody has to retype seven days of food by hand.
 *
 *   node scripts/import-mess-menu.mjs <file.pdf|file.tsv> [--dry-run] [--write]
 *
 * Two input routes, on purpose:
 *
 *   .tsv / .txt  Exact. Five tab-separated columns, one row per day. Nothing is
 *                inferred, so what you type is what you get.
 *
 *   .pdf         Convenient but best-effort. Mess PDFs have no standard layout,
 *                so text extraction is a reconstruction, not a read. The script
 *                prints everything it believes it found and refuses to fill a
 *                cell it is not confident about. Eyeball the preview before you
 *                pass --write.
 *
 * The guiding rule is the same one the website follows: never invent a fact. An
 * uncertain cell keeps whatever src/data/mess.ts already had, and the run says
 * so out loud.
 *
 * See scripts/README.md for the file formats and docs/CONTENT_GUIDE.md for the
 * maintainer's version of these instructions.
 */

import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

/* ── Shape of the target data ────────────────────────────────────────────── */

/** Index 0 = Sunday, matching Date#getDay() and src/data/mess.ts. */
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/** Must stay in sync with `MealKey` in src/types/content.ts. */
const MEAL_KEYS = ['breakfast', 'lunch', 'snacks', 'dinner']

const MEAL_LABELS = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  snacks: 'Snacks',
  dinner: 'Dinner',
}

/** Column headings seen on real mess menus, mapped onto our four meal keys. */
const MEAL_ALIASES = {
  breakfast: ['breakfast', 'break fast', 'breakfeast', 'bfast', 'b fast', 'morning'],
  lunch: ['lunch', 'afternoon', 'noon meal'],
  snacks: ['snacks', 'snack', 'evening snacks', 'evening snack', 'evening', 'tea', 'high tea', 'tiffin'],
  dinner: ['dinner', 'supper', 'night meal'],
}

/**
 * Words that are structure, never food.
 *
 * Deliberately narrower than MEAL_ALIASES: "Tea" is a column heading on some
 * menus and a genuine breakfast item on every one of them, so it is allowed
 * through here and only treated as a heading when a whole row agrees.
 */
const STRUCTURAL_WORDS = new Set([
  'breakfast', 'break fast', 'bfast', 'lunch', 'snacks', 'snack', 'evening snacks',
  'dinner', 'supper', 'day', 'date', 'menu', 'week', 'weekly menu', 'mess menu', 'meal',
])

const DAY_ALIASES = [
  ['sunday', 'sun'],
  ['monday', 'mon'],
  ['tuesday', 'tue', 'tues'],
  ['wednesday', 'wed', 'weds'],
  ['thursday', 'thu', 'thur', 'thurs'],
  ['friday', 'fri'],
  ['saturday', 'sat'],
]

/* ── Sanity limits ───────────────────────────────────────────────────────── */

/*
  A cell that breaks one of these almost always means the layout was read
  wrongly — two columns merged, or a whole row swept into one box. Rather than
  write a plausible-looking mess, the cell is refused and reported.
*/
const MAX_ITEMS_PER_MEAL = 16
const MAX_ITEM_LENGTH = 60

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const MESS_FILE = path.join(ROOT, 'src', 'data', 'mess.ts')

/* ── Errors the user should see as one line, never as a stack ────────────── */

class CliError extends Error {}

/* ── Terminal formatting ─────────────────────────────────────────────────── */

const useColour = process.stdout.isTTY && !process.env.NO_COLOR
const ESC = String.fromCharCode(27)
const paint = (code) => (s) => (useColour ? `${ESC}[${code}m${s}${ESC}[0m` : String(s))
const bold = paint('1')
const dim = paint('2')
const green = paint('32')
const yellow = paint('33')
const cyan = paint('36')

const out = (line = '') => process.stdout.write(`${line}\n`)

/* ── Argument parsing ────────────────────────────────────────────────────── */

const USAGE = `
Import a weekly mess menu into src/data/mess.ts

  node scripts/import-mess-menu.mjs <file.pdf|file.tsv> [--dry-run] [--write]
  npm run mess:menu -- <file.pdf|file.tsv> [--write]

  --dry-run   Parse and print only. This is the default.
  --write     Rewrite the weeklyMenu array in src/data/mess.ts.
  -h, --help  Show this message.

TSV columns (tab-separated, one row per day, items separated by commas):

  Day <TAB> Breakfast <TAB> Lunch <TAB> Snacks <TAB> Dinner

Leave a cell empty to keep whatever src/data/mess.ts already has for it.
Full format notes live in scripts/README.md.
`.trim()

function parseArgs(argv) {
  const files = []
  let write = false
  let dryRun = false

  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') return { help: true }
    else if (arg === '--write') write = true
    else if (arg === '--dry-run') dryRun = true
    else if (arg.startsWith('-')) throw new CliError(`Unknown option "${arg}". Run with --help to see the usage.`)
    else files.push(arg)
  }

  if (write && dryRun) throw new CliError('--write and --dry-run cannot be used together — pick one.')
  if (files.length > 1) throw new CliError(`Expected one input file, got ${files.length}. Import one menu at a time.`)

  return { help: false, file: files[0], write }
}

/* ── Text helpers ────────────────────────────────────────────────────────── */

const squash = (s) => String(s).replace(/\s+/g, ' ').trim()

/** Lowercased, punctuation-stripped form used for matching headings. */
function key(s) {
  return squash(s).toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim()
}

function matchMeal(text) {
  const k = key(text)
  if (!k) return null
  for (const meal of MEAL_KEYS) {
    if (MEAL_ALIASES[meal].includes(k)) return meal
  }
  return null
}

/** 'Monday' / 'MON 01-09' / 'Mon.' → 1. Returns -1 when the text is not a day. */
function matchDay(text) {
  const k = key(text)
  if (!k) return -1
  const first = k.split(' ')[0]
  for (let i = 0; i < DAY_ALIASES.length; i += 1) {
    if (DAY_ALIASES[i].includes(first)) return i
  }
  return -1
}

const isAllCaps = (s) => /[A-Z]/.test(s) && s === s.toUpperCase()

/** 'ALOO PARATHA' → 'Aloo Paratha'. Mixed-case text is left exactly as written. */
function titleCase(s) {
  return s.replace(/[A-Za-z][A-Za-z']*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
}

/**
 * Normalises one menu item, or returns '' if the fragment is not an item at all
 * — a stray time, a page number, a rule character left over from a table border.
 */
function cleanItem(raw) {
  let s = squash(raw)
  s = s.replace(/^[\s\-–—*•·.>»)\]|]+/, '').replace(/[\s\-–—*•·,;:|]+$/, '')
  s = squash(s)
  if (s.length < 2) return ''
  if (!/[A-Za-z]/.test(s)) return ''
  // Times, weights, page numbers and similar: no letters worth keeping.
  if (/^[\d\s.:,/()\-]*(am|pm|hrs?|no|page)?[\d\s.:,/()\-]*$/i.test(s)) return ''
  if (matchDay(s) >= 0 && key(s).split(' ').length === 1) return ''
  if (STRUCTURAL_WORDS.has(key(s))) return ''
  return isAllCaps(s) ? titleCase(s) : s
}

/**
 * Splits the raw lines of one table cell into menu items.
 *
 * Items are separated by commas on a line, or by the line break itself. A line
 * that opens in lower case is treated as the tail of the item above it, which
 * is how a wrapped "Paneer Butter / Masala" survives the round trip.
 */
function splitItems(lines) {
  const items = []
  for (const line of lines) {
    const parts = String(line).split(/[,;|•·]+/).map(squash).filter(Boolean)
    if (!parts.length) continue
    if (items.length && /^[a-z(]/.test(parts[0]) && !/[,;|]/.test(String(line))) {
      items[items.length - 1] = `${items[items.length - 1]} ${parts.shift()}`
    }
    items.push(...parts)
  }

  const cleaned = []
  for (const item of items) {
    const value = cleanItem(item)
    if (value && !cleaned.some((existing) => existing.toLowerCase() === value.toLowerCase())) {
      cleaned.push(value)
    }
  }
  return cleaned
}

/* ── The parse result ────────────────────────────────────────────────────── */

/**
 * A grid of 7 days x 4 meals. `null` means "not parsed" — never "empty" — and
 * every null carries a reason so the report can explain itself.
 */
function emptyGrid() {
  return WEEKDAYS.map(() => ({
    breakfast: null,
    lunch: null,
    snacks: null,
    dinner: null,
  }))
}

function reasonStore() {
  return WEEKDAYS.map(() => ({}))
}

/**
 * Accepts a parsed cell, or records why it was refused.
 * Never overwrites a cell that has already been accepted.
 */
function offer(grid, reasons, dayIndex, meal, items, source) {
  if (grid[dayIndex][meal] !== null) return
  if (!items || items.length === 0) {
    reasons[dayIndex][meal] ??= `nothing readable ${source}`
    return
  }
  if (items.length > MAX_ITEMS_PER_MEAL) {
    reasons[dayIndex][meal] = `${items.length} items ${source} — columns probably ran together`
    return
  }
  const runOn = items.find((item) => item.length > MAX_ITEM_LENGTH)
  if (runOn) {
    reasons[dayIndex][meal] = `one entry ${source} was ${runOn.length} characters long — probably a merged row`
    return
  }
  grid[dayIndex][meal] = items
  delete reasons[dayIndex][meal]
}

/* ── TSV / TXT input ─────────────────────────────────────────────────────── */

/**
 * The reliable route. Tab-separated, day name first, then the four meals with
 * items comma-separated. A header row is optional and is skipped if present.
 */
function parseDelimited(text, fileLabel) {
  const grid = emptyGrid()
  const reasons = reasonStore()
  const seen = new Map()
  const problems = []
  let rows = 0

  const lines = text.split(/\r?\n/)

  for (let n = 0; n < lines.length; n += 1) {
    const line = lines[n]
    const lineNo = n + 1
    if (!line.trim() || line.trim().startsWith('#')) continue

    if (!line.includes('\t')) {
      problems.push(`line ${lineNo}: no tabs found — columns must be separated by a Tab, not spaces`)
      continue
    }

    const cells = line.split('\t').map((c) => c.trim())
    const dayIndex = matchDay(cells[0])

    if (dayIndex < 0) {
      // A header row is the one legal non-day first cell.
      const looksLikeHeader = cells.slice(1).some((c) => matchMeal(c)) || key(cells[0]) === 'day'
      if (looksLikeHeader && rows === 0) continue
      problems.push(`line ${lineNo}: "${squash(cells[0]).slice(0, 24) || '(blank)'}" is not a day name`)
      continue
    }

    if (seen.has(dayIndex)) {
      problems.push(`line ${lineNo}: ${WEEKDAYS[dayIndex]} already appeared on line ${seen.get(dayIndex)}`)
      continue
    }
    seen.set(dayIndex, lineNo)
    rows += 1

    for (let c = 0; c < MEAL_KEYS.length; c += 1) {
      const meal = MEAL_KEYS[c]
      const cell = cells[c + 1]
      if (cell === undefined) {
        reasons[dayIndex][meal] = `column missing on line ${lineNo}`
        continue
      }
      if (!cell || cell === '-' || cell === '—') {
        reasons[dayIndex][meal] = `left blank on line ${lineNo}`
        continue
      }
      offer(grid, reasons, dayIndex, meal, splitItems([cell]), `on line ${lineNo}`)
    }
  }

  if (rows === 0) {
    const detail = problems.length ? ` First problem — ${problems[0]}.` : ''
    throw new CliError(`No day rows found in ${fileLabel}.${detail} See scripts/README.md for the TSV format.`)
  }

  for (let d = 0; d < WEEKDAYS.length; d += 1) {
    if (!seen.has(d)) {
      for (const meal of MEAL_KEYS) reasons[d][meal] ??= 'no row for this day in the file'
    }
  }

  return { grid, reasons, problems, notes: [`Read ${rows} day ${rows === 1 ? 'row' : 'rows'} from the file.`] }
}

/* ── PDF input ───────────────────────────────────────────────────────────── */

/**
 * Pulls positioned text out of a PDF, one page at a time.
 *
 * pdf.js gives back loose fragments with coordinates rather than lines, so
 * fragments are clustered back into rows by their baseline before anything
 * tries to read meaning into them.
 */
async function pdfPages(file, fileLabel) {
  let pdfjs
  try {
    pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  } catch {
    throw new CliError('pdfjs-dist is not installed. Run `npm install` in the project root and try again.')
  }

  let bytes
  try {
    bytes = new Uint8Array(await readFile(file))
  } catch (error) {
    throw new CliError(`Could not read ${fileLabel} (${error.code ?? error.message}).`)
  }

  const task = pdfjs.getDocument({
    data: bytes,
    isEvalSupported: false,
    useWorkerFetch: false,
    useSystemFonts: false,
    disableFontFace: true,
    verbosity: 0,
  })

  let doc
  try {
    doc = await task.promise
  } catch (error) {
    const why = error?.name === 'PasswordException' ? 'it is password protected' : squash(error?.message ?? 'unrecognised format')
    throw new CliError(`Could not open ${fileLabel} as a PDF — ${why.replace(/\.$/, '')}.`)
  }

  const pages = []
  try {
    for (let p = 1; p <= doc.numPages; p += 1) {
      const page = await doc.getPage(p)
      const content = await page.getTextContent()
      const fragments = []

      for (const item of content.items) {
        if (typeof item.str !== 'string' || !item.str.trim()) continue
        const x = item.transform[4]
        const y = item.transform[5]
        const height = Math.abs(item.transform[3]) || item.height || 10
        fragments.push({ text: item.str, x, y, width: item.width ?? 0, height })
      }

      page.cleanup()
      pages.push(clusterRows(fragments))
    }
  } catch (error) {
    throw new CliError(`${fileLabel} could not be read past page ${pages.length + 1} — ${squash(error?.message ?? 'the file looks damaged')}.`)
  } finally {
    await task.destroy()
  }

  if (pages.every((rows) => rows.length === 0)) {
    throw new CliError(
      `${fileLabel} has no text layer — it is almost certainly a scan or a photograph. Retype it as a TSV instead (see scripts/README.md).`,
    )
  }

  return pages
}

/** Groups fragments sharing a baseline into rows, each sorted left to right. */
function clusterRows(fragments) {
  if (!fragments.length) return []
  const sorted = [...fragments].sort((a, b) => b.y - a.y || a.x - b.x)
  const rows = []
  let current = [sorted[0]]

  for (let i = 1; i < sorted.length; i += 1) {
    const frag = sorted[i]
    const tolerance = Math.max(2, Math.min(frag.height, current[0].height) * 0.6)
    if (Math.abs(frag.y - current[0].y) <= tolerance) current.push(frag)
    else {
      rows.push(current)
      current = [frag]
    }
  }
  rows.push(current)

  return rows.map((row) => {
    const cells = mergeAdjacent([...row].sort((a, b) => a.x - b.x))
    return { cells, text: squash(cells.map((c) => c.text).join(' ')) }
  })
}

/**
 * Joins fragments that sit shoulder to shoulder into one cell.
 *
 * pdf.js hands back whatever chunks the generator happened to emit — sometimes
 * a whole table cell, sometimes one word at a time. A gap narrower than half a
 * line height is read as a word space and the fragments are joined with a
 * space; a wider one is read as a column boundary and starts a new cell. Words
 * are never fused, because "AlooParatha" would sail past every later check
 * while a stray space is obvious in the preview.
 */
function mergeAdjacent(row) {
  const cells = []
  for (const frag of row) {
    const last = cells[cells.length - 1]
    const gap = last ? frag.x - (last.x + last.width) : Infinity
    if (last && gap < Math.max(2.5, frag.height * 0.5)) {
      last.text = `${last.text}${gap > frag.height * 0.06 ? ' ' : ''}${frag.text}`
      last.width = Math.max(last.x + last.width, frag.x + frag.width) - last.x
    } else {
      cells.push({ text: frag.text, x: frag.x, width: frag.width, height: frag.height })
    }
  }
  return cells.map((c) => ({ ...c, text: squash(c.text), centre: c.x + c.width / 2 })).filter((c) => c.text)
}

/**
 * Strategy A — the table.
 *
 * Finds the row that carries the meal headings, takes its column positions, and
 * assigns every later fragment to the nearest column. A fragment that lands too
 * far from any column is dropped rather than forced into one.
 */
function parseTable(rows, grid, reasons, pageNo) {
  let header = null
  let headerScore = 1

  for (let r = 0; r < rows.length; r += 1) {
    const found = new Map()
    for (const cell of rows[r].cells) {
      const meal = matchMeal(cell.text)
      if (meal && !found.has(meal)) found.set(meal, cell)
    }
    if (found.size > headerScore) {
      headerScore = found.size
      header = { index: r, columns: found }
    }
  }

  if (!header) return { used: false, note: null }

  const columns = [...header.columns.entries()]
    .map(([meal, cell]) => ({ meal, centre: cell.centre }))
    .sort((a, b) => a.centre - b.centre)

  const gaps = columns.slice(1).map((c, i) => c.centre - columns[i].centre)
  const spread = gaps.length ? Math.min(...gaps) : 160
  const reach = Math.max(40, spread * 0.75)
  const leftEdge = columns[0].centre - reach

  /** Accumulates the lines of every cell for one day. */
  let day = null
  const flush = () => {
    if (!day) return
    for (const meal of MEAL_KEYS) {
      if (!(meal in day.cells)) continue
      offer(grid, reasons, day.index, meal, splitItems(day.cells[meal]), `under the ${MEAL_LABELS[meal]} column on page ${pageNo}`)
    }
    for (const meal of MEAL_KEYS) {
      if (!(meal in day.cells)) reasons[day.index][meal] ??= `no text under the ${MEAL_LABELS[meal]} column on page ${pageNo}`
    }
    day = null
  }

  for (let r = header.index + 1; r < rows.length; r += 1) {
    const cells = rows[r].cells
    if (!cells.length) continue

    // A row whose leftmost cell names a day starts a new day block.
    const lead = cells[0]
    const dayIndex = lead.centre < leftEdge ? matchDay(lead.text) : -1
    const body = dayIndex >= 0 ? cells.slice(1) : cells

    if (dayIndex >= 0) {
      flush()
      day = { index: dayIndex, cells: {} }
    }
    if (!day) continue

    for (const cell of body) {
      if (cell.centre < leftEdge) continue
      let best = null
      let bestDistance = Infinity
      for (const column of columns) {
        const distance = Math.abs(cell.centre - column.centre)
        if (distance < bestDistance) {
          bestDistance = distance
          best = column
        }
      }
      if (!best || bestDistance > reach) continue
      ;(day.cells[best.meal] ??= []).push(cell.text)
    }
  }
  flush()

  const missing = MEAL_KEYS.filter((meal) => !header.columns.has(meal))
  return {
    used: true,
    note: missing.length
      ? `Page ${pageNo}: found a table with ${header.columns.size} of 4 meal columns — no heading for ${missing.map((m) => MEAL_LABELS[m]).join(', ')}.`
      : `Page ${pageNo}: read a 4-column table.`,
  }
}

/**
 * Strategy B — the list.
 *
 * For menus written as prose: a day heading, then a labelled line per meal.
 * Runs after the table pass and only fills cells the table left empty.
 */
function parseLabelledLines(rows, grid, reasons, pageNo) {
  let dayIndex = -1
  let meal = null
  const buffer = new Map()
  let filled = 0

  const stash = (d, m, line) => {
    const id = `${d}:${m}`
    if (!buffer.has(id)) buffer.set(id, [])
    buffer.get(id).push(line)
  }

  for (const row of rows) {
    const line = row.text
    if (!line) continue

    const heading = matchDay(line)
    // A day heading is a short line, not a sentence that happens to start with 'Sat'.
    if (heading >= 0 && key(line).split(' ').length <= 4) {
      dayIndex = heading
      meal = null
      continue
    }
    if (dayIndex < 0) continue

    const labelled = /^([A-Za-z][A-Za-z /]{2,20}?)\s*[:\-–]\s*(.*)$/.exec(line)
    if (labelled) {
      const found = matchMeal(labelled[1])
      if (found) {
        meal = found
        if (labelled[2].trim()) stash(dayIndex, meal, labelled[2])
        continue
      }
    }
    if (meal) stash(dayIndex, meal, line)
  }

  for (const [id, lines] of buffer) {
    const [d, m] = id.split(':')
    const index = Number(d)
    if (grid[index][m] !== null) continue
    offer(grid, reasons, index, m, splitItems(lines), `after the "${MEAL_LABELS[m]}" heading on page ${pageNo}`)
    if (grid[index][m] !== null) filled += 1
  }

  return filled
}

async function parsePdf(file, fileLabel) {
  const pages = await pdfPages(file, fileLabel)
  const grid = emptyGrid()
  const reasons = reasonStore()
  const notes = []

  for (let p = 0; p < pages.length; p += 1) {
    const rows = pages[p]
    if (!rows.length) continue
    const table = parseTable(rows, grid, reasons, p + 1)
    if (table.note) notes.push(table.note)
    const listed = parseLabelledLines(rows, grid, reasons, p + 1)
    if (listed) notes.push(`Page ${p + 1}: filled ${listed} more ${listed === 1 ? 'cell' : 'cells'} from labelled lines.`)
    if (!table.used && !listed) notes.push(`Page ${p + 1}: no menu structure recognised.`)
  }

  for (let d = 0; d < WEEKDAYS.length; d += 1) {
    for (const meal of MEAL_KEYS) {
      if (grid[d][meal] === null) reasons[d][meal] ??= 'this day was not found in the PDF'
    }
  }

  return { grid, reasons, problems: [], notes }
}

/* ── Reading and rewriting src/data/mess.ts ──────────────────────────────── */

/** Walks past a string literal, honouring backslash escapes. */
function skipString(src, start) {
  const quote = src[start]
  for (let i = start + 1; i < src.length; i += 1) {
    if (src[i] === '\\') { i += 1; continue }
    if (src[i] === quote) return i
  }
  return -1
}

/** Index of the bracket closing the one at `open`, ignoring strings and comments. */
function matchBracket(src, open) {
  const opener = src[open]
  const closer = opener === '[' ? ']' : opener === '{' ? '}' : null
  if (!closer) return -1
  let depth = 0

  for (let i = open; i < src.length; i += 1) {
    const ch = src[i]
    if (ch === '/' && src[i + 1] === '/') {
      const eol = src.indexOf('\n', i)
      if (eol < 0) return -1
      i = eol
      continue
    }
    if (ch === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2)
      if (end < 0) return -1
      i = end + 1
      continue
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      i = skipString(src, i)
      if (i < 0) return -1
      continue
    }
    if (ch === opener) depth += 1
    else if (ch === closer) {
      depth -= 1
      if (depth === 0) return i
    }
  }
  return -1
}

function unescapeLiteral(raw) {
  return raw.replace(/\\(.)/g, (_, ch) => (ch === 'n' ? '\n' : ch === 't' ? '\t' : ch))
}

/** Every string literal directly inside the array opening at `open`. */
function readStringArray(src, open) {
  const close = matchBracket(src, open)
  if (close < 0) return null
  const values = []
  for (let i = open + 1; i < close; i += 1) {
    const ch = src[i]
    if (ch === '/' && src[i + 1] === '/') {
      const eol = src.indexOf('\n', i)
      if (eol < 0 || eol > close) break
      i = eol
      continue
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      const end = skipString(src, i)
      if (end < 0 || end > close) return null
      values.push(unescapeLiteral(src.slice(i + 1, end)))
      i = end
    }
  }
  return values
}

/** Locates `weeklyMenu` and reads the seven day objects out of it. */
function readWeeklyMenu(src) {
  const decl = /export\s+const\s+weeklyMenu\b[^=]*=\s*/.exec(src)
  if (!decl) throw new CliError('Could not find `export const weeklyMenu` in src/data/mess.ts — has the file been restructured?')

  const open = decl.index + decl[0].length
  if (src[open] !== '[') throw new CliError('`weeklyMenu` in src/data/mess.ts is not an array literal — cannot rewrite it safely.')

  const close = matchBracket(src, open)
  if (close < 0) throw new CliError('The `weeklyMenu` array in src/data/mess.ts is not closed — fix the file first.')

  const days = []
  for (let i = open + 1; i < close; i += 1) {
    if (src[i] !== '{') continue
    const objectEnd = matchBracket(src, i)
    if (objectEnd < 0) break
    const object = src.slice(i, objectEnd + 1)
    const day = {}
    for (const meal of MEAL_KEYS) {
      const at = new RegExp(`(^|[\\s{,])${meal}\\s*:\\s*\\[`).exec(object)
      day[meal] = at ? (readStringArray(object, object.indexOf('[', at.index + at[0].length - 1)) ?? []) : []
    }
    days.push(day)
    i = objectEnd
  }

  if (days.length !== WEEKDAYS.length) {
    throw new CliError(`Expected 7 days in weeklyMenu, found ${days.length}. Fix src/data/mess.ts before importing.`)
  }

  return { days, open, close }
}

const quote = (s) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`

function renderWeeklyMenu(days, eol) {
  const lines = ['[']
  days.forEach((day, index) => {
    lines.push('  {')
    lines.push(`    // ${WEEKDAYS[index]}`)
    for (const meal of MEAL_KEYS) {
      lines.push(`    ${meal}: [${day[meal].map(quote).join(', ')}],`)
    }
    lines.push('  },')
  })
  lines.push(']')
  return lines.join(eol)
}

/**
 * Rewrites only the `weeklyMenu` array. Everything else in the file — the
 * header comment, `mealWindows`, `MESS_DATA_VERIFIED`, `weekdayNames` — is
 * untouched text on either side of the replaced span, and is checked again
 * before the write is allowed through.
 */
async function writeWeeklyMenu(src, merged) {
  const { open, close } = readWeeklyMenu(src)
  const eol = src.includes('\r\n') ? '\r\n' : '\n'
  const next = src.slice(0, open) + renderWeeklyMenu(merged, eol) + src.slice(close + 1)

  for (const guard of ['MESS_DATA_VERIFIED', 'mealWindows', 'weekdayNames']) {
    if (!next.includes(guard)) throw new CliError(`Refusing to write — the rewrite would have dropped \`${guard}\`. src/data/mess.ts is unchanged.`)
  }
  // Re-parse the result rather than trusting the splice.
  readWeeklyMenu(next)

  await writeFile(MESS_FILE, next, 'utf8')
}

/* ── Reporting ───────────────────────────────────────────────────────────── */

function wrap(text, width, indent) {
  const words = text.split(' ')
  const lines = []
  let line = ''
  for (const word of words) {
    if (line && line.length + 1 + word.length > width) {
      lines.push(line)
      line = word
    } else line = line ? `${line} ${word}` : word
  }
  if (line) lines.push(line)
  return lines.map((l, i) => (i === 0 ? l : `${indent}${l}`)).join('\n')
}

function report({ grid, reasons, problems, notes }, existing, label) {
  const width = Math.max(60, Math.min(process.stdout.columns || 100, 110))

  out()
  out(bold(`Mess menu import — ${label}`))
  for (const note of notes) out(dim(`  ${note}`))
  out()

  const unfilled = []
  let parsed = 0

  for (let d = 0; d < WEEKDAYS.length; d += 1) {
    out(`  ${bold(WEEKDAYS[d].toUpperCase())}`)
    for (const meal of MEAL_KEYS) {
      const fresh = grid[d][meal]
      const items = fresh ?? existing[d][meal]
      const status = fresh ? green('parsed') : yellow('kept  ')
      if (fresh) parsed += 1
      else unfilled.push({ day: d, meal, why: reasons[d][meal] ?? 'not found' })
      const head = `    ${MEAL_LABELS[meal].padEnd(10)} ${status}  `
      const body = items.length ? items.join(', ') : dim('(empty)')
      out(head + wrap(body, width - 24, ' '.repeat(24)))
    }
    out()
  }

  const total = WEEKDAYS.length * MEAL_KEYS.length
  out(bold('  Confidence'))
  out(`    Parsed from the file : ${parsed} of ${total} meal slots`)
  out(`    Kept as they were    : ${total - parsed}`)

  if (unfilled.length) {
    out()
    out(`    ${yellow('Not filled — src/data/mess.ts keeps its current values for these:')}`)
    for (const { day, meal, why } of unfilled) {
      out(`      ${(`${WEEKDAYS[day]} / ${MEAL_LABELS[meal]}`).padEnd(24)} ${dim(why)}`)
    }
  }

  if (problems.length) {
    out()
    out(`    ${yellow('Lines skipped:')}`)
    for (const problem of problems.slice(0, 12)) out(`      ${problem}`)
    if (problems.length > 12) out(dim(`      …and ${problems.length - 12} more`))
  }

  out()
  return { parsed, total }
}

/* ── Main ────────────────────────────────────────────────────────────────── */

async function main() {
  const args = parseArgs(process.argv.slice(2))

  if (args.help) {
    out(USAGE)
    return 0
  }
  if (!args.file) {
    out(USAGE)
    return 1
  }

  const file = path.resolve(process.cwd(), args.file)
  const label = path.relative(process.cwd(), file) || path.basename(file)
  const extension = path.extname(file).toLowerCase()

  if (!['.pdf', '.tsv', '.txt'].includes(extension)) {
    throw new CliError(
      extension
        ? `${label} has a ${extension} extension — expected .pdf, .tsv or .txt.`
        : `${label} has no file extension — expected .pdf, .tsv or .txt.`,
    )
  }

  let result
  if (extension === '.pdf') {
    result = await parsePdf(file, label)
  } else {
    let text
    try {
      text = await readFile(file, 'utf8')
    } catch (error) {
      throw new CliError(
        error.code === 'ENOENT' ? `No such file: ${label}` : `Could not read ${label} (${error.code ?? error.message}).`,
      )
    }
    result = parseDelimited(text, label)
  }

  let source
  try {
    source = await readFile(MESS_FILE, 'utf8')
  } catch {
    throw new CliError('Could not read src/data/mess.ts — run this from inside the project.')
  }
  const { days: existing } = readWeeklyMenu(source)

  const { parsed } = report(result, existing, label)

  if (parsed === 0) {
    out(`  ${yellow('Nothing could be read from this file. src/data/mess.ts is unchanged.')}`)
    out(dim('  If the PDF is a scan, or its layout is unusual, retype the menu as a TSV — see scripts/README.md.'))
    out()
    return 1
  }

  if (!args.write) {
    out(`  ${cyan('Dry run — nothing was written.')}`)
    out(dim('  Read every row above against the menu you were given, then re-run with --write.'))
    out()
    return 0
  }

  const merged = existing.map((day, d) => {
    const next = {}
    for (const meal of MEAL_KEYS) next[meal] = result.grid[d][meal] ?? day[meal]
    return next
  })

  await writeWeeklyMenu(source, merged)

  out(`  ${green('Updated src/data/mess.ts')} — ${parsed} of ${WEEKDAYS.length * MEAL_KEYS.length} meal slots refreshed.`)
  out(dim('  Review the change with `git diff src/data/mess.ts`, then run `npm run build`.'))
  out(dim('  Once the menu and timings are the real published ones, set MESS_DATA_VERIFIED = true.'))
  out()
  return 0
}

main()
  .then((code) => {
    process.exitCode = code
  })
  .catch((error) => {
    const message = error instanceof CliError ? error.message : `Unexpected failure — ${squash(error?.message ?? String(error))}`
    process.stderr.write(`\n  ${useColour ? `${ESC}[31m` : ''}${message}${useColour ? `${ESC}[0m` : ''}\n\n`)
    process.exitCode = 1
  })
