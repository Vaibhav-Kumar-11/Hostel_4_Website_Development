import {
  ArrowUpRight, Cable, ClipboardList, Droplets, Hammer, MessageSquareWarning,
  Sparkles, Wrench, Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeader from '@/components/ui/PageHeader'
import EmergencyContacts from '@/components/resources/EmergencyContacts'
import { Reveal, Section, SectionHeading } from '@/components/ui/primitives'
import { CLR_TICKET_URL, site } from '@/data/site'
import { usePageMeta } from '@/lib/meta'

/**
 * MAINTENANCE.
 *
 * One job: get the resident into the hostel's real CLR ticket system as fast
 * as possible. The brief is explicit that this site must not run a parallel
 * fake complaint desk, so everything here points at the system the maintenance
 * team already monitors.
 */

const categories = [
  { icon: Zap, label: 'Electrical', examples: 'Lights, fans, switchboards, sockets, tube lights' },
  { icon: Droplets, label: 'Plumbing', examples: 'Taps, leaks, drainage, flush, water pressure, geysers' },
  { icon: Hammer, label: 'Carpentry', examples: 'Doors, latches, cupboards, study table, chair, bed frame' },
  { icon: Sparkles, label: 'Cleaning', examples: 'Corridors, washrooms, common areas, waste collection' },
  { icon: Cable, label: 'LAN / Internet', examples: 'Dead ports, no connectivity, damaged cabling' },
  { icon: Wrench, label: 'General', examples: 'Anything that does not fit the categories above' },
]

const steps = [
  {
    title: 'Open CLR',
    body: 'The Report Issue button opens the hostel ticketing system directly — the same one the maintenance staff work from.',
  },
  {
    title: 'Describe the problem',
    body: 'Pick the category, write what is wrong, and add your room number. A photograph helps more than a paragraph does.',
  },
  {
    title: 'Submit and keep the ticket ID',
    body: 'The ID is how you follow up. If nothing moves, take it to the Maintenance Representative with that ID in hand.',
  },
]

export default function Maintenance() {
  usePageMeta({
    title: `Maintenance — ${site.name}`,
    description:
      'Report an electrical, plumbing, carpentry, cleaning or LAN problem in Hostel 4, IIT Bombay through the hostel CLR ticket system.',
  })

  return (
    <>
      <PageHeader
        eyebrow="Maintenance"
        title="Something"
        accent="broken?"
        description="One button. It opens the hostel's live CLR ticket system, which is where the maintenance team actually picks work up."
      >
        <a
          href={CLR_TICKET_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="btn btn-primary px-8 py-4 text-base"
        >
          Report issue <ArrowUpRight size={18} />
        </a>
        <p className="muted mt-4 font-mono text-[10px] uppercase tracking-[0.16em]">
          Opens clr.mobilisepro.com in a new tab
        </p>
      </PageHeader>

      {/* ── Categories ── */}
      <Section>
        <SectionHeading
          eyebrow="What can be reported"
          title="Pick the right category"
          description="Choosing correctly gets the ticket to the right team first time, which is most of what determines how fast it gets fixed."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ icon: Icon, label, examples }, i) => (
            <Reveal key={label} delay={i}>
              <a
                href={CLR_TICKET_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="card card-hover group flex h-full flex-col p-6"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-madhouse-500/12 text-madhouse-500 transition-transform duration-300 group-hover:scale-110">
                  <Icon size={20} />
                </span>
                <h3 className="mt-5 text-xl font-bold uppercase tracking-tight">{label}</h3>
                <p className="muted mt-2.5 flex-1 text-sm leading-relaxed">{examples}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-madhouse-500">
                  Raise ticket <ArrowUpRight size={12} />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── How it works ── */}
      <Section tone="dark">
        <SectionHeading
          eyebrow="Three steps"
          title={<span className="text-ink-50">How a complaint travels</span>}
        />

        <ol className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i} as="li">
              <span className="font-display text-6xl font-bold leading-none text-madhouse-500/25">
                0{i + 1}
              </span>
              <h3 className="mt-4 text-xl font-bold uppercase tracking-tight text-ink-50">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-300">{step.body}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={3}>
          <div className="mt-14 flex flex-col items-start gap-5 rounded-2xl border border-white/12 bg-white/[0.03] p-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <ClipboardList className="mt-0.5 shrink-0 text-madhouse-500" size={22} />
              <div>
                <p className="font-bold uppercase tracking-tight text-ink-50">
                  Ready to raise one?
                </p>
                <p className="muted mt-1.5 text-sm text-ink-300">
                  Takes under a minute. Have your room number ready.
                </p>
              </div>
            </div>
            <a
              href={CLR_TICKET_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-primary shrink-0"
            >
              Report issue <ArrowUpRight size={16} />
            </a>
          </div>
        </Reveal>
      </Section>

      {/* ── Escalation ── */}
      <Section tone="sunken">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <Reveal>
              <span className="eyebrow mb-4">
                <span className="h-1 w-1 rounded-full bg-madhouse-500" aria-hidden />
                If nothing happens
              </span>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                Escalate it
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <div className="muted mt-5 space-y-4 text-sm leading-relaxed">
                <p>
                  A ticket that has sat untouched for days is worth raising with the Maintenance
                  Representative in person. Bring the ticket ID — it is the difference between a
                  complaint and a case.
                </p>
                <p>
                  Anything involving water near electricals, a gas smell, a structural crack or a
                  security concern is not a maintenance ticket. Call the numbers on the right first,
                  then log the ticket afterwards.
                </p>
              </div>
            </Reveal>
            <Reveal delay={3}>
              <Link
                to="/about#council"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-madhouse-500 hover:underline"
              >
                <MessageSquareWarning size={15} /> Find the Maintenance Representative
              </Link>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <h3 className="mb-6 text-lg font-bold uppercase tracking-tight">
                Urgent — call, do not file
              </h3>
            </Reveal>
            <EmergencyContacts compact />
          </div>
        </div>
      </Section>
    </>
  )
}
