import { ArrowRight } from 'lucide-react'
import { amenities } from '@/data/amenities'
import { AmenityCard } from '@/components/life/AmenityCard'
import { ActionLink, Reveal, Section, SectionHeading } from '@/components/ui/primitives'

/**
 * LIFE AT MADHOUSE teaser. Facilities that have a real photograph lead the
 * grid; the rest keep their typographic treatment. Layout is deliberately
 * asymmetric so this section does not read like the card grids above it.
 */
export default function LifeTeaser() {
  const withPhotos = amenities.filter((a) => a.photo)
  const withoutPhotos = amenities.filter((a) => !a.photo).slice(0, 3)
  const [lead, ...rest] = withPhotos

  return (
    <Section id="life">
      <SectionHeading
        eyebrow="Inside the building"
        title={
          <>
            Life at <span className="text-madhouse-500">Madhouse</span>
          </>
        }
        description="A gym that fills up at 11 p.m., a reading room that never really closes, and a sports room where the queue is half the fun."
        action={
          <ActionLink to="/life" variant="ghost">
            Explore hostel life <ArrowRight size={15} />
          </ActionLink>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {lead && (
          <Reveal className="lg:row-span-2">
            <AmenityCard amenity={lead} featured linkTo={`/life#${lead.id}`} />
          </Reveal>
        )}

        {rest.slice(0, 2).map((a, i) => (
          <Reveal key={a.id} delay={i + 1} className="lg:col-span-2">
            <AmenityCard amenity={a} linkTo={`/life#${a.id}`} />
          </Reveal>
        ))}

        {rest.slice(2).map((a, i) => (
          <Reveal key={a.id} delay={i + 3}>
            <AmenityCard amenity={a} linkTo={`/life#${a.id}`} />
          </Reveal>
        ))}

        {withoutPhotos.map((a, i) => (
          <Reveal key={a.id} delay={i + 4}>
            <AmenityCard amenity={a} linkTo={`/life#${a.id}`} />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
