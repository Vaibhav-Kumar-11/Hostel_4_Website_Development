import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { AlertCircle, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useCountUp, useInView } from '@/hooks'

/* ── Reveal ──────────────────────────────────────────────────────────────── */

/**
 * One IntersectionObserver shared by every Reveal on the page, rather than one
 * per element. A long page mounts well over a hundred of these; a single
 * observer keeps that to one callback and one set of bookkeeping.
 */
let sharedObserver: IntersectionObserver | null = null

/** Elements armed but not yet revealed, so a recovery sweep can find them. */
const pending = new Set<Element>()

function reveal(el: Element) {
  el.classList.add('is-visible')
  pending.delete(el)
  sharedObserver?.unobserve(el)
}

/** Reveals every armed element that is currently on screen. */
function sweep() {
  if (pending.size === 0) return
  const h = window.innerHeight || document.documentElement.clientHeight
  for (const el of [...pending]) {
    const r = el.getBoundingClientRect()
    if (r.top < h && r.bottom > 0) reveal(el)
  }
}

/**
 * Debounced sweep, run after a batch of elements arms itself.
 *
 * A route change mounts a fresh page of reveals with no scroll event to follow
 * it, so without this the first screen of a newly navigated page would depend
 * entirely on the observer firing.
 */
let sweepTimer = 0
function scheduleSweep() {
  window.clearTimeout(sweepTimer)
  sweepTimer = window.setTimeout(sweep, 220)
}

/**
 * Backstop for the observer.
 *
 * A tab that is hidden while loading runs no layout passes, so the observer
 * reports nothing — and it can stay silent even after the tab is brought
 * forward. Scrolling and visibility changes therefore trigger a direct
 * geometry check, and one timed sweep shortly after load catches anything
 * on screen that the observer missed outright.
 *
 * When the observer is behaving, `pending` drains through it and every one of
 * these is a no-op. The cost of being wrong here is a page a resident cannot
 * read, so it is worth the few lines.
 */
function installRecovery() {
  if (typeof document === 'undefined') return

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) sweep()
  })
  window.addEventListener('scroll', sweep, { passive: true })
  window.addEventListener('resize', sweep, { passive: true })

  /*
    Late layout shifts are the awkward case. An element can mount below the
    fold, miss the sweep that follows it, and then be pushed up into view as
    fonts load or images claim their space — with no scroll event to prompt a
    re-check. Watching the document for size changes catches exactly that.
  */
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(() => sweep()).observe(document.documentElement)
  }
}

function observer(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) reveal(entry.target)
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -8% 0px' },
    )
    installRecovery()
  }
  return sharedObserver
}

interface RevealProps {
  children: ReactNode
  /** Stagger index — each step adds 55ms to the transition delay. */
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'article' | 'span'
  y?: number
}

/**
 * The single scroll-reveal used across the site.
 *
 * The animation itself lives in CSS (see `.reveal` in index.css) and this
 * component only decides *when* to add the class. That split matters: a
 * JS-driven opacity animation stops mid-flight whenever the browser stops
 * issuing animation frames — a backgrounded tab, an occluded window, battery
 * saver — and the content it was revealing never becomes visible again. A CSS
 * transition advances on wall-clock time and always lands on its end state.
 *
 * If IntersectionObserver is unavailable the element is shown immediately,
 * so the failure mode is "no animation", never "no content".
 */
export function Reveal({ children, delay = 0, className, as: Tag = 'div', y = 20 }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const io = observer()
    // No observer means no reveal animation; the element keeps its visible
    // base style rather than being hidden with no way back.
    if (!io) return

    // Arming is what hides the element, and it happens only once we know an
    // observer exists to unhide it again.
    node.classList.add('reveal-armed')
    pending.add(node)
    io.observe(node)
    scheduleSweep()

    return () => {
      pending.delete(node)
      io.unobserve(node)
    }
  }, [])

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={cn('reveal', className)}
      style={
        {
          '--reveal-delay': `${delay * 0.055}s`,
          '--reveal-y': `${y}px`,
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  )
}

/* ── Section shell ───────────────────────────────────────────────────────── */

interface SectionProps {
  id?: string
  children: ReactNode
  className?: string
  /** 'dark' paints the cinematic near-black band used to break up the page. */
  tone?: 'default' | 'dark' | 'sunken'
  /** Vertical rhythm. */
  size?: 'sm' | 'md' | 'lg'
  full?: boolean
}

export function Section({
  id,
  children,
  className,
  tone = 'default',
  size = 'md',
  full = false,
}: SectionProps) {
  const pad = size === 'sm' ? 'py-14 sm:py-16' : size === 'lg' ? 'py-24 sm:py-36' : 'py-20 sm:py-28'
  return (
    <section
      id={id}
      className={cn(
        'relative',
        pad,
        tone === 'dark' && 'band-dark',
        tone === 'sunken' && 'bg-[rgb(var(--surface-sunken))]',
        className,
      )}
    >
      <div className={full ? 'w-full' : 'shell'}>{children}</div>
    </section>
  )
}

