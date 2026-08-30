/**
 * ── FLOOR PLANS ─────────────────────────────────────────────────────────────
 * The nine levels of Hostel 4: Ground, then the 1st through the 8th.
 *
 * Nothing about an individual floor is guessed here. Room numbers, wing names,
 * facilities and plan drawings are all left empty until the Council or the
 * hostel office supplies them, and the site simply shows less rather than
 * showing something invented.
 *
 * ── HOW TO FILL THIS IN (no coding needed) ──────────────────────────────────
 *
 *  1. Plan drawings
 *     Save each floor's plan as a PNG, JPG or SVG into
 *         /public/images/floors/
 *     then point that floor's `plan` at it, keeping the same style of path:
 *         plan: 'images/floors/ground.png'
 *     (no slash at the start — every image path on this site is written that
 *     way so the site keeps working on the institute server).
 *     A floor with no drawing yet is fine: leave `plan: null` and the site
 *     draws a neutral architectural schematic in its place.
 *
 *  2. Room numbers
 *     Written exactly as a resident would say them, in quotes:
 *         roomRange: '101 – 248'
 *     If the numbering on a floor is not a single clean run, write it however
 *     it actually reads: '101 – 148, 160 – 172'.
 *
 *  3. Wings
 *     A list of the wing names on that level, each in quotes:
 *         wings: ['A Wing', 'B Wing', 'C Wing']
 *     Leave it as `[]` if the floor has no wing division, or if the names have
 *     not been confirmed yet.
 *
 *  4. Facilities on the level
 *     Short entries, one per thing worth walking to that floor for:
 *         highlights: ['Reading Room', 'Common Room', 'Water cooler — B Wing']
 *     Leave it as `[]` if there is nothing to list. Empty entries are never
 *     announced on the page; they are just left out.
 *
 *  5. Description
 *     One or two plain sentences about the level, or `null` for none:
 *         description: 'The busiest floor in the building...'
 *
 *  6. Switching the section on
 *     See FLOOR_PLANS_ENABLED just below.
 *
 * Add or remove floors by copying a whole `{ ... },` block. The selector, the
 * keyboard controls and the layout all follow this list — they do not need to
 * be told how many floors there are.
 * ────────────────────────────────────────────────────────────────────────────
 */

export interface Floor {
  /** Stable key, e.g. 'ground' or 'floor-3'. Never shown to residents. */
  id: string
  /** How the level is named on the page: 'Ground', '1st', '2nd'. */
  label: string
  /** One or two characters for the floor selector: 'G', '1', '2'. */
  shortLabel: string
  /** Room numbering on this level, e.g. '101 – 248'. `null` hides the field. */
  roomRange: string | null
  /** Wing names on this level. An empty list hides the field. */
  wings: string[]
  /** Facilities worth naming on this level. An empty list hides the field. */
  highlights: string[]
  /** Path to the plan drawing under images/floors/. `null` hides the image. */
  plan: string | null
  /** A sentence or two about the level. `null` hides the field. */
  description: string | null
}

/**
 * ── THE SWITCH ──────────────────────────────────────────────────────────────
 * While this is `false`, the whole floor-plan section is absent from the site.
 * Not greyed out, not marked as coming soon — absent. A resident never sees a
 * half-built feature.
 *
 * Flip it to `true` once the engineering plans have been added to the floors
 * below, and the section appears on the Life page with everything already
 * wired: the selector, the keyboard controls and the detail panel.
 *
 * Floors that still have no plan drawing of their own are safe to leave in —
 * they fall back to a neutral schematic, so the section can go live as soon as
 * the first real plans land rather than waiting for all nine.
 */
export const FLOOR_PLANS_ENABLED: boolean = true

/**
 * Listed ground-floor-first, which is the order that is easiest to read and
 * edit. The page stacks them the other way up — top floor at the top — because
 * that is how people picture a building. Editing this list in the order below
 * is correct; the flipping happens on the page, not here.
 */
export const floors: Floor[] = [
  {
    id: 'ground',
    label: 'Ground',
    shortLabel: 'G',
    roomRange: null,
    wings: [],
    highlights: [],
    plan: null,
    description: null,
  },
  {
    id: 'floor-1',
    label: '1st',
    shortLabel: '1',
    roomRange: null,
    wings: [],
    highlights: [],
    plan: null,
    description: null,
  },
  {
    id: 'floor-2',
    label: '2nd',
    shortLabel: '2',
    roomRange: null,
    wings: [],
    highlights: [],
    plan: null,
    description: null,
  },
  {
    id: 'floor-3',
    label: '3rd',
    shortLabel: '3',
    roomRange: null,
    wings: [],
    highlights: [],
    plan: null,
    description: null,
  },
  {
    id: 'floor-4',
    label: '4th',
    shortLabel: '4',
    roomRange: null,
    wings: [],
    highlights: [],
    plan: null,
    description: null,
  },
  {
    id: 'floor-5',
    label: '5th',
    shortLabel: '5',
    roomRange: null,
    wings: [],
    highlights: [],
    plan: null,
    description: null,
  },
  {
    id: 'floor-6',
    label: '6th',
    shortLabel: '6',
    roomRange: null,
    wings: [],
    highlights: [],
    plan: null,
    description: null,
  },
  {
    id: 'floor-7',
    label: '7th',
    shortLabel: '7',
    roomRange: null,
    wings: [],
    highlights: [],
    plan: null,
    description: null,
  },
  {
    id: 'floor-8',
    label: '8th',
    shortLabel: '8',
    roomRange: null,
    wings: [],
    highlights: [],
    plan: null,
    description: null,
  },
]
