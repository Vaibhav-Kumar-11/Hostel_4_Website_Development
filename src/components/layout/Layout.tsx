import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'
import CommandPalette from './CommandPalette'
import { useHotkey, useReducedMotion, useScrollPosition, useTheme } from '@/hooks'
import { cn } from '@/lib/utils'

export default function Layout() {
  const { theme, toggle } = useTheme()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const { y, progress } = useScrollPosition()
  const location = useLocation()
  const reduced = useReducedMotion()

  useHotkey('mod+k', () => setPaletteOpen((v) => !v))
  useHotkey('escape', () => setPaletteOpen(false), paletteOpen)
  // '/' opens search the way it does in most developer tools.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const typing =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      if (e.key === '/' && !typing && !paletteOpen) {
        e.preventDefault()
        setPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [paletteOpen])

  /**
   * Route changes reset the scroll position; a hash scrolls to that section.
   * The frame delay lets the incoming page paint before we measure offsets.
   */
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }

    /*
      Wait for the target to exist before scrolling to it.

      Six of the seven pages are code-split, so a link like
      /resources#emergency arrives before the Resources chunk has finished
      loading and rendering. A single animation frame was not nearly long
      enough: the element was still missing, the fallback ran, and the
      resident was dropped at the top of a page whose useful part was five
      thousand pixels further down. It looked like the anchor was being
      ignored entirely.

      Polling ends the moment the element appears, so the common case — an
      anchor on the page already showing — still scrolls on the next frame.
    */
    const id = location.hash.slice(1)
    const deadline = performance.now() + 2500
    let frame = 0
    // Seeded with the height as it is now, so an anchor on a page that is
    // already laid out reads as settled on the very first frame.
    let lastHeight = document.documentElement.scrollHeight
    let wasUnsettled = false

    const attempt = () => {
      const el = document.getElementById(id)

      if (!el) {
        if (performance.now() < deadline) {
          frame = requestAnimationFrame(attempt)
          return
        }
        // The anchor genuinely does not exist on this page.
        window.scrollTo({ top: 0 })
        return
      }

      /*
        Existing is not the same as being in final position. On a page full of
        lazy images the target sits near the top for the first few frames,
        because everything above it still has zero height. Scrolling to it
        then leaves the reader at the top of a page that afterwards grows to
        several times the height — which is exactly how /resources#emergency
        managed to land 10,000px short of the emergency contacts.

        So re-anchor each frame until the document stops growing.
      */
      const height = document.documentElement.scrollHeight
      const settled = height === lastHeight
      lastHeight = height

      if (!settled) {
        // Instant while the layout is still moving; smooth would fight itself.
        el.scrollIntoView({ behavior: 'auto', block: 'start' })
        wasUnsettled = true
        if (performance.now() < deadline) frame = requestAnimationFrame(attempt)
        return
      }

      el.scrollIntoView({
        behavior: wasUnsettled || reduced ? 'auto' : 'smooth',
        block: 'start',
      })
    }

    frame = requestAnimationFrame(attempt)
    return () => cancelAnimationFrame(frame)
  }, [location.pathname, location.hash, reduced])

  const scrollTop = useCallback(
    () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }),
    [reduced],
  )

  return (
    <div className="flex min-h-screen flex-col">
      {/* Reading progress */}
      <div
        className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-madhouse-500"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden
      />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-madhouse-500 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <Navbar theme={theme} onToggleTheme={toggle} onOpenSearch={() => setPaletteOpen(true)} />

      {/*
        The page transition is a CSS animation keyed on the pathname, not a
        JS one.

        It used to be an <AnimatePresence mode="wait"> wrapper that started the
        incoming page at opacity 0 and raised it on requestAnimationFrame. That
        has a bad failure mode: whenever the browser stops issuing animation
        frames — a backgrounded tab, an occluded window, battery saver, a
        route chunk still resolving — the incoming page never leaves opacity 0.
        The result is a fully rendered, correctly laid out, completely
        invisible page. `mode="wait"` also held the new page back until the old
        one finished exiting, adding a third of a second to every navigation.

        A keyframe with `both` fill advances on wall-clock time and settles
        visible regardless, and the new page paints immediately.
      */}
      <main id="main" className="flex-1">
        <div key={location.pathname} className={reduced ? undefined : 'page-enter'}>
          <Outlet />
        </div>
      </main>

      <Footer />

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      {/* Back to top */}
      <button
        onClick={scrollTop}
        aria-label="Back to top"
        className={cn(
          'glass fixed bottom-6 right-5 z-40 grid h-11 w-11 place-items-center rounded-full border shadow-lift transition-all duration-300 ease-smooth',
          y > 900 ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
        )}
      >
        <ArrowUp size={17} />
      </button>
    </div>
  )
}
