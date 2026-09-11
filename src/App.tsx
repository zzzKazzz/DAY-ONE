import { useEffect, useState } from 'react'
import { Complete } from './screens/Complete.tsx'
import { Home } from './screens/Home.tsx'
import { Onboarding } from './screens/Onboarding.tsx'
import { getAllEntries, getChallenge, saveChallenge, saveEntry } from './db.ts'
import { TARGET_DAYS, currentDayNumber, todayISO } from './lib.ts'
import type { Challenge, Entry } from './types.ts'

type View =
  | { name: 'home'; dayNumber?: number }
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
  const latestDay = Math.min(Math.max(today, 1), TARGET_DAYS)
  const showComplete =
    view.name === 'complete' ||
    (pastEnd && view.name === 'home' && view.dayNumber == null)

  if (showComplete) {
    return (
      <Complete
        challenge={challenge}
        entries={entries}
        onOpenDay={(day) => setView({ name: 'home', dayNumber: day })}
        onBack={
          today <= TARGET_DAYS ? () => setView({ name: 'home' }) : undefined
        }
      />
    )
  }

  const viewingDay = Math.min(Math.max(view.dayNumber ?? latestDay, 1), latestDay)

  return (
    <Home
      key={viewingDay}
      challenge={challenge}
      dayNumber={viewingDay}
      latestDay={latestDay}
      isToday={!pastEnd && viewingDay === latestDay}
      entries={entries}
      onSave={handleSave}
      onOpenDay={(day) => setView({ name: 'home', dayNumber: day })}
      onPrev={
        viewingDay > 1
          ? () => setView({ name: 'home', dayNumber: viewingDay - 1 })
          : undefined
      }
      onNext={
        viewingDay < latestDay
          ? () => setView({ name: 'home', dayNumber: viewingDay + 1 })
          : undefined
      }
      onBack={pastEnd ? () => setView({ name: 'complete' }) : undefined}
      onOpenComplete={
        today >= TARGET_DAYS && !pastEnd
          ? () => setView({ name: 'complete' })
          : undefined
      }
    />
  )
}
