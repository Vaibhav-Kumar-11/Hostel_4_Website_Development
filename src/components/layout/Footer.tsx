import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { Facebook, Instagram, Linkedin, MapPin, Youtube } from 'lucide-react'
import { instituteLinks, navigation, site, socials } from '@/data/site'
import { emergencyContacts } from '@/data/utilities'
import { cn } from '@/lib/utils'

const socialIcons: Record<string, LucideIcon> = {
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  facebook: Facebook,
}

export default function Footer() {
  const criticalContacts = emergencyContacts.filter((c) => c.critical).slice(0, 4)

  return (
    <footer className="band-dark relative overflow-hidden">
      {/* Oversized wordmark bleeding off the bottom edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-4 select-none text-center font-display text-[22vw] font-bold leading-none tracking-tighter text-white/[0.035] sm:-bottom-10"
      >
        MADHOUSE
      </div>

      <div className="shell relative py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          {/* Brand */}
          <div>
            <div className="font-display text-3xl font-bold uppercase leading-none tracking-tight text-ink-50">
              MAD<span className="text-madhouse-500">HOUSE</span>
            </div>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-400">
              {site.subtitle}
            </p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-300">
              {site.tagline}
            </p>

            <div className="mt-6 flex gap-2">
              {socials.map((s) => {
                const Icon = socialIcons[s.id]
                const disabled = !s.href
                return (
                  <a
                    key={s.id}
                    href={s.href ?? undefined}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={disabled ? `${s.label} — link pending` : s.label}
                    aria-disabled={disabled}
                    title={disabled ? `${s.label} handle pending from the Council` : s.label}
                    onClick={(e) => disabled && e.preventDefault()}
                    className={cn(
                      'grid h-10 w-10 place-items-center rounded-full border border-white/12 transition-all duration-200',
                      disabled
                        ? 'cursor-not-allowed text-ink-500 opacity-45'
                        : 'text-ink-200 hover:-translate-y-0.5 hover:border-madhouse-500 hover:text-madhouse-500',
                    )}
                  >
                    {Icon && <Icon size={16} />}
                  </a>
                )
              })}
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer">
            <h2 className="mb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-400">
              Navigate
            </h2>
            <ul className="space-y-2.5">
              {navigation.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-ink-300 transition-colors hover:text-madhouse-500"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Institute links */}
          <div>
            <h2 className="mb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-400">
              Important links
            </h2>
            <ul className="space-y-2.5">
              {instituteLinks.slice(0, 5).map((l) => (
                <li key={l.id}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-sm text-ink-300 transition-colors hover:text-madhouse-500"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h2 className="mb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-400">
              Emergency
            </h2>
            <ul className="space-y-2.5">
              {criticalContacts.map((c) => (
                <li key={c.id} className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-ink-300">{c.label}</span>
                  {c.phone ? (
                    <a
                      href={`tel:${c.phone.replace(/\s/g, '')}`}
                      className="font-mono text-xs text-madhouse-500 hover:underline"
                    >
                      {c.phone}
                    </a>
                  ) : (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink-500">
                      pending
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <Link
              to="/resources#emergency"
              className="mt-4 inline-block text-xs font-semibold uppercase tracking-wider text-madhouse-500 hover:underline"
            >
              All contacts →
            </Link>

            <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-ink-400">
              <MapPin size={13} className="mt-0.5 shrink-0" />
              Hostel 4, IIT Bombay, Powai, Mumbai 400076
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-300">
            Built with <span className="text-madhouse-500">♥</span> by{' '}
            <span className="font-semibold text-ink-100">{site.builtBy}</span> in collaboration with
            the Hostel 4 Council.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            Made for the Madhouse community.
          </p>
        </div>
      </div>
    </footer>
  )
}
