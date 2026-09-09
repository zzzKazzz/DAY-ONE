import type { Entry } from '../types.ts'
import { formatMinutes, totalMinutes } from '../lib.ts'

type Props = {
  fromDay: number
  entries: Entry[]
  onOpenDay: (dayNumber: number) => void
}

export function Timeline({ fromDay, entries, onOpenDay }: Props) {
  if (fromDay < 1) return null

  const byDay = new Map(entries.map((entry) => [entry.dayNumber, entry]))
  const days = Array.from({ length: fromDay }, (_, i) => fromDay - i)

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
