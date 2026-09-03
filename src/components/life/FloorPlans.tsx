import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { FileText, Maximize2 } from 'lucide-react'
import { Reveal, Section, SectionHeading } from '@/components/ui/primitives'
import { FLOOR_PLANS_ENABLED, floors, type Floor } from '@/data/floors'
import { asset, cn } from '@/lib/utils'

/**
 * FLOOR PLANS — the building, one level at a time.
 *
 * A vertical stack of levels (top floor at the top, the way anyone picturing a
 * building draws it) beside a detail panel. On narrow screens the stack turns
 * into a horizontal strip above the panel.
 *
 * Two rules shape everything below:
 *
 *   1. Nothing half-built ships. If the section has been switched off, or the
 *      floor list is empty, this renders nothing at all — no heading, no
 *      shell, no trace on the page.
 *
 *   2. Empty fields are silent. A level with no wings listed shows no wings
 *      heading; it never says the wings are missing. The panel simply carries
 *      whatever that level actually has.
 */
export default function FloorPlans() {
  if (!FLOOR_PLANS_ENABLED || floors.length === 0) return null
  return <FloorPlanExplorer />
}

/* ── Explorer ────────────────────────────────────────────────────────────── */

function FloorPlanExplorer() {
  const [index, setIndex] = useState(0)
  const strip = useRef<HTMLDivElement | null>(null)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  const floor = floors[index]

  /*
    Keep the selected level inside view on the horizontal strip.

    The container is scrolled directly rather than through scrollIntoView,
    which on a nested scroller will happily drag the whole page along with it.
    On desktop the stack does not overflow, so this is a no-op.
  */
  useEffect(() => {
    const rail = strip.current
    const button = buttons.current[index]
    if (!rail || !button) return
    if (rail.scrollWidth <= rail.clientWidth) return
    const target = button.offsetLeft - rail.clientWidth / 2 + button.offsetWidth / 2
    rail.scrollTo({ left: Math.max(0, target), behavior: 'smooth' })
  }, [index])

  /*
    Arrow keys walk the building. Up and Right climb, Down and Left descend —
    the stack is rendered bottom-up on desktop and left-to-right on mobile, so
    both pairs move the same direction through the list on both layouts.
  */
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const top = floors.length - 1
    let next = index

    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        next = Math.min(top, index + 1)
        break
      case 'ArrowDown':
      case 'ArrowLeft':
        next = Math.max(0, index - 1)
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = top
        break
      default:
        return
    }

    event.preventDefault()
    if (next === index) return
    setIndex(next)
    buttons.current[next]?.focus()
  }

  return (
    <Section id="floor-plans" tone="sunken" className="scroll-mt-24">
      <SectionHeading
        // Derived, so it cannot drift out of step with the data again.
        eyebrow={`${floors.length} levels`}
        title={
          <>
            Floor <span className="text-madhouse-500">plans</span>
          </>
        }
        description="Ground to ninth, plate by plate. Pick a level to see how it is laid out and what sits on it."
      />

      <div className="grid gap-6 lg:grid-cols-[13.5rem_1fr] lg:items-start lg:gap-10">
        {/* ── Level selector ── */}
        <Reveal className="min-w-0 lg:sticky lg:top-24">
          <div
            ref={strip}
            role="group"
            aria-label="Choose a floor"
            onKeyDown={onKeyDown}
            className={cn(
              'no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1',
              'lg:mx-0 lg:flex-col-reverse lg:overflow-visible lg:px-0',
            )}
          >
            {floors.map((f, i) => {
              const active = i === index
              return (
                <button
                  key={f.id}
                  type="button"
                  ref={(el) => {
                    buttons.current[i] = el
                  }}
                  aria-pressed={active}
                  aria-label={`${f.label} floor`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    'flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3',
                    'transition-all duration-300 ease-smooth active:scale-[.98]',
                    'lg:w-full lg:px-4 lg:py-2.5',
                    active
                      ? 'border-madhouse-500 bg-madhouse-500 text-[rgb(var(--accent-contrast))]'
                      : cn(
                          'bg-[rgb(var(--surface-raised))]',
                          'hover:-translate-y-0.5 hover:border-madhouse-500/45 lg:hover:translate-y-0 lg:hover:translate-x-1',
                        ),
                  )}
                >
                  <span className="w-5 text-center font-display text-lg font-bold leading-none tracking-tight">
                    {f.shortLabel}
                  </span>
                  <span
                    className={cn(
                      'hidden text-[11px] font-semibold uppercase tracking-[0.16em] lg:inline',
                      !active && 'muted',
                    )}
                  >
                    {f.label}
                  </span>
                </button>
              )
            })}
          </div>

          <p className="muted mt-4 hidden text-[11px] leading-relaxed lg:block">
            Arrow keys move between levels.
          </p>
        </Reveal>

        {/* ── Detail panel ── */}
        <Reveal delay={1} className="min-w-0">
          <FloorDetail floor={floor} />
        </Reveal>
      </div>
    </Section>
  )
}

