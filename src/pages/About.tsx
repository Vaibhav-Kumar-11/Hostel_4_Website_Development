import { History } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { CouncilCard } from '@/components/about/CouncilCard'
import LocationSection from '@/components/about/LocationSection'
import { Reveal, Section, SectionHeading, Stat } from '@/components/ui/primitives'
import { council } from '@/data/council'
import { legacy } from '@/data/gallery'
import { hostelFacts } from '@/data/utilities'
import { media, site } from '@/data/site'
import { usePageMeta } from '@/lib/meta'
import { asset } from '@/lib/utils'

/**
 * ABOUT — identity, facts, the people who run the place, the legacy timeline
 * and the map. The brief folds Council and Location into this page rather
 * than giving them their own tabs.
 */
export default function About() {
  usePageMeta({
    title: `About — ${site.name}`,
    description:
      'Hostel 4, IIT Bombay — the largest hostel on campus, and the community that lives in it. Council, hostel facts, legacy and location.',
  })

  const administration = council.filter((m) => m.group === 'Administration')
  const secretaries = council.filter((m) => m.group === 'Council')

  return (
    <>
      <PageHeader
        eyebrow="Who we are"
        title="About"
        accent="Madhouse"
        image={media.pathway}
        description="Hostel 4 at IIT Bombay does not really go by Hostel 4. It goes by Madhouse — and the name is not decoration."
      />

      {/* ── Identity ── */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
          <div>
            <Reveal>
              <p className="text-2xl font-medium leading-snug sm:text-3xl">
                Madhouse is the largest hostel at IIT Bombay — over{' '}
                <span className="text-madhouse-500">1250 rooms</span>, each with its own balcony,
                stacked into a building that takes a full minute to walk end to end.
              </p>
            </Reveal>

            <Reveal delay={1}>
              <div className="muted mt-8 space-y-5 text-base leading-relaxed">
                <p>
                  Scale is the obvious thing about it. The less obvious thing is what scale does to
                  a community. A hostel this size does not have one culture; it has a dozen running
                  at once — a reading room that fills up at midnight, a gym floor busy at eleven, a
                  sports room where the queue for the carrom board is its own social event, and a
                  quadrangle that turns into a stage every festival season.
                </p>
                <p>
                  Four contingents carry the hostel&apos;s name into the General Championship —
                  Tech, Sports, Cult and Sustainability. Between GC seasons there are wing
                  rivalries, open mics, hack nights, Valfi, and the specific kind of 2 a.m.
                  conversation that only happens in a corridor.
                </p>
                <p className="font-medium text-[rgb(var(--text))]">
                  Madhouse is a community and a culture. The building is just where it happens to
                  live.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={2}>
            <figure className="overflow-hidden rounded-2xl border">
              <img
                src={asset(media.hero)}
                alt="Hostel 4 residential wings at night, seen from the quadrangle"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
              <figcaption className="muted border-t px-5 py-4 text-xs leading-relaxed">
                The quadrangle at night — Hostel 4, IIT Bombay.
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </Section>

      {/* ── Facts ── */}
      <Section tone="sunken" size="sm">
        <SectionHeading
          eyebrow="Hostel facts"
          title="The verified numbers"
          description="The numbers that make Madhouse what it is."
        />
        <div className="grid gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {hostelFacts.map((fact, i) => (
            <Reveal key={fact.id} delay={i}>
              <div className="border-l pl-6">
                <Stat
                  value={fact.value}
                  text={fact.text}
                  suffix={fact.suffix}
                  label={fact.label}
                  note={fact.note}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Council ── */}
      <Section id="council" className="scroll-mt-24">
        <SectionHeading
          eyebrow="The people who run it"
          title={
            <>
              Meet the Madhouse <span className="text-madhouse-500">Council</span>
            </>
          }
          description="Wardens, secretaries and representatives — who to go to, and for what."
        />

        <h3 className="eyebrow mb-5">Administration</h3>
        <div className="mb-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {administration.map((m, i) => (
            <Reveal key={m.id} delay={i}>
              <CouncilCard member={m} />
            </Reveal>
          ))}
        </div>

        <h3 className="eyebrow mb-5">Hostel Council</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {secretaries.map((m, i) => (
            <Reveal key={m.id} delay={i}>
              <CouncilCard member={m} />
            </Reveal>
          ))}
        </div>

      </Section>

      {/* ── Legacy ── */}
      <Section id="legacy" tone="dark" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Since the beginning"
          title={<span className="text-ink-50">The legacy of Madhouse</span>}
          description={
            <span className="text-ink-300">
              GC banners, traditions, and the years residents still bring up.
            </span>
          }
        />

        {legacy.length === 0 ? (
          <Reveal>
            <div className="rounded-2xl border border-white/12 bg-white/[0.03] px-6 py-16 text-center sm:px-12">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-madhouse-500/12 text-madhouse-500">
                <History size={22} />
              </span>
              <h3 className="mt-6 text-2xl font-bold uppercase tracking-tight text-ink-50">
                Every hostel has a memory
              </h3>
              <p className="muted mx-auto mt-4 max-w-lg text-sm leading-relaxed text-ink-300">
                The wins, the traditions and the nights that people still talk about years later.
                If you were there for one of them, the Council would like to hear about it — this
                is where it goes.
              </p>
            </div>
          </Reveal>
        ) : (
          <ol className="relative ml-3 border-l border-white/12 pl-8 sm:ml-6 sm:pl-12">
            {legacy.map((entry, i) => (
              <Reveal key={entry.id} delay={i} as="li" className="relative pb-14 last:pb-0">
                <span className="absolute -left-[2.3rem] top-1.5 grid h-4 w-4 place-items-center rounded-full border-2 border-madhouse-500 bg-ink-950 sm:-left-[3.3rem]">
                  <span className="h-1.5 w-1.5 rounded-full bg-madhouse-500" />
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-madhouse-500">
                  {entry.year}
                </span>
                <h3 className="mt-2 text-2xl font-bold uppercase tracking-tight text-ink-50">
                  {entry.title}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-300">
                  {entry.description}
                </p>
                {entry.photo && (
                  <img
                    src={asset(entry.photo)}
                    alt={entry.title}
                    loading="lazy"
                    className="mt-5 max-w-lg rounded-xl border border-white/10"
                  />
                )}
              </Reveal>
            ))}
          </ol>
        )}
      </Section>

      <LocationSection />
    </>
  )
}
