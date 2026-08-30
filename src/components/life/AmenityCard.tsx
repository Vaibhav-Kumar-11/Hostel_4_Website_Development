import { Clock, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Amenity } from '@/types/content'
import { asset, cn } from '@/lib/utils'

/**
 * A hostel facility.
 *
 * Where a real photograph exists it fills the card. Where one does not, the
 * card falls back to a typographic panel rather than borrowing stock imagery.
 * A generic gym photo that is not this gym would be worse than no photo.
 */
export function AmenityCard({
  amenity,
  featured = false,
  linkTo,
}: {
  amenity: Amenity
  featured?: boolean
  linkTo?: string
}) {
  const inner = (
    <article
      id={amenity.id}
      className={cn(
        'group relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-2xl border transition-all duration-500 ease-smooth',
        'hover:-translate-y-1 hover:shadow-lift',
        featured ? 'min-h-[26rem]' : 'min-h-[19rem]',
      )}
    >
      {amenity.photo ? (
        <>
          <img
            src={asset(amenity.photo)}
            alt={amenity.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-smooth group-hover:scale-[1.06]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/5"
            aria-hidden
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-[rgb(var(--surface-sunken))]" aria-hidden>
          <span className="absolute inset-0 grid place-items-center font-display text-[7rem] font-bold uppercase leading-none tracking-tighter text-[rgb(var(--text))]/[0.05]">
            H4
          </span>
        </div>
      )}

      <div
        className={cn(
          'relative mt-auto p-6',
          amenity.photo ? 'text-ink-50' : 'text-[rgb(var(--text))]',
        )}
      >
        <h3
          className={cn(
            'font-bold uppercase leading-none tracking-tight',
            featured ? 'text-3xl' : 'text-2xl',
          )}
        >
          {amenity.name}
        </h3>

        <p
          className={cn(
            'mt-2.5 text-sm leading-snug',
            amenity.photo ? 'text-ink-200' : 'muted',
          )}
        >
          {amenity.tagline}
        </p>

        {/* Only rows that actually carry a value are rendered. */}
        {(amenity.location || amenity.timings) && (
          <div
            className={cn(
              'mt-4 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[10px] uppercase tracking-wider',
              amenity.photo ? 'text-ink-300' : 'muted',
            )}
          >
            {amenity.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={11} />
                {amenity.location}
              </span>
            )}
            {amenity.timings && (
              <span className="flex items-center gap-1.5">
                <Clock size={11} />
                {amenity.timings}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  )

  return linkTo ? (
    <Link to={linkTo} className="block h-full">
      {inner}
    </Link>
  ) : (
    inner
  )
}