/* ── Plan drawing ────────────────────────────────────────────────────────── */

/**
 * The plans the hostel office supplied are PDFs — vector drawings, which is
 * the right format for something people need to zoom into to find a room.
 *
 * `<object>` lets the browser render it inline with its own PDF viewer, so
 * there is no conversion step in the pipeline and no loss of detail. Browsers
 * that decline to render a PDF inline — most mobile ones — fall through to the
 * child content instead of showing an empty box, so the button below is always
 * reachable and is the whole feature on a phone.
 */
function PlanDrawing({ floor }: { floor: Floor }) {
  const href = asset(floor.plan!)
  const name = floor.label.toLowerCase()

  return (
    <figure className="mt-8">
      <div className="overflow-hidden rounded-xl border bg-[rgb(var(--surface-sunken))]">
        <object
          data={`${href}#toolbar=0&navpanes=0&view=FitH`}
          type="application/pdf"
          aria-label={`Floor plan of the ${name} floor of Hostel 4`}
          className="h-[22rem] w-full sm:h-[30rem]"
        >
          {/* Shown only when the browser will not render a PDF inline. */}
          <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
            <FileText size={26} className="text-madhouse-500" aria-hidden />
            <p className="muted max-w-xs text-sm leading-relaxed">
              Your browser cannot show the drawing inline. Open it in a new tab to zoom in.
            </p>
          </div>
        </object>
      </div>

      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="muted text-xs leading-relaxed">
          {floor.sharesTypicalPlan
            ? 'Floors 1 to 9 share this layout.'
            : 'Ground floor layout.'}
        </span>
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="btn btn-ghost px-4 py-2 text-xs"
        >
          <Maximize2 size={13} aria-hidden />
          Open full plan
        </a>
      </figcaption>
    </figure>
  )
}

/* ── Detail panel ────────────────────────────────────────────────────────── */

