import { Trophy } from 'lucide-react'
import type { GCCategory, GCResult } from '@/types/content'
import { GC_TEAMS, gcCategoryMeta } from '@/data/gc'
import { cn, ordinal } from '@/lib/utils'

/**
 * A single General Championship result.
 *
 * `position: null` is a first-class state, not an error. An undeclared result
 * shows a dash and no caption rather than a fabricated rank. Once a real
 * position is entered the bar fills proportionally to the field size
 * (GC_TEAMS) and the top three pick up podium colouring.
 */

const podium: Record<number, string> = {
  1: 'from-amber-300 to-amber-500 text-amber-950',
  2: 'from-zinc-200 to-zinc-400 text-zinc-900',
  3: 'from-orange-300 to-orange-500 text-orange-950',
}

export function StandingsCard({
  result,
  category,
  showBlurb = true,
}: {
  result?: GCResult
  category: GCCategory
  showBlurb?: boolean
}) {
  const meta = gcCategoryMeta[category]
  const position = result?.position ?? null
  // Inverted so 1st fills the bar and last place barely registers.
  const fill = position ? Math.max(6, ((GC_TEAMS - position + 1) / GC_TEAMS) * 100) : 0

  return (
    <article className="card card-hover group relative flex h-full flex-col overflow-hidden p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <span className="text-2xl leading-none" aria-hidden>
            {meta.icon}
          </span>
          <h3 className="mt-3 text-xl font-bold uppercase tracking-tight">{category}</h3>
        </div>

        {position ? (
          <span
            className={cn(
              'grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br font-display text-sm font-bold',
              podium[position] ?? 'from-[rgb(var(--surface-sunken))] to-[rgb(var(--surface-sunken))]',
            )}
          >
            {ordinal(position)}
          </span>
        ) : (
          <span className="muted grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-dashed text-xs">
            —
          </span>
        )}
      </div>

      {showBlurb && <p className="muted mb-5 text-sm leading-relaxed">{meta.blurb}</p>}

      <div className="mt-auto">
        <div className="h-1.5 overflow-hidden rounded-full bg-[rgb(var(--surface-sunken))]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-madhouse-400 to-madhouse-600 transition-[width] duration-1000 ease-smooth"
            style={{ width: `${fill}%` }}
          />
        </div>
        {position && (
          <p className="muted mt-2.5 font-mono text-[10px] uppercase tracking-[0.14em]">
            {ordinal(position)} of {GC_TEAMS} hostels
          </p>
        )}
      </div>

      {result?.note && <p className="muted mt-3 text-xs italic">{result.note}</p>}

      <Trophy
        size={92}
        aria-hidden
        className="pointer-events-none absolute -bottom-5 -right-5 text-madhouse-500/[0.055] transition-transform duration-700 ease-smooth group-hover:scale-110 group-hover:rotate-6"
      />
    </article>
  )
}
