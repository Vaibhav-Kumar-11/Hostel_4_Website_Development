import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

/* ── Theme ───────────────────────────────────────────────────────────────── */

export type Theme = 'light' | 'dark'
const THEME_KEY = 'madhouse:theme'

function readTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = window.localStorage.getItem(THEME_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
    window.localStorage.setItem(THEME_KEY, theme)
    const meta = document.querySelector('meta[name="theme-color"]')
    meta?.setAttribute('content', theme === 'dark' ? '#0A0908' : '#F7F5F2')
  }, [theme])

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])
  return { theme, setTheme, toggle }
}

/* ── A ticking clock, shared by the mess widgets ─────────────────────────── */

/** Re-renders every `intervalMs` so time-derived UI stays honest. */
export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])
  return now
}

/* ── Scroll ──────────────────────────────────────────────────────────────── */

export function useScrollPosition() {
  const [state, setState] = useState({ y: 0, progress: 0 })

  useEffect(() => {
    let frame = 0
    const measure = () => {
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      setState({ y, progress: max > 0 ? Math.min(1, y / max) : 0 })
      frame = 0
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return state
}

/* ── Viewport ────────────────────────────────────────────────────────────── */

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    setMatches(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])
  return matches
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/* ── Reveal-on-scroll ────────────────────────────────────────────────────── */

/**
 * Fires once when an element first enters the viewport. Used for section
 * reveals and the statistics counters. Cheaper and steadier than tying
 * animation to a scroll listener.
 */
export function useInView<T extends HTMLElement>(
  options: IntersectionObserverInit = { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || inView) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        observer.disconnect()
      }
    }, options)
    observer.observe(node)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  return { ref, inView }
}

/* ── Counters ────────────────────────────────────────────────────────────── */

/**
 * Eases a number from 0 to `target` once `active` flips true.
 *
 * The easing runs on requestAnimationFrame, which the browser stops issuing in
 * a backgrounded or throttled tab. A timer set for the full duration therefore
 * runs alongside it and snaps the counter to its final value; whichever
 * finishes first, the number a resident reads is the correct one rather than a
 * zero frozen mid-animation.
 */
export function useCountUp(target: number, active: boolean, duration = 1600): number {
  const [value, setValue] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!active) return
    if (reduced) {
      setValue(target)
      return
    }

    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      // easeOutExpo — fast start, long settle.
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
      setValue(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // Wall-clock safety net; harmless when the animation already finished.
    const settle = window.setTimeout(() => setValue(target), duration + 80)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(settle)
    }
  }, [active, target, duration, reduced])

  return value
}

/* ── Persistence ─────────────────────────────────────────────────────────── */

/** Per-device persistence. Wrapped in try/catch — private mode can throw. */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage unavailable — the UI still works, it just will not remember */
    }
  }, [key, value])

  return [value, setValue] as const
}

/* ── Body scroll lock, for overlays ──────────────────────────────────────── */

export function useScrollLock(locked: boolean) {
  useLayoutEffect(() => {
    if (!locked) return
    const original = document.body.style.overflow
    const scrollBarGap = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollBarGap > 0) document.body.style.paddingRight = `${scrollBarGap}px`
    return () => {
      document.body.style.overflow = original
      document.body.style.paddingRight = ''
    }
  }, [locked])
}

/* ── Keyboard ────────────────────────────────────────────────────────────── */

/** Global hotkey. `combo` looks like 'mod+k' or 'escape'. */
export function useHotkey(combo: string, handler: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const parts = combo.toLowerCase().split('+')
    const key = parts[parts.length - 1]
    const needsMod = parts.includes('mod')
    const needsShift = parts.includes('shift')

    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      if (needsMod !== mod) return
      if (needsShift && !e.shiftKey) return
      if (e.key.toLowerCase() !== key) return
      e.preventDefault()
      handler()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [combo, handler, enabled])
}
