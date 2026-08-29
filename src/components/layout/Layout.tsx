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
    if (location.hash) {
      const id = location.hash.slice(1)
      requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
          return
        }
        window.scrollTo({ top: 0 })
      })
      return
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
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
