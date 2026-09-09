import type { Activity } from './types.ts'

export type DraftActivity = Activity & { id: string }

export function emptyDraft(): DraftActivity {
  return { id: crypto.randomUUID(), text: '', minutes: 0 }
}

export function toDraft(activities: Activity[]): DraftActivity[] {
  if (activities.length === 0) return [emptyDraft()]
  return activities.map((activity) => ({ ...activity, id: crypto.randomUUID() }))
}
