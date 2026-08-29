import { useState } from 'react'
import { Check, Clock } from 'lucide-react'
import { MESS_DATA_VERIFIED, weekdayNames } from '@/data/mess'
import { getMenuForDay, mealPhase, orderedMeals } from '@/lib/mess'
import { useNow } from '@/hooks'
import { PlaceholderNote, Reveal, Section, SectionHeading } from '@/components/ui/primitives'
import { cn, formatTime } from '@/lib/utils'

/**
 * TODAY AT MADHOUSE — the mess day, laid out as a timeline.
 *
 * Three views share one component: today, tomorrow, and the full week. The
 * "today" view marks each meal as done / serving / upcoming from the live
 * clock, so a resident can tell at a glance whether they have missed lunch.
 */

type View = 'today' | 'tomorrow' | 'week'

export default function TodayAtMadhouse() {
  const now = useNow(30_000)
  const [view, setView] = useState<View>('today')

  const todayIndex = now.getDay()
  const dayIndex = view === 'tomorrow' ? (todayIndex + 1) % 7 : todayIndex
  const menu = getMenuForDay(dayIndex)

  return (
    <Section id="today" tone="sunken" className="scroll-mt-24">
      <SectionHeading
        eyebrow="The mess clock"
        title={
          <>
            Today at <span className="text-madhouse-500">Madhouse</span>
          </>
        }
        description="Breakfast to late dinner, with the current meal marked live. Switch to the week view to plan ahead."
        action={
          <div className="inline-flex rounded-full border p-1">
            {(['today', 'tomorrow', 'week'] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200',
                  view === v
                    ? 'bg-madhouse-500 text-white shadow-sm'
                    : 'muted hover:text-[rgb(var(--text))]',
                )}
              >
                {v}
              </button>
            ))}
          </div>
        }
      />

      {view === 'week' ? (
        <WeekTable todayIndex={todayIndex} />
      ) : (
        <>
          <p className="eyebrow mb-6">
            {view === 'today' ? 'Today' : 'Tomorrow'} · {weekdayNames[dayIndex]}
          </p>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {orderedMeals.map((meal, i) => {
              const phase = view === 'today' ? mealPhase(meal, now) : 'upcoming'
              const items = menu[meal.key] ?? []

              return (
                <Reveal key={meal.key} delay={i}>
                  <article
                    className={cn(
                      'card relative flex h-full flex-col overflow-hidden p-6',
                      phase === 'now' && 'border-madhouse-500 shadow-glow',
                      phase === 'past' && 'opacity-55',
                    )}
                  >
                    {phase === 'now' && (
                      <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-madhouse-500 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white">
                        <span className="h-1 w-1 animate-pulse-dot rounded-full bg-white" />
                        Now
                      </span>
                    )}
                    {phase === 'past' && (
                      <span className="muted absolute right-4 top-4">
                        <Check size={15} />
                      </span>
                    )}

                    <span className="text-3xl leading-none">{meal.icon}</span>

                    <h3 className="mt-4 text-xl font-bold uppercase tracking-tight">
                      {meal.label}
                    </h3>

                    <p className="muted mt-1.5 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider">
                      <Clock size={11} />
                      {formatTime(meal.start)} – {formatTime(meal.end)}
                    </p>

                    <ul className="mt-5 space-y-2 border-t pt-5">
                      {items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm leading-snug">
                          <span
                            className="mt-[0.42rem] h-1 w-1 shrink-0 rounded-full bg-madhouse-500"
                            aria-hidden
                          />
                          {item}
                        </li>
                      ))}
                      {items.length === 0 && (
                        <li className="muted text-sm">Menu to be announced.</li>
                      )}
                    </ul>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </>
      )}

      {!MESS_DATA_VERIFIED && (
        <Reveal delay={5}>
          <PlaceholderNote className="mt-8">
            Sample menu and timings. Replace the arrays in{' '}
            <code className="font-mono">src/data/mess.ts</code> with the official mess schedule and
            flip <code className="font-mono">MESS_DATA_VERIFIED</code> to <code>true</code> — this
            note disappears and the live clock starts telling the truth.
          </PlaceholderNote>
        </Reveal>
      )}
    </Section>
  )
}

/* ── Week view ───────────────────────────────────────────────────────────── */

function WeekTable({ todayIndex }: { todayIndex: number }) {
  return (
    <Reveal>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b bg-[rgb(var(--surface-sunken))]">
                <th className="muted px-5 py-4 font-mono text-[10px] uppercase tracking-[0.16em]">
                  Day
                </th>
                {orderedMeals.map((m) => (
                  <th
                    key={m.key}
                    className="muted px-5 py-4 font-mono text-[10px] uppercase tracking-[0.16em]"
                  >
                    {m.icon} {m.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weekdayNames.map((day, index) => {
                const menu = getMenuForDay(index)
                const isToday = index === todayIndex
                return (
                  <tr
                    key={day}
                    className={cn(
                      'border-b last:border-0 transition-colors',
                      isToday
                        ? 'bg-madhouse-500/[0.07]'
                        : 'hover:bg-[rgb(var(--surface-sunken))]',
                    )}
                  >
                    <th scope="row" className="whitespace-nowrap px-5 py-4 align-top font-semibold">
                      {day.slice(0, 3)}
                      {isToday && (
                        <span className="ml-2 rounded-full bg-madhouse-500 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wider text-white">
                          Today
                        </span>
                      )}
                    </th>
                    {orderedMeals.map((m) => (
                      <td key={m.key} className="muted px-5 py-4 align-top text-[13px] leading-relaxed">
                        {(menu[m.key] ?? []).join(', ') || '—'}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Reveal>
  )
}
