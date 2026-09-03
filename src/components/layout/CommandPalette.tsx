import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, CalendarDays, CornerDownLeft, Dumbbell, Home, Info, Instagram,
  Megaphone, Phone, Search, Trophy, UtensilsCrossed, Wrench,
} from 'lucide-react'
import { CLR_TICKET_URL } from '@/data/site'
import { amenities } from '@/data/amenities'
import { activeAnnouncements } from '@/lib/schedule'
import { events } from '@/data/events'
import { useScrollLock } from '@/hooks'
import { cn, formatDate } from '@/lib/utils'

/**
 * ⌘K / Ctrl-K command palette.
 *
 * 1250 residents each want one different thing from this site — tonight's
 * menu, the maintenance link, when the next GC match is. Rather than making
 * everyone learn the navigation, this searches every page, event, announcement
 * and facility from one keystroke. It is the fastest path to any fact on the
 * site, and on mobile it doubles as the search button in the header.
 */

type Item = {
  id: string
  label: string
  hint?: string
  group: string
  icon: React.ReactNode
  keywords?: string
} & ({ to: string; href?: never } | { href: string; to?: never })

interface Props {
  open: boolean
  onClose: () => void
}

export default function CommandPalette({ open, onClose }: Props) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useScrollLock(open)

  const items = useMemo<Item[]>(() => {
    const pages: Item[] = [
      { id: 'p-home', label: 'Home', hint: 'Live status, mess, events', group: 'Pages', to: '/', icon: <Home size={16} />, keywords: 'start landing' },
      { id: 'p-about', label: 'About & Council', hint: 'Who runs Madhouse', group: 'Pages', to: '/about', icon: <Info size={16} />, keywords: 'warden secretary gsec legacy history location map' },
      { id: 'p-gc', label: 'General Championship', hint: 'Standings and history', group: 'Pages', to: '/gc', icon: <Trophy size={16} />, keywords: 'gc tech sports cult sus ranking' },
      { id: 'p-events', label: 'Events & Announcements', hint: 'Calendar, archive, notices', group: 'Pages', to: '/events', icon: <CalendarDays size={16} />, keywords: 'calendar past upcoming notice' },
      { id: 'p-life', label: 'Life at Madhouse', hint: 'Facilities and hostel life', group: 'Pages', to: '/life', icon: <Dumbbell size={16} />, keywords: 'gym reading room music dance laundry common' },
      { id: 'p-resources', label: 'Resources', hint: 'Gallery, guides, bookings', group: 'Pages', to: '/resources', icon: <Search size={16} />, keywords: 'photo gallery lan wifi booking equipment links' },
      { id: 'p-maintenance', label: 'Maintenance', hint: 'Report a problem', group: 'Pages', to: '/maintenance', icon: <Wrench size={16} />, keywords: 'complaint broken plumbing electrical carpentry clr' },
    ]

    const actions: Item[] = [
      { id: 'a-clr', label: 'Raise a maintenance complaint', hint: 'Opens the CLR ticket system', group: 'Quick actions', href: CLR_TICKET_URL, icon: <Wrench size={16} />, keywords: 'broken fix repair ticket complaint' },
      { id: 'a-mess', label: "Today's mess menu", hint: 'Jump to the live meal timeline', group: 'Quick actions', to: '/#today', icon: <UtensilsCrossed size={16} />, keywords: 'food breakfast lunch snacks dinner menu' },
      { id: 'a-emergency', label: 'Emergency contacts', hint: 'Ambulance, security, hostel office', group: 'Quick actions', to: '/resources#emergency', icon: <Phone size={16} />, keywords: 'ambulance security fire warden help sos' },
      { id: 'a-book', label: 'Book a room or equipment', hint: 'Music room, projector, sports gear', group: 'Quick actions', to: '/resources#bookings', icon: <CalendarDays size={16} />, keywords: 'reserve booking guitar projector football' },
      { id: 'a-gallery', label: 'Open the photo roll', group: 'Quick actions', to: '/resources#gallery', icon: <Search size={16} />, keywords: 'photos pictures gallery memories' },
      { id: 'a-rebate', label: 'Mess rebate calculator', hint: 'Work out what days away are worth', group: 'Quick actions', to: '/resources#rebate', icon: <UtensilsCrossed size={16} />, keywords: 'rebate refund mess bill going home leave money' },
      { id: 'a-floors', label: 'Floor plans', hint: 'Find a room or a wing by level', group: 'Quick actions', to: '/life#floor-plans', icon: <Dumbbell size={16} />, keywords: 'floor plan map layout wing room level building ground' },
      { id: 'a-instagram', label: 'Madhouse on Instagram', hint: '@madhouseiitb', group: 'Quick actions', href: 'https://www.instagram.com/madhouseiitb/', icon: <Instagram size={16} />, keywords: 'instagram insta social photos handle follow' },
    ]

    const eventItems: Item[] = events.map((e) => ({
      id: `e-${e.id}`,
      label: e.title,
      hint: `${formatDate(e.date)} • ${e.venue}`,
      group: 'Events',
      to: `/events?event=${e.id}`,
      icon: <CalendarDays size={16} />,
      keywords: `${e.category} ${e.description}`,
    }))

    const noticeItems: Item[] = activeAnnouncements().map((a) => ({
      id: `n-${a.id}`,
      label: a.title,
      hint: formatDate(a.date),
      group: 'Announcements',
      to: `/events?tab=announcements`,
      icon: <Megaphone size={16} />,
      keywords: a.body,
    }))

    const facilityItems: Item[] = amenities.map((f) => ({
      id: `f-${f.id}`,
      label: f.name,
      hint: f.tagline,
      group: 'Facilities',
      to: `/life#${f.id}`,
      icon: <Dumbbell size={16} />,
      keywords: f.description,
    }))

    return [...pages, ...actions, ...eventItems, ...noticeItems, ...facilityItems]
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items.filter((i) => i.group === 'Pages' || i.group === 'Quick actions')
    return items
      .map((item) => {
        const haystack = `${item.label} ${item.hint ?? ''} ${item.keywords ?? ''}`.toLowerCase()
        if (!haystack.includes(q)) return null
        // Rank exact title prefixes above incidental keyword matches.
        const score = item.label.toLowerCase().startsWith(q) ? 0 : item.label.toLowerCase().includes(q) ? 1 : 2
        return { item, score }
      })
      .filter((x): x is { item: Item; score: number } => x !== null)
      .sort((a, b) => a.score - b.score)
      .slice(0, 24)
      .map((x) => x.item)
  }, [items, query])

  const grouped = useMemo(() => {
    const map = new Map<string, Item[]>()
    results.forEach((item) => {
      const list = map.get(item.group) ?? []
      list.push(item)
      map.set(item.group, list)
    })
    return [...map.entries()]
  }, [results])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      // Wait for the enter animation before stealing focus.
      const id = window.setTimeout(() => inputRef.current?.focus(), 60)
      return () => window.clearTimeout(id)
    }
  }, [open])

  useEffect(() => setActive(0), [query])

  useEffect(() => {
    if (!open) return
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  function run(item: Item) {
    onClose()
    if (item.href) {
      window.open(item.href, '_blank', 'noopener,noreferrer')
      return
    }
    navigate(item.to!)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i + 1) % Math.max(1, results.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i - 1 + results.length) % Math.max(1, results.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = results[active]
      if (item) run(item)
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  let cursor = -1

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div
            className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search Madhouse"
            className="glass relative w-full max-w-xl overflow-hidden rounded-2xl border shadow-lift"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b px-4">
              <Search size={17} className="muted shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, events, notices, facilities…"
                className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-[rgb(var(--text-muted))]"
                aria-label="Search"
              />
              <kbd className="muted hidden shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] sm:block">
                ESC
              </kbd>
            </div>

            <div ref={listRef} className="max-h-[52vh] overflow-y-auto overscroll-contain p-2">
              {grouped.length === 0 && (
                <p className="muted px-3 py-10 text-center text-sm">
                  Nothing matches “{query}”.
                </p>
              )}
              {grouped.map(([group, groupItems]) => (
                <div key={group} className="mb-1">
                  <div className="muted px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em]">
                    {group}
                  </div>
                  {groupItems.map((item) => {
                    cursor += 1
                    const index = cursor
                    return (
                      <button
                        key={item.id}
                        data-index={index}
                        onMouseMove={() => setActive(index)}
                        onClick={() => run(item)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                          index === active
                            ? 'bg-madhouse-500 text-white'
                            : 'hover:bg-[rgb(var(--surface-sunken))]',
                        )}
                      >
                        <span className={cn('shrink-0', index !== active && 'text-madhouse-500')}>
                          {item.icon}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{item.label}</span>
                          {item.hint && (
                            <span
                              className={cn(
                                'block truncate text-xs',
                                index === active ? 'text-white/80' : 'muted',
                              )}
                            >
                              {item.hint}
                            </span>
                          )}
                        </span>
                        <ArrowRight
                          size={14}
                          className={cn('shrink-0', index === active ? 'opacity-90' : 'opacity-0')}
                        />
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>

            <div className="muted flex items-center gap-4 border-t px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <CornerDownLeft size={11} /> open
              </span>
              <span className="hidden sm:inline">↑↓ navigate</span>
              <span className="ml-auto">Madhouse quick search</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
