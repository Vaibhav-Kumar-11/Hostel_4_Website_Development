import type { GCCategory, GCResult } from '@/types/content'

/**
 * ── GENERAL CHAMPIONSHIP ────────────────────────────────────────────────────
 * PLACEHOLDER STANDINGS — no real GC position has been entered.
 *
 * `position: null` renders an honest "awaiting result" state rather than a
 * fabricated rank. Fill in numbers as results are declared and set
 * `state: 'verified'` on each row you have confirmed.
 *
 * `GC_TEAMS` is the number of hostels contesting — it scales the bar charts.
 */

export const GC_TEAMS = 18
export const GC_CATEGORIES: GCCategory[] = ['Tech', 'Sports', 'Cult', 'SUS']

export const gcCategoryMeta: Record<GCCategory, { blurb: string; icon: string }> = {
  Tech:   { blurb: 'Hackathons, robotics, case challenges and the tech GC circuit.', icon: '⚙' },
  Sports: { blurb: 'Football, basketball, athletics, cricket and the indoor sports league.', icon: '🏅' },
  Cult:   { blurb: 'Music, dance, dramatics, literary arts and the cultural GC.', icon: '🎭' },
  SUS:    { blurb: 'Sustainability initiatives, drives and campus-wide green targets.', icon: '🌱' },
}

const blankYear = (year: number): GCResult[] =>
  GC_CATEGORIES.map((category) => ({
    year,
    category,
    position: null,
    state: 'placeholder' as const,
  }))

export const gcResults: GCResult[] = [
  ...blankYear(2026),
  ...blankYear(2025),
  ...blankYear(2024),
]

export const GC_YEARS = [...new Set(gcResults.map((r) => r.year))].sort((a, b) => b - a)
