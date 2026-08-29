import { ArrowRight } from 'lucide-react'
import Gallery from '@/components/resources/Gallery'
import { ActionLink, Section, SectionHeading } from '@/components/ui/primitives'

/**
 * MOMENTS FROM MADHOUSE — a short cut of the photo roll. Filters are hidden
 * here; the full set with categories lives on the Resources page.
 */
export default function PhotoHighlights() {
  return (
    <Section tone="dark" size="lg">
      <SectionHeading
        eyebrow="The photo roll"
        title={
          <span className="text-ink-50">
            Moments from <span className="text-madhouse-500">Madhouse</span>
          </span>
        }
        description={
          <span className="text-ink-300">
            Every photograph on this site was taken inside Hostel 4. No stock imagery, anywhere.
          </span>
        }
        action={
          <ActionLink
            to="/resources#gallery"
            className="border-white/25 text-ink-50 hover:bg-white/10"
            variant="ghost"
          >
            View full gallery <ArrowRight size={15} />
          </ActionLink>
        }
      />

      <Gallery limit={6} showFilters={false} />
    </Section>
  )
}
