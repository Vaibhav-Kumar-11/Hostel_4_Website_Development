import { AtSign, Phone, User, Users } from 'lucide-react'
import type { CouncilMember } from '@/types/content'
import { asset, cn, initials } from '@/lib/utils'

/**
 * A council or administration profile.
 *
 * A card whose holder is not yet listed presents the role itself as the
 * heading and omits the name line, so it reads as a card about a position
 * rather than one missing a person.
 */
export function CouncilCard({
  member,
  reportCount = 0,
}: {
  member: CouncilMember
  /** Number of secretaries reporting to this role; 0 hides the line. */
  reportCount?: number
}) {
  const pending = !member.name

  return (
    <article
      className={cn(
        'card card-hover group flex h-full flex-col items-start p-6 transition-all duration-300',
      )}
    >
      {/* Avatar */}
      <div className="relative mb-5">
        {member.photo ? (
          <img
            src={asset(member.photo)}
            alt={member.name ?? member.role}
            loading="lazy"
            className="h-20 w-20 rounded-2xl object-cover"
          />
        ) : (
          <div
            className={cn(
              'grid h-20 w-20 place-items-center rounded-2xl font-display text-2xl font-bold',
              'bg-madhouse-500/12 text-madhouse-500',
            )}
          >
            {pending ? <User size={24} strokeWidth={1.5} /> : initials(member.name!)}
          </div>
        )}
      </div>

      {/*
        With a name listed the role is the small label above it. Without one,
        the role is promoted to the heading so the card still has a subject.
      */}
      {member.name ? (
        <>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-madhouse-500">
            {member.role}
          </p>
          <h3 className="mt-2 text-xl font-bold uppercase leading-tight tracking-tight">
            {member.name}
          </h3>
        </>
      ) : (
        <h3 className="text-xl font-bold uppercase leading-tight tracking-tight">
          {member.role}
        </h3>
      )}

      {member.affiliation && <p className="muted mt-1.5 text-xs">{member.affiliation}</p>}

      {member.bio && <p className="muted mt-4 text-sm leading-relaxed">{member.bio}</p>}

      {reportCount > 0 && (
        <p className="muted mt-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider">
          <Users size={11} />
          {reportCount} {reportCount === 1 ? 'secretary' : 'secretaries'}
        </p>
      )}

      <div className="mt-auto w-full pt-6">
        {!pending && (
          <div className="flex flex-wrap gap-2">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="chip gap-1.5 hover:border-madhouse-500 hover:text-madhouse-500"
              >
                <AtSign size={11} /> Email
              </a>
            )}
            {member.phone && (
              <a
                href={`tel:${member.phone.replace(/\s/g, '')}`}
                className="chip gap-1.5 hover:border-madhouse-500 hover:text-madhouse-500"
              >
                <Phone size={11} /> Call
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
