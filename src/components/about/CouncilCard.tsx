import { AtSign, Phone, User } from 'lucide-react'
import type { CouncilMember } from '@/types/content'
import { PendingPill } from '@/components/ui/primitives'
import { asset, cn, initials } from '@/lib/utils'

/**
 * A council or administration profile.
 *
 * No name has been invented, so most cards render their "awaiting details"
 * state: the role is real, the person is not yet filled in. The avatar falls
 * back to the initials of the *role* rather than a stock portrait.
 */
export function CouncilCard({ member }: { member: CouncilMember }) {
  const pending = !member.name

  return (
    <article
      className={cn(
        'card group flex h-full flex-col items-start p-6 transition-all duration-300',
        pending ? 'border-dashed' : 'card-hover',
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
              pending
                ? 'muted border border-dashed bg-[rgb(var(--surface-sunken))]'
                : 'bg-madhouse-500/12 text-madhouse-500',
            )}
          >
            {pending ? <User size={24} strokeWidth={1.5} /> : initials(member.name!)}
          </div>
        )}
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-madhouse-500">
        {member.role}
      </p>

      <h3 className="mt-2 text-xl font-bold uppercase leading-tight tracking-tight">
        {member.name ?? <span className="muted font-normal normal-case">Name to be announced</span>}
      </h3>

      {member.affiliation && <p className="muted mt-1.5 text-xs">{member.affiliation}</p>}

      {member.bio && <p className="muted mt-4 text-sm leading-relaxed">{member.bio}</p>}

      <div className="mt-auto w-full pt-6">
        {pending ? (
          <PendingPill />
        ) : (
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
