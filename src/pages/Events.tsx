import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CalendarDays, Megaphone, Search } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { AnnouncementCard, EventCard } from '@/components/events/Cards'
import EventCalendar from '@/components/events/EventCalendar'
import { EmptyState, Reveal, Section } from '@/components/ui/primitives'
import { allAnnouncements, pastEvents, upcomingEvents } from '@/lib/schedule'
import type { EventCategory } from '@/types/content'
import { site } from '@/data/site'
import { usePageMeta } from '@/lib/meta'
import { cn } from '@/lib/utils'

/**
 * EVENTS & ANNOUNCEMENTS.
 *
 * Two tabs over one page. The tab and a deep-linked event both live in the
 * query string, so the command palette and the homepage cards can link
 * straight to a specific event and the URL stays shareable.
 */

const CATEGORIES: Array<EventCategory | 'All'> = [
  'All', 'Tech', 'Sports', 'Cult', 'SUS', 'Hostel', 'Festivals', 'Social',
]

export default function Events() {
  usePageMeta({
    title: `Events & Announcements — ${site.name}`,
    description:
      'Everything happening at Hostel 4, IIT Bombay — upcoming events, the month calendar, the past-event archive and the full announcement feed.',
  })

  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') === 'announcements' ? 'announcements' : 'events'
  const focusedEvent = params.get('event')

  const [category, setCategory] = useState<EventCategory | 'All'>('All')
  const [query, setQuery] = useState('')
  const [archiveYear, setArchiveYear] = useState<number | 'All'>('All')

  const upcoming = upcomingEvents()
  const past = pastEvents()
  const notices = allAnnouncements()

  const archiveYears = useMemo(
    () => [...new Set(past.map((e) => Number(e.date.slice(0, 4))))].sort((a, b) => b - a),
    [past],
  )

  const filterEvents = (list: typeof upcoming) =>
    list.filter((e) => {
      if (category !== 'All' && e.category !== category) return false
      if (!query.trim()) return true
      const q = query.toLowerCase()
      return `${e.title} ${e.description} ${e.venue}`.toLowerCase().includes(q)
    })

  const visibleUpcoming = filterEvents(upcoming)
  const visiblePast = filterEvents(past).filter(
    (e) => archiveYear === 'All' || Number(e.date.slice(0, 4)) === archiveYear,
  )

  // Scroll a deep-linked event into view once the list has rendered.
  useEffect(() => {
    if (!focusedEvent) return
    const id = window.setTimeout(() => {
      document
        .getElementById(`event-${focusedEvent}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 200)
    return () => window.clearTimeout(id)
  }, [focusedEvent])

  function switchTab(next: 'events' | 'announcements') {
    setParams(next === 'events' ? {} : { tab: 'announcements' }, { replace: true })
  }

  return (
    <>
      <PageHeader
        eyebrow="Notice board & calendar"
        title="Events &"
        accent="Announcements"
        description="What is coming up, what already happened, and everything the Council has put out. Add any event straight to your phone calendar with one tap."
      >
        <div className="inline-flex rounded-full border p-1">
          <TabButton active={tab === 'events'} onClick={() => switchTab('events')} icon={<CalendarDays size={14} />}>
            Events
          </TabButton>
          <TabButton
            active={tab === 'announcements'}
            onClick={() => switchTab('announcements')}
            icon={<Megaphone size={14} />}
          >
            Announcements
          </TabButton>
        </div>
      </PageHeader>

      {tab === 'events' ? (
        <>
          {/* Filters */}
          <Section size="sm" className="!pb-0">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={cn('chip shrink-0', category === c && 'chip-active')}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="relative w-full lg:max-w-xs">
                <Search size={15} className="muted pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search events…"
                  className="field pl-11"
                  aria-label="Search events"
                />
              </div>
            </div>
          </Section>

          {/* Upcoming */}
          <Section size="md">
            <h2 className="mb-8 text-2xl font-bold uppercase tracking-tight sm:text-3xl">
              Upcoming <span className="muted font-mono text-base">({visibleUpcoming.length})</span>
            </h2>

            {visibleUpcoming.length ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visibleUpcoming.map((e, i) => (
                  <Reveal key={e.id} delay={i}>
                    <EventCard event={e} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<CalendarDays size={22} />}
                title="Nothing matches"
                description="No upcoming events fit these filters. Try clearing the search or picking a different category."
              />
            )}
          </Section>

          {/* Calendar */}
          <Section tone="sunken">
            <h2 className="mb-8 text-2xl font-bold uppercase tracking-tight sm:text-3xl">
              Event calendar
            </h2>
            <EventCalendar
              onSelectEvent={(id) => {
                document
                  .getElementById(`event-${id}`)
                  ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }}
            />
          </Section>

          {/* Archive */}
          <Section>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-bold uppercase tracking-tight sm:text-3xl">
                Past events{' '}
                <span className="muted font-mono text-base">({visiblePast.length})</span>
              </h2>
              {archiveYears.length > 1 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setArchiveYear('All')}
                    className={cn('chip', archiveYear === 'All' && 'chip-active')}
                  >
                    All years
                  </button>
                  {archiveYears.map((y) => (
                    <button
                      key={y}
                      onClick={() => setArchiveYear(y)}
                      className={cn('chip font-mono', archiveYear === y && 'chip-active')}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {visiblePast.length ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visiblePast.map((e, i) => (
                  <Reveal key={e.id} delay={i}>
                    <EventCard event={e} past />
                  </Reveal>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<CalendarDays size={22} />}
                title="Archive is empty"
                description="Events move here once they have happened."
              />
            )}
          </Section>
        </>
      ) : (
        <Section>
          <h2 className="mb-8 text-2xl font-bold uppercase tracking-tight sm:text-3xl">
            All announcements <span className="muted font-mono text-base">({notices.length})</span>
          </h2>

          {notices.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {notices.map((n, i) => (
                <Reveal key={n.id} delay={i}>
                  <AnnouncementCard item={n} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Megaphone size={22} />}
              title="No announcements"
              description="Notices posted by the Council appear here, on the homepage and in the hero ticker."
            />
          )}

        </Section>
      )}
    </>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200',
        active ? 'bg-madhouse-500 text-white' : 'muted hover:text-[rgb(var(--text))]',
      )}
    >
      {icon}
      {children}
    </button>
  )
}
