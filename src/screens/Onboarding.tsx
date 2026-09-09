import { useState } from 'react'

type Props = {
  onStart: (theme: string) => void
}

export function Onboarding({ onStart }: Props) {
  const [theme, setTheme] = useState('')

  return (
    <main className="shell onboarding">
      <p className="eyebrow">DAY 100</p>
      <h1 className="onboarding-title">テーマを決める</h1>
      <label className="sr-only" htmlFor="theme">
        テーマ
      </label>
      <textarea
        id="theme"
        className="theme-input"
        rows={3}
        placeholder="会社員を辞めて、自分で稼げるようになる"
        value={theme}
        onChange={(event) => setTheme(event.target.value)}
        autoFocus
      />
      <button
        type="button"
        className="primary"
        disabled={!theme.trim()}
        onClick={() => onStart(theme.trim())}
      >
        START
      </button>
    </main>
  )
}
