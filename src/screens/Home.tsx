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
  latestDay: number
  isToday: boolean
  entries: Entry[]
  onSave: (entry: Entry) => Promise<void>
  onOpenDay: (dayNumber: number) => void
  onPrev?: () => void
  onNext?: () => void
  onBack?: () => void
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
  latestDay,
  isToday,
  entries,
  onSave,
  onOpenDay,
  onPrev,
  onNext,
  onBack,
  onOpenComplete,
}: Props) {
  const entry = entries.find((item) => item.dayNumber === dayNumber)
  const [activities, setActivities] = useState<DraftActivity[]>(() =>
    toDraft(entry?.activities ?? []),
  )
  const [memo, setMemo] = useState(entry?.memo ?? '')
  const [saved, setSaved] = useState(Boolean(entry))
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
        memo: memo.trim(),
      })
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="shell">
      {onBack ? (
        <button type="button" className="back" onClick={onBack}>
          ←
        </button>
      ) : null}
      <p className="theme">{challenge.theme}</p>
      <div className="day-nav">
        <button
          type="button"
          className="day-nav-btn"
          disabled={!onPrev}
          onClick={onPrev}
          aria-label="前の日"
        >
          ←
        </button>
        <p className="day-label">DAY {dayNumber}</p>
        <button
          type="button"
          className="day-nav-btn"
          disabled={!onNext}
          onClick={onNext}
          aria-label="次の日"
        >
          →
        </button>
      </div>
      <p className="date">{formatDisplayDate(date)}</p>

      <section className="block">
        <h2>{isToday ? '今日やったこと' : 'やったこと'}</h2>
        <ActivityEditor activities={activities} onChange={setActivities} />
      </section>

      <section className="block">
        <h2>メモ</h2>
        <label className="sr-only" htmlFor="memo">
          メモ
        </label>
        <textarea
          id="memo"
          className="memo-input"
          rows={3}
          placeholder=""
          value={memo}
          onChange={(event) => setMemo(event.target.value)}
        />
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

      <ProgressBar current={latestDay} total={TARGET_DAYS} />

      {onOpenComplete ? (
        <button type="button" className="text-link" onClick={onOpenComplete}>
          100 DAYS COMPLETE
        </button>
      ) : null}

      <Timeline
        fromDay={latestDay}
        hideDay={dayNumber}
        entries={entries}
        onOpenDay={onOpenDay}
      />
    </main>
  )
}
