import { announcements } from '@/data/announcements'
import { events } from '@/data/events'
import type { Announcement, HostelEvent } from '@/types/content'
import { parseISODate, startOfToday } from './utils'

/**
 * Derived views over the events and announcements feeds.
 *
 * Nothing is stored as "upcoming" or "past" in the data files — an event moves
 * to the archive on its own the day after it happens. The Council never has to
 * reorganise a list by hand.
 */

const byDateAsc = (a: { date: string }, b: { date: string }) => a.date.localeCompare(b.date)
const byDateDesc = (a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date)

function isFutureOrToday(iso: string): boolean {
  const d = parseISODate(iso)
  return !!d && d.getTime() >= startOfToday().getTime()
}

export function upcomingEvents(limit?: number): HostelEvent[] {
  const list = events.filter((e) => isFutureOrToday(e.date)).sort(byDateAsc)
  return limit ? list.slice(0, limit) : list
}

export function pastEvents(): HostelEvent[] {
  return events.filter((e) => !isFutureOrToday(e.date)).sort(byDateDesc)
}

export function nextEvent(): HostelEvent | null {
  return upcomingEvents(1)[0] ?? null
}

/** Events on a given ISO day — powers the calendar grid. */
export function eventsOn(iso: string): HostelEvent[] {
  return events.filter((e) => e.date === iso).sort((a, b) =>
    (a.startTime ?? '').localeCompare(b.startTime ?? ''),
  )
}

const PRIORITY_RANK: Record<Announcement['priority'], number> = {
  urgent: 0,
  important: 1,
  general: 2,
}

function isLive(a: Announcement): boolean {
  if (!a.expiresOn) return true
  const d = parseISODate(a.expiresOn)
  return !d || d.getTime() >= startOfToday().getTime()
}

/** Pinned first, then by priority, then newest first. */
export function activeAnnouncements(limit?: number): Announcement[] {
  const list = announcements
    .filter(isLive)
    .sort((a, b) => {
      if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1
      const p = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
      return p !== 0 ? p : byDateDesc(a, b)
    })
  return limit ? list.slice(0, limit) : list
}

export function allAnnouncements(): Announcement[] {
  return [...announcements].sort(byDateDesc)
}

export function topAnnouncement(): Announcement | null {
  return activeAnnouncements(1)[0] ?? null
}

/** Short strings for the homepage ticker — urgent and important items only. */
export function tickerItems(): Announcement[] {
  return activeAnnouncements().filter((a) => a.priority !== 'general').slice(0, 6)
}