function FloorDetail({ floor }: { floor: Floor }) {
  const hasMeta =
    Boolean(floor.roomRange) || floor.wings.length > 0 || floor.highlights.length > 0

  return (
    <article className="card relative min-h-[24rem] overflow-hidden sm:min-h-[28rem] lg:min-h-[32rem]">
      {/*
        With no drawing for this level, the panel is backed by a schematic of a
        generic corridor plate — the shape every floor of the building shares.
        It is a drawing in its own right, not a stand-in for a missing one.
      */}
      {!floor.plan && (
        <>
          <div className="pointer-events-none absolute inset-0 p-5 sm:p-7" aria-hidden>
            <FloorPlate className="h-full w-full" />
          </div>
          {/* Softens the linework under the heading without hiding the drawing. */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[rgb(var(--surface-raised))] via-[rgb(var(--surface-raised))]/55 to-transparent"
            aria-hidden
          />
        </>
      )}

      {/*
        Re-keyed per level so the CSS entrance replays on selection. `.page-enter`
        rests visible and only animates in, so a level is readable whether or not
        the animation ever runs.
      */}
      <div key={floor.id} className="page-enter relative p-6 sm:p-8 lg:p-10">
        <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-display text-[clamp(2.75rem,7vw,5rem)] font-bold uppercase leading-[0.88] tracking-tighter">
            {floor.label}
          </h3>
          <span className="muted font-display text-xl font-bold uppercase tracking-tight sm:text-2xl">
            Floor
          </span>
        </header>

        {floor.description && (
          <p className="muted mt-5 max-w-xl text-sm leading-relaxed sm:text-base">
            {floor.description}
          </p>
        )}

        {floor.plan && <PlanDrawing floor={floor} />}

        {hasMeta && (
          <div className="mt-8 grid gap-7 border-t pt-8 sm:grid-cols-2">
            {floor.roomRange && (
              <div>
                <span className="eyebrow">Rooms</span>
                <p className="mt-2.5 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  {floor.roomRange}
                </p>
              </div>
            )}

            {floor.wings.length > 0 && (
              <div>
                <span className="eyebrow">Wings</span>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {floor.wings.map((wing) => (
                    <li key={wing} className="chip bg-[rgb(var(--surface-sunken))]">
                      {wing}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {floor.highlights.length > 0 && (
              <div className="sm:col-span-2">
                <span className="eyebrow">On this level</span>
                <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {floor.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-snug">
                      <span
                        className="mt-[0.4rem] h-1 w-1 shrink-0 rounded-full bg-madhouse-500"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

/* ── Schematic ───────────────────────────────────────────────────────────── */

/*
  Plate geometry, in the drawing's own coordinates.

  The numbers are chosen so the proportions read like a building rather than a
  diagram: rooms roughly 78 × 120 either side of a 44-deep corridor, giving a
  slab about three and a half times longer than it is deep.
*/
const SLAB = { x: 48, y: 60, w: 1104, h: 308 }
const INNER = { x: 60, y: 72, w: 1080, h: 284 }
const CORRIDOR_TOP = 192
const CORRIDOR_BOTTOM = 236
const DOOR = 22
const BAY_X = 168
const BAY_W = 78
const BAY_COUNT = 11
const BAYS = Array.from({ length: BAY_COUNT }, (_, i) => i)
const GRID_LINES = Array.from({ length: BAY_COUNT + 1 }, (_, i) => BAY_X + i * BAY_W)
const TREADS = Array.from({ length: 9 }, (_, i) => 84 + (i + 1) * 10)

/**
 * A generic corridor-and-rooms floor plate: double-loaded corridor, rooms
 * either side, stair and lift cores at both ends, dimension lines and a north
 * mark. Everything is drawn in `currentColor`, so it inherits the panel's text
 * colour and reads correctly in both themes without a second palette.
 */
function FloorPlate({ className }: { className?: string }) {
  // useId ships punctuation (':' / '«') that is legal in an id but awkward in a
  // url(#…) reference, so it is stripped down to a plain token.
  const hatch = `floor-plate-hatch-${useId().replace(/[^a-zA-Z0-9]/g, '')}`

  return (
    <svg
      viewBox="0 0 1200 440"
      preserveAspectRatio="xMidYMax meet"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      aria-hidden
      focusable="false"
    >
      <defs>
        <pattern
          id={hatch}
          width="9"
          height="9"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="9" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Slab and inner face */}
      <g opacity="0.38">
        <rect x={SLAB.x} y={SLAB.y} width={SLAB.w} height={SLAB.h} rx="3" strokeWidth="2.2" />
        <rect x={INNER.x} y={INNER.y} width={INNER.w} height={INNER.h} strokeWidth="1.2" />
      </g>

      {/* Corridor */}
      <g opacity="0.32">
        <rect
          x={INNER.x}
          y={CORRIDOR_TOP}
          width={INNER.w}
          height={CORRIDOR_BOTTOM - CORRIDOR_TOP}
          fill="currentColor"
          fillOpacity="0.16"
          stroke="none"
        />
        <line
          x1={INNER.x}
          y1={CORRIDOR_TOP}
          x2={INNER.x + INNER.w}
          y2={CORRIDOR_TOP}
          strokeWidth="1.5"
        />
        <line
          x1={INNER.x}
          y1={CORRIDOR_BOTTOM}
          x2={INNER.x + INNER.w}
          y2={CORRIDOR_BOTTOM}
          strokeWidth="1.5"
        />
      </g>

      {/* Room partitions */}
      <g opacity="0.26" strokeWidth="1.2">
        {GRID_LINES.map((x) => (
          <g key={x}>
            <line x1={x} y1={INNER.y} x2={x} y2={CORRIDOR_TOP} />
            <line x1={x} y1={CORRIDOR_BOTTOM} x2={x} y2={INNER.y + INNER.h} />
          </g>
        ))}
      </g>

      {/*
        Doors onto the corridor, one per room. Each is a hinge leaf plus its
        quarter-circle swing, drawn opening into the room the way a plan does.
      */}
      <g opacity="0.2" strokeWidth="1.1">
        {BAYS.map((i) => {
          const x = BAY_X + i * BAY_W
          return (
            <g key={x}>
              <path
                d={`M ${x + 12} ${CORRIDOR_TOP} L ${x + 12} ${CORRIDOR_TOP - DOOR} A ${DOOR} ${DOOR} 0 0 1 ${x + 12 + DOOR} ${CORRIDOR_TOP}`}
              />
              <path
                d={`M ${x + 12} ${CORRIDOR_BOTTOM} L ${x + 12} ${CORRIDOR_BOTTOM + DOOR} A ${DOOR} ${DOOR} 0 0 0 ${x + 12 + DOOR} ${CORRIDOR_BOTTOM}`}
              />
            </g>
          )
        })}
      </g>

      {/* Cores — stairs, lift, services */}
      <g opacity="0.32" strokeWidth="1.3">
        {/* Main stair */}
        <rect x="76" y="84" width="80" height="96" />
        {TREADS.map((y) => (
          <line key={`s1-${y}`} x1="76" y1={y} x2="156" y2={y} strokeWidth="1" />
        ))}
        <line x1="116" y1="173" x2="116" y2="91" />
        <path d="M 111 99 L 116 89 L 121 99" />

        {/* Lift shaft */}
        <rect x="76" y="248" width="80" height="64" />
        <line x1="76" y1="248" x2="156" y2="312" strokeWidth="1" />
        <line x1="156" y1="248" x2="76" y2="312" strokeWidth="1" />

        {/* Service duct */}
        <rect x="76" y="326" width="80" height="24" fill={`url(#${hatch})`} fillOpacity="0.32" />

        {/* Secondary stair */}
        <rect x="1044" y="84" width="84" height="96" />
        {TREADS.map((y) => (
          <line key={`s2-${y}`} x1="1044" y1={y} x2="1128" y2={y} strokeWidth="1" />
        ))}
        <line x1="1086" y1="173" x2="1086" y2="91" />
        <path d="M 1081 99 L 1086 89 L 1091 99" />

        {/* Service riser */}
        <rect x="1044" y="248" width="84" height="102" fill={`url(#${hatch})`} fillOpacity="0.32" />
      </g>

      {/* Column grid, dimension lines, north mark */}
      <g opacity="0.24" strokeWidth="1">
        {GRID_LINES.map((x) => (
          <g key={`c-${x}`}>
            <circle cx={x} cy={SLAB.y} r="3.2" fill="currentColor" stroke="none" />
            <circle cx={x} cy={SLAB.y + SLAB.h} r="3.2" fill="currentColor" stroke="none" />
          </g>
        ))}

        <line x1={SLAB.x} y1="558" x2={SLAB.x + SLAB.w} y2="558" />
        <line x1={SLAB.x} y1="550" x2={SLAB.x} y2="566" />
        <line x1={BAY_X} y1="552" x2={BAY_X} y2="564" />
        <line x1={BAY_X + BAY_COUNT * BAY_W} y1="552" x2={BAY_X + BAY_COUNT * BAY_W} y2="564" />
        <line x1={SLAB.x + SLAB.w} y1="550" x2={SLAB.x + SLAB.w} y2="566" />

        <line x1="1178" y1={SLAB.y} x2="1178" y2={SLAB.y + SLAB.h} />
        <line x1="1170" y1={SLAB.y} x2="1186" y2={SLAB.y} />
        <line x1="1170" y1={SLAB.y + SLAB.h} x2="1186" y2={SLAB.y + SLAB.h} />

        <line x1="66" y1="50" x2="66" y2="24" />
        <path d="M 60 32 L 66 22 L 72 32" />
        <text
          x="66"
          y="14"
          fontSize="13"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          fontFamily="inherit"
        >
          N
        </text>
      </g>
    </svg>
  )
}
