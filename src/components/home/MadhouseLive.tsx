import { Link } from 'react-router-dom'
import { ArrowUpRight, CalendarClock, Megaphone, UtensilsCrossed, Wrench } from 'lucide-react'
import { CLR_TICKET_URL } from '@/data/site'
import { getMenuFor, getMessStatus } from '@/lib/mess'
import { nextEvent, topAnnouncement } from '@/lib/schedule'
import { useNow } from '@/hooks'
import { Reveal } from '@/components/ui/primitives'
import { cn, formatCountdown, formatDate, formatTime, relativeDay } from '@/lib/utils'

/**
 * MADHOUSE LIVE — the signature block.
 *
 * Four cards answering the four questions a resident opens this site to ask:
 * what is being served, what is on next, what do I need to know, and how do I
 * get something fixed. Every value is computed from the real clock against the
 * data files, and the countdown re-renders every second.
 */
export default function MadhouseLive() {
  const now = useNow(1000)
  const mess = getMessStatus(now)
  const event = nextEvent()
  const notice = topAnnouncement()

  const activeMeal = mess.current ?? mess.next
  const menu = getMenuFor(activeMeal.key)

  const priorityStyles = {
    urgent: 'bg-red-500',
    important: 'bg-amber-500',
    general: 'bg-sky-500',
  } as const

  return (
    <section id="live" className="band-dark relative scroll-mt-24 py-16 sm:py-20">
      <div className="shell">
        <Reveal>
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="mb-3 inline-flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-madhouse-500 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-madhouse-500" />
                </span>
                Live right now
              </span>
              <h2 className="text-display-sm font-bold uppercase text-ink-50">
                Madhouse <span className="text-madhouse-500">Live</span>
              </h2>
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-400">
              {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              <span className="mx-2 text-ink-600">/</span>
              <span className="tabular-nums text-madhouse-500">
                {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </span>
            </p>
          </div>
        </Reveal>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {/* ── Mess ── */}
          <Reveal delay={0}>
            <LiveCard
              icon={<UtensilsCrossed size={15} />}
              label={mess.current ? 'Now serving' : 'Mess closed'}
              accent
              to="/#today"
            >
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl leading-none">{activeMeal.icon}</span>
                <span className="font-display text-2xl font-bold uppercase leading-none text-ink-50">
                  {activeMeal.label}
                </span>
              </div>

              <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-ink-300">
                {menu.slice(0, 4).join(' · ')}
              </p>

              {/* Progress through the current meal window. */}
              {mess.current && (
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-madhouse-500 transition-[width] duration-1000 ease-linear"
                    style={{ width: `${Math.min(100, mess.progress * 100)}%` }}
                  />
                </div>
              )}

              <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-ink-400">
                <span>
                  {mess.current ? 'Ends in' : `${activeMeal.label} in`}
                </span>
                <span className="tabular-nums text-madhouse-500">
                  {formatCountdown(mess.secondsRemaining)}
                </span>
              </div>
            </LiveCard>
          </Reveal>

          {/* ── Next event ── */}
          <Reveal delay={1}>
            <LiveCard
              icon={<CalendarClock size={15} />}
              label="Next event"
              to={event ? `/events?event=${event.id}` : '/events'}
            >
              {event ? (
                <>
                  <p className="font-display text-lg font-bold leading-tight text-ink-50">
                    {event.title}
                  </p>
                  <p className="mt-2 text-xs text-ink-300">{event.venue}</p>
                  <div className="mt-auto flex items-center gap-2 pt-4 font-mono text-[10px] uppercase tracking-wider">
                    <span className="rounded-full bg-madhouse-500/15 px-2 py-0.5 text-madhouse-400">
                      {relativeDay(event.date)}
                    </span>
                    <span className="text-ink-400">
                      {formatDate(event.date)}
                      {event.startTime && ` • ${formatTime(event.startTime)}`}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-ink-400">
                  Nothing on the calendar yet. Check back soon.
                </p>
              )}
            </LiveCard>
          </Reveal>

          {/* ── Announcement ── */}
          <Reveal delay={2}>
            <LiveCard
              icon={<Megaphone size={15} />}
              label="Important"
              to="/events?tab=announcements"
            >
              {notice ? (
                <>
                  <div className="mb-2.5 flex items-center gap-2">
                    <span className={cn('h-1.5 w-1.5 rounded-full', priorityStyles[notice.priority])} />
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-400">
                      {notice.priority}
                    </span>
                  </div>
                  <p className="font-display text-lg font-bold leading-tight text-ink-50">
                    {notice.title}
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink-300">
                    {notice.body}
                  </p>
                  <p className="mt-auto pt-4 font-mono text-[10px] uppercase tracking-wider text-ink-500">
                    {formatDate(notice.date)}
                  </p>
                </>
              ) : (
                <p className="text-sm text-ink-400">No active notices.</p>
              )}
            </LiveCard>
          </Reveal>

          {/* ── Maintenance ── */}
          <Reveal delay={3}>
            <LiveCard
              icon={<Wrench size={15} />}
              label="Something broken?"
              href={CLR_TICKET_URL}
            >
              <p className="font-display text-lg font-bold leading-tight text-ink-50">
                Report it in under a minute
              </p>
              <p className="mt-2 text-xs leading-relaxed text-ink-300">
                Electrical, plumbing, carpentry, cleaning — straight into the hostel&apos;s CLR
                ticket system.
              </p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-madhouse-500">
                Report issue <ArrowUpRight size={12} />
              </span>
            </LiveCard>
          </Reveal>
        </div>

      </div>
    </section>
  )
}

/* ── Card shell ──────────────────────────────────────────────────────────── */

function LiveCard({
  icon,
  label,
  children,
  to,
  href,
  accent,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
  to?: string
  href?: string
  accent?: boolean
}) {
  const body = (
    <div
      className={cn(
        'group relative flex h-full min-h-[13.5rem] flex-col rounded-2xl border p-5 transition-all duration-300 ease-smooth',
        'border-white/10 bg-white/[0.03] hover:-translate-y-1 hover:border-madhouse-500/50 hover:bg-white/[0.06]',
        accent && 'border-madhouse-500/35 bg-madhouse-500/[0.07]',
      )}
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="text-madhouse-500">{icon}</span>
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-ink-400">
          {label}
        </span>
        <ArrowUpRight
          size={13}
          className="ml-auto text-ink-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-madhouse-500"
        />
      </div>
      {children}
    </div>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className="block h-full">
        {body}
      </a>
    )
  }
  return (
    <Link to={to ?? '/'} className="block h-full">
      {body}
    </Link>
  )
}
