export type Activity = {
  text: string
  minutes: number
}

export type Challenge = {
  theme: string
  startedAt: string
}

export type Entry = {
  dayNumber: number
  date: string
  activities: Activity[]
  memo: string
}
