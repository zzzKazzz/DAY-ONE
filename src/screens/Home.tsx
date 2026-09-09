import { useMemo, useState } from 'react'
import { ActivityEditor } from '../components/ActivityEditor.tsx'
import { ProgressBar } from '../components/ProgressBar.tsx'
import { Timeline } from '../components/Timeline.tsx'
import { toDraft, type DraftActivity } from '../draft.ts'
import type { Challenge, Entry } from '../types.ts'
import {
  TARGET_DAYS,
  dateForDay,
  formatDisplayDate,
  formatMinutes,
  totalMinutes,
} from '../lib.ts'

type Props = {
  challenge: Challenge
  dayNumber: number
  entries: Entry[]
  onSave: (entry: Entry) => Promise<void>
  onOpenDay: (dayNumber: number) => void
  onOpenComplete?: () => void
}

function toValid(activities: DraftActivity[]) {
  return activities.filter(
    (activity) => activity.text.trim() && activity.minutes > 0,
  )
}

export function Home({
  challenge,
  dayNumber,
  entries,
  onSave,
  onOpenDay,
  onOpenComplete,
}: Props) {
  const todayEntry = entries.find((entry) => entry.dayNumber === dayNumber)
  const [activities, setActivities] = useState<DraftActivity[]>(() =>
    toDraft(todayEntry?.activities ?? []),
  )
  const [saved, setSaved] = useState(Boolean(todayEntry))
  const [saving, setSaving] = useState(false)

  const validActivities = useMemo(() => toValid(activities), [activities])
  const minutes = totalMinutes(validActivities)
  const date = dateForDay(challenge.startedAt, dayNumber)
  const canSave = validActivities.length > 0

  async function handleSave() {
    if (!canSave || saving) return
    setSaving(true)
    try {
      await onSave({
        dayNumber,
        date,
        activities: validActivities.map((activity) => ({
          text: activity.text.trim(),
          minutes: activity.minutes,
        })),
      })
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="shell">
      <p className="theme">{challenge.theme}</p>
      <p className="day-label">DAY {dayNumber}</p>
      <p className="date">{formatDisplayDate(date)}</p>

      <section className="block">
        <h2>今日やったこと</h2>
        <ActivityEditor activities={activities} onChange={setActivities} />
      </section>

      <section className="block progress-block">
        <h2>Today&apos;s Progress</h2>
        <p className="total">{formatMinutes(minutes)}</p>
      </section>

      <button
        type="button"
        className="primary"
        disabled={!canSave || saving}
        onClick={() => void handleSave()}
      >
        {saved ? '更新する' : '記録する'}
      </button>
      {saved ? <p className="saved">記録した</p> : null}

      <ProgressBar current={Math.min(dayNumber, TARGET_DAYS)} total={TARGET_DAYS} />

      {onOpenComplete ? (
        <button type="button" className="text-link" onClick={onOpenComplete}>
          100 DAYS COMPLETE
        </button>
      ) : null}

      <Timeline
        fromDay={dayNumber - 1}
        entries={entries}
        onOpenDay={onOpenDay}
      />
    </main>
  )
}
