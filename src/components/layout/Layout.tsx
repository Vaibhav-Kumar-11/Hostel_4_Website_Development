import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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

      <main id="main" className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
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
