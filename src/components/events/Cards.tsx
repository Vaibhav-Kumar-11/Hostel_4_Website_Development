import { CalendarPlus, Clock, ExternalLink, MapPin, Paperclip } from 'lucide-react'
import type { Announcement, EventCategory, HostelEvent } from '@/types/content'
import { downloadEventICS } from '@/lib/ics'
import { asset, cn, formatDate, formatLongDate, formatTime, relativeDay } from '@/lib/utils'

/**
 * The two card types that appear on both the homepage and the Events page.
 * Keeping one implementation means an announcement looks identical wherever a
 * resident meets it.
 */

export const categoryColor: Record<EventCategory, string> = {
  Tech: 'text-sky-500 border-sky-500/35 bg-sky-500/10',
  Sports: 'text-emerald-500 border-emerald-500/35 bg-emerald-500/10',
  Cult: 'text-fuchsia-500 border-fuchsia-500/35 bg-fuchsia-500/10',
  SUS: 'text-lime-600 border-lime-500/35 bg-lime-500/10 dark:text-lime-400',
  Hostel: 'text-madhouse-500 border-madhouse-500/35 bg-madhouse-500/10',
  Festivals: 'text-amber-500 border-amber-500/35 bg-amber-500/10',
  Social: 'text-violet-500 border-violet-500/35 bg-violet-500/10',
}

const priorityMeta = {
  urgent: { dot: 'bg-red-500', ring: 'border-l-red-500', label: 'Urgent' },
  important: { dot: 'bg-amber-500', ring: 'border-l-amber-500', label: 'Important' },
  general: { dot: 'bg-sky-500', ring: 'border-l-sky-500', label: 'General' },
} as const

/* ── Event ───────────────────────────────────────────────────────────────── */

export function EventCard({
  event,
  past = false,
  compact = false,
}: {
  event: HostelEvent
  past?: boolean
  compact?: boolean
}) {
  return (
    <article
      id={`event-${event.id}`}
      className={cn(
        'card card-hover group flex h-full flex-col overflow-hidden scroll-mt-28',
        past && 'opacity-80 hover:opacity-100',
      )}
    >
      {event.poster && (
        <div className="aspect-[16/9] overflow-hidden bg-[rgb(var(--surface-sunken))]">
          <img
            src={asset(event.poster)}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
          />
        </div>
      )}

      <div className={cn('flex flex-1 flex-col', compact ? 'p-5' : 'p-6')}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em]',
              categoryColor[event.category],
            )}
          >
            {event.category}
          </span>
          {!past && (
            <span className="muted font-mono text-[10px] uppercase tracking-wider">
              {relativeDay(event.date)}
            </span>
          )}
        </div>

        <h3
          className={cn(
            'font-bold uppercase leading-tight tracking-tight',
            compact ? 'text-lg' : 'text-xl',
          )}
        >
          {event.title}
        </h3>

        <p className="muted mt-3 line-clamp-3 text-sm leading-relaxed">{event.description}</p>

        <dl className="muted mt-5 space-y-1.5 border-t pt-4 text-xs">
          <div className="flex items-center gap-2">
            <dt className="sr-only">Date</dt>
            <Clock size={12} className="shrink-0" />
            <dd>
              {formatLongDate(event.date)}
              {event.startTime && (
                <>
                  {' · '}
                  {formatTime(event.startTime)}
                  {event.endTime && ` – ${formatTime(event.endTime)}`}
                </>
              )}
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="sr-only">Venue</dt>
            <MapPin size={12} className="shrink-0" />
            <dd>{event.venue}</dd>
          </div>
        </dl>

        {!past && (
          <div className="mt-5 flex flex-wrap gap-2">
            {event.registrationUrl && (
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-primary px-4 py-2 text-xs"
              >
                Register <ExternalLink size={12} />
              </a>
            )}
            <button
              onClick={() => downloadEventICS(event)}
              className="btn btn-ghost px-4 py-2 text-xs"
              title="Download a calendar file for this event"
            >
              <CalendarPlus size={13} /> Add to calendar
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

/* ── Announcement ────────────────────────────────────────────────────────── */

export function AnnouncementCard({ item }: { item: Announcement }) {
  const meta = priorityMeta[item.priority]

  return (
    <article
      className={cn(
        'card card-hover border-l-[3px] p-5 sm:p-6',
        meta.ring,
      )}
    >
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-2">
          <span className={cn('h-1.5 w-1.5 rounded-full', meta.dot)} aria-hidden />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
            {meta.label}
          </span>
        </span>
        <span className="muted font-mono text-[10px] uppercase tracking-wider">
          {formatDate(item.date)}
        </span>
        {item.pinned && (
          <span className="muted ml-auto rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider">
            Pinned
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold uppercase leading-tight tracking-tight">{item.title}</h3>
      <p className="muted mt-2.5 text-sm leading-relaxed">{item.body}</p>

      {(item.link || item.attachment) && (
        <div className="mt-4 flex flex-wrap gap-4">
          {item.link && (
            <a
              href={item.link.href}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-madhouse-500 hover:underline"
            >
              {item.link.label} <ExternalLink size={11} />
            </a>
          )}
          {item.attachment && (
            <a
              href={item.attachment.href}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-madhouse-500 hover:underline"
            >
              <Paperclip size={11} /> {item.attachment.label}
            </a>
          )}
        </div>
      )}
    </article>
  )
}
