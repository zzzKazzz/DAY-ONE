export const TARGET_DAYS = 100

export function todayISO(now = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatISO(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(iso: string, days: number): string {
  const date = parseISODate(iso)
  date.setDate(date.getDate() + days)
  return formatISO(date)
}

export function dayNumberOn(startedAt: string, dateISO: string): number {
  const start = parseISODate(startedAt).getTime()
  const date = parseISODate(dateISO).getTime()
  return Math.floor((date - start) / 86_400_000) + 1
}

export function currentDayNumber(startedAt: string, now = new Date()): number {
  return dayNumberOn(startedAt, todayISO(now))
}

export function dateForDay(startedAt: string, dayNumber: number): string {
  return addDays(startedAt, dayNumber - 1)
}

export function formatDisplayDate(iso: string): string {
  return iso.replaceAll('-', '.')
}

export function formatMinutes(total: number): string {
  if (total <= 0) return '0 min'
  if (total < 60) return `${total} min`
  const hours = Math.floor(total / 60)
  const minutes = total % 60
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

export function totalMinutes(activities: { minutes: number }[]): number {
  return activities.reduce((sum, activity) => sum + activity.minutes, 0)
}
