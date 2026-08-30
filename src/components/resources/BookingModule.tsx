import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarCheck, Check, Info, Trash2, X } from 'lucide-react'
import { amenities, bookableEquipment } from '@/data/amenities'
import { useLocalStorage } from '@/hooks'
import { cn, formatLongDate, toISODate } from '@/lib/utils'

/**
 * Room & equipment booking — UI prototype.
 *
 * This is a working front end for a system that does not have a back end yet.
 * Requests are validated, clash-checked against the ones already on this
 * device and stored in `localStorage`; nothing is sent anywhere.
 *
 * That is stated plainly to the user rather than hidden — a resident who
 * thinks they have reserved the music room and has not is worse off than one
 * who knows the desk still has to confirm it. When the Council provides an
 * endpoint, `submitRequest` is the only function that needs to change.
 */

interface BookingRequest {
  id: string
  resourceId: string
  resourceName: string
  date: string
  slot: string
  name: string
  room: string
  purpose: string
  createdAt: string
}

/** Two-hour blocks across the usable part of the day. */
const SLOTS = [
  '08:00 – 10:00',
  '10:00 – 12:00',
  '12:00 – 14:00',
  '14:00 – 16:00',
  '16:00 – 18:00',
  '18:00 – 20:00',
  '20:00 – 22:00',
  '22:00 – 00:00',
]

const MAX_DAYS_AHEAD = 14

