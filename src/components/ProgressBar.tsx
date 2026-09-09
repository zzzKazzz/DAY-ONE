type Props = {
  current: number
  total: number
}

export function ProgressBar({ current, total }: Props) {
  const pct = Math.min(100, Math.round((current / total) * 100))

  return (
    <section className="progress">
      <p className="progress-caption">
        {current} / {total}日
      </p>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <span className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </section>
  )
}
