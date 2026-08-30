import { ArrowRight } from 'lucide-react'
import { GC_CATEGORIES, GC_YEARS, gcResults } from '@/data/gc'
import { StandingsCard } from '@/components/gc/StandingsCard'
import { ActionLink, Reveal, Section, SectionHeading } from '@/components/ui/primitives'

/**
 * GC preview on the homepage — current season only. The full history,
 * filters and charts live on the GC page.
 */
export default function GCHighlights() {
  const season = GC_YEARS[0]
  const current = gcResults.filter((r) => r.year === season)

  return (
    <Section id="gc" tone="sunken">
      <SectionHeading
        eyebrow={`General Championship · ${season}`}
        title={
          <>
            Madhouse <span className="text-madhouse-500">GC</span>
          </>
        }
        description="Four contingents, one banner. Tech, Sports, Cult and Sustainability — where the hostel stands this season."
        action={
          <ActionLink to="/gc" variant="ghost">
            GC history <ArrowRight size={15} />
          </ActionLink>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {GC_CATEGORIES.map((category, i) => (
          <Reveal key={category} delay={i}>
            <StandingsCard
              category={category}
              result={current.find((r) => r.category === category)}
            />
          </Reveal>
        ))}
      </div>

    </Section>
  )
}
