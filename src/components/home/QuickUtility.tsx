import { ArrowUpRight, Cable, Droplets, Hammer, Sparkles, Wrench, Zap } from 'lucide-react'
import { CLR_TICKET_URL } from '@/data/site'
import EmergencyContacts from '@/components/resources/EmergencyContacts'
import { ActionLink, Reveal, Section } from '@/components/ui/primitives'

/**
 * The utility strip near the foot of the homepage: report a problem, and the
 * numbers to call when it is more serious than a problem.
 */

const issueTypes = [
  { icon: Zap, label: 'Electrical' },
  { icon: Droplets, label: 'Plumbing' },
  { icon: Hammer, label: 'Carpentry' },
  { icon: Sparkles, label: 'Cleaning' },
  { icon: Cable, label: 'LAN / Internet' },
  { icon: Wrench, label: 'General' },
]

export default function QuickUtility() {
  return (
    <Section id="utility" tone="sunken">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        {/* Maintenance */}
        <div>
          <Reveal>
            <span className="eyebrow mb-4">
              <span className="h-1 w-1 rounded-full bg-madhouse-500" aria-hidden />
              Maintenance
            </span>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="text-display-sm font-bold uppercase">
              Something <span className="text-madhouse-500">broken?</span>
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="muted mt-5 max-w-md text-base leading-relaxed">
              A leaking tap, a dead LAN port, a fan that has decided it is done. Raise a ticket in
              the hostel&apos;s CLR system and it goes straight to the maintenance team — no forms
              on this site, no messages lost in a group chat.
            </p>
          </Reveal>

          <Reveal delay={3}>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={CLR_TICKET_URL} target="_blank" rel="noreferrer noopener" className="btn btn-primary">
                Report issue <ArrowUpRight size={16} />
              </a>
              <ActionLink to="/maintenance" variant="ghost">
                How it works
              </ActionLink>
            </div>
          </Reveal>

          <Reveal delay={4}>
            <ul className="mt-9 flex flex-wrap gap-2">
              {issueTypes.map(({ icon: Icon, label }) => (
                <li key={label} className="chip gap-2 py-1.5">
                  <Icon size={12} className="text-madhouse-500" />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Emergency */}
        <div>
          <Reveal>
            <span className="eyebrow mb-4">
              <span className="h-1 w-1 rounded-full bg-red-500" aria-hidden />
              When it is serious
            </span>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="mb-6 text-2xl font-bold uppercase tracking-tight sm:text-3xl">
              Emergency contacts
            </h2>
          </Reveal>
          <EmergencyContacts compact />
          <Reveal delay={5}>
            <ActionLink to="/resources#emergency" variant="text" className="mt-5">
              All contacts and useful information
            </ActionLink>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
