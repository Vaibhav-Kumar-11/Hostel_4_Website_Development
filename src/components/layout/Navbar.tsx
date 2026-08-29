import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  CalendarDays, Images, Menu, Moon, Phone, Search, Sun, UtensilsCrossed, Wrench, X,
} from 'lucide-react'
import { navigation, site } from '@/data/site'
import { useScrollLock, useScrollPosition, type Theme } from '@/hooks'
import { cn } from '@/lib/utils'

/**
 * Sticky navigation. Shrinks and turns to frosted glass on scroll, and on
 * mobile opens a full-screen drawer that leads with the five things residents
 * actually open the site for — mess, events, maintenance, gallery, emergency.
 */

interface Props {
  theme: Theme
  onToggleTheme: () => void
  onOpenSearch: () => void
}

/** Mobile-first shortcuts, ordered by how often a resident needs them. */
const mobilePriority = [
  { label: 'Mess', to: '/#today', icon: UtensilsCrossed },
  { label: 'Events', to: '/events', icon: CalendarDays },
  { label: 'Maintenance', to: '/maintenance', icon: Wrench },
  { label: 'Gallery', to: '/resources#gallery', icon: Images },
  { label: 'Emergency', to: '/resources#emergency', icon: Phone },
]

export default function Navbar({ theme, onToggleTheme, onOpenSearch }: Props) {
  const [open, setOpen] = useState(false)
  const { y } = useScrollPosition()
  const location = useLocation()
  const scrolled = y > 24

  useScrollLock(open)
  useEffect(() => setOpen(false), [location.pathname, location.hash])

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-smooth',
          scrolled ? 'glass border-b py-2 shadow-lift' : 'border-b border-transparent py-4',
        )}
        style={{ ['--nav-h' as string]: scrolled ? '3.75rem' : '4.5rem' }}
      >
        <nav className="shell flex items-center justify-between gap-4" aria-label="Primary">
          {/* Wordmark */}
          <Link to="/" className="group flex shrink-0 items-baseline gap-2.5" aria-label="Madhouse — home">
            <span
              className={cn(
                'font-display font-bold uppercase leading-none tracking-tight transition-all duration-500 ease-smooth',
                scrolled ? 'text-xl' : 'text-2xl',
              )}
            >
              MAD<span className="text-madhouse-500">HOUSE</span>
            </span>
            <span className="muted hidden font-mono text-[9px] uppercase tracking-[0.2em] lg:block">
              H4 • IITB
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'relative block rounded-full px-3.5 py-2 text-[13px] font-semibold uppercase tracking-[0.09em] transition-colors duration-200',
                      isActive
                        ? 'text-madhouse-500'
                        : 'muted hover:text-[rgb(var(--text))]',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-madhouse-500"
                          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Controls */}
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              onClick={onOpenSearch}
              className="muted hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors hover:text-[rgb(var(--text))] sm:flex"
              aria-label="Search the site"
            >
              <Search size={14} />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden rounded border px-1 font-mono text-[10px] md:inline">⌘K</kbd>
            </button>

            <button
              onClick={onOpenSearch}
              className="muted grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-[rgb(var(--surface-sunken))] hover:text-[rgb(var(--text))] sm:hidden"
              aria-label="Search the site"
            >
              <Search size={17} />
            </button>

            <button
              onClick={onToggleTheme}
              className="muted grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-[rgb(var(--surface-sunken))] hover:text-[rgb(var(--text))]"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <button
              onClick={() => setOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-[rgb(var(--surface-sunken))] lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu size={19} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-ink-950/60" onClick={() => setOpen(false)} aria-hidden />
            <motion.div
              className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto border-l bg-[rgb(var(--surface))] px-6 pb-10 pt-5"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 40 }}
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-display text-xl font-bold uppercase tracking-tight">
                  MAD<span className="text-madhouse-500">HOUSE</span>
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-full border"
                  aria-label="Close menu"
                >
                  <X size={17} />
                </button>
              </div>

              {/* What people actually came for */}
              <p className="eyebrow mb-3">Quick access</p>
              <div className="mb-8 grid grid-cols-2 gap-2">
                {mobilePriority.map(({ label, to, icon: Icon }) => (
                  <Link
                    key={label}
                    to={to}
                    className="card card-hover flex items-center gap-2.5 px-3.5 py-3 text-sm font-medium"
                  >
                    <Icon size={16} className="shrink-0 text-madhouse-500" />
                    {label}
                  </Link>
                ))}
              </div>

              <p className="eyebrow mb-3">All pages</p>
              <ul className="flex flex-col">
                {navigation.map((item, i) => (
                  <motion.li
                    key={item.to}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.035, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center justify-between border-b py-4 font-display text-2xl font-bold uppercase tracking-tight transition-colors',
                          isActive ? 'text-madhouse-500' : 'hover:text-madhouse-500',
                        )
                      }
                    >
                      {item.label}
                      <span className="muted font-mono text-[10px]">0{i + 1}</span>
                    </NavLink>
                  </motion.li>
                ))}
              </ul>

              <p className="muted mt-auto pt-10 text-xs">
                {site.fullName}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
