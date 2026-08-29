import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowDown, Megaphone } from 'lucide-react'
import { media, site } from '@/data/site'
import { tickerItems } from '@/lib/schedule'
import { useReducedMotion } from '@/hooks'
import { asset, cn } from '@/lib/utils'

/**
 * Full-screen cinematic hero.
 *
 * The hostel photograph is the subject, so the overlay is a directional
 * gradient rather than a flat scrim — the building stays readable on the right
 * while the type sits on the darkest part of the frame. Parallax is applied to
 * the image only, and is dropped entirely under `prefers-reduced-motion`.
 */
export default function Hero() {
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()
  const [loaded, setLoaded] = useState(false)
  const notices = tickerItems()

  const imageY = useTransform(scrollY, [0, 900], ['0%', '18%'])
  const contentY = useTransform(scrollY, [0, 600], [0, 70])
  const contentOpacity = useTransform(scrollY, [0, 460], [1, 0])

  // Decode the hero eagerly so the entrance animation never runs on a blank frame.
  useEffect(() => {
    const img = new Image()
    img.src = asset(media.hero)
    img.decode?.().then(() => setLoaded(true)).catch(() => setLoaded(true))
    if (img.complete) setLoaded(true)
  }, [])

  const ease = [0.16, 1, 0.3, 1] as const

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink-950 text-ink-50">
      {/* Photograph */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={reduced ? undefined : { y: imageY }}
      >
        <motion.img
          src={asset(media.hero)}
          alt="Hostel 4, IIT Bombay — the residential wings and quadrangle at night"
          className="h-[118%] w-full object-cover object-center"
          initial={{ scale: 1.12, opacity: 0 }}
          animate={loaded ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 1.8, ease }}
          decoding="async"
        />
      </motion.div>

      {/* Overlays: vertical scrim for legibility, warm side wash for mood. */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/85 via-ink-950/45 to-ink-950"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950/80 via-ink-950/25 to-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 opacity-[0.16] mix-blend-overlay bg-grain"
        aria-hidden
      />

      <motion.div
        className="shell flex flex-1 flex-col justify-center pb-32 pt-32 sm:pb-40"
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8, ease }}
          className="mb-7 flex items-center gap-3"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-madhouse-500 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-madhouse-500" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-200">
            {site.subtitle}
          </span>
        </motion.div>

        {/* Wordmark */}
        <h1 className="font-display font-bold uppercase leading-[0.82] tracking-[-0.045em]">
          <span className="sr-only">Madhouse — Hostel 4, IIT Bombay</span>
          <span aria-hidden className="block overflow-hidden">
            <motion.span
              className="block text-[clamp(3.5rem,17vw,14rem)]"
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.45, duration: 1.1, ease }}
            >
              MAD
            </motion.span>
          </span>
          <span aria-hidden className="block overflow-hidden">
            <motion.span
              className="-mt-[0.08em] block text-[clamp(3.5rem,17vw,14rem)] text-madhouse-500"
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.56, duration: 1.1, ease }}
            >
              HOUSE
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.9, ease }}
          className="mt-8 max-w-lg text-lg font-medium leading-snug text-ink-100 sm:text-2xl"
        >
          {site.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.98, duration: 0.9, ease }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <Link to="/about" className="btn btn-primary">
            Explore Madhouse
          </Link>
          <a
            href="#live"
            className="btn border border-white/25 text-ink-50 backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            What&apos;s happening
          </a>
        </motion.div>
      </motion.div>

      {/* Notice ticker pinned to the bottom of the frame */}
      {notices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.9, ease }}
          className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-ink-950/65 backdrop-blur-md"
        >
          <div className="flex items-center">
            <div className="flex shrink-0 items-center gap-2 border-r border-white/10 bg-madhouse-500 px-4 py-3 text-ink-950 sm:px-5">
              <Megaphone size={13} />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
                Notice board
              </span>
            </div>
            <Ticker items={notices.map((n) => n.title)} />
          </div>
        </motion.div>
      )}

      {/* Scroll cue */}
      <motion.a
        href="#live"
        aria-label="Scroll to Madhouse Live"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-[4.5rem] left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-ink-300 transition-colors hover:text-madhouse-500 sm:flex"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.28em]">Scroll</span>
        <motion.span
          animate={reduced ? undefined : { y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ArrowDown size={15} />
        </motion.span>
      </motion.a>
    </section>
  )
}

/**
 * Seamless marquee. The list is rendered twice and translated by exactly -50%,
 * so the loop point is invisible. Duration scales with content length to keep
 * the reading speed constant regardless of how many notices are live.
 */
function Ticker({ items }: { items: string[] }) {
  const reduced = useReducedMotion()
  const duration = Math.max(24, items.join('').length * 0.22)

  if (reduced) {
    return (
      <p className="truncate px-5 py-3 text-xs text-ink-200">{items[0]}</p>
    )
  }

  return (
    <div className="relative flex-1 overflow-hidden mask-fade-r">
      <div
        className={cn('flex w-max animate-ticker py-3')}
        style={{ ['--ticker-duration' as string]: `${duration}s` }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {items.map((text, i) => (
              <span key={i} className="flex items-center whitespace-nowrap px-5 text-xs text-ink-200">
                <span className="mr-5 h-1 w-1 rounded-full bg-madhouse-500" aria-hidden />
                {text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
