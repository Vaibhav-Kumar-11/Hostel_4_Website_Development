import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { asset, cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks'

/**
 * The masthead every inner page opens with.
 *
 * Optionally backed by a hostel photograph. Keeping one component means the
 * seven pages share an identical entrance and vertical rhythm — the site reads
 * as one thing rather than seven.
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
  const reduced = useReducedMotion()
  const ease = [0.16, 1, 0.3, 1] as const

  return (
    <header
      className={cn(
        'relative overflow-hidden pb-16 pt-32 sm:pb-20 sm:pt-40',
        image ? 'band-dark' : 'border-b',
      )}
    >
      {image && (
        <>
          <motion.img
            src={asset(image)}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
            initial={reduced ? false : { scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/80 to-ink-950/55" />
          <div className="absolute inset-0 bg-grain opacity-[0.14] mix-blend-overlay" />
        </>
      )}

      <div className="shell relative">
        {eyebrow && (
          <motion.span
            className={cn('eyebrow mb-5', image && 'text-ink-400')}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <span className="h-1 w-1 rounded-full bg-madhouse-500" aria-hidden />
            {eyebrow}
          </motion.span>
        )}

        <motion.h1
          className={cn(
            // `break-words` keeps a long single word (e.g. "Announcements")
            // inside the viewport on a 360px phone instead of being clipped.
            'text-display-md font-bold uppercase break-words',
            image && 'text-ink-50',
          )}
          initial={reduced ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.08, ease }}
        >
          {title}
          {accent && (
            <>
              {' '}
              <span className="text-madhouse-500">{accent}</span>
            </>
          )}
        </motion.h1>

        {description && (
          <motion.div
            className={cn('mt-7 max-w-2xl text-base leading-relaxed sm:text-lg', image ? 'text-ink-300' : 'muted')}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.18, ease }}
          >
            {description}
          </motion.div>
        )}

        {children && (
          <motion.div
            className="mt-9"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.28, ease }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </header>
  )
}
