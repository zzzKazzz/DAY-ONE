import type { Challenge, Entry } from '../types.ts'
import {
  dateForDay,
  formatDisplayDate,
  formatMinutes,
  totalMinutes,
} from '../lib.ts'

type Props = {
  challenge: Challenge
  dayNumber: number
  entry?: Entry
  onBack: () => void
}

export function DayDetail({ challenge, dayNumber, entry, onBack }: Props) {
  const date = entry?.date ?? dateForDay(challenge.startedAt, dayNumber)
  const minutes = entry ? totalMinutes(entry.activities) : 0

  return (
    <main className="shell">
      <button type="button" className="back" onClick={onBack}>
        ←
      </button>
      <p className="theme">{challenge.theme}</p>
      <p className="day-label">DAY {dayNumber}</p>
      <p className="date">{formatDisplayDate(date)}</p>

      <section className="block">
        <h2>やったこと</h2>
        {entry ? (
          <ul className="activity-list">
            {entry.activities.map((activity, index) => (
              <li key={`${activity.text}-${index}`} className="activity-row readonly">
                <span>{activity.text}</span>
                <span className="mins">{activity.minutes}分</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty">記録なし</p>
        )}
      </section>

      {entry?.memo ? (
        <section className="block">
          <h2>メモ</h2>
          <p className="memo-text">{entry.memo}</p>
        </section>
      ) : null}

      <section className="block progress-block">
        <h2>Today&apos;s Progress</h2>
        <p className="total">{entry ? formatMinutes(minutes) : '—'}</p>
      </section>
    </main>
  )
}
