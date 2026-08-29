import { Phone, ShieldAlert } from 'lucide-react'
import { emergencyContacts } from '@/data/utilities'
import { PlaceholderNote, Reveal } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'

/**
 * Emergency contacts.
 *
 * Deliberately not a top-level navigation tab — it appears on the homepage
 * quick-access strip, in Resources and in the footer, which is where someone
 * in a hurry will actually look.
 *
 * Every number is `null` until the Council supplies it. A card with a real
 * number becomes a one-tap `tel:` link; a card without one says so plainly
 * instead of offering a link that dials nowhere.
 */
export default function EmergencyContacts({ compact = false }: { compact?: boolean }) {
  const list = compact ? emergencyContacts.filter((c) => c.critical) : emergencyContacts
  const anyNumber = emergencyContacts.some((c) => c.phone)

  return (
    <div>
      <div className={cn('grid gap-3', compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3')}>
        {list.map((contact, i) => {
          const dial = contact.phone?.replace(/\s/g, '')
          const Element = dial ? 'a' : 'div'

          return (
            <Reveal key={contact.id} delay={i}>
              <Element
                {...(dial ? { href: `tel:${dial}` } : {})}
                className={cn(
                  'card flex h-full items-center gap-4 p-4',
                  dial && 'card-hover cursor-pointer',
                  contact.critical && 'border-l-[3px] border-l-red-500',
                  !dial && 'border-dashed opacity-90',
                )}
              >
                <span
                  className={cn(
                    'grid h-11 w-11 shrink-0 place-items-center rounded-xl',
                    contact.critical
                      ? 'bg-red-500/12 text-red-500'
                      : 'bg-[rgb(var(--surface-sunken))] text-madhouse-500',
                  )}
                >
                  {contact.critical ? <ShieldAlert size={17} /> : <Phone size={17} />}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold uppercase tracking-tight">
                    {contact.label}
                  </span>
                  {contact.detail && (
                    <span className="muted mt-0.5 block truncate text-xs">{contact.detail}</span>
                  )}
                </span>

                <span className="shrink-0 text-right">
                  {dial ? (
                    <>
                      <span className="block font-mono text-sm font-semibold text-madhouse-500">
                        {contact.phone}
                      </span>
                      <span className="muted block font-mono text-[9px] uppercase tracking-wider sm:hidden">
                        Tap to call
                      </span>
                    </>
                  ) : (
                    <span className="muted font-mono text-[9px] uppercase tracking-[0.14em]">
                      Number
                      <br />
                      pending
                    </span>
                  )}
                </span>
              </Element>
            </Reveal>
          )
        })}
      </div>

      {!anyNumber && (
        <PlaceholderNote className="mt-5">
          No emergency number has been guessed. Fill in the <code className="font-mono">phone</code>{' '}
          fields in <code className="font-mono">src/data/utilities.ts</code> — each card then turns
          into a one-tap dial link on mobile, here, on the homepage and in the footer.
        </PlaceholderNote>
      )}
    </div>
  )
}
