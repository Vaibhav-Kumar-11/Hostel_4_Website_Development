import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight, Instagram, Mail, MessageCircle, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal, Section, SectionHeading } from '@/components/ui/primitives'

/**
 * The community strip: the groups the hostel talks in, and the route for
 * anything that is not a maintenance ticket.
 *
 * It sits beside QuickUtility at the foot of the homepage and deliberately
 * covers the other half of "how do I raise this" — CLR handles a dead fan, the
 * council handles a mess complaint, an event idea or a suggestion.
 */

interface Channel {
  id: string
  label: string
  description: string
  /**
   * Where the channel points. A `null` href hides the channel outright — it is
   * never rendered greyed out or marked as coming soon, because a resident
   * should only ever see doors that actually open.
   */
  href: string | null
  icon: LucideIcon
}

const channels: readonly Channel[] = [
  {
    id: 'whatsapp-announcements',
    label: 'Announcements group',
    description:
      'The WhatsApp group for mess notices, GC schedules and the water cut nobody warned you about.',
    href: null,
    icon: MessageCircle,
  },
  {
    id: 'whatsapp-discussion',
    label: 'Residents’ group',
    description:
      'The other WhatsApp group — lost chargers, spare match tickets, airport runs and the arguments in between.',
    href: null,
    icon: MessageCircle,
  },
  {
    id: 'council-email',
    label: 'Council email',
    description:
      'For anything that should be on record: a complaint, a formal request, a proposal with a budget attached.',
    href: null,
    icon: Mail,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    description:
      'GC nights, Valfi and whatever the cult secretaries have taken over the common room to build.',
    href: null,
    icon: Instagram,
  },
]

/** A channel with somewhere to point. */
type LiveChannel = Channel & { href: string }

export default function Community() {
  const live = channels.filter((c): c is LiveChannel => c.href !== null)

  /*
    The channel grid shrinks to nothing while no link is configured, but the
    section itself stays: the closing block below works on its own and points
    residents at the council, which is the part that is true regardless of
    which groups happen to be linked.
  */

  return (
    <Section id="community">
      <SectionHeading
        eyebrow="Community"
        title={
          <>
            Where the hostel <span className="text-madhouse-500">talks</span>
          </>
        }
        description="Not everything is a maintenance ticket. A complaint about the mess, an idea for a GC night, a suggestion nobody has got round to making — this is where it goes."
      />

      <ul className="grid gap-4 sm:grid-cols-2">
        {live.map((channel, i) => {
          const Icon = channel.icon
          const external = channel.href.startsWith('http')

          return (
            <Reveal key={channel.id} as="li" delay={i + 1}>
              <a
                href={channel.href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer noopener' : undefined}
                className="card card-hover group flex h-full items-start gap-4 p-5"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-madhouse-500/12 text-madhouse-500">
                  <Icon size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-sm font-semibold">
                    {channel.label}
                    <ArrowUpRight
                      size={14}
                      className="muted transition-transform duration-300 ease-smooth group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                  <span className="muted mt-1.5 block text-xs leading-relaxed">
                    {channel.description}
                  </span>
                </span>
              </a>
            </Reveal>
          )
        })}
      </ul>

      {/*
        The corridor route. This stands on its own — it stays true and useful
        however many channels above it are configured.
      */}
      <Reveal delay={live.length + 1}>
        <div className="mt-4 flex flex-col gap-6 rounded-2xl border bg-[rgb(var(--surface-sunken))] p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-madhouse-500/12 text-madhouse-500">
            <Users size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold uppercase tracking-tight">Or just knock</h3>
            <p className="muted mt-2 text-sm leading-relaxed">
              Every secretary lives in this building. The council page lists who holds which post, so
              you know which one your problem belongs to — and after dinner, the corridor still works
              faster than any group chat.
            </p>
          </div>
          <Link to="/about#council" className="btn btn-ghost shrink-0">
            Meet the council
          </Link>
        </div>
      </Reveal>
    </Section>
  )
}
