import { useEffect, useState } from 'react'
import { Complete } from './screens/Complete.tsx'
import { DayDetail } from './screens/DayDetail.tsx'
import { Home } from './screens/Home.tsx'
import { Onboarding } from './screens/Onboarding.tsx'
import { getAllEntries, getChallenge, saveChallenge, saveEntry } from './db.ts'
import { TARGET_DAYS, currentDayNumber, todayISO } from './lib.ts'
import type { Challenge, Entry } from './types.ts'

type View =
  | { name: 'home' }
  | { name: 'day'; dayNumber: number }
  | { name: 'complete' }

export default function App() {
  const [ready, setReady] = useState(false)
  const [challenge, setChallenge] = useState<Challenge | undefined>()
  const [entries, setEntries] = useState<Entry[]>([])
  const [view, setView] = useState<View>({ name: 'home' })

  useEffect(() => {
    void (async () => {
      try {
        const [loadedChallenge, loadedEntries] = await Promise.all([
          getChallenge(),
          getAllEntries(),
        ])
        setChallenge(loadedChallenge)
        setEntries(loadedEntries)
      } catch (error) {
        console.error(error)
      } finally {
        setReady(true)
      }
    })()
  }, [])

  async function handleStart(theme: string) {
    const next: Challenge = { theme, startedAt: todayISO() }
    await saveChallenge(next)
    setChallenge(next)
    setView({ name: 'home' })
  }

  async function handleSave(entry: Entry) {
    await saveEntry(entry)
    setEntries((current) => {
      const rest = current.filter((item) => item.dayNumber !== entry.dayNumber)
      return [...rest, entry]
    })
  }

  if (!ready) {
    return (
      <main className="shell boot">
        <p className="eyebrow">DAY 100</p>
      </main>
    )
  }

  if (!challenge) {
    return <Onboarding onStart={(theme) => void handleStart(theme)} />
  }

  const today = currentDayNumber(challenge.startedAt)
  const pastEnd = today > TARGET_DAYS
  const dayNumber = Math.min(Math.max(today, 1), TARGET_DAYS)

  if (view.name === 'day') {
    return (
      <DayDetail
        challenge={challenge}
        dayNumber={view.dayNumber}
        entry={entries.find((entry) => entry.dayNumber === view.dayNumber)}
        onBack={() =>
          setView(pastEnd ? { name: 'complete' } : { name: 'home' })
        }
      />
    )
  }

  if (view.name === 'complete' || pastEnd) {
    return (
      <Complete
        challenge={challenge}
        entries={entries}
        onOpenDay={(day) => setView({ name: 'day', dayNumber: day })}
        onBack={
          today <= TARGET_DAYS ? () => setView({ name: 'home' }) : undefined
        }
      />
    )
  }

  return (
    <Home
      challenge={challenge}
      dayNumber={dayNumber}
      entries={entries}
      onSave={handleSave}
      onOpenDay={(day) => setView({ name: 'day', dayNumber: day })}
      onOpenComplete={
        today >= TARGET_DAYS ? () => setView({ name: 'complete' }) : undefined
      }
    />
  )
}