/* ── Section heading ─────────────────────────────────────────────────────── */

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-10 flex flex-col gap-6 sm:mb-14',
        align === 'left' && action && 'sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && (
          <Reveal>
            <span className="eyebrow mb-4">
              <span className="h-1 w-1 rounded-full bg-madhouse-500" aria-hidden />
              {eyebrow}
            </span>
          </Reveal>
        )}
        <Reveal delay={1}>
          <h2 className="text-display-sm font-bold uppercase">{title}</h2>
        </Reveal>
        {description && (
          <Reveal delay={2}>
            <p className="muted mt-5 text-base leading-relaxed sm:text-lg">{description}</p>
          </Reveal>
        )}
      </div>
      {action && (
        <Reveal delay={3} className="shrink-0">
          {action}
        </Reveal>
      )}
    </div>
  )
}

/* ── Link buttons ────────────────────────────────────────────────────────── */

interface ActionLinkProps {
  to?: string
  href?: string
  children: ReactNode
  variant?: 'primary' | 'ghost' | 'solid' | 'text'
  className?: string
  onClick?: () => void
}

export function ActionLink({
  to,
  href,
  children,
  variant = 'ghost',
  className,
  onClick,
}: ActionLinkProps) {
  const classes = cn(
    variant === 'text'
      ? 'group inline-flex items-center gap-2 text-sm font-semibold tracking-wide transition-colors hover:text-madhouse-500'
      : cn('btn', `btn-${variant}`),
    className,
  )

  const content =
    variant === 'text' ? (
      <>
        {children}
        <ArrowUpRight
          size={16}
          className="transition-transform duration-300 ease-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </>
    ) : (
      children
    )

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noreferrer noopener' : undefined}
        className={classes}
        onClick={onClick}
      >
        {content}
      </a>
    )
  }

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" className={classes} onClick={onClick}>
      {content}
    </button>
  )
}

/* ── Animated statistic ──────────────────────────────────────────────────── */

interface StatProps {
  value?: number
  text?: string
  suffix?: string
  label: string
  note?: string
}

export function Stat({ value, text, suffix, label, note }: StatProps) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const count = useCountUp(value ?? 0, inView)

  /*
    Word statistics need their own scale. A numeral like "1250" is four narrow
    glyphs, but "INDIVIDUAL" is ten wide ones — set at the numeral's size it
    runs past its column and collides with the statistic beside it. Long words
    are stepped down so every cell stays inside its own grid track.
  */
  const sizeClass = text
    ? text.length > 8
      ? 'text-[clamp(1.5rem,3.1vw,2.5rem)]'
      : 'text-[clamp(1.9rem,4.2vw,3.25rem)]'
    : 'text-[clamp(2.5rem,7vw,4.5rem)]'

  return (
    <div ref={ref} className="group relative min-w-0">
      <div
        className={cn(
          'font-display font-bold leading-none tracking-tighter break-words',
          sizeClass,
        )}
      >
        {text ? (
          <span className="bg-gradient-to-br from-madhouse-400 to-madhouse-600 bg-clip-text text-transparent">
            {text}
          </span>
        ) : (
          <>
            <span className="tabular-nums">{count.toLocaleString('en-IN')}</span>
            {suffix && <span className="text-madhouse-500">{suffix}</span>}
          </>
        )}
      </div>
      <div className="mt-3 text-sm font-semibold uppercase tracking-[0.18em]">{label}</div>
      {note && <div className="muted mt-1.5 text-xs">{note}</div>}
    </div>
  )
}

/* ── Placeholder honesty ─────────────────────────────────────────────────── */

/**
 * Shown wherever the site is displaying sample content. The competition brief
 * is explicit that no fact may be invented, so rather than quietly faking
 * data we label it and say exactly which file supplies the real thing.
 */
export function PlaceholderNote({
  children,
  className,
  compact = false,
}: {
  children: ReactNode
  className?: string
  compact?: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-xl border border-dashed px-3.5 text-xs leading-relaxed',
        compact ? 'py-2' : 'py-3',
        'border-madhouse-500/40 bg-madhouse-500/[0.06] text-madhouse-700 dark:text-madhouse-300',
        className,
      )}
    >
      <AlertCircle size={14} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  )
}

export function PendingPill({ label = 'Awaiting details' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-madhouse-500/45 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-madhouse-600 dark:text-madhouse-400">
      <span className="h-1.5 w-1.5 rounded-full bg-madhouse-500/70" aria-hidden />
      {label}
    </span>
  )
}

/* ── Empty state ─────────────────────────────────────────────────────────── */

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="card flex flex-col items-center gap-4 px-6 py-16 text-center">
      {icon && (
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[rgb(var(--surface-sunken))] text-madhouse-500">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold uppercase tracking-tight">{title}</h3>
      <p className="muted max-w-md text-sm leading-relaxed">{description}</p>
      {action}
    </div>
  )
}
