import { ProgressBar } from '../components/ProgressBar.tsx'
import { Timeline } from '../components/Timeline.tsx'
import type { Challenge, Entry } from '../types.ts'
import { TARGET_DAYS, formatMinutes, totalMinutes } from '../lib.ts'

type Props = {
  challenge: Challenge
  entries: Entry[]
  onOpenDay: (dayNumber: number) => void
  onBack?: () => void
}

export function Complete({ challenge, entries, onOpenDay, onBack }: Props) {
  const grandTotal = entries.reduce(
    (sum, entry) => sum + totalMinutes(entry.activities),
    0,
  )
  const activeDays = entries.filter(
    (entry) => totalMinutes(entry.activities) > 0,
  ).length

  return (
    <main className="shell">
      {onBack ? (
        <button type="button" className="back" onClick={onBack}>
          ←
        </button>
      ) : null}
      <p className="theme">{challenge.theme}</p>
      <p className="complete-kicker">DAY 100</p>
      <h1 className="complete-title">100 DAYS COMPLETE</h1>

      <section className="block progress-block">
        <h2>Total</h2>
        <p className="total">{formatMinutes(grandTotal)}</p>
        <p className="complete-meta">100日中 {activeDays}日活動</p>
      </section>

      <ProgressBar current={TARGET_DAYS} total={TARGET_DAYS} />

      <Timeline fromDay={TARGET_DAYS} entries={entries} onOpenDay={onOpenDay} />
    </main>
  )
}
