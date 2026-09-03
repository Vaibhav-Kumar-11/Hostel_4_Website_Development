import type { CouncilMember } from '@/types/content'

/**
 * ── COUNCIL & ADMINISTRATION ────────────────────────────────────────────────
 * The hostel's chain of responsibility, five tiers deep. The roles and the
 * order are confirmed; the people are not filled in yet, and no name, photo,
 * email or phone number has been invented.
 *
 *   1  Warden and the two Associate Wardens
 *   2  Hall Manager
 *   3  General Secretary
 *   4  Councillors, plus the System Administrator
 *   5  The secretaries reporting to each councillor
 *
 * ── HOW TO FILL A ROLE IN ───────────────────────────────────────────────────
 *   name:        'Full Name'
 *   affiliation: 'Third Year • Computer Science'   (or a department, for staff)
 *   bio:         one or two sentences
 *   email/phone: rendered as contact buttons; leave null to hide
 *   photo:       'images/council/<file>.jpg'  (drop the file in /public/images/council)
 *   state:       'verified'
 *
 * Anything left `null` is not rendered — the card leads with the role instead,
 * so a tier that is not yet filled still looks finished.
 *
 * ── ADDING THE LEVEL 5 SECRETARIES ──────────────────────────────────────────
 * Each secretary is an ordinary entry with `reportsTo` set to its councillor's
 * `id`. For example, under the Cultural Councillor:
 *
 *   { id: 'c-sec-music', role: 'Music Secretary', level: 5,
 *     reportsTo: 'c-cult', name: null, ... }
 *
 * The tree builds itself from `reportsTo`, so nothing else needs editing — the
 * secretary appears beneath the right councillor automatically.
 */

const blank = {
  name: null,
  affiliation: null,
  bio: null,
  email: null,
  phone: null,
  photo: null,
  state: 'placeholder' as const,
}

export const council: CouncilMember[] = [
  /* ── Level 1 — Wardens ─────────────────────────────────────────────────── */
  { id: 'c-warden', role: 'Warden', level: 1, group: 'Administration', ...blank },
  { id: 'c-assoc-warden-1', role: 'Associate Warden I', level: 1, group: 'Administration', ...blank },
  { id: 'c-assoc-warden-2', role: 'Associate Warden II', level: 1, group: 'Administration', ...blank },

  /* ── Level 2 — Hall Manager ────────────────────────────────────────────── */
  { id: 'c-hall-manager', role: 'Hall Manager', level: 2, group: 'Administration', ...blank },

  /* ── Level 3 — General Secretary ───────────────────────────────────────── */
  { id: 'c-gsec', role: 'General Secretary', level: 3, group: 'Council', ...blank },

  /* ── Level 4 — Councillors ─────────────────────────────────────────────── */
  { id: 'c-tech', role: 'Technical Councillor', level: 4, group: 'Council', reportsTo: 'c-gsec', ...blank },
  { id: 'c-mess', role: 'Mess Councillor', level: 4, group: 'Council', reportsTo: 'c-gsec', ...blank },
  { id: 'c-cult', role: 'Cultural Councillor', level: 4, group: 'Council', reportsTo: 'c-gsec', ...blank },
  { id: 'c-maint', role: 'Maintenance Councillor', level: 4, group: 'Council', reportsTo: 'c-gsec', ...blank },
  { id: 'c-sports', role: 'Sports Councillor', level: 4, group: 'Council', reportsTo: 'c-gsec', ...blank },
  { id: 'c-sysadmin', role: 'System Administrator', level: 4, group: 'Council', reportsTo: 'c-gsec', ...blank },

  /* ── Level 5 — Secretaries ─────────────────────────────────────────────────
     Add each secretary here with `level: 5` and `reportsTo` set to the id of
     the councillor above. None have been listed yet, so this tier is empty and
     the page simply does not draw it. */
]

/** The tiers, in order, with the label each one carries on the page. */
export const councilLevels: { level: number; label: string }[] = [
  { level: 1, label: 'Wardens' },
  { level: 2, label: 'Hall Management' },
  { level: 3, label: 'General Secretary' },
  { level: 4, label: 'Councillors' },
  { level: 5, label: 'Secretaries' },
]

/** Everyone on a given tier, in the order they are listed above. */
export function membersAtLevel(level: number): CouncilMember[] {
  return council.filter((m) => m.level === level)
}

/** The people reporting directly to one role. */
export function directReports(id: string): CouncilMember[] {
  return council.filter((m) => m.reportsTo === id)
}
