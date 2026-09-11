import type { Entry } from '../types.ts'
import { formatMinutes, totalMinutes } from '../lib.ts'

type Props = {
  fromDay: number
  hideDay?: number
  entries: Entry[]
  onOpenDay: (dayNumber: number) => void
}

export function Timeline({ fromDay, hideDay, entries, onOpenDay }: Props) {
  const days = Array.from({ length: Math.max(fromDay, 0) }, (_, i) => fromDay - i).filter(
    (day) => day !== hideDay,
  )
  if (days.length === 0) return null

  const byDay = new Map(entries.map((entry) => [entry.dayNumber, entry]))

  return (
    <section className="timeline">
      {days.map((day) => {
        const entry = byDay.get(day)
        const minutes = entry ? totalMinutes(entry.activities) : 0
        const summary = entry
          ? entry.activities.map((activity) => activity.text).join(' / ')
          : ''

        return (
          <button
            key={day}
            type="button"
            className={`timeline-item${entry ? '' : ' is-empty'}`}
            onClick={() => onOpenDay(day)}
          >
            <span className="timeline-day">Day {day}</span>
            <span className="timeline-meta">
              {entry ? formatMinutes(minutes) : '—'}
            </span>
            {summary ? <span className="timeline-summary">{summary}</span> : null}
          </button>
        )
      })}
    </section>
  )
}
