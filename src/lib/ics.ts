import type { HostelEvent } from '@/types/content'
import { parseISODate } from './utils'

/**
 * Builds an .ics file for a hostel event so residents can drop it straight
 * into their phone calendar. Generated entirely in the browser — no server,
 * no third-party calendar service, nothing leaves the device.
 */

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function toICSStamp(date: Date): string {
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `T${pad(date.getHours())}${pad(date.getMinutes())}00`
  )
}

/** Folds long lines at 75 octets, as RFC 5545 requires. */
function fold(line: string): string {
  if (line.length <= 74) return line
  const chunks: string[] = [line.slice(0, 74)]
  let rest = line.slice(74)
  while (rest.length > 73) {
    chunks.push(` ${rest.slice(0, 73)}`)
    rest = rest.slice(73)
  }
  if (rest) chunks.push(` ${rest}`)
  return chunks.join('\r\n')
}

function escapeText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

export function buildEventICS(event: HostelEvent): string {
  const day = parseISODate(event.date)
  if (!day) return ''

  const [sh, sm] = (event.startTime ?? '09:00').split(':').map(Number)
  const start = new Date(day)
  start.setHours(sh, sm, 0, 0)

  const end = new Date(start)
  if (event.endTime) {
    const [eh, em] = event.endTime.split(':').map(Number)
    end.setHours(eh, em, 0, 0)
    // An end time earlier than the start means the event runs past midnight.
    if (end <= start) end.setDate(end.getDate() + 1)
  } else {
    end.setHours(start.getHours() + 2)
  }

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Madhouse//Hostel 4 IIT Bombay//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.id}@hostel4.madhouse`,
    `DTSTAMP:${toICSStamp(new Date())}`,
    `DTSTART;TZID=Asia/Kolkata:${toICSStamp(start)}`,
    `DTEND;TZID=Asia/Kolkata:${toICSStamp(end)}`,
    fold(`SUMMARY:${escapeText(event.title)}`),
    fold(`DESCRIPTION:${escapeText(event.description)}`),
    fold(`LOCATION:${escapeText(event.venue)}`),
    `CATEGORIES:${event.category}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  return lines.join('\r\n')
}

export function downloadEventICS(event: HostelEvent): void {
  const blob = new Blob([buildEventICS(event)], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
