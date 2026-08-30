import PageHeader from '@/components/ui/PageHeader'
import { AmenityCard } from '@/components/life/AmenityCard'
import FloorPlans from '@/components/life/FloorPlans'
import { Reveal, Section, SectionHeading } from '@/components/ui/primitives'
import { amenities } from '@/data/amenities'
import { media, site } from '@/data/site'
import { usePageMeta } from '@/lib/meta'
import { asset, cn } from '@/lib/utils'

/**
 * LIFE — the facilities, then the day they add up to.
 *
 * The day narrative deliberately carries no invented detail: it describes what
 * the photographs show and what the facilities are for, nothing more.
 */

const dayChapters = [
  {
    time: '07:30',
    title: 'Morning',
    body: 'The mess opens and the lobby fills with people who look like they have not slept, because several of them have not.',
    photo: media.pathway,
  },
  {
    time: '12:00',
    title: 'Between classes',
    body: 'Lunch, then the walk back across campus. The quadrangle is the shortcut everyone takes and nobody hurries through.',
  },
  {
    time: '17:00',
    title: 'Evening',
    body: 'The gym floor fills, the carrom boards get claimed, and somewhere a wing is arguing about a football fixture.',
    photo: media.gym,
  },
  {
    time: '21:00',
    title: 'Night',
    body: 'Dinner, then the reading room. Desks fill from the window side inward. It stays like this for hours.',
    photo: media.readingRoom,
  },
  {
    time: '01:00',
    title: 'Late',
    body: 'Corridor conversations that were supposed to last five minutes. This is the part nobody puts in a brochure and everybody remembers.',
  },
]

export default function Life() {
  usePageMeta({
    title: `Life at Madhouse — ${site.name}`,
    description:
      'Inside Hostel 4, IIT Bombay — the reading room, gym, indoor sports room, music and dance rooms, common room and everything in between.',
  })

  return (
    <>
      <PageHeader
        eyebrow="Inside the building"
        title="Life at"
        accent="Madhouse"
        image={media.readingRoom}
        description="Eight spaces that a thousand people share, and somehow it works. Here is what is actually in the building."
      />

      {/* ── Facilities ── */}
      <Section>
        <SectionHeading
          eyebrow="Facilities"
          title="The spaces"
          description="Every photograph below was taken inside Hostel 4."
        />

        {/*
          Eight facilities. The lead card spans two columns at lg, which makes
          nine grid cells across three columns — three full rows with no ragged
          gap at the end. `auto-rows-fr` keeps every card in a row the same
          height so the block reads as a solid grid.
        */}
        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((a, i) => (
            <Reveal
              key={a.id}
              delay={i}
              className={cn('h-full', i === 0 && 'lg:col-span-2')}
            >
              <AmenityCard amenity={a} featured={i === 0} />
            </Reveal>
          ))}
        </div>

      </Section>

      <FloorPlans />

      {/* ── A day in Madhouse ── */}
      <Section tone="dark" size="lg">
        <SectionHeading
          eyebrow="From one morning to the next"
          title={<span className="text-ink-50">A day in Madhouse</span>}
          description={
            <span className="text-ink-300">
              Not a schedule. Just the shape most days take here.
            </span>
          }
        />

        <ol className="relative ml-2 border-l border-white/12 pl-8 sm:ml-5 sm:pl-14">
          {dayChapters.map((chapter, i) => (
            <Reveal key={chapter.time} delay={i} as="li" className="relative pb-16 last:pb-0">
              <span className="absolute -left-[2.3rem] top-2 h-3 w-3 rounded-full border-2 border-madhouse-500 bg-ink-950 sm:-left-[3.8rem]" />

              <div className="grid gap-7 lg:grid-cols-[1fr_1.1fr] lg:items-center">
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.22em] text-madhouse-500">
                    {chapter.time}
                  </span>
                  <h3 className="mt-2.5 text-3xl font-bold uppercase leading-none tracking-tight text-ink-50 sm:text-4xl">
                    {chapter.title}
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-300">
                    {chapter.body}
                  </p>
                </div>

                {chapter.photo && (
                  <img
                    src={asset(chapter.photo)}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="aspect-[16/10] w-full rounded-2xl border border-white/10 object-cover"
                  />
                )}
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* ── Closing ── */}
      <Section size="sm">
        <Reveal>
          <p className="mx-auto max-w-3xl text-center text-2xl font-medium leading-snug sm:text-3xl">
            1250 rooms, and it still manages to feel like{' '}
            <span className="text-madhouse-500">everyone knows everyone.</span>
          </p>
        </Reveal>
      </Section>
    </>
  )
}
