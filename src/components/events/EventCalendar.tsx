import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { events } from '@/data/events'
import { categoryColor } from './Cards'
import { cn, formatTime, toISODate } from '@/lib/utils'

/**
 * Month calendar.
 *
 * Built from `Date` arithmetic rather than a date library — one month grid and
 * a day selection do not justify the bundle. Weeks start on Monday, which is
 * how a hostel week actually runs.
 */

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function EventCalendar({ onSelectEvent }: { onSelectEvent?: (id: string) => void }) {
  const today = useMemo(() => new Date(), [])
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState<string>(() => toISODate(today))

  const byDate = useMemo(() => {
    const map = new Map<string, typeof events>()
    events.forEach((e) => {
      const list = map.get(e.date) ?? []
      list.push(e)
      map.set(e.date, list)
    })
    return map
  }, [])

  const grid = useMemo(() => {
    const year = cursor.getFullYear()
    const month = cursor.getMonth()
    const first = new Date(year, month, 1)
    // getDay() is Sunday-first; shift so Monday is column 0.
    const leading = (first.getDay() + 6) % 7
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const cells: Array<{ date: Date; inMonth: boolean }> = []
    for (let i = leading; i > 0; i--) {
      cells.push({ date: new Date(year, month, 1 - i), inMonth: false })
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(year, month, d), inMonth: true })
    }
    // Pad to whole weeks so the grid never changes height mid-year.
    while (cells.length % 7 !== 0) {
      cells.push({
        date: new Date(year, month, daysInMonth + (cells.length % 7)),
        inMonth: false,
      })
    }
    return cells
  }, [cursor])

  const selectedEvents = byDate.get(selected) ?? []
  const todayISO = toISODate(today)

  function shiftMonth(delta: number) {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      {/* Grid */}
      <div className="card p-5 sm:p-7">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold uppercase tracking-tight">
            {cursor.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex gap-1.5">
            <button
              onClick={() => shiftMonth(-1)}
              className="grid h-9 w-9 place-items-center rounded-full border transition-colors hover:bg-[rgb(var(--surface-sunken))]"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => {
                setCursor(new Date(today.getFullYear(), today.getMonth(), 1))
                setSelected(todayISO)
              }}
              className="rounded-full border px-3.5 text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-[rgb(var(--surface-sunken))]"
            >
              Today
            </button>
            <button
              onClick={() => shiftMonth(1)}
              className="grid h-9 w-9 place-items-center rounded-full border transition-colors hover:bg-[rgb(var(--surface-sunken))]"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="muted py-2 text-center font-mono text-[10px] uppercase tracking-wider"
            >
              {d.slice(0, 1)}
              <span className="hidden sm:inline">{d.slice(1)}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {grid.map(({ date, inMonth }, i) => {
            const iso = toISODate(date)
            const dayEvents = byDate.get(iso) ?? []
            const isToday = iso === todayISO
            const isSelected = iso === selected

            return (
              <button
                key={i}
                onClick={() => setSelected(iso)}
                className={cn(
                  'relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition-all duration-200',
                  !inMonth && 'opacity-30',
                  isSelected
                    ? 'bg-madhouse-500 font-bold text-white'
                    : 'hover:bg-[rgb(var(--surface-sunken))]',
                  isToday && !isSelected && 'ring-1 ring-inset ring-madhouse-500',
                )}
                aria-label={`${date.toDateString()}${dayEvents.length ? `, ${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}` : ''}`}
                aria-pressed={isSelected}
              >
                <span className="tabular-nums">{date.getDate()}</span>
                {dayEvents.length > 0 && (
                  <span className="absolute bottom-1.5 flex gap-0.5">
                    {dayEvents.slice(0, 3).map((e) => (
                      <span
                        key={e.id}
                        className={cn(
                          'h-1 w-1 rounded-full',
                          isSelected ? 'bg-white' : 'bg-madhouse-500',
                        )}
                      />
                    ))}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Day detail */}
      <div className="card flex flex-col p-5 sm:p-7">
        <p className="eyebrow mb-1">Selected day</p>
        <h3 className="mb-5 text-lg font-bold uppercase tracking-tight">
          {new Date(selected).toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </h3>

        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="flex-1 space-y-3"
          >
            {selectedEvents.length === 0 ? (
              <div className="muted flex h-full min-h-[9rem] flex-col items-center justify-center gap-3 text-center">
                <CalendarDays size={22} />
                <p className="text-sm">Nothing scheduled on this day.</p>
              </div>
            ) : (
              selectedEvents.map((e) => (
                <button
                  key={e.id}
                  onClick={() => onSelectEvent?.(e.id)}
                  className="w-full rounded-xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-madhouse-500"
                >
                  <span
                    className={cn(
                      'inline-block rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em]',
                      categoryColor[e.category],
                    )}
                  >
                    {e.category}
                  </span>
                  <p className="mt-2.5 text-sm font-bold uppercase leading-tight tracking-tight">
                    {e.title}
                  </p>
                  <p className="muted mt-2 flex items-center gap-1.5 text-xs">
                    <MapPin size={11} /> {e.venue}
                  </p>
                  {e.startTime && (
                    <p className="muted mt-1 font-mono text-[10px] uppercase tracking-wider">
                      {formatTime(e.startTime)}
                      {e.endTime && ` – ${formatTime(e.endTime)}`}
                    </p>
                  )}
                </button>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
