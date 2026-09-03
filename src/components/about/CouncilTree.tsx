import { CouncilCard } from './CouncilCard'
import { Reveal } from '@/components/ui/primitives'
import { councilLevels, directReports, membersAtLevel } from '@/data/council'
import { cn } from '@/lib/utils'

/**
 * THE COUNCIL, AS A CHAIN OF RESPONSIBILITY.
 *
 * A flat grid of cards answers "who is on the council". It does not answer the
 * question a resident actually arrives with, which is "who do I take this to,
 * and who do I go to when that does not work". So the page is laid out as the
 * hierarchy itself: wardens at the top, then the hall manager, the general
 * secretary, the councillors, and the secretaries under each of them.
 *
 * The tiers come from the data, not from this file. Adding a sixth tier, or
 * emptying one, changes the page without touching the component — and an empty
 * tier is skipped rather than drawn as a gap.
 */
export default function CouncilTree() {
  // Only tiers that actually have someone on them.
  const tiers = councilLevels
    .map((tier) => ({ ...tier, members: membersAtLevel(tier.level) }))
    .filter((tier) => tier.members.length > 0)

  if (tiers.length === 0) return null

  return (
    <div className="relative">
      {tiers.map((tier, tierIndex) => {
        const isLast = tierIndex === tiers.length - 1

        return (
          <section key={tier.level} className="relative" aria-label={tier.label}>
            {/* Tier label, with the rule that carries the eye down the page. */}
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="eyebrow whitespace-nowrap">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-madhouse-500/12 font-mono text-[10px] font-bold text-madhouse-500">
                    {tier.level}
                  </span>
                  {tier.label}
                </span>
                <span className="hairline flex-1" aria-hidden />
              </div>
            </Reveal>

            {/* The people on this tier. */}
            <div
              className={cn(
                'mt-6 grid gap-4',
                // A single role is not stretched across the row; it sits at
                // its natural width so the hierarchy reads as a spine.
                tier.members.length === 1
                  ? 'max-w-sm'
                  : tier.members.length === 2
                    ? 'sm:grid-cols-2'
                    : 'sm:grid-cols-2 lg:grid-cols-3',
              )}
            >
              {tier.members.map((member, i) => {
                const reports = directReports(member.id)
                return (
                  <Reveal key={member.id} delay={i} className="h-full">
                    <CouncilCard
                      member={member}
                      reportCount={tier.level === 4 ? reports.length : 0}
                    />
                  </Reveal>
                )
              })}
            </div>

            {/*
              Connector into the next tier. Decorative, and hidden on small
              screens where the stack already reads top-to-bottom.
            */}
            {!isLast && (
              <div className="flex justify-center py-7" aria-hidden>
                <span className="h-10 w-px bg-gradient-to-b from-[rgb(var(--border))] to-transparent" />
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
