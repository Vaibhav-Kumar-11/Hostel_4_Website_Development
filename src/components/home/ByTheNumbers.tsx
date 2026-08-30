import { hostelFacts } from '@/data/utilities'
import { Reveal, Stat } from '@/components/ui/primitives'

/**
 * MADHOUSE BY THE NUMBERS.
 *
 * Deliberately only four figures — these are the only hostel statistics the
 * brief supplies, and nothing has been padded out to fill the row. Counters
 * animate once, when the band scrolls into view.
 */
export default function ByTheNumbers() {
  return (
    <section className="band-dark relative overflow-hidden py-24 sm:py-32">
      {/* Faint oversized numeral, purely typographic texture. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 select-none font-display text-[34vw] font-bold leading-none text-white/[0.025]"
      >
        4
      </span>

      <div className="shell relative">
        <Reveal>
          <span className="eyebrow mb-4 text-ink-400">
            <span className="h-1 w-1 rounded-full bg-madhouse-500" aria-hidden />
            The scale of it
          </span>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="mb-14 max-w-2xl text-display-sm font-bold uppercase text-ink-50 sm:mb-20">
            Madhouse by the numbers
          </h2>
        </Reveal>

        <div className="grid gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {hostelFacts.map((fact, i) => (
            <Reveal key={fact.id} delay={i} className="text-ink-50">
              <div className="border-l border-white/12 pl-6">
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

      </div>
    </section>
  )
}
