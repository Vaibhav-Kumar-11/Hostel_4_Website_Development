import type { CSSProperties } from 'react'
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
 * while the type sits on the darkest part of the frame.
 *
 * The entrance is CSS. This is the first thing anyone sees, so it cannot be
 * allowed to depend on animation frames the browser might not issue; a hero
 * frozen at opacity 0 is a blank homepage. Parallax stays in JS because it is
 * driven by scrolling — if it does not run, the image simply sits still, which
 * is a harmless outcome rather than an invisible one.
 */
export default function Hero() {
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()
  const notices = tickerItems()

  const imageY = useTransform(scrollY, [0, 900], ['0%', '18%'])
  const contentY = useTransform(scrollY, [0, 600], [0, 70])
  const contentOpacity = useTransform(scrollY, [0, 460], [1, 0])

  const delay = (seconds: number) => ({ '--d': `${seconds}s` }) as CSSProperties

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink-950 text-ink-50">
      {/*
        DO NOT put `-z-10` on the photograph or the scrims.

        This section sits inside `.page-enter`, which animates opacity and so
        forms a stacking context. Within one, negative-z-index descendants
        paint *below* the in-flow block boxes — including this section's own
        opaque `bg-ink-950`. The photograph was therefore hidden behind the
        background of the element containing it: loaded, full size, at opacity
        1, and completely invisible. The DOM looks perfectly healthy in that
        state, which is why it survived several passes.

        Everything here is layered by document order instead: photograph,
        scrims, grain, then the content marked `relative z-10` on top.
      */}
      <motion.div className="absolute inset-0" style={reduced ? undefined : { y: imageY }}>
        <img
          src={asset(media.hero)}
          alt="Hostel 4, IIT Bombay — the residential wings and quadrangle at night"
          className="anim-zoom h-[118%] w-full object-cover object-center"
          decoding="async"
        />
      </motion.div>

      {/*
        Two scrims rather than one flat wash: see .scrim-v / .scrim-h in
        index.css. They shade the type on the left and the navbar at the top
        while leaving the right of the frame clear, so the hostel is visible
        instead of being buried under the overlay meant to make it readable.
      */}
      <div className="scrim-v absolute inset-0" aria-hidden />
      <div className="scrim-h absolute inset-0" aria-hidden />
      <div className="absolute inset-0 bg-grain opacity-[0.16] mix-blend-overlay" aria-hidden />

      <motion.div
        className="relative z-10 shell flex flex-1 flex-col justify-center pb-32 pt-32 sm:pb-40"
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        {/* Live badge */}
        <div className="anim-rise mb-7 flex items-center gap-3" style={delay(0.3)}>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-madhouse-500 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-madhouse-500" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-200">
            {site.subtitle}
          </span>
        </div>

        {/* Wordmark */}
        <h1 className="font-display font-bold uppercase leading-[0.82] tracking-[-0.045em]">
          <span className="sr-only">Madhouse — Hostel 4, IIT Bombay</span>
          <span aria-hidden className="block overflow-hidden">
            <span
              className="anim-rise-up block text-[clamp(3.5rem,17vw,14rem)]"
              style={delay(0.4)}
            >
              MAD
            </span>
          </span>
          <span aria-hidden className="block overflow-hidden">
            <span
              className="anim-rise-up -mt-[0.08em] block text-[clamp(3.5rem,17vw,14rem)] text-madhouse-500"
              style={delay(0.5)}
            >
              HOUSE
            </span>
          </span>
        </h1>

        <p
          className="anim-rise mt-8 max-w-lg text-lg font-medium leading-snug text-ink-100 sm:text-2xl"
          style={delay(0.8)}
        >
          {site.tagline}
        </p>

        <div className="anim-rise mt-10 flex flex-wrap gap-3" style={delay(0.92)}>
          <Link to="/about" className="btn btn-primary">
            Explore Madhouse
          </Link>
          <a
            href="#live"
            className="btn border border-white/25 text-ink-50 backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            What&apos;s happening
          </a>
        </div>
      </motion.div>

      {/* Notice ticker pinned to the bottom of the frame */}
      {notices.length > 0 && (
        <div
          className="anim-rise absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-ink-950/65 backdrop-blur-md"
          style={delay(1.05)}
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
        </div>
      )}

      {/* Scroll cue */}
      <a
        href="#live"
        aria-label="Scroll to Madhouse Live"
        className="anim-rise absolute bottom-[4.5rem] left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-ink-300 transition-colors hover:text-madhouse-500 sm:flex"
        style={delay(1.4)}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.28em]">Scroll</span>
        <span className="animate-bounce">
          <ArrowDown size={15} />
        </span>
      </a>
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
    return <p className="truncate px-5 py-3 text-xs text-ink-200">{items[0]}</p>
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
