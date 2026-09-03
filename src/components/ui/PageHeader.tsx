import type { CSSProperties, ReactNode } from 'react'
import { asset, cn } from '@/lib/utils'

/**
 * The masthead every inner page opens with.
 *
 * Optionally backed by a hostel photograph. Keeping one component means the
 * seven pages share an identical entrance and vertical rhythm — the site reads
 * as one thing rather than seven.
 *
 * The entrance is a CSS animation rather than a JS one. Everything here is
 * above the fold and is the first thing a resident sees, so it must not depend
 * on animation frames the browser may not be issuing; see the motion notes in
 * index.css.
 */
export default function PageHeader({
  eyebrow,
  title,
  accent,
  description,
  image,
  children,
}: {
  eyebrow?: string
  title: string
  /** Rendered in the accent colour, appended to the title. */
  accent?: string
  description?: ReactNode
  image?: string
  children?: ReactNode
}) {
  const delay = (seconds: number) => ({ '--d': `${seconds}s` }) as CSSProperties

  return (
    <header
      className={cn(
        'relative overflow-hidden pb-16 pt-32 sm:pb-20 sm:pt-40',
        image ? 'band-dark' : 'border-b',
      )}
    >
      {image && (
        <>
          <img
            src={asset(image)}
            alt=""
            aria-hidden
            className="anim-zoom absolute inset-0 h-full w-full object-cover"
          />
          <div className="scrim-header-v absolute inset-0" aria-hidden />
          <div className="scrim-header-h absolute inset-0" aria-hidden />
          <div className="absolute inset-0 bg-grain opacity-[0.14] mix-blend-overlay" />
        </>
      )}

      <div className="shell relative">
        {eyebrow && (
          <span className={cn('anim-rise eyebrow mb-5', image && 'text-ink-400')}>
            <span className="h-1 w-1 rounded-full bg-madhouse-500" aria-hidden />
            {eyebrow}
          </span>
        )}

        <h1
          className={cn(
            // `break-words` keeps a long single word (e.g. "Announcements")
            // inside the viewport on a 360px phone instead of being clipped.
            'anim-rise text-display-md font-bold uppercase break-words',
            image && 'text-ink-50',
          )}
          style={delay(0.08)}
        >
          {title}
          {accent && (
            <>
              {' '}
              <span className="text-madhouse-500">{accent}</span>
            </>
          )}
        </h1>

        {description && (
          <div
            className={cn(
              'anim-rise mt-7 max-w-2xl text-base leading-relaxed sm:text-lg',
              image ? 'text-ink-300' : 'muted',
            )}
            style={delay(0.16)}
          >
            {description}
          </div>
        )}

        {children && (
          <div className="anim-rise mt-9" style={delay(0.24)}>
            {children}
          </div>
        )}
      </div>
    </header>
  )
}
