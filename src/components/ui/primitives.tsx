import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { AlertCircle, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useCountUp, useInView, useReducedMotion } from '@/hooks'

/* ── Reveal ──────────────────────────────────────────────────────────────── */

interface RevealProps {
  children: ReactNode
  /** Stagger index — each step adds 60ms. */
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'article' | 'span'
  y?: number
}

/**
 * The single scroll-reveal used across the site. One implementation keeps the
 * motion language consistent, and it collapses to a plain element when the
 * visitor has asked for reduced motion.
 */
export function Reveal({ children, delay = 0, className, as = 'div', y = 20 }: RevealProps) {
  const reduced = useReducedMotion()
  const Component = motion[as]

  if (reduced) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, delay: delay * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
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

  return (
    <div ref={ref} className="group relative">
      <div className="text-[clamp(2.5rem,7vw,4.5rem)] font-display font-bold leading-none tracking-tighter">
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
