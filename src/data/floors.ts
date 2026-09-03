/**
 * ── FLOOR PLANS ─────────────────────────────────────────────────────────────
 * Ten levels: the ground floor, then floors 1 to 9.
 *
 * The building has exactly two plan drawings, not ten. The ground floor has a
 * layout of its own — it carries the entrances, the lobby and the shared
 * spaces — while floors 1 to 9 repeat one identical residential plate. That is
 * why `plan` below points at only two files: nine floors share `typical`, and
 * the page says so rather than pretending each level was drawn separately.
 *
 * ── HOW TO FILL THIS IN (no coding needed) ──────────────────────────────────
 *
 *  1. Room numbers
 *     Written exactly as a resident would say them, in quotes:
 *         roomRange: '101 – 248'
 *     If the numbering is not one clean run, write it however it reads:
 *         roomRange: '101 – 148, 160 – 172'
 *     Leave it as `null` until you have the real numbering.
 *
 *  2. Wings
 *     The wing names on that level, each in quotes:
 *         wings: ['A Wing', 'B Wing', 'C Wing']
 *     Leave it as `[]` if the names are not confirmed.
 *
 *  3. Facilities on the level
 *     One short entry per thing worth walking to that floor for:
 *         highlights: ['Reading Room', 'Common Room', 'Water cooler — B Wing']
 *     Leave it as `[]` if there is nothing to list.
 *
 *  4. Description
 *     One or two sentences, or `null`.
 *
 * Anything left `null` or `[]` is simply not rendered. A floor with nothing
 * filled in still looks finished — it shows its plan and nothing else.
 */

/** The two drawings the building actually has. */
export const floorPlanFiles = {
  ground: 'floors/ground-floor.pdf',
  typical: 'floors/typical-floor.pdf',
} as const

export interface Floor {
  /** Stable id, used for the anchor and as a React key. */
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
  /** The plan drawing for this level. `null` falls back to a schematic. */
  plan: string | null
  /**
   * True when this level shares the typical plate with the other residential
   * floors, so the page can say the drawing is shared rather than implying it
   * was drawn for this floor alone.
   */
  sharesTypicalPlan?: boolean
  /** A sentence or two about the level. `null` hides the field. */
  description: string | null
}

/**
 * ── THE SWITCH ──────────────────────────────────────────────────────────────
 * While this is `false`, the whole floor-plan section is absent from the site.
 * Not greyed out, not marked as coming soon — absent.
 */
export const FLOOR_PLANS_ENABLED: boolean = true

/** Floors 1 to 9 are identical, so they are generated rather than repeated. */
const ORDINALS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th']

const residentialFloors: Floor[] = ORDINALS.map((label, i) => ({
  id: `floor-${i + 1}`,
  label,
  shortLabel: String(i + 1),
  roomRange: null,
  wings: [],
  highlights: [],
  plan: floorPlanFiles.typical,
  sharesTypicalPlan: true,
  description: null,
}))

/**
 * Listed ground-floor-first, which is the order that is easiest to read and
 * edit. The page stacks them the other way up — top floor at the top — because
 * that is how people picture a building.
 */
export const floors: Floor[] = [
  {
    id: 'ground',
    label: 'Ground',
    shortLabel: 'G',
    roomRange: null,
    wings: [],
    highlights: [],
    plan: floorPlanFiles.ground,
    description: null,
  },
  ...residentialFloors,
]
