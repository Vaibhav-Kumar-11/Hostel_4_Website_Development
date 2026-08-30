import { useMemo, useState } from 'react'
import { Trophy } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { StandingsCard } from '@/components/gc/StandingsCard'
import { Reveal, Section, SectionHeading } from '@/components/ui/primitives'
import { GC_CATEGORIES, GC_TEAMS, GC_YEARS, gcCategoryMeta, gcResults } from '@/data/gc'
import type { GCCategory } from '@/types/content'
import { site } from '@/data/site'
import { usePageMeta } from '@/lib/meta'
import { cn, ordinal } from '@/lib/utils'

/**
 * GC — current standings plus the full history.
 *
 * The history view is a small chart built from divs rather than a charting
 * library: four series over a handful of years does not justify shipping a
 * plotting dependency, and this way it inherits the theme automatically.
 * Positions are drawn inverted (1st at the top) because that is how a league
 * table reads.
 */
export default function GC() {
  usePageMeta({
    title: `General Championship — ${site.name}`,
    description:
      'Hostel 4 in the IIT Bombay General Championship — current standings and season-by-season history across Tech, Sports, Cult and Sustainability.',
  })

  const [year, setYear] = useState<number>(GC_YEARS[0])
  const [category, setCategory] = useState<GCCategory | 'All'>('All')

  const season = useMemo(() => gcResults.filter((r) => r.year === year), [year])

  const history = useMemo(
    () =>
      gcResults
        .filter((r) => (category === 'All' ? true : r.category === category))
        .sort((a, b) => b.year - a.year || a.category.localeCompare(b.category)),
    [category],
  )

  return (
    <>
      <PageHeader
        eyebrow="General Championship"
        title="Madhouse"
        accent="GC"
        description="Four contingents carry the hostel's name across the institute championship. This is where the season stands, and where every season before it is recorded."
      >
        <div className="flex flex-wrap gap-6">
          {GC_CATEGORIES.map((c) => (
            <div key={c}>
              <div className="text-2xl leading-none" aria-hidden>
                {gcCategoryMeta[c].icon}
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em]">{c}</div>
            </div>
          ))}
        </div>
      </PageHeader>

      {/* ── Current standings ── */}
      <Section>
        <SectionHeading
          eyebrow={`Season ${year}`}
          title="Current standings"
          description={`Position out of ${GC_TEAMS} contesting hostels.`}
          action={
            <div className="inline-flex rounded-full border p-1">
              {GC_YEARS.map((y) => (
                <button
                  key={y}
                  onClick={() => setYear(y)}
                  className={cn(
                    'rounded-full px-4 py-1.5 font-mono text-xs font-semibold tracking-wider transition-all',
                    year === y ? 'bg-madhouse-500 text-white' : 'muted hover:text-[rgb(var(--text))]',
                  )}
                >
                  {y}
                </button>
              ))}
            </div>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {GC_CATEGORIES.map((c, i) => (
            <Reveal key={c} delay={i}>
              <StandingsCard category={c} result={season.find((r) => r.category === c)} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── History ── */}
      <Section tone="sunken">
        <SectionHeading
          eyebrow="Season by season"
          title="GC history"
          description="Filter by contingent to follow one story across the years."
          action={
            <div className="no-scrollbar flex gap-2 overflow-x-auto">
              <button
                onClick={() => setCategory('All')}
                className={cn('chip shrink-0', category === 'All' && 'chip-active')}
              >
                All
              </button>
              {GC_CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn('chip shrink-0', category === c && 'chip-active')}
                >
                  {c}
                </button>
              ))}
            </div>
          }
        />

        <Reveal>
          <PositionChart category={category} />
        </Reveal>

        <Reveal delay={1}>
          <div className="card mt-8 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                <caption className="sr-only">
                  Hostel 4 General Championship results by year and category
                </caption>
                <thead>
                  <tr className="border-b bg-[rgb(var(--surface-sunken))]">
                    {['Year', 'Category', 'Position'].map((h) => (
                      <th
                        key={h}
                        className="muted px-5 py-4 font-mono text-[10px] uppercase tracking-[0.16em]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map((r) => (
                    <tr
                      key={`${r.year}-${r.category}`}
                      className="border-b transition-colors last:border-0 hover:bg-[rgb(var(--surface-sunken))]"
                    >
                      <td className="px-5 py-4 font-mono tabular-nums">{r.year}</td>
                      <td className="px-5 py-4 font-semibold">{r.category}</td>
                      <td className="px-5 py-4">
                        {r.position ? (
                          <span
                            className={cn(
                              'font-display text-base font-bold',
                              r.position <= 3 ? 'text-madhouse-500' : '',
                            )}
                          >
                            {ordinal(r.position)}
                          </span>
                        ) : (
                          <span className="muted">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

      </Section>

      {/* ── Trophy wall ── */}
      <Section tone="dark" size="sm">
        <div className="flex flex-col items-center gap-5 text-center">
          <Trophy size={30} className="text-madhouse-500" />
          <h2 className="max-w-2xl text-3xl font-bold uppercase tracking-tight text-ink-50 sm:text-4xl">
            The trophy wall is written by whoever shows up
          </h2>
          <p className="muted max-w-xl text-sm leading-relaxed text-ink-300">
            Every contingent takes anyone who turns up to the first practice. If you have never
            represented the hostel before, that is the usual way people start.
          </p>
        </div>
      </Section>
    </>
  )
}

/* ── Position chart ──────────────────────────────────────────────────────── */

const seriesColor: Record<GCCategory, string> = {
  Tech: 'bg-sky-500',
  Sports: 'bg-emerald-500',
  Cult: 'bg-fuchsia-500',
  SUS: 'bg-lime-500',
}

/**
 * Grouped column chart, hand-built. Bar height is inverted position, so a
 * taller column means a better finish. Years with no declared result render an
 * explicit dashed placeholder column rather than a zero-height bar that could
 * be mistaken for last place.
 */
function PositionChart({ category }: { category: GCCategory | 'All' }) {
  const shown = category === 'All' ? GC_CATEGORIES : [category]
  const years = [...GC_YEARS].sort((a, b) => a - b)

  return (
    <div className="card p-6 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2">
        {shown.map((c) => (
          <span key={c} className="muted flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
            <span className={cn('h-2.5 w-2.5 rounded-sm', seriesColor[c])} />
            {c}
          </span>
        ))}
        <span className="muted ml-auto font-mono text-[10px] uppercase tracking-wider">
          Taller = better finish
        </span>
      </div>

      <div className="flex items-end gap-6 overflow-x-auto pb-2 sm:gap-10">
        {years.map((y) => (
          <div key={y} className="flex min-w-[6rem] flex-1 flex-col items-center gap-3">
            <div className="flex h-48 w-full items-end justify-center gap-1.5">
              {shown.map((c) => {
                const result = gcResults.find((r) => r.year === y && r.category === c)
                const pos = result?.position ?? null
                const height = pos ? Math.max(8, ((GC_TEAMS - pos + 1) / GC_TEAMS) * 100) : 0

                return (
                  <div key={c} className="group relative flex h-full flex-1 items-end">
                    {pos ? (
                      <div
                        className={cn('w-full rounded-t-md transition-all duration-700 ease-smooth', seriesColor[c])}
                        style={{ height: `${height}%` }}
                        title={`${c} ${y}: ${ordinal(pos)}`}
                      >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] font-bold opacity-0 transition-opacity group-hover:opacity-100">
                          {ordinal(pos)}
                        </span>
                      </div>
                    ) : (
                      <div
                        className="w-full rounded-t-md border border-dashed border-[rgb(var(--border))]"
                        style={{ height: '14%' }}
                        title={`${c} ${y}: result not declared`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
            <span className="muted font-mono text-xs tabular-nums">{y}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
