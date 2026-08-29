/**
 * Content model for the MADHOUSE site.
 *
 * Every user-facing fact on this website is typed here and supplied from
 * `src/data/*`. Nothing is hardcoded inside a component. Swapping any of these
 * files for a CMS / API response later requires no changes to the UI layer.
 *
 * See docs/CONTENT_GUIDE.md for the "how do I edit this?" walkthrough.
 */

/** Marks entries that are illustrative placeholders, not verified facts. */
export type ContentState = 'verified' | 'placeholder'

export interface Placeheld {
  /** Defaults to 'placeholder' everywhere until the Council confirms the value. */
  state?: ContentState
}

/* ── Announcements ───────────────────────────────────────────────────────── */

export type Priority = 'urgent' | 'important' | 'general'

export interface Announcement extends Placeheld {
  id: string
  title: string
  /** ISO date, e.g. '2026-08-28'. */
  date: string
  priority: Priority
  body: string
  link?: { label: string; href: string }
  attachment?: { label: string; href: string }
  /** ISO date after which the item stops showing in "current" feeds. */
  expiresOn?: string
  pinned?: boolean
}

/* ── Events ──────────────────────────────────────────────────────────────── */

export type EventCategory =
  | 'Tech' | 'Sports' | 'Cult' | 'SUS' | 'Hostel' | 'Festivals' | 'Social'

export interface HostelEvent extends Placeheld {
  id: string
  title: string
  /** ISO date, e.g. '2026-09-04'. */
  date: string
  /** 24h 'HH:MM'. Optional for all-day items. */
  startTime?: string
  endTime?: string
  venue: string
  category: EventCategory
  description: string
  poster?: string
  registrationUrl?: string
}

/* ── Mess ────────────────────────────────────────────────────────────────── */

export type MealKey = 'breakfast' | 'lunch' | 'snacks' | 'dinner'

export interface MealWindow {
  key: MealKey
  label: string
  /** 24h 'HH:MM'. */
  start: string
  end: string
  icon: string
}

/** Weekday index 0 = Sunday … 6 = Saturday, matching Date#getDay(). */
export type WeeklyMenu = Record<MealKey, string[]>[]

/* ── Council ─────────────────────────────────────────────────────────────── */

export interface CouncilMember extends Placeheld {
  id: string
  /** Leave as null until a real name is supplied — never invent one. */
  name: string | null
  role: string
  /** e.g. 'Third Year • Mechanical Engineering' */
  affiliation?: string | null
  bio?: string | null
  email?: string | null
  phone?: string | null
  photo?: string | null
  group: 'Administration' | 'Council'
}

/* ── General Championship ────────────────────────────────────────────────── */

export type GCCategory = 'Tech' | 'Sports' | 'Cult' | 'SUS'

export interface GCResult extends Placeheld {
  year: number
  category: GCCategory
  /** 1-indexed finishing position, or null when not yet declared. */
  position: number | null
  note?: string
}

/* ── Facilities ──────────────────────────────────────────────────────────── */

export interface Amenity extends Placeheld {
  id: string
  name: string
  tagline: string
  description: string
  photo?: string
  location?: string | null
  timings?: string | null
  /** Drives the mock booking module; omit for non-bookable spaces. */
  bookable?: boolean
  capacity?: string | null
}

/* ── Gallery ─────────────────────────────────────────────────────────────── */

export type GalleryCategory =
  | 'Hostel Life' | 'GC' | 'Tech' | 'Sports' | 'Cult' | 'SUS'
  | 'Events' | 'Festivals' | 'Legacy'

export interface Photo extends Placeheld {
  id: string
  src: string
  caption: string
  category: GalleryCategory
  /** Rough aspect ratio; used to lay out the masonry grid without CLS. */
  ratio?: number
  year?: number
}

/* ── Legacy ──────────────────────────────────────────────────────────────── */

export interface LegacyEntry extends Placeheld {
  id: string
  year: string
  title: string
  description: string
  photo?: string
}

/* ── Utility content ─────────────────────────────────────────────────────── */

export interface EmergencyContact extends Placeheld {
  id: string
  label: string
  /** null renders a "to be confirmed" state instead of a dead tel: link. */
  phone: string | null
  detail?: string
  critical?: boolean
}

export interface ResourceLink extends Placeheld {
  id: string
  label: string
  href: string
  description?: string
  external?: boolean
}

export interface GuideStep {
  label: string
  value: string
}

export interface Guide extends Placeheld {
  id: string
  title: string
  summary: string
  steps: GuideStep[]
  footnote?: string
}
