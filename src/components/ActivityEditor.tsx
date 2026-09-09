import type { Activity } from '../types.ts'
import { emptyDraft, type DraftActivity } from '../draft.ts'

const CHIPS = [15, 30, 60]

type Props = {
  activities: DraftActivity[]
  onChange: (activities: DraftActivity[]) => void
}

export function ActivityEditor({ activities, onChange }: Props) {
  function update(id: string, patch: Partial<Activity>) {
    onChange(
      activities.map((activity) =>
        activity.id === id ? { ...activity, ...patch } : activity,
      ),
    )
  }

  function remove(id: string) {
    if (activities.length === 1) {
      onChange([emptyDraft()])
      return
    }
    onChange(activities.filter((activity) => activity.id !== id))
  }

  function addRow() {
    onChange([...activities, emptyDraft()])
  }

  function applyChip(minutes: number) {
    const last = activities[activities.length - 1]
    if (!last) return
    update(last.id, { minutes })
  }

  return (
    <div>
      <ul className="activity-list">
        {activities.map((activity) => (
          <li key={activity.id} className="activity-row">
            <input
              className="activity-text"
              type="text"
              placeholder="個人開発"
              value={activity.text}
              autoComplete="off"
              onChange={(event) => update(activity.id, { text: event.target.value })}
            />
            <input
              className="activity-mins"
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="30"
              value={activity.minutes || ''}
              onChange={(event) =>
                update(activity.id, { minutes: Number(event.target.value) || 0 })
              }
            />
            <span className="mins-suffix">分</span>
            <button
              type="button"
              className="icon-btn"
              aria-label="行を削除"
              onClick={() => remove(activity.id)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <div className="editor-actions">
        <button type="button" className="ghost" onClick={addRow}>
          + 行を追加
        </button>
        <div className="chips">
          {CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              className="chip"
              onClick={() => applyChip(chip)}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
