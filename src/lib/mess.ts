import { mealWindows, weeklyMenu } from '@/data/mess'
import type { MealKey, MealWindow } from '@/types/content'

/**
 * The mess clock.
 *
 * Everything the homepage shows about food — "now serving", the next meal, the
 * countdown, today's and tomorrow's menu — is derived here from the real system
 * clock and the timings in `src/data/mess.ts`. Nothing about it is hardcoded,
 * so correcting a timing in the data file corrects the whole homepage.
 */

export interface MessStatus {
  /** The meal being served right now, or null between windows. */
  current: MealWindow | null
  /** The next window that opens — wraps to tomorrow's breakfast after dinner. */
  next: MealWindow
  /** True when `next` opens on the following calendar day. */
  nextIsTomorrow: boolean
  /** Seconds until `next` opens, or until `current` closes when a meal is on. */
  secondsRemaining: number
  /** 0–1 progress through the current window; 0 when nothing is being served. */
  progress: number
}

function minutesOf(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** Minutes since local midnight, seconds included as a fraction. */
function nowMinutes(now: Date): number {
  return now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60
}

export function getMessStatus(now: Date = new Date()): MessStatus {
  const mins = nowMinutes(now)
  const windows = [...mealWindows].sort((a, b) => minutesOf(a.start) - minutesOf(b.start))

  const current =
    windows.find((w) => mins >= minutesOf(w.start) && mins < minutesOf(w.end)) ?? null

  const upcoming = windows.find((w) => minutesOf(w.start) > mins)
  const next = upcoming ?? windows[0]
  const nextIsTomorrow = !upcoming

  const targetMinutes = current
    ? minutesOf(current.end)
    : minutesOf(next.start) + (nextIsTomorrow ? 24 * 60 : 0)

  const secondsRemaining = Math.max(0, Math.round((targetMinutes - mins) * 60))

  const progress = current
    ? (mins - minutesOf(current.start)) / (minutesOf(current.end) - minutesOf(current.start))
    : 0

  return { current, next, nextIsTomorrow, secondsRemaining, progress }
}

/** Menu for a given weekday index (0 = Sunday), defaulting to today. */
export function getMenuForDay(dayIndex: number = new Date().getDay()) {
  return weeklyMenu[((dayIndex % 7) + 7) % 7]
}

export function getMenuFor(meal: MealKey, dayIndex?: number): string[] {
  return getMenuForDay(dayIndex)[meal] ?? []
}

/** Sorted meal windows — the canonical display order for the day timeline. */
export const orderedMeals: MealWindow[] = [...mealWindows].sort(
  (a, b) => minutesOf(a.start) - minutesOf(b.start),
)

/** 'past' | 'now' | 'upcoming' for a meal, used to style the day timeline. */
export function mealPhase(meal: MealWindow, now: Date = new Date()): 'past' | 'now' | 'upcoming' {
  const mins = nowMinutes(now)
  if (mins >= minutesOf(meal.end)) return 'past'
  if (mins >= minutesOf(meal.start)) return 'now'
  return 'upcoming'
}
