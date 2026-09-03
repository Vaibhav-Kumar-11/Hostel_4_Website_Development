import { useMemo, useState } from 'react'
import { CalendarRange, IndianRupee, Info } from 'lucide-react'
import { messRebate } from '@/data/mess'
import { useLocalStorage } from '@/hooks'
import { Reveal } from '@/components/ui/primitives'
import { formatLongDate, parseISODate, toISODate } from '@/lib/utils'

/**
 * MESS REBATE CALCULATOR.
 *
 * Going home for a week and working out what comes off the mess bill is one of
 * the few sums every resident does, and everyone does it wrong at least once —
 * usually by counting the days rather than the nights, or by forgetting the
 * minimum-stay rule.
 *
 * The rate is not hardcoded and is not invented. If the council fills in
 * `messRebate.ratePerDay` the field is prefilled; until then the resident
 * types the figure from their own mess bill and it is remembered on their
 * device. Either way the arithmetic is the site's job, not theirs.
 */
export default function RebateCalculator() {
  const today = useMemo(() => toISODate(new Date()), [])

  const [from, setFrom] = useState(today)
  const [to, setTo] = useState('')
  const [rate, setRate] = useLocalStorage<string>(
    'madhouse:messRate',
    messRebate.ratePerDay ? String(messRebate.ratePerDay) : '',
  )

  const result = useMemo(() => {
    const start = parseISODate(from)
    const end = parseISODate(to)
    if (!start || !end) return null
    if (end < start) return { error: 'The return date is before the departure date.' as const }

    /*
      Days counted, not nights. A resident leaving on the 3rd and back on the
      5th misses the 3rd and the 4th — two days of meals — and eats in the mess
      again on the 5th. So the span is exclusive of the return day.
    */
    const days = Math.round((end.getTime() - start.getTime()) / 86_400_000)
    if (days === 0) return { error: 'Leaving and returning the same day means no meals are missed.' as const }

    const perDay = Number(rate)
    const amount = Number.isFinite(perDay) && perDay > 0 ? days * perDay : null
    const belowMinimum = messRebate.minimumDays !== null && days < messRebate.minimumDays

    return { days, amount, belowMinimum }
  }, [from, to, rate])

  return (
    <Reveal>
      <div className="card p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-madhouse-500/12 text-madhouse-500">
            <CalendarRange size={18} />
          </span>
          <div>
            <h3 className="text-xl font-bold uppercase tracking-tight">Rebate calculator</h3>
            <p className="muted mt-1.5 text-sm leading-relaxed">
              Going home? Work out what comes off the mess bill before you file.
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="rebate-from" className="eyebrow mb-3 block">
              Last meal in mess
            </label>
            <input
              id="rebate-from"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="field"
            />
          </div>

          <div>
            <label htmlFor="rebate-to" className="eyebrow mb-3 block">
              Back in mess on
            </label>
            <input
              id="rebate-to"
              type="date"
              value={to}
              min={from}
              onChange={(e) => setTo(e.target.value)}
              className="field"
            />
          </div>

          <div>
            <label htmlFor="rebate-rate" className="eyebrow mb-3 block">
              Daily charge (₹)
            </label>
            <input
              id="rebate-rate"
              type="number"
              inputMode="numeric"
              min={0}
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="field"
              placeholder="From your mess bill"
            />
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-7 border-t pt-7">
            {'error' in result ? (
              <p role="alert" className="text-sm font-medium text-red-500">
                {result.error}
              </p>
            ) : (
              <div className="flex flex-wrap items-end gap-x-10 gap-y-5">
                <div>
                  <span className="eyebrow">Days away</span>
                  <p className="mt-2 font-display text-4xl font-bold leading-none tracking-tighter sm:text-5xl">
                    {result.days}
                  </p>
                </div>

                {result.amount !== null && (
                  <div>
                    <span className="eyebrow">Approximate rebate</span>
                    <p className="mt-2 flex items-baseline font-display text-4xl font-bold leading-none tracking-tighter text-madhouse-500 sm:text-5xl">
                      <IndianRupee size={28} strokeWidth={2.5} aria-hidden />
                      {result.amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                )}

                <p className="muted w-full text-xs leading-relaxed sm:w-auto sm:flex-1">
                  Counted from your last meal in the mess up to the day you are back —{' '}
                  {formatLongDate(from)} to {formatLongDate(to)}.
                </p>
              </div>
            )}

            {'belowMinimum' in result && result.belowMinimum && (
              <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-amber-600 dark:text-amber-400">
                <Info size={13} className="mt-0.5 shrink-0" />
                An absence of {messRebate.minimumDays} days or more is needed to claim.
              </p>
            )}
          </div>
        )}

        <p className="muted mt-6 flex items-start gap-2 border-t pt-5 text-xs leading-relaxed">
          <Info size={13} className="mt-0.5 shrink-0" />
          <span>
            An estimate to plan with, not a sanctioned figure. Applications go to the mess
            council
            {messRebate.noticeDays !== null && `, at least ${messRebate.noticeDays} days before you leave`}
            , and they confirm the final amount.
          </span>
        </p>
      </div>
    </Reveal>
  )
}
