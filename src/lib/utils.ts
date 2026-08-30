/** Tiny classname joiner — avoids pulling in a dependency for one function. */
export function cn(...parts: unknown[]): string {
  return parts.filter((p): p is string => typeof p === 'string' && p.length > 0).join(' ')
}

/** Resolves a /public asset path against Vite's base so it works under /~hostel4/. */
export function asset(path: string): string {
  if (!path) return ''
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}

/** '2026-09-04' → 'Thu, 4 Sep' */
export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  const d = parseISODate(iso)
  if (!d) return iso
  return d.toLocaleDateString('en-IN', opts ?? { weekday: 'short', day: 'numeric', month: 'short' })
}

export function formatLongDate(iso: string): string {
  return formatDate(iso, { day: 'numeric', month: 'long', year: 'numeric' })
}

/** '17:30' → '5:30 PM' */
export function formatTime(hhmm?: string): string {
  if (!hhmm) return ''
  const [h, m] = hhmm.split(':').map(Number)
  if (Number.isNaN(h)) return hhmm
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m ?? 0).padStart(2, '0')} ${period}`
}

/** Parses 'YYYY-MM-DD' in local time. `new Date(iso)` would parse it as UTC. */
export function parseISODate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return null
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
}

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function startOfToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

/** 'in 3 days' / 'today' / '2 weeks ago' — for event and announcement cards. */
export function relativeDay(iso: string): string {
  const target = parseISODate(iso)
  if (!target) return ''
  const days = Math.round((target.getTime() - startOfToday().getTime()) / 86_400_000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days === -1) return 'Yesterday'
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  if (Math.abs(days) < 7) return rtf.format(days, 'day')
  if (Math.abs(days) < 30) return rtf.format(Math.round(days / 7), 'week')
  return rtf.format(Math.round(days / 30), 'month')
}

/** 5_425 → '01:30:25' — used by the next-meal countdown. */
export function formatCountdown(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return [h, m, sec].map((n) => String(n).padStart(2, '0')).join(':')
}

/** Ordinal suffix for GC positions: 1 → '1ST', 2 → '2ND'. */
export function ordinal(n: number): string {
  const suffixes = ['TH', 'ST', 'ND', 'RD']
  const v = n % 100
  return `${n}${suffixes[(v - 20) % 10] ?? suffixes[v] ?? suffixes[0]}`
}

/** Initials for the placeholder avatar on council cards. */
export function initials(text: string): string {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