export default function BookingModule() {
  const [bookings, setBookings] = useLocalStorage<BookingRequest[]>('madhouse:bookings', [])

  const resources = useMemo(
    () => [
      ...amenities
        .filter((a) => a.bookable)
        .map((a) => ({ id: a.id, name: a.name, category: 'Rooms & Spaces' })),
      ...bookableEquipment,
    ],
    [],
  )

  const categories = useMemo(
    () => [...new Set(resources.map((r) => r.category))],
    [resources],
  )

  const today = useMemo(() => toISODate(new Date()), [])
  const maxDate = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + MAX_DAYS_AHEAD)
    return toISODate(d)
  }, [])

  const [resourceId, setResourceId] = useState(resources[0]?.id ?? '')
  const [date, setDate] = useState(today)
  const [slot, setSlot] = useState('')
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [purpose, setPurpose] = useState('')
  const [confirmed, setConfirmed] = useState<BookingRequest | null>(null)
  const [error, setError] = useState('')

  const resource = resources.find((r) => r.id === resourceId)

  /** Slots already requested for this resource on this date, on this device. */
  const takenSlots = useMemo(
    () =>
      new Set(
        bookings.filter((b) => b.resourceId === resourceId && b.date === date).map((b) => b.slot),
      ),
    [bookings, resourceId, date],
  )

  function submitRequest(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!slot) return setError('Pick a time slot.')
    if (!name.trim()) return setError('Enter your name.')
    if (!room.trim()) return setError('Enter your room number.')
    if (takenSlots.has(slot)) return setError('That slot already has a request against it.')

    const request: BookingRequest = {
      // Date-based id — no crypto.randomUUID dependency, and it stays unique
      // because the clash check above rules out duplicates within a slot.
      id: `${resourceId}-${date}-${slot}-${Date.now()}`,
      resourceId,
      resourceName: resource?.name ?? resourceId,
      date,
      slot,
      name: name.trim(),
      room: room.trim(),
      purpose: purpose.trim(),
      createdAt: new Date().toISOString(),
    }

    setBookings((list) => [request, ...list])
    setConfirmed(request)
    setSlot('')
    setPurpose('')
  }

  function cancel(id: string) {
    setBookings((list) => list.filter((b) => b.id !== id))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
      {/* ── Request form ── */}
      <form onSubmit={submitRequest} className="card p-6 sm:p-8">
        <h3 className="text-xl font-bold uppercase tracking-tight">Request a booking</h3>
        <p className="muted mt-2 text-sm leading-relaxed">
          Rooms and equipment held by the hostel council. Requests can be made up to{' '}
          {MAX_DAYS_AHEAD} days ahead.
        </p>

        {/* Resource */}
        <fieldset className="mt-7">
          <legend className="eyebrow mb-3">What do you need?</legend>
          {categories.map((cat) => (
            <div key={cat} className="mb-4 last:mb-0">
              <p className="muted mb-2 text-xs font-semibold">{cat}</p>
              <div className="flex flex-wrap gap-2">
                {resources
                  .filter((r) => r.category === cat)
                  .map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setResourceId(r.id)
                        setSlot('')
                      }}
                      className={cn('chip', resourceId === r.id && 'chip-active')}
                    >
                      {r.name}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </fieldset>

        {/* Date */}
        <div className="mt-7">
          <label htmlFor="booking-date" className="eyebrow mb-3 block">
            Date
          </label>
          <input
            id="booking-date"
            type="date"
            value={date}
            min={today}
            max={maxDate}
            onChange={(e) => {
              setDate(e.target.value)
              setSlot('')
            }}
            className="field max-w-xs"
          />
        </div>

        {/* Slots */}
        <fieldset className="mt-7">
          <legend className="eyebrow mb-3">Time slot</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {SLOTS.map((s) => {
              const taken = takenSlots.has(s)
              return (
                <button
                  key={s}
                  type="button"
                  disabled={taken}
                  onClick={() => setSlot(s)}
                  className={cn(
                    'rounded-xl border px-3 py-2.5 font-mono text-[11px] transition-all duration-200',
                    taken && 'cursor-not-allowed line-through opacity-35',
                    slot === s
                      ? 'border-madhouse-500 bg-madhouse-500 text-white'
                      : !taken && 'hover:border-madhouse-500',
                  )}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </fieldset>

        {/* Requester */}
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="booking-name" className="eyebrow mb-3 block">
              Your name
            </label>
            <input
              id="booking-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="field"
              placeholder="Full name"
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="booking-room" className="eyebrow mb-3 block">
              Room number
            </label>
            <input
              id="booking-room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="field"
              placeholder="e.g. B-412"
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="booking-purpose" className="eyebrow mb-3 block">
            Purpose <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <input
            id="booking-purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="field"
            placeholder="Cult GC practice, wing match, project demo…"
          />
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm font-medium text-red-500">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-primary mt-7 w-full sm:w-auto">
          <CalendarCheck size={16} /> Submit request
        </button>

        <p className="muted mt-5 flex items-start gap-2 border-t pt-5 text-xs leading-relaxed">
          <Info size={13} className="mt-0.5 shrink-0" />
          <span>
            A request holds the slot for the hostel council to confirm. Check with them before you
            count on it.
          </span>
        </p>
      </form>

      {/* ── Your requests ── */}
      <div className="card flex flex-col p-6 sm:p-8">
        <h3 className="text-xl font-bold uppercase tracking-tight">Your requests</h3>
        <p className="muted mt-2 text-sm">Saved on this device.</p>

        {bookings.length === 0 ? (
          <div className="muted flex flex-1 flex-col items-center justify-center gap-3 py-14 text-center">
            <CalendarCheck size={24} />
            <p className="text-sm">No requests yet.</p>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            <AnimatePresence initial={false}>
              {bookings.map((b) => (
                <motion.li
                  key={b.id}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.22 }}
                  className="flex items-start gap-3 rounded-xl border p-4"
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-madhouse-500/12 text-madhouse-500">
                    <Check size={14} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold uppercase tracking-tight">
                      {b.resourceName}
                    </p>
                    <p className="muted mt-1 font-mono text-[11px]">
                      {formatLongDate(b.date)} · {b.slot}
                    </p>
                    <p className="muted mt-1 text-xs">
                      {b.name} · Room {b.room}
                    </p>
                    {b.purpose && <p className="muted mt-1 truncate text-xs italic">{b.purpose}</p>}
                  </div>
                  <button
                    onClick={() => cancel(b.id)}
                    className="muted shrink-0 rounded-lg p-1.5 transition-colors hover:bg-red-500/10 hover:text-red-500"
                    aria-label={`Remove request for ${b.resourceName}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {/* Confirmation */}
      <AnimatePresence>
        {confirmed && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm"
              onClick={() => setConfirmed(null)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              className="card relative w-full max-w-sm p-7 text-center"
              initial={{ scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                onClick={() => setConfirmed(null)}
                className="muted absolute right-4 top-4 rounded-full p-1 hover:text-[rgb(var(--text))]"
                aria-label="Close"
              >
                <X size={16} />
              </button>

              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-madhouse-500/12 text-madhouse-500">
                <Check size={24} />
              </span>
              <h3 className="mt-5 text-xl font-bold uppercase tracking-tight">Request recorded</h3>
              <p className="muted mt-3 text-sm leading-relaxed">
                <strong className="text-[rgb(var(--text))]">{confirmed.resourceName}</strong> on{' '}
                {formatLongDate(confirmed.date)}, {confirmed.slot}.
              </p>
              <p className="muted mt-4 border-t pt-4 text-xs leading-relaxed">
                Confirm with the hostel council before the slot.
              </p>
              <button onClick={() => setConfirmed(null)} className="btn btn-primary mt-6 w-full">
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
